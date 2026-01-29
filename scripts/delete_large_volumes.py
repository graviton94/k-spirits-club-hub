"""
Delete Large Volume Spirits from Firebase

Finds and deletes all spirits with volume >= 5000ml (5L)
"""

import requests
import json

print("Fetching all spirits from Firebase...")
response = requests.get('http://localhost:3000/api/admin/spirits?pageSize=10000')
data = response.json()
spirits = data.get('data', [])

print(f"Total spirits: {len(spirits)}")

# Find spirits with volume >= 5000ml
large_volume_spirits = [
    spirit for spirit in spirits
    if spirit.get('volume', 0) >= 5000
]

print(f"\nFound {len(large_volume_spirits)} spirits with volume >= 5L:")
print("="*80)

for spirit in large_volume_spirits:
    volume_liters = spirit.get('volume', 0) / 1000
    print(f"  - {spirit['name'][:50]:50} | {volume_liters}L | ID: {spirit['id']}")

if not large_volume_spirits:
    print("No large volume spirits found. Nothing to delete.")
    exit(0)

# Confirm deletion
print("\n" + "="*80)
confirm = input(f"\nDelete these {len(large_volume_spirits)} spirits? (yes/no): ")

if confirm.lower() != 'yes':
    print("Deletion cancelled.")
    exit(0)

# Delete spirits
print(f"\nDeleting {len(large_volume_spirits)} spirits...")
deleted_count = 0
failed_count = 0

for i, spirit in enumerate(large_volume_spirits, 1):
    try:
        response = requests.delete(f"http://localhost:3000/api/admin/spirits/{spirit['id']}")
        if response.ok:
            deleted_count += 1
            print(f"✓ [{i}/{len(large_volume_spirits)}] Deleted: {spirit['name'][:50]}")
        else:
            failed_count += 1
            print(f"✗ [{i}/{len(large_volume_spirits)}] Failed: {spirit['name'][:50]}")
    except Exception as e:
        failed_count += 1
        print(f"✗ [{i}/{len(large_volume_spirits)}] Error: {e}")

print("\n" + "="*80)
print("DELETION SUMMARY")
print("-"*80)
print(f"Deleted: {deleted_count}")
print(f"Failed: {failed_count}")
print("="*80)
