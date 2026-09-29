from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.models.sub_topic import SubTopic
from app.models.topic import Topic
from app.models.subject import Subject

from app.schemas.sub_topic import SubTopicCreate, SubTopicResponse

from app.utils.security import get_current_user

from app.core.response import success_response


router = APIRouter(

    prefix="/sub-topics",

    tags=["Sub Topics"]

)


@router.post("")
def create_sub_topic(

    data:SubTopicCreate,

    db:Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    # A sub-topic must belong to a topic under a subject owned by the
    # current user.
    topic = (

        db.query(Topic)

        .join(Subject, Topic.subject_id == Subject.subject_id)

        .filter(

            Topic.topic_id == data.topic_id,

            Subject.user_id == current_user.user_id

        )

        .first()

    )

    if not topic:

        raise HTTPException(

            status_code=404,

            detail="Topic not found"

        )

    sub_topic = SubTopic(

        name=data.name,

        description=data.description,

        topic_id=data.topic_id

    )

    db.add(sub_topic)

    db.commit()

    db.refresh(sub_topic)

    return success_response(

        data=SubTopicResponse.model_validate(sub_topic),

        message="Sub topic created successfully"

    )


@router.get("")
def get_sub_topics(

    db:Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    # Was previously returning ALL users' sub-topics — scope to the
    # current user's subjects/topics.
    sub_topics = (

        db.query(SubTopic)

        .join(Topic, SubTopic.topic_id == Topic.topic_id)

        .join(Subject, Topic.subject_id == Subject.subject_id)

        .filter(Subject.user_id == current_user.user_id)

        .all()

    )

    return success_response(

        data=[
            SubTopicResponse.model_validate(s) for s in sub_topics
        ],

        message="Sub topics fetched successfully"

    )


@router.get("/topic/{topic_id}")
def get_sub_topics_by_topic(

    topic_id:int,

    db:Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    # Verify the topic belongs to the current user before returning
    # its sub-topics.
    topic = (

        db.query(Topic)

        .join(Subject, Topic.subject_id == Subject.subject_id)

        .filter(

            Topic.topic_id == topic_id,

            Subject.user_id == current_user.user_id

        )

        .first()

    )

    if not topic:

        raise HTTPException(

            status_code=404,

            detail="Topic not found"

        )

    sub_topics = db.query(SubTopic).filter(

        SubTopic.topic_id == topic_id

    ).all()

    return success_response(

        data=[
            SubTopicResponse.model_validate(s) for s in sub_topics
        ],

        message="Sub topics fetched successfully"

    )


@router.patch("/{sub_topic_id}")
def update_sub_topic(

    sub_topic_id:int,

    data:SubTopicCreate,

    db:Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    sub_topic = (

        db.query(SubTopic)

        .join(Topic, SubTopic.topic_id == Topic.topic_id)

        .join(Subject, Topic.subject_id == Subject.subject_id)

        .filter(

            SubTopic.sub_topic_id == sub_topic_id,

            Subject.user_id == current_user.user_id

        )

        .first()

    )

    if not sub_topic:

        raise HTTPException(

            status_code=404,

            detail="Sub topic not found"

        )

    new_topic = (
        db.query(Topic)
        .join(Subject, Topic.subject_id == Subject.subject_id)
        .filter(
            Topic.topic_id == data.topic_id,
            Subject.user_id == current_user.user_id
        )
        .first()
    )

    if not new_topic:
        raise HTTPException(
            status_code=404,
            detail="Topic not found"
        )

    sub_topic.name = data.name

    sub_topic.description = data.description

    sub_topic.topic_id = data.topic_id

    db.commit()

    db.refresh(sub_topic)

    return success_response(

        data=SubTopicResponse.model_validate(sub_topic),

        message="Sub topic updated successfully"

    )


@router.delete("/{sub_topic_id}")
def delete_sub_topic(

    sub_topic_id:int,

    db:Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    sub_topic = (

        db.query(SubTopic)

        .join(Topic, SubTopic.topic_id == Topic.topic_id)

        .join(Subject, Topic.subject_id == Subject.subject_id)

        .filter(

            SubTopic.sub_topic_id == sub_topic_id,

            Subject.user_id == current_user.user_id

        )

        .first()

    )

    if not sub_topic:

        raise HTTPException(

            status_code=404,

            detail="Sub topic not found"

        )

    db.delete(sub_topic)

    db.commit()

    return success_response(

        data=None,

        message="Sub topic deleted successfully"

    )
