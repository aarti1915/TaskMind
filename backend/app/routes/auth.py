from fastapi import APIRouter
from app.schemas import UserCreate, UserResponse, LoginRequest
from sqlalchemy.orm import Session
from fastapi import Depends
from app.utils.password import hash_password
from app.database.connection import get_db
from app.models import User
from sqlalchemy import select
from app.utils.password import verify_password
from app.utils.token import create_access_token
router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password),
        date_of_birth=user.date_of_birth,
        timezone=user.timezone,
        study_level=user.study_level
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")
def login(
    user: LoginRequest,
    db: Session = Depends(get_db)
):
    statement = select(User).where(User.email == user.email)

    result = db.execute(statement)

    db_user = result.scalar_one_or_none()

    if db_user is None:
        return {
            "message": "User not found"
        }
    
    password_valid = verify_password(
        user.password,
        db_user.password_hash
    )

    if not password_valid:
        return {
            "message": "Invalid password"
        }

    access_token = create_access_token(
        data={
            "sub": str(db_user.user_id)
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

    return {
        "email": db_user.email
    }


