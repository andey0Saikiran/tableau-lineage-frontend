# Running Tableau Lineage Visualizer

This guide will help you run both the backend (FastAPI) and frontend (Next.js) servers.

## Prerequisites

- **Backend**: Python 3.9+ (currently using 3.8.2, but 3.9+ recommended)
- **Frontend**: Node.js 16+ and npm
- Both services must run simultaneously

## Quick Start

### 1. Start the Backend (Terminal 1)

```bash
# Navigate to backend directory
cd /Users/andeysaikiran/Desktop/tableau-lineage/backend

# Activate virtual environment
source .venv/bin/activate

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

The backend will be available at: **http://localhost:8000**

#### Backend Health Check
Visit http://localhost:8000/health in your browser to verify it's running.

### 2. Start the Frontend (Terminal 2)

```bash
# Navigate to frontend directory
cd /Users/andeysaikiran/Desktop/tableau-lineage/frontend

# Install dependencies (if not already installed)
npm install

# Start the Next.js development server
npm run dev
```

The frontend will be available at: **http://localhost:3000**

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Production Build

### Frontend Production Build

```bash
cd /Users/andeysaikiran/Desktop/tableau-lineage/frontend
npm run build
npm start
```

### Backend Production with Gunicorn

```bash
cd /Users/andeysaikiran/Desktop/tableau-lineage/backend
source .venv/bin/activate
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Common Issues

### Issue: Port Already in Use

If you see "Address already in use" errors:

**Backend (port 8000):**
```bash
# Find and kill the process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
uvicorn main:app --reload --port 8001
# Then update frontend/.env.local: NEXT_PUBLIC_API_URL=http://localhost:8001
```

**Frontend (port 3000):**
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Issue: Python Version Warning

The backend virtual environment uses Python 3.8.2, but Python 3.9+ is recommended for better performance and security.

**To recreate with newer Python:**
```bash
cd /Users/andeysaikiran/Desktop/tableau-lineage/backend

# Deactivate current venv if active
deactivate

# Remove old venv
rm -rf .venv

# Create new venv with system Python (3.9.6)
python3 -m venv .venv

# Activate and reinstall
source .venv/bin/activate
pip install -r requirements.txt
```

### Issue: Backend Not Found

Make sure the backend URL in frontend matches your backend port:
- Check `frontend/.env.local`: should have `NEXT_PUBLIC_API_URL=http://localhost:8000`
- The frontend `constants.ts` now reads from this environment variable

## Environment Variables

### Backend
No environment variables required for basic operation.

### Frontend
Create or verify `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## File Structure

```
tableau-lineage/
├── backend/
│   ├── main.py              # FastAPI application entry
│   ├── requirements.txt     # Python dependencies
│   ├── lineage/             # Extraction logic
│   ├── analytics/           # Analytics tracking
│   └── .venv/               # Python virtual environment
│
└── frontend/
    ├── package.json         # Node dependencies
    ├── .env.local           # Environment configuration
    ├── app/                 # Next.js app directory
    │   ├── page.tsx         # Main page
    │   ├── components/      # React components
    │   └── lib/             # Utilities and API calls
    └── node_modules/        # Node dependencies
```

## Testing

### Test Backend Upload
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@/path/to/your/workbook.twbx"
```

### Test Frontend Build
```bash
cd frontend
npm run build
```

## Logs and Debugging

### Backend Logs
FastAPI logs appear in the terminal where you ran `uvicorn`. Look for:
- ✅ Successful uploads
- ❌ Error messages with stack traces
- 🚀 Startup messages

### Frontend Logs
- Browser console (F12) for client-side errors
- Terminal where you ran `npm run dev` for server-side rendering errors

## Recent Fixes Applied

✅ Fixed API URL mismatch (now uses environment variable)
✅ Fixed Next.js metadata viewport warning
✅ Re-enabled React Strict Mode for better development experience
✅ Made console logging conditional (only in development)
✅ **Fixed backend caching issue** - Each upload now uses fresh extractor instance
✅ Cleaned up build warnings

## Need Help?

If you encounter issues not covered here, check:
1. Terminal output for error messages
2. Browser console (F12) for frontend errors
3. Backend logs for API errors
4. Ensure both services are running simultaneously
