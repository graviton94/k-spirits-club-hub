import { SpiritCategory } from './types'

export const sojuGuideKo: SpiritCategory = {
    slug: '소주-가이드',
    emoji: '🍶',
    nameKo: '소주 가이드',
    nameEn: 'Soju Guide',
    taglineKo: '국민 술 희석식부터 프리미엄 증류식까지 소주의 모든 것',
    taglineEn: 'The ultimate guide to Korean Soju',
    color: 'sky',
    sections: {
        definition: "소주는 크게 두 가지로 나뉩니다. 첫째는 우리가 흔히 접하는 초록색 병의 '희석식 소주'이며, 둘째는 쌀 등 곡물을 빚어 증류한 뒤 숙성하는 '증류식 소주'입니다.",
        history: "고려 시대 원나라로부터 전래된 증류 기술로 시작된 전통 소주는, 근현대사 과정에서 식량 부족 문제를 해결하기 위해 주정을 활용한 희석식 소주로 널리 대중화되었습니다. 최근에는 다시금 프리미엄 증류식 소주가 각광받고 있습니다.",
        classifications: [
            {
                name: "희석식 소주 (초록병)",
                criteria: "연속 증류한 주정에 물과 감미료를 희석하여 제조.",
                description: "깔끔하고 시원한 목넘김, 비교적 저렴한 가격으로 삼겹살, 국밥 등 다양한 한식과 완벽한 궁합을 자랑합니다. 알코올 도수는 보통 16~17% 내외입니다."
            },
            {
                name: "증류식 소주 (전통/프리미엄)",
                criteria: "쌀 등 곡물을 발효시킨 술을 단식 증류기로 증류.",
                description: "재료 본연의 구수한 향과 깊은 풍미를 지니고 있으며, 알코올 도수도 20%부터 50% 이상까지 다양합니다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "도수와 풍미의 상관관계",
                label: "ABV & Complexity",
                value: "16% ~ 53%",
                description: "희석식은 도수를 낮추고 부드러움을 극대화하는 추세이며, 증류식은 높은 도수에서 뿜어지는 응축된 아로마를 즐기는 것이 핵심입니다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "타피오카/고구마 (희석식) vs 쌀 (증류식)",
                description: "희석식은 가성비가 높은 원료에서 순수 알코올만 추출하며, 증류식은 여주 쌀, 안동 쌀 등 지역 쌀의 테루아를 담아냅니다."
            }
        ],
        manufacturingProcess: [
            {
                step: "발효 및 증류",
                name: "연속식 증류 vs 단식 증류",
                description: "연속식 증류는 95% 이상의 순도 높은 주정을 생산하며, 단식 증류는 알코올과 함께 곡물의 향미 화합물을 함께 포집합니다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "전통 소주잔 또는 튤립형 테이스팅 잔 (증류식).",
            optimalTemperatures: [
                {
                    temp: "냉장 보관 (4-8°C)",
                    description: "희석식 소주는 아주 차갑게 마셔야 알코올 특유의 쓴맛이 감춰지고 단맛이 살아납니다."
                },
                {
                    temp: "상온 (18-20°C)",
                    description: "고도수 증류식 소주는 상온에서 향을 열어 천천히 음미하는 것이 좋습니다."
                }
            ],
            methods: [
                {
                    name: "니트 / 온더락 / 하이볼",
                    description: "기름진 음식에는 아주 차가운 니트로, 밤에는 얼음을 띄운 온더락으로, 상쾌하게 즐기고 싶을 땐 탄산수를 섞어 하이볼로 즐깁니다."
                }
            ]
        },
        flavorTags: [
            { label: "깔끔한 알코올", color: "bg-sky-500/20 text-zinc-950 dark:text-sky-300" },
            { label: "은은한 단맛", color: "bg-pink-500/20 text-zinc-950 dark:text-pink-300" },
            { label: "구수한 곡물향", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "삼겹살 구이",
            "김치찌개 / 된장찌개",
            "모듬 회",
            "매운 족발 및 볶음 요리"
        ],
        dbCategories: ['소주']
    }
}
