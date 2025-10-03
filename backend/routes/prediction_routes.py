from flask import Blueprint, jsonify, request, current_app
import pandas as pd
import os
import threading
import time
from werkzeug.utils import secure_filename
from k2_wrapper import predict as k2_predict
from toi_wrapper import predict as toi_predict
from kepler_wrapper import predict as kepler_predict

prediction_bp = Blueprint('prediction', __name__)

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@prediction_bp.route('/predict', methods=['POST'])
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
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
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
        elif model_type == 'kepler':
            predictions = kepler_predict(data)
        else:
            return jsonify({'error': f'Model type "{model_type}" not supported'}), 400
        
        # Clean up uploaded file
        os.remove(filepath)
        
        # Add predictions to original data
        data['exoplanet_prediction'] = predictions
        
        # Save result as CSV
        result_filename = f'predictions_{model_type}_{filename.rsplit(".", 1)[0]}.csv'
        result_path = os.path.join(current_app.config['UPLOAD_FOLDER'], result_filename)
        data.to_csv(result_path, index=False)
        
        # Schedule cleanup of result file after 5 min
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

@prediction_bp.route('/predict/manual', methods=['POST'])
def predict_manual():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        features = data.get('features', {})
        model_type = data.get('type', 'k2')
        
        # Get required features based on model type
        if model_type == 'kepler':
            required_features = [
                'koi_score', 'koi_period', 'koi_depth', 'koi_prad',
                'koi_teq', 'koi_insol', 'koi_model_snr', 'koi_steff', 'koi_slogg', 'koi_srad'
            ]
        else:  # k2 and toi
            required_features = ['pl_orbper', 'pl_rade', 'st_teff', 'st_rad', 'st_mass', 'st_logg', 'sy_dist', 'sy_vmag', 'sy_kmag', 'sy_gaiamag']
        
        # Validate required features
        missing_features = []
        for f in required_features:
            if f not in features:
                missing_features.append(f)
            elif not features[f] or str(features[f]).strip() == '':
                missing_features.append(f)
        
        if missing_features:
            return jsonify({'error': f'Missing required features: {missing_features}'}), 400
        
        # Convert to DataFrame
        feature_data = {}
        for feature in required_features:
            try:
                feature_data[feature] = [float(features[feature])]
            except (ValueError, TypeError):
                return jsonify({'error': f'Invalid value for {feature}: must be a number'}), 400
        
        # Add optional features for Kepler model
        if model_type == 'kepler':
            optional_features = features.get('optional_features', {})
            for feature, value in optional_features.items():
                if value and str(value).strip():
                    try:
                        feature_data[feature] = [float(value)]
                    except (ValueError, TypeError):
                        pass  # Skip invalid optional features
        
        df = pd.DataFrame(feature_data)
        
        # Predict based on model type
        if model_type == 'k2':
            prediction = k2_predict(df)
        elif model_type == 'toi':
            prediction = toi_predict(df)
        elif model_type == 'kepler':
            prediction = kepler_predict(df)
        else:
            return jsonify({'error': f'Model type "{model_type}" not supported'}), 400
        
        # Handle prediction result
        if isinstance(prediction, str):  # Error message
            return jsonify({'error': prediction}), 400
        
        # Handle prediction result
        if hasattr(prediction, 'tolist'):
            prediction = prediction.tolist()[0] if len(prediction) > 0 else 'UNKNOWN'
        elif hasattr(prediction, '__iter__') and not isinstance(prediction, str):
            prediction = list(prediction)[0] if len(list(prediction)) > 0 else 'UNKNOWN'
        
        # For Kepler model, return string prediction; for others, convert to boolean
        if model_type == 'kepler':
            result_prediction = str(prediction)
        else:
            result_prediction = bool(prediction)
        
        return jsonify({
            'predictions': result_prediction,
            'model_type': model_type,
            'rows_processed': 1
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500