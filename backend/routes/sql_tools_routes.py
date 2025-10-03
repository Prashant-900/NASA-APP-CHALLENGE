from flask import Blueprint, jsonify, request
from ai.database import DatabaseManager
from ai.plot_tools import execute_plot_code, _is_safe_plot_code
import pandas as pd
import json
import logging

sql_tools_bp = Blueprint('sql_tools', __name__)

@sql_tools_bp.route('/sql/execute', methods=['POST'])
def execute_sql():
    """Execute SQL query directly"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        table = data.get('table', '')
        
        if not query:
            return jsonify({'error': 'SQL query is required'}), 400
        
        # Validate SQL query
        query_lower = query.lower()
        if not query_lower.startswith('select'):
            return jsonify({'error': 'Only SELECT queries are allowed'}), 400
        
        # Check for forbidden operations
        forbidden = ['drop', 'delete', 'update', 'insert', 'alter', 'create', 'truncate']
        if any(word in query_lower for word in forbidden):
            return jsonify({'error': 'Query contains forbidden operations'}), 400
        
        # Initialize database with error handling
        try:
            db = DatabaseManager()
            result = db.execute_custom_query(query)
        except ConnectionError as e:
            return jsonify({'error': 'Database connection failed. Please check configuration.'}), 503
        
        return jsonify({
            'success': True,
            'data': result,
            'count': len(result),
            'query': query
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sql_tools_bp.route('/sql/plot', methods=['POST'])
def execute_sql_with_plot():
    """Execute SQL query and generate plot"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        plot_code = data.get('plot_code', '').strip()
        table = data.get('table', '')
        
        if not query:
            return jsonify({'error': 'SQL query is required'}), 400
        
        if not plot_code:
            return jsonify({'error': 'Plot code is required'}), 400
        
        # Validate SQL query
        query_lower = query.lower()
        if not query_lower.startswith('select'):
            return jsonify({'error': 'Only SELECT queries are allowed'}), 400
        
        # Validate plot code
        if not _is_safe_plot_code(plot_code):
            return jsonify({'error': 'Invalid or unsafe plot code'}), 400
        
        # Initialize database with error handling
        try:
            db = DatabaseManager()
            result = db.execute_custom_query(query)
        except ConnectionError as e:
            return jsonify({'error': 'Database connection failed. Please check configuration.'}), 503
        
        if not result:
            return jsonify({'error': 'Query returned no data'}), 400
        
        # Convert to DataFrame and generate plot
        df = pd.DataFrame(result)
        plot_html = execute_plot_code(plot_code, df)
        
        return jsonify({
            'success': True,
            'data': result,
            'plot': plot_html,
            'count': len(result),
            'query': query,
            'plot_code': plot_code
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sql_tools_bp.route('/sql/tables/<table_name>/columns', methods=['GET'])
def get_table_columns(table_name):
    """Get columns for a specific table"""
    try:
        db = DatabaseManager()
        columns = db.get_table_columns(table_name)
        
        return jsonify({
            'success': True,
            'columns': columns,
            'table': table_name
        })
        
    except ConnectionError as e:
        return jsonify({'error': 'Database connection failed. Please check configuration.'}), 503
    except Exception as e:
        return jsonify({'error': str(e)}), 500