import os
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

class Config:
    def __init__(self):
        self.GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
        self.DATABASE_URL = os.getenv('DATABASE_URL')
        self.AVAILABLE_TABLES = ['k2', 'toi', 'cum']
        
        if not self.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        if not self.DATABASE_URL:
            # Fallback for development only
            self.DATABASE_URL = 'postgresql://postgres:prashantshree@localhost:5432/nasa'
    
    SYSTEM_PROMPT = """You are a research assistant for exoplanet data analysis. 
You can help users query and analyze data from K2, TOI, and CUM datasets.
Always ask for clarification if the user's request is ambiguous.
Only perform read-only operations on the database."""