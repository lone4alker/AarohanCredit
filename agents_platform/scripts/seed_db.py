import json
import sys
from pathlib import Path
from agents_platform.core.db import get_database

def seed_database():
    """
    Reads sample_data.json and seeds it into the MongoDB database.
    """
    print("Seeding database...")
    
    # Path to sample data
    # Assuming this script is in agents_platform/scripts/seed_db.py
    # and sample data is in agents_platform/examples/sample_data.json
    current_dir = Path(__file__).resolve().parent
    sample_data_path = current_dir.parent / "examples" / "sample_data.json"
    
    if not sample_data_path.exists():
        print(f"Error: Sample data file not found at {sample_data_path}")
        return

    try:
        with open(sample_data_path, 'r') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading sample data: {e}")
        return

    db = get_database()
    collection = db["msme_data"]
    
    # Check if data already exists to avoid duplicates (optional, based on msme_id)
    msme_id = data.get("msme_id") or data.get("msme_profile", {}).get("msme_id")
    
    if msme_id:
        existing = collection.find_one({"msme_id": msme_id}) # Check top level or inside profile? 
        # Let's check if we can find a document that looks like this one.
        # Since the structure might vary, let's just use msme_id if available.
        
        # Actually, let's just insert it. If we want to be cleaner, we could delete existing.
        # But for now, let's just insert/replace.
        
        # If the data is a single object representing one MSME
        if isinstance(data, dict):
             # Try to find a unique identifier. 
             # The sample data seems to be a single MSME record.
             # Let's use 'msme_id' as the key.
             if msme_id:
                 result = collection.replace_one({"msme_id": msme_id}, data, upsert=True)
                 print(f"Upserted document with msme_id: {msme_id}")
                 print(f"Matched: {result.matched_count}, Modified: {result.modified_count}, Upserted: {result.upserted_id}")
             else:
                 # If no ID, just insert
                 result = collection.insert_one(data)
                 print(f"Inserted document with id: {result.inserted_id}")
        elif isinstance(data, list):
            # If it's a list of records
            result = collection.insert_many(data)
            print(f"Inserted {len(result.inserted_ids)} documents")
            
    else:
        print("Could not determine msme_id from data. Inserting as new document.")
        result = collection.insert_one(data)
        print(f"Inserted document with id: {result.inserted_id}")

    print("Database seeding complete.")

if __name__ == "__main__":
    # Add the project root to sys.path so imports work
    # agents_platform/scripts/seed_db.py -> ../../ -> root
    project_root = Path(__file__).resolve().parent.parent.parent
    sys.path.insert(0, str(project_root))
    
    seed_database()
