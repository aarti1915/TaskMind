from pydantic import BaseModel
from datetime import datetime



class StudySessionCreate(BaseModel):

    subject_id:int

    topic_id:int

    sub_topic_id:int





class StudySessionResponse(BaseModel):

    session_id:int

    subject_id:int

    topic_id:int

    sub_topic_id:int

    start_time:datetime

    end_time:datetime | None = None

    duration_minutes:int | None = None

    created_at:datetime


    class Config:

        from_attributes=True