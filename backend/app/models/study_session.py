from sqlalchemy import (
    Integer,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from datetime import datetime

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





    start_time: Mapped[datetime] = mapped_column(

        DateTime,

        nullable=False,

        default=datetime.utcnow

    )





    end_time: Mapped[datetime | None] = mapped_column(

        DateTime,

        nullable=True

    )





    duration_minutes: Mapped[int | None] = mapped_column(

        Integer,

        nullable=True

    )





    created_at: Mapped[datetime] = mapped_column(

        DateTime,

        default=datetime.utcnow

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