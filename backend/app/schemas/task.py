from pydantic import BaseModel

from datetime import date, datetime

from app.models.task import TaskPriority, TaskStatus



class TaskCreate(BaseModel):

    title: str

    description: str | None = None

    subject_id: int

    topic_id: int

    sub_topic_id: int

    priority: TaskPriority = TaskPriority.MEDIUM

    due_date: date





class TaskUpdate(BaseModel):

    title: str | None = None

    description: str | None = None

    priority: TaskPriority | None = None

    due_date: date | None = None





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