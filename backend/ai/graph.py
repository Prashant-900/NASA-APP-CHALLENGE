from typing import Dict, Any, List, Optional
from .database import DatabaseManager
from .llm import GeminiLLM

class RAGGraph:
    def __init__(self):
        self.db = DatabaseManager()
        self.llm = GeminiLLM()
    
    def _parse_request(self, message: str, table: str) -> Dict[str, Any]:
        state = {
            "message": message,
            "table": table or "",
            "columns": None,
            "query_result": None,
            "response": "",
            "error": None
        }
        
        message_lower = message.lower()
        
        # Extract table name if not provided
        if not state["table"]:
            for tbl in self.db.config.AVAILABLE_TABLES:
                if tbl in message_lower:
                    state["table"] = tbl
                    break
        
        # Extract column mentions
        if state["table"]:
            try:
                available_columns = self.db.get_table_columns(state["table"])
                mentioned_columns = []
                for col in available_columns:
                    if col.lower() in message_lower:
                        mentioned_columns.append(col)
                if mentioned_columns:
                    state["columns"] = mentioned_columns
            except:
                pass
        
        return state
    
    def process_message(self, message: str, table: str = None) -> Dict[str, Any]:
        try:
            if not table:
                return {
                    "response": "Please specify which table to query using the dropdown above.",
                    "data": None,
                    "error": None
                }
            
            # Let LLM handle the entire process with tools
            return self.llm.process_with_tools(message, table, self.db)
                
        except Exception as e:
            return {
                "response": f"Error: {str(e)}",
                "data": None,
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
            query = f"SELECT * FROM {table} LIMIT 1000"
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
    
