from app.database.connection import engine
from app.database.base import Base
from app import models


Base.metadata.create_all(bind=engine)