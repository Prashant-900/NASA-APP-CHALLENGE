import pandas as pd
import subprocess
import json
import tempfile
import os
from typing import Dict, Any

def execute_plot_code(python_code: str, df_data: pd.DataFrame) -> Dict[str, Any]:
    """Execute Python plotting code in subprocess with restrictions"""
    try:
        # Create temporary files
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as code_file:
            restricted_code = f"""
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import json
import sys
import numpy as np

try:
    # Load data
    df = pd.read_csv('{tempfile.gettempdir().replace(chr(92), '/')}/plot_data.csv')
    
    # Ensure numeric columns are properly typed
    for col in df.columns:
        if df[col].dtype == 'object':
            try:
                df[col] = pd.to_numeric(df[col], errors='ignore')
            except:
                pass
    
    # Execute user plot code
    {python_code}
    
    # Output the plot JSON
    if 'fig' in locals():
        plot_json = fig.to_json()
        print(plot_json)
    else:
        print('{{}}')
        
except Exception as e:
    print(f"Plot error: {{str(e)}}", file=sys.stderr)
    import traceback
    traceback.print_exc(file=sys.stderr)
    print('{{}}')
"""
            code_file.write(restricted_code)
            code_file_path = code_file.name
        
        # Save data to temporary CSV
        data_path = os.path.join(tempfile.gettempdir(), 'plot_data.csv')
        df_data.to_csv(data_path, index=False)
        
        # Execute the plotting code
        result = subprocess.run(
            ['python', code_file_path],
            capture_output=True,
            text=True,
            timeout=15,
            cwd=tempfile.gettempdir()
        )
        
        # Cleanup
        try:
            os.unlink(code_file_path)
            os.unlink(data_path)
        except:
            pass
        
        if result.returncode == 0 and result.stdout.strip():
            try:
                return json.loads(result.stdout.strip())
            except json.JSONDecodeError:
                return {}
        else:
            return {}
            
    except Exception as e:
        return {}

def execute_query_dataframe(db, sql_query: str) -> pd.DataFrame:
    """Execute query and return pandas DataFrame"""
    # Validate SQL query
    sql_lower = sql_query.lower().strip()
    if not sql_lower.startswith('select'):
        raise ValueError("Only SELECT queries are allowed")
    
    forbidden_keywords = ['drop', 'delete', 'update', 'insert', 'alter', 'create', 'truncate', 'grant', 'revoke']
    if any(keyword in sql_lower for keyword in forbidden_keywords):
        raise ValueError("Query contains forbidden operations")
    
    # Validate table names
    for table in db.config.AVAILABLE_TABLES:
        if f'from {table}' in sql_lower or f'join {table}' in sql_lower:
            break
    else:
        if 'from ' in sql_lower:
            raise ValueError("Query must use allowed tables only")
    
    try:
        with db.get_connection() as conn:
            return pd.read_sql_query(sql_query, conn)
    except Exception as e:
        raise ValueError(f"Query execution failed: {str(e)}")

def generate_plot_code(user_message: str, columns: list) -> str:
    """Generate plot code based on user message and available columns"""
    message_lower = user_message.lower()
    
    # Find mentioned column
    col_name = None
    for col in columns:
        if col.lower() in message_lower:
            col_name = col
            break
    
    if not col_name and columns:
        col_name = columns[0]  # Use first column as fallback
    
    # Generate appropriate plot code
    if 'hist' in message_lower or 'histogram' in message_lower:
        return f"fig = px.histogram(df.dropna(subset=['{col_name}']), x='{col_name}', nbins=30, title='Histogram of {col_name}')"
    elif 'scatter' in message_lower:
        if len(columns) >= 2:
            return f"fig = px.scatter(df.dropna(), x='{columns[0]}', y='{columns[1]}', title='Scatter Plot')"
        else:
            return f"fig = px.scatter(df.dropna(), x='{col_name}', y='{col_name}', title='Scatter Plot')"
    elif 'line' in message_lower:
        return f"fig = px.line(df.dropna(), x=df.index, y='{col_name}', title='Line Plot of {col_name}')"
    elif 'box' in message_lower:
        return f"fig = px.box(df.dropna(subset=['{col_name}']), y='{col_name}', title='Box Plot of {col_name}')"
    else:
        # Default to histogram
        return f"fig = px.histogram(df.dropna(subset=['{col_name}']), x='{col_name}', nbins=30, title='Distribution of {col_name}')"