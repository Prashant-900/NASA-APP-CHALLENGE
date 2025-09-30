from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import psycopg2
import pandas as pd
from sqlalchemy import create_engine, text
import math
import os
from werkzeug.utils import secure_filename
from k2_wrapper import predict as k2_predict
from toi_wrapper import predict as toi_predict
from cum_wrapper import predict as cum_predict

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
    "dbname": "nasa",
    "user": "postgres", 
    "password": "prashantshree",
    "host": "localhost",
    "port": "5432"
}

engine = create_engine(f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['dbname']}")

@app.route('/api/tables', methods=['GET'])
def get_tables():
    return jsonify(['k2', 'toi', 'cum'])

@app.route('/api/table/<table_name>/columns', methods=['GET'])
def get_columns(table_name):
    try:
        query = f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table_name}'"
        with engine.connect() as conn:
            result = conn.execute(text(query))
            columns = [row[0] for row in result]
        return jsonify(columns)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/table/<table_name>/data', methods=['GET'])
def get_table_data(table_name):
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        search = request.args.get('search', '')
        search_column = request.args.get('search_column', '')
        
        offset = (page - 1) * limit
        
        # Build query
        base_query = f"SELECT * FROM {table_name}"
        count_query = f"SELECT COUNT(*) FROM {table_name}"
        
        if search and search_column:
            where_clause = f" WHERE {search_column}::text ILIKE '%{search}%'"
            base_query += where_clause
            count_query += where_clause
        
        data_query = f"{base_query} LIMIT {limit} OFFSET {offset}"
        
        with engine.connect() as conn:
            # Get total count
            total_result = conn.execute(text(count_query))
            total_count = total_result.scalar()
            
            # Get data
            data_result = conn.execute(text(data_query))
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
        
        # Add predictions to original data
        data['exoplanet_prediction'] = predictions
        
        # Save result as CSV
        result_filename = f'predictions_{model_type}_{filename.rsplit(".", 1)[0]}.csv'
        result_path = os.path.join(app.config['UPLOAD_FOLDER'], result_filename)
        data.to_csv(result_path, index=False)
        
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

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(filepath):
            return send_file(filepath, as_attachment=True, download_name=filename)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)