# K-Spirits Club Hub - AI Assistant Instructions

This file contains core project knowledge and instructions for AI agents.

## 🏗️ Core Architecture (Post-Migration)
The project has been migrated from Firestore to a **Relational SQL Architecture** using Firebase Data Connect (PostgreSQL).

### Mandatory First Step
**BEFORE** performing any widespread file searches or architectural reasoning, you **MUST** read:
1. **[PROJECT_FLOW.md](file:///c:/k-spirits-club-hub/graphify-out/PROJECT_FLOW.md)**: Overall paradigm and data flow (Security, AI, UX).
2. **[GRAPH_REPORT.md](file:///c:/k-spirits-club-hub/graphify-out/GRAPH_REPORT.md)**: Visual knowledge graph summary.
3. **[GRAPH_DATA_SUMMARY.md](file:///c:/k-spirits-club-hub/graphify-out/GRAPH_DATA_SUMMARY.md)**: Structural mapping of God Nodes and Communities.

### Project Pillars
- **Database:** Pure Relational-SQL via Data Connect. Access via `lib/db/data-connect-client.ts`.
- **Security:** Strict GQL `@auth` directives (ADMIN/OWNER check). No legacy Firestore REST permitted.
- **AI Engine:** Multi-phase enrichment using Gemini 2.0 Flash (`lib/services/gemini-translation.ts`).

## 📚 Fast Context Access
For deep dive into specific modules, use the pre-compiled bundles in **[output/](file:///c:/k-spirits-club-hub/output/)**:
- `k_spirits_app.md`: Routing and UI logic.
- `k_spirits_lib.md`: Shared utilities and DB clients.
- `k_spirits_components.md`: UI component architecture.

## 🛠️ Global Standards
- **Relational Integrity:** Ensure all mutations follow the GQL schema and Data Connect types.
- **Security First:** Never expose administrative endpoints without role validation.
- **Performance:** Prioritize the use of pre-generated knowledge artifacts over expensive grep operations.
