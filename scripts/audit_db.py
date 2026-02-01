
import os
import json
import base64
import time
import requests
from dotenv import load_dotenv

load_dotenv('.env.local')

PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID')
CLIENT_EMAIL = os.getenv('FIREBASE_CLIENT_EMAIL')
PRIVATE_KEY = os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n')

def get_access_token():
    # Since rolling our own JWT signature in pure python without libraries like PyJWT or cryptography is hard,
    # let's hope the environment has 'google-auth' or 'cryptography'.
    # If not, I'll try a different way.
    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import Request
        
        info = {
            "project_id": PROJECT_ID,
            "client_email": CLIENT_EMAIL,
            "private_key": PRIVATE_KEY,
            "type": "service_account",
            "token_uri": "https://oauth2.googleapis.com/token"
        }
        creds = service_account.Credentials.from_service_account_info(info, scopes=["https://www.googleapis.com/auth/datastore"])
        creds.refresh(Request())
        return creds.token
    except ImportError:
        print("Required Python libraries (google-auth) not found. Falling back to simple fetch if possible.")
        return None

def from_firestore_value(value):
    if not value: return None
    if 'stringValue' in value: return value['stringValue']
    if 'booleanValue' in value: return value['booleanValue']
    if 'integerValue' in value: return int(value['integerValue'])
    if 'doubleValue' in value: return float(value['doubleValue'])
    if 'mapValue' in value:
        fields = value['mapValue'].get('fields', {})
        return {k: from_firestore_value(v) for k, v in fields.items()}
    if 'arrayValue' in value:
        vals = value['arrayValue'].get('values', [])
        return [from_firestore_value(v) for v in vals]
    return None

def audit():
    token = get_access_token()
    if not token:
        print("Failed to get auth token.")
        return

    # Use runQuery for better control
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents:runQuery"
    
    # Root level parent for root collections
    parent = f"projects/{PROJECT_ID}/databases/(default)/documents"
    
    query = {
        "structuredQuery": {
            "from": [{"collectionId": "spirits"}],
            "limit": 5000
        }
    }
    
    print(f"Fetching spirits from Firestore...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(url, headers=headers, json={"parent": parent, **query})
    
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        print(response.text)
        return

    results = response.json()
    print(f"Received {len(results)} items.")
    
    audit_data = {}
    
    for item in results:
        doc = item.get('document')
        if not doc: continue
        
        fields = doc.get('fields', {})
        category = from_firestore_value(fields.get('category')) or 'Unknown'
        subcategory = from_firestore_value(fields.get('subcategory')) or 'None'
        
        if category not in audit_data:
            audit_data[category] = set()
        audit_data[category].add(subcategory)

    print("\n--- Firestore Audit Results ---")
    for cat in sorted(audit_data.keys()):
        print(f"\n[{cat}]")
        for sub in sorted(list(audit_data[cat])):
            print(f"  - {sub}")
    print("\n--- End of Audit ---")

if __name__ == "__main__":
    audit()
