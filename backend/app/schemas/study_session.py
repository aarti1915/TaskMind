from pydantic import BaseModel
from datetime import date


class StudySessionCreate(BaseModel):
    subject_id: int
    topic_id: int
    sub_topic_id: int
    study_date: date
    duration_minutes: int
    notes: str | None = None


class StudySessionResponse(BaseModel):
    session_id: int
    subject_id: int
    topic_id: int
    sub_topic_id: int
    study_date: date
    duration_minutes: int
    notes: str | None

    class Config:
        from_attributes = True