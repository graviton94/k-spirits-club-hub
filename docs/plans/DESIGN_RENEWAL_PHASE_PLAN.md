# K-Spirits Total Design Renewal Plan (Phased)

## 1. Phase 0: Baseline Audit and Freeze (2-3 days)
### Goal
현재 디자인 상태를 수치화하고, 리뉴얼 기준선을 고정합니다.

### Work Items
1. 디자인 자산 인벤토리 수집: 색상, 타이포, 카드, 모달, 버튼, 배지.
2. 하드코딩 스타일 vs 토큰 스타일 분리 리포트 작성.
3. 화면별 텍스트 크기 분포 추출 (특히 8-10px 구간).
4. 모바일 주요 플로우 사용성 기록: 홈, 탐색, 상세, 월드컵, MBTI.

### Deliverables
1. Design Baseline Report
2. Token Violation List
3. Screen Priority Matrix (High/Medium/Low)

### Exit Criteria
1. 리뉴얼 대상 컴포넌트 우선순위 100% 확정
2. 배포 금지 구간(스타일 위험 구간) 합의 완료

---

## 2. Phase 1: Design Token Governance (4-5 days)
### Goal
전역 디자인 시스템을 단일 소스로 정리하고 스타일 편차를 줄입니다.

### Work Items
1. 색상 토큰 3계층 정리: Brand, Semantic, Data Visualization.
2. HEX/임의 Tailwind 색상 사용 영역을 토큰 기반으로 치환.
3. 그림자, 블러, 보더 반경 스케일 정의.
4. 컴포넌트별 허용 스타일 규칙 문서화.

### Deliverables
1. Token Spec v2
2. Color Mapping Table (old -> new)
3. Rulebook: Allowed Classes / Forbidden Patterns

### Exit Criteria
1. 신규 UI에서 하드코딩 색상 사용 0건
2. 핵심 페이지 색 체계 일관성 확보

---

## 3. Phase 2: Typography and Density System (3-4 days)
### Goal
고밀도 UI는 유지하면서 가독성을 개선합니다.

### Work Items
1. 최소 폰트 하한선 규정: 본문/인터랙션/메타 구간별.
2. 자간, 대문자 사용 강도 규칙화 (메타만 강한 자간 허용).
3. 컴팩트 모드 타이포 스케일 정의 (Desktop/Mobile 모두).
4. 배지/칩 텍스트 우선순위 규정 (정보량 대비 크기 최적화).

### Deliverables
1. Type Scale v2
2. Density Guide (Compact/Default)
3. Accessibility Readability Checklist

### Exit Criteria
1. 8-9px 사용 구간 대부분 제거
2. 모바일 가독성 이슈 재현 케이스 해결

---

## 4. Phase 3: Component Unification (5-7 days)
### Goal
화면별 개성은 유지하되 공통 구조를 통일합니다.

### Work Items
1. 카드 패턴 3종 표준화: Discovery, Detail, Social.
2. 모달 쉘 통합: 헤더/바디/액션/백드롭 규칙 일치.
3. 버튼 체계 통합: Primary, Secondary, Tertiary, Danger.
4. 배지/태그 시스템 통합: 상태 의미를 색상으로 일관화.

### Deliverables
1. Unified Component Library
2. Migration Checklist (by component)
3. Visual Regression Snapshot Set

### Exit Criteria
1. 핵심 UI 컴포넌트 재사용률 상승
2. 페이지 간 시각 언어 충돌 감소

---

## 5. Phase 4: High-Impact Page Retrofit (6-8 days)
### Goal
트래픽/전환에 영향 큰 화면부터 리뉴얼을 적용합니다.

### Priority Order
1. 홈
2. 탐색
3. 상세
4. 리뷰
5. 월드컵/MBTI/콘텐츠 허브

### Work Items
1. 페이지별 토큰 적용률 100% 달성.
2. CTA 대비/가시성 개선.
3. 정보 밀도 유지하면서 카드 내부 계층 정리.
4. 스크롤 집중 플로우에서 시각 노이즈 감소.

### Deliverables
1. Updated High-Impact Pages
2. Before/After Design Diff
3. QA Notes per Page

### Exit Criteria
1. 핵심 여정 이탈 감소 지표 개선 준비 완료
2. 브랜드 통일성 체감 향상

---

## 6. Phase 5: Mobile-First Interaction Optimization (4-5 days)
### Goal
모바일에서 조작 피로를 줄이되 고밀도 정보 구조는 유지합니다.

### Work Items
1. 터치 타겟 최소 규격 통일.
2. 하단 내비 라벨 가시성 정책 개선.
3. 월드컵 가로 배치 유지 + 조작 피로 저감 튜닝.
4. 모달 높이/스크롤/키보드 대응 안정화.

### Deliverables
1. Mobile Interaction Spec
2. Gesture/Scroll Stress Test Results
3. Device Matrix Validation Report

### Exit Criteria
1. 모바일 주요 화면 사용성 이슈 감소
2. 고밀도 UI에서도 입력/탐색 오류율 개선

---

## 7. Phase 6: QA, Metrics, and Rollout (3-4 days)
### Goal
정량/정성 검증 후 점진 배포로 리스크를 통제합니다.

### Work Items
1. 시각 회귀 테스트 실행.
2. UX 지표 추적: 체류, 이탈, 클릭률, 스크롤 깊이.
3. A/B 또는 점진 배포(예: 20% -> 50% -> 100%).
4. 사용자 피드백 수집 후 미세 조정.

### Deliverables
1. Rollout Dashboard
2. KPI Delta Report
3. Post-Launch Improvement Backlog

### Exit Criteria
1. 성능/디자인 회귀 없음
2. KPI 악화 없이 전면 배포 완료

---

## 8. 운영 원칙 (전 페이즈 공통)
1. 밀도는 유지하되 읽기 불가능한 마이크로 타이포는 제거.
2. 신규 화면은 토큰 기반만 허용, 예외는 사전 승인.
3. 페이지 개성은 허용하되 구조 계층은 표준 패턴 재사용.
4. 시각적 화려함보다 정보 전달 우선순위를 명확히 유지.

---

## Suggested Timeline
1. 총 4-6주 (병렬 작업 시 3-4주 가능)
2. Week 1: Phase 0-1
3. Week 2: Phase 2-3
4. Week 3-4: Phase 4-5
5. Week 5: Phase 6 + 안정화
6. Week 6: 후속 개선 스프린트

---

## Next Step (Optional)
원하면 다음 문서로 바로 연결 가능합니다.
1. 페이즈별 Jira/Linear 티켓 템플릿
2. 컴포넌트별 마이그레이션 체크리스트
3. 화면별 Before/After QA 시나리오
