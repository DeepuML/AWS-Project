"""
main.py — FlexFit FastAPI Application Entry Point

Defines the FastAPI application instance, configures middleware, and registers
all REST API route handlers for the /flex-fit resource.
"""

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from . import crud, models, schemas
from .database import engine, get_db

# Automatically create all database tables defined in models if they do not already exist.
# In production, prefer Alembic migrations over auto-creation.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FlexFit API",
    description="REST API for managing FlexFit gym member fitness entries.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS Middleware
# ---------------------------------------------------------------------------
# Allow all origins in development. In production, replace "*" with the
# specific frontend origin (e.g. the S3 website endpoint or a custom domain).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"])
def read_root():
    """Return a simple health-check message to confirm the API is running."""
    return {"message": "Welcome to the Flex Fit API"}


# ---------------------------------------------------------------------------
# Fitness Entry Endpoints
# ---------------------------------------------------------------------------

@app.post("/flex-fit/", response_model=schemas.FlexFitEntry, status_code=201, tags=["Fitness Entries"])
def create_flex_fit_entry(flex_fit_entry: schemas.FlexFitEntryCreate, db: Session = Depends(get_db)):
    """
    Create a new fitness entry.

    Accepts workout location, environmental conditions (temperature, humidity,
    pressure), a fitness description, and optional notes.
    """
    return crud.create_flex_fit_entry(db=db, flex_fit_entry=flex_fit_entry)


@app.get("/flex-fit/", response_model=List[schemas.FlexFitEntry], tags=["Fitness Entries"])
def read_flex_fit_entries(
    skip: int = 0,
    limit: int = 100,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve a paginated list of fitness entries.

    Optionally filter results by `location`. Use `skip` and `limit` for
    pagination (e.g. skip=0&limit=20 for the first page of 20 results).
    """
    if location:
        return crud.get_flex_fit_entries_by_location(db, location=location, skip=skip, limit=limit)
    return crud.get_flex_fit_entries(db, skip=skip, limit=limit)


@app.get("/flex-fit/{entry_id}", response_model=schemas.FlexFitEntry, tags=["Fitness Entries"])
def read_flex_fit_entry(entry_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single fitness entry by its ID.

    Returns 404 if no entry with the given ID exists.
    """
    db_entry = crud.get_flex_fit_entry(db, entry_id=entry_id)
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Flex Fit entry not found")
    return db_entry


@app.put("/flex-fit/{entry_id}", response_model=schemas.FlexFitEntry, tags=["Fitness Entries"])
def update_flex_fit_entry(entry_id: int, flex_fit_entry: schemas.FlexFitEntryCreate, db: Session = Depends(get_db)):
    """
    Update an existing fitness entry by its ID.

    All fields are replaced with the values provided in the request body.
    Returns 404 if no entry with the given ID exists.
    """
    db_entry = crud.update_flex_fit_entry(db, entry_id=entry_id, flex_fit_entry=flex_fit_entry)
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Flex Fit entry not found")
    return db_entry


@app.delete("/flex-fit/{entry_id}", response_model=bool, tags=["Fitness Entries"])
def delete_flex_fit_entry(entry_id: int, db: Session = Depends(get_db)):
    """
    Delete a fitness entry by its ID.

    Returns `true` on successful deletion, or 404 if no entry with the
    given ID exists.
    """
    success = crud.delete_flex_fit_entry(db, entry_id=entry_id)
    if not success:
        raise HTTPException(status_code=404, detail="Flex Fit entry not found")
    return success