from typing import TypeVar, Generic
from app.repositories.base import BaseRepository

CreateSchema = TypeVar("CreateSchema")
UpdateSchema = TypeVar("UpdateSchema")

class BaseService(Generic[CreateSchema, UpdateSchema]):
    def __init__(self, repository: BaseRepository):
        self.repo = repository

    async def create(self, data: CreateSchema):
        data_dict = data.model_dump(exclude_unset=True)
        created = await self.repo.create(data_dict)
        created["id"] = str(created["_id"])
        return created

    async def get(self, _id: str):
        doc = await self.repo.get_by_id(_id)
        if doc:
            doc["id"] = str(doc["_id"])
        return doc

    async def list(self):
        docs = await self.repo.get_all()
        for doc in docs:
            doc["id"] = str(doc["_id"])
        return docs

    async def update(self, _id: str, data: UpdateSchema):
        data_dict = data.model_dump(exclude_unset=True)
        updated = await self.repo.update(_id, data_dict)
        if updated:
            updated["id"] = str(updated["_id"])
        return updated

    async def delete(self, _id: str):
        return await self.repo.delete(_id)
