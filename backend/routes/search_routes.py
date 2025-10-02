from flask import Blueprint, jsonify, request
from sqlalchemy import text
from database import engine

search_bp = Blueprint('search', __name__)

@search_bp.route('/search/planet', methods=['GET'])
def search_planet():
    try:
        planet_name = request.args.get('name', '').strip()
        if not planet_name:
            return jsonify({'error': 'Planet name is required'}), 400
        
        # Search in all three tables
        tables_to_search = [
            {'name': 'k2', 'column': 'hostname'},
            {'name': 'toi', 'column': 'toi'},
            {'name': 'cum', 'column': 'pl_name'}
        ]
        
        for table_info in tables_to_search:
            try:
                table_name = table_info['name']
                search_column = table_info['column']
                
                query = text(f"SELECT * FROM {table_name} WHERE {search_column}::text ILIKE :search LIMIT 1")
                
                with engine.connect() as conn:
                    result = conn.execute(query, {'search': f'%{planet_name}%'})
                    row = result.fetchone()
                    
                    if row:
                        columns = result.keys()
                        planet_data = dict(zip(columns, row))
                        return jsonify({
                            'found': True,
                            'data': planet_data,
                            'dataset': table_name
                        })
            except Exception as table_error:
                print(f"Error searching in {table_name}: {str(table_error)}")
                continue
        
        return jsonify({'found': False})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500