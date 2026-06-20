from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: EmailStr
    isOAuth: bool = False

    model_config = {
        "from_attributes": True
    }