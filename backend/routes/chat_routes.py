from flask import Blueprint, jsonify, request, Response
import json
from ai import RAGGraph
from .utils import query_cache

chat_bp = Blueprint('chat', __name__)

# Initialize RAG system
try:
    rag_system = RAGGraph()
except Exception as e:
    print(f"Failed to initialize RAG system: {str(e)}")
    rag_system = None

@chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        if not rag_system:
            return jsonify({'error': 'RAG system not initialized'}), 500
            
        data = request.get_json()
        message = data.get('message', '')
        table = data.get('table', '')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        result = rag_system.process_message(message, table)
        
        return jsonify({
            'response': result['response'],
            'data': result.get('data'),
            'error': result.get('error')
        })
        
    except Exception as e:
        return jsonify({'error': 'An error occurred'}), 500

@chat_bp.route('/chat/stream', methods=['POST'])
def chat_stream():
    try:
        if not rag_system:
            return jsonify({'error': 'RAG system not initialized'}), 500
            
        data = request.get_json()
        message = data.get('message', '')
        table = data.get('table', '')
        query_id = data.get('query_id', 0)
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        def generate():
            try:
                if not rag_system:
                    error_chunk = {
                        'chunk': 'RAG system not initialized',
                        'done': True,
                        'error': 'System initialization failed'
                    }
                    yield f"data: {json.dumps(error_chunk)}\n\n"
                    return
                    
                result = rag_system.process_message(message, table)
                
                # Determine if should open new tab based on LLM decision
                should_open_tab = result.get('show_in_query_tab', False)
                
                # Store query data in memory for pagination
                if should_open_tab and (result.get('data') or result.get('plot')):
                    query_cache.set(query_id, {
                        'data': result['data'],
                        'plot': result.get('plot'),
                        'table': table,
                        'message': message
                    })
                
                # Stream the response word by word
                words = result['response'].split(' ')
                for i, word in enumerate(words):
                    chunk = {
                        'chunk': word + (' ' if i < len(words) - 1 else ''),
                        'done': i == len(words) - 1,
                        'data': result.get('data')[:10] if result.get('data') and i == len(words) - 1 else None,
                        'plot': result.get('plot') if i == len(words) - 1 else None,
                        'open_new_tab': should_open_tab if i == len(words) - 1 else False,
                        'response_type': result.get('response_type', 'ai_only') if i == len(words) - 1 else None
                    }
                    yield f"data: {json.dumps(chunk)}\n\n"
                    
            except Exception as e:
                error_chunk = {
                    'chunk': 'An error occurred',
                    'done': True,
                    'error': 'Processing error'
                }
                yield f"data: {json.dumps(error_chunk)}\n\n"
        
        return Response(generate(), mimetype='text/plain')
        
    except Exception as e:
        return jsonify({'error': 'An error occurred'}), 500