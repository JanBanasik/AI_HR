import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.environ.get("DATABASE_URL")
    DATABASE_NAME: str = os.environ.get("DATABASE_NAME")

settings = Settings()