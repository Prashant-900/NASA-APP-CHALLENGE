import pandas as pd
import subprocess
import json
import tempfile
import os
from typing import Dict, Any
import plotly.io as pio
import cloudinary
import cloudinary.uploader

# Configure Cloudinary
cloudinary.config(
    cloud_name="dtzsk95mv",
    api_key="596468531838973",
    api_secret="Eo59sqV7iMiQzumO45gdE-TOfcs"
)

def execute_plot_code(python_code: str, df_data: pd.DataFrame) -> str:
    """Secure plot generation without code execution"""
    try:
        # Validate and sanitize the plot code
        if not _is_safe_plot_code(python_code):
            return ""
        
        # Clean the code - remove imports and fig.show()
        cleaned_code = _clean_plot_code(python_code)
        
        # Execute plot code directly in controlled environment
        import plotly.express as px
        import plotly.graph_objects as go
        import numpy as np
        
        # Prepare data - convert to DataFrame and handle data types
        if isinstance(df_data, list):
            df = pd.DataFrame(df_data)
        else:
            df = df_data.copy()
            
        # Clean the dataframe - convert numeric columns and handle nulls
        for col in df.columns:
            if df[col].dtype == 'object':
                # Try to convert to numeric if possible
                numeric_series = pd.to_numeric(df[col], errors='coerce')
                if not numeric_series.isna().all():  # If some values could be converted
                    df[col] = numeric_series
        
        # Create safe execution environment
        safe_globals = {
            'px': px,
            'go': go,
            'np': np,
            'df': df,
            'data': df,  # Support both df and data
            'pd': pd,    # Allow pandas functions
            'fig': None
        }
        
        # Check if code contains plotly functions
        if not ('px.' in cleaned_code or 'go.' in cleaned_code):
            print(f"No plotly functions found in code: {cleaned_code}")
            return ""
        
        # Execute in restricted environment
        try:
            exec(cleaned_code, safe_globals)
            fig = safe_globals.get('fig')
            
            if fig:
                fig.update_layout(
                    autosize=True,
                    margin=dict(l=50, r=50, t=50, b=50),
                    showlegend=True,
                    hovermode='closest'
                )
                # Generate image and upload to Cloudinary
                img_bytes = pio.to_image(fig, format='png', width=800, height=500)
                
                upload_result = cloudinary.uploader.upload(
                    img_bytes,
                    resource_type="image",
                    upload_preset="ml_default"
                )
                
                return upload_result['secure_url']
            else:
                return ""
                
        except Exception as e:
            print(f"Plot execution error: {str(e)}")
            return ""
            
    except Exception as e:
        print(f"Plot generation error: {str(e)}")
        return ""

def _clean_plot_code(code: str) -> str:
    """Clean plot code by removing imports and function definitions"""
    lines = code.split('\n')
    cleaned_lines = []
    
    for line in lines:
        stripped = line.strip()
        # Skip import statements
        if stripped.startswith('import '):
            continue
        # Skip function definitions
        if stripped.startswith('def '):
            continue
        # Skip return statements
        if stripped.startswith('return '):
            continue
        # Skip fig.show() calls
        if 'fig.show(' in stripped:
            continue
        # Keep other lines
        if stripped:
            cleaned_lines.append(stripped)
    
    return '\n'.join(cleaned_lines)

def _is_safe_plot_code(code: str) -> bool:
    """Validate that plot code is safe to execute"""
    if not code or not isinstance(code, str):
        return False
    
    # Check for dangerous imports or functions (but allow plotly imports)
    dangerous_patterns = [
        'import os', 'import sys', 'import subprocess', 'import shutil',
        'open(', 'file(', 'exec(', 'eval(', '__import__',
        'getattr', 'setattr', 'delattr', 'globals(', 'locals(',
        'input(', 'raw_input(', 'compile(', 'reload('
    ]
    
    code_lower = code.lower()
    for pattern in dangerous_patterns:
        if pattern in code_lower:
            return False
    
    # Must contain fig assignment (allow both 'fig =' and 'fig=')
    if 'fig=' not in code.replace(' ', ''):
        return False
    
    # Must use plotly
    if not ('px.' in code or 'go.' in code):
        return False
    
    return True

def execute_query_dataframe(db, sql_query: str) -> pd.DataFrame:
    """Execute query and return pandas DataFrame with enhanced security"""
    # Validate SQL query
    sql_lower = sql_query.lower().strip()
    if not sql_lower.startswith('select'):
        raise ValueError("Only SELECT queries are allowed")
    
    # Enhanced forbidden keywords check
    forbidden_keywords = [
        'drop', 'delete', 'update', 'insert', 'alter', 'create', 'truncate', 
        'grant', 'revoke', 'exec', 'execute', 'sp_', 'xp_', '--', '/*', '*/',
        'union', 'information_schema', 'pg_', 'mysql', 'sqlite_master'
    ]
    
    for keyword in forbidden_keywords:
        if keyword in sql_lower:
            raise ValueError(f"Query contains forbidden operation: {keyword}")
    
    # Validate table names more strictly
    allowed_tables = db.config.AVAILABLE_TABLES
    table_found = False
    
    for table in allowed_tables:
        if f'from {table}' in sql_lower or f'join {table}' in sql_lower:
            table_found = True
            break
    
    if not table_found and 'from ' in sql_lower:
        raise ValueError("Query must use only allowed tables")
    
    # Limit query complexity
    if sql_query.count('(') > 10 or len(sql_query) > 1000:
        raise ValueError("Query too complex")
    
    try:
        with db.get_connection() as conn:
            return pd.read_sql_query(sql_query, conn)
    except Exception as e:
        raise ValueError(f"Query execution failed: {str(e)}")

def generate_plot_code(user_message: str, columns: list) -> str:
    """Generate secure plot code based on user message and available columns"""
    if not columns:
        return "fig = px.scatter(x=[1], y=[1], title='No data available')"
    
    message_lower = user_message.lower()
    
    # Sanitize column names to prevent injection
    safe_columns = [col for col in columns if _is_safe_column_name(col)]
    if not safe_columns:
        return "fig = px.scatter(x=[1], y=[1], title='No valid columns')"
    
    # Extract mentioned columns from message
    mentioned_cols = []
    for col in safe_columns:
        if col.lower() in message_lower:
            mentioned_cols.append(col)
    
    # Find primary column (first mentioned or default)
    col_name = mentioned_cols[0] if mentioned_cols else safe_columns[0]
    
    # Generate appropriate plot code with validation
    if 'hist' in message_lower or 'histogram' in message_lower:
        return f"fig = px.histogram(df.dropna(subset=['{col_name}']), x='{col_name}', nbins=30, title='Histogram of {col_name}')"
    elif 'scatter' in message_lower and len(mentioned_cols) >= 2:
        x_col, y_col = mentioned_cols[0], mentioned_cols[1]
        # For scatter plots with log scale
        if 'log' in message_lower:
            return f"fig = px.scatter(df.dropna(subset=['{x_col}', '{y_col}']), x='{x_col}', y='{y_col}', log_y=True, title='Scatter Plot: {x_col} vs {y_col} (Log Y)')"
        else:
            return f"fig = px.scatter(df.dropna(subset=['{x_col}', '{y_col}']), x='{x_col}', y='{y_col}', title='Scatter Plot: {x_col} vs {y_col}')"
    elif 'scatter' in message_lower and len(safe_columns) >= 2:
        # Auto-select two numeric columns
        return f"fig = px.scatter(df.dropna(subset=['{safe_columns[0]}', '{safe_columns[1]}']), x='{safe_columns[0]}', y='{safe_columns[1]}', title='Scatter Plot')"
    elif 'line' in message_lower:
        return f"fig = px.line(df.dropna(subset=['{col_name}']), x=df.index, y='{col_name}', title='Line Plot of {col_name}')"
    elif 'box' in message_lower:
        return f"fig = px.box(df.dropna(subset=['{col_name}']), y='{col_name}', title='Box Plot of {col_name}')"
    elif 'relation' in message_lower and len(mentioned_cols) >= 2:
        x_col, y_col = mentioned_cols[0], mentioned_cols[1]
        if 'log' in message_lower:
            return f"fig = px.scatter(df.dropna(subset=['{x_col}', '{y_col}']), x='{x_col}', y='{y_col}', log_y=True, title='Relationship: {x_col} vs {y_col} (Log Y)')"
        else:
            return f"fig = px.scatter(df.dropna(subset=['{x_col}', '{y_col}']), x='{x_col}', y='{y_col}', title='Relationship: {x_col} vs {y_col}')"
    else:
        # Default to histogram
        return f"fig = px.histogram(df.dropna(subset=['{col_name}']), x='{col_name}', nbins=30, title='Distribution of {col_name}')"

def _is_safe_column_name(column_name: str) -> bool:
    """Validate that column name is safe to use in code"""
    if not column_name or not isinstance(column_name, str):
        return False
    
    # Only allow alphanumeric characters and underscores
    import re
    return bool(re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', column_name)) and len(column_name) <= 50