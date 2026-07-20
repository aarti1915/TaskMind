from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.database.base import Base


class Topic(Base):
    __tablename__ = "topics"

    topic_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    subject_id: Mapped[int] = mapped_column(
        ForeignKey("subjects.subject_id"),
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

    subject = relationship(
        "Subject",
        back_populates="topics"
    )

    sub_topics = relationship(
    "SubTopic",
    back_populates="topic",
    cascade="all, delete-orphan"
    )