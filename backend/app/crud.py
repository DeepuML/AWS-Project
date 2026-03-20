"""
crud.py — Database CRUD Operations

Provides helper functions that perform Create, Read, Update, and Delete
operations against the FlexFitEntry table using a SQLAlchemy session.
All functions receive a `db` session injected by FastAPI's dependency system.
"""

from sqlalchemy.orm import Session
from . import models, schemas


def get_flex_fit_entries(db: Session, skip: int = 0, limit: int = 100):
    """Return a paginated list of all fitness entries, ordered by primary key."""
    return db.query(models.FlexFitEntry).offset(skip).limit(limit).all()


def get_flex_fit_entry(db: Session, entry_id: int):
    """Return a single fitness entry by its primary key, or None if not found."""
    return db.query(models.FlexFitEntry).filter(models.FlexFitEntry.id == entry_id).first()


def get_flex_fit_entries_by_location(db: Session, location: str, skip: int = 0, limit: int = 100):
    """Return a paginated list of fitness entries filtered by an exact location match."""
    return (
        db.query(models.FlexFitEntry)
        .filter(models.FlexFitEntry.location == location)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_flex_fit_entry(db: Session, flex_fit_entry: schemas.FlexFitEntryCreate):
    """
    Persist a new fitness entry to the database.

    Converts the Pydantic schema to a SQLAlchemy model instance, commits the
    transaction, and refreshes the instance to populate auto-generated fields
    such as `id` and `created_at`.
    """
    db_entry = models.FlexFitEntry(**flex_fit_entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def update_flex_fit_entry(db: Session, entry_id: int, flex_fit_entry: schemas.FlexFitEntryCreate):
    """
    Update all fields of an existing fitness entry.

    Looks up the entry by primary key and overwrites every field with the
    values from the provided schema. Returns None if the entry does not exist.
    """
    db_entry = db.query(models.FlexFitEntry).filter(models.FlexFitEntry.id == entry_id).first()
    if db_entry:
        for key, value in flex_fit_entry.dict().items():
            setattr(db_entry, key, value)
        db.commit()
        db.refresh(db_entry)
    return db_entry


def delete_flex_fit_entry(db: Session, entry_id: int):
    """
    Delete a fitness entry by its primary key.

    Returns True on successful deletion, or False if the entry was not found.
    """
    db_entry = db.query(models.FlexFitEntry).filter(models.FlexFitEntry.id == entry_id).first()
    if db_entry:
        db.delete(db_entry)
        db.commit()
        return True
    return False