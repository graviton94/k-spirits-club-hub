#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Firestore 업데이트 확인 스크립트
Audit가 실제로 Firestore에 반영되었는지 확인
"""

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

print("🔍 Checking if audit results are reflected in Firestore...")
print(f"Project ID: {FIREBASE_PROJECT_ID}\n")

# Sample 10 published spirits to check
print("Fetching 10 sample published spirits...")
docs = db.collection('spirits').where('isPublished', '==', True).limit(10).stream()

count = 0
has_audit_metadata = 0

for doc in docs:
    count += 1
    data = doc.to_dict()
    
    # Check if audit metadata exists
    audit_date = data.get('metadata', {}).get('auditDate')
    corrections = data.get('metadata', {}).get('corrections')
    
    print(f"\n[{count}] {doc.id}: {data.get('name', 'N/A')}")
    print(f"    Country: {data.get('country', 'N/A')}")
    print(f"    Region: {data.get('region', 'N/A')}")
    print(f"    Distillery: {data.get('distillery', 'N/A')}")
    
    if audit_date:
        has_audit_metadata += 1
        print(f"    ✅ Audit Date: {audit_date}")
        if corrections:
            print(f"    📝 Corrections: {len(corrections)} items")
            for correction in corrections[:2]:  # Show first 2
                print(f"       - {correction}")
    else:
        print(f"    ❌ No audit metadata found")

print(f"\n{'='*60}")
print(f"Summary:")
print(f"  Total checked: {count}")
print(f"  Has audit metadata: {has_audit_metadata}")
print(f"  Missing audit: {count - has_audit_metadata}")

if has_audit_metadata > 0:
    print(f"\n✅ Audit results ARE reflected in Firestore!")
else:
    print(f"\n❌ Audit results are NOT in Firestore. Need to re-run audit without --dry-run")
