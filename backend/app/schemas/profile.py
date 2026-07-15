from pydantic import BaseModel
from datetime import date


class ProfileUpdate(BaseModel):
    full_name: str | None = None
    date_of_birth: date | None = None
    timezone: str | None = None
    study_level: str | None = None