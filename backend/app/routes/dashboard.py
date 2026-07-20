from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.connection import get_db
from app.utils.security import get_current_user
from app.utils.time_format import format_duration

from app.models import StudySession


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
        func.sum(StudySession.duration_minutes)
    ).filter(
        StudySession.user_id == current_user.user_id
    ).scalar()


    if total_minutes is None:
        total_minutes = 0


    subjects_studied = db.query(
        func.count(
            func.distinct(StudySession.subject_id)
        )
    ).filter(
        StudySession.user_id == current_user.user_id
    ).scalar()


    topics_studied = db.query(
        func.count(
            func.distinct(StudySession.topic_id)
        )
    ).filter(
        StudySession.user_id == current_user.user_id
    ).scalar()


    sub_topics_studied = db.query(
        func.count(
            func.distinct(StudySession.sub_topic_id)
        )
    ).filter(
        StudySession.user_id == current_user.user_id
    ).scalar()


    return {
        "total_sessions": total_sessions,
        "total_minutes": total_minutes,
        "formatted_time": format_duration(total_minutes),
        "subjects_studied": subjects_studied,
        "topics_studied": topics_studied,
        "sub_topics_studied": sub_topics_studied
    }