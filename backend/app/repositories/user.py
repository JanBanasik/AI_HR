from app.db.client import db
from bson import ObjectId

class UserRepository:
    def __init__(self):
        self.collection = db["users"]

    async def create_user(self, user_data: dict) -> dict:
        result = await self.collection.insert_one(user_data)
        user_data["_id"] = result.inserted_id
        return user_data

    async def get_user_by_id(self, user_id: str) -> dict | None:
        return await self.collection.find_one({"_id": ObjectId(user_id)})

    async def get_all_users(self):
        return [user async for user in self.collection.find()]
