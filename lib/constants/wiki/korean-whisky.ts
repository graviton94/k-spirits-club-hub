import { SpiritCategory } from './types'

export const koreanWhisky: SpiritCategory = {
    slug: 'korean-whisky',
    emoji: '🥃',
    nameKo: '한국 위스키 가이드',
    nameEn: 'Korean Whisky Guide',
    taglineKo: '대한민국 크래프트 위스키의 태동과 위대한 도전',
    taglineEn: 'The rise and pioneering spirit of Korean craft whiskies',
    color: 'amber',
    sections: {
        definition: "한국 위스키는 대한민국의 기후와 물, 그리고 증류소별 철학을 담아 만들어지는 크래프트 싱글몰트 위스키를 중심으로 새롭게 쓰여지고 있는 장르입니다.",
        history: "과거엔 주정과 스코틀랜드 원액을 혼합한 블렌디드가 주류였으나, 최근 계절 변화가 뚜렷한 한국에서 숙성부터 증류까지 모든 과정을 해내는 쓰리소사이어티스(기원)와 김창수 위스키 등의 탄생으로 본격적인 크래프트 씬이 열렸습니다.",
        classifications: [
            {
                name: "기원 (쓰리소사이어티스)",
                criteria: "남양주의 풍부한 수자원과 급격한 연교차 활용.",
                description: "가장 먼저 코리안 싱글몰트 시대를 열었으며, 버진 오크, 버번 캐스크 등 실험적인 숙성으로 스파이시하고 강렬한 나무 향을 단기간에 끌어올립니다."
            },
            {
                name: "김창수 위스키",
                criteria: "마스터 디스틸러의 1인 기획/제조 및 국산 재료 실험.",
                description: "한국산 국산 맥아나 벚나무 캐스크, 와인 캐스크 피니시 등 전례 없는 시도를 통해 독보적인 캐릭터를 구축하고 있습니다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "숙성 속도",
                label: "Maturation Rate",
                value: "Very Fast (천사의 몫 10% 이상)",
                description: "한국의 덥고 습한 여름과 영하의 겨울은 오크통을 격격하게 수축·팽창시켜 1~2년 만에 스코틀랜드의 10년 숙성에 달하는 색상과 오크 풍미를 구현합니다."
            }
        ],
        coreIngredients: [
            {
                type: "로컬 테루아",
                name: "국산 맥아와 이탄",
                description: "진정한 '코리안 테루아'를 구현하기 위해 한국산 보리와 로컬 피트(이탄)를 사용하려는 시도가 이어지고 있습니다."
            }
        ],
        manufacturingProcess: [
            {
                step: "기후 조건",
                name: "사계절 고온다습/저온건조 숙성",
                description: "가혹한 숙성 환경은 위스키 원액에 짙은 바닐라와 강렬한 스파이스 노트를 단숨에 새겨버리는 특징을 가집니다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "향을 모아주는 글렌캐런(Glencairn) 또는 테이스팅 잔.",
            optimalTemperatures: [
                {
                    temp: "상온 (20°C)",
                    description: "빠른 숙성으로 폭발하는 강한 타닌과 오크 노트를 생생하게 느낄 수 있는 최적의 온도입니다."
                }
            ],
            methods: [
                {
                    name: "니트 또는 물 몇 방울",
                    description: "고도수의 알코올 향을 진정시키고 숨겨진 과일, 꿀 향을 깨우는 데 탁월합니다."
                }
            ]
        },
        flavorTags: [
            { label: "강렬한 오크", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "진한 바닐라", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "스파이시/향신료", color: 'bg-red-100 text-red-950 dark:bg-red-900/40 dark:text-red-100' }
        ],
        foodPairing: [
            "한우 다이닝 스테이크",
            "다크 초콜릿",
            "하몽 및 건조 육류",
            "훈제 향이 배어든 요리"
        ],
        dbCategories: ['위스키']
    },
    sectionsEn: {
        definition: "Korean Whisky represents a burgeoning sector of the global spirits industry, marked by passionate craft distillers pioneering single malt production in Korea's unique climate.",
        history: "While early 'whiskies' in Korea were often blends of imported scotch and local spirits, the modern era has seen the establishment of true craft distilleries like Ki One (Three Societies) and Gimpo Paju (Kim Chang Soo) focused on authentic single malt production.",
        classifications: [
            {
                name: "Korean Single Malt",
                criteria: "Mashed, fermented, distilled, and matured entirely in Korea.",
                description: "Characterized by rapid maturation due to Korea's extreme seasonal temperature swings, pulling deep oak flavors quickly."
            }
        ],
        sensoryMetrics: [
            {
                metric: "ABV",
                label: "Alcohol By Volume",
                value: "40% ~ 58%",
                description: "Many craft releases are offered at Cask Strength to showcase their intense, unbridled character."
            },
            {
                metric: "Maturation Rate",
                label: "Angel's Share",
                value: "High (Over 10% per year)",
                description: "Dramatic temperature variations result in much higher evaporation and faster oak interaction compared to Scotland."
            }
        ],
        coreIngredients: [
            {
                type: "Primary",
                name: "Malted Barley",
                description: "Often imported from traditional sources like the UK or Australia, though some distilleries experiment with local peat and grains."
            }
        ],
        manufacturingProcess: [
            {
                step: "Maturation",
                name: "Climate-Driven Aging",
                description: "The hot, humid summers and freezing winters cause dramatic expansion and contraction in the barrels, leading to aggressive oak extraction."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Glencairn or traditional snifter.",
            optimalTemperatures: [
                {
                    temp: "Room Temperature (20°C)",
                    description: "Best enjoyed neat to appreciate the rapid maturation profile."
                }
            ],
            methods: [
                {
                    name: "Neat or with a few drops of water",
                    description: "To open up the intense spice and oak notes."
                }
            ]
        },
        flavorTags: [
            { label: "Spicy Oak", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "Intense Vanilla", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "Dried Fruit", color: 'bg-red-100 text-red-950 dark:bg-red-900/40 dark:text-red-100' }
        ],
        foodPairing: [
            "Dark Chocolate",
            "Korean Beef (Hanwoo) Steak",
            "Smoked Charcuterie",
            "Cigar pairings"
        ],
        dbCategories: ['위스키']
    }
}
