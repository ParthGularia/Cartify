import os
from dotenv import load_dotenv

# Get the base directory (two levels up from this file)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DOTENV_PATH = os.path.join(BASE_DIR, '.env')
EMBEDDINGS_PATH = os.path.join(BASE_DIR, 'embeddings.pkl')
FILENAMES_PATH = os.path.join(BASE_DIR, 'filenames.pkl')

# Load environment variables from .env file if it exists
if os.path.exists(DOTENV_PATH):
    load_dotenv(DOTENV_PATH)
    print('Loading environment variables from:', DOTENV_PATH)
else:
    print('No .env file found, using system environment variables and defaults')

# Get Google API key from environment
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if not GOOGLE_API_KEY:
    print('WARNING: GOOGLE_API_KEY not found in environment variables. AI features will be limited.')
    GOOGLE_API_KEY = None

# Get allowed origins for CORS
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '*').split(',')

# Data directory
DATA_DIR = os.path.join(BASE_DIR, 'data')

# Hugging Face repository settings
HF_REPO_ID = 'DevilDev/personal'
HF_EMBEDDINGS_FILENAME = 'embeddings.pkl'
HF_FILENAMES_FILENAME = 'filenames.pkl'

# File paths (will be set later)


# Data file paths
RECOMMEND_DATA_PATH = os.path.join(BASE_DIR, 'recommend_data.csv')
FINAL_FILE_PATH = os.path.join(BASE_DIR, 'final_file.csv')

class Config:
    """Application Configuration"""
    
    # MongoDB configuration
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://navneetg050:navi%40805020@hackerthon.kjipbsn.mongodb.net/cartify')
    
    # Flask configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')

# Create config instance
config = Config()

# Print configuration status
print('GOOGLE_API_KEY Loaded:', GOOGLE_API_KEY[:6] + '...' if GOOGLE_API_KEY else 'Not set')
print('SECRET_KEY Loaded:', '***masked***' if config.SECRET_KEY else 'Not set')
print('FLASK_DEBUG Mode:', config.DEBUG)
print('MongoDB URI Loaded:', '***masked***' if config.MONGO_URI else 'Not set')

__all__ = [
    'GOOGLE_API_KEY', 'ALLOWED_ORIGINS', 'FINAL_FILE_PATH', 'RECOMMEND_DATA_PATH',
    'EMBEDDINGS_PATH', 'FILENAMES_PATH', 'HF_REPO_ID', 'HF_EMBEDDINGS_FILENAME',
    'HF_FILENAMES_FILENAME', 'config'
]
