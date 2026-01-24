import requests
from bs4 import BeautifulSoup
import json
import random
import time
from pathlib import Path
from datetime import datetime
from urllib.parse import urlencode

# 설정
ENRICHED_DIR = Path('data/enriched')
FINAL_OUTPUT = Path('data/enriched/ready_for_confirm.json')
FAIL_LOG = Path('scripts/image_fail_log.txt')
CHECKPOINT_INTERVAL = 10

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
    # 1. 보완 데이터 로드
    all_enriched = []
    batch_files = list(ENRICHED_DIR.glob('whisky_enriched_batch_*.json'))
    
    if not batch_files:
        print("❌ 보완 데이터 배치 파일을 찾을 수 없습니다.")
        return

    for f_path in batch_files:
        with open(f_path, 'r', encoding='utf-8') as f_in:
            all_enriched.extend(json.load(f_in))
            
    print(f"🔍 총 {len(all_enriched)}건의 데이터를 로드했습니다. 고급 이미지 수집을 시작합니다.")

    processed_count = 0
    total_items = len(all_enriched)

    for i, item in enumerate(all_enriched):
        # 이미 유효한 이미지 URL이 있으면 스킵
        if item.get('imageUrl') and item['imageUrl'].startswith('http') and 'google' not in item['imageUrl']:
            continue
            
        name_en = item.get('metadata', {}).get('name_en', item['name'])
        distillery = item['distillery']
        
        print(f"📸 [{i+1}/{total_items}] 수집 시도 (Advanced): {name_en}...")
        
        img_url = fetch_image_url(name_en, distillery)
        
        if img_url:
            item['imageUrl'] = img_url
            item['thumbnailUrl'] = img_url
            item['status'] = 'PENDING_CONFIRM' # 상태 머신 반영
            item['updatedAt'] = datetime.now().isoformat()
            print(f"✅ 성공: {img_url[:60]}...")
        else:
            item['imageUrl'] = None
            item['status'] = 'IMAGE_FAILED'
            # 실패 기록
            with open(FAIL_LOG, 'a', encoding='utf-8') as f_fail:
                f_fail.write(f"{item['id']} | {name_en} | {datetime.now().isoformat()}\n")
            print(f"❌ 실패 (로그 기록됨): {name_en}")

        processed_count += 1
        
        # 지시사항: 넉넉한 랜덤 슬립 (7~12초)
        delay = random.uniform(7, 12)
        if i < total_items - 1:
            time.sleep(delay)
        
        # 10건마다 체크포인트 저장
        if processed_count % CHECKPOINT_INTERVAL == 0:
            with open(FINAL_OUTPUT, 'w', encoding='utf-8') as f_out:
                json.dump(all_enriched, f_out, indent=2, ensure_ascii=False)
            print(f"💾 중간 저장 완료: {FINAL_OUTPUT}")

    # 최종 저장
    with open(FINAL_OUTPUT, 'w', encoding='utf-8') as f_out:
        json.dump(all_enriched, f_out, indent=2, ensure_ascii=False)
        
    print(f"✨ 모든 작업 완료! 최종 결과 저장: {FINAL_OUTPUT}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 사용자에 의해 중단되었습니다.")
