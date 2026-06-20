from pymongo import AsyncMongoClient

from app.core.config import settings

client = AsyncMongoClient(settings.MONGO_URI)

db = client["test"]
user_collection = db["users"]
content_collection = db["contents"]

async def create_indexes():
    await content_collection.create_index(
        [
            ("videoUrl", 1),
            ("user", 1)
        ],
        unique=True
    )