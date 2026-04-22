---
name: k-spirits-implement-minimal
description: 기존 스타일 유지 + 최소 수정 구현
argument-hint: task=<구현할 작업>, target=<대상 파일/모듈>
---

요청:
- task: ${input:task:구현/수정 요청}
- target: ${input:target:수정 대상 파일 또는 모듈}

지시:
- YAGNI 원칙으로 최소한의 라인만 수정한다.
- 인접 리팩터링 금지.
- 기존 스타일(들여쓰기/네이밍/패턴) 그대로 유지.
- 수정 후 관련 에러를 검증하고, 변경 범위 안에서만 수정한다.

필수 점검:
1. 데이터 접근이 `lib/db/data-connect-client.ts` 원칙을 지키는가
2. `middleware.ts` 및 dictionaries와 충돌 없는가
3. AI 관련이면 `lib/utils/aiPromptBuilder.ts`의 JSON 계약을 보존했는가

응답:
- 변경 요약
- 영향 파일
- 검증 결과
