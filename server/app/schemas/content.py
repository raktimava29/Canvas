from pydantic import BaseModel

class ContentSaveRequest(BaseModel):
    videoUrl: str
    notepadText: str = ""
    canvasImage: str = ""
    
class ContentResponse(BaseModel):
    id: str
    videoUrl: str
    user: str
    
    notepadText: str = ""
    canvasImage: str = ""
    
    model_config = {
        "from_attributes": True
    }