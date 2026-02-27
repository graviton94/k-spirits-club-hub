import { SpiritCategory } from './types'

export const sojuDistilled: SpiritCategory = {
    slug: 'soju-distilled',
    emoji: '🍶',
    nameKo: '증류식 소주',
    nameEn: 'Distilled Soju',
    taglineKo: '쌀과 누룩으로 빚어낸 한국 전통의 정수',
    taglineEn: 'The traditional Korean spirit, distilled from rice and koji',
    color: 'amber',
    sections: {
        definition: "증류식 소주는 곡질·전분 원료를 누룩 또는 코지 등으로 발효한 뒤, 단식 증류기로 알코올과 향미 성분을 농축해 만드는 한국의 전통 증류주이다. 희석식 소주와 달리 원료 본연의 구수함과 발효 향이 살아있는 것이 특징이다.",
        history: "고려 시대 원나라로부터 증류 기술이 전래되어 '아락'이라 불리며 시작되었다. 안동 등 지역별 소주로 발전해왔으며, 최근에는 전통적 포트스틸 증류와 오크통 숙성 등 새로운 실험을 통해 프리미엄 주류 시장을 이끌고 있다.",
        classifications: [
            {
                name: "전통 누룩 소주 (Traditional Nuruk)",
                criteria: "재래 누룩을 사용하여 발효한 술밑을 증류",
                description: "누룩 특유의 다층적인 향과 곡물의 구수함, 은은한 산미와 발효 풍미가 공존하며 바디감이 두툼하다. 숙성될수록 버섯, 흙내 등의 복합미가 살아난다."
            },
            {
                name: "입국(코지) 소주 (Koji-based)",
                criteria: "단일 균주(코지)를 사용하여 정교하게 발효 제어",
                description: "향이 맑고 단정하며, 배나 사과 같은 산뜻한 과실 에스터가 또렷하게 드러나는 '클린'한 스타일이다. 현대적 프리미엄 소주의 주류를 이룬다."
            },
            {
                name: "상압 증류 (Normal Pressure)",
                criteria: "대기압 상태에서 증류하여 원료 향을 최대한 보존",
                description: "높은 온도의 증류로 끓는점이 높은 향 성분까지 동반되어, 묵직한 질감과 강한 개성을 지닌다. 구수한 곡물향이 특징이다."
            },
            {
                name: "감압 증류 (Vacuum)",
                criteria: "진공 상태에서 낮은 온도로 증류하여 잡미 제거",
                description: "열에 민감한 화사한 향을 보존하고 목넘김을 극도로 부드럽게 만든 스타일로, 현대적인 깔끔함을 지향한다."
            },
            {
                name: "숙성 / 캐스크 소주",
                criteria: "옹기 또는 오크 배럴에서 일정 기간 안정화 및 숙성",
                description: "옹기에서는 둥글고 매끄러운 통합감을, 오크에서는 바닐라와 스파이스 등 위스키적 뉘앙스를 얻는다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수",
                label: "ABV (%)",
                value: "20% ~ 53% (다양한 스펙트럼)",
                description: "전통적인 고도수 소주는 향의 농밀함이 뛰어나며, 저도수 제품은 부드러운 목넘김과 데일리 음용에 적합하도록 설계된다."
            },
            {
                metric: "풍미 밀도",
                label: "Flavor Intensity",
                value: "Moderate to Very High",
                description: "쌀의 도정률과 증류 방식에 따라 깔끔한 화이트 스피릿 느낌부터 묵직하고 구수한 누룩의 존재감까지 결정된다."
            },
            {
                metric: "질감",
                label: "Mouthfeel",
                value: "Velvety ~ Oily",
                description: "상압 증류 제품일수록 혀끝에서 느껴지는 점성과 오일리한 질감이 강해지며 중후한 피니시를 남긴다."
            },
            {
                metric: "감칠맛",
                label: "Umami",
                value: "Savory Grain Finish",
                description: "증류 후에도 남아있는 곡물의 아미노산 성분이 주는 은은하고 구수한 뒷맛을 나타낸다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "국산 쌀 (멥쌀 / 찹쌀)",
                description: "증류식 소주의 근간이다. 찹쌀 투입 비율에 따라 단맛의 응축도가 달라지며, 품질 좋은 쌀은 깨끗한 알코올 정체성을 만든다."
            },
            {
                type: "발효제",
                name: "전통 누룩 또는 입국 (Koji)",
                description: "전분을 당으로 분해하면서 꽃 향, 과일 향, 구수한 발효 향을 입히는 핵심 요소다. 균주에 따라 향의 방향이 결정된다."
            },
            {
                type: "숙성 요소",
                name: "숨 쉬는 옹기 (항아리)",
                description: "미세한 산소 접촉을 통해 알코올의 '각'을 깎아주고 맛을 둥글게 만들어주는 전통적인 숙성 방식이다."
            }
        ],
        manufacturingProcess: [
            {
                step: "담금",
                name: "이단 담금 및 발효",
                description: "효모를 배양한 밑술에 고두밥을 더해 정성껏 발효한다. 이 과정에서 아미노산과 에스터가 풍부하게 생성된다."
            },
            {
                step: "증류",
                name: "단식 증류 (소주고리/포트스틸)",
                description: "전통 소주고리나 현대적인 구리 단식 증류기를 사용하여 정성껏 원액을 추출하며 향의 정수를 포집한다."
            },
            {
                step: "숙성",
                name: "장기 옹기 숙성",
                description: "증류 직후의 거친 기운을 잠재우기 위해 최소 6개월 이상 숙성한다. 시간이 흐를수록 더 부드럽고 깊은 맛으로 완성된다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "작은 튤립형 테이스팅 잔 또는 전통 소주잔",
            optimalTemperatures: [
                {
                    temp: "16~20℃ (상온)",
                    description: "상압 증류 소주의 구수한 쌀 향과 누룩의 복합미가 가장 잘 드러나는 온도다."
                },
                {
                    temp: "8~12℃ (칠드)",
                    description: "깔끔한 감압 증류 소주의 산뜻한 향을 시원하게 즐기기 좋은 온도다."
                },
                {
                    temp: "40~45℃ (미온)",
                    description: "고도수 상압 소주를 따뜻하게 마시면 곡물의 풍미가 폭발적으로 확장된다."
                }
            ],
            methods: [
                {
                    name: "니트 (Neat)",
                    description: "원액 그대로 마실 때 소주 고유의 쌀 향과 누룩의 복합미를 가장 온전히 즐길 수 있다."
                },
                {
                    name: "온더락 (On the Rocks)",
                    description: "얼음을 넣어 마시면 고도수의 자극이 완화되면서 숨겨져 있던 은은한 과실 향이 시원하게 강조된다."
                },
                {
                    name: "오유와리 (Oyuwari)",
                    description: "따뜻한 물과 6:4 혹은 5:5로 섞으면 곡물의 구수함이 극대화되어 추운 날에 즐기기 좋다."
                },
                {
                    name: "소주 하이볼",
                    description: "탄산수와 레몬 슬라이스를 더해 청량하게 즐기는 방식으로, 감압 증류 소주와 잘 어울린다."
                }
            ]
        },
        flavorTags: [
            { label: "구수한 쌀향", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "산뜻한 과실향", color: "bg-rose-500/20 text-zinc-950 dark:text-rose-300" },
            { label: "누룩 발효향", color: "bg-stone-600/20 text-zinc-950 dark:text-stone-300" },
            { label: "클린/미네랄", color: "bg-sky-500/20 text-zinc-950 dark:text-sky-300" },
            { label: "오일리/질감", color: "bg-stone-500/20 text-zinc-950 dark:text-stone-300" },
            { label: "바닐라/나무향", color: "bg-amber-700/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "두툼한 삼겹살 및 목살 구이",
            "한우 구이 및 양념 불고기",
            "흰살 생선회 및 해산물 (감압 소주)",
            "감칠맛 나는 된장찌개/전골 요리",
            "장어 구이 및 기름진 생선 요리",
            "다양한 전류 (해물파전, 육전)"
        ],
        dbCategories: ['soju-distilled', 'korean-soju']
    }
}
