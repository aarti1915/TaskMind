from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.database.base import Base


class SubTopic(Base):
    __tablename__ = "sub_topics"

    sub_topic_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    topic_id: Mapped[int] = mapped_column(
        ForeignKey("topics.topic_id"),
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

    topic = relationship(
        "Topic",
        back_populates="sub_topics"
    )

    study_sessions = relationship(
    "StudySession",
    back_populates="sub_topic",
    cascade="all, delete-orphan"
    )
    