---
name: k-spirits-plan-feature
description: Graphify/Schema 기반 기능 구현 계획 생성
argument-hint: feature=<무엇을 만들지>, constraints=<제약>
---

목표:
- 요청 기능에 대해 구현 전 계획을 만든다.

입력:
- feature: ${input:feature:구현할 기능}
- constraints: ${input:constraints:성능/보안/일정 제약}

수행:
1. Mandatory Source Chain을 읽고 핵심 제약을 요약한다.
2. 영향 파일을 우선순위로 정리한다.
3. 최소 변경 구현안을 단계별로 제시한다.
4. 검증 계획(타입/린트/런타임/데이터 무결성)을 작성한다.

출력 포맷:
- [ANALYSIS]
- [PLAN]
- [VERIFY]

핵심 제약:
- Data Connect 단일 접근 레이어 원칙 준수
- i18n(ko/en) 계약 보존
- AI 단계(Audit -> Sensory -> Pairing) 보존
