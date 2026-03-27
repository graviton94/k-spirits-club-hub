import { SpiritCategory } from './types'

export const singleMaltVsBlended: SpiritCategory = {
    slug: 'single-malt-vs-blended',
    dbCategories: ['위스키'],
    emoji: '⚖️',
    nameKo: '싱글 몰트 vs 블렌디드 위스키',
    nameEn: 'Single Malt vs Blended Whisky',
    taglineKo: '단일 증류소의 개성과 블렌딩의 균형, 위스키 입문의 가장 대표적인 갈림길',
    taglineEn: 'The classic whisky fork in the road: single-distillery character versus the art of blending',
    color: 'amber',
    hideFromWikiHubGrid: true,
    sections: {
        definition: "싱글 몰트와 블렌디드 위스키는 위스키 입문자가 가장 자주 부딪히는 비교 주제다. 싱글 몰트는 한 증류소의 개성과 테루아를 더 직접적으로 보여주는 방식이고, 블렌디드는 여러 원액을 배합해 부드러움과 균형, 재현성을 설계한 스타일이다. 어느 쪽이 상위 개념이라기보다, 무엇을 더 선호하느냐의 문제에 가깝다.",
        history: "19세기 이후 블렌디드 위스키는 대중성과 일관성을 바탕으로 세계 시장을 키웠고, 20세기 후반부터 싱글 몰트는 증류소 개성, 지역성, 캐스크 실험을 내세우며 프리미엄 카테고리로 강하게 성장했다. 오늘날 위스키 시장은 이 두 축의 긴장감과 상호보완 위에서 움직인다.",
        classifications: [
            {
                name: "원액 구성",
                criteria: "싱글 몰트 = 단일 증류소·100% 맥아 보리 / 블렌디드 = 몰트와 그레인 또는 복수 증류소 배합",
                description: "싱글 몰트는 출신이 명확하고, 블렌디드는 설계 의도가 명확하다. 전자는 원액의 개성을, 후자는 최종 밸런스를 우선한다."
            },
            {
                name: "맛의 인상",
                criteria: "싱글 몰트 = 개성·지역성 / 블렌디드 = 부드러움·일관성",
                description: "싱글 몰트는 피트, 셰리, 과실 향 등 증류소 캐릭터를 읽는 재미가 크고, 블렌디드는 보다 매끄럽고 마시기 쉬운 밸런스를 주는 경우가 많다."
            },
            {
                name: "마시는 방식",
                criteria: "싱글 몰트 = 니트·가수 중심 / 블렌디드 = 니트·하이볼 모두 강점",
                description: "싱글 몰트는 시음 경험에, 블렌디드는 범용성과 데일리성에 강한 편이다. 특히 하이볼에서는 블렌디드의 장점이 확실하게 드러난다."
            },
            {
                name: "입문 추천",
                criteria: "향을 탐구하고 싶으면 싱글 몰트 / 편안하게 즐기려면 블렌디드",
                description: "입문자가 향의 차이를 배우고 싶다면 싱글 몰트, 부담 없이 자주 마시고 싶다면 블렌디드가 시작점이 되기 쉽다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "개성 강도",
                label: "Character Intensity",
                value: "Single Malt > Blended (대체로)",
                description: "싱글 몰트는 특정 증류소의 색깔이 더 직접적으로 드러나는 경우가 많다."
            },
            {
                metric: "접근성",
                label: "Ease of Drinking",
                value: "Blended > Single Malt (대체로)",
                description: "블렌디드는 부드럽고 안정적인 스타일 덕분에 처음 마시는 사람에게 더 편하게 느껴질 수 있다."
            }
        ],
        coreIngredients: [
            {
                type: "싱글 몰트 쪽 포인트",
                name: "맥아 보리와 단일 증류소 정체성",
                description: "출신의 명확함과 원액의 캐릭터가 핵심 가치다."
            },
            {
                type: "블렌디드 쪽 포인트",
                name: "몰트와 그레인, 마스터 블렌더의 설계",
                description: "원액 조합과 밸런싱 역량이 최종 품질을 만든다."
            }
        ],
        manufacturingProcess: [
            {
                step: "비교 1",
                name: "싱글 몰트는 증류소 개성을 읽는다",
                description: "지역, 캐스크, 피트, 숙성 스타일의 차이를 즐기기 좋다."
            },
            {
                step: "비교 2",
                name: "블렌디드는 완성된 밸런스를 읽는다",
                description: "향의 각을 줄이고 부드러운 질감과 범용성을 만들기 위해 조합이 설계된다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "글렌캐런 또는 하이볼 글라스(블렌디드용)",
            optimalTemperatures: [
                {
                    temp: "싱글 몰트 18~22℃",
                    description: "니트나 가수로 개성과 피니시를 읽기 좋은 범위다."
                },
                {
                    temp: "블렌디드 18~22℃ / 하이볼 4~8℃",
                    description: "블렌디드는 니트도 좋지만 차갑게 탄산과 섞을 때도 강점을 낸다."
                }
            ],
            methods: [
                {
                    name: "니트 vs 하이볼 비교",
                    description: "같은 세션에서 싱글 몰트는 니트, 블렌디드는 하이볼로 비교하면 각 카테고리의 성격이 선명하게 드러난다."
                }
            ]
        },
        foodPairing: [
            "싱글 몰트: 숙성 치즈, 다크 초콜릿, 훈제 요리",
            "블렌디드: 치킨, 바비큐, 튀김, 일상 안주",
            "공통: 견과류와 구운 고기류"
        ],
        faqs: [
            {
                question: "싱글 몰트가 블렌디드보다 무조건 더 좋은가요?",
                answer: "그렇지 않다. 싱글 몰트는 개성과 탐구성, 블렌디드는 균형과 접근성이 강점이므로 우열보다 용도와 취향 차이에 가깝다."
            },
            {
                question: "하이볼에는 어느 쪽이 더 잘 맞나요?",
                answer: "대체로 블렌디드가 더 안정적이다. 부드럽고 밸런스가 좋아 탄산과 섞었을 때도 무너지지 않는다."
            },
            {
                question: "입문자는 무엇부터 시작하면 좋나요?",
                answer: "위스키 향미를 배우고 싶다면 싱글 몰트, 부담 없이 자주 마시고 싶다면 블렌디드부터 시작하는 편이 좋다."
            }
        ],
        dbSubcategoryKeywords: ['싱글 몰트 스카치 위스키', '블렌디드 스카치 위스키', '블렌디드 몰트 스카치 위스키', 'Single Malt Scotch Whisky', 'Blended Scotch Whisky', 'Blended Malt Scotch Whisky'],
        dbSubcategoryKeywordGroups: [
            ['싱글 몰트 스카치 위스키', 'Single Malt Scotch Whisky', 'Single Malt'],
            ['블렌디드 스카치 위스키', '블렌디드 몰트 스카치 위스키', 'Blended Scotch Whisky', 'Blended Malt Scotch Whisky', 'Blended'],
        ],
    },
    sectionsEn: {
        definition: "Single Malt versus Blended Whisky is one of the most common starting questions in whisky discovery. Single Malt highlights the identity of one distillery and one malt-driven production lane, while Blended Whisky is built through deliberate combination for smoothness, balance, and consistency. Neither is inherently 'higher'; they simply optimize for different drinking goals.",
        history: "Blended whisky built the global whisky market through consistency and accessibility, especially from the late 19th century onward. Single Malt then rose powerfully in the late 20th century by emphasizing distillery identity, regional character, cask experimentation, and collector appeal. Today's whisky culture is shaped by both.",
        classifications: [
            {
                name: "Spirit Composition",
                criteria: "Single Malt = one distillery, 100% malted barley / Blended = multiple components and blending design",
                description: "Single Malt foregrounds source identity. Blended Whisky foregrounds the final flavor architecture."
            },
            {
                name: "Flavor Impression",
                criteria: "Single Malt = individuality and terroir / Blended = smoothness and repeatability",
                description: "Single Malts often give clearer signals of peat, sherry, fruit, or regional style, while blends often feel easier and more polished from the first sip."
            },
            {
                name: "How They Are Drunk",
                criteria: "Single Malt = neat and with water / Blended = strong in both neat and highball service",
                description: "Single Malt often shines in focused tasting. Blended Whisky often wins on versatility and daily-drinking friendliness."
            },
            {
                name: "Best Starting Point",
                criteria: "Choose Single Malt for exploration / choose Blended for comfort and range",
                description: "Drinkers wanting to study aroma and distillery character often prefer Single Malt first. Drinkers wanting a soft and reliable introduction often prefer Blended Whisky."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Character Strength",
                label: "Character Intensity",
                value: "Single Malt > Blended (in general)",
                description: "Single Malts more often express a sharper sense of place and distillery identity."
            },
            {
                metric: "Drinkability",
                label: "Ease of Drinking",
                value: "Blended > Single Malt (in general)",
                description: "Blends often feel more immediately accessible because they are designed for smoothness and balance."
            }
        ],
        coreIngredients: [
            {
                type: "Single Malt side",
                name: "Malted barley and single-distillery identity",
                description: "The key value lies in clarity of origin and distillery-specific character."
            },
            {
                type: "Blended side",
                name: "Malt and grain components shaped by blending",
                description: "The key value lies in assembly, balance, and the blender's design logic."
            }
        ],
        manufacturingProcess: [
            {
                step: "Compare 1",
                name: "Single Malt is about reading one distillery",
                description: "Region, peat, cask type, and maturation style become easier to notice."
            },
            {
                step: "Compare 2",
                name: "Blended Whisky is about reading a finished balance",
                description: "The goal is often harmony, smoothness, and flexibility rather than one loud identity."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Glencairn or highball glass for blends",
            optimalTemperatures: [
                {
                    temp: "Single Malt 18~22°C",
                    description: "A reliable range for neat or lightly diluted tasting."
                },
                {
                    temp: "Blended 18~22°C / Highball 4~8°C",
                    description: "Blended Whisky performs well both neat and chilled with soda."
                }
            ],
            methods: [
                {
                    name: "Neat versus highball comparison",
                    description: "Taste a Single Malt neat and a Blend as a highball in the same session to understand their strengths quickly."
                }
            ]
        },
        foodPairing: [
            "Single Malt: aged cheese, dark chocolate, smoked dishes",
            "Blended: fried chicken, barbecue, fried foods, casual snacks",
            "Shared zone: nuts and grilled meats"
        ],
        faqs: [
            {
                question: "Is Single Malt always better than Blended Whisky?",
                answer: "No. Single Malt wins on individuality and exploration, while Blended Whisky often wins on balance, value, and broad drinkability."
            },
            {
                question: "Which works better for highballs?",
                answer: "Blended Whisky is usually the safer and more consistent choice for highballs because its balance stays intact when lengthened with soda."
            },
            {
                question: "What should a beginner start with?",
                answer: "Choose Single Malt if you want to learn whisky aromas in detail. Choose Blended Whisky if you want an easier and more versatile starting point."
            }
        ],
        dbSubcategoryKeywords: ['싱글 몰트 스카치 위스키', '블렌디드 스카치 위스키', '블렌디드 몰트 스카치 위스키', 'Single Malt Scotch Whisky', 'Blended Scotch Whisky', 'Blended Malt Scotch Whisky'],
        dbSubcategoryKeywordGroups: [
            ['싱글 몰트 스카치 위스키', 'Single Malt Scotch Whisky', 'Single Malt'],
            ['블렌디드 스카치 위스키', '블렌디드 몰트 스카치 위스키', 'Blended Scotch Whisky', 'Blended Malt Scotch Whisky', 'Blended'],
        ],
    },
}
