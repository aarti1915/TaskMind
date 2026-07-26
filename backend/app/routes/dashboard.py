from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.connection import get_db
from app.utils.security import get_current_user

from app.models import (
    StudySession,
    Subject,
    Topic,
    SubTopic
)

from app.utils.time_format import format_duration


router = APIRouter()


@router.get("/dashboard/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    total_sessions = db.query(
        func.count(StudySession.session_id)
    ).filter(
        StudySession.user_id == current_user.user_id
    ).scalar()


    total_minutes = db.query(
        func.coalesce(
            func.sum(StudySession.duration_minutes),
            0
        )
    ).filter(
        StudySession.user_id == current_user.user_id
    ).scalar()


    total_subjects = db.query(
        func.count(Subject.subject_id)
    ).filter(
        Subject.user_id == current_user.user_id
    ).scalar()


    total_topics = db.query(
        func.count(Topic.topic_id)
    ).join(
        Subject
    ).filter(
        Subject.user_id == current_user.user_id
    ).scalar()


    total_sub_topics = db.query(
        func.count(SubTopic.sub_topic_id)
    ).join(
        Topic
    ).join(
        Subject
    ).filter(
        Subject.user_id == current_user.user_id
    ).scalar()



    return {
        "total_sessions": total_sessions or 0,

        "total_minutes": total_minutes or 0,

        "formatted_time": format_duration(
            total_minutes or 0
        ),

        "subjects": total_subjects or 0,

        "topics": total_topics or 0,

        "sub_topics": total_sub_topics or 0
    }