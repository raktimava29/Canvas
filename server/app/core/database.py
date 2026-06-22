from pymongo import AsyncMongoClient

from app.core.config import settings

client = AsyncMongoClient(settings.MONGO_URI)

db = client[settings.DB_NAME]
user_collection = db["users"]
content_collection = db["contents"]

async def create_indexes():
    await user_collection.create_index(
        "email",
        unique=True
    )
    
    await content_collection.create_index(
        [
            ("videoUrl", 1),
            ("user", 1)
        ],
        unique=True
    )