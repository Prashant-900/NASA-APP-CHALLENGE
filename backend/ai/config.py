import os
from typing import Dict, Any

class Config:
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyA4j6lnXFRRJaxNrXx96zTFWrNOwr2vut4')
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:prashantshree@localhost:5432/nasa')
    
    AVAILABLE_TABLES = ['k2', 'toi', 'cum']
    
    SYSTEM_PROMPT = """You are a research assistant for exoplanet data analysis. 
You can help users query and analyze data from K2, TOI, and CUM datasets.
Always ask for clarification if the user's request is ambiguous.
Only perform read-only operations on the database."""