import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List, Dict, Any, Optional
from .config import Config

class DatabaseManager:
    def __init__(self):
        self.config = Config()
    
    def get_connection(self):
        try:
            return psycopg2.connect(
                self.config.DATABASE_URL,
                cursor_factory=RealDictCursor
            )
        except psycopg2.Error as e:
            raise ConnectionError(f"Database connection failed: {str(e)}")
    
    def get_table_columns(self, table_name: str) -> List[str]:
        if table_name not in self.config.AVAILABLE_TABLES:
            raise ValueError(f"Table {table_name} not available")
        
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = %s AND table_schema = 'public'
                    ORDER BY ordinal_position
                """, (table_name,))
                results = cur.fetchall()
                return [row['column_name'] for row in results]
    
    def execute_custom_query(self, sql_query: str) -> List[Dict[str, Any]]:
        # Enhanced SQL injection protection
        sql_lower = sql_query.lower().strip()
        if not sql_lower.startswith('select'):
            raise ValueError("Only SELECT queries are allowed")
        
        forbidden_keywords = ['drop', 'delete', 'update', 'insert', 'alter', 'create', 'truncate', 'grant', 'revoke']
        if any(keyword in sql_lower for keyword in forbidden_keywords):
            raise ValueError("Query contains forbidden operations")
        
        # Additional validation for table names
        for table in self.config.AVAILABLE_TABLES:
            if f'from {table}' in sql_lower or f'join {table}' in sql_lower:
                break
        else:
            if 'from ' in sql_lower:
                raise ValueError("Query must use allowed tables only")
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(sql_query)
                    results = cur.fetchall()
                    # Convert RealDictRow to regular dict for JSON serialization
                    return [dict(row) for row in results]
        except psycopg2.Error as e:
            raise ValueError(f"Query execution failed: {str(e)}")
    
    def execute_query(self, table_name: str, columns: Optional[List[str]] = None, 
                     where_clause: str = "", limit: int = 100) -> List[Dict[str, Any]]:
        if table_name not in self.config.AVAILABLE_TABLES:
            raise ValueError(f"Table {table_name} not available")
        
        # Validate and sanitize limit
        limit = min(max(1, int(limit)), 1000)  # Cap between 1 and 1000
        
        # Validate columns
        available_columns = self.get_table_columns(table_name)
        if columns:
            invalid_cols = [col for col in columns if col not in available_columns]
            if invalid_cols:
                raise ValueError(f"Invalid columns: {invalid_cols}")
            # Sanitize column names
            col_str = ", ".join([f'"{col}"' for col in columns if col.replace('_', '').replace('-', '').isalnum()])
        else:
            col_str = "*"
        
        # Build query with proper escaping
        query = f'SELECT {col_str} FROM "{table_name}"'
        
        # For now, disable where_clause to prevent SQL injection
        # In production, implement proper parameterized where clause parsing
        if where_clause:
            raise ValueError("WHERE clauses not supported in this method for security reasons")
            
        query += f" LIMIT {limit}"
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(query)
                    results = cur.fetchall()
                    # Convert RealDictRow to regular dict for JSON serialization
                    return [dict(row) for row in results]
        except psycopg2.Error as e:
            raise ValueError(f"Query execution failed: {str(e)}")