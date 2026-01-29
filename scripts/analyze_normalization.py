"""
Spirit Data Normalization Analyzer

This script analyzes spirits data from Firebase to identify names that contain:
- Volume information (e.g., 700ml, 750ml, 1L)
- Lot/batch information (e.g., Lot 2023, Batch 5)
- ABV information (e.g., 40%, 43도)

It generates a report without making any changes to the database.
"""

import re
import json
from collections import defaultdict
import sys
import os

# Add parent directory to path to import from lib
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Patterns to detect in spirit names
PATTERNS = {
    'volume': [
        r'\d+\s*ml\b',           # 700ml, 750 ml
        r'\d+\s*l\b',            # 1l, 1.5l
        r'\d+\s*리터',           # 1리터
        r'\d+\s*밀리리터',       # 700밀리리터
    ],
    'lot': [
        r'lot\s*[#:]?\s*\d+',    # Lot 2023, Lot#5
        r'batch\s*[#:]?\s*\d+',  # Batch 5
        r'로트\s*\d+',           # 로트 2023
    ],
    'abv': [
        r'\d+\.?\d*\s*%',        # 40%, 43.5%
        r'\d+\.?\d*\s*도',       # 40도, 43.5도
        r'\d+\.?\d*\s*proof',    # 80 proof
    ]
}

def analyze_name(name: str) -> dict:
    """Analyze a spirit name for patterns that should be extracted."""
    findings = defaultdict(list)
    
    name_lower = name.lower()
    
    for category, patterns in PATTERNS.items():
        for pattern in patterns:
            matches = re.finditer(pattern, name_lower, re.IGNORECASE)
            for match in matches:
                findings[category].append({
                    'text': match.group(),
                    'position': match.span()
                })
    
    return dict(findings)

def load_spirits_sample():
    """Load ALL spirits data from the API."""
    import requests
    
    print("Fetching ALL spirits data from local API...")
    
    # Fetch from local API (assuming dev server is running)
    # Use a very large pageSize to get all data in one request
    try:
        response = requests.get('http://localhost:3000/api/admin/spirits?pageSize=10000')
        data = response.json()
        spirits = data.get('data', [])
        total = data.get('total', len(spirits))
        
        print(f"✓ Loaded {len(spirits)} spirits from API")
        print(f"  Total in database: {total}")
        
        if len(spirits) < total:
            print(f"  ⚠️ Warning: Only loaded {len(spirits)}/{total} spirits")
            print(f"  Consider increasing pageSize or implementing pagination")
        
        return spirits
    except Exception as e:
        print(f"✗ Failed to fetch from API: {e}")
        print("Make sure the dev server is running (npm run dev)")
        return []

def generate_report(spirits):
    """Generate a detailed report of normalization needs."""
    
    issues_found = []
    stats = {
        'total': len(spirits),
        'with_volume_in_name': 0,
        'with_lot_in_name': 0,
        'with_abv_in_name': 0,
        'needs_normalization': 0
    }
    
    print("\n" + "="*80)
    print("ANALYZING SPIRIT NAMES FOR NORMALIZATION ISSUES")
    print("="*80 + "\n")
    
    for spirit in spirits:
        name = spirit.get('name', '')
        spirit_id = spirit.get('id', 'unknown')
        current_volume = spirit.get('volume')
        current_abv = spirit.get('abv')
        
        findings = analyze_name(name)
        
        if findings:
            has_issue = False
            issue_detail = {
                'id': spirit_id,
                'name': name,
                'current_volume': current_volume,
                'current_abv': current_abv,
                'findings': findings
            }
            
            if 'volume' in findings:
                stats['with_volume_in_name'] += 1
                has_issue = True
            
            if 'lot' in findings:
                stats['with_lot_in_name'] += 1
                has_issue = True
            
            if 'abv' in findings:
                stats['with_abv_in_name'] += 1
                has_issue = True
            
            if has_issue:
                stats['needs_normalization'] += 1
                issues_found.append(issue_detail)
    
    # Print summary statistics
    print("SUMMARY STATISTICS:")
    print("-" * 80)
    print(f"Total spirits analyzed: {stats['total']}")
    print(f"Spirits needing normalization: {stats['needs_normalization']} ({stats['needs_normalization']/stats['total']*100:.1f}%)")
    print(f"  - With volume in name: {stats['with_volume_in_name']}")
    print(f"  - With lot info in name: {stats['with_lot_in_name']}")
    print(f"  - With ABV in name: {stats['with_abv_in_name']}")
    print()
    
    # Print detailed examples (first 20)
    print("\nDETAILED EXAMPLES (First 20):")
    print("-" * 80)
    
    for i, issue in enumerate(issues_found[:20], 1):
        print(f"\n{i}. ID: {issue['id']}")
        print(f"   Name: {issue['name']}")
        print(f"   Current Volume: {issue['current_volume']}")
        print(f"   Current ABV: {issue['current_abv']}")
        print(f"   Found in name:")
        for category, matches in issue['findings'].items():
            for match in matches:
                print(f"     - {category.upper()}: '{match['text']}'")
    
    if len(issues_found) > 20:
        print(f"\n... and {len(issues_found) - 20} more spirits with issues")
    
    # Save full report to file
    report_file = 'scripts/normalization_report.json'
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump({
            'stats': stats,
            'issues': issues_found
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Full report saved to: {report_file}")
    print("\n" + "="*80)
    
    return stats, issues_found

if __name__ == '__main__':
    spirits = load_spirits_sample()
    
    if spirits:
        stats, issues = generate_report(spirits)
        
        print("\nNEXT STEPS:")
        print("-" * 80)
        print("1. Review the normalization_report.json file")
        print("2. Design normalization rules based on the patterns found")
        print("3. Create a normalization script with dry-run mode")
        print("4. Apply normalization to Firebase after review")
    else:
        print("\n✗ No data to analyze. Please ensure the dev server is running.")
