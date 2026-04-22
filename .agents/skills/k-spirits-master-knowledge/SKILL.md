# K-Spirits Club Hub: Master Workspace Rules

This skill defines the mandatory architectural, technical, and operational rules for the K-Spirits Club Hub project. AI agents MUST adhere to these rules for all code modifications and reasoning.

## 🏗️ Core Identity & Mission
K-Spirits Club is a global spirits database and community platform. All features should prioritize **Global Scalability**, **Relational Integrity**, and **AI-Driven Personalization**.

## 🎯 Mandatory Technical Stack (2026 Standards)
AI agents must enforce these specific technologies:
1. **Frontend**: Next.js 15 (App Router, React 19), Tailwind CSS 4, Framer Motion.
2. **Backend**: Firebase Data Connect (PostgreSQL) - **LEGACY FIRESTORE SDK IS DEPRECATED**.
3. **Infrastructure**: Cloudflare Pages (Edge Runtime).
4. **AI**: Google Gemini 2.0 Flash (Sequential Enrichment Pipeline).

## 🛡️ Architectural Guardrails (Operation Clean Slate)
Before proposing any structural changes, agents MUST:
- **Rule 1**: Verify the relational schema in `dataconnect/schema/` and `docs/database/SCHEMA.md`.
- **Rule 2**: Check `PROJECT_FLOW.md` in `graphify-out/` to understand the current operational paradigm.
- **Rule 3**: Use `lib/db/data-connect-client.ts` as the sole unified data access layer.
- **Rule 4**: Enforce **Role-Based Access Control (RBAC)** using GQL `@auth` directives in `.gql` files. Admin UID: `fiO8qf1PjLZAPBNcJmvy1cpqrY52`.

## 🌐 Global & UX Standards
- **Middleware-Based i18n**: All routing must pass through `middleware.ts` for `ko/en` detection.
- **Performance First**: CLS (Cumulative Layout Shift) must be 0. Use Skeleton UIs and `wsrv.nl` image optimization.
- **Multi-Phase AI**: Always follow the sequence: `Audit` -> `Sensory` -> `Pairing` for data enrichment.

## 🛠️ Operational Workflow
1. **Research**: Always use `view_file` on core docs before suggesting changes.
2. **Context**: Use the `project-core-summary` and `data-and-api-architecture` Knowledge Items for historical context.
3. **Verification**: After modifying Data Connect schemas, always suggest running `npx firebase dataconnect:sdk:generate`.

> [!IMPORTANT]
> This skill is the **source of truth** for this workspace. Any deviation from these rules must be explicitly approved by the USER.
