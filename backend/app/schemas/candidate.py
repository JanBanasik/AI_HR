from pydantic import BaseModel, Field
from typing import Optional


class CandidateCreate(BaseModel):
    cv: Optional[dict] = Field(None)
    github: Optional[dict] = Field(None)
    x: Optional[dict] = Field(None)


class CandidateUpdate(BaseModel):
    cv: Optional[dict] = Field(None)
    github: Optional[dict] = Field(None)
    x: Optional[dict] = Field(None)


class CandidateResponse(BaseModel):
    id: str
    cv: Optional[dict] = Field(None)
    github: Optional[dict] = Field(None)
    x: Optional[dict] = Field(None)
