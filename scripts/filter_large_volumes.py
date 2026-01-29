"""
Filter Large Volume Spirits - Pipeline Step

Removes spirits with volume >= 5000ml (5L or larger) from the batch.
These are typically kegs or bulk containers not suitable for the catalog.
"""

import json
import argparse

def main():
    parser = argparse.ArgumentParser(description='Filter out large volume spirits (>=5L)')
    parser.add_argument('--file', required=True, help='JSON file to filter (in-place)')
    args = parser.parse_args()
    
    # Load data
    with open(args.file, 'r', encoding='utf-8') as f:
        spirits = json.load(f)
    
    original_count = len(spirits)
    
    # Filter out spirits with volume >= 5000ml
    filtered_spirits = [
        spirit for spirit in spirits
        if (spirit.get('volume') or 0) < 5000
    ]
    
    removed_count = original_count - len(filtered_spirits)
    
    # Save back
    with open(args.file, 'w', encoding='utf-8') as f:
        json.dump(filtered_spirits, f, ensure_ascii=False, indent=2)
    
    if removed_count > 0:
        print(f"✓ Filtered out {removed_count} large volume spirits (>=5L)")
    else:
        print(f"✓ No large volume spirits to filter")

if __name__ == '__main__':
    main()
