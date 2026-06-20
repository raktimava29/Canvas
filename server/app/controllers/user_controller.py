from fastapi import HTTPException
from datetime import datetime

from app.schemas.user import UserCreate, UserLogin
from app.schemas.auth import AuthResponse, GoogleSignupRequest, GoogleLoginRequest

from app.core.database import user_collection
from app.core.security import (
    hash_password,
    create_access_token,
    verify_password
)

async def register_user(payload: UserCreate):
    existing_user = await user_collection.find_one({
            "email": payload.email
        })
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )
        
    hashed_password = hash_password(payload.password)
    
    user_data = {
        "name":payload.name,
        "email":payload.email,
        "password":hashed_password,
        "isOAuth": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    result = await user_collection.insert_one(user_data)
    
    token = create_access_token({
            "id": str(result.inserted_id)
        })
    
    return AuthResponse(
        id=str(result.inserted_id),
        name=payload.name,
        email=payload.email,
        token=token
    )
    
async def login_user(payload: UserLogin):
    user = await user_collection.find_one({
            "email": payload.email
        })
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
        
    if not verify_password(payload.password, user["password"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
        
    token = create_access_token({
        "id": str(user["_id"])
    })
    
    return AuthResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        token=token
    )
    
async def google_signup(payload: GoogleSignupRequest):
    existing_user = await user_collection.find_one({
        "email": payload.email
    })
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )
        
    user_data = {
        "name": payload.username,
        "email": payload.email,
        "googleId": payload.googleId,
        "isOAuth": True,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    result = await user_collection.insert_one(
        user_data
    )
    
    token = create_access_token({
        "id": str(result.inserted_id)
    })
    
    return AuthResponse(
        id=str(result.inserted_id),
        name=payload.username,
        email=payload.email,
        token=token
    )
    
async def google_login(payload: GoogleLoginRequest):
    
    user = await user_collection.find_one({
        "email": payload.email,
        "googleId": payload.googleId,
        "isOAuth": True
    })
    
    if not user or not user.get("isOAuth"):
        raise HTTPException(
            status_code=404,
            detail="Invalid credentials"
        )
        
    token = create_access_token({
        "id": str(user["_id"])
    })
    
    return AuthResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        token=token
    )