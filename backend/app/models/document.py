from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, BigInteger
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    original_filename = Column(String, nullable=False)
    stored_filename = Column(String, nullable=False, unique=True)
    content_type = Column(String, nullable=False)
    file_size = Column(BigInteger, nullable=False)
    file_path = Column(String, nullable=False)
    document_type = Column(String, nullable=True)
    status = Column(String, default="uploaded", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User")
