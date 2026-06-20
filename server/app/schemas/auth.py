from pydantic import BaseModel, EmailStr, Field


class AuthResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: EmailStr
    token: str
    
    model_config = {
        "populate_by_name": True
    }
    
class GoogleSignupRequest(BaseModel):
    email: EmailStr
    username: str
    googleId: str
    
class GoogleLoginRequest(BaseModel):
    email: EmailStr
    googleId: str