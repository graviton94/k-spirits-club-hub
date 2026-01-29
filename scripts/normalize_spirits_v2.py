"""
Spirit Data Normalization Script v2

This script normalizes spirit names by:
1. Extracting volume, ABV, and lot information to separate fields
2. Moving remaining bracketed/parenthesized content to description
3. Cleaning the name field

Usage:
    python scripts/normalize_spirits_v2.py --dry-run    # Preview changes
    python scripts/normalize_spirits_v2.py --execute    # Apply to Firebase
"""

import re
import json
import argparse
from typing import Dict, List, Tuple, Optional
import requests
import time

# Normalization patterns
VOLUME_PATTERNS = [
    (r'(\d+\.\d+)\s*ml\b', 1, 'ml'),
    (r'(\d+\.\d+)\s*l\b', 1000, 'L'),
    (r'(\d+)\s*ml\b', 1, 'ml'),
    (r'(\d+)\s*l\b', 1000, 'L'),
    (r'(\d+)\s*리터', 1000, 'L'),
    (r'(\d+)\s*밀리리터', 1, 'ml'),
]

ABV_PATTERNS = [
    (r'(\d+\.?\d*)\s*%', 1, '%'),
    (r'(\d+\.?\d*)\s*도', 1, '도'),
    (r'(\d+\.?\d*)\s*proof', 0.5, 'proof'),
]

LOT_PATTERNS = [
    r'\(\s*lot\s*no\.?\s*[A-Z0-9\s]+\)',
    r'lot\s*no\.?\s*[A-Z0-9\s]+',
    r'\(\s*lot\s*[#:]?\s*[A-Z0-9]+\)',
    r'lot\s*[#:]?\s*\d+',
    r'batch\s*[#:]?\s*\d+',
    r'로트\s*\d+',
    r'\[\s*[A-Z0-9\s]+\]',
    r'\(?\s*L\s*\d{4,}[\s\d]*\s*\)?',
    r'\s+L\s*\d{4,}[\s\d]*\b',
]

def extract_volume(name: str) -> Tuple[Optional[float], str]:
    """Extract volume from name"""
    for pattern, multiplier, unit_type in VOLUME_PATTERNS:
        match = re.search(pattern, name, re.IGNORECASE)
        if match:
            volume = float(match.group(1)) * multiplier
            cleaned = re.sub(pattern, '', name, flags=re.IGNORECASE).strip()
            cleaned = re.sub(r'\s+', ' ', cleaned)
            return volume, cleaned
    return None, name

def extract_abv(name: str) -> Tuple[Optional[float], str]:
    """Extract ABV from name"""
    for pattern, multiplier, unit_type in ABV_PATTERNS:
        match = re.search(pattern, name, re.IGNORECASE)
        if match:
            abv = float(match.group(1)) * multiplier
            cleaned = re.sub(pattern, '', name, flags=re.IGNORECASE).strip()
            cleaned = re.sub(r'\s+', ' ', cleaned).strip()
            return abv, cleaned
    return None, name

def extract_lot_info(name: str) -> str:
    """Remove lot/batch information"""
    cleaned = name
    for pattern in LOT_PATTERNS:
        cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def extract_description(name: str) -> Tuple[str, str]:
    """
    Extract remaining bracketed/parenthesized content to description.
    Returns (cleaned_name, description)
    """
    description_parts = []
    cleaned = name
    
    # Extract [content]
    bracket_matches = re.findall(r'\[([^\]]+)\]', cleaned)
    for match in bracket_matches:
        content = match.strip()
        if content:  # Only add non-empty
            description_parts.append(content)
    cleaned = re.sub(r'\[[^\]]*\]', '', cleaned)
    
    # Extract (content)
    paren_matches = re.findall(r'\(([^\)]+)\)', cleaned)
    for match in paren_matches:
        content = match.strip()
        if content:  # Only add non-empty
            description_parts.append(content)
    cleaned = re.sub(r'\([^\)]*\)', '', cleaned)
    
    # Extract /content at end
    slash_match = re.search(r'/\s*([^/]+)$', cleaned)
    if slash_match:
        content = slash_match.group(1).strip()
        if content:
            description_parts.append(content)
        cleaned = re.sub(r'/\s*[^/]+$', '', cleaned)
    
    # Final cleanup
    cleaned = re.sub(r'^[\s/\-]+', '', cleaned)
    cleaned = re.sub(r'[\s/\-]+$', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    
    description = ' / '.join(description_parts) if description_parts else ''
    
    return cleaned, description

def normalize_spirit(spirit: Dict) -> Tuple[Dict, Dict]:
    """Normalize a spirit and return (updates, metadata)"""
    original_name = spirit['name']
    current_volume = spirit.get('volume')
    current_abv = spirit.get('abv')
    
    updates = {}
    metadata = {
        'original_name': original_name,
        'changes': []
    }
    
    cleaned_name = original_name
    
    # Extract volume
    extracted_volume, cleaned_name = extract_volume(cleaned_name)
    if extracted_volume:
        if current_volume and abs(current_volume - extracted_volume) > 1:
            metadata['changes'].append({
                'field': 'volume',
                'from': current_volume,
                'to': extracted_volume,
                'warning': 'Volume mismatch'
            })
        elif not current_volume or current_volume == 700:
            metadata['changes'].append({
                'field': 'volume',
                'from': current_volume,
                'to': extracted_volume
            })
        updates['volume'] = int(extracted_volume)
    
    # Extract ABV
    extracted_abv, cleaned_name = extract_abv(cleaned_name)
    if extracted_abv:
        if current_abv and abs(current_abv - extracted_abv) > 0.5:
            metadata['changes'].append({
                'field': 'abv',
                'from': current_abv,
                'to': extracted_abv,
                'warning': 'ABV mismatch'
            })
        else:
            metadata['changes'].append({
                'field': 'abv',
                'from': current_abv,
                'to': extracted_abv
            })
        updates['abv'] = extracted_abv
    
    # Remove lot info
    cleaned_name = extract_lot_info(cleaned_name)
    
    # Extract description from remaining brackets/parentheses
    cleaned_name, description = extract_description(cleaned_name)
    
    # Update name if changed
    if cleaned_name != original_name:
        updates['name'] = cleaned_name
        metadata['changes'].append({
            'field': 'name',
            'from': original_name,
            'to': cleaned_name
        })
    
    # Add description if extracted
    if description:
        updates['description'] = description
        metadata['changes'].append({
            'field': 'description',
            'from': None,
            'to': description
        })
    
    return updates, metadata

def load_spirits_to_normalize():
    """Load spirits from report"""
    with open('scripts/normalization_report.json', 'r', encoding='utf-8') as f:
        report = json.load(f)
    return report['issues']

def apply_normalization(spirit_id: str, updates: Dict, dry_run: bool = True):
    """Apply updates to Firebase"""
    if dry_run:
        return True
    
    try:
        response = requests.patch(
            f'http://localhost:3000/api/admin/spirits/{spirit_id}',
            json=updates,
            headers={'Content-Type': 'application/json'}
        )
        return response.ok
    except Exception as e:
        print(f"Error updating {spirit_id}: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Normalize spirit data v2')
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--batch', type=int, default=50)
    parser.add_argument('--limit', type=int)
    
    args = parser.parse_args()
    
    if not args.dry_run and not args.execute:
        print("Please specify --dry-run or --execute")
        return
    
    print("\n" + "="*80)
    print(f"SPIRIT NORMALIZATION V2 {'(DRY RUN)' if args.dry_run else '(EXECUTING)'}")
    print("="*80 + "\n")
    
    spirits_to_normalize = load_spirits_to_normalize()
    
    if args.limit:
        spirits_to_normalize = spirits_to_normalize[:args.limit]
    
    print(f"Processing {len(spirits_to_normalize)} spirits...\n")
    
    results = {
        'processed': 0,
        'updated': 0,
        'skipped': 0,
        'errors': 0,
        'changes_log': []
    }
    
    for i, issue in enumerate(spirits_to_normalize, 1):
        spirit = {
            'id': issue['id'],
            'name': issue['name'],
            'volume': issue.get('current_volume'),
            'abv': issue.get('current_abv')
        }
        
        updates, metadata = normalize_spirit(spirit)
        
        if not updates:
            results['skipped'] += 1
            continue
        
        results['changes_log'].append({
            'id': spirit['id'],
            'updates': updates,
            'metadata': metadata
        })
        
        if args.execute:
            success = apply_normalization(spirit['id'], updates, dry_run=False)
            if success:
                results['updated'] += 1
                print(f"✓ [{i}/{len(spirits_to_normalize)}] {spirit['name'][:50]}...")
            else:
                results['errors'] += 1
                print(f"✗ [{i}/{len(spirits_to_normalize)}] FAILED")
        else:
            results['updated'] += 1
            print(f"[DRY] [{i}/{len(spirits_to_normalize)}] {spirit['name'][:40]}...")
            for change in metadata['changes']:
                field = change['field']
                if field == 'description':
                    print(f"  + description: {change['to'][:60]}...")
                else:
                    print(f"  - {field}: {change.get('from')} → {change.get('to')}")
        
        results['processed'] += 1
        
        if args.execute and i % args.batch == 0:
            print(f"\nBatch {i} done. Pausing 2s...")
            time.sleep(2)
    
    with open('scripts/normalization_results_v2.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print("\n" + "="*80)
    print("SUMMARY")
    print("-"*80)
    print(f"Processed: {results['processed']}")
    print(f"Updated: {results['updated']}")
    print(f"Skipped: {results['skipped']}")
    print(f"Errors: {results['errors']}")
    print(f"\nResults: scripts/normalization_results_v2.json")
    print("="*80 + "\n")

if __name__ == '__main__':
    main()
