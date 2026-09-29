from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime


class UserCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=128,
        description="Must be at least 8 characters"
    )
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
