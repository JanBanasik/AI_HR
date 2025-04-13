from app.services.base import BaseService
from app.repositories.candidate import CandidateRepository
from app.schemas.candidate import CandidateCreate, CandidateUpdate

class CandidateService(BaseService[CandidateCreate, CandidateUpdate]):
    def __init__(self):
        super().__init__(CandidateRepository())
