# TaskMind

TaskMind is a study planning and productivity web application.
It helps students organize their subjects, manage tasks, track study sessions, and see their study progress.

## Features

* User registration and login
* Create and manage subjects
* Organize subjects into topics and sub-topics
* Create and manage study tasks
* Set task priority and due dates
* Track study sessions
* Live study timer
* Manually add previous study sessions
* View study history
* View daily, weekly, and monthly study statistics
* Track study streak
* View study progress using charts
* Pomodoro timer
* User profile and settings
* Light and dark mode

## Technologies Used

### Frontend

* React
* Vite
* Axios
* React Router
* Recharts

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication
* Bcrypt

### Database

* MySQL

## Project Structure

```text
TaskMind/
│
├── frontend/
│   └── src/
│
├── backend/
│   └── app/
│       ├── models/
│       ├── routes/
│       ├── schemas/
│       ├── database/
│       └── core/
│
└── README.md
```

## How It Works

The application has a React frontend and a FastAPI backend.

```text
React Frontend
      ↓
FastAPI Backend
      ↓
SQLAlchemy
      ↓
MySQL Database
```

Users can create their subjects and organize them into topics and sub-topics. They can then create tasks and record their study sessions.

The dashboard shows the user's study statistics and progress.

## Authentication

The application uses JWT authentication for login and protected API routes.

Passwords are hashed before they are stored in the database.

## Running the Project

### Backend

First, create and activate a Python virtual environment.

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Create a `.env` file with your MySQL and JWT settings.

Then start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend will run on:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The terminal will show the local URL for the frontend.

## What I Learned From This Project

Through this project, I practiced:

* Building REST APIs using FastAPI
* Connecting a backend with MySQL
* Using SQLAlchemy for database operations
* Implementing JWT authentication
* Creating React components and pages
* Connecting React with backend APIs
* Managing application data
* Creating charts and study analytics
* Handling user-specific data
* Debugging and testing the application

## Future Improvements

Some improvements I may add in the future:

* More automated tests
* Export study data
* Deploy the application online
* Add more analytics
