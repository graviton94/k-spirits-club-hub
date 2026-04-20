# Project Flow & Architecture Report - K-Spirits Club Hub

**Last Updated:** 2026-04-21  
**Status:** 100% Relational Migration Complete (Operation Clean Slate)

---

## 1. Architectural Paradigm Shift
The project has successfully transitioned from a **NoSQL Document Store (Firestore)** to a **Relational SQL Architecture** powered by **Firebase Data Connect (PostgreSQL)**.

### Core Transition Metrics
- **Legacy Components:** `firestore-rest.ts`, `service-account.ts` (DECOMMISSIONED)
- **New Core Hub:** `lib/db/data-connect-client.ts` (UNIFIED SOURCE OF TRUTH)
- **Database Engine:** PostgreSQL (Serverless) via Firebase Data Connect.

---

## 2. Global Data Flow (High-Level)

### A. Public Discovery Flow
1. **User Request:** Accesses `/spirits/[id]` or Wiki.
2. **Resolution:** `spirit-page-resolver.ts` checks `isPublished` guard.
3. **Data Fetching:** Data Connect fetches relational data (Spirit + linked User Reviews).
4. **Rendering:** Next.js SSR with SEO metadata generated via `buildSpiritMetaDescription`.

### B. Administrative Content Lifecycle
1. **Creation/Edit:** Admin uses Dashboard (`app/[lang]/admin/page.tsx`).
2. **Validation:** GraphQL Mutation checks `@auth(expr: "auth.token.role == 'ADMIN'")`.
3. **AI Enrichment:** `enrichSpiritWithAI` (Gemini Flash 2.0) triggers discovery.
4. **Logic Consolidation:** `calculateDynamicEditorRating` evaluates data density (3.0–5.0).
5. **Persistence:** `dbUpsertSpirit` writes to SQL.

### C. User Engagement Flow (Cabinet & Reviews)
1. **Auth:** Firebase Auth provides JWT.
2. **Interaction:** User adds to Cabinet or Writes Review.
3. **Security:** GQL `@auth` enforces `auth.uid == vars.userId` (Owner-Based Access Control).
4. **Relational Links:** Reviews are linked via `spiritId` and `userId` foreign keys in PostgreSQL.

---

## 3. Operation Clean Slate: Final Stabilization Patches

Today's sprint finalized the migration with four key pillars of stability:

### 🛡️ Pillar 1: Relational Security Hardening
- Implemented strict server-side authorization directly in the GraphQL layer (`queries.gql` & `mutations.gql`).
- Administrative operations are locked to the verified Production Admin UID (`fiO8qf1PjLZAPBNcJmvy1cpqrY52`).
- Public data is sanitized; sensitive user information is never exposed.

### 🔌 Pillar 2: Unified Data Connectivity
- Consolidated all database interactions into `lib/db/data-connect-client.ts`.
- Removed all "Ghost Imports" of legacy Firestore SDKs.
- Standardized payload sanitization (`extractString`, `pickTranslation`) to handle AI-generated nested objects safely.

### 🧠 Pillar 3: Dynamic Intelligence Engine
- Stabilized `gemini-translation.ts` with a consolidated `calculateDynamicEditorRating` logic.
- The system now automatically differentiates between "Thin" and "Rich" content based on description length, tag diversity, and pairing depth.

### 💎 Pillar 4: Premium UI/UX Stabilization
- Fixed critical Admin Dashboard UX bugs (Scroll Lock cleanup).
- Standardized `spirit-page-resolver.ts` guards to ensure unpublished spirits do not leak into production sitemaps or public lists.
- Restored missing dependencies (`dropdown-menu`, `date-fns`) for dashboard stability.

---

## 4. Component Mapping (Communities)

According to the latest **Graphify Knowledge Graph**:
- **Community 2 (Data Connect Hub):** Centralized CRUD operations for the relational backend.
- **Community 31 (AI Discovery Hub):** Gemini-powered enrichment and rating orchestration.
- **Community 7 (Routing & API Hub):** Edge-runtime API routes handling reviews and taste analysis.
- **Community 39 (Migration Suite):** Historical scripts for SQL transition and cleaning.

---

## 5. Maintenance Guidelines
- **Schema Updates:** Always run `npx firebase-tools dataconnect:sdk:generate` after modifying `.gql` files.
- **Security Audit:** New GQL operations **must** include an `@auth` directive; do not rely solely on client-side logic.
- **AI Logs:** Monitor `AiDiscoveryLogs` in the SQL backend to verify enrichment quality.

---
**Verified by Antigravity AI Assistant**  
*Operation Clean Slate - Final Report*
