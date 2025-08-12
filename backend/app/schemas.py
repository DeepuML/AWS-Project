from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FlexFitEntryBase(BaseModel):
    location: str
    temperature: float
    humidity: float
    pressure: float
    fitness_description: str
    notes: Optional[str] = None

class FlexFitEntryCreate(FlexFitEntryBase):
    pass

class FlexFitEntry(FlexFitEntryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True