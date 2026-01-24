import os
import json
import time
from pathlib import Path
from typing import List, Dict, Any
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("❌ .env 파일에 GEMINI_API_KEY가 설정되어 있지 않습니다.")
    exit(1)

# Initialize Gemini Client
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_ID = "gemini-2.0-flash"

# File Paths
DATA_FILE = Path('lib/db/ingested-data.json')
BACKUP_FILE = Path('lib/db/ingested-data.backup.json')

def enrich_reviews_batch(batch: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    # Extract only ID and Name for the prompt to minimize tokens
    minimal_batch = []
    for item in batch:
        minimal_batch.append({
            "id": item['id'],
            "name": item['name']
        })

    prompt = f"""
    당신은 주류 전문 리뷰어이자 소믈리에입니다.
    아래 주류 목록({len(minimal_batch)}개)에 대해, 각 제품의 '최신/대표 리뷰'를 분석하여 핵심적인 테이스팅 노트와 매력적인 소개글을 작성해주세요.

    [작성 규칙]
    1. 정보가 불확실하면 일반적인 해당 카테고리/제품군의 특징을 기반으로 작성하되, 너무 구체적인 거짓 정보는 피하세요.
    2. tasting_note: 맛, 향, 피니시를 종합한 1~2문장의 핵심 요약. (한국어)
    3. description: 사용자에게 이 술을 추천하는 매력적인 2~3문장의 소개글. (한국어)
    4. 결과는 입력된 'id'를 기준으로 매핑할 수 있어야 합니다.

    [입력 데이터]
    {json.dumps(minimal_batch, ensure_ascii=False)}

    [출력 포맷 (JSON Array)]
    [
      {{
        "id": "item_id",
        "tasting_note": "산뜻한 시트러스 향과 바닐라의 달콤함이 어우러진...",
        "description": "입문자부터 애호가까지 모두가 즐길 수 있는..."
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
            # Remove potential markdown code blocks if present (though response_mime_type usually handles it)
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

            enriched_results = json.loads(content)
            
            # Map results back to the original items
            mapping = {res['id']: res for res in enriched_results}
            
            updated_count = 0
            for item in batch:
                res = mapping.get(item['id'])
                if res:
                    if 'metadata' not in item:
                        item['metadata'] = {}
                    
                    # Update metadata with new info if valid
                    if res.get('tasting_note') and not item['metadata'].get('tasting_note'):
                        item['metadata']['tasting_note'] = res['tasting_note']
                    
                    if res.get('description') and not item['metadata'].get('description'):
                        item['metadata']['description'] = res['description']
                    
                    updated_count += 1
            
            return batch, updated_count

        except Exception as e:
            wait_time = (attempt + 1) * 5
            print(f"⚠️ API 호출 실패 ({e}). {wait_time}초 후 재시도...")
            time.sleep(wait_time)
            
    print("❌ 3회 재시도 실패. 이번 배치는 건너뜁니다.")
    return batch, 0

def main():
    if not DATA_FILE.exists():
        print(f"❌ 데이터 파일을 찾을 수 없습니다: {DATA_FILE}")
        return

    print(f"🚀 Gemini 리뷰 데이터 보완 시작 (Target: {DATA_FILE})")
    
    # Load Data
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            all_spirits = json.load(f)
    except Exception as e:
        print(f"❌ 데이터 로드 실패: {e}")
        return

    if not isinstance(all_spirits, list):
        print("❌ 데이터 형식이 올바르지 않습니다 (Array expected).")
        return

    # Filter items that need enrichment (missing tasting_note or description)
    # We prioritize items that are already ingested/valid
    targets = []
    for s in all_spirits:
        meta = s.get('metadata', {})
        if not meta.get('tasting_note') or not meta.get('description'):
            targets.append(s)

    print(f"📊 총 {len(all_spirits)}개 항목 중 보완이 필요한 항목: {len(targets)}개")

    if not targets:
        print("✨ 모든 항목이 이미 보완되었습니다.")
        return

    # Backup functionality
    if not BACKUP_FILE.exists():
        with open(BACKUP_FILE, 'w', encoding='utf-8') as f:
            json.dump(all_spirits, f, indent=2, ensure_ascii=False)
        print("💾 원본 데이터 백업 완료.")

    BATCH_SIZE = 10
    total_processed = 0
    total_updated = 0

    try:
        # Process in batches
        for i in range(0, len(targets), BATCH_SIZE):
            batch = targets[i : i + BATCH_SIZE]
            print(f"📦 처리 중... ({i+1}/{len(targets)})")

            _, updated = enrich_reviews_batch(batch)
            total_updated += updated
            total_processed += len(batch)
            
            # Save progress periodically (files can be large, so maybe every 5 batches or just at end? 
            # Given it's a single JSON file database, rewriting it constantly is risky/slow. 
            # We will save every 50 items or at the end.)
            if total_processed % 50 == 0:
                print("💾 중간 저장 중...")
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(all_spirits, f, indent=2, ensure_ascii=False)
            
            time.sleep(1) # Gentle rate limiting

    except KeyboardInterrupt:
        print("\n🛑 사용자에 의해 중단되었습니다.")
    except Exception as e:
        print(f"\n❌ 예상치 못한 오류 발생: {e}")
    finally:
        # Final Save
        print("💾 최종 데이터 저장 중...")
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(all_spirits, f, indent=2, ensure_ascii=False)
        
        print(f"\n✨ 작업 완료!")
        print(f"- 처리된 항목: {total_processed}")
        print(f"- 업데이트된 내용: {total_updated}건")

if __name__ == "__main__":
    main()
