# Antigravity Intelligence: Operational Rules

These rules define the "Deep Intelligence" of the Antigravity agent for the K-Spirits Club Hub project.

## 1. Architectural Sovereignty (Graphify)
- **Primary Source**: Before taking any major architectural action, ALWAYS read `graphify-out/GRAPH_REPORT.md`.
- **God Nodes**: Respect the "God Nodes" identified in the report. Any modification to these nodes requires a mandatory regression audit.
- **Structural Integrity**: Use `/graphify path` (or MCP queries) to trace dependencies if a change spans multiple components.

## 2. Context Resilience (AI Improvement Machine)
- **Reorientation**: At the start of a session or after complex tasks, check `ai_improvement_machine/reports/LATEST_REORIENTATION.md`.
- **Technique Mastery**: Always adhere to the logic in `ai_improvement_machine/knowledge/MASTER_TECHNIQUE_MANUAL.md`.
- **Bundling**: Prefer `Repomix --compress` for whole-project analysis to maintain high signal-to-noise ratio in context.

## 3. Persistent Memory (Session Continuity)
- **Mental Log**: Maintain `ai_improvement_machine/logs/SESSION_LOG.md` using the defined template.
- **Thought Loops**: If a task is interrupted, log the "Mental Chain" in the session log so it can be resumed precisely.

## 4. Operational Safety (Data Connect)
- **Lineage First**: Run a lineage audit (SQLLineage) before any schema change or field deletion in Data Connect.
- **Integrity**: Never perform an upsert without checking the `filterAllowedFields` mapping in the DB client.
