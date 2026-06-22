from pydantic import BaseModel, EmailStr, Field

class AuthResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: EmailStr
    token: str
    picture: str | None = None
    
    model_config = {
        "populate_by_name": True
    }
    
class GoogleSignupRequest(BaseModel):
    access_token: str
    
class GoogleLoginRequest(BaseModel):
    access_token: str