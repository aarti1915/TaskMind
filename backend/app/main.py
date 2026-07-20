from fastapi import FastAPI

from app.routes import auth, users, subjects, topics, sub_topics
from app.routes import study_sessions
from app.routes import dashboard
from app.routes import analytics

app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(subjects.router)
app.include_router(topics.router)
app.include_router(sub_topics.router)

app.include_router(study_sessions.router)
app.include_router(dashboard.router)
app.include_router(analytics.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to TaskMind API"
    }