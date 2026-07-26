from fastapi import FastAPI

from app.routes import auth, users, subjects, topics, sub_topics
from app.routes import study_sessions, dashboard, analytics

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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