from fastapi import APIRouter, Depends
from app.models.user import User
from app.core.dependencies import get_current_active_user

router = APIRouter()

@router.get("/protected")
def test_protected_route(current_user: User = Depends(get_current_active_user)):
    return {"message": "You are authenticated!", "user_id": current_user.id}
