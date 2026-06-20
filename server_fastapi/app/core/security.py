from passlib.context import CryptContext

import jwt
from datetime import datetime, timedelta

from app.core.config import settings

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password:str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password:str, hashed_password:str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(user_id:str):
    payload = {
        "id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    
    return jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm="HS256"
    )
    
def verify_access_token(token:str):
    payload = jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=["HS256"]
    )
    
    return payload