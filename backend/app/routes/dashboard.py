from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.connection import get_db
from app.utils.security import get_current_user

from app.models import (
    Subject,
    Topic,
    SubTopic,
    StudySession,
    Task,
    TaskStatus
)



router = APIRouter()



@router.get("/dashboard/summary")
def dashboard_summary(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):


    total_subjects = db.query(
        Subject
    ).filter(

        Subject.user_id == current_user.user_id

    ).count()





    total_topics = db.query(
        Topic
    ).filter(

        Topic.user_id == current_user.user_id

    ).count()





    total_sub_topics = db.query(
        SubTopic
    ).filter(

        SubTopic.user_id == current_user.user_id

    ).count()






    total_tasks = db.query(
        Task
    ).filter(

        Task.user_id == current_user.user_id

    ).count()






    completed_tasks = db.query(
        Task
    ).filter(

        Task.user_id == current_user.user_id,

        Task.status == TaskStatus.COMPLETED

    ).count()






    pending_tasks = db.query(
        Task
    ).filter(

        Task.user_id == current_user.user_id,

        Task.status == TaskStatus.PENDING

    ).count()






    total_sessions = db.query(
        StudySession
    ).filter(

        StudySession.user_id == current_user.user_id

    ).count()






    total_minutes = db.query(
        func.sum(
            StudySession.duration_minutes
        )

    ).filter(

        StudySession.user_id == current_user.user_id

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