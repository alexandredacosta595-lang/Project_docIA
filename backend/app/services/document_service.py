from sqlalchemy.orm import Session
from typing import List
from app.models.document import Document
from app.utils.file_handler import delete_file

class DocumentService:
    @staticmethod
    def create_document(
        db: Session, 
        owner_id: int, 
        original_filename: str, 
        stored_filename: str, 
        content_type: str, 
        file_size: int, 
        file_path: str
    ) -> Document:
        db_document = Document(
            owner_id=owner_id,
            original_filename=original_filename,
            stored_filename=stored_filename,
            content_type=content_type,
            file_size=file_size,
            file_path=file_path
        )
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
        return db_document

    @staticmethod
    def get_user_documents(db: Session, owner_id: int, skip: int = 0, limit: int = 100) -> List[Document]:
        return db.query(Document).filter(Document.owner_id == owner_id).offset(skip).limit(limit).all()

    @staticmethod
    def get_document_by_id(db: Session, document_id: int, owner_id: int) -> Document | None:
        return db.query(Document).filter(Document.id == document_id, Document.owner_id == owner_id).first()

    @staticmethod
    def delete_document(db: Session, document: Document) -> bool:
        # Delete from disk
        delete_file(document.file_path)
        
        # Delete from DB
        db.delete(document)
        db.commit()
        return True
