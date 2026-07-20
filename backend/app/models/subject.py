from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.database.base import Base

class Subject(Base):
    __tablename__ = "subjects"

    subject_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id"),
        nullable=False
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="subjects"
    )

    topics = relationship(
    "Topic",
    back_populates="subject",
    cascade="all, delete-orphan"
    )

    study_sessions = relationship(
    "StudySession",
    back_populates="subject",
    cascade="all, delete-orphan"
    )