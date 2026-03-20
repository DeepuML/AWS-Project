"""
schemas.py — Pydantic Request/Response Schemas

Defines the data shapes that FastAPI uses to validate incoming request bodies
and serialize outgoing responses. Pydantic enforces type checking and provides
automatic OpenAPI documentation for each endpoint.

Schema hierarchy:
  FlexFitEntryBase   — shared fields used by both input and output schemas
  FlexFitEntryCreate — used for POST and PUT request bodies (no read-only fields)
  FlexFitEntry       — used for API responses (includes id, created_at, updated_at)
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class FlexFitEntryBase(BaseModel):
    """Shared fields common to both the creation and read schemas."""

    location: str                        # Name of the gym or workout location
    temperature: float                   # Ambient temperature at the time of the entry
    humidity: float                      # Relative humidity at the time of the entry (%)
    pressure: float                      # Atmospheric pressure at the time of the entry (hPa)
    fitness_description: str             # Description of the workout or fitness activity
    notes: Optional[str] = None          # Optional additional notes or observations


class FlexFitEntryCreate(FlexFitEntryBase):
    """
    Schema for creating or updating a fitness entry (POST / PUT request body).

    Inherits all fields from FlexFitEntryBase. No additional fields are required
    for creation — the database automatically assigns `id`, `created_at`, and `updated_at`.
    """
    pass


class FlexFitEntry(FlexFitEntryBase):
    """
    Schema for reading a fitness entry (API response body).

    Extends the base schema with read-only fields that are populated by the
    database after the record is persisted.
    """

    id: int                              # Auto-incremented primary key
    created_at: datetime                 # Timestamp when the record was first created
    updated_at: Optional[datetime] = None  # Timestamp of the most recent update (None if never updated)

    class Config:
        # Allow SQLAlchemy ORM model instances to be used directly as Pydantic models.
        orm_mode = True