from fastapi import FastAPI, HTTPException

from pymongo.errors import PyMongoError
from app.middleware.error_handler import (
    http_exception_handler,
    pymongo_exception_handler,
    generic_exception_handler    
)

from app.core.database import client,db
from app.core.config import settings
from app.routers.user_router import router as user_router

app = FastAPI()

app.add_exception_handler(
    HTTPException,
    http_exception_handler
)

app.add_exception_handler(
    PyMongoError,
    pymongo_exception_handler
)

app.add_exception_handler(
    Exception,
    generic_exception_handler
)

app.include_router(user_router)

@app.get("/")
async def health():
        
        databases = await client.list_database_names()
        collections = await db.list_collection_names()
        
        return {
            "status": "healthy",
            "databases": databases,
            "collections": collections
        }
        
# from app.core.security import (
#     hash_password,
#     verify_password,
#     create_access_token,
#     verify_access_token
# ) 

# @app.get("/test-security")
# async def test_security():
#     hashed = hash_password("pass123")
    
#     valid = verify_password(
#         "pass123",
#         hashed
#     )
    
#     token = create_access_token("123")
#     decoded = verify_access_token(token)
    
#     return {
#         "hashed": hashed,
#         "valid": valid,
#         "token": token,
#         "decoded": decoded
#     }