import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

def get_database():
    """
    Establishes a connection to the MongoDB database using the URI from the backend .env file.
    Returns the database object.
    """
    # Load environment variables from backend/.env
    # agents_platform/core/db.py -> agents_platform/core -> agents_platform -> root -> backend -> .env
    
    current_dir = Path(__file__).resolve().parent
    project_root = current_dir.parent.parent
    backend_env_path = project_root / "backend" / ".env"
    
    print(f"DEBUG: Looking for .env at: {backend_env_path}")
    
    if not backend_env_path.exists():
        # Fallback: maybe we are in a different structure?
        cwd = Path.cwd()
        print(f"DEBUG: CWD is {cwd}")
        backend_env_path = cwd / "backend" / ".env"
        print(f"DEBUG: Fallback looking at: {backend_env_path}")
        
    if backend_env_path.exists():
        print(f"DEBUG: Found .env file at {backend_env_path}")
        load_dotenv(backend_env_path)
    else:
        print(f"Warning: Could not find .env file at {backend_env_path}")

    # Check for MONGODB_URI (as seen in .env) or MONGO_URI (fallback)
    mongo_uri = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")
    
    if not mongo_uri:
        # Debug: print keys to help debug if it fails again
        # print("DEBUG: Env vars keys:", list(os.environ.keys()))
        raise ValueError("MONGODB_URI not found in environment variables")

    client = MongoClient(mongo_uri)
    
    # Extract database name from URI or use default
    try:
        db = client.get_default_database()
    except Exception:
        # Fallback if no database specified in URI
        db = client["msme_db"]
        
    return db