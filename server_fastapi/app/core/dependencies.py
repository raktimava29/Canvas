from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId

from app.core.security import verify_access_token
from app.core.database import user_collection

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_access_token(credentials.credentials)
    
    user_id = payload.get("id")
    
    if not user_id:
        raise HTTPException(
            status_code=401,
            deatil="Unauthorized"
        )
    
    user = await user_collection.find_one({
        "_id": ObjectId(user_id)
    })
        
    if not user_id:
        raise HTTPException(
            status_code=401,
            deatil="Unauthorized"
        )
    
    user.pop("password", None)
      
    return user    