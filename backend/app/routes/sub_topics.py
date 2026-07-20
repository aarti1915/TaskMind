from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.utils.security import get_current_user

from app.models import SubTopic, Topic, Subject
from app.schemas import SubTopicCreate, SubTopicResponse


router = APIRouter()


@router.post("/sub-topics", response_model=SubTopicResponse)
def create_sub_topic(
    sub_topic: SubTopicCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    topic = db.query(Topic).join(Subject).filter(
        Topic.topic_id == sub_topic.topic_id,
        Subject.user_id == current_user.user_id
    ).first()

    if not topic:
        raise HTTPException(
            status_code=404,
            detail="Topic not found"
        )

    new_sub_topic = SubTopic(
        topic_id=sub_topic.topic_id,
        name=sub_topic.name,
        description=sub_topic.description
    )

    db.add(new_sub_topic)
    db.commit()
    db.refresh(new_sub_topic)

    return new_sub_topic


@router.get("/sub-topics", response_model=list[SubTopicResponse])
def get_sub_topics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    sub_topics = db.query(SubTopic).join(Topic).join(Subject).filter(
        Subject.user_id == current_user.user_id
    ).all()

    return sub_topics


@router.get("/topics/{topic_id}/sub-topics", response_model=list[SubTopicResponse])
def get_topic_sub_topics(
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

    sub_topics = db.query(SubTopic).filter(
        SubTopic.topic_id == topic_id
    ).all()

    return sub_topics


@router.get("/sub-topics/{sub_topic_id}", response_model=SubTopicResponse)
def get_sub_topic(
    sub_topic_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    sub_topic = db.query(SubTopic).join(Topic).join(Subject).filter(
        SubTopic.sub_topic_id == sub_topic_id,
        Subject.user_id == current_user.user_id
    ).first()

    if not sub_topic:
        raise HTTPException(
            status_code=404,
            detail="Sub topic not found"
        )

    return sub_topic


@router.patch("/sub-topics/{sub_topic_id}", response_model=SubTopicResponse)
def update_sub_topic(
    sub_topic_id: int,
    sub_topic_data: SubTopicCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    sub_topic = db.query(SubTopic).join(Topic).join(Subject).filter(
        SubTopic.sub_topic_id == sub_topic_id,
        Subject.user_id == current_user.user_id
    ).first()

    if not sub_topic:
        raise HTTPException(
            status_code=404,
            detail="Sub topic not found"
        )

    sub_topic.name = sub_topic_data.name
    sub_topic.description = sub_topic_data.description

    db.commit()
    db.refresh(sub_topic)

    return sub_topic


@router.delete("/sub-topics/{sub_topic_id}")
def delete_sub_topic(
    sub_topic_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    sub_topic = db.query(SubTopic).join(Topic).join(Subject).filter(
        SubTopic.sub_topic_id == sub_topic_id,
        Subject.user_id == current_user.user_id
    ).first()

    if not sub_topic:
        raise HTTPException(
            status_code=404,
            detail="Sub topic not found"
        )

    db.delete(sub_topic)
    db.commit()

    return {
        "message": "Sub topic deleted successfully"
    }