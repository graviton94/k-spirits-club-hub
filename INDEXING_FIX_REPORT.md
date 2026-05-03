# Spirit Indexing Fix Report

## 문제 요약
- **영향받은 URL**:
  - `https://kspiritsclub.com/ko/spirits/kspt-ce5umczj`
  - `https://kspiritsclub.com/ko/spirits/fsk-202200020652`
- **오류**: Google Search Console "색인을 생성할 수 없음: 'NOINDEX' 태그에 의해 제외"
- **공통점**: 방금 admin에서 publish했음

## 근본 원인 분석

### 문제의 발생 흐름
1. Admin에서 spirit을 publish하면 **camelCase 필드**로 저장됨
   - `descriptionKo`, `descriptionEn`, `noseTags`, `pairingGuideKo` 등
   
2. Spirit 페이지 로드 시 `generateMetadata()` → `getSpiritRobotsMeta()` → `isIndexableSpirit()` 호출

3. **`lib/utils/indexable-tier.ts`의 `isIndexableSpirit()` 함수에서 버그 발생**:
   ```typescript
   // ❌ 이전 (snake_case 먼저 확인)
   const descKo = spirit.metadata?.description_ko || spirit.description_ko || '';
   ```
   - 실제 필드는 `descriptionKo` (camelCase)
   - snake_case 필드가 없으면 `undefined` → 길이 0으로 인식
   - 품질 신호 부족 → Tier B (NOINDEX) 판정

4. 결과: 페이지가 NOINDEX 메타 태그로 렌더링 → Google 색인 불가

### Sitemap은 정상이었던 이유
- `app/sitemap.ts`의 `isIndexableSpiritMeta()` 함수는 **camelCase 필드**를 사용해서 OK
- Sitemap에는 포함되었지만, 실제 페이지는 NOINDEX

## 적용된 수정

### 수정 1: `lib/utils/indexable-tier.ts`
```typescript
// ✅ 수정 후 (camelCase 우선)
const descKo = (spirit as any).descriptionKo 
            || (spirit as any).description_ko 
            || spirit.metadata?.description_ko 
            || '';
```
- camelCase 필드를 **우선** 확인
- 폴백으로 snake_case 및 metadata 구조도 지원
- 모든 sensory tag 필드도 동일하게 수정

### 수정 2: 디버그 로깅 추가
```typescript
// getSpiritRobotsMeta() 함수에서 개발 환경 시 상세 로그 출력
console.debug(`[SpiritRobots] id=${spirit.id} indexable=${indexable} descKoLen=${descKo.length} sensoryTags=${sensoryTagCount}`);
```

### 수정 3: Sitemap 로깅 개선
- quality signal 값을 변수화해서 디버깅 용이

## 배포 후 확인 절차

### 1. 브라우드 캐시 초기화 후 재테스트
```bash
# 두 URL 접속해서 NOINDEX 태그가 제거되었는지 확인
curl -i https://kspiritsclub.com/ko/spirits/kspt-ce5umczj | grep "robots"
```

### 2. Google Search Console에서 재테스트
1. Search Console > URL 검사
2. 두 URL 입력하여 "색인 생성 권장" 클릭
3. 기존 "noindex 감지" 오류가 사라졌는지 확인

### 3. Sitemap 재크롤링 요청
1. Search Console > Sitemaps
2. 기존 sitemap 삭제 후 재제출 (또는 Revalidate)
3. 두 spirit이 Tier A로 분류되는지 로그 확인

### 4. 배포 후 로그 확인
```bash
# Production 환경에서 developer logs 확인
# [Sitemap] Fetched XXXX spirit entries
# [Sitemap] Published: XXXX, Tier A: XXXX, Tier B: 0
```

## 기술적 세부사항

### 왜 이런 버그가 발생했는가?
- **DB 스키마**: PostgreSQL의 column은 snake_case로 정의 가능 (Data Connect 자동 매핑)
- **App 코드**: TypeScript에서는 camelCase 사용 (관례)
- **타입 불일치**: `isIndexableSpirit()` 함수가 snake_case를 가정함

### 방지 방법
1. CI/CD에 필드명 매핑 테스트 추가
2. Type system 강화 (strict property access)
3. 신규 기능 추가 시 indexable tier 체크 포함

## 성능 영향
- **긍정**: 새로운 published spirits이 Google에 색인될 수 있음
- **부정**: 없음 (기존 로직 개선만 해당)
- **배포 안전성**: 빌드 성공, sitemap 생성 정상

## 결론
- 근본 원인: 필드명 매핑 불일치 (camelCase vs snake_case)
- 해결책: `isIndexableSpirit()` 함수에서 camelCase 필드 우선 확인
- 상태: ✅ 수정 완료 및 빌드 성공

---
**수정 완료일**: 2026-05-04  
**빌드 상태**: ✅ Success  
**Sitemap 상태**: 1586 Tier A, 0 Tier B  
**배포 대기**: Yes
