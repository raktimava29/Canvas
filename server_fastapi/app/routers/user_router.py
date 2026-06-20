from fastapi import APIRouter
from app.schemas.auth import AuthResponse, GoogleSignupRequest, GoogleLoginRequest

from app.schemas.user import UserCreate, UserLogin
from app.controllers.user_controller import (
    register_user,
    login_user,
    google_signup,
    google_login
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