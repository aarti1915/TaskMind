from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import timedelta, date

from app.database.connection import get_db
from app.utils.security import get_current_user
from app.utils.time_format import format_duration

from app.models import StudySession, Subject, Topic, SubTopic


router = APIRouter()

@router.get("/analytics/daily")
def daily_analytics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    daily_data = db.query(
        StudySession.study_date,
        func.sum(
            StudySession.duration_minutes
        ).label("total_minutes")
    ).filter(
        StudySession.user_id == current_user.user_id
    ).group_by(
        StudySession.study_date
    ).order_by(
        StudySession.study_date
    ).all()


    result = []

    for data in daily_data:
        result.append(
            {
                "date": data.study_date,
                "total_minutes": data.total_minutes,
                "formatted_time": format_duration(
                    data.total_minutes
                )
            }
        )

    return result

@router.get("/progress/subjects")
def subject_progress(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    subjects = db.query(
        Subject.subject_id,
        Subject.name,
        func.sum(
            StudySession.duration_minutes
        ).label("total_minutes"),
        func.count(
            StudySession.session_id
        ).label("total_sessions"),
        func.max(
            StudySession.study_date
        ).label("last_studied")
    ).join(
        StudySession,
        Subject.subject_id == StudySession.subject_id
    ).filter(
        StudySession.user_id == current_user.user_id
    ).group_by(
        Subject.subject_id
    ).all()


    result = []

    for subject in subjects:
        result.append(
            {
                "subject_id": subject.subject_id,
                "subject_name": subject.name,
                "total_minutes": subject.total_minutes,
                "formatted_time": format_duration(
                    subject.total_minutes
                ),
                "total_sessions": subject.total_sessions,
                "last_studied": subject.last_studied
            }
        )

    return result

@router.get("/progress/topics")
def topic_progress(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    topics = db.query(
        Topic.topic_id,
        Topic.name,
        func.sum(
            StudySession.duration_minutes
        ).label("total_minutes"),
        func.count(
            StudySession.session_id
        ).label("total_sessions"),
        func.max(
            StudySession.study_date
        ).label("last_studied")
    ).join(
        StudySession,
        Topic.topic_id == StudySession.topic_id
    ).filter(
        StudySession.user_id == current_user.user_id
    ).group_by(
        Topic.topic_id
    ).all()


    result = []

    for topic in topics:
        result.append(
            {
                "topic_id": topic.topic_id,
                "topic_name": topic.name,
                "total_minutes": topic.total_minutes,
                "formatted_time": format_duration(
                    topic.total_minutes
                ),
                "total_sessions": topic.total_sessions,
                "last_studied": topic.last_studied
            }
        )

    return result

@router.get("/progress/sub-topics")
def sub_topic_progress(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    sub_topics = db.query(
        SubTopic.sub_topic_id,
        SubTopic.name,
        func.sum(
            StudySession.duration_minutes
        ).label("total_minutes"),
        func.count(
            StudySession.session_id
        ).label("total_sessions"),
        func.max(
            StudySession.study_date
        ).label("last_studied")
    ).join(
        StudySession,
        SubTopic.sub_topic_id == StudySession.sub_topic_id
    ).filter(
        StudySession.user_id == current_user.user_id
    ).group_by(
        SubTopic.sub_topic_id
    ).all()


    result = []

    for sub_topic in sub_topics:
        result.append(
            {
                "sub_topic_id": sub_topic.sub_topic_id,
                "sub_topic_name": sub_topic.name,
                "total_minutes": sub_topic.total_minutes,
                "formatted_time": format_duration(
                    sub_topic.total_minutes
                ),
                "total_sessions": sub_topic.total_sessions,
                "last_studied": sub_topic.last_studied
            }
        )

    return result

@router.get("/analytics/streak")
def study_streak(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    study_dates = db.query(
        StudySession.study_date
    ).filter(
        StudySession.user_id == current_user.user_id
    ).distinct().order_by(
        StudySession.study_date.desc()
    ).all()


    if not study_dates:
        return {
            "current_streak": 0,
            "longest_streak": 0,
            "last_studied": None
        }


    dates = [
        item.study_date
        for item in study_dates
    ]


    # Current streak

    current_streak = 1

    for i in range(len(dates) - 1):

        difference = dates[i] - dates[i + 1]

        if difference == timedelta(days=1):
            current_streak += 1
        else:
            break


    # Longest streak

    longest_streak = 1
    temp_streak = 1

    sorted_dates = sorted(dates)


    for i in range(1, len(sorted_dates)):

        difference = (
            sorted_dates[i] -
            sorted_dates[i - 1]
        )

        if difference == timedelta(days=1):
            temp_streak += 1
        else:
            temp_streak = 1


        if temp_streak > longest_streak:
            longest_streak = temp_streak


    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "last_studied": dates[0]
    }

@router.get("/analytics/weekly")
def weekly_analytics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    today = date.today()

    start_date = today - timedelta(days=6)


    weekly_data = db.query(
        func.sum(
            StudySession.duration_minutes
        ).label("total_minutes"),
        func.count(
            StudySession.session_id
        ).label("total_sessions")
    ).filter(
        StudySession.user_id == current_user.user_id,
        StudySession.study_date >= start_date,
        StudySession.study_date <= today
    ).first()


    total_minutes = weekly_data.total_minutes or 0


    return {
        "start_date": start_date,
        "end_date": today,
        "total_minutes": total_minutes,
        "formatted_time": format_duration(total_minutes),
        "total_sessions": weekly_data.total_sessions
    }

@router.get("/analytics/monthly")
def monthly_analytics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    today = date.today()

    start_date = today.replace(day=1)


    monthly_data = db.query(
        func.sum(
            StudySession.duration_minutes
        ).label("total_minutes"),
        func.count(
            StudySession.session_id
        ).label("total_sessions")
    ).filter(
        StudySession.user_id == current_user.user_id,
        StudySession.study_date >= start_date,
        StudySession.study_date <= today
    ).first()


    total_minutes = monthly_data.total_minutes or 0


    return {
        "month": today.strftime("%B"),
        "year": today.year,
        "total_minutes": total_minutes,
        "formatted_time": format_duration(total_minutes),
        "total_sessions": monthly_data.total_sessions
    }

