"""
Normalize Spirit Names - Pipeline Step

Extracts volume, ABV, lot info from names and moves bracketed content to description.
Designed to work with batch JSON files in the pipeline.
"""

import json
import argparse
import re
from typing import Dict, Tuple, Optional

def extract_volume(name: str) -> Tuple[Optional[float], str]:
    """Extract volume from name"""
    patterns = [
        (r'(\d+\.\d+)\s*ml\b', 1),
        (r'(\d+\.\d+)\s*l\b', 1000),
        (r'(\d+)\s*ml\b', 1),
        (r'(\d+)\s*l\b', 1000),
        (r'(\d+)\s*리터', 1000),
        (r'(\d+)\s*밀리리터', 1),
    ]
    for pattern, mult in patterns:
        match = re.search(pattern, name, re.I)
        if match:
            volume = float(match.group(1)) * mult
            cleaned = re.sub(pattern, '', name, flags=re.I).strip()
            cleaned = re.sub(r'\s+', ' ', cleaned)
            return volume, cleaned
    return None, name

def extract_abv(name: str) -> Tuple[Optional[float], str]:
    """Extract ABV from name"""
    patterns = [
        (r'(\d+\.?\d*)\s*%', 1),
        (r'(\d+\.?\d*)\s*도', 1),
        (r'(\d+\.?\d*)\s*proof', 0.5),
    ]
    for pattern, mult in patterns:
        match = re.search(pattern, name, re.I)
        if match:
            abv = float(match.group(1)) * mult
            cleaned = re.sub(pattern, '', name, flags=re.I).strip()
            cleaned = re.sub(r'\s+', ' ', cleaned).strip()
            return abv, cleaned
    return None, name

def extract_lot_info(name: str) -> str:
    """Remove lot/batch information"""
    patterns = [
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
    cleaned = name
    for pattern in patterns:
        cleaned = re.sub(pattern, '', cleaned, flags=re.I)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def extract_description(name: str) -> Tuple[str, str]:
    """Extract remaining bracketed/parenthesized content to description"""
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
    
    # Extract /content at end
    slash_match = re.search(r'/\s*([^/]+)$', cleaned)
    if slash_match:
        content = slash_match.group(1).strip()
        if content:
            desc_parts.append(content)
        cleaned = re.sub(r'/\s*[^/]+$', '', cleaned)
    
    # Final cleanup
    cleaned = re.sub(r'^[\s/\-]+', '', cleaned)
    cleaned = re.sub(r'[\s/\-]+$', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    
    description = ' / '.join(desc_parts) if desc_parts else ''
    
    return cleaned, description

def normalize_spirit(spirit: Dict) -> Dict:
    """Normalize a single spirit"""
    if 'name' not in spirit:
        return spirit
    
    original_name = spirit['name']
    cleaned_name = original_name
    
    # Extract volume
    extracted_volume, cleaned_name = extract_volume(cleaned_name)
    if extracted_volume:
        spirit['volume'] = int(extracted_volume)
    
    # Extract ABV
    extracted_abv, cleaned_name = extract_abv(cleaned_name)
    if extracted_abv:
        spirit['abv'] = extracted_abv
    
    # Remove lot info
    cleaned_name = extract_lot_info(cleaned_name)
    
    # Extract description from remaining brackets
    cleaned_name, description = extract_description(cleaned_name)
    
    # Update name if changed
    if cleaned_name != original_name:
        spirit['name'] = cleaned_name
    
    # Add description if extracted
    if description:
        # Append to existing description if present
        existing_desc = spirit.get('description', '')
        if existing_desc:
            spirit['description'] = f"{existing_desc} / {description}"
        else:
            spirit['description'] = description
    
    return spirit

def main():
    parser = argparse.ArgumentParser(description='Normalize spirit names in batch file')
    parser.add_argument('--file', required=True, help='JSON file to normalize (in-place)')
    args = parser.parse_args()
    
    # Load data
    with open(args.file, 'r', encoding='utf-8') as f:
        spirits = json.load(f)
    
    # Normalize each spirit
    normalized_count = 0
    for spirit in spirits:
        original_name = spirit.get('name', '')
        normalize_spirit(spirit)
        if spirit.get('name') != original_name:
            normalized_count += 1
    
    # Save back
    with open(args.file, 'w', encoding='utf-8') as f:
        json.dump(spirits, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Normalized {normalized_count}/{len(spirits)} spirits")

if __name__ == '__main__':
    main()
