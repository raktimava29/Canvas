from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user

from app.controllers.content_controller import save_content, get_content

from app.schemas.content import ContentSaveRequest

router = APIRouter(
    prefix="/api/content",
    tags=["Content"]
)

@router.post("/save")
async def save(payload: ContentSaveRequest, current_user=Depends(get_current_user)):
    return await save_content(payload, current_user)

@router.get("/")
async def get(videoUrl:str, userId: str | None = None, current_user=Depends(get_current_user)):
    return await get_content(videoUrl, current_user, userId)
