#!/usr/bin/env python3
# Test Firestore connection
import os
from google.cloud import firestore
from google.oauth2 import service_account
from dotenv import load_dotenv

load_dotenv('.env.local')
load_dotenv()

FIREBASE_PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID')
FIREBASE_PRIVATE_KEY = os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n')
FIREBASE_CLIENT_EMAIL = os.getenv('FIREBASE_CLIENT_EMAIL')

credentials = service_account.Credentials.from_service_account_info({
    'type': 'service_account',
    'project_id': FIREBASE_PROJECT_ID,
    'private_key': FIREBASE_PRIVATE_KEY,
    'client_email': FIREBASE_CLIENT_EMAIL,
    'token_uri': 'https://oauth2.googleapis.com/token',
})

db = firestore.Client(credentials=credentials, project=FIREBASE_PROJECT_ID)

print("Testing Firestore connection...")
print(f"Project ID: {FIREBASE_PROJECT_ID}")

# Test 1: Get first document
print("\nTest 1: Getting first 3 documents from 'spirits' collection...")
try:
    docs = db.collection('spirits').limit(3).stream()
    count = 0
    for doc in docs:
        count += 1
        data = doc.to_dict()
        print(f"  [{count}] {doc.id}")
        print(f"      name: {data.get('name', 'N/A')}")
        print(f"      isPublished: {data.get('isPublished', 'N/A')}")
        print(f"      status: {data.get('status', 'N/A')}")
    print(f"✅ Found {count} documents")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

# Test 2: Query with isPublished=True
print("\nTest 2: Querying with isPublished=True...")
try:
    docs = db.collection('spirits').where('isPublished', '==', True).limit(3).stream()
    count = 0
    for doc in docs:
        count += 1
        data = doc.to_dict()
        print(f"  [{count}] {doc.id}: {data.get('name', 'N/A')}")
    print(f"✅ Found {count} documents with isPublished=True")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

print("\nDone!")
