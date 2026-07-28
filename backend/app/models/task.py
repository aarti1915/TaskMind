from sqlalchemy import (
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey,
    Enum
)

from sqlalchemy.orm import Mapped, mapped_column, relationship

from datetime import datetime, date

import enum

from app.database.base import Base



class TaskPriority(str, enum.Enum):

    LOW = "LOW"

    MEDIUM = "MEDIUM"

    HIGH = "HIGH"




class TaskStatus(str, enum.Enum):

    PENDING = "PENDING"

    COMPLETED = "COMPLETED"





class Task(Base):

    __tablename__ = "tasks"



    task_id: Mapped[int] = mapped_column(

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



    title: Mapped[str] = mapped_column(

        String(200),

        nullable=False

    )



    description: Mapped[str | None] = mapped_column(

        String(500),

        nullable=True

    )



    priority: Mapped[TaskPriority] = mapped_column(

        Enum(TaskPriority),

        default=TaskPriority.MEDIUM,

        nullable=False

    )



    status: Mapped[TaskStatus] = mapped_column(

        Enum(TaskStatus),

        default=TaskStatus.PENDING,

        nullable=False

    )



    due_date: Mapped[date] = mapped_column(

        Date,

        nullable=False

    )



    completed_at: Mapped[datetime | None] = mapped_column(

        DateTime,

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

        back_populates="tasks"

    )



    subject = relationship(

        "Subject"

    )


    topic = relationship(

        "Topic"

    )


    sub_topic = relationship(

        "SubTopic"

    )