import os
import json
import time
import argparse
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any
from google import genai
from google.genai import types
# from dotenv import load_dotenv (Disabled: .env contains JS code causing parsing errors)

# Manual .env parser to support hybrid file format
def load_env_robust():
    env_vars = {}
    try:
        # Search for .env in current and parent directories
        current_dir = Path.cwd()
        potential_paths = [current_dir / '.env', current_dir.parent / '.env', Path(__file__).parent.parent / '.env']
        
        env_path = next((p for p in potential_paths if p.exists()), None)
        
        if env_path:
            with open(env_path, 'r', encoding='utf-8', errors='ignore') as f:
                for line in f:
                    line = line.strip()
                    # Skip JS objects or comments
                    if not line or line.startswith('#') or line.startswith('const ') or '{' in line or '}' in line:
                        continue
                    if '=' in line:
                        key, value = line.split('=', 1)
                        # Clean quotes
                        env_vars[key.strip()] = value.strip().strip("'").strip('"')
    except Exception as e:
        print(f"⚠️ Warning: Custom .env loading encountered error: {e}")
    return env_vars

# Load Config
env_conf = load_env_robust()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or env_conf.get("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("❌ .env 파일에 GEMINI_API_KEY가 설정되어 있지 않습니다.")
    exit(1)

print(f"DEBUG: GEMINI_API_KEY Loaded: {'*' * 5}{GEMINI_API_KEY[-4:] if GEMINI_API_KEY else 'None'}")

# API 클라이언트 및 모델 설정
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_ID = "gemini-2.0-flash"

# 1. 표준 메타데이터 로드 (인덱스 참조용)
# 스크립트 위치 기준 상대 경로 계산
BASE_DIR = Path(__file__).parent.parent
METADATA_PATH = BASE_DIR / 'lib/constants/spirits-metadata.json'

with open(METADATA_PATH, 'r', encoding='utf-8') as f:
    METADATA = json.load(f)

def get_category_prompt(category: str) -> str:
    """카테고리에 맞는 프롬프트 가이드를 반환합니다."""
    # 메타데이터 키 매핑 (한글 -> 키)
    # 간단하게 구현: whisky 키워드가 있으면 whisky, 그 외에는 일반 가이드
    cat_lower = str(category).lower()
    
    if 'whisky' in cat_lower or '위스키' in cat_lower:
        categories = METADATA['categories'].get('whisky', {})
        return f"- 위스키 카테고리 가이드: {json.dumps(categories, ensure_ascii=False)}"
    elif 'gin' in cat_lower or '진' in cat_lower:
        return f"- 진(Gin) 카테고리 가이드: {json.dumps(METADATA['categories'].get('gin', []), ensure_ascii=False)}"
    elif 'rum' in cat_lower or '럼' in cat_lower:
        return f"- 럼(Rum) 카테고리 가이드: {json.dumps(METADATA['categories'].get('rum', []), ensure_ascii=False)}"
    elif 'tequila' in cat_lower or '테킬라' in cat_lower or '데킬라' in cat_lower:
        return f"- 테킬라 카테고리 가이드: {json.dumps(METADATA['categories'].get('tequila', []), ensure_ascii=False)}"
    elif 'brandy' in cat_lower or '브랜디' in cat_lower or 'cognac' in cat_lower:
        return f"- 브랜디 카테고리 가이드: {json.dumps(METADATA['categories'].get('brandy', []), ensure_ascii=False)}"
    else:
        # Default or Korean Spirits
        return f"- 일반/기타 주류 가이드: {json.dumps(METADATA['categories'].get('korean_spirits', []), ensure_ascii=False)}"

def enrich_batch(batch: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    # 컨텍스트 최적화: 필요한 정보만 추출
    minimal_batch = []
    
    # 배치 내의 대표 카테고리 파악 (첫 번째 아이템 기준)
    primary_category = batch[0].get('category', 'unknown') if batch else 'unknown'
    category_guide = get_category_prompt(primary_category)
    
    tag_index = METADATA['tag_index']

    for item in batch:
        minimal_batch.append({
            "id": item['id'],
            "name_ko": item['name'],
            "name_en": item.get('metadata', {}).get('name_en', ''),
            "distillery": item['distillery'],
            "category": item.get('category', '')
        })

    prompt = f"""
너는 세계 최고의 마스터 블렌더이자 주류 전문 소믈리에야. 
아래 주류 목록을 분석하여 전문적인 테이스팅 데이터와 정밀한 카테고리 분류를 수행해줘.

[카테고리 가이드]
{category_guide}

[테이스팅 태그 인덱스 가이드]
- 아래 태그들을 참고하여 각 항목별로 적합한 해시태그를 3~5개씩 선택해.
- 향(Nose): {tag_index['nose']}
- 맛/질감(Palate): {tag_index['palate']}
- 여운(Finish): {tag_index['finish']}

[작성 규칙]
1. abv: 제품명에 정보가 없다면 해당 제품의 일반적인 도수를 지식으로 추론해(소주: 16~20, 위스키: 40~46 등).
2. subcategory: 위 가이드의 표준 명칭을 사용해.
3. Tags: 각 영역(nose, palate, finish)에 대해 반드시 위 인덱스의 단어를 해시태그(#) 형식으로 포함해.
   - **중요**: 카테고리에 얽매이지 말고 '제품명' 자체를 분석하여 원재료를 유추해.
   - 예: '려(Ryeo)' -> 고구마 증류소주 (#고구마, #뿌리채소), '문배술' -> 배향 (#배, #곡물)
   - 제품명에 특정 과일이나 재료(고구마, 감귤, 포도 등)가 들어있다면 반드시 해당 재료의 풍미를 태그에 반영해.

 대상 목록:
{json.dumps(minimal_batch, ensure_ascii=False)}

반드시 아래 구조의 JSON 배열로만 응답해 (Markdown 코드 블록 없이):
[
  {{
    "id": "아이템 ID",
    "abv": 40.0,
    "region": "상세 지역",
    "subcategory": "표준 카테고리명",
    "distillery_refined": "공식 제조소 명칭",
    "nose_tags": ["#태그1"],
    "palate_tags": ["#태그2"],
    "finish_tags": ["#태그3"]
  }}
]
"""

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model=MODEL_ID,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            content = response.text.strip()
            # Markdown code block 제거
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            content = content.strip()

            enriched_results = json.loads(content)
            
            mapping = {res['id']: res for res in enriched_results}
            for item in batch:
                res = mapping.get(item['id'])
                if res:
                    if res.get('abv'): item['abv'] = float(res['abv'])
                    if res.get('region'): item['region'] = res['region']
                    if res.get('subcategory'): item['subcategory'] = res['subcategory']
                    if res.get('distillery_refined'): item['distillery'] = res['distillery_refined']
                    
                    if 'metadata' not in item: item['metadata'] = {}
                    
                    # 해시태그 및 설명 저장
                    item['metadata']['nose_tags'] = res.get('nose_tags', [])
                    item['metadata']['palate_tags'] = res.get('palate_tags', [])
                    item['metadata']['finish_tags'] = res.get('finish_tags', [])
                    # item['metadata']['description'] = res.get('description', '') # Removed as per user request
                    
                    # 태그를 합쳐서 tasting_note 생성 (간단 버전)
                    all_tags = res.get('nose_tags', []) + res.get('palate_tags', []) + res.get('finish_tags', [])
                    if all_tags:
                         item['metadata']['tasting_note'] = ', '.join(all_tags)

                    item['isReviewed'] = True
                    item['status'] = 'ENRICHED' # 상태 업데이트
                    item['updatedAt'] = datetime.now().isoformat()
            
            return batch

        except Exception as e:
            wait_time = (attempt + 1) * 2
            print(f"⚠️ Enrichment Attempt {attempt+1} Failed: {e}", flush=True)
            time.sleep(wait_time)
            
    print(f"❌ Failed to enrich batch after 3 attempts.", flush=True)
    return batch

def main():
    parser = argparse.ArgumentParser(description='Enrich spirits data using Gemini AI')
    parser.add_argument('--input', required=True, help='Input JSON file path')
    parser.add_argument('--output', required=True, help='Output JSON file path')
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    if not input_path.exists():
        print(f"Error: Not found {input_path}")
        return

    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Batch processing
        batch_size = 10
        enriched_data = []
        
        for i in range(0, len(data), batch_size):
            batch = data[i:i+batch_size]
            processed_batch = enrich_batch(batch)
            enriched_data.extend(processed_batch)
            time.sleep(1) # Rate limit

        # Ensure directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(enriched_data, f, indent=2, ensure_ascii=False)
            
        print(f"Success: Processed {len(enriched_data)} items")

        # Final Summary
        print("\n" + "="*50)
        print(" 📊 [SUMMARY] Gemini Enrichment")
        print("-" * 50)
        print(f"  • Input Items        : {len(data)}")
        print(f"  • Successfully Enriched : {len(enriched_data)}")
        print(f"  • Output File        : {output_path}")
        print("=" * 50 + "\n")

    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
