# app/database.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_USER = os.getenv("MYSQL_USER", "root")
DATABASE_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
DATABASE_HOST = os.getenv("MYSQL_HOST", "localhost")
DATABASE_NAME = os.getenv("MYSQL_DATABASE", "testdb")
DATABASE_PORT = os.getenv("MYSQL_PORT", "3306")

DATABASE_URL = (
    f"mysql+mysqlconnector://{DATABASE_USER}:{DATABASE_PASSWORD}"
    f"@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"
)

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is the key point: a single declarative base for all your models
Base = declarative_base()
