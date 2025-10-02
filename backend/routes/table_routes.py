from flask import Blueprint, jsonify, request
from sqlalchemy import text
import math
from database import engine, ALLOWED_TABLES

table_bp = Blueprint('table', __name__)

@table_bp.route('/tables', methods=['GET'])
def get_tables():
    return jsonify(['k2', 'toi', 'cum'])

@table_bp.route('/table/<table_name>/columns', methods=['GET'])
def get_columns(table_name):
    try:
        if table_name not in ALLOWED_TABLES:
            return jsonify({'error': 'Invalid table name'}), 400
        
        query = text("SELECT column_name FROM information_schema.columns WHERE table_name = :table_name")
        with engine.connect() as conn:
            result = conn.execute(query, {'table_name': table_name})
            columns = [row[0] for row in result]
        return jsonify(columns)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@table_bp.route('/table/<table_name>/data', methods=['GET'])
def get_table_data(table_name):
    try:
        if table_name not in ALLOWED_TABLES:
            return jsonify({'error': 'Invalid table name'}), 400
            
        page = int(request.args.get('page', 1))
        limit = min(int(request.args.get('limit', 50)), 100)  # Cap limit
        search = request.args.get('search', '').strip()[:100]  # Limit search length
        search_column = request.args.get('search_column', '').strip()
        
        # Validate search column
        if search_column:
            query = text("SELECT column_name FROM information_schema.columns WHERE table_name = :table_name")
            with engine.connect() as conn:
                result = conn.execute(query, {'table_name': table_name})
                valid_columns = [row[0] for row in result]
                if search_column not in valid_columns:
                    return jsonify({'error': 'Invalid search column'}), 400
        
        offset = (page - 1) * limit
        
        # Build parameterized queries
        if search and search_column:
            base_query = text(f"SELECT * FROM {table_name} WHERE {search_column}::text ILIKE :search")
            count_query = text(f"SELECT COUNT(*) FROM {table_name} WHERE {search_column}::text ILIKE :search")
            data_query = text(f"SELECT * FROM {table_name} WHERE {search_column}::text ILIKE :search LIMIT :limit OFFSET :offset")
            params = {'search': f'%{search}%', 'limit': limit, 'offset': offset}
            count_params = {'search': f'%{search}%'}
        else:
            count_query = text(f"SELECT COUNT(*) FROM {table_name}")
            data_query = text(f"SELECT * FROM {table_name} LIMIT :limit OFFSET :offset")
            params = {'limit': limit, 'offset': offset}
            count_params = {}
        
        with engine.connect() as conn:
            # Get total count
            total_result = conn.execute(count_query, count_params)
            total_count = total_result.scalar()
            
            # Get data
            data_result = conn.execute(data_query, params)
            columns = data_result.keys()
            rows = [dict(zip(columns, row)) for row in data_result]
        
        return jsonify({
            'data': rows,
            'total': total_count,
            'page': page,
            'limit': limit,
            'total_pages': math.ceil(total_count / limit)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500