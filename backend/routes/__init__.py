from .table_routes import table_bp
from .prediction_routes import prediction_bp
from .download_routes import download_bp
from .chat_routes import chat_bp
from .search_routes import search_bp
from .query_routes import query_bp

def register_routes(app):
    """Register all route blueprints with the Flask app"""
    app.register_blueprint(table_bp, url_prefix='/api')
    app.register_blueprint(prediction_bp, url_prefix='/api')
    app.register_blueprint(download_bp, url_prefix='/api')
    app.register_blueprint(chat_bp, url_prefix='/api')
    app.register_blueprint(search_bp, url_prefix='/api')
    app.register_blueprint(query_bp, url_prefix='/api')