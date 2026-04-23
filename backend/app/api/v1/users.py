from fastapi import APIRouter, Depends
from app.models.user import User
from app.schemas.user import UserResponse
from app.core.dependencies import get_current_active_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user
