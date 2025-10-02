import os
from sqlalchemy import create_engine

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