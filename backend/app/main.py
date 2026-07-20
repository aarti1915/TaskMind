from fastapi import FastAPI

from app.routes import auth, users, subjects, topics, sub_topics

app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(subjects.router)
app.include_router(topics.router)
app.include_router(sub_topics.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to TaskMind API"
    }