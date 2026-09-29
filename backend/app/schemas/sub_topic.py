from pydantic import BaseModel, Field


class SubTopicCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    topic_id: int


class SubTopicResponse(BaseModel):
    sub_topic_id: int
    name: str
    description: str | None
    topic_id: int

    class Config:
        from_attributes = True
