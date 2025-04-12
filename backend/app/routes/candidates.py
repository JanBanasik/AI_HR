from fastapi import APIRouter, HTTPException

from app.database import database
from app.schemas.candidate import CandidateCreate, CandidateUpdate, Candidate
from app.services.candidate import CandidateService

router = APIRouter(tags=["candidates"], prefix="/candidates")

@router.post("/", response_model=Candidate)
async def create_candidate(candidate_data: CandidateCreate):
    service = CandidateService(db=database)
    return await service.create_candidate(candidate_data)

@router.get("/", response_model=list[Candidate])
async def get_candidates(skip: int = 0, limit: int = 10):
    service = CandidateService(db=database)
    return await service.get_candidates(skip, limit)

@router.get("/{candidate_id}", response_model=Candidate)
async def get_candidate(candidate_id: str):
    service = CandidateService(db=database)
    candidate = await service.get_candidate_by_id(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

@router.put("/{candidate_id}", response_model=Candidate)
async def update_candidate(candidate_id: str, candidate_data: CandidateUpdate):
    service = CandidateService(db=database)
    candidate = await service.update_candidate(candidate_id, candidate_data.dict(exclude_unset=True))
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

@router.delete("/{candidate_id}", response_model=Candidate)
async def delete_candidate(candidate_id: str):
    service = CandidateService(db=database)
    candidate = await service.delete_candidate(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate
