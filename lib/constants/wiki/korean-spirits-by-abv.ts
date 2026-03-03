import { SpiritCategory } from './types'

export const koreanSpiritsByAbv: SpiritCategory = {
    slug: 'korean-spirits-by-abv',
    emoji: '📈',
    nameKo: '도수별 증류주 추천',
    nameEn: 'Korean Spirits by ABV',
    taglineKo: '가벼운 식중주부터 강렬한 나이트캡까지, 도수로 찾는 내 취향',
    taglineEn: 'Find the perfect Korean spirit for your tolerance and taste',
    color: 'indigo',
    sections: {
        definition: "한국의 주류는 5% 내외의 가벼운 발효주부터 60%에 육박하는 강렬한 캐스크 스트랭스 증류주까지 매우 폭넓은 알코올 도수(ABV) 스펙트럼을 가지고 있습니다.",
        history: "과거엔 뭉뚱그려 '술'로 통칭되었으나, 취향이 세분화된 요즘은 자신의 주량과 TPO(시간, 장소, 상황)에 맞춰 정확한 도수의 술을 선택하는 것이 트렌드입니다.",
        classifications: [
            {
                name: "저도수 (Low ABV: 5~15%)",
                criteria: "탁주(막걸리), 맥주, 가벼운 과실주.",
                description: "반주로 곁들이기 좋으며, 자연스러운 단맛과 탄산으로 입맛을 돋웁니다. 식사 시간 내내 부담 없이 즐길 수 있습니다."
            },
            {
                name: "중도수 (Mid ABV: 16~25%)",
                criteria: "희석식 소주, 약주, 저도수 증류식 소주, 리큐르.",
                description: "한국 회식 문화의 중심. 기름지거나 매운 음식의 맛을 깔끔하게 씻어주는 역할을 하며, 취기를 기분 좋게 끌어올립니다."
            },
            {
                name: "고도수 (High ABV: 30~60%+)",
                criteria: "프리미엄 증류식 소주, 한국 싱글몰트 위스키.",
                description: "향미가 응축된 '음미용' 스피릿 파트입니다. 식후에 조용히 향을 즐기거나 얼음을 곁들여 나이트캡(취침 전 한 잔)으로 제격입니다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "작열감 (The Bite)",
                label: "Alcohol Burn",
                value: "도수에 비례하나 숙성도에 따라 다름",
                description: "도수가 높다고 무조건 타는 듯한 작열감이 심한 것은 아닙니다. 잘 숙성되고 커팅을 정교하게 한 45도 소주가 거친 20도 소주보다 오히려 목넘김이 부드러운 경우가 많습니다."
            }
        ],
        coreIngredients: [
            {
                type: "부재료",
                name: "가수 (Dilution Water)",
                description: "중저도수 스피릿의 경우, 알코올 도수를 낮추기 위해 첨가하는 물의 미네랄 성분이 술의 최종적인 질감(Texture)을 좌우합니다."
            }
        ],
        manufacturingProcess: [
            {
                step: "블렌딩",
                name: "도수 조절 (Proofing)",
                description: "고도수로 증류된 원액에 물을 타서 목표 도수로 맞추는 과정. 이를 생략하고 오크통에서 바로 병입한 물건을 '캐스크 스트랭스(Cask Strength)'라고 부릅니다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "저도수는 넓고 큰 사발이나 글라스, 고도수는 입구가 좁아지는 스니프터 잔.",
            optimalTemperatures: [
                {
                    temp: "도수에 반비례하는 온도",
                    description: "일반적으로 도수가 낮을수록 차갑게 냉장해서 즐기고, 도수가 높을수록 향이 피어오를 수 있도록 상온에서 서빙합니다."
                }
            ],
            methods: [
                {
                    name: "음용 속도 조절",
                    description: "도수가 높은 술일수록 물을 자주 곁들이고, 얼음을 활용해 천천히 체내 알코올 흡수를 늦추며 향미 변화를 구경하는 것이 좋습니다."
                }
            ]
        },
        flavorTags: [
            { label: "부드러운 목넘김", color: "bg-indigo-400/20 text-indigo-950 dark:text-indigo-300" },
            { label: "짜릿한 타격감", color: "bg-red-600/20 text-red-950 dark:text-red-300" },
            { label: "오래 남는 여운", color: "bg-orange-500/20 text-orange-950 dark:text-orange-300" }
        ],
        foodPairing: [
            "저도수: 파전, 매운 요리",
            "중도수: 회, 삼겹살 구이",
            "고도수: 초콜릿, 견과류, 치즈"
        ],
        dbCategories: ['소주', '위스키', '탁주']
    },
    sectionsEn: {
        definition: "Korean spirits span an incredibly wide range of alcohol by volume (ABV), from gentle, sessionable fermented rice wines to intensely potent cask-strength craft whiskies.",
        history: "Traditionally, ABV was governed by natural fermentation limits and simple distillation. Today, advanced techniques, strict taxation tiers, and shifting consumer preferences drive the diverse offerings in the modern market.",
        classifications: [
            {
                name: "Low ABV (5% - 15%)",
                criteria: "Fermented brews like Makgeolli, Beer, and light Fruit Wines.",
                description: "Characterized by high residual sugars, natural carbonation, and food-friendly profiles. Ideal for casual dining and extended drinking sessions."
            },
            {
                name: "Mid ABV (16% - 25%)",
                criteria: "Diluted Soju, Cheongju, and sweet Liqueurs.",
                description: "The sweet spot for Korean communal dining. Strong enough to cleanse the palate of rich BBQ or spicy stews, but gentle enough to be consumed neat."
            },
            {
                name: "High ABV (30% - 60%+)",
                criteria: "Premium Distilled Soju, Korean Whisky, and Brandy.",
                description: "Designed for slow sipping, contemplation, and complex flavor journeys. Often barrel-aged or matured in traditional pottery."
            }
        ],
        sensoryMetrics: [
            {
                metric: "The Bite",
                label: "Alcohol Burn",
                value: "Variable",
                description: "While high ABV spirits naturally possess more heat, premium distillation techniques and long maturation periods can make a 45% distilled soju feel smoother than a harsh 16% diluted bottle."
            }
        ],
        coreIngredients: [
            {
                type: "Science",
                name: "Water Quality",
                description: "The quality of the dilution water is paramount, especially for mid-ABV spirits like green-bottle Soju, fundamentally shaping the final mouthfeel."
            }
        ],
        manufacturingProcess: [
            {
                step: "Adjusting Strength",
                name: "Dilution vs Cask Strength",
                description: "Spirits are typically distilled to a high proof and then proofed down with pure water before bottling. 'Cask Strength' offerings skip this dilution step, delivering unfiltered intensity."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Varies wildly depending on the category.",
            optimalTemperatures: [
                {
                    temp: "Rule of Thumb",
                    description: "Generally, lower ABV spirits should be served chilled, while higher ABV, complex spirits benefit from room temperature."
                }
            ],
            methods: [
                {
                    name: "Pacing",
                    description: "High ABV spirits should be sipped slowly or diluted with water/ice to uncover hidden aromas."
                }
            ]
        },
        flavorTags: [
            { label: "Smooth & Light", color: "bg-indigo-400/20 text-indigo-950 dark:text-indigo-300" },
            { label: "Intense Burn", color: "bg-red-600/20 text-red-950 dark:text-red-300" },
            { label: "Warm Chest", color: "bg-orange-500/20 text-orange-950 dark:text-orange-300" }
        ],
        foodPairing: [
            "Low ABV: Savory Pancakes, Spicy Food",
            "Mid ABV: Seafood, Korean BBQ",
            "High ABV: Dark Chocolate, Cigar, Charcuterie"
        ],
        dbCategories: ['소주', '위스키', '탁주']
    }
}
