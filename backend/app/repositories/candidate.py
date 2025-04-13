from app.db.client import db
from app.repositories.base import BaseRepository

class CandidateRepository(BaseRepository):
    def __init__(self):
        super().__init__(db["candidates"])
