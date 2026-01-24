import json
import os
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime

def deep_merge(target: Dict[str, Any], source: Dict[str, Any]):
    """간단한 딕셔너리 딥 머지 (metadata 등 처리용)"""
    for key, value in source.items():
        if key == 'metadata' and isinstance(value, dict) and key in target and isinstance(target[key], dict):
            target[key].update(value)
        else:
            target[key] = value
    return target

def consolidate_data():
    """
    국내(data/), 수입(data/raw_imported/), 보완(data/enriched/) 데이터를 모두 병합합니다.
    우선순위: Enriched > Raw Imported > Raw Local
    """
    RAW_DIR = Path('data')
    IMPORTED_DIR = Path('data/raw_imported')
    ENRICHED_DIR = Path('data/enriched')
    OUTPUT_FILE = Path('lib/db/ingested-data.json')
    
    consolidated_map = {}

    print("🚀 다중 소스 데이터 통합 및 고도화 시작...")

    # 1. 국내 데이터 로드 (Base)
    for file_path in RAW_DIR.glob('spirits_*.json'):
        if 'enriched' in file_path.name: continue # enriched 폴더와 혼동 방지
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                items = json.load(f)
                for item in items:
                    ext_id = item.get('externalId')
                    if ext_id: consolidated_map[ext_id] = item
            print(f"  - [Raw Local] '{file_path.name}' 로드 완료")
        except Exception as e:
            print(f"  - [Raw Local] '{file_path.name}' 처리 중 오류: {e}")

    # 2. 수입 데이터 로드 (Merge)
    for file_path in IMPORTED_DIR.glob('imported_*.json'):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                items = json.load(f)
                for item in items:
                    ext_id = item.get('externalId')
                    if not ext_id: continue
                    
                    if ext_id in consolidated_map:
                        deep_merge(consolidated_map[ext_id], item)
                    else:
                        consolidated_map[ext_id] = item
            print(f"  - [Raw Imported] '{file_path.name}' 병합 완료")
        except Exception as e:
            print(f"  - [Raw Imported] '{file_path.name}' 처리 중 오류: {e}")

    # 3. 보완 데이터 로드 (High Priority Override)
    # whisky_enriched_batch_*.json 파일들을 로드
    for file_path in ENRICHED_DIR.glob('whisky_enriched_batch_*.json'):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                items = json.load(f)
                for item in items:
                    ext_id = item.get('externalId')
                    if not ext_id: continue
                    
                    if ext_id in consolidated_map:
                        # Enriched 데이터로 덮어쓰기 (메타데이터 포함)
                        deep_merge(consolidated_map[ext_id], item)
                    else:
                        consolidated_map[ext_id] = item
            print(f"  - [Enriched] '{file_path.name}' 최종 반영 완료")
        except Exception as e:
            print(f"  - [Enriched] '{file_path.name}' 처리 중 오류: {e}")

    # 결과 리스트 변환 및 통계
    final_list = list(consolidated_map.values())
    
    # lib/db 폴더 생성
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, indent=2, ensure_ascii=False)

    print(f"\n✨ 데이터 통합 서버(JSON) 구축 완료!")
    print(f"총 통합 데이터: {len(final_list):,}건")
    print(f"💾 최종 DB 위치: {OUTPUT_FILE}")

if __name__ == "__main__":
    consolidate_data()
