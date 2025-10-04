import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

ALLOWED_TABLES = ['k2', 'toi', 'kepler']

# Use DATABASE_URL from .env
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

engine = create_engine(DATABASE_URL)