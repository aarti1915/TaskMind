from pydantic import BaseModel


class TopicCreate(BaseModel):
    name: str
    description: str | None = None
    subject_id: int


class TopicResponse(BaseModel):
    topic_id: int
    name: str
    description: str | None
    subject_id: int

    class Config:
        from_attributes = True