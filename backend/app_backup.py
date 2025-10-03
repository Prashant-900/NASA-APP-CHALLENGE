from flask import Flask, jsonify, request, send_file, Response
import json
from flask_cors import CORS
import psycopg2
import pandas as pd
from sqlalchemy import create_engine, text
import math
import os
from werkzeug.utils import secure_filename
from k2_wrapper import predict as k2_predict
from toi_wrapper import predict as toi_predict
from backend.kepler_wrapper import predict as cum_predict
from ai import RAGGraph

app = Flask(__name__)
CORS(app)

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Database connection
DB_CONFIG = {
    "dbname": os.getenv('DB_NAME', 'nasa'),
    "user": os.getenv('DB_USER', 'postgres'), 
    "password": os.getenv('DB_PASSWORD', 'prashantshree'),
    "host": os.getenv('DB_HOST', 'localhost'),
    "port": os.getenv('DB_PORT', '5432')
}

ALLOWED_TABLES = ['k2', 'toi', 'cum']

engine = create_engine(f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['dbname']}")

@app.route('/api/tables', methods=['GET'])
def get_tables():
    return jsonify(['k2', 'toi', 'cum'])

@app.route('/api/table/<table_name>/columns', methods=['GET'])
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

@app.route('/api/table/<table_name>/data', methods=['GET'])
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

@app.route('/api/predict', methods=['POST'])
def predict_data():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        model_type = request.form.get('type', 'k2')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only CSV and Excel files are allowed'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Read file based on extension
        file_ext = filename.rsplit('.', 1)[1].lower()
        if file_ext == 'csv':
            data = pd.read_csv(filepath, on_bad_lines='skip')
        else:  # xlsx or xls
            data = pd.read_excel(filepath)
        
        # Predict based on model type
        if model_type == 'k2':
            predictions = k2_predict(data)
        elif model_type == 'toi':
            predictions = toi_predict(data)
        elif model_type == 'cum':
            predictions = cum_predict(data)
        else:
            return jsonify({'error': f'Model type "{model_type}" not supported'}), 400
        
        # Clean up uploaded file
        os.remove(filepath)
        
        # Add predictions to original data
        data['exoplanet_prediction'] = predictions
        
        # Save result as CSV
        result_filename = f'predictions_{model_type}_{filename.rsplit(".", 1)[0]}.csv'
        result_path = os.path.join(app.config['UPLOAD_FOLDER'], result_filename)
        data.to_csv(result_path, index=False)
        
        # Schedule cleanup of result file after 5 min
        import threading
        import time
        def cleanup_result():
            time.sleep(300)  # 5 min
            if os.path.exists(result_path):
                os.remove(result_path)
        
        cleanup_thread = threading.Thread(target=cleanup_result)
        cleanup_thread.daemon = True
        cleanup_thread.start()
        
        # Convert predictions to list if it's a numpy array
        if hasattr(predictions, 'tolist'):
            predictions = predictions.tolist()
        
        return jsonify({
            'predictions': predictions,
            'model_type': model_type,
            'rows_processed': len(data),
            'download_url': f'/api/download/{result_filename}'
        })
        
    except Exception as e:
        # Clean up file if it exists
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict/manual', methods=['POST'])
def predict_manual():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        features = data.get('features', {})
        model_type = data.get('type', 'k2')
        
        # Required features for all models
        required_features = ['pl_orbper', 'pl_rade', 'st_teff', 'st_rad', 'st_mass', 'st_logg', 'sy_dist', 'sy_vmag', 'sy_kmag', 'sy_gaiamag']
        
        # Validate required features
        missing_features = [f for f in required_features if f not in features or not features[f]]
        if missing_features:
            return jsonify({'error': f'Missing required features: {missing_features}'}), 400
        
        # Convert to DataFrame
        feature_data = {}
        for feature in required_features:
            try:
                feature_data[feature] = [float(features[feature])]
            except (ValueError, TypeError):
                return jsonify({'error': f'Invalid value for {feature}: must be a number'}), 400
        
        df = pd.DataFrame(feature_data)
        
        # Predict based on model type
        if model_type == 'k2':
            prediction = k2_predict(df)
        elif model_type == 'toi':
            prediction = toi_predict(df)
        elif model_type == 'cum':
            prediction = cum_predict(df)
        else:
            return jsonify({'error': f'Model type "{model_type}" not supported'}), 400
        
        # Handle prediction result
        if isinstance(prediction, str):  # Error message
            return jsonify({'error': prediction}), 400
        
        # Convert to boolean if it's a numpy array
        if hasattr(prediction, 'tolist'):
            prediction = prediction.tolist()[0] if len(prediction) > 0 else False
        elif hasattr(prediction, '__iter__') and not isinstance(prediction, str):
            prediction = list(prediction)[0] if len(list(prediction)) > 0 else False
        
        return jsonify({
            'predictions': bool(prediction),
            'model_type': model_type,
            'rows_processed': 1
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        # Sanitize filename to prevent path traversal
        filename = secure_filename(filename)
        if not filename or '..' in filename:
            return jsonify({'error': 'Invalid filename'}), 400
            
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        # Ensure file is within upload directory
        if not os.path.abspath(filepath).startswith(os.path.abspath(app.config['UPLOAD_FOLDER'])):
            return jsonify({'error': 'Access denied'}), 403
            
        if os.path.exists(filepath):
            return send_file(filepath, as_attachment=True, download_name=filename)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize RAG system
try:
    rag_system = RAGGraph()
except Exception as e:
    print(f"Failed to initialize RAG system: {str(e)}")
    rag_system = None

@app.route('/api/chat', methods=['POST'])
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
        return jsonify({'error': str(e)}), 500

# Store query results in memory for pagination with TTL
from collections import OrderedDict
import time

class QueryCache:
    def __init__(self, max_size=100, ttl=3600):  # 1 hour TTL
        self.cache = OrderedDict()
        self.timestamps = {}
        self.max_size = max_size
        self.ttl = ttl
    
    def get(self, key):
        if key in self.cache:
            if time.time() - self.timestamps[key] < self.ttl:
                # Move to end (most recently used)
                self.cache.move_to_end(key)
                return self.cache[key]
            else:
                # Expired
                del self.cache[key]
                del self.timestamps[key]
        return None
    
    def set(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        else:
            if len(self.cache) >= self.max_size:
                # Remove oldest
                oldest = next(iter(self.cache))
                del self.cache[oldest]
                del self.timestamps[oldest]
        
        self.cache[key] = value
        self.timestamps[key] = time.time()
    
    def __contains__(self, key):
        return self.get(key) is not None

query_cache = QueryCache()

@app.route('/api/chat/stream', methods=['POST'])
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
                if should_open_tab and result.get('data'):
                    print(f"Caching query {query_id} with {len(result['data'])} records")
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
                print(f"Chat stream error: {str(e)}")
                import traceback
                traceback.print_exc()
                error_chunk = {
                    'chunk': f"Error: {str(e)}",
                    'done': True,
                    'error': str(e)
                }
                yield f"data: {json.dumps(error_chunk)}\n\n"
        
        return Response(generate(), mimetype='text/plain')
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/query/direct', methods=['POST'])
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

@app.route('/api/query/data/<int:query_id>', methods=['GET'])
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

@app.route('/api/search/planet', methods=['GET'])
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)