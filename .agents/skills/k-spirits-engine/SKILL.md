---
name: k-spirits-engine
description: K-Spirits Master Orchestrator skill for graph-impact-first changes and strict Data Connect type-safe implementation with recovery-first safeguards.
---

# K-Spirits Engine Skill

Purpose: enforce project-safe implementation for K-Spirits by combining graph impact awareness with strict Data Connect type-safe execution.

## Core Identity
- Engine name: K-Spirits Master Orchestrator
- Primary objective: safe, minimal, reliable changes aligned to project guardrails.
- Mandatory order: Graph impact check -> Data Connect catalog check -> implementation -> pre-flight safety check.

## Canonical API Catalog (DB)
Treat the following as the only authoritative DB API surface:
- `lib/db/data-connect-client.ts`
- `dataconnect/main/queries.gql`
- `dataconnect/main/mutations.gql`
- `dataconnect/schema/schema.gql`

Hard rules:
- Do not introduce alternative DB clients or raw SQL in runtime paths.
- Do not edit generated SDK output manually.
- Any new DB behavior must map to GraphQL schema and typed wrapper usage.

## Capability 1: Graphify Blast Radius Report
Before non-trivial edits, always:
1. Read `graphify-out/GRAPH_REPORT.md`.
2. Identify likely affected communities, hubs, and dependent modules.
3. Output a short blast radius summary with:
- touched modules
- upstream/downstream impact
- regression hotspots
4. Then proceed with minimal code changes.

If a change crosses multiple domains (routing, DB, API, i18n), include a dependency path note referencing Graphify communities.

## Capability 2: Type-safe Data Connect Implementation
When DB logic is involved:
1. Confirm operation exists in `queries.gql` or `mutations.gql`.
2. Ensure schema alignment with `schema.gql`.
3. Use wrappers in `lib/db/data-connect-client.ts`.
4. Keep request/response mapping type-safe and deterministic.
5. Follow workflow:
- update gql
- generate SDK (`npx firebase dataconnect:sdk:generate`)
- update client wrappers
- deploy Data Connect (`npx -y firebase-tools@latest deploy --only dataconnect -f`) when needed

### Data Safety and Recovery
- Before any destructive mutation (delete or large-scale update), propose a backup query or recovery plan first.
- Do not execute destructive data changes without an explicit rollback path.
- The recovery proposal must include target scope, restoration source, and verification steps.

## Runtime and UX Guardrails
- Edge-safe code only for edge routes and shared runtime modules.
- i18n: no hardcoded KR/EN user copy.
- CLS: add stable skeleton/loading states for async render paths.

## Done Criteria
- Blast radius summary was produced before implementation.
- Data Connect catalog was treated as the sole DB API source.
- No Node-only runtime regressions introduced in edge paths.
- i18n and CLS constraints were preserved.
