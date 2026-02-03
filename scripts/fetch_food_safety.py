import os
import requests
import json
from dotenv import load_dotenv
from typing import List, Dict, Any
from datetime import datetime

from pathlib import Path

# .env 및 .env.local 파일 로드
env_path = Path(__file__).parent.parent / '.env'
env_local_path = Path(__file__).parent.parent / '.env.local'

load_dotenv(dotenv_path=env_path)
load_dotenv(dotenv_path=env_local_path, override=True) # .env.local이 우선순위 높음

# API KEY 확인 (두 가지 명명 규칙 지원)
API_KEY = os.getenv('FOOD_SAFETY_KOREA_API_KEY') or os.getenv('FOOD_SAFETY_API_KEY')
BASE_URL = 'http://openapi.foodsafetykorea.go.kr/api'

# 서비스 ID 확인 (기본값 I1250)
SERVICE_ID = os.getenv('FOOD_SAFETY_SERVICE_ID', 'I1250')

# 디버그용: .env 파일 존재 여부 확인
if not env_path.exists():
    print(f"⚠️ 경고: .env 파일을 찾을 수 없습니다. (경로: {env_path.absolute()})")
else:
    if not API_KEY:
        print(f"⚠️ 경고: .env 파일은 있으나 'FOOD_SAFETY_KOREA_API_KEY' 항목을 읽을 수 없습니다.")
        # 디버그: 비슷한 이름의 키가 있는지 확인
        print("🔍 현재 로드된 관련 환경 변수 목록:")
        keys = [k for k in os.environ.keys() if any(word in k for word in ['FOOD', 'SAFETY', 'KOREA', 'API', 'KEY'])]
        if keys:
            for k in keys:
                print(f"  - {k}")
        else:
            print("  - 없음 (완전히 비어있거나 로드 실패)")

# 수집 대상 주종 및 검색어 맵핑 (정규화용)
# 키: 저장될 표준 카테고리명, 값: API 검색 시 사용할 명칭 리스트
SPIRIT_CATEGORY_MAP = {
    '소주': ['소주'],
    '맥주': ['맥주'],
    '위스키': ['위스키'],
    '기타주류': ['기타주류', '기타 주류'],
    '청주': ['청주'],
    '약주': ['약주'],
    '탁주': ['탁주'],
    '과실주': ['과실주'],
    '리큐르': ['리큐르'],
    '브랜디': ['브랜디'],
    '일반증류주': ['일반증류주', '일반 증류주']
}

def fetch_spirits_by_category(canonical_name: str, search_aliases: List[str]) -> List[Dict[str, Any]]:
    """
    하나의 표준 카테고리에 대해 여러 검색어 변형으로 데이터를 수집하고 합칩니다.
    """
    category_data = []
    seen_external_ids = set() # 중복 제거용 (품목보고번호 기준)
    seen_names = set() # 중복 제거용 (제품명 기준)

    print(f"\n📂 [{canonical_name}] 표준 카테고리 수집 시작 (검색어: {', '.join(search_aliases)})")

    for alias in search_aliases:
        alias_data = fetch_spirits_by_type(alias)
        for item in alias_data:
            # 카테고리명 정규화
            item['category'] = canonical_name
            item['metadata']['raw_category'] = canonical_name
            
            # 이름 중복 체크
            name_clean = item['name'].strip()
            if name_clean in seen_names:
                continue

            # 중복 체크 (여러 검색어에서 동일한 제품이 나올 수 있음)
            ext_id = item.get('externalId')
            if ext_id not in seen_external_ids:
                category_data.append(item)
                seen_external_ids.add(ext_id)
                seen_names.add(name_clean)
    
    return category_data
    
    return category_data

def fetch_spirits_by_type(spirit_type: str) -> List[Dict[str, Any]]:
    """
    특정 주종에 대한 데이터를 식품안전나라 API에서 가져옵니다.
    """
    if not API_KEY:
        print("❌ 에러: FOOD_SAFETY_KOREA_API_KEY가 .env 파일에 설정되어 있지 않습니다.")
        return []

    all_data = []
    start_idx = 1
    end_idx = 1000
    has_more = True

    print(f"\n🔍 [{spirit_type}] 데이터 수집 시작...")

    while has_more:
        try:
            # API URL 구성 (SERVICE_ID 지원)
            url = f"{BASE_URL}/{API_KEY}/{SERVICE_ID}/json/{start_idx}/{end_idx}/PRDLST_DCNM={spirit_type}"
            response = requests.get(url)
            
            if response.status_code != 200:
                print(f"❌ HTTP 에러 ({response.status_code}): {spirit_type}")
                break

            data = response.json()
            service_result = data.get(SERVICE_ID)

            if not service_result or service_result.get('RESULT', {}).get('CODE') != 'INFO-000':
                code = service_result.get('RESULT', {}).get('CODE') if service_result else "Unknown"
                if code == 'INFO-200': # 해당 데이터 없음 (마지막 페이지 초과)
                    has_more = False
                else:
                    print(f"❌ API 에러 ({code}): {service_result.get('RESULT', {}).get('MSG')}")
                break

            rows = service_result.get('row', [])
            if not rows:
                has_more = False
                break

            # Spirit 인터페이스 구조에 맞게 매핑
            for row in rows:
                name_raw = row.get('PRDLST_NM', '')
                if not name_raw:
                    continue

                # 제외 키워드 필터링 (강화됨)
                exclusion_keywords = ["수출", "원액", "주정"]
                if any(keyword in name_raw for keyword in exclusion_keywords):
                    print(f"  🚫 제외됨 (키워드 감지): {name_raw}")
                    continue

                mapped_item = {
                    "id": f"fsk-{row.get('PRDLST_REPORT_NO', 'unknown')}", # 품목보고번호를 ID로 활용
                    "name": name_raw,
                    "name_en": None,
                    "distillery": row.get('BSSH_NM'),
                    "bottler": None,
                    "abv": 0, # API에서 도수 정보가 불확실하므로 기본값 0 (추후 파싱 필요)
                    "volume": None,
                    "category": row.get('PRDLST_DCNM'),
                    "subcategory": None,
                    "country": "대한민국",
                    "region": None,
                    "imageUrl": None,
                    "thumbnailUrl": None,
                    "source": "food_safety_korea",
                    "externalId": row.get('PRDLST_REPORT_NO'),
                    "isPublished": False,
                    "isReviewed": False,
                    "reviewedBy": None,
                    "reviewedAt": None,
                    "createdAt": datetime.now().isoformat(),
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
                        "expiry": row.get('POG_DAYCNT'),
                        "raw_category": row.get('PRDLST_DCNM')
                    }
                }
                all_data.append(mapped_item)

            print(f"  - {start_idx} ~ {end_idx} 구간 수집 완료 ({len(rows)}건)")

            if len(rows) < 1000:
                has_more = False
            else:
                start_idx += 1000
                end_idx += 1000

        except Exception as e:
            print(f"❌ [{spirit_type}] 처리 중 예외 발생: {str(e)}")
            break

    print(f"✅ [{spirit_type}] 총 {len(all_data):,}건 수집 완료")
    return all_data

def main():
    total_count = 0
    start_time = datetime.now()
    
    # 데이터 저장 폴더 생성
    data_dir = 'data'
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        print(f"📂 '{data_dir}' 폴더가 생성되었습니다.")

    print("🚀 식품안전나라 주류 데이터 수집 스크립트 가동 (정규화 모드)")
    print(f"시작 시간: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")

    for canonical_name, aliases in SPIRIT_CATEGORY_MAP.items():
        file_path = os.path.join(data_dir, f"spirits_{canonical_name}.json")
        
        # 1. 기존 데이터 로드
        existing_data = []
        existing_ids = set()
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
                    # 기존 아이템들의 externalId 수집
                    existing_ids = {item.get('externalId') for item in existing_data if item.get('externalId')}
                print(f"📖 기존 데이터 로드 완료: '{file_path}' ({len(existing_data)}건)")
            except Exception as e:
                print(f"⚠️ 기존 파일 로드 중 오류 발생 (새 파일로 취급): {e}")

        # 2. API에서 최신 데이터 수집
        fetched_data = fetch_spirits_by_category(canonical_name, aliases)
        
        # 3. 중복 제외 및 신규 아이템 추출
        new_items = []
        for item in fetched_data:
            if item.get('externalId') not in existing_ids:
                new_items.append(item)
                # 동일 배치 내 중복 방지
                if item.get('externalId'):
                    existing_ids.add(item.get('externalId'))

        total_count += len(fetched_data)
        
        # 4. 결과 저장 (기존 데이터 + 신규 데이터)
        if new_items:
            combined_data = existing_data + new_items
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(combined_data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ '{file_path}' 업데이트 완료: +{len(new_items)}건 신규 추가 (총 {len(combined_data)}건)")
            if not existing_data: # 완전 새 파일인 경우 샘플 출력
                print(f"📝 데이터 샘플:")
                print(json.dumps(combined_data[0], indent=2, ensure_ascii=False))
        else:
            print(f"ℹ️ '{file_path}': 새로 추가할 데이터가 없습니다. (기존 {len(existing_data)}건 유지)")

    end_time = datetime.now()
    duration = end_time - start_time
    print(f"\n✨ 모든 작업 완료!")
    print(f"총 수집 건수 (중복 제거): {total_count:,}건")
    print(f"총 저장된 카테고리 파일 수: {len(SPIRIT_CATEGORY_MAP)}개")
    print(f"소요 시간: {duration}")

if __name__ == "__main__":
    main()
