---
name: k-spirits-gemini-safety-check
description: Gemini 프롬프트 구조/출력 계약 점검 및 개선
argument-hint: scope=<검토 범위>, objective=<개선 목표>
---

검토 대상:
- scope: ${input:scope:aiPromptBuilder 전체 또는 특정 함수}
- objective: ${input:objective:정확도/일관성/토큰 최적화 등}

실행:
1. 현재 프롬프트 구조를 분해한다.
2. Audit -> Sensory -> Pairing 흐름 보존 여부를 판단한다.
3. 출력 JSON 파싱 안정성(필드 누락/타입 변동)을 점검한다.
4. ko/en 설명 정합성 리스크를 점검한다.
5. 필요 시 최소 수정안(diff 중심)을 제안한다.

출력:
- 리스크 목록 (Critical/High/Medium)
- 계약 파손 여부 (Breaking/Non-Breaking)
- 적용 가능한 최소 수정안
