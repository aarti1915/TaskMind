from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.utils.security import get_current_user

from app.models import Subject
from app.schemas import SubjectCreate, SubjectResponse


router = APIRouter()


@router.post("/subjects", response_model=SubjectResponse)
def create_subject(
    subject: SubjectCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_subject = Subject(
        user_id=current_user.user_id,
        name=subject.name,
        description=subject.description
    )

    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)

    return new_subject


@router.get("/subjects", response_model=list[SubjectResponse])
def get_subjects(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    subjects = db.query(Subject).filter(
        Subject.user_id == current_user.user_id
    ).all()

    return subjects


@router.get("/subjects/{subject_id}", response_model=SubjectResponse)
def get_subject(
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

    return subject

@router.patch("/subjects/{subject_id}", response_model=SubjectResponse)
def update_subject(
    subject_id: int,
    subject_data: SubjectCreate,
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

    subject.name = subject_data.name
    subject.description = subject_data.description

    db.commit()
    db.refresh(subject)

    return subject

@router.delete("/subjects/{subject_id}")
def delete_subject(
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

    db.delete(subject)
    db.commit()

    return {
        "message": "Subject deleted successfully"
    }