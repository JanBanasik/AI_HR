from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from app.models.base import PyObjectId


class CandidateModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    cv: dict = Field(None)
    github: dict = Field(None)
    x: dict = Field(None)

    model_config = ConfigDict(
        populate_by_name=True,
    )
