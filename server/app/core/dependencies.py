from fastapi import HTTPException, Request
from bson import ObjectId

from app.core.security import verify_access_token
from app.core.database import user_collection

async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )
        
    payload = verify_access_token(token)
    
    user_id = (payload["id"])
    
    user = await user_collection.find_one({
        "_id": ObjectId(user_id)
    })
        
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )
    
    user["_id"] = str(user["_id"])
    user.pop("password", None)
      
    return user    