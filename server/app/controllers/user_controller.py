from fastapi import HTTPException
from datetime import datetime, timezone

from bson import ObjectId

from app.schemas.user import UserCreate, UserLogin
from app.schemas.auth import AuthResponse, AuthResult, GoogleSignupRequest, GoogleLoginRequest

from app.core.google_auth import verify_google_token

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
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }
    
    result = await user_collection.insert_one(user_data)
    
    token = create_access_token(str(result.inserted_id))
    
    return AuthResult(
        user=AuthResponse(
            id=str(result.inserted_id),
            name=payload.name,
            email=payload.email
        ),
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
    
    return AuthResult(
        user=AuthResponse(
            id=str(user["_id"]),
            name=user["name"],
            email=user["email"]
        ),
        token=token
    )
    
async def google_signup(payload: GoogleSignupRequest):
    google_user = await verify_google_token(payload.access_token)
    
    existing_user = await user_collection.find_one({
        "email": google_user["email"]
    })
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )
        
    user_data = {
        "name": google_user["name"],
        "email": google_user["email"],
        "googleId": google_user["googleId"],
        "isOAuth": True,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }
    
    result = await user_collection.insert_one(user_data)
    
    token = create_access_token(str(result.inserted_id))
    
    return AuthResult(
        user=AuthResponse(
            id=str(result.inserted_id),
            name=google_user["name"],
            email=google_user["email"],
            picture=google_user["picture"]
        ),
        token=token
    )
    
async def google_login(payload: GoogleLoginRequest):
    google_user = await verify_google_token(payload.access_token)
    
    user = await user_collection.find_one({
        "email": google_user["email"],
        "googleId": google_user["googleId"],
        "isOAuth": True
    })
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
        
    token = create_access_token(str(user["_id"]))
    
    return AuthResult(
        user=AuthResponse(
            id=str(user["_id"]),
            name=user["name"],
            email=user["email"],
            picture=google_user["picture"]
        ),
        token=token
    )
    
async def search_users(search: str, current_user):
    query = {}
    
    if search:
        query["name"] = {
            "$regex": search,
            "$options": "i",
        }
        
    users = await user_collection.find(query).limit(10).to_list(10)
    
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
