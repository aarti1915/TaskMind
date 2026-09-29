from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.utils.security import get_current_user
from app.schemas import ProfileUpdate
from app.database.connection import get_db


router = APIRouter()


@router.get("/profile")
def get_profile(
    current_user = Depends(get_current_user)
):
    return {
        "user_id": current_user.user_id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "date_of_birth": current_user.date_of_birth,
        "study_level": current_user.study_level
    }


@router.patch("/profile")
def update_profile(
    profile: ProfileUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile.full_name is not None:
        current_user.full_name = profile.full_name

    if profile.date_of_birth is not None:
        current_user.date_of_birth = profile.date_of_birth

    if profile.study_level is not None:
        current_user.study_level = profile.study_level

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully",
        "user_id": current_user.user_id
    }