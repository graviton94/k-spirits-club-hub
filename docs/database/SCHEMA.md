# 📊 K-Spirits Club - Relational Database Schema

**Architecture:** Firebase Data Connect (managed PostgreSQL)  
**Last Updated:** 2026-04-21

---

## 🏗️ Core Entities

### 1. `User` (사용자)
가입된 사용자 정보 및 미각 프로파일 저장.
- `id`: Unique Identifier (Auth UID)
- `nickname`: 사용자 닉네임 (`varchar(100)`)
- `role`: 권한 계층 (`USER` | `ADMIN`)
- `tasteProfile`: AI 취향 분석 결과 (JSON)

### 2. `Spirit` (주류 제품)
핵심 주류 데이터베이스.
- `name` / `nameEn`: 제품명 (한/영)
- `category` / `categoryEn`: 카테고리 (한/영)
- `abv` / `volume`: 도수 및 용량
- `noseTags` / `palateTags` / `finishTags`: AI 추출 테이스팅 태그
- `isPublished`: 상용 노출 여부 (Guard)
- `rating`: 평균 평점 (AI & User 집계)

### 3. `SpiritReview` (제품 리뷰)
사용자가 작성한 정성적 테이스팅 노트.
- `spirit`: Spirit 테이블 참조 (FK)
- `user`: User 테이블 참조 (FK)
- `rating`: 1-5 정수 평점
- `content`: 리뷰 내용
- `nose` / `palate` / `finish`: 개별 속성평가

### 4. `UserCabinet` (개인 술장)
사용자와 주류 간의 N:M 관계 맵핑.
- `user`: User 참조
- `spirit`: Spirit 참조
- `isFavorite`: 즐겨찾기 태그
- `notes`: 개인 메모

---

## 🛠️ Management & Infrastructure

### 5. `ModificationRequest` (정보 수정 요청)
사용자가 제보한 데이터 수정 요청 건.
- `status`: `pending` | `approved` | `rejected`

### 6. `AiDiscoveryLog` (AI 분석 로그)
Gemini 2.0 Flash를 통한 취향 분석 및 추천 이력.
- `messageHistory`: 대화 컨텍스트 (JSON)
- `recommendations`: 추천된 제품 리스트 (JSON)

---

## 🔐 Security & Constraints
- **Relational Integrity**: 모든 관계는 PostgreSQL 외래키(FK)로 보호됩니다.
- **Authorization**: GraphQL `@auth` 지시어를 통해 소유자(Owner) 또는 관리자(Admin)만 민감 데이터에 접근할 수 있도록 강제됩니다.
- **Timestamps**: `createdAt` 및 `updatedAt`은 서버 측(`request.time`)에서 자동으로 할당됩니다.
