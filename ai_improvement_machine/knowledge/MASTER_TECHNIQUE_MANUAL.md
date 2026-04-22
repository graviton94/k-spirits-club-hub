# AI Improvement Machine: Master Technique Manual

This manual distills the redundant "flavor text" from the READMEs into a hard-hitting set of techniques for Antigravity's project execution.

## 1. Context Bundling (Repomix)
- **Signature Compression**: Use `repomix --compress` to extract only class/function signatures. This allows me to see the *entire* workspace architecture in < 50k tokens.
- **Incremental Context**: Use `git ls-files` with `repomix --stdin` to bundle only the files relevant to the current feature branch.
- **Instruction Injection**: Use `--instruction-file-path` to tell the bundle "Focus on how Data Connect mutations are structured".

## 2. Structural Navigation (Graphify)
- **God Nodes**: Identify the "God Nodes" (e.g., `Spirit`, `User`) that anchor the relational schema.
- **Semantic Similarity**: Use `graphify query` to find "conceptually linked" files that don't have direct imports (e.g., matching frontend components to backend mutations).
- **The "Why" Extraction**: Look for `rationale_for` nodes in the graph to understand architectural decisions without reading every line of code.

## 3. Relational Auditing (SQLLineage)
- **Mutation Lineage**: Extract the SQL from `dataconnect-generated/index.ts` and run it through `sqllineage -l column`.
- **Data Flow Mapping**: Map how `Spirit.id` flows from the `Spirit` table to the `SpiritReview` foreign key.
- **Safety Checks**: Before deleting any field, run a lineage audit to ensure no hidden "Intermediate Tables" or "Target Tables" depend on it.

## 4. Agentic Resilience (OpenHarness/ohmo)
- **Persistent Memory**: Maintain a `SESSION_LOG.md` (soul.md style) to track "Mental States", "Pending Decisions", and "Environment Gotchas".
- **Tool-Call Cycle**: Emulate the "oh setup" flow for external integrations, ensuring a structured "Dry-Run" before execution.
- **Multi-Agent Coordination**: If a task is too big, simulate a "Subagent Spawn" by creating a dedicated `task.md` for a specific sub-component and finishing it before returning to the main loop.

## 5. Premium Design (Awesome Design Systems)
- **WOW Rule #1**: Never use browser default colors. Use curate HSL palettes.
- **WOW Rule #2**: Typography is 80% of design. Use Outfit or Playfair Display for headers.
- **WOW Rule #3**: Micro-animations (hover scales, fade-ins) are non-negotiable for "Premium" feel.

---
*This manual is the "Inner Thought" system for the K-Spirits Club Hub agent.*
