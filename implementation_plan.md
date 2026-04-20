# Phase 2-4: System Resurrection (Logic & UX Normalization)

Phase 1.5 데이터 이관이 완료됨에 따라, 적재된 데이터를 올바르게 제어하고 표시하기 위한 백엔드/프론트엔드 로직 전면 정상화 작전입니다.

---

## 🛡️ [Phase 2] Security & Logic Guardrails

### 2.1 미발행 제품 노출 원천 차단 (Public Guard)
- **[MODIFY] [spirit-page-resolver.ts](file:///c:/k-spirits-club-hub/lib/utils/spirit-page-resolver.ts)**: 
    - `resolveSpiritPageState` 내부에 `if (!sqlSpirit.isPublished) return { status: 'NOT_FOUND', ... }` 가드를 추가합니다.
- **[MODIFY] [page.tsx](file:///c:/k-spirits-club-hub/app/[lang]/spirits/[id]/page.tsx)**:
    - 서버 컴포넌트 레벨에서 `NOT_FOUND` 상태일 때 즉시 `notFound()`를 호출하도록 보강합니다.

### 2.2 정보량 기반 동적 별점 엔진 (Dynamic Rating Engine)
- **[MODIFY] [gemini-translation.ts](file:///c:/k-spirits-club-hub/lib/services/gemini-translation.ts)**:
    - `calculateDynamicEditorRating(data)` 함수 신설.
    - **가중치 로직**: 한국어 설명 길이(1.0), 영어 설명 유무(0.5), 향미 태그 개수(1.5), 페어링 가이드 유무(1.0) 등을 합산하여 3.0~5.0 사이의 float 값 산출.
- **[MODIFY] [spirits.ts](file:///c:/k-spirits-club-hub/app/[lang]/actions/spirits.ts)**:
    - `publishSpiritAction` 및 `updateSpiritAction` 시 위 엔진을 호출하여 `spirit.rating` 필드를 자동 업데이트합니다.

---

## 🖥️ [Phase 3] Admin State Sync & UX

### 3.1 Admin 팝업 실시간 동기화 (Fresh Data Fetch)
- **[MODIFY] [AdminSpiritCard.tsx](file:///c:/k-spirits-club-hub/components/admin/AdminSpiritCard.tsx)**:
    - 수정(Edit) 버튼 클릭 시, 부모로부터 전달받은 Props가 아닌 `getSpiritById` 서버 액션을 **직접 호출**하여 DB의 최신 스냅샷을 가져옵니다.
    - 로딩 중 스피너 노출로 UX를 개선합니다.
- **[MODIFY] [spirits.ts](file:///c:/k-spirits-club-hub/app/[lang]/actions/spirits.ts)**:
    - 모든 쓰기 작업 후 `revalidatePath('/[lang]/admin/spirits', 'page')`를 실행하여 어드민 대시보드 리스트를 강제 갱신합니다.

### 3.2 모바일 Focus/Close 버그 픽스 (Scroll Lock)
- **[MODIFY] [AdminDashboard](file:///c:/k-spirits-club-hub/app/[lang]/admin/page.tsx)**:
    - `editingId` 또는 `isCreating`이 true일 때 `useEffect`를 통해 `document.body.style.overflow = 'hidden'`을 적용합니다.
    - 모바일 가상 키보드 팝업 시 배경 스크롤로 인한 튕김 현상을 원천 차단합니다.

---

## 🧹 [Phase 4] Public UI Integration & Legacy Purge

### 4.1 메인 페이지 리뷰 소스 스위치오버 (Reviews Join)
- **[MODIFY] [route.ts](file:///c:/k-spirits-club-hub/app/api/reviews/route.ts)**:
    - `reviewsDb.getRecent()`를 `dbListSpiritReviews()`로 교체합니다.
    - **GraphQL Optimization**: User 테이블과 Join하여 닉네임, 프로필 이미지를 한 번의 쿼리로 가져오도록 쿼리문을 최적화합니다.

### 4.2 Operation "Clean Slate" (Firestore SDK 제명)
- **[DELETE] [firestore-rest.ts](file:///c:/k-spirits-club-hub/lib/db/firestore-rest.ts)**:
    - 프로젝트 내 모든 Firestore REST API 호출 유틸리티를 삭제합니다.
- **[MODIFY] [Global Utility Check]**:
    - `grep`을 통해 남아있는 `firebase/firestore`, `getDocs`, `doc` 등의 잔재를 전량 색출하여 `data-connect-client.ts` 기반으로 교체하거나 삭제합니다.

---

## 🧪 Verification Plan
1. **Security**: 미발행 제품 ID로 접속 시 404가 뜨는지 브라우저 테스트.
2. **Logic**: 제품 설명 수정 후 에디터 별점(Rating)이 수치에 따라 동적으로 변하는지 확인.
3. **UX**: 모바일 뷰포트에서 수정 팝업 진입 시 스크롤 잠금 확인.
4. **Purge**: `npm run build`를 통해 Firestore SDK 참조 오류가 없는지 확인.
