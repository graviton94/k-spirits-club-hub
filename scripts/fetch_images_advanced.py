import requests
from bs4 import BeautifulSoup
import sys
import os
import json
import random
import time
import argparse
from pathlib import Path
from datetime import datetime
from urllib.parse import urlencode

# Force UTF-8 for Windows
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# 설정
FAIL_LOG = Path('scripts/image_fail_log.txt')
# Defaults (Backward Compatibility)
DEFAULT_INPUT_DIR = Path('data/enriched')
DEFAULT_OUTPUT_FILE = Path('data/enriched/ready_for_confirm.json')

# User-Agent 리스트 (차단 방지용)
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1"
]

def build_advanced_search_url(name_en, distillery):
    """구글 고급 검색 파라미터를 조합하여 타겟팅된 URL 생성"""
    query = f"{name_en} {distillery}"
    base_url = "https://www.google.com/search"
    
    params = {
        "as_st": "y",
        "as_q": query,               # 필수 키워드
        "as_oq": "bottle OR packaging", # 또는 포함
        "as_eq": "glass interior",      # 제외 키워드
        "udm": "2",                     # 이미지 검색 모드
        "tbs": "isz:m",                 # 중간 크기 이상
        "hl": "ko"                      # 한국어 결과 우선 (필요시 en으로 변경 가능)
    }
    
    return f"{base_url}?{urlencode(params)}"

import re

def fetch_image_url(name_en, distillery):
    """HTML 내의 JSON 블록 및 URL 패턴을 분석하여 실제 이미지 URL 추출"""
    url = build_advanced_search_url(name_en, distillery)
    headers = {"User-Agent": random.choice(USER_AGENTS)}
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        html = response.text
        
        # 1. 원본 소스 및 상세 정보 추출 시도
        # Google JSON 구조: ["URL", height, width] 패턴 탐색
        patterns = re.findall(r'\[\"(https?://[^\"\s]+\.(?:jpg|jpeg|png|webp))\",(\d+),(\d+)\]', html)
        
        found_url = None
        for img_url, h, w in patterns:
            h, w = int(h), int(w)
            
            # 필터 1: 가로가 세로보다 긴(Landscape) 이미지는 술병 사진으로 부적합하므로 제외
            if w > h:
                continue
                
            # 필터 2: 특정 도메인 제외 및 길이 검사
            if 'gstatic.com' not in img_url and 'google' not in img_url:
                if len(img_url) > 20: 
                    found_url = img_url
                    break
                    
        # 2. 정적 img 태그 파싱 (Fallback 1) - 비율을 알 수 없으므로 최소한의 필터링만 수행
        if not found_url:
            soup = BeautifulSoup(html, 'html.parser')
            images = soup.find_all('img')
            for img in images:
                src = img.get('src') or img.get('data-src') or img.get('data-deferred-src')
                # 여기서는 비율 획득이 어려우므로 기존 로직 유지
                if src and src.startswith('http') and 'gstatic.com' not in src and 'google' not in src:
                    found_url = src
                    break
                    
        # 3. gstatic 썸네일이라도 매칭 (Fallback 2)
        if not found_url:
            # 썸네일 중에서도 비율 정보를 찾을 수 있는 경우 필터링 시도
            for img_url, h, w in patterns:
                if 'encrypted-tbn' in img_url and int(w) <= int(h):
                    found_url = img_url
                    break
            
        return found_url
        
    except Exception as e:
        print(f"⚠️ 검색 중 오류 ({name_en}): {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description='Fetch images for enriched spirits data')
    parser.add_argument('--input', help='Input JSON file path')
    parser.add_argument('--output', help='Output JSON file path')
    args = parser.parse_args()

    # Load Data
    all_enriched = []
    
    if args.input:
        input_path = Path(args.input)
        if not input_path.exists():
            print(f"❌ Input file not found: {input_path}")
            return
        with open(input_path, 'r', encoding='utf-8') as f_in:
            data = json.load(f_in)
            if isinstance(data, list):
                all_enriched.extend(data)
            else:
                print("❌ Input JSON must be a list of objects")
                return
        output_path = Path(args.output) if args.output else DEFAULT_OUTPUT_FILE
    else:
        # Backward Compatibility: Scan directory
        print(f"📂 Scanning default directory: {DEFAULT_INPUT_DIR}")
        batch_files = list(DEFAULT_INPUT_DIR.glob('whisky_enriched_batch_*.json'))
        if not batch_files:
            print("❌ No batch files found.")
            return
        for f_path in batch_files:
            with open(f_path, 'r', encoding='utf-8') as f_in:
                all_enriched.extend(json.load(f_in))
        output_path = DEFAULT_OUTPUT_FILE

    print(f"🔍 Loaded {len(all_enriched)} items. Starting Image Search...")

    processed_count = 0
    total_items = len(all_enriched)

    for i, item in enumerate(all_enriched):
        # Already has valid image?
        if item.get('imageUrl') and item['imageUrl'].startswith('http') and 'google' not in item['imageUrl']:
            continue
            
        name_en = item.get('metadata', {}).get('name_en', item['name'])
        distillery = item.get('distillery', '')
        
        print(f"📸 [{i+1}/{total_items}] Fetching: {name_en}...")
        
        img_url = fetch_image_url(name_en, distillery)
        
        if img_url:
            item['imageUrl'] = img_url
            item['thumbnailUrl'] = img_url
            item['status'] = 'READY_FOR_CONFIRM'
            item['updatedAt'] = datetime.now().isoformat()
            print(f"✅ Success: {img_url[:60]}...")
        else:
            item['imageUrl'] = None
            item['status'] = 'IMAGE_FAILED'
            # Log failure
            with open(FAIL_LOG, 'a', encoding='utf-8') as f_fail:
                f_fail.write(f"{item['id']} | {name_en} | {datetime.now().isoformat()}\n")
            print(f"❌ Failed (Logged): {name_en}")

        processed_count += 1
        
        # Delay
        delay = random.uniform(3, 6) # Slightly faster for batch processing as batches are small
        if i < total_items - 1:
            time.sleep(delay)
            
        # Intermediate Save (only if not single batch file, or just save always)
        # For batch mode, we just save at the end usually, but safe to save here.

    # Save Result
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f_out:
        json.dump(all_enriched, f_out, indent=2, ensure_ascii=False)
        
    print(f"✨ Validation Ready: {output_path}")

    # Final Summary
    print("\n" + "="*50)
    print(" 📊 [SUMMARY] Image Search (Advanced)")
    print("-" * 50)
    print(f"  • Total Processed    : {total_items:,}")
    print(f"  • Images Found       : {sum(1 for i in all_enriched if i.get('imageUrl')):,}")
    print(f"  • Failed/No Image    : {sum(1 for i in all_enriched if not i.get('imageUrl')):,}")
    print(f"  • Output File        : {output_path}")
    print("=" * 50 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Aborted by user.")
