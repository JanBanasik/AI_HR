from pydantic import BaseModel, HttpUrl
from typing import Optional


class UserAnalysisInput(BaseModel):
    github_username: Optional[HttpUrl] = None
    x_profile_username: Optional[HttpUrl] = None
