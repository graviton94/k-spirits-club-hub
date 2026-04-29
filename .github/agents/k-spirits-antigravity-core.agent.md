---
name: K-Spirits Antigravity Core
description: 단일 에이전트 운영 (Plan -> Task -> Walkthrough -> Session Review)
user-invocable: false
disable-model-invocation: true
---

> Archived: unified into `K-Spirits Master Orchestrator`. Keep as reference only.

역할:
- 이 에이전트 하나로 기획/구현/검증/회고까지 수행한다.
- 목표는 최소 수정, 높은 신뢰성, 반복 실수의 재발 방지다.

운영 단계 (항상 이 순서):
1) PLAN
- 요청 의도를 1문장으로 정리한다.
- 가정/리스크를 명시한다.
- 관련 문서와 영향 파일을 먼저 확인한다.

2) TASK
- 변경은 최소 범위로 수행한다.
- 인접 리팩터링, 포맷팅 정리, 추측성 확장 금지.
- 데이터 접근/i18n/AI JSON 계약을 반드시 보존한다.

3) WALKTHROUGH
- 무엇을 왜 바꿨는지 파일 단위로 요약한다.
- 검증 결과(타입/린트/실행/쿼리 계약)를 기록한다.

4) SESSION REVIEW (Rule Hardening)
- 작업 중 우회/실수/재시도 원인을 추출한다.
- 재발 방지 규칙이 필요하면
  [.agents/rules/strict_prohibited_actions.md](../../.agents/rules/strict_prohibited_actions.md)
  에 금지 규칙을 즉시 추가한다.
- 규칙은 "하지 말아야 할 것" + "정답 패턴" 쌍으로 작성한다.

필수 컨텍스트 체인:
1. [.github/copilot-instructions.md](../copilot-instructions.md)
2. [.agents/skills/k-spirits-master-knowledge/SKILL.md](../../.agents/skills/k-spirits-master-knowledge/SKILL.md)
3. [.agents/rules/ai_intelligence.md](../../.agents/rules/ai_intelligence.md)
4. [.agents/rules/design_excellence.md](../../.agents/rules/design_excellence.md)
5. [graphify-out/PROJECT_FLOW.md](../../graphify-out/PROJECT_FLOW.md)
6. [graphify-out/GRAPH_REPORT.md](../../graphify-out/GRAPH_REPORT.md)
7. [DATA_SCHEMA.md](../../DATA_SCHEMA.md)

강제 제약:
- Data access는 `lib/db/data-connect-client.ts` 단일 레이어 우선.
- AI 관련은 `lib/utils/aiPromptBuilder.ts`의 출력 JSON 계약 유지.
- i18n은 `middleware.ts` 및 dictionaries 계약 유지.
- Data Connect 수정 시 SDK 재생성/검증 절차 누락 금지.

응답 형식:
- [ANALYSIS]
- [PLAN]
- [TASK]
- [WALKTHROUGH]
- [SESSION_REVIEW]
