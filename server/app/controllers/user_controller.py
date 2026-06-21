from fastapi import HTTPException
from datetime import datetime

from bson import ObjectId

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
    
    token = create_access_token(str(result.inserted_id))
    
    return AuthResponse(
        id=str(result.inserted_id),
        name=payload.name,
        email=payload.email,
        token=token
    )
    
async def login_user(payload: UserLogin):
    user = await user_collection.find_one({
            "email": payload.email,
            "isOAuth": False
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
        
    token = create_access_token(str(user["_id"]))
    
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
    
    token = create_access_token(str(result.inserted_id))
    
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
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
        
    token = create_access_token(str(user["_id"]))
    
    return AuthResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        token=token
    )
    
async def search_users(search: str, current_user):
    query = {}
    
    if search:
        query["name"] = {
            "$regex": search,
            "$options": "i",
        }
        
    users = await user_collection.find(query).to_list(None)
    
    users = [
        user 
        for user in users
        if str(user["_id"]) != str(current_user["_id"])
    ]
    
    for user in users:
        user["_id"] = str(user["_id"])
        user.pop("password", None)
        user.pop("googleId", None)
        
    return users

async def get_user_by_id(user_id: str):
    user = await user_collection.find_one({
        "_id": ObjectId(user_id)
    })
    
    if not user:
        raise HTTPException(
            status_code=400,
            detail="User not found"
        )
    
    user["_id"] = str(user["_id"])
    user.pop("password", None)  
    
    return user
