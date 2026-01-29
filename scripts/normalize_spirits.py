"""
Spirit Data Normalization Script

This script normalizes spirit names by extracting volume, ABV, and lot information
into separate fields and cleaning the name field.

Usage:
    python scripts/normalize_spirits.py --dry-run    # Preview changes without applying
    python scripts/normalize_spirits.py --execute    # Apply changes to Firebase
    python scripts/normalize_spirits.py --batch 100  # Process in batches of 100
"""

import re
import json
import argparse
from typing import Dict, List, Tuple, Optional
import requests
import time

# Normalization patterns
VOLUME_PATTERNS = [
    # Decimal volumes MUST come first to match before integer patterns
    (r'(\d+\.\d+)\s*ml\b', 1, 'ml'),           # 750.5ml
    (r'(\d+\.\d+)\s*l\b', 1000, 'L'),          # 1.5l -> 1500ml
    # Integer volumes
    (r'(\d+)\s*ml\b', 1, 'ml'),                # 700ml
    (r'(\d+)\s*l\b', 1000, 'L'),               # 1l -> 1000ml
    (r'(\d+)\s*리터', 1000, 'L'),
    (r'(\d+)\s*밀리리터', 1, 'ml'),
]

ABV_PATTERNS = [
    (r'(\d+\.?\d*)\s*%', 1, '%'),         # 40%
    (r'(\d+\.?\d*)\s*도', 1, '도'),       # 40도
    (r'(\d+\.?\d*)\s*proof', 0.5, 'proof'), # 80 proof -> 40%
]

LOT_PATTERNS = [
    r'\(\s*lot\s*no\.?\s*[A-Z0-9\s]+\)',  # (LOT NO. L 0119355 0409)
    r'lot\s*no\.?\s*[A-Z0-9\s]+',  # LOT NO. L 0119355 0409
    r'\(\s*lot\s*[#:]?\s*[A-Z0-9]+\)',  # (LoT LF15M)
    r'lot\s*[#:]?\s*\d+',
    r'batch\s*[#:]?\s*\d+',
    r'로트\s*\d+',
    r'\[\s*[A-Z0-9\s]+\]',  # [LMTE311 24] style
    r'\(?\s*L\s*\d{4,}[\s\d]*\s*\)?',  # L 0119355 0409 or (L1234)
    r'\s+L\s*\d{4,}[\s\d]*\b',  # Space followed by L and 4+ digits
]

def extract_volume(name: str) -> Tuple[Optional[float], str]:
    """Extract volume from name and return (volume_ml, cleaned_name)"""
    name_lower = name.lower()
    
    for pattern, multiplier, unit_type in VOLUME_PATTERNS:
        match = re.search(pattern, name_lower, re.IGNORECASE)
        if match:
            volume = float(match.group(1)) * multiplier
            # Remove the matched pattern from name
            cleaned = re.sub(pattern, '', name, flags=re.IGNORECASE).strip()
            # Clean up extra spaces and separators
            cleaned = re.sub(r'\s+', ' ', cleaned)
            cleaned = re.sub(r'\s*[/\-]\s*$', '', cleaned).strip()
            return volume, cleaned
    
    return None, name

def extract_abv(name: str) -> Tuple[Optional[float], str]:
    """Extract ABV from name and return (abv, cleaned_name)"""
    name_lower = name.lower()
    
    for pattern, multiplier, unit_type in ABV_PATTERNS:
        match = re.search(pattern, name_lower, re.IGNORECASE)
        if match:
            abv = float(match.group(1)) * multiplier
            # Remove the matched pattern from name
            cleaned = re.sub(pattern, '', name, flags=re.IGNORECASE).strip()
            # Clean up parentheses if empty
            cleaned = re.sub(r'\(\s*\)', '', cleaned)
            cleaned = re.sub(r'\s+', ' ', cleaned).strip()
            return abv, cleaned
    
    return None, name

def extract_lot_info(name: str) -> str:
    """Remove lot/batch information from name"""
    cleaned = name
    
    for pattern in LOT_PATTERNS:
        cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)
    
    # Clean up extra spaces and separators
    cleaned = re.sub(r'\s+', ' ', cleaned)
    cleaned = re.sub(r'\s*[/\-]\s*$', '', cleaned).strip()
    
    return cleaned

def final_cleanup(name: str) -> str:
    """Final cleanup of special characters and empty parentheses"""
    cleaned = name
    
    # Remove empty parentheses
    cleaned = re.sub(r'\(\s*\)', '', cleaned)
    
    # Remove trailing/leading special characters
    cleaned = re.sub(r'^[\s/\-]+', '', cleaned)  # Leading
    cleaned = re.sub(r'[\s/\-]+$', '', cleaned)  # Trailing
    
    # Clean up multiple spaces
    cleaned = re.sub(r'\s+', ' ', cleaned)
    
    # Remove standalone special characters
    cleaned = re.sub(r'\s+[/\-]\s+', ' ', cleaned)
    
    return cleaned.strip()

def normalize_spirit(spirit: Dict) -> Tuple[Dict, Dict]:
    """
    Normalize a spirit and return (updates, metadata)
    
    Returns:
        updates: Fields to update in Firebase
        metadata: Information about what was changed
    """
    original_name = spirit['name']
    current_volume = spirit.get('volume')
    current_abv = spirit.get('abv')
    
    updates = {}
    metadata = {
        'original_name': original_name,
        'changes': []
    }
    
    # Start with original name
    cleaned_name = original_name
    
    # Extract volume
    extracted_volume, cleaned_name = extract_volume(cleaned_name)
    if extracted_volume:
        if current_volume and abs(current_volume - extracted_volume) > 1:
            # Volume mismatch - log warning but use extracted value
            metadata['changes'].append({
                'field': 'volume',
                'from': current_volume,
                'to': extracted_volume,
                'warning': 'Volume mismatch with existing value'
            })
        elif not current_volume or current_volume == 700:  # 700 is often default
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
            # ABV mismatch - log warning but use extracted value
            metadata['changes'].append({
                'field': 'abv',
                'from': current_abv,
                'to': extracted_abv,
                'warning': 'ABV mismatch with existing value'
            })
        else:
            metadata['changes'].append({
                'field': 'abv',
                'from': current_abv,
                'to': extracted_abv
            })
        
        updates['abv'] = extracted_abv
    
    # Remove lot information
    cleaned_name = extract_lot_info(cleaned_name)
    
    # Final cleanup of special characters
    cleaned_name = final_cleanup(cleaned_name)
    
    # Update name if it changed
    if cleaned_name != original_name:
        updates['name'] = cleaned_name
        metadata['changes'].append({
            'field': 'name',
            'from': original_name,
            'to': cleaned_name
        })
    
    return updates, metadata

def load_spirits_to_normalize():
    """Load spirits that need normalization from the report"""
    with open('scripts/normalization_report.json', 'r', encoding='utf-8') as f:
        report = json.load(f)
    
    return report['issues']

def apply_normalization(spirit_id: str, updates: Dict, dry_run: bool = True):
    """Apply normalization updates to a spirit"""
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
    parser = argparse.ArgumentParser(description='Normalize spirit data')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without applying')
    parser.add_argument('--execute', action='store_true', help='Apply changes to Firebase')
    parser.add_argument('--batch', type=int, default=50, help='Batch size for processing')
    parser.add_argument('--limit', type=int, help='Limit number of spirits to process')
    
    args = parser.parse_args()
    
    if not args.dry_run and not args.execute:
        print("Please specify either --dry-run or --execute")
        return
    
    print("\n" + "="*80)
    print(f"SPIRIT DATA NORMALIZATION {'(DRY RUN)' if args.dry_run else '(EXECUTING)'}")
    print("="*80 + "\n")
    
    # Load spirits to normalize
    spirits_to_normalize = load_spirits_to_normalize()
    
    if args.limit:
        spirits_to_normalize = spirits_to_normalize[:args.limit]
    
    print(f"Processing {len(spirits_to_normalize)} spirits...")
    print()
    
    results = {
        'processed': 0,
        'updated': 0,
        'skipped': 0,
        'errors': 0,
        'changes_log': []
    }
    
    for i, issue in enumerate(spirits_to_normalize, 1):
        spirit_id = issue['id']
        spirit_name = issue['name']
        
        # Create a spirit dict for normalization
        spirit = {
            'id': spirit_id,
            'name': spirit_name,
            'volume': issue.get('current_volume'),
            'abv': issue.get('current_abv')
        }
        
        # Normalize
        updates, metadata = normalize_spirit(spirit)
        
        if not updates:
            results['skipped'] += 1
            continue
        
        # Log changes
        results['changes_log'].append({
            'id': spirit_id,
            'updates': updates,
            'metadata': metadata
        })
        
        # Apply updates
        if args.execute:
            success = apply_normalization(spirit_id, updates, dry_run=False)
            if success:
                results['updated'] += 1
                print(f"✓ [{i}/{len(spirits_to_normalize)}] Updated: {spirit_name[:50]}...")
            else:
                results['errors'] += 1
                print(f"✗ [{i}/{len(spirits_to_normalize)}] Failed: {spirit_name[:50]}...")
        else:
            results['updated'] += 1
            print(f"[DRY RUN] [{i}/{len(spirits_to_normalize)}] Would update: {spirit_name[:50]}...")
            if metadata['changes']:
                for change in metadata['changes']:
                    print(f"  - {change['field']}: {change.get('from')} → {change.get('to')}")
        
        results['processed'] += 1
        
        # Batch delay to avoid overwhelming the server
        if args.execute and i % args.batch == 0:
            print(f"\nProcessed {i} spirits. Pausing for 2 seconds...")
            time.sleep(2)
    
    # Save results
    results_file = 'scripts/normalization_results.json'
    with open(results_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    # Print summary
    print("\n" + "="*80)
    print("NORMALIZATION SUMMARY")
    print("-"*80)
    print(f"Processed: {results['processed']}")
    print(f"Updated: {results['updated']}")
    print(f"Skipped: {results['skipped']}")
    print(f"Errors: {results['errors']}")
    print(f"\nResults saved to: {results_file}")
    print("="*80 + "\n")

if __name__ == '__main__':
    main()
