from pydantic import BaseModel


class SubTopicCreate(BaseModel):
    name: str
    description: str | None = None
    topic_id: int


class SubTopicResponse(BaseModel):
    sub_topic_id: int
    name: str
    description: str | None
    topic_id: int

    class Config:
        from_attributes = True