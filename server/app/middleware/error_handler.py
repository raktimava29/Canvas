from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi import HTTPException

from pymongo.errors import PyMongoError

async def http_exception_handler(request: Request,exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail
        }
    )
    
async def pymongo_exception_handler(request: Request, exc: PyMongoError):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Database error"
        }
    )
    
async def generic_exception_handler(request:Request, exc:Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal Server Error"
        }
    )