from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models import Subject
from app.schemas import SubjectCreate, SubjectResponse
from app.utils.security import get_current_user

from app.core.response import success_response


router = APIRouter()


@router.post("/subjects")
def create_subject(

    subject_data: SubjectCreate,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    new_subject = Subject(

        user_id=current_user.user_id,

        name=subject_data.name,

        description=subject_data.description

    )

    db.add(new_subject)

    db.commit()

    db.refresh(new_subject)

    return success_response(

        data=SubjectResponse.model_validate(new_subject),

        message="Subject created successfully"

    )


@router.get("/subjects")
def get_subjects(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    subjects = db.query(Subject).filter(

        Subject.user_id == current_user.user_id

    ).all()

    return success_response(

        data=[
            SubjectResponse.model_validate(s) for s in subjects
        ],

        message="Subjects fetched successfully"

    )


@router.get("/subjects/{subject_id}")
def get_subject(

    subject_id:int,

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

    return success_response(

        data=SubjectResponse.model_validate(subject),

        message="Subject fetched successfully"

    )


@router.patch("/subjects/{subject_id}")
def update_subject(

    subject_id:int,

    subject_data:SubjectCreate,

    db:Session = Depends(get_db),

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

    subject.name = subject_data.name

    subject.description = subject_data.description

    db.commit()

    db.refresh(subject)

    return success_response(

        data=SubjectResponse.model_validate(subject),

        message="Subject updated successfully"

    )


@router.delete("/subjects/{subject_id}")
def delete_subject(

    subject_id:int,

    db:Session = Depends(get_db),

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

    db.delete(subject)

    db.commit()

    return success_response(

        data=None,

        message="Subject deleted successfully"

    )
