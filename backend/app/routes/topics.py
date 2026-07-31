from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session


from app.database.connection import get_db

from app.models.topic import Topic

from app.schemas.topic import TopicCreate

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


    topic = Topic(

        name=data.name,

        subject_id=data.subject_id

    )



    db.add(topic)

    db.commit()

    db.refresh(topic)



    return success_response(

        data=topic,

        message="Topic created successfully"

    )








@router.get("")
def get_topics(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):


    topics = db.query(Topic).all()



    return success_response(

        data=topics,

        message="Topics fetched successfully"

    )








@router.get("/subject/{subject_id}")
def get_topics_by_subject(

    subject_id:int,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):


    topics = (

        db.query(Topic)

        .filter(

            Topic.subject_id == subject_id

        )

        .all()

    )



    return success_response(

        data=topics,

        message="Topics fetched successfully"

    )








@router.patch("/{topic_id}")
def update_topic(

    topic_id:int,

    data:TopicCreate,

    db:Session = Depends(get_db),

    current_user = Depends(get_current_user)

):


    topic = db.query(Topic).filter(

        Topic.topic_id == topic_id

    ).first()



    if not topic:


        raise HTTPException(

            status_code=404,

            detail="Topic not found"

        )



    topic.name = data.name

    topic.description = data.description

    topic.subject_id = data.subject_id



    db.commit()

    db.refresh(topic)



    return success_response(

        data=topic,

        message="Topic updated successfully"

    )








@router.delete("/{topic_id}")
def delete_topic(

    topic_id:int,

    db:Session = Depends(get_db),

    current_user = Depends(get_current_user)

):


    topic = db.query(Topic).filter(

        Topic.topic_id == topic_id

    ).first()



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