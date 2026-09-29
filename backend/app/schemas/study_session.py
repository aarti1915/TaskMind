from pydantic import BaseModel
from datetime import datetime


class StudySessionCreate(BaseModel):

    subject_id: int

    topic_id: int

    sub_topic_id: int



class StudySessionManualCreate(BaseModel):

    subject_id: int

    topic_id: int

    sub_topic_id: int

    start_time: datetime

    end_time: datetime



class StudySessionResponse(BaseModel):

    session_id: int

    subject_id: int

    topic_id: int

    sub_topic_id: int

    subject_name: str | None = None

    topic_name: str | None = None

    sub_topic_name: str | None = None

    start_time: datetime

    end_time: datetime | None = None

    duration_minutes: int | None = None

    created_at: datetime


    class Config:

        from_attributes = True