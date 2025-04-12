from bson import ObjectId
from pydantic import BaseModel


# This will serve as the base model for validation
class CandidateBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    skills: str
    experience: int

class CandidateCreate(CandidateBase):
    pass

class CandidateUpdate(CandidateBase):
    pass

class Candidate(CandidateBase):
    id: str  # MongoDB uses ObjectId as primary key, but we store it as a string

    class Config:
        # This is to serialize the MongoDB ObjectId into string when sending the response
        json_encoders = {
            ObjectId: str
        }
