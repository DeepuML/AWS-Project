from sqlalchemy.orm import Session
from . import models, schemas

def get_flex_fit_entries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.FlexFitEntry).offset(skip).limit(limit).all()

def get_flex_fit_entry(db: Session, entry_id: int):
    return db.query(models.FlexFitEntry).filter(models.FlexFitEntry.id == entry_id).first()

def get_flex_fit_entries_by_location(db: Session, location: str, skip: int = 0, limit: int = 100):
    return db.query(models.FlexFitEntry).filter(models.FlexFitEntry.location == location).offset(skip).limit(limit).all()

def create_flex_fit_entry(db: Session, flex_fit_entry: schemas.FlexFitEntryCreate):
    db_entry = models.FlexFitEntry(**flex_fit_entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def update_flex_fit_entry(db: Session, entry_id: int, flex_fit_entry: schemas.FlexFitEntryCreate):
    db_entry = db.query(models.FlexFitEntry).filter(models.FlexFitEntry.id == entry_id).first()
    if db_entry:
        for key, value in flex_fit_entry.dict().items():
            setattr(db_entry, key, value)
        db.commit()
        db.refresh(db_entry)
    return db_entry

def delete_flex_fit_entry(db: Session, entry_id: int):
    db_entry = db.query(models.FlexFitEntry).filter(models.FlexFitEntry.id == entry_id).first()
    if db_entry:
        db.delete(db_entry)
        db.commit()
        return True
    return False