# 🤖 Database Audit AI - Usage Guide

## 📋 개요
Published 데이터의 제조국, 지역, 증류소, 병입자, ABV 필드를 AI로 자동 정규화합니다.

---

## 🚀 사용법

### **1. 분석 (현재 상태 확인)**
```bash
npm run analyze
```
- Published 데이터 통계 생성
- 문제점 식별 (중복, 불일치, 비정상 값)
- `data/analysis_report.json` 생성

---

### **2. Dry Run (테스트 실행)**
```bash
npm run audit -- --dry-run --limit 10
```
- 실제 업데이트 없이 시뮬레이션
- 처음 10개 제품만 처리
- AI 로직 확인용

---

### **3. 소규모 실행 (100개 테스트)**
```bash
npm run audit -- --limit 100
```
- 100개 제품 정규화
- Firestore 실제 업데이트
- 문제 발생 시 중단 가능

---

### **4. 전체 실행**
```bash
npm run audit
```
- 모든 Published 데이터 정규화 (741개)
- 예상 시간: 30-60분
- 예상 비용: $0.30 ~ $0.50 USD

---

### **5. 로컬 모드 (업로드 스킵)**
```bash
npm run audit -- --skip-upload --limit 50
```
- Firestore 업데이트 건너뛰기
- 감사 로그만 생성
- 안전한 테스트용

---

## 📊 출력 결과

### **콘솔 출력**
```
🤖 Database Audit AI
================================================================================
Mode: LIVE
Limit: 100
Upload: Enabled
================================================================================
🔍 Fetching published spirits from Firestore...
📊 Loaded 100 published spirits

🔄 Processing 100 spirits...

[1/100] 기원 호랑이 (fsk-2020000420450)
  📝 Corrections: 2
     - 법인 형태 제거: '주식회사 기원 위스키 증류소' -> '기원 위스키 증류소'
     - 지역 정규화: '대한민국' -> '경기도'
  ✅ Updated fsk-2020000420450

[2/100] 발렌타인 17년 (spirit_12345)
  ✓ No changes needed

...

💾 Audit log saved to: data/audit_report_20260201_223000.json

================================================================================
📊 Audit Summary
================================================================================
Total: 100
Processed: 100
Corrected: 68
Unchanged: 30
Errors: 2

Corrections by category:
  - country: 5
  - region: 42
  - distillery: 35
  - bottler: 0
  - abv: 3
  - importer_separated: 8
================================================================================
```

### **감사 로그 (JSON)**
```json
{
  "timestamp": "2026-02-01T22:30:00.123456",
  "total": 100,
  "processed": 100,
  "corrected": 68,
  "unchanged": 30,
  "errors": 2,
  "corrections": {
    "country": 5,
    "region": 42,
    "distillery": 35,
    "bottler": 0,
    "abv": 3,
    "importer_separated": 8
  },
  "details": [
    {
      "id": "fsk-2020000420450",
      "name": "기원 호랑이",
      "corrections": [
        "법인 형태 제거: '주식회사 기원 위스키 증류소' -> '기원 위스키 증류소'",
        "지역 정규화: '대한민국' -> '경기도'"
      ],
      "normalized": {
        "country": "대한민국",
        "region": "경기도",
        "distillery": "기원 위스키 증류소",
        "bottler": null,
        "abv": 43.0,
        "metadata": {
          "importer": null
        }
      }
    }
  ]
}
```

---

## 🔍 정규화 규칙

### **제조국 (country)**
- 공식 한글 명칭 사용
- 예: "대한민국", "영국", "미국", "프랑스"

### **지역 (region)**
- 한국: "경기도", "제주특별자치도", "안동시" 등
- 스코틀랜드: "스페이사이드", "아일라", "하이랜드"
- 미국: "켄터키", "테네시", "캘리포니아"
- **절대 금지**: 제조국과 동일한 값

### **증류소 (distillery)**
- 법인 형태 제거: "주식회사", "㈜", "CO., LTD." 등
- 브랜드명만 유지
- 수출입사로 의심되면 `metadata.importer`로 분리

### **병입자 (bottler)**
- Independent Bottler(IB)만 기록
- Official Bottling(OB)은 `null`

### **도수 (abv)**
- 0-100 범위 검증
- 비정상 값은 `null`

---

## ⚠️ 주의사항

1. **백업 필수**
   ```bash
   gcloud firestore export gs://k-spirits-backup/$(date +%Y%m%d)
   ```

2. **Dry Run 먼저 실행**
   - 전체 실행 전 반드시 `--dry-run --limit 10` 테스트

3. **API Rate Limit**
   - 0.5초 딜레이 적용됨
   - 너무 많은 데이터는 분할 처리

4. **에러 발생 시**
   - 감사 로그에 `errors` 카운트 확인
   - 해당 제품 수동 검토 필요

---

## 📈 예상 비용

| 데이터 양 | 토큰 수 | 예상 비용 |
|----------|---------|-----------|
| 10개 | 8,000 | $0.005 |
| 100개 | 80,000 | $0.05 |
| 741개 | 592,800 | $0.30 ~ $0.50 |

---

## 🛠️ 트러블슈팅

### **에러: "Invalid JSON response"**
- AI가 JSON 외 텍스트 포함
- 해결: `response_mime_type: 'application/json'` 설정됨

### **에러: "Rate limit exceeded"**
- Gemini API 할당량 초과
- 해결: `--limit` 로 분할 처리, 1시간 후 재시도

### **에러: "Firestore permission denied"**
- Firebase 인증 실패
- 해결: `.env.local` 확인

---

## 📚 관련 문서

- [DATABASE_NORMALIZATION_PLAN.md](../DATABASE_NORMALIZATION_PLAN.md) - 정규화 계획
- [data/analysis_report.json](../data/analysis_report.json) - 분석 결과

---

**Last Updated**: 2026-02-01
