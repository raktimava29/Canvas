from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pymongo.errors import PyMongoError
from app.middleware.error_handler import (
    http_exception_handler,
    pymongo_exception_handler,
    generic_exception_handler    
)

from contextlib import asynccontextmanager

from app.core.database import create_indexes

@asynccontextmanager
async def lifespan(app):
    await create_indexes()
    yield

from app.core.database import client,db
from app.core.config import settings
from app.routers.user_router import router as user_router

from app.core.database import content_collection

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://mindtube-pied.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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