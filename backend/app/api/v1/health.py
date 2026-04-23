from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db

router = APIRouter()

@router.get("/live")
def health_live():
    return {"status": "ok", "message": "API is live"}

@router.get("/ready")
def health_ready(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "message": "API and Database are ready"}
    except Exception as e:
        raise HTTPException(status_code=503, detail="Database is not ready")
