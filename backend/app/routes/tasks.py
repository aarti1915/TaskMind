from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta

from app.database.connection import get_db
from app.utils.security import get_current_user

from app.models import (
    Task,
    TaskStatus,
    Subject,
    Topic,
    SubTopic
)

from app.schemas import (
    TaskCreate,
    TaskUpdate,
    TaskResponse
)


router = APIRouter()


# Create Task

@router.post(
    "/tasks",
    response_model=TaskResponse
)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    subject = db.query(Subject).filter(
        Subject.subject_id == task_data.subject_id,
        Subject.user_id == current_user.user_id
    ).first()

    if not subject:

        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    # Was previously only checking Topic.topic_id, with no check that
    # the topic belongs to this subject OR to the current user. That
    # allowed tasks to reference another user's topic, or a topic
    # belonging to a different subject entirely.
    topic = db.query(Topic).filter(
        Topic.topic_id == task_data.topic_id,
        Topic.subject_id == task_data.subject_id
    ).first()

    if not topic:

        raise HTTPException(
            status_code=404,
            detail="Topic does not belong to subject"
        )

    sub_topic = db.query(SubTopic).filter(

        SubTopic.sub_topic_id == task_data.sub_topic_id,

        SubTopic.topic_id == task_data.topic_id

    ).first()

    if not sub_topic:

        raise HTTPException(
            status_code=404,
            detail="Sub topic does not belong to topic"
        )

    new_task = Task(

        user_id=current_user.user_id,

        subject_id=task_data.subject_id,

        topic_id=task_data.topic_id,

        sub_topic_id=task_data.sub_topic_id,

        title=task_data.title,

        description=task_data.description,

        priority=task_data.priority,

        due_date=task_data.due_date

    )

    db.add(new_task)

    db.commit()

    db.refresh(new_task)

    return new_task


# Get All Tasks

@router.get(
    "/tasks",
    response_model=list[TaskResponse]
)
def get_tasks(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    tasks = db.query(Task).filter(

        Task.user_id == current_user.user_id

    ).all()

    return tasks


# Today's Tasks

@router.get(
    "/tasks/today",
    response_model=list[TaskResponse]
)
def get_today_tasks(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    tasks = db.query(Task).filter(

        Task.user_id == current_user.user_id,

        Task.due_date == date.today()

    ).all()

    return tasks


# Upcoming Tasks

@router.get(
    "/tasks/upcoming",
    response_model=list[TaskResponse]
)
def get_upcoming_tasks(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    tasks = db.query(Task).filter(

        Task.user_id == current_user.user_id,

        Task.due_date > date.today()

    ).all()

    return tasks


# Update Task

@router.patch(
    "/tasks/{task_id}",
    response_model=TaskResponse
)
def update_task(

    task_id:int,

    task_data:TaskUpdate,

    db:Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    task = db.query(Task).filter(

        Task.task_id == task_id,

        Task.user_id == current_user.user_id

    ).first()

    if not task:

        raise HTTPException(

            status_code=404,

            detail="Task not found"

        )

    if task_data.title is not None:

        task.title = task_data.title

    if task_data.description is not None:

        task.description = task_data.description

    if task_data.priority is not None:

        task.priority = task_data.priority

    if task_data.due_date is not None:

        task.due_date = task_data.due_date

    db.commit()

    db.refresh(task)

    return task


# Complete Task

@router.patch(
    "/tasks/{task_id}/complete",
    response_model=TaskResponse
)
def complete_task(

    task_id:int,

    db:Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    task = db.query(Task).filter(

        Task.task_id == task_id,

        Task.user_id == current_user.user_id

    ).first()

    if not task:

        raise HTTPException(

            status_code=404,

            detail="Task not found"

        )

    task.status = TaskStatus.COMPLETED

    task.completed_at = datetime.utcnow()

    db.commit()

    db.refresh(task)

    return task


# Delete Task

@router.delete(
    "/tasks/{task_id}"
)
def delete_task(

    task_id:int,

    db:Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    task = db.query(Task).filter(

        Task.task_id == task_id,

        Task.user_id == current_user.user_id

    ).first()

    if not task:

        raise HTTPException(

            status_code=404,

            detail="Task not found"

        )

    db.delete(task)

    db.commit()

    return {

        "message":"Task deleted successfully"

    }
