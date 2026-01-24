import asyncio
import json
import random
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright

# 설정
ENRICHED_DIR = Path('data/enriched')
FINAL_OUTPUT = Path('data/enriched/whisky_final.json')
FAIL_LOG = Path('scripts/image_fail_log.txt')
CHECKPOINT_INTERVAL = 10

# User-Agent 리스트 (차단 방지용)
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
]

async def search_image(page, name_en, distillery):
    """지시사항에 따른 최적화된 쿼리로 이미지 검색"""
    query = f"{name_en} {distillery} bottle official photo white background"
    search_url = f"https://www.google.com/search?q={query}&tbm=isch&tbs=isz:m"
    
    try:
        await page.goto(search_url)
        # 검색 결과 대기
        await page.wait_for_selector('div[data-ri="0"]', timeout=5000)
        
        # 첫 번째 이미지 결과 클릭하여 미리보기 창 열기
        await page.click('div[data-ri="0"]')
        
        # 미리보기 창에서 실제 이미지 소스 추출 시도 (여러 선택자 대응)
        selectors = [
            'img.sFlh5c.pT0Scc.i30OT', # 최신 구글 이미지 레이아웃
            'img.n3VNCb',             # 클래식 레이아웃
            'div.r43M7e img'          # 기타 변형
        ]
        
        image_url = None
        for selector in selectors:
            try:
                img_element = await page.wait_for_selector(selector, timeout=3000)
                src = await img_element.get_attribute('src')
                # base64가 아닌 실제 URL인지 확인
                if src and src.startswith('http') and not src.startswith('https://encrypted-tbn'):
                    image_url = src
                    break
            except:
                continue
                
        return image_url
    except Exception as e:
        print(f"⚠️ 검색 중 오류 ({name_en}): {e}")
        return None

async def main():
    # 1. 모든 보완 데이터 로드
    all_enriched = []
    batch_files = list(ENRICHED_DIR.glob('whisky_enriched_batch_*.json'))
    
    if not batch_files:
        print("❌ 보완 데이터 배치 파일을 찾을 수 없습니다.")
        return

    for f_path in batch_files:
        with open(f_path, 'r', encoding='utf-8') as f_in:
            all_enriched.extend(json.load(f_in))
            
    print(f"🔍 총 {len(all_enriched)}건의 데이터를 로드했습니다. 이미지 수집을 시작합니다.")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        processed_count = 0
        total_items = len(all_enriched)

        for i, item in enumerate(all_enriched):
            # 이미 이미지 URL이 있으면 스킵
            if item.get('imageUrl') and item['imageUrl'].startswith('http'):
                continue
                
            # 브라우저 컨텍스트 생성 (User-Agent 무작위 교체)
            context = await browser.new_context(user_agent=random.choice(USER_AGENTS))
            page = await context.new_page()

            name_en = item.get('metadata', {}).get('name_en', item['name'])
            distillery = item['distillery']
            
            print(f"📸 [{i+1}/{total_items}] 수집 시도: {name_en}...")
            
            img_url = await search_image(page, name_en, distillery)
            
            if img_url:
                item['imageUrl'] = img_url
                item['thumbnailUrl'] = img_url # 동일하게 설정
                item['updatedAt'] = datetime.now().isoformat()
                print(f"✅ 성공: {img_url[:60]}...")
            else:
                # 실패 기록
                with open(FAIL_LOG, 'a', encoding='utf-8') as f_fail:
                    f_fail.write(f"{item['id']} | {name_en} | {datetime.now().isoformat()}\n")
                print(f"❌ 실패 (로그 기록됨): {name_en}")

            processed_count += 1
            await context.close()

            # 지시사항: 랜덤 지연 (3~7초)
            delay = random.uniform(3, 7)
            if i < total_items - 1:
                await asyncio.sleep(delay)
            
            # 지시사항: 10건마다 체크포인트 저장
            if processed_count % CHECKPOINT_INTERVAL == 0:
                with open(FINAL_OUTPUT, 'w', encoding='utf-8') as f_out:
                    json.dump(all_enriched, f_out, indent=2, ensure_ascii=False)
                print(f"💾 중간 저장 완료: {FINAL_OUTPUT}")

        # 최종 저장
        with open(FINAL_OUTPUT, 'w', encoding='utf-8') as f_out:
            json.dump(all_enriched, f_out, indent=2, ensure_ascii=False)
            
        await browser.close()
        print(f"✨ 모든 작업 완료! 최종 결과 저장: {FINAL_OUTPUT}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 사용자에 의해 중단되었습니다.")
