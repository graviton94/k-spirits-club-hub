# K-Spirits Club Hub - AI Assistant Instructions

This file defines the mandatory operational framework for this repository.

## ⚖️ Mandatory Workspace Rules
All AI agents **MUST** follow the **[Master Workspace Rules](file:///c:/k-spirits-club-hub/.agents/skills/k-spirits-master-knowledge/SKILL.md)**. This skill provides the definitive technical and architectural constraints for the project.

## 🏗️ Core Architecture (Post-Migration)
The project is 100% Relational SQL via **Firebase Data Connect (PostgreSQL)**. Legacy Firestore REST/SDK usage is strictly prohibited.

### Mandatory First Step
**BEFORE** any structural modification or deep reasoning, you **MUST** consult:
1. **[Master Knowledge Skill](file:///c:/k-spirits-club-hub/.agents/skills/k-spirits-master-knowledge/SKILL.md)**: Global operational rules.
2. **[PROJECT_FLOW.md](file:///c:/k-spirits-club-hub/graphify-out/PROJECT_FLOW.md)**: Current system paradigm and data flow.
3. **[DATA_SCHEMA.md](file:///c:/k-spirits-club-hub/DATA_SCHEMA.md)**: Primary database specification.

## 📚 Global Standards & Security
- **Data Access:** Centralized via `lib/db/data-connect-client.ts`.
- **Security:** Strict GQL `@auth` directives are required for all mutations.
- **i18n:** URL-based localization (`/ko`, `/en`) enforced via middleware.
- **AI Integration:** Multi-stage enrichment using Gemini 2.0 Flash.
- **Environment Management:** 
  - ALWAYS use [wrangler.jsonc](file:///c:/k-spirits-club-hub/wrangler.jsonc) `vars` for cloud variable declarations.
  - Deployment MUST use `npm run worker:deploy`.
  - All Cloudflare variables are managed as **"Variable" (Plaintext)**, NOT Secrets.

## 🛠️ Verification Checklist
- Run `npx firebase dataconnect:sdk:generate` after GQL schema changes.
- Ensure CLS 0 performance via Skeleton UI implementation.
- Validate all admin actions against UID `fiO8qf1PjLZAPBNcJmvy1cpqrY52`.
