from pydantic_settings import BaseSettings
from functools import lru_cache



class Settings(BaseSettings):


    # Database

    DB_HOST: str

    DB_PORT: str

    DB_NAME: str

    DB_USER: str

    DB_PASSWORD: str



    # JWT

    JWT_SECRET_KEY: str

    JWT_ALGORITHM: str

    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int





    class Config:

        env_file = ".env"





@lru_cache
def get_settings():

    return Settings()



settings = get_settings()