"""
Analyze ALL spirits for normalization needs

This script checks all 2308 spirits to see if any have:
- Empty brackets/parentheses
- Content in brackets/parentheses that should go to description
- Volume/ABV/Lot info in names
"""

import re
import json
import requests

def has_normalization_needs(name: str) -> dict:
    """Check if a spirit name needs normalization"""
    issues = []
    
    # Check for empty brackets
    if re.search(r'\(\s*\)', name):
        issues.append('empty_parentheses')
    if re.search(r'\[\s*\]', name):
        issues.append('empty_brackets')
    
    # Check for content in brackets (potential description)
    if re.search(r'\([^\)]+\)', name):
        issues.append('has_parentheses_content')
    if re.search(r'\[[^\]]+\]', name):
        issues.append('has_brackets_content')
    
    # Check for volume
    if re.search(r'\d+\.?\d*\s*(ml|l|리터|밀리리터)\b', name, re.I):
        issues.append('has_volume')
    
    # Check for ABV
    if re.search(r'\d+\.?\d*\s*(%|도|proof)\b', name, re.I):
        issues.append('has_abv')
    
    # Check for lot info
    if re.search(r'(lot|batch|로트)\s*[#:]?\s*[A-Z0-9]+', name, re.I):
        issues.append('has_lot')
    
    return {
        'needs_normalization': len(issues) > 0,
        'issues': issues,
        'name': name
    }

print("Fetching all spirits...")
response = requests.get('http://localhost:3000/api/admin/spirits?pageSize=10000')
data = response.json()
spirits = data.get('data', [])

print(f"Analyzing {len(spirits)} spirits...\n")

needs_norm = []
stats = {
    'total': len(spirits),
    'needs_normalization': 0,
    'empty_parentheses': 0,
    'empty_brackets': 0,
    'has_parentheses_content': 0,
    'has_brackets_content': 0,
    'has_volume': 0,
    'has_abv': 0,
    'has_lot': 0
}

for spirit in spirits:
    result = has_normalization_needs(spirit['name'])
    if result['needs_normalization']:
        stats['needs_normalization'] += 1
        needs_norm.append({
            'id': spirit['id'],
            'name': spirit['name'],
            'issues': result['issues']
        })
        for issue in result['issues']:
            stats[issue] += 1

print("="*80)
print("FULL DATABASE NORMALIZATION ANALYSIS")
print("="*80)
print(f"\nTotal spirits: {stats['total']}")
print(f"Need normalization: {stats['needs_normalization']} ({stats['needs_normalization']/stats['total']*100:.1f}%)")
print(f"\nBreakdown:")
print(f"  - Empty parentheses (): {stats['empty_parentheses']}")
print(f"  - Empty brackets []: {stats['empty_brackets']}")
print(f"  - Has parentheses content: {stats['has_parentheses_content']}")
print(f"  - Has brackets content: {stats['has_brackets_content']}")
print(f"  - Has volume info: {stats['has_volume']}")
print(f"  - Has ABV info: {stats['has_abv']}")
print(f"  - Has lot info: {stats['has_lot']}")

print(f"\n\nSample spirits needing normalization (first 20):")
print("-"*80)
for i, spirit in enumerate(needs_norm[:20], 1):
    print(f"{i}. {spirit['name']}")
    print(f"   Issues: {', '.join(spirit['issues'])}")

# Save full report
with open('scripts/full_normalization_analysis.json', 'w', encoding='utf-8') as f:
    json.dump({
        'stats': stats,
        'spirits_needing_normalization': needs_norm
    }, f, ensure_ascii=False, indent=2)

print(f"\n\nFull report saved to: scripts/full_normalization_analysis.json")
print("="*80)
