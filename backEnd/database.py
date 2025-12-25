from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# 1. Load the secrets
load_dotenv()

# 2. Get the URL
DATABASE_URL = os.getenv("DATABASE_URL")

# --- DEBUGGING BLOCK ---
if DATABASE_URL is None:
    raise ValueError("CRITICAL ERROR: DATABASE_URL is missing! Make sure you have a .env file and it is not named .env.txt")

# FIX: SQLAlchemy requires 'postgresql://', but Neon gives 'postgres://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

print(f"Connecting to: {DATABASE_URL.split('@')[1]}") # Prints the host only (keeps password safe)
# -----------------------

# 3. Create the connection engine
engine = create_engine(DATABASE_URL)

# 4. Create a "SessionLocal" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

print("Database connection configured!")