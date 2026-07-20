from sqlalchemy import String, Integer, ForeignKey, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, date

from app.database.base import Base


class StudySession(Base):
    __tablename__ = "study_sessions"

    session_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id"),
        nullable=False
    )

    subject_id: Mapped[int] = mapped_column(
        ForeignKey("subjects.subject_id"),
        nullable=False
    )

    topic_id: Mapped[int] = mapped_column(
        ForeignKey("topics.topic_id"),
        nullable=False
    )

    sub_topic_id: Mapped[int] = mapped_column(
        ForeignKey("sub_topics.sub_topic_id"),
        nullable=False
    )

    study_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    duration_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    notes: Mapped[str | None] = mapped_column(
        String(500),
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
        back_populates="study_sessions"
    )

    subject = relationship(
        "Subject",
        back_populates="study_sessions"
    )

    topic = relationship(
        "Topic",
        back_populates="study_sessions"
    )

    sub_topic = relationship(
        "SubTopic",
        back_populates="study_sessions"
    )