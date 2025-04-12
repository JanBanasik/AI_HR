from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from app.models.base import PyObjectId


class CandidateModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    first_name: str = Field(...)
    last_name: str = Field(...)

    model_config = ConfigDict(
        populate_by_name=True,
    )