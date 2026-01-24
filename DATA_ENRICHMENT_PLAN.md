# 🥃 K-Spirits Club Hub: 데이터 보완 파이프라인 계획서

본 문서는 수집된 주류 로우 데이터(JSON)를 LLM(Gemini)과 구글 검색을 통해 고도화하는 자동화 파이프라인의 명세서입니다. GitHub Copilot은 각 Phase를 구현할 때 이 문서의 로직과 제약 사항을 준수해야 합니다.

---

## 1. 개요 (Overview)
- **목적**: 기본 정보(이름, 제조사)만 있는 로우 데이터에 도수(ABV), 테이스팅 노트(Nose, Palate, Finish), 이미지 URL을 추가하여 마스터 DB 완성.
- **대상 데이터**: `data/raw_imported/` 폴더 내 주종별 JSON 파일.
- **최종 출력**: `data/enriched/` 폴더 내 보완 완료된 JSON 파일.

---

## 2. 파이프라인 단계별 상세 (Stages)

### Phase 1: LLM 정보 추론 (Inference with Gemini)
- **목표**: 제품 정보를 기반으로 기술적 세부 사항 및 감성 데이터 추론.
- **입력**: `name`, `metadata.name_en`, `distillery`, `country`
- **추출 항목 (Schema)**:
    - `abv`: 도수 (숫자 타입, 알 수 없는 경우 0)
    - `subcategory`: 세부 분류 (예: 싱글몰트, 버번, 런던 드라이 등)
    - `region`: 상세 생산 지역 (예: Islay, Kentucky, 가평 등)
    - `tasting_notes`: `nose`, `palate`, `finish` (한국어 문자열)
- **제약 사항**:
    - 한 번에 20개씩 배치(Batch) 처리하여 API 호출 횟수 최적화.
    - `google-generativeai` 라이브러리 사용.
    - 결과가 유효한 JSON 배열이 아닐 경우 재시도(Retry) 로직 포함.

### Phase 2: 이미지 에셋 수집 (Visual Retrieval)
- **목표**: 제품의 공식 병 이미지 URL 확보.
- **입력**: `metadata.name_en`, `distillery`
- **방법**: Google Image 고급 검색 자동화.
- **검색 쿼리 최적화**: `"{name_en} {distillery} bottle official photo"`
- **제약 사항**:
    - `Playwright` 또는 `BeautifulSoup`을 사용하여 첫 번째 고화질 이미지 링크 추출.
    - 배경이 흰색인 제품 사진(White background)을 최우선으로 수집.

### Phase 3: 데이터 병합 및 검증 (Merge & Validation)
- **목표**: Phase 1, 2의 결과물을 원본 데이터와 결합.
- **로직**:
    - `id` 또는 `externalId`를 기준으로 `Deep Merge` 수행.
    - `isReviewed` 플래그를 `true`로 변경.
    - `updatedAt` 필드를 현재 시간으로 갱신.
- **저장**: `data/enriched/[category]_final.json`

---

## 3. 데이터 매핑 테이블 (Mapping Table)

| 원본 필드 | 목표 필드 | 처리 단계 | 보완 로직 |
| :--- | :--- | :--- | :--- |
| `prductNmko` | `name` | - | 원본 유지 |
| - | `abv` | Phase 1 | Gemini API 추론 |
| - | `subcategory` | Phase 1 | Gemini API 추론 |
| - | `nose/palate/finish`| Phase 1 | Gemini API 추론 (KR) |
| - | `imageUrl` | Phase 2 | Google Image Search |
| `source` | `source` | - | 'imported_food_maru' 고정 |

---

## 4. 운영 가이드 (Operational Guide)
1. **멱등성 보장**: `enrich_progress.log` 파일을 생성하여 이미 처리된 `externalId`는 건너뜀.
2. **속도 제한**: 각 배치 요청 사이 `time.sleep(random.uniform(2, 5))` 적용.
3. **비용 최적화**: Gemini 1.5 Flash 모델 사용 권장.