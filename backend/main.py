"""
Tableau Lineage Backend - Production FastAPI Server
Optimized with async operations, comprehensive error handling, and file cleanup
"""
from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
import shutil
import tempfile
import hashlib
import logging
from pathlib import Path
from typing import Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

from lineage import (
    TableauExtractor,
    HTMLGenerator,
    TableauExtractionError,
    HTMLGeneratorError,
    LineageStats,
)
from lineage.models import TrackingEvent, ErrorResponse
from analytics import AnalyticsTracker


# Configuration
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE_MB", "100")) * 1024 * 1024
ALLOWED_EXTENSIONS = {".twbx"}
TEMP_DIR = Path(tempfile.gettempdir()) / "tableau_uploads"
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", None)  # Set in production

# Rate limiting
limiter = Limiter(key_func=get_remote_address)

# Global instances (tracker and html_generator are stateless)
html_generator = HTMLGenerator()
tracker = AnalyticsTracker()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle manager for FastAPI app
    Handles startup and shutdown tasks
    """
    # Startup
    logger.info("🚀 Starting Tableau Lineage Backend...")

    # Initialize analytics database
    await tracker.init_db()
    logger.info("✅ Analytics database initialized")

    # Create temp directory
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    logger.info(f"✅ Temp directory created: {TEMP_DIR}")

    yield

    # Shutdown
    logger.info("🛑 Shutting down Tableau Lineage Backend...")

    # Cleanup temp files
    if TEMP_DIR.exists():
        shutil.rmtree(TEMP_DIR, ignore_errors=True)
        logger.info("✅ Temp files cleaned up")


# Initialize FastAPI app
app = FastAPI(
    title="Tableau Lineage API",
    description="Extract and visualize Tableau workbook metadata and field lineage",
    version="2.0.0",
    lifespan=lifespan,
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Middleware
# Configure CORS - use environment variable for allowed origins
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["POST", "GET"],  # Only allow necessary methods
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["X-Datasources", "X-Calculated", "X-Raw", "X-Parameters", "X-LOD", "X-Total"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)


# Utility functions
def hash_ip(ip: str) -> str:
    """Hash IP address for privacy-preserving analytics"""
    return hashlib.sha256(ip.encode()).hexdigest()[:16]


def verify_admin_key(x_api_key: Optional[str] = Header(None)) -> bool:
    """Verify admin API key from header"""
    if not ADMIN_API_KEY:
        # If no key is set, allow access (development mode)
        return True
    if not x_api_key:
        raise HTTPException(
            status_code=401,
            detail="Missing API key. Provide X-API-Key header."
        )
    if x_api_key != ADMIN_API_KEY:
        raise HTTPException(
            status_code=403,
            detail="Invalid API key"
        )
    return True


async def save_upload(file: UploadFile) -> Path:
    """
    Save uploaded file to temp directory with validation

    Args:
        file: Uploaded file object

    Returns:
        Path to saved file

    Raises:
        HTTPException: If file validation fails
    """
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Only {', '.join(ALLOWED_EXTENSIONS)} files are allowed."
        )

    # Check file size (read in chunks to avoid memory issues)
    file_size = 0
    chunk_size = 1024 * 1024  # 1MB chunks

    # Create unique temp file
    temp_file = TEMP_DIR / f"{os.urandom(16).hex()}_{file.filename}"

    try:
        with open(temp_file, "wb") as f:
            while chunk := await file.read(chunk_size):
                file_size += len(chunk)

                if file_size > MAX_FILE_SIZE:
                    temp_file.unlink(missing_ok=True)
                    raise HTTPException(
                        status_code=413,
                        detail=f"File too large. Maximum size is {MAX_FILE_SIZE / (1024*1024):.0f}MB"
                    )

                f.write(chunk)

        return temp_file

    except Exception as e:
        # Cleanup on error
        temp_file.unlink(missing_ok=True)
        raise


def cleanup_file(file_path: Path):
    """Safely delete temporary file"""
    try:
        if file_path.exists():
            file_path.unlink()
    except Exception as e:
        logger.warning(f"Failed to cleanup {file_path}: {e}")


# API Endpoints

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Tableau Lineage API",
        "version": "2.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    try:
        # Check if DB is accessible
        await tracker.init_db()
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy",
        "database": db_status,
        "temp_dir": str(TEMP_DIR),
        "temp_dir_exists": TEMP_DIR.exists()
    }


@app.post("/upload", response_class=HTMLResponse)
@limiter.limit("10/minute")  # Max 10 uploads per minute per IP
async def upload_workbook(
    request: Request,
    file: UploadFile = File(...)
):
    """
    Upload and process Tableau workbook

    Args:
        file: .twbx file upload

    Returns:
        HTML visualization with metadata headers

    Raises:
        HTTPException: On validation or processing errors
    """
    temp_file = None

    try:
        # Track upload start
        client_ip = request.client.host
        user_agent = request.headers.get("user-agent", "unknown")

        await tracker.track_event(
            event="upload_start",
            value=file.filename,
            ip_hash=hash_ip(client_ip),
            user_agent=user_agent
        )

        # Save uploaded file
        temp_file = await save_upload(file)

        # Create fresh extractor instance for each request to avoid state pollution
        extractor = TableauExtractor(max_workers=4)

        # Extract metadata asynchronously
        metadata = await extractor.extract_metadata_async(str(temp_file))

        if not metadata:
            raise HTTPException(
                status_code=400,
                detail="No calculated fields found in workbook"
            )

        # Extract parameters
        parameters = extractor.get_parameters()

        # Compute statistics
        stats_dict = extractor.compute_stats(metadata)
        stats = LineageStats(**stats_dict)

        # Generate HTML visualization with parameters
        html = html_generator.generate(metadata, filename=file.filename, parameters=parameters)

        # Explicitly cleanup extractor
        del extractor

        # Track successful upload
        await tracker.track_event(
            event="upload_success",
            value=f"{file.filename}|{stats.calculated_fields}",
            ip_hash=hash_ip(client_ip),
            user_agent=user_agent
        )

        # Return HTML with stats headers
        return HTMLResponse(
            content=html,
            headers={
                "X-Datasources": str(stats.datasources),
                "X-Calculated": str(stats.calculated_fields),
                "X-Raw": str(stats.raw_fields),
                "X-Parameters": str(stats.parameters),
                "X-LOD": str(stats.lod_fields),
                "X-Total": str(stats.total_fields),
            }
        )

    except TableauExtractionError as e:
        await tracker.track_event("upload_error", f"extraction:{str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

    except HTMLGeneratorError as e:
        await tracker.track_event("upload_error", f"generation:{str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    except HTTPException:
        raise  # Re-raise HTTP exceptions as-is

    except Exception as e:
        await tracker.track_event("upload_error", f"unexpected:{str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

    finally:
        # Always cleanup temp file
        if temp_file:
            cleanup_file(temp_file)


@app.post("/track")
@limiter.limit("30/minute")  # Max 30 tracking events per minute per IP
async def track_analytics(
    event: TrackingEvent,
    request: Request
):
    """
    Track analytics events from frontend

    Args:
        event: Event data (event name and optional value)

    Returns:
        Success confirmation
    """
    try:
        client_ip = request.client.host
        user_agent = request.headers.get("user-agent", "unknown")

        await tracker.track_event(
            event=event.event,
            value=event.value,
            ip_hash=hash_ip(client_ip),
            user_agent=user_agent
        )

        return {"status": "tracked", "event": event.event}

    except Exception as e:
        # Don't fail requests on tracking errors
        logger.error(f"Tracking error: {e}")
        return {"status": "failed", "error": str(e)}


@app.get("/stats")
@limiter.limit("10/minute")
async def get_analytics_stats(
    request: Request,
    event_type: Optional[str] = None,
    x_api_key: Optional[str] = Header(None)
):
    """
    Get analytics statistics (admin endpoint - requires API key)

    Args:
        request: FastAPI request object (required for rate limiting)
        event_type: Optional filter by event type
        x_api_key: Admin API key (header)

    Returns:
        Event statistics
    """
    # Verify authentication
    verify_admin_key(x_api_key)
    try:
        counts = await tracker.get_event_counts()

        if event_type:
            events = await tracker.get_stats(event_type=event_type, limit=100)
        else:
            events = []

        return {
            "event_counts": counts,
            "recent_events": events[:10]  # Only return 10 most recent
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Error handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    """Custom 404 handler"""
    return JSONResponse(
        status_code=404,
        content=ErrorResponse(
            error="Not Found",
            detail=f"Path {request.url.path} not found"
        ).model_dump()
    )


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    """Custom 500 handler"""
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal Server Error",
            detail="An unexpected error occurred"
        ).model_dump()
    )