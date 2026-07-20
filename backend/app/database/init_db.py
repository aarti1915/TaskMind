from app.database.base import Base
from app.database.connection import engine

from app.models import user
from app.models import subject
from app.models import topic
from app.models import sub_topic
from app.models import study_session


def create_tables():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    create_tables()