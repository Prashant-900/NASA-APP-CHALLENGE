from flask import Blueprint, jsonify, request
from ai import RAGGraph
from .utils import query_cache

query_bp = Blueprint('query', __name__)

# Initialize RAG system
try:
    rag_system = RAGGraph()
except Exception as e:
    print(f"Failed to initialize RAG system: {str(e)}")
    rag_system = None

@query_bp.route('/query/direct', methods=['POST'])
def execute_direct_query():
    try:
        if not rag_system:
            return jsonify({'error': 'RAG system not initialized'}), 500
            
        data = request.get_json()
        table = data.get('table', '')
        
        if not table:
            return jsonify({'error': 'Table is required'}), 400
        
        result = rag_system.execute_direct_query(table)
        
        if result.get('error'):
            return jsonify({'error': result['error']}), 500
        
        return jsonify({
            'data': result['data'],
            'table': result['table'],
            'count': result['count']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@query_bp.route('/query/data/<int:query_id>', methods=['GET'])
def get_query_data(query_id):
    try:
        page = int(request.args.get('page', 0))
        page_size = 10
        
        cached_query = query_cache.get(query_id)
        if not cached_query:
            return jsonify({'error': 'Query not found or expired'}), 404
        all_data = cached_query['data']
        
        start_idx = page * page_size
        end_idx = start_idx + page_size
        
        page_data = all_data[start_idx:end_idx]
        
        return jsonify({
            'data': page_data,
            'total': len(all_data),
            'page': page,
            'page_size': page_size,
            'has_next': end_idx < len(all_data)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500