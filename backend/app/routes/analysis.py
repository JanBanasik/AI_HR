import asyncio

from fastapi import APIRouter, UploadFile, File, Form

from app.schemas.candidate import CandidateCreate
from app.services.analysis import analyze_github, analyze_x_profile, analyze_pdf_file
from app.services.candidate import CandidateService

router = APIRouter(prefix="/analysis", tags=["Candidate Analysis"])


@router.post("/")
async def analyze_candidate(
        github_username: str = Form(None),
        x_profile_username: str = Form(None),
        file: UploadFile = File(None)
):
    results = await asyncio.gather(
        analyze_github(github_username) if github_username else asyncio.sleep(0),
        analyze_x_profile(x_profile_username) if x_profile_username else asyncio.sleep(0),
        analyze_pdf_file(await file.read()) if file else asyncio.sleep(0)
    )

    response = {}
    if github_username:
        response["github"] = results[0]
    if x_profile_username:
        response["x"] = results[1]
    if file:
        response["cv"] = results[2]

    candidate_service = CandidateService()
    await candidate_service.create(CandidateCreate(**response))

    return response
