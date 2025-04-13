from fastapi import APIRouter, HTTPException
from app.services.candidate import CandidateService
from app.schemas.candidate import CandidateCreate, CandidateUpdate, CandidateResponse

router = APIRouter(prefix="/candidates", tags=["Candidates"])
service = CandidateService()

@router.post("/", response_model=CandidateResponse)
async def create(candidate: CandidateCreate):
    return await service.create(candidate)

@router.get("/", response_model=list[CandidateResponse])
async def list_all():
    return await service.list()

@router.get("/{candidate_id}", response_model=CandidateResponse)
async def get(candidate_id: str):
    result = await service.get(candidate_id)
    if not result:
        raise HTTPException(status_code=404, detail="Not found")
    return result

@router.put("/{candidate_id}", response_model=CandidateResponse)
async def update(candidate_id: str, data: CandidateUpdate):
    updated = await service.update(candidate_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Not found")
    return updated

@router.delete("/{candidate_id}")
async def delete(candidate_id: str):
    deleted = await service.delete(candidate_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Not found")
    return {"message": "Deleted successfully"}
