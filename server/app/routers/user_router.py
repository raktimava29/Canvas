from fastapi import APIRouter, Depends, Response

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

from app.core.security import COOKIE_CONFIG

router = APIRouter(
    prefix="/api/user",
    tags=["User"]
)

@router.post("/", response_model=AuthResponse, status_code=201)
async def register(payload: UserCreate, response: Response):
    result =  await register_user(payload)

    response.set_cookie(
        key="access_token",
        value=result.token,
        **COOKIE_CONFIG
    )
    
    return result.user

@router.post("/login", response_model=AuthResponse, status_code=200)
async def login(payload: UserLogin, response: Response):
    result = await login_user(payload)
    
    response.set_cookie(
        key="access_token",
        value=result.token,
        **COOKIE_CONFIG
    )
    
    return result.user


@router.post("/google-signup", response_model=AuthResponse)
async def signup_google(payload: GoogleSignupRequest, response: Response):
    result = await google_signup(payload)

    response.set_cookie(
        key="access_token",
        value=result.token,
        **COOKIE_CONFIG
    )
    
    return result.user

@router.post("/google-login", response_model=AuthResponse)
async def login_google(payload: GoogleLoginRequest, response: Response):
    result = await google_login(payload)

    response.set_cookie(
        key="access_token",
        value=result.token,
        **COOKIE_CONFIG
    )
    
    return result.user

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    
    return{
        "message": "Logged Out"
    }

@router.get("/me")
async def get_me(current_user=Depends(get_current_user)):
    return current_user

@router.get("/")
async def get_users(search: str = "", current_user=Depends(get_current_user)):
    return await search_users(search, current_user)

@router.get("/{user_id}")
async def get_user(user_id: str, current_user=Depends(get_current_user)):
    return await get_user_by_id(user_id)