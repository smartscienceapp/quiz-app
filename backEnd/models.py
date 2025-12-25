from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.orm import declarative_base

# This "Base" class is the blank sheet we draw our tables on
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # "student" or "teacher"

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    options = Column(JSON)  # Stores a list like ["A", "B", "C", "D"]
    correct_answer = Column(String) # Stores the correct option, e.g. "B"

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer) # We will link this to the student
    username = Column(String) 
    score = Column(Integer)
    date = Column(String)