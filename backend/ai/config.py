import os
from typing import Dict, Any, List
from dotenv import load_dotenv
import logging

# Load environment variables securely
load_dotenv(override=False)  # Don't override existing env vars

class Config:
    def __init__(self):
        self.GEMINI_API_KEY = self._get_required_env('GEMINI_API_KEY')
        self.DATABASE_URL = self._get_database_url()
        self.AVAILABLE_TABLES = ['k2', 'toi', 'cum']
        self.MAX_QUERY_LENGTH = 1000
        self.MAX_RESULTS = 1000
        self.QUERY_TIMEOUT = 30
        
        # Validate configuration
        self._validate_config()
    
    def _get_required_env(self, key: str) -> str:
        """Get required environment variable with validation"""
        value = os.getenv(key)
        if not value:
            raise ValueError(f"{key} environment variable is required")
        return value
    
    def _get_database_url(self) -> str:
        """Get database URL with fallback for development"""
        db_url = os.getenv('DATABASE_URL')
        
        # Validate database URL format
        if not db_url.startswith(('postgresql://', 'postgres://')):
            raise ValueError("Invalid database URL format")
        
        return db_url
    
    def _validate_config(self) -> None:
        """Validate configuration values"""
        if not isinstance(self.AVAILABLE_TABLES, list) or not self.AVAILABLE_TABLES:
            raise ValueError("AVAILABLE_TABLES must be a non-empty list")
        
        for table in self.AVAILABLE_TABLES:
            if not isinstance(table, str) or not table.replace('_', '').isalnum():
                raise ValueError(f"Invalid table name: {table}")
    
    SYSTEM_PROMPT = """You are a research assistant for exoplanet data analysis. 
You can help users query and analyze data from K2, TOI, and CUM datasets.
You can also search for information about terms and concepts you don't know.
Always ask for clarification if the user's request is ambiguous.
Only perform read-only operations on the database.
Use web search when you need to explain terms or concepts."""