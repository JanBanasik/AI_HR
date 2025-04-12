from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from app.routes import candidates


@asynccontextmanager
async def lifespan(_: FastAPI):
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    app.mongodb = client["db_hacknarok9"]
    yield
    app.mongodb.client.close()

app = FastAPI(lifespan=lifespan)

# noinspection PyTypeChecker
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router)
