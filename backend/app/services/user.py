from app.repositories.user import UserRepository
from app.schemas.user import UserCreate


class UserService:
    def __init__(self):
        self.repo = UserRepository()

    async def create_user(self, user: UserCreate):
        user_dict = user.model_dump(exclude_unset=True)
        created = await self.repo.create_user(user_dict)
        created["id"] = str(created["_id"])
        return created

    async def get_user(self, user_id: str):
        user = await self.repo.get_user_by_id(user_id)
        if user:
            user["id"] = str(user["_id"])
        return user

    async def list_users(self):
        users = await self.repo.get_all_users()
        for user in users:
            user["id"] = str(user["_id"])
        return users
