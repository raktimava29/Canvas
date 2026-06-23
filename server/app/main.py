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
from app.routers.content_router import router as content_router

from app.core.database import content_collection

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
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
app.include_router(content_router)

@app.get("/")
async def health():
    return {
        "status": "healthy"
    }
