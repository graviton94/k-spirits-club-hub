import { SpiritCategory } from './types'

export const sojuGuide: SpiritCategory = {
    slug: 'soju-guide',
    emoji: '🍶',
    nameKo: '소주 가이드',
    nameEn: 'Soju Guide',
    taglineKo: '국민 술 희석식부터 프리미엄 증류식까지 소주의 모든 것',
    taglineEn: 'The ultimate guide to Korean Soju: from green bottles to premium craft',
    color: 'sky',
    sections: {
        definition: "소주는 크게 두 가지로 나뉩니다. 첫째는 우리가 흔히 접하는 초록색 병의 '희석식 소주'이며, 둘째는 쌀 등 곡물을 빚어 증류한 뒤 숙성하는 '증류식 소주'입니다.",
        history: "고려 시대 원나라로부터 전래된 증류 기술로 시작된 전통 소주는, 근현대사 과정에서 식량 부족 문제를 해결하기 위해 주정을 활용한 희석식 소주로 널리 대중화되었습니다. 최근에는 다시금 프리미엄 증류식 소주가 각광받고 있습니다.",
        classifications: [
            {
                name: "희석식 소주 (초록병)",
                criteria: "연속 증류한 주정에 물과 감미료를 희석하여 제조.",
                description: "깔끔하고 시원한 목넘김, 비교적 저렴한 가격으로 삼겹살, 국밥 등 다양한 한식과 완벽한 합을 자랑합니다. 알코올 도수는 보통 16~17% 내외입니다."
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
            { label: "깔끔한 알코올", color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
            { label: "은은한 단맛", color: 'bg-pink-100 text-pink-950 dark:bg-pink-900/40 dark:text-pink-100' },
            { label: "구수한 곡물향", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' }
        ],
        foodPairing: [
            "삼겹살 구이",
            "김치찌개 / 된장찌개",
            "모듬 회",
            "매운 족발 및 볶음 요리"
        ],
        dbCategories: ['소주']
    },
    sectionsEn: {
        definition: "Soju is generally categorized into two types: the ubiquitous 'diluted soju' in green bottles, and 'distilled soju' crafted from grains and aged for depth.",
        history: "Originating as traditional distilled spirits introduced from the Mongols during the Goryeo Dynasty, soju evolved into mass-market diluted versions during 20th-century grain shortages. Today, premium distilled soju is experiencing a modern revival.",
        classifications: [
            {
                name: "Diluted Soju (Green Bottle)",
                criteria: "Produced by diluting 95% pure ethanol with water and sweeteners.",
                description: "Clean, light-bodied, and highly affordable. It is a cultural staple designed to pair with spicy and greasy Korean foods."
            },
            {
                name: "Distilled Soju (Premium/Traditional)",
                criteria: "Crafted by fermenting and distilling grains in a pot still.",
                description: "Retains the rich, earthy flavors of the base ingredients. Offers a smooth, complex profile with varying ABV levels from 20% to over 50%."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Strength and Flavor",
                label: "ABV Range",
                value: "16% ~ 53%",
                description: "Lower ABV diluted versions emphasize refreshment, while high-proof distilled versions focus on aromatic complexity."
            }
        ],
        coreIngredients: [
            {
                type: "Base",
                name: "Tapioca/Grain (Diluted) vs Rice/Grain (Distilled)",
                description: "Diluted soju uses high-yield starch sources for purity; distilled soju highlights the terroir and quality of local grains."
            }
        ],
        manufacturingProcess: [
            {
                step: "Distillation Method",
                name: "Continuous vs Pot Still",
                description: "Continuous stills produce high-purity neutral spirits, while traditional pot stills precisely capture the character of the raw ingredients."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Traditional soju cups or tulip-shaped tasting glasses for premium varieties.",
            optimalTemperatures: [
                {
                    temp: "Chilled (4-8°C)",
                    description: "Best for diluted soju to minimize alcohol burn and maximize crispness."
                },
                {
                    temp: "Room Temperature (18-20°C)",
                    description: "Ideal for premium distilled soju to allow complex aromas to unfurl."
                }
            ],
            methods: [
                {
                    name: "Neat, Rocks, or Highball",
                    description: "Enjoy chilled neat with meals, on the rocks in the evening, or as a refreshing highball with soda water."
                }
            ]
        },
        flavorTags: [
            { label: "Clean Alcohol", color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
            { label: "Subtle Sweetness", color: 'bg-pink-100 text-pink-950 dark:bg-pink-900/40 dark:text-pink-100' },
            { label: "Nutty Grain", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' }
        ],
        foodPairing: [
            "Korean BBQ (Samgyeopsal)",
            "Spicy Stews (Kimchi-jjigae)",
            "Sashimi and Seafood",
            "Spicy Korean Stir-fry Dishes"
        ],
        dbCategories: ['소주']
    }
}
