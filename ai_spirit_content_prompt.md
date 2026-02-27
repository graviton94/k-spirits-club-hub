# 주류 백과사전 (Spirits Wiki) 데이터 수집 프롬프트 가이드

이 문서는 자료조사 전용 AI가 K-Spirits Club의 주류 백과사전에 들어갈 **14개 주종(위스키, 사케, 와인, 꼬냑 등)**의 상세 데이터를 수집하고, 정해진 스키마에 맞춰 생성할 수 있도록 안내하는 프롬프트(지시서)입니다. 

자료조사 AI에게 아래의 프롬프트 전문을 복사해서 전달하면 스키마에 완벽히 호환되는 데이터를 반환받을 수 있습니다.

---

## 📋 자료조사 AI 프롬프트 (그대로 복사해서 사용하세요)

```text
너는 세계 최고의 주류 전문가이자 데이터 엔지니어 역할을 맡습니다.
우리는 전 준 세계의 다양한 주종(위스키, 사케, 와인, 증류식 소주 등)을 다루는 '주류 백과사전(Spirits Wiki)'을 구축하고 있습니다.
아래 제공된 **TypeScript 인터페이스 구조**에 맞추어, 내가 요청하는 주종의 데이터를 완벽한 **JSON 형식**으로 작성해 주세요.

### 📝 데이터 구조 (TypeScript Schema)

```typescript
{
  // 1. 기본 정보
  "definition": string,     // "XX란 무엇인가?" (1~2문장으로 간결하고 명확하게 정의)
  "history": string,        // 해당 주종의 기원, 역사, 발전 과정 (2~3문장)

  // 2. 주종별 등급 및 분류 체계 (핵심)
  "classifications": [
    {
      "name": string,       // 예: "준마이 다이긴죠", "싱글 몰트", "V.S.O.P", "그랑 크뤼"
      "criteria": string,   // 예: "정미율 50% 이하", "최소 4년 오크 숙성"
      "description": string // 해당 분류의 특징에 대한 상세 설명
    }
  ],

  // 3. 객관적 맛/향 지표
  "sensoryMetrics": [
    {
      "metric": string,     // 지표명 (예: "당도/드라이함", "산도/바디감", "IBU", "SMV")
      "label": string,      // 표기 단위명 (예: "일본주도(SMV)", "타닌(Tannin)")
      "value": string,      // 수치 또는 단계 (예: "+4", "High", "30~50 IBU")
      "description": string // 수치가 의미하는 바 해석 (예: "+ 수치일수록 드라이함")
    }
  ],

  // 4. 핵심 원재료 및 발효제
  "coreIngredients": [
    {
      "type": string,       // 재료 구분 (예: "주원료", "발효제", "물", "숙성통")
      "name": string,       // 고유 명칭 (예: "야마다니시키", "보탄칼", "셰리 캐스크")
      "description": string // 해당 재료가 맛과 캐릭터에 미치는 영향
    }
  ],

  // 5. 특수 제조 및 가공 공정 (타임라인 순서대로)
  "manufacturingProcess": [
    {
      "step": string,       // 공정명 (예: "발효", "증류", "숙성", "블렌딩")
      "name": string,       // 고유 공법명 (예: "병행복발효", "단식 영동 증류", "솔레라 시스템")
      "description": string // 공법의 원리와 결과물에 미치는 영향
    }
  ],

  // 6. 최적의 음용 가이드
  "servingGuidelines": {
    "recommendedGlass": string, // 추천 잔 종류 (예: "화이트 와인 글라스", "글렌캐런 글라스")
    "decantingNeeded": boolean, // 디캔팅 또는 브리딩 권장 여부 (true/false)
    "optimalTemperatures": [
      {
        "temp": string,         // 예: "10~15℃ (레이슈)", "상온 (18~20℃)"
        "description": string   // 해당 온도에서 발현되는 향과 맛의 특징
      }
    ]
  },

  // 7. 직관적인 맛·향 태그
  "flavorTags": [
    {
      "label": string,      // 직관적 태그 (예: "바닐라/카라멜", "청사과/시트러스", "스모키/피트")
      "color": string       // Tailwind 색상 지정 (예: "bg-amber-500/20 text-amber-300 border-amber-500/30") 
                            // (주 조화색: amber(갈색), rose(적색), sky(청색), emerald(녹색), yellow(노란색), stone(회/검은색))
    }
  ],

  // 8. 푸드 페어링 추천
  "foodPairing": [ string ] // 문자열 배열 (예: ["굴/해산물", "육류 구이", "다크 초콜릿"])
}
```

### 🎯 작성 지침
1. **전문성**: 주류 마스터 클래스 교육 수준의 정확하고 깊이 있는 지식을 바탕으로 작성하세요.
2. **범용성 유지**: 위 스키마 형식의 JSON 하나만 완벽히 출력하세요. markdown 문법(```json ... ```)으로 감싸서 출력해 주세요.
3. **색상 코드 주의**: `flavorTags`의 `color` 값은 디자인 일관성을 위해 반드시 `bg-{color}-500/20 text-{color}-300 border-{color}-500/30` 패턴을 따라야 합니다. (예외: 돌/흙 향은 stone, 투명/물은 sky를 권장합니다.)

지금부터 **[여기에 요청할 주종 입력 (예: 사케, 위스키, 꼬냑)]** 카테고리에 맞는 JSON 구조 데이터를 생성해 주세요.
```
