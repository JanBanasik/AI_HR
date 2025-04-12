from app.repositories.candidate import CandidateRepository
from sqlalchemy.orm import Session
from app.schemas.candidate import CandidateCreate, CandidateUpdate

class CandidateService:
    def __init__(self, db):
        self.repo = CandidateRepository(db)

    async def create_candidate(self, candidate_data: CandidateCreate):
        return await self.repo.create_candidate(candidate_data)

    async def get_candidates(self, skip: int = 0, limit: int = 10):
        return await self.repo.get_candidates(skip, limit)

    async def get_candidate_by_id(self, candidate_id: str):
        return await self.repo.get_candidate_by_id(candidate_id)

    async def update_candidate(self, candidate_id: str, candidate_data: CandidateUpdate):
        return await self.repo.update_candidate(candidate_id, candidate_data)

    async def delete_candidate(self, candidate_id: str):
        return await self.repo.delete_candidate(candidate_id)

