from pydantic import BaseModel, EmailStr
from datetime import date, datetime

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    date_of_birth: date | None = None
    timezone: str = "Asia/Kolkata"
    study_level: str

class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: EmailStr
    profile_image: str | None = None
    date_of_birth: date | None = None
    timezone: str
    study_level: str
    is_email_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

