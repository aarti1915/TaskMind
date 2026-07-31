from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.connection import get_db

from app.models.study_session import StudySession
from app.models import Subject, Topic, SubTopic

from app.schemas.study_session import (
    StudySessionCreate,
    StudySessionResponse
)

from app.utils.security import get_current_user


router = APIRouter()



def get_current_time():

    return datetime.now()



@router.post(
    "/study-sessions/start",
    response_model=StudySessionResponse
)
def start_session(

    data: StudySessionCreate,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):


    subject = db.query(Subject).filter(

        Subject.subject_id == data.subject_id,

        Subject.user_id == current_user.user_id

    ).first()



    if not subject:

        raise HTTPException(

            status_code=404,

            detail="Subject not found"

        )



    topic = db.query(Topic).filter(

        Topic.topic_id == data.topic_id,

        Topic.subject_id == data.subject_id

    ).first()



    if not topic:

        raise HTTPException(

            status_code=404,

            detail="Topic does not belong to subject"

        )



    sub_topic = db.query(SubTopic).filter(

        SubTopic.sub_topic_id == data.sub_topic_id,

        SubTopic.topic_id == data.topic_id

    ).first()



    if not sub_topic:

        raise HTTPException(

            status_code=404,

            detail="Sub-topic does not belong to topic"

        )



    old_session = db.query(StudySession).filter(

        StudySession.user_id == current_user.user_id,

        StudySession.end_time == None

    ).first()



    if old_session:


        old_session.end_time = datetime.now()


        old_session.duration_minutes = int(

            (

                old_session.end_time -

                old_session.start_time

            ).total_seconds() / 60

        )




    session = StudySession(

        user_id=current_user.user_id,

        subject_id=data.subject_id,

        topic_id=data.topic_id,

        sub_topic_id=data.sub_topic_id,

        start_time=datetime.now()

    )



    db.add(session)

    db.commit()

    db.refresh(session)



    return session






@router.get(
    "/study-sessions/active",
    response_model=StudySessionResponse | None
)
def active_session(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):


    return db.query(StudySession).filter(

        StudySession.user_id == current_user.user_id,

        StudySession.end_time == None

    ).first()






@router.patch(
    "/study-sessions/{session_id}/end",
    response_model=StudySessionResponse
)
def end_session(

    session_id:int,

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

            detail="Session not found"

        )



    session.end_time = get_current_time()



    session.duration_minutes = int(

        (

            session.end_time -

            session.start_time

        ).total_seconds() / 60

    )



    db.commit()

    db.refresh(session)



    return session






@router.get(
    "/study-sessions"
)
def get_sessions(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):


    sessions = (

        db.query(

            StudySession,

            Subject.name.label("subject_name"),

            Topic.name.label("topic_name"),

            SubTopic.name.label("sub_topic_name")

        )

        .join(

            Subject,

            StudySession.subject_id == Subject.subject_id

        )

        .join(

            Topic,

            StudySession.topic_id == Topic.topic_id

        )

        .join(

            SubTopic,

            StudySession.sub_topic_id == SubTopic.sub_topic_id

        )

        .filter(

            StudySession.user_id == current_user.user_id

        )

        .all()

    )



    result = []



    for session, subject_name, topic_name, sub_topic_name in sessions:


        result.append({

            "session_id": session.session_id,

            "subject_id": session.subject_id,

            "topic_id": session.topic_id,

            "sub_topic_id": session.sub_topic_id,

            "subject_name": subject_name,

            "topic_name": topic_name,

            "sub_topic_name": sub_topic_name,

            "start_time": session.start_time,

            "end_time": session.end_time,

            "duration_minutes": session.duration_minutes,

            "created_at": session.created_at

        })



    return result






@router.delete(
    "/study-sessions/{session_id}"
)
def delete_session(

    session_id:int,

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

            detail="Session not found"

        )



    db.delete(session)

    db.commit()



    return {

        "message":"Session deleted"

    }