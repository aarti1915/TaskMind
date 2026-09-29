from pydantic import BaseModel, Field


class TopicCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    subject_id: int


class TopicResponse(BaseModel):
    topic_id: int
    name: str
    description: str | None
    subject_id: int

    class Config:
        from_attributes = True
