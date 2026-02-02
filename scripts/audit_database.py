#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Database Audit AI
=================
Published 데이터의 제조국, 지역, 증류소, 병입자, ABV 필드를 정규화합니다.

Usage:
    python scripts/audit_database.py [--dry-run] [--limit N] [--skip-upload]
"""

import os
import sys
import json
import time
from datetime import datetime
from typing import Dict, List, Optional
import argparse

# Firebase Admin SDK (Lazy Loader)
# from google.cloud import firestore
# from google.oauth2 import service_account

# Google Gemini AI (새 SDK)
from google import genai
from google.genai import types

# 환경 변수 로드
from dotenv import load_dotenv
load_dotenv('.env.local')
load_dotenv()

def get_db_client():
    """Firestore 클라이언트를 지연 초기화합니다."""
    global _db
    if '_db' in globals():
        return _db
        
    from google.cloud import firestore
    from google.oauth2 import service_account
    
    # 환경 변수 로드
    FIREBASE_PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID')
    FIREBASE_PRIVATE_KEY = os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n')
    FIREBASE_CLIENT_EMAIL = os.getenv('FIREBASE_CLIENT_EMAIL')
    
    # Credentials 생성
    credentials = service_account.Credentials.from_service_account_info({
        'type': 'service_account',
        'project_id': FIREBASE_PROJECT_ID,
        'private_key': FIREBASE_PRIVATE_KEY,
        'client_email': FIREBASE_CLIENT_EMAIL,
        'token_uri': 'https://oauth2.googleapis.com/token',
    })
    
    _db = firestore.Client(credentials=credentials, project=FIREBASE_PROJECT_ID)
    return _db

# Gemini AI 클라이언트 초기화
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
client = genai.Client(api_key=GEMINI_API_KEY)

# ==================== AI Configuration ====================
SYSTEM_INSTRUCTION = """You are a database normalization expert specializing in spirits (alcohol) data.
Your role is to standardize country, region, distillery, bottler, and ABV fields with ABSOLUTE CONSISTENCY.

=== CRITICAL NORMALIZATION RULES (MUST FOLLOW) ===

1. COUNTRY NORMALIZATION:
   - ALWAYS use official Korean name
   - Examples:
     * "한국", "Korea", "South Korea" → "대한민국"
     * "UK", "Scotland", "England" → "영국"
     * "USA", "US", "United States" → "미국"
     * "France" → "프랑스"
     * "Japan" → "일본"
     * "Belgium" → "벨기에"

2. REGION NORMALIZATION:
   ⚠️ CRITICAL: Region MUST NEVER duplicate country!
   
   For KOREAN products (country="대한민국"):
   - Use province-level: "경기도", "제주특별자치도", "강원특별자치도", "충청남도", "전라북도", "경상남도"
   - Include city/county if specific: "경기도 가평군", "전라남도 나주시", "강원도 원주시"
   - City-to-Province mapping (MEMORIZE):
     * 가평, 고양, 안동 → "경기도"
     * 나주, 여수, 순천, 고흥 → "전라남도" 
     * 부안 → "전라북도"
     * 김해, 산청 → "경상남도"
     * 원주, 홍천 → "강원특별자치도"
     * 서울 → "서울특별시"
   - If region is "대한민국", "한국", "Korea", or any variation of country → SET TO NULL
   - If region is "미상" (unknown) → SET TO NULL
   
   For SCOTTISH whisky (country="영국"):
   - Use whisky regions: "스페이사이드", "아일라", "하이랜드", "로우랜드", "캠벨타운", "아일랜드"
   - NEVER use "영국", "스코틀랜드", "Scotland"
   
   For US spirits (country="미국"):
   - Use state names: "켄터키", "테네시", "캘리포니아", "뉴욕", "알래스카"
   - NEVER use "미국", "USA", "American"

3. DISTILLERY NORMALIZATION:
   REMOVE ALL corporate legal forms. Exhaustive list:
   
   Korean forms (MUST REMOVE):
   - "주식회사", "㈜", "(주)", "유한회사", "농업회사법인", "합동", "법인"
   
   English forms (MUST REMOVE):
   - "CO., LTD.", "CO LTD", "LIMITED", "LTD", "INC.", "INC", "LLC", "CORPORATION"
   - "COMPANY", "BREWING COMPANY", "DISTILLERY COMPANY"
   - "NV", "SA", "SL", "OY"
   
   Examples:
   - "㈜한라산" → "한라산"
   - "주식회사 우리술" → "우리술"
   - "농업회사법인 ㈜낙천" → "낙천"
   - "고양탁주합동제조장" → "고양탁주"
   - "ANCHORAGE BREWING COMPANY" → "ANCHORAGE BREWING"
   - "GREEN LAKE BREWING COMPANY" → "GREEN LAKE BREWING"
   
   CRITICAL: "합동제조장" IS a corporate form - REMOVE IT!

4. IMPORTER DETECTION:
   If distillery name contains these keywords, it's likely an IMPORTER:
   - Korean: "무역", "인터내셔널", "수입"
   - English: "Trading", "Import", "Distribution", "International", "Global"
   
   Action: Move to metadata.importer, do NOT keep as distillery

5. BOTTLER:
   - Only for Independent Bottlers (e.g., "Gordon & MacPhail", "Signatory")
   - Otherwise → NULL
   - Do NOT confuse with distillery

6. ABV VALIDATION:
   - MUST be 0-100 range
   - If outside range or invalid → NULL
   - Convert to float type

=== CORRECTION MESSAGES (STANDARDIZED) ===
Use EXACTLY these formats to avoid duplication:

- Country:
  * "Standardized country to [country name]"
  
- Region (duplication):
  * "Region duplicated country - set to null"
  
- Region (standardization):
  * "Standardized region to [province/region name]"
  
- Distillery:
  * "Removed corporate forms: [list of forms removed]"
  
- ABV:
  * Only if changed: "ABV adjusted to [value]"
  * Do NOT add verbose messages like "validated as within range" if unchanged

- Importer:
  * "Separated importer: [name]"

DO NOT use variations like:
❌ "Region was nullified..."
❌ "Set region to null as it was..."
❌ "Removed corporate legal form from distillery (if any)..."
✅ Use the standardized formats above

=== RESPONSE FORMAT ===
Always respond in JSON format ONLY. No additional text or explanation.
If no corrections needed, return empty corrections array.
"""

USER_PROMPT_TEMPLATE = """Please normalize the following spirit data:

Name: {name}
Category: {category}
Subcategory: {subcategory}
Current Country: {country}
Current Region: {region}
Current Distillery: {distillery}
Current Bottler: {bottler}
Current ABV: {abv}

Respond in JSON format:
{{
  "country": "...",
  "region": "..." or null,
  "distillery": "...",
  "bottler": "..." or null,
  "abv": 43.0 or null,
  "metadata": {{ "importer": "..." or null }},
  "corrections": ["description of each correction made"]
}}

JSON only, no extra text:"""

# ==================== Helper Functions ====================

def fetch_all_spirits(limit: Optional[int] = None) -> List[Dict]:
    """Firestore에서 모든 데이터 가져오기 (published + unpublished)"""
    print("🔍 Fetching ALL spirits from Firestore (published + unpublished)...")
    db = get_db_client()
    
    try:
        # 모든 spirits 조회 (isPublished 필터 없음)
        query = db.collection('spirits')
        
        if limit:
            query = query.limit(limit)
        
        docs = list(query.stream())
        
        spirits = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            spirits.append(data)
        
        # 통계 출력
        published_count = sum(1 for s in spirits if s.get('isPublished') == True or s.get('status') == 'PUBLISHED')
        unpublished_count = len(spirits) - published_count
        
        print(f"📊 Loaded {len(spirits)} total spirits:")
        print(f"   - Published: {published_count}")
        print(f"   - Unpublished: {unpublished_count}")
        
        return spirits
    
    except Exception as e:
        print(f"❌ Error fetching spirits: {e}")
        import traceback
        traceback.print_exc()
        return []


def fetch_published_spirits(limit: Optional[int] = None) -> List[Dict]:
    """Firestore에서 published 데이터 가져오기"""
    print("🔍 Fetching published spirits from Firestore...")
    db = get_db_client()
    
    try:
        # isPublished=True 또는 status=PUBLISHED 조건으로 쿼리
        query1 = db.collection('spirits').where('isPublished', '==', True)
        
        if limit:
            query1 = query1.limit(limit)
        
        docs1 = list(query1.stream())
        
        # isPublished로 찾지 못한 경우 status로 시도
        if len(docs1) == 0:
            print("  ⚠️  No spirits with isPublished=True, trying status=PUBLISHED...")
            query2 = db.collection('spirits').where('status', '==', 'PUBLISHED')
            
            if limit:
                query2 = query2.limit(limit)
            
            docs1 = list(query2.stream())
        
        spirits = []
        for doc in docs1:
            data = doc.to_dict()
            data['id'] = doc.id
            spirits.append(data)
        
        print(f"📊 Loaded {len(spirits)} published spirits")
        return spirits
    
    except Exception as e:
        print(f"❌ Error fetching spirits: {e}")
        import traceback
        traceback.print_exc()
        return []


def call_audit_ai(spirit: Dict) -> Optional[Dict]:
    """Gemini AI 호출하여 정규화"""
    try:
        # 프롬프트 생성
        user_prompt = USER_PROMPT_TEMPLATE.format(
            name=spirit.get('name', 'Unknown'),
            category=spirit.get('category', 'Unknown'),
            subcategory=spirit.get('subcategory', 'N/A'),
            country=spirit.get('country', 'N/A'),
            region=spirit.get('region', 'N/A'),
            distillery=spirit.get('distillery', 'N/A'),
            bottler=spirit.get('bottler', 'N/A'),
            abv=spirit.get('abv', 'N/A')
        )
        
        # Gemini 호출 (새 SDK)
        response = client.models.generate_content(
            model='gemini-2.0-flash',  # 안정 버전
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.1,
                response_mime_type='application/json'
            )
        )
        
        # JSON 파싱
        normalized = json.loads(response.text)
        
        return normalized
    
    except json.JSONDecodeError as e:
        print(f"  ❌ JSON Parse Error for {spirit.get('name')}: {e}")
        if 'response' in locals():
            print(f"     Raw response: {response.text[:200]}")
        return None
    except Exception as e:
        print(f"  ❌ AI Error for {spirit.get('name')}: {str(e)[:200]}")
        import traceback
        traceback.print_exc()
        return None


def validate_normalized_data(normalized: Dict) -> bool:
    """정규화된 데이터 검증"""
    # 필수 필드 체크
    if 'country' not in normalized:
        return False
    
    # ABV 범위 체크
    if normalized.get('abv') is not None:
        abv = normalized['abv']
        if not (0 <= abv <= 100):
            print(f"  ⚠️  Invalid ABV: {abv}")
            normalized['abv'] = None
    
    # region이 country와 동일한지 체크 (중복 방지)
    if normalized.get('region') and normalized.get('country'):
        region_lower = str(normalized['region']).lower().strip()
        country_lower = str(normalized['country']).lower().strip()
        
        if region_lower == country_lower or region_lower in ['한국', 'korea'] and country_lower == '대한민국':
            print(f"  ⚠️  Region duplicates country: {normalized['region']} == {normalized['country']}")
            normalized['region'] = None
    
    return True


def apply_normalization_to_dict(spirit: Dict, normalized: Dict) -> Dict:
    """정규화된 데이터를 딕셔너리에 적용 (Firestore 업데이트 없이)"""
    new_spirit = spirit.copy()
    
    new_spirit['country'] = normalized['country']
    new_spirit['region'] = normalized.get('region')
    new_spirit['distillery'] = normalized['distillery']
    new_spirit['bottler'] = normalized.get('bottler')
    new_spirit['abv'] = normalized.get('abv')
    
    # metadata 병합
    if 'metadata' not in new_spirit:
        new_spirit['metadata'] = {}
        
    if normalized.get('metadata', {}).get('importer'):
        new_spirit['metadata']['importer'] = normalized['metadata']['importer']
    
    # audit 정보 추가
    new_spirit['metadata']['auditDate'] = datetime.utcnow().isoformat()
    new_spirit['metadata']['corrections'] = normalized.get('corrections', [])
    
    return new_spirit


def apply_normalization(spirit_id: str, normalized: Dict, dry_run: bool = False):
    """Firestore 업데이트"""
    if dry_run:
        print(f"  [DRY RUN] Would update {spirit_id}")
        return
    
    db = get_db_client()
    try:
        # metadata 병합
        update_data = {
            'country': normalized['country'],
            'region': normalized.get('region'),
            'distillery': normalized['distillery'],
            'bottler': normalized.get('bottler'),
            'abv': normalized.get('abv'),
        }
        
        # importer가 있으면 metadata에 추가
        if normalized.get('metadata', {}).get('importer'):
            update_data['metadata.importer'] = normalized['metadata']['importer']
        
        # audit 정보 추가
        update_data['metadata.auditDate'] = datetime.utcnow().isoformat()
        update_data['metadata.corrections'] = normalized.get('corrections', [])
        
        # Firestore 업데이트
        db.collection('spirits').document(spirit_id).update(update_data)
        
        print(f"  ✅ Updated {spirit_id}")
    
    except Exception as e:
        print(f"  ❌ Update Error for {spirit_id}: {e}")


def save_audit_log(log_data: Dict, filename: str):
    """감사 로그 저장"""
    os.makedirs('data', exist_ok=True)
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(log_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Audit log saved to: {filename}")


# ==================== Main Function ====================

def main():
    parser = argparse.ArgumentParser(description='Database Audit AI for All Spirits')
    parser.add_argument('--input', help='Input local JSON file path (skips Firestore)')
    parser.add_argument('--output', help='Output JSON file path (for local mode)')
    parser.add_argument('--dry-run', action='store_true', help='Simulate without updating Firestore')
    parser.add_argument('--limit', type=int, default=None, help='Limit number of spirits to process')
    parser.add_argument('--skip-upload', action='store_true', help='Skip Firestore update (local log only)')
    parser.add_argument('--published-only', action='store_true', help='Only audit published spirits (default: all)')
    
    args = parser.parse_args()
    
    print("=" * 80)
    print("🤖 Database Audit AI")
    print("=" * 80)
    
    mode_name = "LOCAL FILE" if args.input else "FIRESTORE"
    print(f"Source: {mode_name}")
    if args.input:
        print(f"Input: {args.input}")
        print(f"Output: {args.output}")
    else:
        print(f"Scope: {'Published Only' if args.published_only else 'ALL SPIRITS (published + unpublished)'}")
    
    print(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    print(f"Limit: {args.limit or 'None (all)'}")
    print(f"Upload: {'Disabled' if (args.skip_upload or args.input) else 'Enabled'}")
    print("=" * 80)
    
    # 1. 데이터 가져오기
    if args.input:
        # 로콜 파일 로드
        if not os.path.exists(args.input):
            print(f"❌ Input file not found: {args.input}")
            return
        with open(args.input, 'r', encoding='utf-8') as f:
            spirits = json.load(f)
            if args.limit:
                spirits = spirits[:args.limit]
    else:
        # Firestore에서 가져오기
        if args.published_only:
            spirits = fetch_published_spirits(limit=args.limit)
        else:
            spirits = fetch_all_spirits(limit=args.limit)
    
    if not spirits:
        print("❌ No spirits found to process")
        return
    
    # 2. 감사 로그 초기화
    audit_log = {
        'timestamp': datetime.now().isoformat(),
        'total': len(spirits),
        'processed': 0,
        'corrected': 0,
        'unchanged': 0,
        'errors': 0,
        'corrections': {
            'country': 0,
            'region': 0,
            'distillery': 0,
            'bottler': 0,
            'abv': 0,
            'importer_separated': 0
        },
        'details': []
    }
    
    processed_spirits = []
    
    # 3. 각 제품 처리
    print(f"\n🔄 Processing {len(spirits)} spirits...\n")
    
    for i, spirit in enumerate(spirits, 1):
        spirit_id = spirit.get('id', 'local_item')
        spirit_name = spirit.get('name', 'Unknown')
        
        print(f"[{i}/{len(spirits)}] {spirit_name} ({spirit_id})")
        
        # AI 호출
        normalized = call_audit_ai(spirit)
        
        if not normalized:
            audit_log['errors'] += 1
            processed_spirits.append(spirit)
            continue
        
        # 검증
        if not validate_normalized_data(normalized):
            print(f"  ⚠️  Validation failed")
            audit_log['errors'] += 1
            processed_spirits.append(spirit)
            continue
        
        # 변경사항 체크
        corrections = normalized.get('corrections', [])
        
        if corrections:
            audit_log['corrected'] += 1
            
            # 카테고리별 집계
            for correction in corrections:
                correction_lower = correction.lower()
                if '제조국' in correction or 'country' in correction_lower:
                    audit_log['corrections']['country'] += 1
                if '지역' in correction or 'region' in correction_lower:
                    audit_log['corrections']['region'] += 1
                if '증류소' in correction or 'distillery' in correction_lower:
                    audit_log['corrections']['distillery'] += 1
                if '병입' in correction or 'bottler' in correction_lower:
                    audit_log['corrections']['bottler'] += 1
                if 'abv' in correction_lower or '도수' in correction:
                    audit_log['corrections']['abv'] += 1
                if '수입' in correction or 'importer' in correction_lower:
                    audit_log['corrections']['importer_separated'] += 1
            
            print(f"  📝 Corrections: {len(corrections)}")
            for correction in corrections:
                print(f"     - {correction}")
        else:
            audit_log['unchanged'] += 1
            print(f"  ✓ No changes needed")
        
        # 결과 적용
        if args.input:
            # 로컬 데이터에 적용
            updated_spirit = apply_normalization_to_dict(spirit, normalized)
            processed_spirits.append(updated_spirit)
        else:
            # Firestore 업데이트
            if not args.skip_upload:
                apply_normalization(spirit_id, normalized, dry_run=args.dry_run)
            processed_spirits.append(spirit) # 원본 유지 (FireStore는 직접 업데이트됨)
        
        # 로그 상세 기록
        audit_log['details'].append({
            'id': spirit_id,
            'name': spirit_name,
            'corrections': corrections,
            'normalized': normalized
        })
        
        audit_log['processed'] += 1
        
        # Rate limiting (API 과부하 방지)
        time.sleep(0.5)
    
    # 4. 결과 저장 (로컬 모드인 경우)
    if args.input and args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(processed_spirits, f, ensure_ascii=False, indent=2)
        print(f"\n✅ Processed data saved to: {args.output}")
    
    # 5. 감사 리포트 저장
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    log_filename = f"data/audit_report_{timestamp}.json"
    save_audit_log(audit_log, log_filename)
    
    # 6. 요약 출력
    print("\n" + "=" * 80)
    print("📊 Audit Summary")
    print("=" * 80)
    print(f"Total: {audit_log['total']}")
    print(f"Processed: {audit_log['processed']}")
    print(f"Corrected: {audit_log['corrected']}")
    print(f"Unchanged: {audit_log['unchanged']}")
    print(f"Errors: {audit_log['errors']}")
    print("\nCorrections by category:")
    for category, count in audit_log['corrections'].items():
        print(f"  - {category}: {count}")
    print("=" * 80)


if __name__ == '__main__':
    main()
