from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.connection import get_db

from app.models.subject import Subject
from app.models.topic import Topic
from app.models.sub_topic import SubTopic
from app.models.task import Task, TaskStatus
from app.models.study_session import StudySession

from app.utils.security import get_current_user


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)



@router.get("/summary")
def dashboard_summary(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    user_id = current_user.user_id



    total_subjects = db.query(
        func.count(Subject.subject_id)
    ).filter(
        Subject.user_id == user_id
    ).scalar() or 0




    total_topics = db.query(
        func.count(Topic.topic_id)
    ).join(
        Subject,
        Topic.subject_id == Subject.subject_id
    ).filter(
        Subject.user_id == user_id
    ).scalar() or 0




    total_sub_topics = db.query(
        func.count(SubTopic.sub_topic_id)
    ).join(
        Topic,
        SubTopic.topic_id == Topic.topic_id
    ).join(
        Subject,
        Topic.subject_id == Subject.subject_id
    ).filter(
        Subject.user_id == user_id
    ).scalar() or 0




    total_tasks = db.query(
        func.count(Task.task_id)
    ).filter(
        Task.user_id == user_id
    ).scalar() or 0




    completed_tasks = db.query(
        func.count(Task.task_id)
    ).filter(

        Task.user_id == user_id,

        Task.status == TaskStatus.COMPLETED

    ).scalar() or 0




    pending_tasks = total_tasks - completed_tasks




    total_sessions = db.query(
        func.count(StudySession.session_id)
    ).filter(
        StudySession.user_id == user_id
    ).scalar() or 0




    total_minutes = db.query(
        func.sum(StudySession.duration_minutes)
    ).filter(
        StudySession.user_id == user_id
    ).scalar() or 0



    return {

        "subjects": total_subjects,

        "topics": total_topics,

        "sub_topics": total_sub_topics,

        "total_tasks": total_tasks,

        "completed_tasks": completed_tasks,

        "pending_tasks": pending_tasks,

        "total_sessions": total_sessions,

        "total_minutes": total_minutes

    }