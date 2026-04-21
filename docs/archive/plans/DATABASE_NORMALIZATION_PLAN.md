# 📊 Database Normalization & Audit Plan

> **📌 STATUS: ACTIVE PLAN (Not Yet Executed)**  
> **Last Reviewed**: 2026-02-06  
> This document outlines a comprehensive database audit and normalization strategy for the 741 published spirits. While not yet executed, recent AI optimization work (temperature 0.7, recency weighting) demonstrates similar AI-driven data enhancement capabilities. Execution pending resource allocation and backup preparation.

## 🎯 목표
Published 데이터 741개에 대한 분석 결과, 제조국·지역·증류소·병입자 필드의 정규화 및 데이터 품질 개선 필요.

---

## 📈 분석 결과 요약 (2026-02-01)

### **총 발행 제품**: 741개

### **제조국 분포** (Top 10)
| 제조국 | 제품 수 | 비율 |
|--------|---------|------|
| 대한민국 | 448 | 60.5% |
| 영국 | 103 | 13.9% |
| 미국 | 36 | 4.9% |
| 벨기에 | 34 | 4.6% |
| 프랑스 | 29 | 3.9% |
| 일본 | 13 | 1.8% |
| 이탈리아 | 13 | 1.8% |
| 독일 | 8 | 1.1% |
| 중국 | 8 | 1.1% |
| 스페인 | 8 | 1.1% |

### **지역 분포** (Top 15)
| 지역 | 제품 수 | 이슈 |
|------|---------|------|
| 대한민국 | 158 | ⚠️ 제조국과 동일 (중복) |
| 스페이사이드 | 35 | ✅ 정상 (스코틀랜드 위스키 지역) |
| 미상 | 34 | ⚠️ Unknown 처리 필요 |
| 아일라 | 27 | ✅ 정상 |
| 하이랜드 | 23 | ✅ 정상 |
| 제주 | 19 | ✅ 정상 |
| 벨기에 | 18 | ⚠️ 제조국과 동일 (중복) |
| 미국 | 16 | ⚠️ 제조국과 동일 (중복) |
| 경기도 | 15 | ✅ 정상 |
| 켄터키 | 14 | ✅ 정상 |
| 전라북도 | 11 | ✅ 정상 |
| 스코틀랜드 | 11 | ⚠️ 제조국(영국)의 하위 지역이지만 제조국으로도 사용됨 |
| 한국 | 10 | ⚠️ "대한민국"과 동일 표기 불일치 |
| 내변산 | 10 | ✅ 정상 (전북 부안) |
| 대전 | 10 | ✅ 정상 |

### **증류소/제조사** (Top 20)
| 증류소/제조사 | 제품 수 | 의심 유형 |
|---------------|---------|-----------|
| ㈜한라산 | 17 | ⚠️ "주식회사" 표기 |
| 배상면주가 | 15 | ✅ 정상 |
| 내변산 | 14 | ✅ 정상 |
| ㈜선양소주 | 12 | ⚠️ "주식회사" 표기 |
| 주식회사 기원 위스키 증류소 | 11 | ⚠️ "주식회사" 표기, 긴 이름 |
| 남한산성소주 | 10 | ✅ 정상 |
| ㈜충북소주 | 9 | ⚠️ "주식회사" 표기 |
| 농업회사법인(주)흥진담은 | 9 | ⚠️ "주식회사", "농업회사법인" 표기 |
| ㈜금복주 안동공장 | 8 | ⚠️ "주식회사" 표기 |
| ㈜우리술 | 7 | ⚠️ "주식회사" 표기 |
| 강남주조 주식회사 | 7 | ⚠️ "주식회사" 표기 |
| Laphroaig | 7 | ✅ 정상 (영문) |
| Diageo | 7 | ✅ 정상 (영문) |

### **수출입사로 의심되는 케이스**: 143건
- "주식회사", "농업회사법인" 등 법인 형태 표기
- 실제 수입사 리스트: 64개 회사 식별

---

## 🚨 주요 문제점

### **1. 제조국-지역 중복 문제**
```
제조국: "대한민국" → 지역: "대한민국" (158건)
제조국: "미국" → 지역: "미국" (16건)
제조국: "벨기에" → 지역: "벨기에" (18건)
```
**해결**: AI가 제조국과 지역이 동일한 경우 지역을 `null` 또는 더 구체적인 지역으로 교체

### **2. 지역 표기 불일치**
```
"대한민국" vs "한국" vs "Korea"
"경기도" vs "경기"
"경상남도" vs "경남"
"전라북도" vs "전북"
```
**해결**: 통일된 행정구역 표기 사용 (예: 시·도 단위는 "경기도", "충청남도" 등)

### **3. 증류소 표기 문제**
```
❌ "주식회사 기원 위스키 증류소"
✅ "기원 위스키 증류소"

❌ "㈜한라산"
✅ "한라산"

❌ "농업회사법인(주)흥진담은"
✅ "흥진담은"
```
**해결**: 법인 형태 제거 (주식회사, ㈜, 농업회사법인 등)

### **4. 증류소 vs 수출입사 혼동**
```
증류소: "강남주조 주식회사"
실제: 증류소 ✅

증류소: "TSUZAKI TRADING CO., LTD."
실제: 수출입사 ❌
```
**해결**: AI가 수출입사 키워드 체크 + 제조국과 비교

### **5. 병입자(Bottler) 필드 미사용**
- 현재 bottler 필드 사용: 0건
- IB(Independent Bottler) 정보가 distillery에 섞여있을 가능성

---

## 🎯 정규화 규칙

### **1. 제조국 (country)**
#### **규칙**:
- 공식 국가명 사용 (한글): "대한민국", "영국", "미국", "프랑스" 등
- 영문 표기 금지
- ISO 국가 코드 사용 가능 (선택적)

#### **표준 매핑**:
```json
{
  "대한민국": ["한국", "Korea", "South Korea", "대한민국"],
  "영국": ["UK", "United Kingdom", "영국"],
  "미국": ["USA", "United States", "미국", "America"],
  "일본": ["Japan", "일본"],
  "프랑스": ["France", "프랑스"]
}
```

---

### **2. 지역 (region)**
#### **규칙**:
- 제조국이 "대한민국"인 경우:
  - 시·도 단위 사용: "경기도", "충청남도", "제주특별자치도"
  - 시·군 단위 허용: "안동시", "경주시", "부안군"
  - 특정 지명: "내변산", "한산" (전통주 특화 지역)
  - **절대 금지**: "대한민국", "한국", "Korea" (제조국과 중복)

- 제조국이 "영국"인 경우:
  - 스코틀랜드 위스키: "스페이사이드", "아일라", "하이랜드", "로우랜드", "캠벨타운", "아일랜드(Islands)"
  - **절대 금지**: "영국", "스코틀랜드" (제조국과 중복)

- 제조국이 "미국"인 경우:
  - 주(State) 단위: "켄터키", "테네시", "캘리포니아"
  - **절대 금지**: "미국" (제조국과 중복)

- 제조국이 "프랑스"인 경우:
  - 와인 지역: "부르고뉴", "보르도", "샴페인", "론", "샤블리"
  - **절대 금지**: "프랑스" (제조국과 중복)

- **미상**: 지역 정보 없으면 `null` 또는 빈 문자열

#### **표준 매핑** (한국):
```json
{
  "경기도": ["경기", "경기도"],
  "충청남도": ["충남", "충청남도"],
  "충청북도": ["충북", "충청북도"],
  "전라북도": ["전북", "전라북도"],
  "전라남도": ["전남", "전라남도"],
  "경상북도": ["경북", "경상북도"],
  "경상남도": ["경남", "경상남도"],
  "강원도": ["강원", "강원도"],
  "제주특별자치도": ["제주", "제주도"]
}
```

---

### **3. 증류소/제조사 (distillery)**
#### **규칙**:
- 법인 형태 제거:
  - `주식회사` → 제거
  - `㈜` → 제거
  - `농업회사법인` → 제거
  - ` 유한회사` → 제거
  - ` (주)` → 제거
  - `CO., LTD.` → 제거 (선택적)
  - `INC.` → 제거 (선택적)

- 브랜드명 우선:
  - ❌ "㈜한라산" → ✅ "한라산"
  - ❌ "주식회사 기원 위스키 증류소" → ✅ "기원 위스키 증류소"
  - ❌ "농업회사법인(주)흥진담은" → ✅ "흥진담은"

- 수출입사 검증:
  - 제조국과 매치 확인
  - "Korea", "무역", "Trading", "Distribution" 키워드 체크
  - 의심 시 `metadata.importer`로 이동

#### **수출입사 키워드** (AI 체크리스트):
```
["수입", "수출", "무역", "Trading", "Distribution", "Import", "Export",
 "International", "Global", "Korea", "코리아", "인터내셔널"]
```

---

### **4. 병입자 (bottler)**
#### **규칙**:
- Independent Bottler(IB) 전용
- Official Bottling(OB)인 경우 `null`

#### **IB 예시**:
```
- "Gordon & MacPhail"
- "Signatory Vintage"
- "Douglas Laing"
- "Cadenhead's"
```

---

### **5. 도수 (abv)**
#### **규칙**:
- 0 < ABV < 100 (퍼센트 단위)
- 소수점 2자리까지 허용
- 비정상 값:
  - ABV > 100 → AI가 재추론 또는 `null`
  - ABV < 0 → `null`

---

## 🤖 Database Audit AI 구현 계획

### **Phase 1: Published 데이터 일괄 감사**
```python
# scripts/audit_database.py

1. Firestore에서 isPublished=true 데이터 전체 로드 (741개)
2. 각 제품당 AI 호출 (Gemini 2.0 Flash):
   - Input: 제품 전체 정보 (name, category, country, region, distillery, abv, ...)
   - Output: 정규화된 JSON
   {
     "country": "대한민국",
     "region": "경기도" | null,
     "distillery": "기원 위스키 증류소",
     "bottler": null,
     "abv": 43.0,
     "metadata": {
       "importer": "㈜수출입사" | null
     },
     "corrections": [
       "법인 형태 제거: '주식회사 기원 위스키 증류소' -> '기원 위스키 증류소'",
       "지역 중복 제거: '대한민국' -> null"
     ]
   }

3. AI 응답 검증
4. Firestore 업데이트 (배치 처리)
5. 감사 로그 저장
```

### **Phase 2: 파이프라인 통합**
```python
# scripts/run_pipeline.py 수정

기존: Raw Data → AI Enrichment → Firestore (status: ENRICHED)
추가: → Database Audit AI → Firestore (status: AUDITED)

새 플로우:
1. Raw Data Fetch
2. AI Enrichment (10개 배치)  ← 기존
3. Database Audit AI (1개씩)  ← 신규
4. Firestore Upload
```

### **Phase 3: 정기 감사**
- 주 1회 자동 감사 (Cron Job)
- 새로 추가된 published 데이터만 감사

---

## 📝 AI Prompt 설계

### **System Instruction**
```
You are a database normalization expert specializing in spirits (alcohol) data.
Your role is to:
1. Standardize country, region, distillery, bottler, and ABV fields
2. Remove corporate legal forms (e.g., "주식회사", "CO., LTD.")
3. Detect and separate importers from distilleries
4. Ensure region does NOT duplicate country
5. Validate ABV is within 0-100 range

Always respond in JSON format with the normalized fields and a corrections log.
```

### **User Prompt Template**
```
Please normalize the following spirit data:

Name: {name}
Category: {category}
Current Country: {country}
Current Region: {region}
Current Distillery: {distillery}
Current Bottler: {bottler}
Current ABV: {abv}

Rules:
1. Country: Use official Korean name (e.g., "대한민국", "영국", "미국")
2. Region:
   - For Korea: Use province (e.g., "경기도", "제주특별자치도") or city/county
   - For Scotland: Use whisky region (e.g., "스페이사이드", "아일라")
   - For USA: Use state (e.g., "켄터키", "캘리포니아")
   - NEVER duplicate country
3. Distillery:
   - Remove "주식회사", "㈜", "농업회사법인", "CO., LTD.", "INC."
   - If suspected importer, move to metadata.importer
4. Bottler: Only for Independent Bottlers, otherwise null
5. ABV: Must be 0-100, else null

Respond in JSON:
{
  "country": "...",
  "region": "..." | null,
  "distillery": "...",
  "bottler": "..." | null,
  "abv": 43.0 | null,
  "metadata": { "importer": "..." | null },
  "corrections": ["..."]
}
```

---

## 🔄 실행 계획

### **Step 1: 현재 데이터 백업**
```bash
# Firestore 전체 백업
gcloud firestore export gs://k-spirits-backup/$(date +%Y%m%d)
```

### **Step 2: Audit 스크립트 작성**
```bash
# scripts/audit_database.py
# 위 설계대로 구현
```

### **Step 3: Dry Run (테스트)**
```bash
python scripts/audit_database.py --dry-run --limit 10
```

### **Step 4: 전체 실행**
```bash
python scripts/audit_database.py --limit 741
```

### **Step 5: 감사 리포트 생성**
```bash
# data/audit_report_YYYYMMDD.json
{
  "total": 741,
  "corrected": 520,
  "unchanged": 221,
  "corrections": {
    "country": 15,
    "region": 350,
    "distillery": 280,
    "abv": 10,
    "importer_separated": 45
  }
}
```

---

## 💰 비용 추정

### **Gemini API (2.0 Flash)**
- 입력 토큰: ~500 토큰/제품
- 출력 토큰: ~300 토큰/제품
- 총 토큰: (500 + 300) × 741 = 592,800 토큰

**예상 비용**: 약 $0.30 ~ $0.50 USD

---

## 📊 Expected Results

### **Before**
```json
{
  "name": "기원 호랑이",
  "country": "대한민국",
  "region": "대한민국",
  "distillery": "주식회사 기원 위스키 증류소",
  "bottler": null,
  "abv": 43
}
```

### **After**
```json
{
  "name": "기원 호랑이",
  "country": "대한민국",
  "region": "경기도",
  "distillery": "기원 위스키 증류소",
  "bottler": null,
  "abv": 43.0,
  "metadata": {
    "auditDate": "2026-02-01",
    "corrections": [
      "법인 형태 제거: '주식회사 기원 위스키 증류소' -> '기원 위스키 증류소'",
      "지역 정규화: '대한민국' -> '경기도'"
    ]
  }
}
```

---

**작성일**: 2026-02-01  
**분석 대상**: Published 데이터 741개  
**다음 단계**: Audit 스크립트 구현
