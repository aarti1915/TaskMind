from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.utils.security import get_current_user

from app.models import Topic, Subject
from app.schemas import TopicCreate, TopicResponse


router = APIRouter()


@router.post("/topics", response_model=TopicResponse)
def create_topic(
    topic: TopicCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    subject = db.query(Subject).filter(
        Subject.subject_id == topic.subject_id,
        Subject.user_id == current_user.user_id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    new_topic = Topic(
        subject_id=topic.subject_id,
        name=topic.name,
        description=topic.description
    )

    db.add(new_topic)
    db.commit()
    db.refresh(new_topic)

    return new_topic


@router.get("/topics", response_model=list[TopicResponse])
def get_topics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    topics = db.query(Topic).join(Subject).filter(
        Subject.user_id == current_user.user_id
    ).all()

    return topics


@router.get("/subjects/{subject_id}/topics", response_model=list[TopicResponse])
def get_subject_topics(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    subject = db.query(Subject).filter(
        Subject.subject_id == subject_id,
        Subject.user_id == current_user.user_id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    topics = db.query(Topic).filter(
        Topic.subject_id == subject_id
    ).all()

    return topics


@router.get("/topics/{topic_id}", response_model=TopicResponse)
def get_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    topic = db.query(Topic).join(Subject).filter(
        Topic.topic_id == topic_id,
        Subject.user_id == current_user.user_id
    ).first()

    if not topic:
        raise HTTPException(
            status_code=404,
            detail="Topic not found"
        )

    return topic


@router.patch("/topics/{topic_id}", response_model=TopicResponse)
def update_topic(
    topic_id: int,
    topic_data: TopicCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    topic = db.query(Topic).join(Subject).filter(
        Topic.topic_id == topic_id,
        Subject.user_id == current_user.user_id
    ).first()

    if not topic:
        raise HTTPException(
            status_code=404,
            detail="Topic not found"
        )

    topic.name = topic_data.name
    topic.description = topic_data.description

    db.commit()
    db.refresh(topic)

    return topic


@router.delete("/topics/{topic_id}")
def delete_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    topic = db.query(Topic).join(Subject).filter(
        Topic.topic_id == topic_id,
        Subject.user_id == current_user.user_id
    ).first()

    if not topic:
        raise HTTPException(
            status_code=404,
            detail="Topic not found"
        )

    db.delete(topic)
    db.commit()

    return {
        "message": "Topic deleted successfully"
    }