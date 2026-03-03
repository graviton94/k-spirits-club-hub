import { SpiritCategory } from './types'

export const makgeolliGuideKo: SpiritCategory = {
    slug: '막걸리-가이드',
    emoji: '🍶',
    nameKo: '막걸리 가이드',
    nameEn: 'Makgeolli Guide',
    taglineKo: '쌀과 누룩이 빚어내는 살아있는 맛, 프리미엄 탁주의 세계',
    taglineEn: 'The traditional Korean unfiltered rice wine',
    color: 'emerald',
    sections: {
        definition: "막걸리는 한국에서 가장 오래된 역사를 지닌 술로, 쌀 등의 곡물을 쪄서 누룩과 물을 섞어 발효시킨 탁주입니다. 맑게 거르지 않아 단백질과 유산균이 풍부하며, 특유의 구수함과 산미가 특징입니다.",
        history: "삼국시대 이전부터 농경 사회의 필수품이었던 농주(農酒)에서 유래하여, 현대에는 아스파탐 등의 인공 감미료를 배제하고 좋은 쌀과 누룩만으로 빚어 자연스러운 단맛을 이끌어내는 프리미엄 막걸리로 진화하고 있습니다.",
        classifications: [
            {
                name: "생막걸리 (Unpasteurized)",
                criteria: "효모와 유산균이 살아있는 비살균 막걸리.",
                description: "보관 중에도 발효가 진행되어 산미와 탄산감이 변하며, 유통기한이 짧은 대신 신선하고 풍부한 풍미를 자랑합니다."
            },
            {
                name: "살균 막걸리 (Pasteurized)",
                criteria: "열을 가해 균의 활동을 정지시킨 막걸리.",
                description: "보관이 용이하고 유통기한이 길어 해외 수출용이나 장기 보관용으로 적합하지만, 생막걸리 특유의 청량감은 다소 줄어듭니다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "바디감",
                label: "Body & Texture",
                value: "가벼움 ~ 묵직함",
                description: "물의 비율과 부재료(잣, 밤, 과일 등) 첨가 여부, 그리고 쌀의 도정률에 따라 깔끔한 요구르트 질감부터 걸쭉한 수프 질감까지 다양합니다."
            }
        ],
        coreIngredients: [
            {
                type: "뼈대",
                name: "쌀과 누룩",
                description: "햅쌀, 멥쌀, 찹쌀을 혼합하여 단맛의 구조를 잡으며, 전통 밀기울 누룩이나 개량 누룩을 통해 향의 방향성이 결정됩니다."
            }
        ],
        manufacturingProcess: [
            {
                step: "발효 공정",
                name: "단양주 vs 이양주/삼양주",
                description: "한 번만 빚는 단양주를 넘어, 밑술에 고두밥을 여러 번 덧대어 발효하는 다양주 기법은 도수를 높이고(9~15%) 자연스러운 단맛과 과실향을 증폭시킵니다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "전통 양은 사발, 깨끗한 도자기 잔, 혹은 아로마를 모아주는 와인잔.",
            optimalTemperatures: [
                {
                    temp: "차갑게 (4~8°C)",
                    description: "단맛과 산미가 조화롭게 느껴지며 걸쭉한 질감이 깔끔하게 넘어가는 최적의 온도."
                }
            ],
            methods: [
                {
                    name: "흔들어 마시기 (선택)",
                    description: "밑에 가라앉은 지게미를 섞어 탁하게 마시면 바디감이 살고, 섞지 않고 위의 맑은 청주만 따라 마시면 섬세한 향을 즐길 수 있습니다."
                }
            ]
        },
        flavorTags: [
            { label: "크리미/밀키", color: "bg-emerald-500/20 text-zinc-950 dark:text-emerald-300" },
            { label: "요구르트 산미", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-300" },
            { label: "구수한 곡물", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "파전, 빈대떡, 김치전",
            "두부김치와 보쌈",
            "매콤한 오징어 볶음",
            "도토리묵 무침"
        ],
        dbCategories: ['탁주']
    }
}
