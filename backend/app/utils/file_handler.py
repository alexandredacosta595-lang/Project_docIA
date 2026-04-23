import os
import uuid
from typing import Tuple
from fastapi import UploadFile, HTTPException
from app.core.config import settings

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def get_file_extension(filename: str) -> str:
    _, ext = os.path.splitext(filename)
    return ext.lower()

async def validate_and_save_file(file: UploadFile) -> Tuple[str, str, int]:
    ext = get_file_extension(file.filename)
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="File extension not allowed")

    # Read file content to check size and save
    content = await file.read()
    file_size = len(content)
    
    if file_size == 0:
        raise HTTPException(status_code=400, detail="File is empty")
        
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB allowed")

    # Ensure upload dir exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
        
    return unique_filename, file_path, file_size

def delete_file(file_path: str):
    if os.path.exists(file_path):
        os.remove(file_path)
