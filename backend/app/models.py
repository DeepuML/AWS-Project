"""
models.py — SQLAlchemy ORM Models

Defines the database table schemas as Python classes. Each class maps directly
to a table in the PostgreSQL database. SQLAlchemy uses these definitions to
auto-create tables (via `metadata.create_all`) and to build type-safe queries.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from .database import Base


class FlexFitEntry(Base):
    """
    Represents a single gym member fitness entry record.

    Stores workout metadata including the location, environmental conditions
    at the time of the workout (temperature, humidity, pressure), a description
    of the fitness activity performed, and optional free-text notes.
    """

    __tablename__ = "flex_fit_entries"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, index=True)           # Gym or workout location (indexed for fast filtering)
    temperature = Column(Float)                      # Ambient temperature (°C or °F)
    humidity = Column(Float)                         # Relative humidity (%)
    pressure = Column(Float)                         # Atmospheric pressure (hPa)
    fitness_description = Column(String)             # Description of the workout activity
    notes = Column(Text, nullable=True)              # Optional free-text notes
    created_at = Column(DateTime(timezone=True), server_default=func.now())   # Auto-set on insert
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())         # Auto-set on update