"""
Normalize remaining 113 spirits

Uses the full_normalization_analysis.json to process remaining spirits
"""

import re
import json
import requests
import time

def extract_volume(name: str):
    patterns = [
        (r'(\d+\.\d+)\s*ml\b', 1),
        (r'(\d+\.\d+)\s*l\b', 1000),
        (r'(\d+)\s*ml\b', 1),
        (r'(\d+)\s*l\b', 1000),
    ]
    for pattern, mult in patterns:
        match = re.search(pattern, name, re.I)
        if match:
            return float(match.group(1)) * mult, re.sub(pattern, '', name, flags=re.I).strip()
    return None, name

def extract_abv(name: str):
    patterns = [
        (r'(\d+\.?\d*)\s*%', 1),
        (r'(\d+\.?\d*)\s*도', 1),
    ]
    for pattern, mult in patterns:
        match = re.search(pattern, name, re.I)
        if match:
            return float(match.group(1)) * mult, re.sub(pattern, '', name, flags=re.I).strip()
    return None, name

def extract_description(name: str):
    desc_parts = []
    cleaned = name
    
    # Extract [content]
    for match in re.findall(r'\[([^\]]+)\]', cleaned):
        if match.strip():
            desc_parts.append(match.strip())
    cleaned = re.sub(r'\[[^\]]*\]', '', cleaned)
    
    # Extract (content)
    for match in re.findall(r'\(([^\)]+)\)', cleaned):
        if match.strip():
            desc_parts.append(match.strip())
    cleaned = re.sub(r'\([^\)]*\)', '', cleaned)
    
    # Cleanup
    cleaned = re.sub(r'^[\s/\-]+', '', cleaned)
    cleaned = re.sub(r'[\s/\-]+$', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    
    return cleaned, ' / '.join(desc_parts) if desc_parts else ''

def normalize_spirit(spirit):
    original_name = spirit['name']
    updates = {}
    changes = []
    
    cleaned_name = original_name
    
    # Extract volume
    vol, cleaned_name = extract_volume(cleaned_name)
    if vol:
        updates['volume'] = int(vol)
        changes.append(f"volume: {vol}")
    
    # Extract ABV
    abv, cleaned_name = extract_abv(cleaned_name)
    if abv:
        updates['abv'] = abv
        changes.append(f"abv: {abv}")
    
    # Extract description
    cleaned_name, desc = extract_description(cleaned_name)
    
    if cleaned_name != original_name:
        updates['name'] = cleaned_name
        changes.append(f"name: {original_name} → {cleaned_name}")
    
    if desc:
        updates['description'] = desc
        changes.append(f"description: {desc}")
    
    return updates, changes

# Load spirits to normalize
with open('scripts/full_normalization_analysis.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

spirits_to_norm = data['spirits_needing_normalization']

print(f"\n{'='*80}")
print(f"NORMALIZING {len(spirits_to_norm)} REMAINING SPIRITS")
print(f"{'='*80}\n")

results = {'processed': 0, 'updated': 0, 'errors': 0, 'changes': []}

for i, spirit in enumerate(spirits_to_norm, 1):
    updates, changes = normalize_spirit(spirit)
    
    if not updates:
        continue
    
    # Apply to Firebase
    try:
        response = requests.patch(
            f"http://localhost:3000/api/admin/spirits/{spirit['id']}",
            json=updates,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.ok:
            results['updated'] += 1
            print(f"✓ [{i}/{len(spirits_to_norm)}] {spirit['name'][:50]}...")
            for change in changes:
                print(f"  {change}")
        else:
            results['errors'] += 1
            print(f"✗ [{i}/{len(spirits_to_norm)}] FAILED")
    except Exception as e:
        results['errors'] += 1
        print(f"✗ [{i}/{len(spirits_to_norm)}] ERROR: {e}")
    
    results['processed'] += 1
    results['changes'].append({
        'id': spirit['id'],
        'updates': updates,
        'changes': changes
    })
    
    if i % 50 == 0:
        print(f"\nBatch done. Pausing 2s...")
        time.sleep(2)

with open('scripts/remaining_normalization_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n{'='*80}")
print("SUMMARY")
print(f"{'-'*80}")
print(f"Processed: {results['processed']}")
print(f"Updated: {results['updated']}")
print(f"Errors: {results['errors']}")
print(f"\nResults: scripts/remaining_normalization_results.json")
print(f"{'='*80}\n")
