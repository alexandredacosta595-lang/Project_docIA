from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentBase(BaseModel):
    original_filename: str
    content_type: str
    file_size: int
    document_type: Optional[str] = None

class DocumentResponse(DocumentBase):
    id: int
    owner_id: int
    stored_filename: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
