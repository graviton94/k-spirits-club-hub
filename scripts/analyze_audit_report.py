#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Audit Report Analyzer
Phase 1-3 audit report를 분석하여 패턴과 문제점 파악
"""

import json
from collections import Counter
from pathlib import Path

# Load audit report
report_path = Path("data/audit_report_20260201_230844.json")
with open(report_path, 'r', encoding='utf-8') as f:
    report = json.load(f)

print("=" * 80)
print("📊 Audit Report Deep Analysis")
print("=" * 80)

# Basic stats
print(f"\n### Summary Statistics")
print(f"Total: {report['total']}")
print(f"Processed: {report['processed']}")
print(f"Corrected: {report['corrected']}")
print(f"Unchanged: {report['unchanged']}")
print(f"Errors: {report['errors']}")
print(f"Success Rate: {report['processed']/report['total']*100:.1f}%")
print(f"Correction Rate: {report['corrected']/report['processed']*100:.1f}%")

# Correction breakdown
print(f"\n### Correction Breakdown")
for field, count in report['corrections'].items():
    print(f"  {field}: {count}")

# Analyze correction messages
print(f"\n### Top 20 Correction Patterns")
all_corrections = []
for detail in report['details']:
    all_corrections.extend(detail.get('corrections', []))

correction_counter = Counter(all_corrections)
for correction, count in correction_counter.most_common(20):
    print(f"  [{count:3d}x] {correction}")

# Analyze specific issues
print(f"\n### Specific Issues Analysis")

# 1. Region issues
region_corrections = [c for c in all_corrections if 'region' in c.lower() or 'region' in c.lower()]
print(f"\n1. Region-related corrections: {len(region_corrections)}")
region_patterns = Counter(region_corrections)
for pattern, count in region_patterns.most_common(10):
    print(f"   [{count:3d}x] {pattern}")

# 2. Distillery issues
distillery_corrections = [c for c in all_corrections if 'distillery' in c.lower() or '법인' in c or 'corporate' in c.lower()]
print(f"\n2. Distillery-related corrections: {len(distillery_corrections)}")
dist_patterns = Counter(distillery_corrections)
for pattern, count in dist_patterns.most_common(10):
    print(f"   [{count:3d}x] {pattern}")

# 3. Country issues
country_corrections = [c for c in all_corrections if 'country' in c.lower() or '대한민국' in c]
print(f"\n3. Country-related corrections: {len(country_corrections)}")
country_patterns = Counter(country_corrections)
for pattern, count in country_patterns.most_common(10):
    print(f"   [{count:3d}x] {pattern}")

# 4. ABV issues
abv_corrections = [c for c in all_corrections if 'abv' in c.lower() or '도수' in c]
print(f"\n4. ABV-related corrections: {len(abv_corrections)}")
abv_patterns = Counter(abv_corrections)
for pattern, count in abv_patterns.most_common(10):
    print(f"   [{count:3d}x] {pattern}")

# Sample analysis
print(f"\n### Sample Spirits with Most Corrections")
spirits_by_corrections = sorted(report['details'], key=lambda x: len(x.get('corrections', [])), reverse=True)
for i, spirit in enumerate(spirits_by_corrections[:10], 1):
    corrections_count = len(spirit.get('corrections', []))
    print(f"\n{i}. {spirit['name']} ({spirit['id']})")
    print(f"   Corrections: {corrections_count}")
    for c in spirit.get('corrections', []):
        print(f"    - {c}")

# Identify weaknesses
print(f"\n" + "=" * 80)
print("📝 IDENTIFIED WEAKNESSES & RECOMMENDATIONS")
print("=" * 80)

print(f"\n### 1. Region Handling Issues")
print("Problem: AI often sets region to null or uses inconsistent formats")
print("Examples:")
print("  - '가평' → Should be '경기도 가평군' or just '경기도'")
print("  - Region=null when it should be specific province")
print("Recommendation: Strengthen region rules with specific examples")

print(f"\n### 2. Distillery Corporate Form Removal")
print("Problem: Inconsistent removal of legal forms")
print("Examples:")
print("  - '고양탁주합동제조장' → '합동제조장' not always removed")
print("  - Some say '(if any)' suggesting uncertainty")
print("Recommendation: Add exhaustive list of Korean corporate forms")

print(f"\n### 3. Region Standardization")
print("Problem: City names converted to provinces inconsistently")
print("Examples:")
print("  - '고양' → '경기도' (Good)")
print("  - '가평' → Sometimes null, sometimes '경기도'")
print("Recommendation: Add explicit city-to-province mapping rules")

print(f"\n### 4. Validation Type Hints")
print("Problem: Some corrections are just 'validated' without specific action")
print("Examples:")
print("  - 'ABV validated as within 0-100 range' - but no actual change")
print("Recommendation: Reduce verbose unnecessary corrections")

print(f"\n### 5. Region Duplication Check")
print("Problem: Multiple variations of the same correction message")
print("Examples:")
print("  - 'Region was nullified...'")
print("  - 'Region was the same as country...'")
print("  - 'Set region to null...'")
print("Recommendation: Standardize correction message format")

print(f"\n" + "=" * 80)
print("✅ Analysis Complete - Ready for Prompt Enhancement")
print("=" * 80)
