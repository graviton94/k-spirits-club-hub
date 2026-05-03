# 배포 후 액션 체크리스트

## 즉시 실행 (배포 후 5-10분)

- [ ] **두 URL이 정상 로드되는지 확인**
  ```
  https://kspiritsclub.com/ko/spirits/kspt-ce5umczj
  https://kspiritsclub.com/ko/spirits/fsk-202200020652
  ```

- [ ] **브라우저 DevTools > Network > Response Headers에서 `robots` 메타 태그 확인**
  - NOINDEX 태그가 사라졌는지 확인
  ```html
  <!-- ❌ 예상되지 않음 -->
  <meta name="robots" content="noindex, follow">
  
  <!-- ✅ 정상 (또는 태그 없음) -->
  <!-- robots 메타 태그 없음 또는 index 허용 -->
  ```

---

## 24시간 내 실행 (자동 재크롤링)

- [ ] **Sitemap 자동 revalidate 확인**
  - `revalidate = 86400` (24시간) 설정됨
  - 다음 크롤링 시 자동으로 sitemap 갱신

- [ ] **Google Search Console에서 두 URL 재테스트**
  1. https://search.google.com/search-console 접속
  2. "URL 검사" 또는 "URL 테스트" 클릭
  3. 각 URL 입력:
     - `https://kspiritsclub.com/ko/spirits/kspt-ce5umczj`
     - `https://kspiritsclub.com/ko/spirits/fsk-202200020652`
  4. 테스트 결과 확인:
     - ❌ "페이지 공개 상태: 페이지 색인을 생성할 수 없음"은 **사라져야 함**
     - ✅ "색인 생성 권장" 메시지 나타나야 함

---

## 48시간 내 실행 (Google 재크롤링)

- [ ] **Google에 색인 생성 권장**
  1. Search Console > "색인 생성 요청" 또는 "색인화 생성" 버튼 클릭
  2. 두 URL 각각에 대해 수행

- [ ] **Sitemap 재제출 요청 (선택사항)**
  1. Search Console > Sitemaps
  2. https://kspiritsclub.com/sitemap.xml 확인
  3. "재크롤링 요청" 클릭

---

## 모니터링 (지속적)

- [ ] **Search Console 모니터링**
  - 2-3일 후: "색인됨" 상태로 변경 확인
  - 검색 결과에 노출되기 시작

- [ ] **Production 로그 확인**
  - `[SpiritRobots]` 로그에서 새 spirits의 indexable 상태 확인
  - Dev 환경에서만 출력되도록 설정됨

- [ ] **Sitemap 로그 확인**
  ```
  [Sitemap] Fetched XXXX spirit entries from Data Connect
  [Sitemap] Published: XXXX, Tier A: XXXX, Tier B: 0
  ```

---

## 예상되는 결과

| 단계 | 시간 | 상태 |
|------|------|------|
| 배포 직후 | 즉시 | NOINDEX 메타 태그 제거 ✅ |
| Sitemap 재생성 | 24시간 | 새 sitemap 생성 (Tier A) ✅ |
| Google 재크롤링 | 48-72시간 | URL 인정됨 (색인 생성 중) |
| 최종 색인 | 1-2주 | 검색 결과 노출 ✅ |

---

## 문제 발생 시 롤백 계획

만약 문제가 발생하면:

1. **즉시 확인**
   - Sitemap 로그에서 `Tier B` 항목 증가 확인?
   - 콘솔 에러 발생?

2. **롤백 (필요시)**
   - Git revert `lib/utils/indexable-tier.ts` 변경 사항
   - 배포 재진행

3. **근본 원인 분석**
   - 데이터 저장 필드명 오류?
   - 쿼리 응답 필드명 오류?

---

## 참고 자료

- **고정된 파일**: 
  - `lib/utils/indexable-tier.ts` - 필드명 매핑 수정
  - `app/sitemap.ts` - 로깅 개선

- **진단 문서**: 
  - `INDEXING_FIX_REPORT.md` - 상세 분석

- **관련 쿼리**:
  - `dataconnect/main/queries.gql` - `listSpiritsForSitemap`
  - `lib/db/data-connect-admin.ts` - `dbAdminUpsertSpirit`

---

**최종 확인**: 배포 후 24시간 내에 Google Search Console에서 두 URL을 재테스트하여 "색인 생성 권장" 상태 확인 완료
