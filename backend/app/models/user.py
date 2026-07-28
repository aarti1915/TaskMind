from sqlalchemy import Integer, String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date

from app.database.base import Base
from datetime import datetime
from sqlalchemy import func


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    full_name: Mapped[str] = mapped_column(
    String(100),
    nullable=False
    )

    email: Mapped[str] = mapped_column(
    String(255),
    unique=True,
    nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
    String(255),
    nullable=False
    )

    profile_image: Mapped[str | None] = mapped_column(
    String(255),
    nullable=True
    )

    date_of_birth: Mapped[date | None] = mapped_column(
    nullable=True
    )

    timezone: Mapped[str] = mapped_column(
    String(50),
    nullable=False,
    default="Asia/Ahmedabad"
    )

    study_level: Mapped[str] = mapped_column(
    String(30),
    nullable=False
    )

    is_email_verified: Mapped[bool] = mapped_column(
    Boolean,
    default=False,
    nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
    DateTime,
    server_default=func.now(),
    nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    subjects = relationship(
    "Subject",
    back_populates="user",
    cascade="all, delete-orphan"
    )

    study_sessions = relationship(
    "StudySession",
    back_populates="user",
    cascade="all, delete-orphan"
    )

    tasks = relationship(
    "Task",
    back_populates="user"
    )

    