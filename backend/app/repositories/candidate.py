from bson import ObjectId

class CandidateRepository:
    def __init__(self, db):
        self.db = db

    async def create_candidate(self, candidate_data):
        candidate_dict = candidate_data.dict()
        result = await self.db.candidates.insert_one(candidate_dict)
        return { "id": str(result.inserted_id) }

    async def get_candidates(self, skip: int = 0, limit: int = 10):
        candidates = await self.db.candidates.find().skip(skip).limit(limit).to_list(length=limit)
        return candidates

    async def get_candidate_by_id(self, candidate_id: str):
        candidate = await self.db.candidates.find_one({"_id": ObjectId(candidate_id)})
        if not candidate:
            return None
        candidate["id"] = str(candidate["_id"])
        return candidate

    async def update_candidate(self, candidate_id: str, candidate_data: dict):
        update_result = await self.db.candidates.update_one(
            {"_id": ObjectId(candidate_id)},
            {"$set": candidate_data}
        )
        if update_result.modified_count == 0:
            return None
        return await self.get_candidate_by_id(candidate_id)

    async def delete_candidate(self, candidate_id: str):
        result = await self.db.candidates.delete_one({"_id": ObjectId(candidate_id)})
        if result.deleted_count == 0:
            return None
        return {"id": candidate_id}
