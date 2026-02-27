import { SpiritCategory } from './types'

export const singleMalt: SpiritCategory = {
    slug: 'single-malt',
    emoji: '🥃',
    nameKo: '싱글 몰트 위스키 (Single Malt)',
    nameEn: 'Single Malt Whisky',
    taglineKo: '단일 증류소의 테루아와 장인정신이 빚어낸 액체 예술',
    taglineEn: 'The liquid art of a single distillery and its unique terroir',
    color: 'amber',
    sections: {
        definition: "싱글몰트 위스키란 하나의 증류소에서 100% 맥아 보리(malted barley)만을 원료로 당화·발효한 워트를 포트 스틸(pot still)로 증류하고, 오크 캐스크에서 숙성해 병입한 몰트 위스키를 말한다. ‘싱글(single)’은 단일 증류소를 뜻하며, 여러 증류소 원액을 섞는 블렌디드 위스키와 구분된다.",
        history: "몰트 위스키의 기원은 스코틀랜드와 아일랜드의 중세 증류 전통에서 출발해, 18~19세기 과세·면허 제도와 증류 기술의 정착을 거치며 현대적 형태로 발전했다. 1960년대 이후 증류소 브랜드가 ‘싱글몰트’라는 정체성을 전면에 내세우며 프리미엄 카테고리로 성장했으며, 현재는 캐스크 실험과 고도수/싱글캐스크 등 다양성이 핵심 매력으로 자리 잡았다.",
        classifications: [
            {
                name: "싱글 몰트 스카치 위스키 (Single Malt Scotch)",
                criteria: "스코틀랜드 내 단일 증류소, 100% 맥아 보리, 포트 스틸 증류, 최소 3년 이상 오크 숙성",
                description: "가장 대표적인 기준입니다. 지역(스페이사이드, 하이랜드, 아일라 등)과 증류기 형태, 캐스크 전략에 따라 향미 스펙트럼이 매우 넓게 나타납니다."
            },
            {
                name: "캐스크 스트렝스 (Cask Strength / CS)",
                criteria: "원액을 물로 희석하지 않고 캐스크에서 나온 도수 그대로 병입 (보통 55~65% ABV)",
                description: "향 성분이 농축되어 강렬한 아로마와 무게감이 특징입니다. 물 몇 방울로 향을 ‘열어’ 밸런스를 찾는 재미가 큰 스타일입니다."
            },
            {
                name: "싱글 캐스크 (Single Cask)",
                criteria: "단 하나의 캐스크에서 나온 원액만 병입 (다른 캐스크와 바팅 없음)",
                description: "캐스크 개별 차이가 그대로 드러나는 유일무이한 배치입니다. 동일 제품이라도 캐스크마다 향미가 달라 수집과 탐구 가치가 높습니다."
            },
            {
                name: "피티드 위스키 (Peated)",
                criteria: "맥아 건조 과정에서 피트(이탄) 연기를 사용해 스모크 성분 부여",
                description: "스모키, 메디시널, 해풍 같은 인상이 강화됩니다. PPM 수치는 맥아의 페놀량을 나타내며 스타일을 가늠하는 유용한 단서가 됩니다."
            },
            {
                name: "캐스크 피니시 (Cask Finish)",
                criteria: "주요 숙성 후 다른 종류의 캐스크(셰리, 와인, 럼 등)로 옮겨 추가 숙성",
                description: "전(前) 내용물의 잔향을 입혀 풍미 레이어를 확장합니다. 짧은 기간에 독특한 캐릭터를 덧칠할 수 있는 세밀한 공정입니다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수 (ABV)",
                label: "Strength",
                value: "40~46% (표준), 50~65% (CS)",
                description: "도수가 높을수록 향이 강렬하게 휘발되지만 자극도 커집니다. 46% 이상에서는 가수 시 향의 변화가 더욱 드라마틱합니다."
            },
            {
                metric: "피트 스모크 (PPM)",
                label: "Peatiness",
                value: "0 (Unpeated) ~ 50+ (Heavy Peat)",
                description: "수치가 높을수록 훈제향과 약취가 강해집니다. 증류 커트와 숙성 방식에 따라 ‘달콤한 스모크’부터 ‘드라이한 연기’까지 다양하게 표현됩니다."
            },
            {
                metric: "숙성 정보",
                label: "Age Statement",
                value: "NAS / 10~18년 / 21년+",
                description: "숙성은 오크 성분을 부여하고 거친 성분을 다듬습니다. 연수는 신뢰할 만한 지표이나, 캐스크 품질이 최종 맛의 더 큰 변수가 되기도 합니다."
            },
            {
                metric: "캐스크 영향도",
                label: "Cask Influence",
                value: "First-fill / Refill",
                description: "퍼스트필은 오크의 풍미(바닐라, 스파이스)가 진하게 배어 나오며, 리필은 증류소 본연의 과실 에스터를 더 깔끔하게 보여줍니다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "맥아 보리 (Malted Barley)",
                description: "비스킷, 시리얼, 견과 같은 몰트 바탕을 만듭니다. 킬닝 방식에 따라 고소함과 스모크의 성격이 결정됩니다."
            },
            {
                type: "발효제",
                name: "효모 (Yeast) & 양조수",
                description: "발효 중 과실 향(에스터)을 만들어내며, 물의 미네랄 성분은 증류주에 섬세한 질감 차이를 부여합니다."
            },
            {
                type: "숙성 도구",
                name: "오크 캐스크 (Oak Cask)",
                description: "바닐린, 락톤, 탄닌을 제공합니다. 버번, 셰리 등 이전 내용물의 성격이 위스키에 다층적인 향미를 입힙니다."
            }
        ],
        manufacturingProcess: [
            { step: "몰팅/당화", name: "제국 & 매싱", description: "보리를 발아시켜 효소를 활성화하고, 뜨거운 물로 당액(워트)을 추출하여 발효를 준비한다." },
            { step: "발효", name: "워시백 발효", description: "효모가 당을 알코올로 바꾸며 과실과 꽃 향의 전구체인 에스터를 생성하는 핵심 단계다." },
            { step: "증류", name: "팟 스틸 이중 증류", description: "구리 증류기에서 두 번 증류하여 순수한 하트(Hearts)만을 채취한다. 증류기 형태가 무게감을 좌우한다." },
            { step: "숙성/완성", name: "캐스크 숙성 & 바팅", description: "오크통에서 긴 시간을 보내며 성분을 안정화하고, 여러 통의 원액을 조합하여 하우스 스타일을 완성한다." }
        ],
        servingGuidelines: {
            recommendedGlass: "글렌캐런(Glencairn) 또는 튤립형 노징 글라스",
            optimalTemperatures: [
                {
                    temp: "18~22℃ (실온)",
                    description: "과실 향과 오크 풍미가 가장 균형 있게 휘발되며 스타일 차이가 선명하게 드러납니다."
                },
                {
                    temp: "18~22℃ + 가수",
                    description: "알코올 자극이 줄고 닫혀 있던 섬세한 꽃과 꿀 향이 열려 복합미가 살아납니다."
                }
            ],
            methods: [
                {
                    name: "니트 (Neat)",
                    description: "첨가물 없이 잔에 따라 향(Nosing)을 먼저 즐기고, 소량을 머금어 혀 전체로 질감과 피니시를 느끼는 가장 정석적인 방법이다."
                },
                {
                    name: "가수 (Water Addition)",
                    description: "상온의 생수를 한두 방울 떨어뜨리면 위스키의 표면장력이 깨지며 감춰진 에스터 성분이 폭발적으로 피어오르는 경험을 할 수 있다."
                },
                {
                    name: "하이볼 (Highball)",
                    description: "얼음과 탄산수를 1:3 비율로 섞어 몰트 본연의 고소함과 시트러스한 청량감을 가볍게 즐기는 방식으로, 식사와의 궁합이 뛰어나다."
                },
                {
                    name: "온더락 (On the Rocks)",
                    description: "커다란 구형 얼음 위에 부어 마시면 낮은 온도로 인해 알코올의 각이 줄어들고 부드러운 단맛과 묵직한 질감이 강조된다."
                }
            ]
        },
        flavorTags: [
            { label: "바닐라/카라멜", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "건포도/셰리", color: "bg-rose-600/20 text-zinc-950 dark:text-rose-300" },
            { label: "청사과/배", color: "bg-emerald-400/20 text-zinc-950 dark:text-emerald-300" },
            { label: "꿀/플로럴", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-300" },
            { label: "스모키/피트", color: "bg-stone-700/20 text-zinc-950 dark:text-stone-300" },
            { label: "해풍/브인", color: "bg-sky-500/20 text-zinc-950 dark:text-sky-300" }
        ],
        foodPairing: [
            "훈제 연어 및 신선한 굴",
            "스테이크 및 양갈비 구이",
            "숙성 체다 및 블루 치즈",
            "다크 초콜릿 및 테라미수",
            "견과류와 건과일 플래터"
        ],
        dbCategories: ['위스키']
    }
}
