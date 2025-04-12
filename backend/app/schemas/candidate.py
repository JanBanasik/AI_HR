from pydantic import BaseModel
from typing import Optional

class CandidateCreate(BaseModel):
    first_name: str
    last_name: str

class CandidateUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class CandidateResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
