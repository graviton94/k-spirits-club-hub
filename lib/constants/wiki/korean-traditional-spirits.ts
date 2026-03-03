import { SpiritCategory } from './types'

export const koreanTraditionalSpirits: SpiritCategory = {
    slug: 'korean-traditional-spirits',
    emoji: '🏺',
    nameKo: '전통주 종류 가이드',
    nameEn: 'Traditional Spirits',
    taglineKo: '발효부터 증류까지, 알고 마시면 더 맛있는 우리 술',
    taglineEn: 'The profound heritage of Korean indigenous liquors',
    color: 'stone',
    sections: {
        definition: "한국의 전통주는 크게 발효주(탁주, 약주/청주)와 이를 증류한 증류주(소주)로 나뉩니다. 지역의 농산물과 누룩을 사용하여 빚어내는 가장 한국적인 술입니다.",
        history: "문헌상 삼국시대부터 전해 내려오며 가양주(집에서 빚는 술) 문화를 꽃피웠으나, 일제강점기 주세령과 해방 후 양곡관리법으로 침체기를 겪었습니다. 최근 규제 완화와 맞물려 젊은 양조장들의 참신한 시도로 화려하게 부활하고 있습니다.",
        classifications: [
            {
                name: "탁주 (막걸리)",
                criteria: "거르지 않고 혼탁하게 마시는 술.",
                description: "보통 6~10%의 도수로 가장 대중적이며, 쌀의 단맛과 누룩의 구수함이 어우러집니다."
            },
            {
                name: "약주 / 청주",
                criteria: "탁금이 가라앉은 뒤 윗부분의 맑은 술만 떠낸 술.",
                description: "보통 13~18% 도수이며, 꽃이나 과일 향이 그윽하게 배어나는 고급 발효주입니다. (※ 주세법상 누룩 사용량에 따라 약주와 청주가 구분됨)"
            },
            {
                name: "증류식 소주",
                criteria: "탁주나 약주를 끓여 순수한 알코올과 향미만 추출한 스피릿.",
                description: "20%에서 50% 이상의 고도수 스피릿으로, 숙성 기간과 용기(옹기, 오크통)에 따라 맛의 깊이가 달라집니다."
            },
            {
                name: "과실주 및 기타 (한국 와인)",
                criteria: "한국에서 재배된 포도, 사과, 오미자 등으로 빚은 술.",
                description: "다양한 지역 특산물을 활용해 독창적인 산미와 풍미를 만들어냅니다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "누룩의 뉘앙스",
                label: "Nuruk Character",
                value: "Very Unique",
                description: "서양의 단일 배양 효모와 달리, 자연의 다양한 균주가 복합적으로 작용하여 흙내음, 버섯, 과숙된 열대과일 등 흉내 낼 수 없는 다층적인 향을 냅니다."
            }
        ],
        coreIngredients: [
            {
                type: "영혼",
                name: "전통 누룩",
                description: "밀이나 쌀을 반죽해 띄운 발효제로, 전분을 당으로 바꾸고 알코올 발효를 동시에 진행하는 병행복발효의 핵심입니다."
            }
        ],
        manufacturingProcess: [
            {
                step: "숙성과 시간",
                name: "백일주 등 장기 발효",
                description: "문배주, 소곡주 등 전통 명주는 100일 이상의 지난한 발효와 숙성 과정을 거쳐 완성됩니다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "술의 산지에 맞는 도자기 잔 혹은 향을 잘 모아주는 테이스팅 잔.",
            optimalTemperatures: [
                {
                    temp: "술의 종류에 따라 극과 극",
                    description: "탁주는 아주 차갑게(4°C), 약주는 시원하게(8-10°C), 고도수 소주는 상온(20°C)에서 즐기는 것이 정석입니다."
                }
            ],
            methods: [
                {
                    name: "음식과의 마리아주 향유",
                    description: "전통주는 한식의 다양한 장류, 발효 음식과 충돌하지 않고 입안에서 완벽하게 조화되는 특징이 있습니다."
                }
            ]
        },
        flavorTags: [
            { label: "누룩/발효향", color: "bg-stone-600/20 text-zinc-950 dark:text-stone-300" },
            { label: "산뜻한 꽃향", color: "bg-pink-400/20 text-zinc-950 dark:text-pink-300" },
            { label: "달콤한 조청", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "한정식 및 궁중 요리",
            "각종 전과 부침개",
            "갈비찜, 불고기 등 간장 베이스 육류",
            "숙성회 및 젓갈류"
        ],
        dbCategories: ['소주', '탁주', '약주', '기타주류']
    },
    sectionsEn: {
        definition: "Korean traditional spirits encompass a vast array of indigenous alcoholic beverages meticulously crafted from local agricultural products, preserving the culinary and cultural heritage of the Korean peninsula.",
        history: "Dating back thousands of years to ancient rituals, these spirits were suppressed during the Japanese occupation and subsequent post-war grain preservation laws, but have experienced a vibrant renaissance over the last two decades.",
        classifications: [
            {
                name: "Takju (탁주)",
                criteria: "Cloudy, unfiltered rice wine.",
                description: "The most ancient form, earthy and nourishing. Includes Makgeolli."
            },
            {
                name: "Yakju & Cheongju (약주/청주)",
                criteria: "Clear, refined rice wine.",
                description: "The clarified upper layer of the brew. Delicate, floral, and traditionally reserved for ancestral rites and nobility."
            },
            {
                name: "Soju (소주 - Distilled)",
                criteria: "Distilled from Takju or Cheongju.",
                description: "A potent, clear spirit capturing the fiery essence of the fermented brew."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Complexity",
                label: "Flavor Breadth",
                value: "Exceptionally High",
                description: "Spans from sweet, lactic, and earthy to floral, herbal, and intensely robust."
            }
        ],
        coreIngredients: [
            {
                type: "Foundation",
                name: "Nuruk (누룩)",
                description: "The soul of Korean brewing. A wild fermentation starter that inoculates grains with airborne yeast, fungi, and bacteria, creating flavors irreplicable by pure lab yeasts."
            }
        ],
        manufacturingProcess: [
            {
                step: "Brewing Philosophy",
                name: "Harmony with Nature",
                description: "Rather than isolating specific strains, traditional brewing embraces the chaotic harmony of wild microflora, adapting recipes to the subtle shifts in local climate and seasonal ingredients."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Traditional ceramics or modern wine glasses to capture aromas.",
            optimalTemperatures: [
                {
                    temp: "Varies Wildly",
                    description: "Takju is chilled. Cheongju is often enjoyed slightly chilled or gently warmed. Distilled Soju is enjoyed neat at room temperature."
                }
            ],
            methods: [
                {
                    name: "Ceremonial Respect",
                    description: "Traditionally served with two hands, pouring for others first out of respect."
                }
            ]
        },
        flavorTags: [
            { label: "Earthy Nuruk", color: "bg-stone-600/20 text-zinc-950 dark:text-stone-300" },
            { label: "Floral & Fruity", color: "bg-pink-400/20 text-zinc-950 dark:text-pink-300" },
            { label: "Savory Grain", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "Royal Court Cuisine (Gungjung Eumsik)",
            "Delicate Seafood",
            "Savory Pancakes",
            "Braised Meats"
        ],
        dbCategories: ['소주', '탁주', '약주', '기타주류']
    }
}
