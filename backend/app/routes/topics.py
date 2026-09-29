from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.models.topic import Topic
from app.models.subject import Subject

from app.schemas.topic import TopicCreate, TopicResponse

from app.utils.security import get_current_user

from app.core.response import success_response


router = APIRouter(
    prefix="/topics",
    tags=["Topics"]
)


@router.post("")
def create_topic(

    data: TopicCreate,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    # A topic must belong to a subject owned by the current user —
    # otherwise anyone could attach a topic to someone else's subject_id.
    subject = db.query(Subject).filter(

        Subject.subject_id == data.subject_id,

        Subject.user_id == current_user.user_id

    ).first()

    if not subject:

        raise HTTPException(

            status_code=404,

            detail="Subject not found"

        )

    topic = Topic(

        name=data.name,

        description=data.description,

        subject_id=data.subject_id

    )

    db.add(topic)

    db.commit()

    db.refresh(topic)

    return success_response(

        data=TopicResponse.model_validate(topic),

        message="Topic created successfully"

    )


@router.get("")
def get_topics(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    # Was previously returning ALL users' topics — scope to the
    # current user's subjects.
    topics = (

        db.query(Topic)

        .join(Subject, Topic.subject_id == Subject.subject_id)

        .filter(Subject.user_id == current_user.user_id)

        .all()

    )

    return success_response(

        data=[
            TopicResponse.model_validate(t) for t in topics
        ],

        message="Topics fetched successfully"

    )


@router.get("/subject/{subject_id}")
def get_topics_by_subject(

    subject_id:int,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    # Verify the subject itself belongs to the current user before
    # returning its topics — otherwise any logged-in user could read
    # another user's topics just by guessing a subject_id.
    subject = db.query(Subject).filter(

        Subject.subject_id == subject_id,

        Subject.user_id == current_user.user_id

    ).first()

    if not subject:

        raise HTTPException(

            status_code=404,

            detail="Subject not found"

        )

    topics = (

        db.query(Topic)

        .filter(

            Topic.subject_id == subject_id

        )

        .all()

    )

    return success_response(

        data=[
            TopicResponse.model_validate(t) for t in topics
        ],

        message="Topics fetched successfully"

    )


@router.patch("/{topic_id}")
def update_topic(

    topic_id:int,

    data:TopicCreate,

    db:Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

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

    new_subject = (
        db.query(Subject)
        .filter(
            Subject.subject_id == data.subject_id,
            Subject.user_id == current_user.user_id
        )
        .first()
    )

    if not new_subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    topic.name = data.name

    topic.description = data.description

    topic.subject_id = data.subject_id

    db.commit()

    db.refresh(topic)

    return success_response(

        data=TopicResponse.model_validate(topic),

        message="Topic updated successfully"

    )


@router.delete("/{topic_id}")
def delete_topic(

    topic_id:int,

    db:Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

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

    db.delete(topic)

    db.commit()

    return success_response(

        data=None,

        message="Topic deleted successfully"

    )
