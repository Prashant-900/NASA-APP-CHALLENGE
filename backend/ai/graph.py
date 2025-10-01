from typing import Dict, Any, List, Optional
from .database import DatabaseManager
from .llm import GeminiLLM

class RAGGraph:
    def __init__(self):
        self.db = DatabaseManager()
        self.llm = GeminiLLM()
    
    def process_message(self, message: str, table: str = None) -> Dict[str, Any]:
        """Process user message with enhanced LLM tool integration"""
        try:
            if not table:
                return {
                    "response": "Please specify which table to query using the dropdown above.",
                    "data": None,
                    "plot": None,
                    "response_type": "ai_only",
                    "show_in_query_tab": False,
                    "error": None
                }
            
            # Use the enhanced LLM with tools
            return self.llm.process_with_tools(message, table, self.db)
                
        except Exception as e:
            return {
                "response": f"Error: {str(e)}",
                "data": None,
                "plot": None,
                "response_type": "ai_only",
                "show_in_query_tab": False,
                "error": str(e)
            }
    
    def execute_direct_query(self, table: str) -> Dict[str, Any]:
        """Execute a direct query to show all data from a table for the new tab"""
        try:
            if table not in self.db.config.AVAILABLE_TABLES:
                return {
                    "error": f"Table {table} not available",
                    "data": None
                }
            
            # Get all data from the table (limited for performance)
            query = f"SELECT * FROM \"{table}\" LIMIT 1000"
            result = self.db.execute_custom_query(query)
            
            return {
                "data": result,
                "table": table,
                "count": len(result),
                "error": None
            }
        except Exception as e:
            return {
                "error": str(e),
                "data": None
            }