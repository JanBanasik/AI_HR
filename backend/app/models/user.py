from bson import ObjectId

class UserModel:
    def __init__(self, _id: ObjectId, name: str, email: str):
        self.id = str(_id)
        self.name = name
        self.email = email
