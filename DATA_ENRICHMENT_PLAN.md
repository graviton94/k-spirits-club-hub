# 🥃 K-Spirits Club Hub: 데이터 파이프라인 명세서

본 문서는 `scripts/` 디렉토리에 구현된 Python 기반 배치 파이프라인의 아키텍처와 로직을 정의합니다.

## 1. 아키텍처 개요 (Architecture)
- **Master**: `scripts/run_pipeline.py` (배치 오케스트레이션)
- **Components**:
    1.  `fetch_imported_food.py`: 수입식품정보마루 데이터 수집 (Raw Data)
    2.  `enrich_with_gemini.py`: Gemini 2.0 Flash 기반 메타데이터 보완
    3.  `fetch_images_advanced.py`: 구글 이미지 검색 (BeautifulSoup)
    4.  `migrate_to_firestore.js`: Firestore 업로드 (Node.js)
- **Data Flow**: `Raw JSON` -> `Batch Split (10 items)` -> `Enrich` -> `Image Search` -> `Upload/Save`

## 2. 주요 기능 및 로직

### A. 배치 처리 & 오프라인 모드
- **Smart Batching**: 데이터를 10개 단위로 끊어서 처리하며, 각 단계마다 상태(`pipeline_state.json`)를 저장하여 중단 시 자동 재개됩니다.
- **Offline Mode (`--skip-upload`)**:
    - API 할당량이 부족하거나 네트워크가 불안정한 경우 업로드 단계를 건너뜁니다.
    - 처리된 결과물은 `data/processed_batches/batch_[file]_[timestamp].json` 형태로 로컬에 안전하게 저장됩니다.

### B. AI 보완 (Gemini 2.0 Flash)
- **입력**: 제품명(한글), 영문명(Metadata), 제조사, 카테고리.
- **출력**:
    - `abv`: 도수 추론 (제품명 기반).
    - `tags`: Nose, Palate, Finish 해시태그 생성.
    - **No Marketing Fluff**: 홍보성 설명(description) 생성 기능은 제거되었습니다.
- **안정성**: `.env` 파일에 자바스크립트 코드가 섞여 있어도 `GEMINI_API_KEY`만 파싱하는 Robust Parser가 적용되었습니다.

### C. 이미지 검색 (Advanced Search)
- **전략**: `requests` + `BeautifulSoup`을 사용하여 가벼운 검색 수행.
- **필터링**:
    - `gstatic` 썸네일 또는 고화질 원본 URL 추출.
    - 가로가 너무 긴 이미지(배너 등)는 자동 제외.

## 3. 실행 가이드
```bash
# 기본 실행 (DB 업로드 포함)
python scripts/run_pipeline.py --source "data/raw_imported/imported_위스키.json"

# 오프라인 모드 (로컬 저장만)
python scripts/run_pipeline.py --source "data/spirits_소주.json" --skip-upload
```

## 4. 데이터 저장 구조
- **Raw Data**: `data/raw_imported/`
- **Processed**: `data/processed_batches/` (오프라인 모드 결과물)
- **Enriched**: `data/enriched/` (구 버전/백업)