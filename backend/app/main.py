from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import candidate
from app.routes import analysis

app = FastAPI(title="HR Summarizer App")

# noinspection PyTypeChecker
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(candidate.router)
app.include_router(analysis.router)
