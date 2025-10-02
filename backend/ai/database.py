import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List, Dict, Any, Optional
import pandas as pd
import subprocess
import json
import tempfile
import os
from .config import Config

class DatabaseManager:
    def __init__(self):
        self.config = Config()
    
    def get_connection(self):
        try:
            # Enhanced connection security
            return psycopg2.connect(
                self.config.DATABASE_URL,
                cursor_factory=RealDictCursor,
                connect_timeout=10,
                application_name='nasa_exoplanet_app'
            )
        except psycopg2.Error as e:
            raise ConnectionError(f"Database connection failed: {str(e)}")
        except Exception as e:
            raise ConnectionError(f"Unexpected connection error: {str(e)}")
    
    def get_table_columns(self, table_name: str) -> List[str]:
        # Validate table name strictly
        if (not table_name or 
            not isinstance(table_name, str) or 
            table_name not in self.config.AVAILABLE_TABLES or
            not table_name.replace('_', '').isalnum()):
            raise ValueError(f"Invalid table name: {table_name}")
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    # Use parameterized query to prevent SQL injection
                    cur.execute("""
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name = %s AND table_schema = 'public'
                        ORDER BY ordinal_position
                    """, (table_name,))
                    results = cur.fetchall()
                    # Validate column names before returning
                    safe_columns = []
                    for row in results:
                        col_name = row['column_name']
                        if (isinstance(col_name, str) and 
                            col_name.replace('_', '').replace('-', '').isalnum() and 
                            len(col_name) <= 50):
                            safe_columns.append(col_name)
                    return safe_columns
        except psycopg2.Error as e:
            raise ValueError(f"Failed to get table columns: {str(e)}")
    
    def execute_custom_query(self, sql_query: str) -> List[Dict[str, Any]]:
        # Enhanced SQL injection protection
        if not sql_query or not isinstance(sql_query, str):
            raise ValueError("Invalid query")
        
        sql_lower = sql_query.lower().strip()
        if not sql_lower.startswith('select'):
            raise ValueError("Only SELECT queries are allowed")
        
        # Enhanced forbidden keywords check
        forbidden_keywords = [
            'drop', 'delete', 'update', 'insert', 'alter', 'create', 'truncate', 
            'grant', 'revoke', 'exec', 'execute', 'sp_', 'xp_', '--', '/*', '*/',
            'union', 'information_schema', 'pg_', 'mysql', 'sqlite_master',
            'pg_sleep', 'waitfor', 'benchmark'
        ]
        
        for keyword in forbidden_keywords:
            if keyword in sql_lower:
                raise ValueError(f"Query contains forbidden operation: {keyword}")
        
        # Validate table names more strictly
        allowed_tables = self.config.AVAILABLE_TABLES
        table_found = False
        
        for table in allowed_tables:
            if f'from {table}' in sql_lower or f'join {table}' in sql_lower:
                table_found = True
                break
        
        if not table_found and 'from ' in sql_lower:
            raise ValueError("Query must use only allowed tables")
        
        # Limit query complexity and length
        if len(sql_query) > 1000:
            raise ValueError("Query too long")
        
        if sql_query.count('(') > 10 or sql_query.count('select') > 3:
            raise ValueError("Query too complex")
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    # Set query timeout
                    cur.execute("SET statement_timeout = '30s'")
                    cur.execute(sql_query)
                    results = cur.fetchmany(1000)  # Limit results
                    return [dict(row) for row in results]
        except psycopg2.Error as e:
            raise ValueError(f"Query execution failed: {str(e)}")
    
    def execute_query(self, table_name: str, columns: Optional[List[str]] = None, 
                     where_clause: str = "", limit: int = 100) -> List[Dict[str, Any]]:
        # Validate table name
        if not table_name or table_name not in self.config.AVAILABLE_TABLES:
            raise ValueError(f"Table {table_name} not available")
        
        # Validate and sanitize limit
        try:
            limit = min(max(1, int(limit)), 1000)  # Cap between 1 and 1000
        except (ValueError, TypeError):
            limit = 100
        
        # Validate and sanitize columns
        available_columns = self.get_table_columns(table_name)
        if columns:
            # Validate each column
            safe_columns = []
            for col in columns:
                if (col in available_columns and 
                    isinstance(col, str) and 
                    col.replace('_', '').replace('-', '').isalnum() and 
                    len(col) <= 50):
                    safe_columns.append(col)
            
            if not safe_columns:
                raise ValueError("No valid columns specified")
            
            col_str = ", ".join([f'"{col}"' for col in safe_columns])
        else:
            col_str = "*"
        
        # Build query with proper escaping - use parameterized query
        query = f'SELECT {col_str} FROM "{table_name}"'
        
        # Disable where_clause for security
        if where_clause:
            raise ValueError("WHERE clauses not supported for security reasons")
            
        query += f" LIMIT {limit}"
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    # Set query timeout
                    cur.execute("SET statement_timeout = '30s'")
                    cur.execute(query)
                    results = cur.fetchall()
                    return [dict(row) for row in results]
        except psycopg2.Error as e:
            raise ValueError(f"Query execution failed: {str(e)}")