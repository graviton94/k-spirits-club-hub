import os
import requests
import json
import time
import random
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any

# 수입식품정보마루 (MFDS) API 설정
API_URL = "https://impfood.mfds.go.kr/CFCCC01F01/getList"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest"
}

# 카테고리 코드 (lib/constants/api-codes.ts 참고)
IMPORTED_FOOD_CATEGORY_CODES = {
    '기타 주류': 'C0314110000000000000',
    '탁주': 'C0314140000000000000',
    '약주': 'C0314150000000000000',
    '청주': 'C0314160000000000000',
    '맥주': 'C0314170000000000000',
    '과실주': 'C0314180000000000000',
    '소주': 'C0314200000000000000',
    '위스키': 'C0314210000000000000',
    '브랜디': 'C0314220000000000000',
    '일반증류주': 'C0314230000000000000',
    '리큐르': 'C0314240000000000000',
}

def fetch_category_data(category_name: str, category_code: str):
    """
    특정 주종 코드에 대해 MFDS 데이터를 수집합니다.
    """
    print(f"\n🚢 [{category_name}] 데이터 수집 시작 (코드: {category_code})")
    
    results = []
    seen_names = set()
    skipped_count = 0
    
    page = 1
    limit = 100
    has_more = True
    total_count = -1 # 초기값
    
    # 최근 1개월 데이터 수집 (신규 출시 제품만 대상)
    today_dt = datetime.now()
    start_date = (today_dt - timedelta(days=30)).strftime("%Y-%m-%d")
    today = today_dt.strftime("%Y-%m-%d")
    
    print(f"📅 수집 범위: {start_date} ~ {today}")
    
    while has_more:
        try:
            # 페이징 파라미터 구성 (URL에 totalCnt 포함)
            payload = {
                "page": page,
                "limit": limit,
                "dclPrductSeCd": "4",
                "rpsntItmCd": category_code,
                "srchStrtDt": start_date,
                "srchEndDt": today,
                "sortColumn": "",
                "sortOrder": ""
            }
            
            # 2페이지부터는 API 스펙에 따라 totalCnt를 명시적으로 요청에 포함할 수 있음
            if total_count > 0:
                payload["totalCnt"] = total_count

            response = requests.post(API_URL, data=payload, headers=HEADERS)
            
            if response.status_code != 200:
                print(f"❌ HTTP 에러 ({response.status_code}): {category_name}")
                break

            data = response.json()
            rows = data.get('list', [])
            
            # 첫 페이지 응답에서 totalCnt 확정
            if total_count == -1:
                total_count = int(data.get('totalCnt') or 0)
                if total_count == 0:
                    print("⚠️ 데이터가 없습니다.")
                    break

            # 데이터 매핑
            for row in rows:
                name_ko = row.get('prductNmko') or row.get('prductKoreanNm') or row.get('prductNm')
                name_en = row.get('prductNmEn') or row.get('prductNm') or ''
                
                # 중복 및 유효성 검사
                if not name_en or name_en.strip() == '':
                    continue

                clean_name_en = name_en.strip().lower()
                if clean_name_en in seen_names:
                    skipped_count += 1
                    continue
                
                seen_names.add(clean_name_en)

                distillery = row.get('makerNm') or row.get('ovsmnfstNm')
                report_no = row.get('dclNo') or row.get('rcno') or 'unknown'
                country = row.get('mnfNtnnm') or row.get('makerNationNm') or row.get('xportNtnnm')
                date_created = row.get('procsDtm') or row.get('pcsDt')
                importer = row.get('bsnOfcName') or row.get('bsshNm')
                
                results.append({
                    "id": f"mfds-{report_no}",
                    "name": name_ko,
                    "name_en": name_en,
                    "distillery": distillery,
                    "bottler": None,
                    "abv": 0,
                    "volume": None,
                    "category": category_name,
                    "country": country,
                    "source": "imported_food_maru",
                    "externalId": report_no,
                    "isPublished": False,
                    "isReviewed": False,
                    "reviewedBy": None,
                    "reviewedAt": None,
                    "createdAt": date_created,
                    "updatedAt": datetime.now().isoformat(),

                    # New Schema: Tags at root
                    "nose_tags": [],
                    "palate_tags": [],
                    "finish_tags": [],
                    "tasting_note": "",

                    "metadata": {
                        "description_ko": None,
                        "description_en": None,
                        "pairing_guide_ko": None,
                        "pairing_guide_en": None,
                        "raw_category": row.get('itmNm') or row.get('rpsntItmNm'),
                        "importer": importer
                    }
                })
            
            print(f"  - {page} 페이지 완료 ({len(results)}/{total_count} 수집됨 | 중복 제외: {skipped_count})")

            # 종료 조건: 모든 데이터를 가져왔거나 더 이상 데이터가 없는 경우
            if len(results) >= total_count or not rows or len(rows) < limit:
                has_more = False
            else:
                page += 1
                time.sleep(random.uniform(2, 4))

        except Exception as e:
            print(f"❌ [{category_name}] 처리 중 예외 발생: {str(e)}")
            break

    return results

def main():
    start_time = datetime.now()
    data_dir = Path('data/raw_imported')
    data_dir.mkdir(parents=True, exist_ok=True)
    
    total_total_count = 0
    print("🚀 수입식품정보마루 데이터 수집 (안정화된 페이지네이션 버전)")

    for category_name, category_code in IMPORTED_FOOD_CATEGORY_CODES.items():
        category_data = fetch_category_data(category_name, category_code)
        
        if category_data:
            safe_name = category_name.replace(" ", "_")
            file_path = data_dir / f"imported_{safe_name}.json"
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(category_data, f, indent=2, ensure_ascii=False)
            
            total_total_count += len(category_data)
            print(f"💾 '{file_path}' 저장 완료 ({len(category_data):,}건)")

    duration = datetime.now() - start_time
    print("\n" + "="*50)
    print(" 📊 [SUMMARY] Import Food Data Fetch")
    print("-" * 50)
    print(f"  • Total Items Fetched : {total_total_count:,}")
    print(f"  • Categories Saved    : {len(IMPORTED_FOOD_CATEGORY_CODES)}")
    print(f"  • Time Elapsed        : {duration}")
    print(f"  • Output Directory    : {data_dir}")
    print("=" * 50 + "\n")

if __name__ == "__main__":
    main()
