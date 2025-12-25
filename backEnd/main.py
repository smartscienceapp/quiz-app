from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import desc

# Import your local files
from database import engine, SessionLocal
import models

# 1. Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all websites to talk to this API (Good for prototypes)
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, DELETE, etc.
    allow_headers=["*"],
)

# --- SECURITY CONFIGURATION ---
# In a real app, this huge random string should be in your .env file!
SECRET_KEY = "super-secret-key-please-change-this-later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- DATA MODELS ---
class UserCreate(BaseModel):
    username: str
    password: str
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str

class QuestionCreate(BaseModel):
    text: str
    options: list[str]
    correct_answer: str

# A question meant for students (Answer is REMOVED)
class QuestionPublic(BaseModel):
    id: int
    text: str
    options: list[str]

class AnswerSubmission(BaseModel):
    # Student sends: { 1: "Paris", 2: "4" }
    answers: dict[int, str]

# --- DB HELPER ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- AUTH HELPER FUNCTIONS ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- ROUTES --- 
@app.get("/")
def read_root(): 
    return {"message": "✅ Quiz App is Live!"}

@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    user_exists = db.query(models.User).filter(models.User.username == user.username).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_pw = pwd_context.hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_pw, role=user.role)
    db.add(new_user)
    db.commit()
    return {"message": "User created"}

# This is the LOGIN endpoint
@app.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 1. Find user in DB
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    
    # 2. Check if user exists and password is correct
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Create the Key Card (Token)
    # We put the username and role INSIDE the token so the frontend knows who they are
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# --- SECURITY DEPENDENCY ---
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/questions")
def create_question(question: QuestionCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # RULE: Only teachers can create questions
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Not authorized. Only teachers can create questions.")

    new_question = models.Question(
        text=question.text,
        options=question.options,
        correct_answer=question.correct_answer
    )
    db.add(new_question)
    db.commit()
    return {"message": "Question added successfully!"}

@app.get("/questions", response_model=list[QuestionPublic])
def get_questions(db: Session = Depends(get_db)):
    return db.query(models.Question).all()

@app.post("/submit")
def submit_quiz(submission: AnswerSubmission, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. Get all correct answers from DB
    questions = db.query(models.Question).all()
    correct_map = {q.id: q.correct_answer for q in questions}
    
    # 2. Calculate Score
    score = 0
    total = len(questions)
    
    for q_id, student_answer in submission.answers.items():
        if correct_map.get(q_id) == student_answer:
            score += 1
            
    # 3. Save to Scoreboard
    # We save the date as a simple string for now
    today = datetime.now().strftime("%Y-%m-%d %H:%M")
    attempt = models.Attempt(
        user_id=current_user.id, 
        username=current_user.username, 
        score=score, 
        date=today
    )
    db.add(attempt)
    db.commit()
    
    return {"score": score, "total": total, "message": f"You got {score}/{total}!"}

@app.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    # Get top 10 scores, highest first
    top_scores = db.query(models.Attempt)\
        .order_by(desc(models.Attempt.score))\
        .limit(10)\
        .all()
    return top_scores