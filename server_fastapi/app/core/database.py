from pymongo import AsyncMongoClient

from app.core.config import settings

client = AsyncMongoClient(settings.MONGO_URI)

db = client["test"]
users_collections = db["users"]
contents_collections = db["contents"]