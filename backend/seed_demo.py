from datetime import datetime, date, timedelta

from app.database.connection import SessionLocal
from app.models.user import User
from app.models.subject import Subject
from app.models.topic import Topic
from app.models.sub_topic import SubTopic
from app.models.task import Task, TaskPriority, TaskStatus
from app.models.study_session import StudySession
from app.utils.password import hash_password


# ============================================================
# DEMO LOGIN DETAILS
# ============================================================

DEMO_PASSWORD = "TaskMind@123"

SCHOOL_EMAIL = "riya.shah@example.com"
COLLEGE_EMAIL = "aarav.mehta@example.com"


# ============================================================
# SCHOOL DATA — RIYA SHAH
# ============================================================

SCHOOL_DATA = {
    "Mathematics": {
        "Real Numbers": [
            "Euclid's Division Lemma",
            "Fundamental Theorem of Arithmetic",
        ],
        "Algebra": [
            "Polynomials",
            "Pair of Linear Equations",
        ],
        "Geometry": [
            "Triangles",
            "Coordinate Geometry",
        ],
    },

    "Science": {
        "Chemistry": [
            "Chemical Reactions",
            "Acids, Bases and Salts",
        ],
        "Biology": [
            "Life Processes",
            "Control and Coordination",
        ],
        "Physics": [
            "Light",
            "Electricity",
        ],
    },

    "English": {
        "Grammar": [
            "Tenses",
            "Subject-Verb Agreement",
        ],
        "Reading": [
            "Reading Comprehension",
            "Literary Devices",
        ],
        "Writing": [
            "Formal Letter",
            "Analytical Paragraph",
        ],
    },

    "Social Science": {
        "History": [
            "Nationalism in India",
            "Industrialisation",
        ],
        "Geography": [
            "Resources and Development",
            "Agriculture",
        ],
        "Civics": [
            "Power Sharing",
            "Federalism",
        ],
    },

    "Computer Applications": {
        "Computer Fundamentals": [
            "Hardware and Software",
            "Operating Systems",
        ],
        "Internet and Networking": [
            "Internet Basics",
            "Computer Networks",
        ],
        "Office Applications": [
            "Word Processing",
            "Spreadsheets",
        ],
    },

    "Hindi": {
        "व्याकरण": [
            "संधि",
            "समास",
        ],
        "गद्य": [
            "पाठ का सार",
            "प्रश्न उत्तर",
        ],
        "लेखन": [
            "पत्र लेखन",
            "अनुच्छेद लेखन",
        ],
    },

    "General Knowledge": {
        "India": [
            "States and Capitals",
            "Indian Constitution",
        ],
        "Science and Technology": [
            "Space and Satellites",
            "Important Inventions",
        ],
        "Sports": [
            "Major Tournaments",
            "Indian Sports Personalities",
        ],
    },
}


# ============================================================
# COLLEGE DATA — AARAV MEHTA
# ============================================================

COLLEGE_DATA = {
    "Engineering Mathematics": {
        "Calculus": [
            "Limits and Continuity",
            "Differentiation",
        ],
        "Linear Algebra": [
            "Matrices",
            "Eigenvalues and Eigenvectors",
        ],
        "Differential Equations": [
            "First Order Equations",
            "Higher Order Equations",
        ],
    },

    "Digital Electronics": {
        "Digital Fundamentals": [
            "Number Systems",
            "Boolean Algebra",
        ],
        "Combinational Circuits": [
            "Multiplexers and Decoders",
            "Adders and Comparators",
        ],
        "Sequential Circuits": [
            "Flip-Flops",
            "Counters and Registers",
        ],
    },

    "Computer Organization": {
        "CPU Organization": [
            "Registers",
            "Instruction Cycle",
        ],
        "Memory Organization": [
            "Cache Memory",
            "Memory Mapping",
        ],
        "Pipelining": [
            "Pipeline Stages",
            "Pipeline Hazards",
        ],
    },

    "Data Structures": {
        "Linear Data Structures": [
            "Arrays",
            "Linked Lists",
        ],
        "Stacks and Queues": [
            "Stack Operations",
            "Queue Operations",
        ],
        "Trees": [
            "Binary Trees",
            "Binary Search Trees",
        ],
    },

    "Database Management Systems": {
        "Database Fundamentals": [
            "DBMS Concepts",
            "ER Model",
        ],
        "Relational Model": [
            "Relational Algebra",
            "SQL Queries",
        ],
        "Database Design": [
            "Normalization",
            "Transactions",
        ],
    },

    "Operating Systems": {
        "Process Management": [
            "Processes and Threads",
            "CPU Scheduling",
        ],
        "Memory Management": [
            "Paging",
            "Virtual Memory",
        ],
        "File Systems": [
            "File Allocation",
            "Directory Structure",
        ],
    },

    "Computer Networks": {
        "Networking Fundamentals": [
            "Network Models",
            "Transmission Media",
        ],
        "Transport Layer": [
            "TCP",
            "UDP",
        ],
        "Network Layer": [
            "IP Addressing",
            "Routing",
        ],
    },

    "Programming": {
        "Programming Fundamentals": [
            "Variables and Data Types",
            "Functions",
        ],
        "Object Oriented Programming": [
            "Classes and Objects",
            "Inheritance",
        ],
        "Problem Solving": [
            "Searching",
            "Sorting",
        ],
    },

    "Communication Skills": {
        "Communication Fundamentals": [
            "Verbal Communication",
            "Non-Verbal Communication",
        ],
        "Professional Writing": [
            "Email Writing",
            "Technical Writing",
        ],
        "Presentation Skills": [
            "Presentation Structure",
            "Public Speaking",
        ],
    },
}


# ============================================================
# DATABASE
# ============================================================

db = SessionLocal()


# ============================================================
# RESET ONLY DEMO USERS
# ============================================================

def reset_demo_data():
    users = db.query(User).filter(
        User.email.in_([
            SCHOOL_EMAIL,
            COLLEGE_EMAIL
        ])
    ).all()

    for user in users:

        # Tasks do not have delete-orphan cascade on User.
        db.query(Task).filter(
            Task.user_id == user.user_id
        ).delete(
            synchronize_session=False
        )

        # Remove study sessions.
        db.query(StudySession).filter(
            StudySession.user_id == user.user_id
        ).delete(
            synchronize_session=False
        )

        # Delete subjects through ORM so their
        # Topic/SubTopic cascade is respected.
        subjects = db.query(Subject).filter(
            Subject.user_id == user.user_id
        ).all()

        for subject in subjects:
            db.delete(subject)

        db.flush()

        db.delete(user)

    db.commit()


# ============================================================
# CREATE USER
# ============================================================

def create_user(
    full_name,
    email,
    study_level,
    dob
):
    user = User(
        full_name=full_name,
        email=email,
        password_hash=hash_password(DEMO_PASSWORD),
        date_of_birth=dob,
        timezone="Asia/Ahmedabad",
        study_level=study_level,
        is_email_verified=True,
    )

    db.add(user)
    db.flush()

    return user


# ============================================================
# CREATE SUBJECT → TOPIC → SUBTOPIC
# ============================================================

def create_structure(user, data):

    subjects = {}

    for subject_name, topics_data in data.items():

        subject = Subject(
            user_id=user.user_id,
            name=subject_name,
            description=(
                f"{subject_name} study materials "
                f"and progress tracking"
            ),
        )

        db.add(subject)
        db.flush()

        subjects[subject_name] = {
            "object": subject,
            "topics": {}
        }

        for topic_name, subtopics in topics_data.items():

            topic = Topic(
                subject_id=subject.subject_id,
                name=topic_name,
                description=(
                    f"{topic_name} concepts and practice"
                ),
            )

            db.add(topic)
            db.flush()

            subjects[subject_name]["topics"][topic_name] = {
                "object": topic,
                "subtopics": {}
            }

            for subtopic_name in subtopics:

                sub_topic = SubTopic(
                    topic_id=topic.topic_id,
                    name=subtopic_name,
                    description=(
                        f"Study and practice "
                        f"{subtopic_name}"
                    ),
                )

                db.add(sub_topic)
                db.flush()

                subjects[subject_name]["topics"][
                    topic_name
                ]["subtopics"][subtopic_name] = sub_topic

    return subjects


# ============================================================
# CREATE REALISTIC TASKS
# ============================================================

def create_tasks(user, data, structure, completion_rate):

    counter = 0

    for subject_name, topics_data in data.items():

        subject = structure[subject_name]["object"]

        for topic_name, subtopics in topics_data.items():

            topic = structure[
                subject_name
            ]["topics"][topic_name]["object"]

            for subtopic_name in subtopics:

                sub_topic = structure[
                    subject_name
                ]["topics"][topic_name]["subtopics"][
                    subtopic_name
                ]

                counter += 1

                # Most sub-topics get one task.
                completed = (
                    counter % 10
                    < int(completion_rate * 10)
                )

                due_offset = (counter % 18) - 8

                due_date = (
                    date.today()
                    + timedelta(days=due_offset)
                )

                if counter % 7 == 0:
                    priority = TaskPriority.HIGH

                elif counter % 4 == 0:
                    priority = TaskPriority.LOW

                else:
                    priority = TaskPriority.MEDIUM

                completed_at = None

                if completed:
                    completed_at = datetime.combine(
                        due_date,
                        datetime.min.time()
                    ) + timedelta(
                        hours=17,
                        minutes=30
                    )

                task = Task(
                    user_id=user.user_id,
                    subject_id=subject.subject_id,
                    topic_id=topic.topic_id,
                    sub_topic_id=sub_topic.sub_topic_id,
                    title=f"Study {subtopic_name}",
                    description=(
                        f"Review {subtopic_name}, "
                        f"solve practice questions, "
                        f"and revise important concepts."
                    ),
                    priority=priority,
                    status=(
                        TaskStatus.COMPLETED
                        if completed
                        else TaskStatus.PENDING
                    ),
                    due_date=due_date,
                    completed_at=completed_at,
                )

                db.add(task)

                # Add an occasional second task.
                if counter % 6 == 0:

                    second_completed = counter % 3 != 0

                    second_task = Task(
                        user_id=user.user_id,
                        subject_id=subject.subject_id,
                        topic_id=topic.topic_id,
                        sub_topic_id=sub_topic.sub_topic_id,
                        title=f"Practice {subtopic_name}",
                        description=(
                            f"Complete additional exercises "
                            f"for {subtopic_name}."
                        ),
                        priority=(
                            TaskPriority.HIGH
                            if counter % 12 == 0
                            else TaskPriority.MEDIUM
                        ),
                        status=(
                            TaskStatus.COMPLETED
                            if second_completed
                            else TaskStatus.PENDING
                        ),
                        due_date=(
                            date.today()
                            + timedelta(
                                days=(counter % 14) - 5
                            )
                        ),
                        completed_at=(
                            datetime.now()
                            if second_completed
                            else None
                        ),
                    )

                    db.add(second_task)


# ============================================================
# SESSION HELPER
# ============================================================

def add_session(
    user,
    structure,
    study_date,
    subject_name,
    duration,
    topic_index,
    subtopic_index,
    start_hour,
    start_minute
):

    subject_info = structure[subject_name]

    topic_names = list(
        subject_info["topics"].keys()
    )

    topic_name = topic_names[
        topic_index % len(topic_names)
    ]

    topic_info = subject_info[
        "topics"
    ][topic_name]

    subtopic_names = list(
        topic_info["subtopics"].keys()
    )

    subtopic_name = subtopic_names[
        subtopic_index % len(subtopic_names)
    ]

    subject = subject_info["object"]

    topic = topic_info["object"]

    sub_topic = topic_info[
        "subtopics"
    ][subtopic_name]

    start_time = datetime.combine(
        study_date,
        datetime.min.time()
    ).replace(
        hour=start_hour,
        minute=start_minute
    )

    end_time = (
        start_time
        + timedelta(minutes=duration)
    )

    session = StudySession(
        user_id=user.user_id,
        subject_id=subject.subject_id,
        topic_id=topic.topic_id,
        sub_topic_id=sub_topic.sub_topic_id,
        start_time=start_time,
        end_time=end_time,
        duration_minutes=duration,
    )

    db.add(session)


# ============================================================
# RIYA'S REALISTIC STUDY HISTORY
# ============================================================

def create_riya_sessions(user, structure):

    # Longest streak:
    # August 1 → August 23 = 23 consecutive days.
    long_streak = [
        date(2026, 8, 1) + timedelta(days=i)
        for i in range(23)
    ]

    # Current streak:
    # September 24 → September 29 = 6 consecutive days.
    current_streak = [
        date(2026, 9, 24) + timedelta(days=i)
        for i in range(6)
    ]

    all_dates = long_streak + current_streak

    # Science and Mathematics receive more study time.
    subject_pattern = [
        "Science",
        "Mathematics",
        "Science",
        "Social Science",
        "Mathematics",
        "English",
        "Science",
        "Mathematics",
        "Computer Applications",
        "Science",
        "Social Science",
        "Mathematics",
        "Hindi",
        "Science",
        "English",
        "Mathematics",
        "Science",
        "Social Science",
        "Mathematics",
        "Science",
        "Hindi",
        "English",
        "Mathematics",
        "Science",
        "Social Science",
        "Mathematics",
        "Computer Applications",
        "Science",
        "Mathematics",
    ]

    durations = [
        55, 80, 45, 70, 95,
        60, 40, 85, 50, 65,
        75, 55, 90, 45, 70,
        60, 100, 50, 65, 80,
        40, 55, 85, 70, 110,
        45, 75, 60, 95
    ]

    for i, study_date in enumerate(all_dates):

        add_session(
            user=user,
            structure=structure,
            study_date=study_date,
            subject_name=subject_pattern[
                i % len(subject_pattern)
            ],
            duration=durations[
                i % len(durations)
            ],
            topic_index=i + 1,
            subtopic_index=i + 2,
            start_hour=16 + (i % 3),
            start_minute=15,
        )

        # Some days have a second shorter session.
        if i in {
            2, 6, 9, 13, 17,
            20, 24, 27
        }:

            second_subjects = [
                "English",
                "Science",
                "Mathematics",
                "Hindi",
                "Social Science",
                "Computer Applications",
                "Science",
                "Mathematics",
            ]

            second_durations = [
                35, 45, 30, 40,
                50, 35, 55, 45
            ]

            add_session(
                user=user,
                structure=structure,
                study_date=study_date,
                subject_name=second_subjects[
                    i % len(second_subjects)
                ],
                duration=second_durations[
                    i % len(second_durations)
                ],
                topic_index=i + 3,
                subtopic_index=i + 1,
                start_hour=20,
                start_minute=0,
            )


# ============================================================
# AARAV'S REALISTIC STUDY HISTORY
# ============================================================

def create_aarav_sessions(user, structure):

    # Longest streak:
    # August 1 → August 27 = 27 consecutive days.
    long_streak = [
        date(2026, 8, 1) + timedelta(days=i)
        for i in range(27)
    ]

    # Current streak:
    # September 23 → September 29 = 7 consecutive days.
    current_streak = [
        date(2026, 9, 23) + timedelta(days=i)
        for i in range(7)
    ]

    all_dates = long_streak + current_streak

    # Aarav focuses heavily on core engineering subjects.
    subject_pattern = [
        "Digital Electronics",
        "Computer Organization",
        "Programming",
        "Data Structures",
        "Digital Electronics",
        "Engineering Mathematics",
        "Computer Organization",
        "Programming",
        "Digital Electronics",
        "Operating Systems",
        "Data Structures",
        "Computer Organization",
        "Digital Electronics",
        "Database Management Systems",
        "Programming",
        "Engineering Mathematics",
        "Computer Networks",
        "Digital Electronics",
        "Computer Organization",
        "Data Structures",
        "Programming",
        "Digital Electronics",
        "Operating Systems",
        "Computer Organization",
        "Engineering Mathematics",
        "Programming",
        "Database Management Systems",
        "Digital Electronics",
        "Data Structures",
        "Computer Organization",
        "Programming",
        "Computer Networks",
        "Digital Electronics",
        "Communication Skills",
    ]

    durations = [
        70, 95, 50, 80, 110,
        65, 45, 90, 60, 75,
        120, 55, 85, 40, 100,
        70, 130, 50, 65, 90,
        45, 115, 80, 60, 105,
        55, 75, 95, 50, 85,
        120, 65, 90, 40
    ]

    for i, study_date in enumerate(all_dates):

        add_session(
            user=user,
            structure=structure,
            study_date=study_date,
            subject_name=subject_pattern[
                i % len(subject_pattern)
            ],
            duration=durations[
                i % len(durations)
            ],
            topic_index=i + 2,
            subtopic_index=i + 1,
            start_hour=17 + (i % 2),
            start_minute=0,
        )

        # Aarav sometimes studies a second subject
        # on the same day.
        if i in {
            1, 4, 7, 10, 14,
            18, 21, 25, 29, 32
        }:

            second_subjects = [
                "Engineering Mathematics",
                "Data Structures",
                "Database Management Systems",
                "Operating Systems",
                "Computer Networks",
                "Programming",
                "Digital Electronics",
                "Computer Organization",
                "Communication Skills",
                "Engineering Mathematics",
            ]

            second_durations = [
                45, 60, 40, 55, 50,
                65, 35, 70, 40, 50
            ]

            add_session(
                user=user,
                structure=structure,
                study_date=study_date,
                subject_name=second_subjects[
                    i % len(second_subjects)
                ],
                duration=second_durations[
                    i % len(second_durations)
                ],
                topic_index=i + 4,
                subtopic_index=i + 2,
                start_hour=21,
                start_minute=0,
            )


# ============================================================
# MAIN
# ============================================================

try:

    print("Resetting demo accounts...")
    reset_demo_data()

    print("Creating Riya Shah...")
    riya = create_user(
        full_name="Riya Shah",
        email=SCHOOL_EMAIL,
        study_level="Class 10",
        dob=date(2010, 5, 14),
    )

    print("Creating Aarav Mehta...")
    aarav = create_user(
        full_name="Aarav Mehta",
        email=COLLEGE_EMAIL,
        study_level="Computer Engineering",
        dob=date(2005, 9, 22),
    )

    print("Creating Riya's school structure...")
    riya_structure = create_structure(
        riya,
        SCHOOL_DATA
    )

    print("Creating Aarav's college structure...")
    aarav_structure = create_structure(
        aarav,
        COLLEGE_DATA
    )

    print("Creating Riya's tasks...")
    create_tasks(
        riya,
        SCHOOL_DATA,
        riya_structure,
        completion_rate=0.78
    )

    print("Creating Aarav's tasks...")
    create_tasks(
        aarav,
        COLLEGE_DATA,
        aarav_structure,
        completion_rate=0.64
    )

    print("Creating Riya's study history...")
    create_riya_sessions(
        riya,
        riya_structure
    )

    print("Creating Aarav's study history...")
    create_aarav_sessions(
        aarav,
        aarav_structure
    )

    db.commit()

    print()
    print("=" * 60)
    print("TASKMIND DEMO DATA CREATED SUCCESSFULLY")
    print("=" * 60)

    print()
    print("RIYA SHAH — SCHOOL")
    print("Email    :", SCHOOL_EMAIL)
    print("Password :", DEMO_PASSWORD)
    print("Level    : Class 10")
    print("Current streak target : 6 days")
    print("Longest streak target : 23 days")

    print()
    print("AARAV MEHTA — COLLEGE")
    print("Email    :", COLLEGE_EMAIL)
    print("Password :", DEMO_PASSWORD)
    print("Level    : Computer Engineering")
    print("Current streak target : 7 days")
    print("Longest streak target : 27 days")

    print()
    print("Run this script again whenever you want")
    print("to reset and recreate the demo data.")

except Exception as error:

    db.rollback()

    print()
    print("=" * 60)
    print("ERROR WHILE CREATING DEMO DATA")
    print("=" * 60)
    print(error)

    raise

finally:
    db.close()