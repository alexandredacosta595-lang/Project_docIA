from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.user import User
from app.schemas.document import DocumentResponse
from app.services.document_service import DocumentService
from app.core.dependencies import get_current_active_user
from app.utils.file_handler import validate_and_save_file

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    try:
        stored_filename, file_path, file_size = await validate_and_save_file(file)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return DocumentService.create_document(
        db=db,
        owner_id=current_user.id,
        original_filename=file.filename,
        stored_filename=stored_filename,
        content_type=file.content_type or "application/octet-stream",
        file_size=file_size,
        file_path=file_path
    )

@router.get("/", response_model=List[DocumentResponse])
def get_documents(
    skip: int = 0, limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return DocumentService.get_user_documents(db, owner_id=current_user.id, skip=skip, limit=limit)

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    document = DocumentService.get_document_by_id(db, document_id=document_id, owner_id=current_user.id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    document = DocumentService.get_document_by_id(db, document_id=document_id, owner_id=current_user.id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    DocumentService.delete_document(db, document)
