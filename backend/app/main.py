from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from . import crud, models, schemas
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Flex Fit API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Flex Fit API"}

@app.post("/flex-fit/", response_model=schemas.FlexFitEntry)
def create_flex_fit_entry(flex_fit_entry: schemas.FlexFitEntryCreate, db: Session = Depends(get_db)):
    return crud.create_flex_fit_entry(db=db, flex_fit_entry=flex_fit_entry)

@app.get("/flex-fit/", response_model=List[schemas.FlexFitEntry])
def read_flex_fit_entries(
    skip: int = 0, 
    limit: int = 100, 
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    if location:
        return crud.get_flex_fit_entries_by_location(db, location=location, skip=skip, limit=limit)
    return crud.get_flex_fit_entries(db, skip=skip, limit=limit)

@app.get("/flex-fit/{entry_id}", response_model=schemas.FlexFitEntry)
def read_flex_fit_entry(entry_id: int, db: Session = Depends(get_db)):
    db_entry = crud.get_flex_fit_entry(db, entry_id=entry_id)
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Flex Fit entry not found")
    return db_entry

@app.put("/flex-fit/{entry_id}", response_model=schemas.FlexFitEntry)
def update_flex_fit_entry(entry_id: int, flex_fit_entry: schemas.FlexFitEntryCreate, db: Session = Depends(get_db)):
    db_entry = crud.update_flex_fit_entry(db, entry_id=entry_id, flex_fit_entry=flex_fit_entry)
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Flex Fit entry not found")
    return db_entry

@app.delete("/flex-fit/{entry_id}", response_model=bool)
def delete_flex_fit_entry(entry_id: int, db: Session = Depends(get_db)):
    success = crud.delete_flex_fit_entry(db, entry_id=entry_id)
    if not success:
        raise HTTPException(status_code=404, detail="Flex Fit entry not found")
    return success