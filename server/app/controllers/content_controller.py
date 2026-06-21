from bson import ObjectId

from fastapi import HTTPException

from pymongo import ReturnDocument

from app.core.database import content_collection
from app.schemas.content import ContentSaveRequest

async def save_content(payload: ContentSaveRequest, current_user):
    
    if not payload.videoUrl.strip():
        raise HTTPException(
            status_code=400,
            detail="Video URL is required"
        )
    content = await content_collection.find_one_and_update(
        {
            "videoUrl": payload.videoUrl,
            "user": current_user["_id"]
        },
        {
          "$set":{
              "notepadText": payload.notepadText,
              "canvasImage": payload.canvasImage
          }
        },
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    
    content["_id"] = str(content["_id"])
    content["user"] = str(content["user"])
    
    return content

async def get_content(videoUrl: str, current_user, userId: str | None = None):
    target_user = (
        ObjectId(userId)
        if userId
        else current_user["_id"]
    )
    
    content = await content_collection.find_one({
        "videoUrl": videoUrl,
        "user": target_user
    })
    
    if not content:
        raise HTTPException(
            status_code=404,
            detail="No content found for this url by the user"
        )
        
    content["_id"] = str(content["_id"])
    content["user"] = str(content["user"])
    
    return content

async def get_shared_content(videoUrl: str, userId: str):
    content = await content_collection.find_one({
        "videoUrl": videoUrl,
        "user": ObjectId(userId)
    })
    
    if not content:
        raise HTTPExpection(
            status_code=404,
            detail="No content found for this URL and user"
        )
        
    content["_id"] = str(content["_id"])
    content["user"] = str(content["user"])
    
    return content

