from pydantic import BaseModel, Field, field_validator

from datetime import date, datetime

from app.models.task import TaskPriority, TaskStatus


class TaskCreate(BaseModel):

    title: str = Field(min_length=1, max_length=200)

    description: str | None = Field(default=None, max_length=1000)

    subject_id: int

    topic_id: int

    sub_topic_id: int

    priority: TaskPriority = TaskPriority.MEDIUM

    due_date: date

    @field_validator("due_date")
    @classmethod
    def due_date_not_in_past(cls, value: date) -> date:

        if value < date.today():

            raise ValueError("due_date cannot be in the past")

        return value


class TaskUpdate(BaseModel):

    title: str | None = Field(default=None, min_length=1, max_length=200)

    description: str | None = Field(default=None, max_length=1000)

    priority: TaskPriority | None = None

    due_date: date | None = None

    @field_validator("due_date")
    @classmethod
    def due_date_not_in_past(cls, value: date | None) -> date | None:

        if value is not None and value < date.today():

            raise ValueError("due_date cannot be in the past")

        return value


class TaskResponse(BaseModel):

    task_id: int

    title: str

    description: str | None

    subject_id: int

    topic_id: int

    sub_topic_id: int

    priority: TaskPriority

    status: TaskStatus

    due_date: date

    completed_at: datetime | None

    created_at: datetime

    class Config:

        from_attributes = True
