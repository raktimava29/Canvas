from fastapi import APIRouter, Depends

from app.schemas.auth import AuthResponse, GoogleSignupRequest, GoogleLoginRequest

from app.core.dependencies import get_current_user

from app.schemas.user import UserCreate, UserLogin

from app.controllers.user_controller import (
    register_user,
    login_user,
    google_signup,
    google_login,
    search_users,
    get_user_by_id
)

router = APIRouter(
    prefix="/api/user",
    tags=["User"]
)

@router.post("/", response_model=AuthResponse, status_code=201)
async def register(payload: UserCreate):
    return await register_user(payload)

@router.post("/login", response_model=AuthResponse, status_code=200)
async def login(payload: UserLogin):
    return await login_user(payload)

@router.post("/google-signup", response_model=AuthResponse)
async def signup_google(payload: GoogleSignupRequest):
    return await google_signup(payload)

@router.post("/google-login", response_model=AuthResponse)
async def login_google(payload: GoogleLoginRequest):
    return await google_login(payload)

@router.get("/")
async def get_users(search: str = "", current_user=Depends(get_current_user)):
    return await search_users(search, current_user)

@router.get("/{user_id}")
async def get_user(user_id: str, current_user=Depends(get_current_user)):
    return await get_user_by_id(user_id)