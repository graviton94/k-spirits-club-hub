import os
import sys
import json
import time
import argparse
import traceback
import re  # 정규식 모듈 추가
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any
from pydantic import BaseModel, Field

# Google Gen AI SDK
from google import genai
from google.genai import types

# Force UTF-8
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# --- 1. Robust Environment Loader ---
def load_env_robust():
    env_vars = {}
    try:
        current_dir = Path.cwd()
        potential_paths = [current_dir / '.env', current_dir.parent / '.env', Path(__file__).parent.parent / '.env']
        env_path = next((p for p in potential_paths if p.exists()), None)

        if env_path:
            with open(env_path, 'r', encoding='utf-8', errors='ignore') as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith('#') or line.startswith('const ') or '{' in line:
                        continue
                    if '=' in line:
                        key, value = line.split('=', 1)
                        env_vars[key.strip()] = value.strip().strip("'").strip('"')
    except Exception as e:
        print(f"⚠️ Warning: Custom .env loading error: {e}")
    return env_vars

env_conf = load_env_robust()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or env_conf.get("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("❌ ERROR: GEMINI_API_KEY is missing.")
    sys.exit(1)

# --- 2. Pydantic Schema (Prompt 주입용) ---
# API Config에는 넣지 않지만, 프롬프트에 구조를 설명하기 위해 유지합니다.
class SpiritEnrichmentResult(BaseModel):
    id: str
    abv: float = Field(..., description="Alcohol by volume (0-100)")
    subcategory: str = Field(..., description="Standardized subcategory")
    distillery_refined: str = Field(..., description="Official distillery name (Clean brand name)")
    region: str = Field(..., description="Specific region (No country names)")
    country: str = Field(..., description="Official country name in Korean")
    nose_tags: List[str] = Field(..., description="List of 3-5 aroma hashtags")
    palate_tags: List[str] = Field(..., description="List of 3-5 taste hashtags")
    finish_tags: List[str] = Field(..., description="List of 3-5 finish hashtags")
    description_ko: str = Field(..., description="Detailed description in Korean (Plain text, no formatting)")
    description_en: str = Field(..., description="Detailed description in English")
    pairing_guide_ko: str = Field(..., description="Food pairing guide in Korean")
    pairing_guide_en: str = Field(..., description="Food pairing guide in English")
    name_en: str = Field(..., description="Official English product name")

class SpiritBatchOutput(BaseModel):
    results: List[SpiritEnrichmentResult]

# --- 3. Client & Metadata Setup ---
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_ID = "gemini-2.0-flash"

BASE_DIR = Path(__file__).parent.parent
METADATA_PATH = BASE_DIR / 'lib/constants/spirits-metadata.json'

try:
    with open(METADATA_PATH, 'r', encoding='utf-8') as f:
        METADATA = json.load(f)
except FileNotFoundError:
    print(f"⚠️ Warning: Metadata file not found at {METADATA_PATH}. Using empty defaults.")
    METADATA = {"categories": {}, "tag_index": {"nose": [], "palate": [], "finish": []}}

# --- 4. Helper Functions ---

def clean_json_text(text: str) -> str:
    """Markdown 코드 블록 및 불필요한 공백 제거"""
    # ```json ... ``` 제거
    text = re.sub(r'^```json\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'^```\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'```$', '', text, flags=re.MULTILINE)
    return text.strip()

def get_category_context(category: str) -> str:
    cat_lower = str(category).lower()
    cat_map = METADATA.get('categories', {})
    
    if any(k in cat_lower for k in ['whisky', '위스키']):
        return f"Whisky Guide: {json.dumps(cat_map.get('위스키', {}), ensure_ascii=False)}"
    elif any(k in cat_lower for k in ['gin', '진']):
        return f"Gin Guide: {json.dumps(cat_map.get('일반증류주', {}).get('진', []), ensure_ascii=False)}"
    return f"General Guide: {json.dumps(cat_map.get('소주', {}), ensure_ascii=False)}"

def enrich_batch(batch: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    minimal_input = [
        {
            "id": item['id'],
            "name": item['name'],
            "original_category": item.get('category', 'unknown'),
            "original_distillery": item.get('distillery', 'unknown')
        } 
        for item in batch
    ]
    
    primary_cat = batch[0].get('category', 'Spirit')
    cat_context = get_category_context(primary_cat)
    tag_index = METADATA.get('tag_index', {})

    # Pydantic 스키마를 JSON 문자열로 변환하여 프롬프트에 삽입
    schema_instruction = json.dumps(SpiritBatchOutput.model_json_schema(), indent=2, ensure_ascii=False)

    system_instruction = """
    You are the 'Text Sanitizer' and Chief Spirits Auditor.
    
    OPERATIONAL DIRECTIVES:
    1. **TRUTH ENFORCEMENT**: You MUST use the `Google Search` tool to verify every detail (ABV, Distillery, Region). Do not guess.
    2. **TEXT SANITIZATION**: 
       - OUTPUT MUST BE PURE PLAIN TEXT.
       - STRICTLY FORBIDDEN: Markdown bold (**), italics (*), or complex formatting in descriptions.
       - Use only hyphens (-) or numbers (1.) for lists.
    3. **DATA NORMALIZATION**:
       - Distillery: Remove "Co., Ltd", "Inc." -> Use Clean Brand Name.
       - Country: Use OFFICIAL Korean names (대한민국, 미국, 영국, 프랑스).
       - Region: Specific City/State only.
    """

    prompt = f"""
    Analyze this batch of spirits using Google Search.
    
    [Category Context]
    {cat_context}
    
    [Tag Vocabulary]
    Nose: {tag_index.get('nose', [])[:15]}...
    Palate: {tag_index.get('palate', [])[:15]}...
    
    [Input Batch]
    {json.dumps(minimal_input, ensure_ascii=False)}
    
    [CRITICAL OUTPUT RULE]
    You must output a VALID JSON object matching exactly this schema:
    {schema_instruction}
    
    Return ONLY the JSON. No preamble.
    """

    for attempt in range(3):
        try:
            # ⚠️ FIX: response_schema 제거 (Search와 충돌 방지)
            response = client.models.generate_content(
                model=MODEL_ID,
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())], 
                    response_mime_type="application/json", # JSON 모드 힌트 유지
                    temperature=0.1,
                    system_instruction=system_instruction
                )
            )

            # Manual Parsing Logic
            raw_text = response.text
            clean_text = clean_json_text(raw_text)
            
            try:
                parsed_json = json.loads(clean_text)
            except json.JSONDecodeError:
                print(f"⚠️ JSON Parse Error on attempt {attempt+1}. Retrying...")
                continue

            # Validate & Extract results
            # 'results' 키가 없는 경우 처리 (모델이 리스트만 뱉는 경우 대비)
            if 'results' in parsed_json:
                results_list = parsed_json['results']
            elif isinstance(parsed_json, list):
                results_list = parsed_json
            else:
                results_list = [parsed_json] # 단일 객체일 경우

            result_map = {res.get('id'): res for res in results_list}
            
            for item in batch:
                res = result_map.get(item['id'])
                if res:
                    # Safe access with .get() since it's a dict now, not Pydantic object
                    item['abv'] = res.get('abv')
                    item['region'] = res.get('region')
                    item['country'] = res.get('country')
                    item['subcategory'] = res.get('subcategory')
                    item['distillery'] = res.get('distillery_refined')
                    item['name_en'] = res.get('name_en')
                    
                    item['nose_tags'] = res.get('nose_tags', [])
                    item['palate_tags'] = res.get('palate_tags', [])
                    item['finish_tags'] = res.get('finish_tags', [])
                    
                    all_tags = (item['nose_tags'] or []) + (item['palate_tags'] or []) + (item['finish_tags'] or [])
                    if all_tags:
                        item['tasting_note'] = ', '.join(all_tags)

                    if 'metadata' not in item: item['metadata'] = {}
                    item['metadata'].update({
                        'description_ko': res.get('description_ko'),
                        'description_en': res.get('description_en'),
                        'pairing_guide_ko': res.get('pairing_guide_ko'),
                        'pairing_guide_en': res.get('pairing_guide_en'),
                        'name_en': res.get('name_en')
                    })
                    
                    item['isReviewed'] = True
                    item['status'] = 'ENRICHED'
                    item['updatedAt'] = datetime.now().isoformat()
            
            return batch

        except Exception as e:
            print(f"⚠️ Attempt {attempt+1} Failed: {e}")
            traceback.print_exc()
            time.sleep(2 * (attempt + 1))

    print("❌ Critical Failure: Could not enrich batch.")
    return batch

# --- 5. Main Execution ---

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    if not input_path.exists():
        print(f"❌ Input file not found: {input_path}")
        return

    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"🚀 Starting Enrichment for {len(data)} items...")
    
    # Search 기능 사용 시 배치 사이즈를 줄이는 것이 안정적입니다.
    BATCH_SIZE = 3 
    enriched_data = []

    for i in range(0, len(data), BATCH_SIZE):
        batch = data[i:i+BATCH_SIZE]
        print(f"   Processing batch {i//BATCH_SIZE + 1} ({len(batch)} items)...")
        
        processed = enrich_batch(batch)
        enriched_data.extend(processed)
        time.sleep(2) # Search API 호출 제한을 고려하여 대기 시간 증가

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(enriched_data, f, indent=2, ensure_ascii=False)

    print(f"\n✅ SUCCESS: Processed {len(enriched_data)} items.")
    print(f"📁 Output: {output_path}")

if __name__ == "__main__":
    main()
