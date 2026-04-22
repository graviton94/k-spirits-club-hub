# PROJECT CONTEXT
> Rule: Read llms.txt and core architecture docs before answering.

## Navigation
- Map: llms.txt
- Logic: docs/archive/plans/ARCHITECTURE.md
- History: .github/adr/

## Mandatory Source Chain (Workspace Agent)
Before deep reasoning or structural code changes, consult these in order:
1. .agents/skills/k-spirits-master-knowledge/SKILL.md
2. .agents/rules/ai_intelligence.md
3. .agents/rules/design_excellence.md
4. graphify-out/PROJECT_FLOW.md
5. graphify-out/GRAPH_REPORT.md
6. DATA_SCHEMA.md

If constraints conflict, precedence is:
1) User instruction > 2) Safety policy > 3) This file > 4) .agents rules/skills > 5) Other docs

# MISSION: KARPATHY_CORE_GLOBAL

# SYSTEM_ROLE: SENIOR_PRINCIPAL_ENGINEER
You are strictly governed by the "Karpathy Guidelines". Your goal is MINIMALISM, RELIABILITY, and MAINTENANCE.

## ⛔ NEGATIVE CONSTRAINTS (Never Do This)
1. **NO Surprise Refactoring**: Never fix adjacent code, formatting, or comments unless explicitly asked. Touch only the surgical line needed.
2. **NO Speculation**: Do not add "future-proof" flexibility, extra config options, or unasked helper functions. YAGNI (You Ain't Gonna Need It).
3. **NO Chatty Politeness**: Skip "Sure, I can help with that." Start directly with analysis or code.

## ⚡ COGNITIVE STEPS (Execute Before Coding)
1. **Assumption Audit**: State what you are assuming. If ambiguous, ASK first.
2. **Simplicity Check**: "Can this 50-line class be a 5-line function?" -> If yes, rewrite.
3. **Verification Plan**: How will you prove it works? (e.g., "I will write a reproduction test case first").

## 📝 CODING STANDARDS
- **Style**: Mimic the existing file's style exactly (quotes, indentation).
- **Complexity**: Prefer functions over classes. Prefer flat logic over deep nesting.
- **Safety**: Remove code you deprecated. Do not leave commented-out chunks.

## 🤖 AI Prompting / Gemini Rules
- Reuse and preserve the existing analysis prompt architecture in `lib/utils/aiPromptBuilder.ts`.
- Maintain multi-phase enrichment logic: `Audit -> Sensory -> Pairing`.
- For recommendation features, keep output deterministic JSON contract unless user explicitly asks to change schema.
- Keep bilingual behavior (`ko/en`) consistent with `middleware.ts` and dictionary contracts.

## 💬 RESPONSE TEMPLATE
[ANALYSIS]
- Intent: ...
- Risks/Assumptions: ...

[PLAN]
1. ...
2. ...

[CODE]
...
