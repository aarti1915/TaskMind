from fastapi import FastAPI

from app.routes import auth, users

from app import models

app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {"message": "Welcome to TaskMind API"}