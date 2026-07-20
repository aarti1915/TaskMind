from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.utils.security import get_current_user

from app.models import (
    StudySession,
    Subject,
    Topic,
    SubTopic
)

from app.schemas import (
    StudySessionCreate,
    StudySessionResponse
)


router = APIRouter()

@router.post("/study-sessions", response_model=StudySessionResponse)
def create_study_session(
    session: StudySessionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    sub_topic = db.query(SubTopic).join(Topic).join(Subject).filter(
        SubTopic.sub_topic_id == session.sub_topic_id,
        Topic.topic_id == session.topic_id,
        Subject.subject_id == session.subject_id,
        Subject.user_id == current_user.user_id
    ).first()

    if not sub_topic:
        raise HTTPException(
            status_code=404,
            detail="Subject, topic or sub-topic not found"
        )

    new_session = StudySession(
        user_id=current_user.user_id,
        subject_id=session.subject_id,
        topic_id=session.topic_id,
        sub_topic_id=session.sub_topic_id,
        study_date=session.study_date,
        duration_minutes=session.duration_minutes,
        notes=session.notes
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session

@router.get("/study-sessions", response_model=list[StudySessionResponse])
def get_study_sessions(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    sessions = db.query(StudySession).filter(
        StudySession.user_id == current_user.user_id
    ).all()

    return sessions

@router.get("/study-sessions/{session_id}", response_model=StudySessionResponse)
def get_study_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    session = db.query(StudySession).filter(
        StudySession.session_id == session_id,
        StudySession.user_id == current_user.user_id
    ).first()

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Study session not found"
        )

    return session

@router.patch("/study-sessions/{session_id}", response_model=StudySessionResponse)
def update_study_session(
    session_id: int,
    session_data: StudySessionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    study_session = db.query(StudySession).filter(
        StudySession.session_id == session_id,
        StudySession.user_id == current_user.user_id
    ).first()

    if not study_session:
        raise HTTPException(
            status_code=404,
            detail="Study session not found"
        )

    sub_topic = db.query(SubTopic).join(Topic).join(Subject).filter(
        SubTopic.sub_topic_id == session_data.sub_topic_id,
        Topic.topic_id == session_data.topic_id,
        Subject.subject_id == session_data.subject_id,
        Subject.user_id == current_user.user_id
    ).first()

    if not sub_topic:
        raise HTTPException(
            status_code=404,
            detail="Subject, topic or sub-topic not found"
        )

    study_session.subject_id = session_data.subject_id
    study_session.topic_id = session_data.topic_id
    study_session.sub_topic_id = session_data.sub_topic_id
    study_session.study_date = session_data.study_date
    study_session.duration_minutes = session_data.duration_minutes
    study_session.notes = session_data.notes

    db.commit()
    db.refresh(study_session)

    return study_session

@router.delete("/study-sessions/{session_id}")
def delete_study_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    study_session = db.query(StudySession).filter(
        StudySession.session_id == session_id,
        StudySession.user_id == current_user.user_id
    ).first()

    if not study_session:
        raise HTTPException(
            status_code=404,
            detail="Study session not found"
        )

    db.delete(study_session)
    db.commit()

    return {
        "message": "Study session deleted successfully"
    }