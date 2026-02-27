import { SpiritCategory } from './types'

export const shochu: SpiritCategory = {
    slug: 'shochu',
    emoji: '🍶',
    nameKo: '쇼츄',
    nameEn: 'Shochu',
    taglineKo: '일본의 풍토와 원료의 개성이 빚어낸 정교한 증류주',
    taglineEn: 'The traditional Japanese spirit, reflecting terroir and ingredients',
    color: 'emerald',
    sections: {
        definition: "쇼츄(焼酎)는 고구마·보리·쌀·흑당 등 전분/당질 원료를 코지(누룩균)로 당화·발효한 뒤 증류해 만드는 일본의 전통 증류주다. 원료 고유의 향미를 살리는 ‘본격 쇼츄’와 깔끔한 맛의 ‘갑류 쇼츄’로 나뉘며, 물이나 온수에 희석해 식중주로 즐기는 문화가 발달해 있다.",
        history: "16세기 중반 일본 남부 규슈 지역을 중심으로 생산 기록이 확인되며, 류큐(오키나와)의 아와모리와 함께 독자적인 증류 문화를 형성했다. 근대화 과정에서 연속식 증류기가 도입되어 대중적인 갑류 쇼츄가 등장했고, 이후 각 지역의 농산물을 활용한 본격 쇼츄가 프리미엄 시장을 개척했다.",
        classifications: [
            {
                name: "본격 쇼츄 (Honkaku)",
                criteria: "단식 증류기를 통해 1회만 증류하여 원료의 개성을 보존",
                description: "고구마, 보리, 쌀 등 원료 본연의 향과 코지의 발효 특성이 온전히 살아있다. 첨가물 없이 원료의 풍미를 최대한 즐기는 정통 방식이다."
            },
            {
                name: "이모 쇼츄 (Sweet Potato / 고구마)",
                criteria: "주원료로 고구마(사쓰마이모)를 사용",
                description: "고구마 특유의 구수한 단내와 흙내, 묵직한 바디감이 특징이다. 상압 증류 시에는 로스티드한 향이, 감압 증류 시에는 시트러스한 향이 강조된다."
            },
            {
                name: "무기 쇼츄 (Barley / 보리)",
                criteria: "주원료로 보리를 사용",
                description: "견과류의 고소함과 토스트 같은 풍미가 중심이다. 감압 증류를 통해 극도로 깔끔하게 만든 스타일부터 상압 증류를 통해 오일리한 보리의 맛을 살린 스타일까지 다양하다."
            },
            {
                name: "코메 쇼츄 (Rice / 쌀)",
                criteria: "주원료로 쌀을 사용",
                description: "사케와 유사한 섬세한 곡물의 단맛과 화사한 긴죠향이 돋보인다. 깨끗한 질감 덕분에 섬세한 일식 요리와의 조화가 뛰어나다."
            },
            {
                name: "아와모리 (Awamori / 오키나와)",
                criteria: "오키나와 전통 방식으로 흑코지만을 사용하여 증류",
                description: "강렬한 바디감과 깊은 감칠맛이 특징이다. 3년 이상 숙성된 '쿠스(古酒)'는 바닐라와 초콜릿 같은 밀도 높은 아로마를 형성한다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수",
                label: "ABV (%)",
                value: "20% ~ 25% (표준) / 37%+ (원액)",
                description: "표준인 25도는 물이나 얼음과 섞었을 때 원료 향이 가장 잘 피어오르도록 설계된 도수다. 원액(겐슈)은 더 강력한 타격감을 준다."
            },
            {
                metric: "증류 압력",
                label: "Pressure",
                value: "Atmospheric (상압) / Vacuum (감압)",
                description: "상압은 풍부하고 구수한 전통적 스타일을, 감압은 가볍고 화사한 현대적 스타일을 완성한다."
            },
            {
                metric: "코지 영향도",
                label: "Koji Character",
                value: "Black / White / Yellow",
                description: "흑코지는 강력한 바디감을, 백코지는 산뜻함과 밸런스를, 황코지는 화려한 사케 같은 향을 담당한다."
            },
            {
                metric: "향의 지속력",
                label: "Finish Length",
                value: "Clean to Long Savory",
                description: "원료의 질감과 숙성 기간에 따라 깔끔하게 끝나는 스타일부터 긴 여운을 남기는 스타일까지 나뉜다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "지역 특산 농산물 (고구마, 보리, 쌀 등)",
                description: "산지 테루아를 반영한 신선한 원료가 쇼츄의 정체성을 결정짓는다."
            },
            {
                type: "발효제",
                name: "코지 (Koji, 누룩균)",
                description: "전분을 당으로 바꿀 뿐만 아니라 풍부한 유기산을 생성하여 감칠맛과 보존성을 높인다."
            },
            {
                type: "숙성용기",
                name: "전통 항아리 (카메) 및 오크통",
                description: "카메 숙성은 부드러운 목넘김을, 오크통 숙성은 호박색 빛깔과 바닐라 향의 레이어를 더한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "제국",
                name: "코지 배양",
                description: "증자한 곡물에 누룩균을 번식시켜 발효에 필요한 효소를 확보하고 배경 향을 조성한다."
            },
            {
                step: "발효",
                name: "1차 및 2차 발효",
                description: "밑술로 효모 성장을 돕고, 이후 주원료를 투입해 본격적으로 고유의 향미를 생성한다."
            },
            {
                step: "증류",
                name: "단식 증류",
                description: "압력과 온도 조절을 통해 맑은 알코올 원액을 추출하며 원료 향의 밀도를 정밀하게 설계한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "락 글라스, 세라믹 컵, 또는 튤립형 잔",
            optimalTemperatures: [
                {
                    temp: "5~10℃ (칠드/로크)",
                    description: "탄산과 믹싱하거나 얼음을 넣어 마실 때 청량감이 극대화되는 온도다."
                },
                {
                    temp: "15~25℃ (상온)",
                    description: "미즈와리 또는 니트로 마실 때 원료의 섬세한 향 레이어를 느끼기 좋다."
                },
                {
                    temp: "40~45℃ (온주)",
                    description: "오유와리로 즐길 때 고구마나 보리의 구수한 향이 가장 풍성하게 확산되는 구간이다."
                }
            ],
            methods: [
                {
                    name: "오유와리 (Oyuwari)",
                    description: "따뜻한 물(70℃ 내외)을 먼저 붓고 쇼츄를 섞는 방식(6:4 비율 권장). 구수한 향이 화려하게 피어오른다."
                },
                {
                    name: "로크 (On the Rocks)",
                    description: "얼음을 넣고 천천히 녹이며 마시는 방식. 시간에 따른 농도 변화와 차가운 질감을 즐기기 좋다."
                },
                {
                    name: "미즈와리 (Mizuwari)",
                    description: "상온수나 찬물과 섞어 마시는 방식. 미리 섞어 하룻밤 안정화(마에와리)하면 극강의 부드러움을 느낄 수 있다."
                },
                {
                    name: "소다와리 (Soda-wari)",
                    description: "탄산수와 섞어 청량하게 즐기는 하이볼 방식으로 보리 쇼츄와 궁합이 매우 뛰어나다."
                }
            ]
        },
        flavorTags: [
            { label: "구수한 고구마", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "토스티/보리", color: "bg-yellow-600/20 text-zinc-950 dark:text-yellow-300" },
            { label: "산뜻한 긴죠향", color: "bg-rose-400/20 text-zinc-950 dark:text-rose-300" },
            { label: "클린/미네랄", color: "bg-sky-400/20 text-zinc-950 dark:text-sky-300" },
            { label: "시트러스/라임", color: "bg-emerald-400/20 text-zinc-950 dark:text-emerald-300" },
            { label: "카라멜/바닐라", color: "bg-amber-700/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "야키토리 (닭꼬치 구이)",
            "돼지고기 조림 (라프테/카쿠니)",
            "사시미 및 초밥 (특히 코메 쇼츄)",
            "가라아게 및 각종 튀김 요리",
            "짭조름한 명란젓 및 젓갈류",
            "구운 생선 및 스테이크"
        ],
        dbCategories: ['소주']
    }
}
