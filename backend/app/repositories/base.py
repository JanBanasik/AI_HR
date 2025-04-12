from typing import Generic, TypeVar
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection

T = TypeVar("T")

class BaseRepository(Generic[T]):
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def create(self, data: dict) -> dict:
        result = await self.collection.insert_one(data)
        data["_id"] = result.inserted_id
        return data

    async def get_by_id(self, _id: str) -> dict | None:
        return await self.collection.find_one({"_id": ObjectId(_id)})

    async def get_all(self) -> list[dict]:
        return [doc async for doc in self.collection.find()]

    async def update(self, _id: str, data: dict) -> dict | None:
        await self.collection.update_one({"_id": ObjectId(_id)}, {"$set": data})
        return await self.get_by_id(_id)

    async def delete(self, _id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(_id)})
        return result.deleted_count == 1
