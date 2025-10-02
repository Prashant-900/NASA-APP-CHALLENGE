from flask import Blueprint, jsonify, send_file, current_app
import os
from werkzeug.utils import secure_filename

download_bp = Blueprint('download', __name__)

@download_bp.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        # Sanitize filename to prevent path traversal
        filename = secure_filename(filename)
        if not filename or '..' in filename:
            return jsonify({'error': 'Invalid filename'}), 400
            
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        # Ensure file is within upload directory
        if not os.path.abspath(filepath).startswith(os.path.abspath(current_app.config['UPLOAD_FOLDER'])):
            return jsonify({'error': 'Access denied'}), 403
            
        if os.path.exists(filepath):
            return send_file(filepath, as_attachment=True, download_name=filename)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500