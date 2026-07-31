from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.models.sub_topic import SubTopic
from app.schemas.sub_topic import (
    SubTopicCreate,
    SubTopicResponse
)

from app.utils.security import get_current_user


router = APIRouter(
    prefix="/sub-topics",
    tags=["Sub Topics"]
)



# Create Sub Topic
@router.post(
    "",
    response_model=SubTopicResponse
)
def create_sub_topic(

    data: SubTopicCreate,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    sub_topic = SubTopic(

        name=data.name,

        topic_id=data.topic_id

    )


    db.add(sub_topic)

    db.commit()

    db.refresh(sub_topic)


    return sub_topic





# Get all sub topics
@router.get(
    "",
    response_model=list[SubTopicResponse]
)
def get_sub_topics(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    return db.query(SubTopic).all()






# Get sub topics by topic
@router.get(
    "/topic/{topic_id}",
    response_model=list[SubTopicResponse]
)
def get_sub_topics_by_topic(

    topic_id:int,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):


    sub_topics = db.query(SubTopic).filter(

        SubTopic.topic_id == topic_id

    ).all()


    return sub_topics

# Update Sub Topic
@router.patch(
    "/{sub_topic_id}",
    response_model=SubTopicResponse
)
def update_sub_topic(
    sub_topic_id: int,
    data: SubTopicCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    sub_topic = db.query(SubTopic).filter(
        SubTopic.sub_topic_id == sub_topic_id
    ).first()

    if not sub_topic:
        raise HTTPException(
            status_code=404,
            detail="Sub topic not found"
        )

    sub_topic.name = data.name
    sub_topic.description = data.description
    sub_topic.topic_id = data.topic_id

    db.commit()
    db.refresh(sub_topic)

    return sub_topic


# Delete Sub Topic
@router.delete("/{sub_topic_id}")
def delete_sub_topic(
    sub_topic_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    sub_topic = db.query(SubTopic).filter(
        SubTopic.sub_topic_id == sub_topic_id
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
