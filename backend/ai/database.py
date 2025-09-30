import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List, Dict, Any, Optional
from .config import Config

class DatabaseManager:
    def __init__(self):
        self.config = Config()
    
    def get_connection(self):
        return psycopg2.connect(
            self.config.DATABASE_URL,
            cursor_factory=RealDictCursor
        )
    
    def get_table_columns(self, table_name: str) -> List[str]:
        if table_name not in self.config.AVAILABLE_TABLES:
            raise ValueError(f"Table {table_name} not available")
        
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = %s
                    ORDER BY ordinal_position
                """, (table_name,))
                return [row['column_name'] for row in cur.fetchall()]
    
    def execute_custom_query(self, sql_query: str) -> List[Dict[str, Any]]:
        # Basic SQL injection protection
        sql_lower = sql_query.lower().strip()
        if not sql_lower.startswith('select'):
            raise ValueError("Only SELECT queries are allowed")
        
        forbidden_keywords = ['drop', 'delete', 'update', 'insert', 'alter', 'create']
        if any(keyword in sql_lower for keyword in forbidden_keywords):
            raise ValueError("Query contains forbidden operations")
        
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql_query)
                return cur.fetchall()
    
    def execute_query(self, table_name: str, columns: Optional[List[str]] = None, 
                     where_clause: str = "", limit: int = 100) -> List[Dict[str, Any]]:
        if table_name not in self.config.AVAILABLE_TABLES:
            raise ValueError(f"Table {table_name} not available")
        
        # Validate columns
        available_columns = self.get_table_columns(table_name)
        if columns:
            invalid_cols = [col for col in columns if col not in available_columns]
            if invalid_cols:
                raise ValueError(f"Invalid columns: {invalid_cols}")
            col_str = ", ".join(columns)
        else:
            col_str = "*"
        
        query = f"SELECT {col_str} FROM {table_name}"
        if where_clause:
            query += f" WHERE {where_clause}"
        query += f" LIMIT {limit}"
        
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(query)
                return cur.fetchall()