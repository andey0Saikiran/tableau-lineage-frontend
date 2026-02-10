"""
Pydantic models for Tableau Lineage API
Matching notebook v3.0 structure exactly
"""
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import List, Optional
from datetime import datetime
import re


class CalculatedField(BaseModel):
    """Represents a calculated field with its lineage - MATCHING NOTEBOOK"""
    datasource: str = Field(..., description="Data source name")
    field_name: str = Field(..., description="Field display name")
    formula: str = Field(..., description="Calculation formula")
    ingredients: List[str] = Field(default_factory=list, description="Dependent fields (non-parameters)")
    parameter_dependencies: List[str] = Field(default_factory=list, description="Dependent parameters")
    field_type: str = Field(default='calculated', description="Field type: calculated, lod, table_calc, raw")
    is_table_calc: bool = Field(default=False, description="Is this a table calculation")
    lod_type: Optional[str] = Field(default=None, description="LOD type: FIXED, INCLUDE, EXCLUDE, or None")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "datasource": "Sales Data",
                "field_name": "Profit Ratio",
                "formula": "SUM([Profit])/SUM([Sales])",
                "ingredients": ["Profit", "Sales"],
                "parameter_dependencies": [],
                "field_type": "calculated",
                "is_table_calc": False,
                "lod_type": None
            }
        }
    )


class Parameter(BaseModel):
    """Represents a Tableau parameter"""
    name: str = Field(..., description="Parameter display name")
    internal_name: str = Field(..., description="Internal parameter ID")
    value: str = Field(default="", description="Current parameter value")
    datatype: str = Field(default="string", description="Parameter data type")
    allowed_values: Optional[List[dict]] = Field(default=None, description="List of allowed values")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Year Parameter",
                "internal_name": "[Parameter 1]",
                "value": "2024",
                "datatype": "string",
                "allowed_values": None
            }
        }
    )


class LineageStats(BaseModel):
    """Statistics about the uploaded workbook"""
    datasources: int = Field(..., description="Number of unique data sources")
    calculated_fields: int = Field(..., description="Number of calculated fields")
    raw_fields: int = Field(..., description="Number of raw/direct fields")
    parameters: int = Field(default=0, description="Number of parameters")
    lod_fields: int = Field(default=0, description="Number of LOD calculations")
    table_calcs: int = Field(default=0, description="Number of table calculations")
    total_fields: int = Field(..., description="Total fields processed")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "datasources": 3,
                "calculated_fields": 45,
                "raw_fields": 120,
                "parameters": 5,
                "lod_fields": 8,
                "table_calcs": 12,
                "total_fields": 165
            }
        }
    )


class UploadResponse(BaseModel):
    """Response from upload endpoint"""
    stats: LineageStats
    html: str = Field(..., description="Generated HTML visualization")
    filename: str = Field(..., description="Original filename")
    processed_at: datetime = Field(default_factory=datetime.utcnow)


class TrackingEvent(BaseModel):
    """Analytics tracking event with input validation"""
    event: str = Field(..., min_length=1, max_length=100)
    value: Optional[str] = Field(None, max_length=500)

    @field_validator('event')
    @classmethod
    def validate_event(cls, v: str) -> str:
        """Validate event name contains only safe characters"""
        if not re.match(r'^[a-zA-Z0-9_\-\.]+$', v):
            raise ValueError('Event name must contain only alphanumeric characters, underscores, hyphens, and dots')
        return v.strip()

    @field_validator('value')
    @classmethod
    def validate_value(cls, v: Optional[str]) -> Optional[str]:
        """Sanitize value to prevent injection"""
        if v is None:
            return None
        # Remove potentially dangerous characters
        sanitized = v.strip()
        # Limit to printable ASCII and common unicode characters
        if not all(c.isprintable() or c.isspace() for c in sanitized):
            raise ValueError('Value contains invalid characters')
        return sanitized

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "event": "node_clicked",
                "value": "Profit Ratio"
            }
        }
    )


class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str
    detail: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

    model_config = ConfigDict(json_encoders={datetime: lambda v: v.isoformat()})
