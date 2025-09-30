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
            # Parse request
            state = self._parse_request(message, table)
            
            # Validate table
            if not state["table"]:
                return {
                    "response": "Please specify which table to query (k2, toi, or cum) using the dropdown above.",
                    "data": None,
                    "error": None
                }
            
            # Check if user wants to execute a query or just chat
            if not self.llm.should_execute_query(message):
                response = self.llm.generate_direct_response(message, state["table"])
                return {
                    "response": response,
                    "data": None,
                    "error": None
                }
            
            # Get available columns
            try:
                available_columns = self.db.get_table_columns(state["table"])
            except Exception as e:
                return {
                    "response": f"Error accessing {state['table'].upper()} table: {str(e)}",
                    "data": None,
                    "error": str(e)
                }
            
            # Generate SQL query using AI
            try:
                sql_query = self.llm.generate_sql_query(message, state["table"], available_columns)
                print(f"Generated SQL: {sql_query}")  # Debug log
            except Exception as e:
                return {
                    "response": f"Error generating query: {str(e)}",
                    "data": None,
                    "error": str(e)
                }
            
            # Execute the AI-generated query
            try:
                result = self.db.execute_custom_query(sql_query)
                state["query_result"] = result
            except Exception as e:
                return {
                    "response": f"Query error: {str(e)}\n\nSQL: `{sql_query}`",
                    "data": None,
                    "error": str(e)
                }
            
            # Generate markdown response
            try:
                response = self.llm.generate_response(message, state["query_result"], state["table"])
                
                return {
                    "response": response,
                    "data": state["query_result"],
                    "error": None
                }
            except Exception as e:
                return {
                    "response": f"Error generating response: {str(e)}",
                    "data": state["query_result"],
                    "error": str(e)
                }
                
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