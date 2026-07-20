from pydantic import BaseModel
from datetime import date


class DashboardSummaryResponse(BaseModel):
    total_sessions: int
    total_minutes: int
    formatted_time: str
    subjects_studied: int
    topics_studied: int
    sub_topics_studied: int


class DailyAnalyticsResponse(BaseModel):
    date: date
    total_minutes: int
    formatted_time: str


class ProgressResponse(BaseModel):
    id: int
    name: str
    total_minutes: int
    formatted_time: str
    total_sessions: int
    last_studied: date | None


class StreakResponse(BaseModel):
    current_streak: int
    longest_streak: int
    last_studied: date | None


class PeriodAnalyticsResponse(BaseModel):
    total_minutes: int
    formatted_time: str
    total_sessions: int