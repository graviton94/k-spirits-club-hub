import { SpiritCategory } from './types'

export const yakjuVsCheongju: SpiritCategory = {
    slug: 'yakju-vs-cheongju',
    dbCategories: ['약주', '청주'],
    emoji: '⚖️',
    nameKo: '약주 vs 청주',
    nameEn: 'Yakju vs Cheongju',
    taglineKo: '둘 다 한국 맑은술이지만 누룩과 법적 기준에서 갈라지는 두 스타일',
    taglineEn: 'Two Korean clear-rice-wine styles divided by starter usage, law, and flavor direction',
    color: 'amber',
    hideFromWikiHubGrid: true,
    sections: {
        definition: "약주와 청주는 모두 한국의 맑은 쌀술 계열이지만 완전히 같은 말은 아니다. 실무적으로 약주는 전통 누룩 기반의 복합 향과 감칠맛이 더 강하게 나타나는 경우가 많고, 청주는 입국 중심의 깔끔함과 절제된 스타일로 읽히는 경우가 많다. 특히 한국 시장에서는 일상 용법과 법적 용법이 엇갈려 헷갈리기 쉬워, 둘을 나란히 비교하는 가이드가 필요하다.",
        history: "전통적으로는 맑게 떠낸 술을 청주라 넓게 불렀고, 약주라는 표현도 함께 쓰였다. 하지만 현대 주세 제도에서 원료와 전통 누룩 사용 비율이 법적 분류를 가르면서, 전통 누룩의 존재감이 큰 맑은 술은 약주, 보다 정제된 입국 중심 맑은 술은 청주로 구분되는 경향이 뚜렷해졌다.",
        classifications: [
            {
                name: "법적/행정 구분",
                criteria: "약주 = 전통 누룩 사용 비중이 큰 한국 맑은술 / 청주 = 입국 중심의 법정 청주 기준",
                description: "소비자 입장에서는 둘 다 맑은 쌀술처럼 보이지만, 행정 분류에서는 누룩 사용 기준이 핵심 분기점이 된다."
            },
            {
                name: "향미 방향",
                criteria: "약주 = 누룩·젖산·감칠맛 / 청주 = 깔끔함·절제된 과실 향",
                description: "약주는 구수함과 복합 발효 향, 청주는 정돈된 질감과 식중주적 선명함이 두드러지는 경우가 많다."
            },
            {
                name: "어울리는 음식",
                criteria: "약주 = 전·수육·장아찌 / 청주 = 회·맑은 국물·담백한 해산물",
                description: "약주는 맛이 있는 반찬과 잘 붙고, 청주는 재료의 결을 해치지 않는 담백한 페어링에서 강하다."
            },
            {
                name: "입문 난이도",
                criteria: "약주 = 전통향에 익숙할수록 매력 / 청주 = 비교적 접근성이 높음",
                description: "전통 누룩의 복합 향에 익숙하지 않다면 청주가 더 부드럽게 느껴질 수 있다. 반대로 풍미 층위를 원하면 약주가 더 깊게 다가온다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "감칠맛",
                label: "Umami",
                value: "Yakju > Cheongju (대체로)",
                description: "전통 누룩과 복합 발효의 영향으로 약주가 더 진한 감칠맛을 보이는 경우가 많다."
            },
            {
                metric: "깔끔함",
                label: "Clarity of Finish",
                value: "Cheongju > Yakju (대체로)",
                description: "청주는 절제되고 선명한 피니시가 장점인 경우가 많다."
            }
        ],
        coreIngredients: [
            {
                type: "약주 쪽 포인트",
                name: "전통 누룩과 복합 미생물",
                description: "곡물향, 젖산감, 감칠맛을 키우는 핵심 요소다."
            },
            {
                type: "청주 쪽 포인트",
                name: "입국과 정교한 여과",
                description: "향을 더 단정하게 만들고 피니시를 깨끗하게 정리한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "비교 1",
                name: "약주는 전통 누룩이 캐릭터를 만든다",
                description: "누룩의 미생물 복합성이 향과 감칠맛을 풍부하게 만든다."
            },
            {
                step: "비교 2",
                name: "청주는 입국 중심의 정돈된 스타일로 간다",
                description: "발효와 여과를 보다 선명한 방향으로 컨트롤하기 쉽다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "작은 화이트 와인 글라스",
            optimalTemperatures: [
                {
                    temp: "약주 12~18℃",
                    description: "감칠맛과 고소함이 살아나는 범위다."
                },
                {
                    temp: "청주 10~14℃",
                    description: "깔끔함과 밸런스가 가장 잘 드러나는 범위다."
                }
            ],
            methods: [
                {
                    name: "같은 한식 상차림에서 비교하기",
                    description: "전, 생선, 장아찌 같은 메뉴와 함께 마시면 약주와 청주의 역할 차이가 매우 분명해진다."
                }
            ]
        },
        foodPairing: [
            "약주: 전, 수육, 장아찌, 진한 한식 반찬",
            "청주: 흰살생선회, 조개찜, 맑은 탕",
            "공통: 담백한 쌀 기반 음식과 좋은 궁합"
        ],
        faqs: [
            {
                question: "약주와 청주는 같은 말인가요?",
                answer: "일상 언어에서는 겹쳐 쓰일 때가 있지만, 현재의 법적·실무적 구분에서는 다르게 보는 편이 맞다."
            },
            {
                question: "더 전통적인 느낌은 어느 쪽인가요?",
                answer: "대체로 약주가 전통 누룩의 존재감 때문에 더 전통적인 풍미로 읽히는 경우가 많다."
            },
            {
                question: "입문자는 어느 쪽이 쉬운가요?",
                answer: "보다 깔끔하고 단정한 스타일을 찾는다면 청주, 풍미 층위와 감칠맛을 원한다면 약주가 맞다."
            }
        ],
        dbSubcategoryKeywords: ['약주', '전통 약주', '개량 약주', '한국 청주', '청주', 'Yakju', 'Cheongju'],
        dbSubcategoryKeywordGroups: [
            ['약주', '전통 약주', '개량 약주', 'Yakju'],
            ['한국 청주', '청주', 'Korean Cheongju', 'Cheongju'],
        ],
    },
    sectionsEn: {
        definition: "Yakju and Cheongju both belong to Korea's clear rice-wine family, but they are not interchangeable in a practical sense. Yakju often leans more strongly into traditional Nuruk character and savory complexity, while Cheongju tends to present a cleaner, more polished style built around koji-led precision and filtering. Because everyday language and legal terminology do not always align, a side-by-side guide is useful.",
        history: "Historically, clear rice wines in Korea were discussed more broadly, and both terms could overlap in casual usage. Modern liquor law, however, made starter usage and ingredient rules central to classification, which pushed traditional Nuruk-driven clear wines toward Yakju and more polished, legal Cheongju styles toward a separate lane.",
        classifications: [
            {
                name: "Legal and Practical Split",
                criteria: "Yakju = Nuruk-forward Korean clear rice wine / Cheongju = legal Cheongju framework with a cleaner brewing profile",
                description: "To consumers they may both look like clear rice wine, but legal and production logic treat them as different directions."
            },
            {
                name: "Flavor Direction",
                criteria: "Yakju = Nuruk, lactic depth, umami / Cheongju = clarity, restraint, cleaner fruit",
                description: "Yakju more often shows layered fermentation depth, while Cheongju usually emphasizes control, neatness, and a cleaner finish."
            },
            {
                name: "Food Context",
                criteria: "Yakju = richer Korean dishes / Cheongju = delicate seafood and light savory dishes",
                description: "Yakju has enough texture and savory weight for more assertive side dishes. Cheongju thrives with gentler pairings."
            },
            {
                name: "Ease of Entry",
                criteria: "Yakju = deeper tradition-driven flavor / Cheongju = often easier for clean-style drinkers",
                description: "Drinkers unused to traditional fermentation complexity may find Cheongju more accessible at first."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Umami Depth",
                label: "Umami",
                value: "Yakju > Cheongju (in general)",
                description: "Traditional starter complexity often gives Yakju a stronger savory and layered impression."
            },
            {
                metric: "Finish Precision",
                label: "Clean Finish",
                value: "Cheongju > Yakju (in general)",
                description: "Cheongju more often wins on neatness and finish clarity."
            }
        ],
        coreIngredients: [
            {
                type: "Yakju side",
                name: "Traditional Nuruk and mixed microflora",
                description: "These drive grain depth, lactic complexity, and savory richness."
            },
            {
                type: "Cheongju side",
                name: "Rice koji and precise filtration",
                description: "These help create a tidier, cleaner, and more linear drinking experience."
            }
        ],
        manufacturingProcess: [
            {
                step: "Compare 1",
                name: "Yakju builds identity through traditional starter character",
                description: "Its aromatic depth comes from the complexity of Nuruk-driven fermentation."
            },
            {
                step: "Compare 2",
                name: "Cheongju moves toward polished clarity",
                description: "Its style is easier to control toward clean balance and precision."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Small white-wine glass",
            optimalTemperatures: [
                {
                    temp: "Yakju 12~18°C",
                    description: "A good range for letting savory depth and grain character unfold."
                },
                {
                    temp: "Cheongju 10~14°C",
                    description: "The most dependable range for preserving clean balance and clarity."
                }
            ],
            methods: [
                {
                    name: "Compare them with the same Korean meal",
                    description: "Using the same dishes is the fastest way to understand how each style behaves at the table."
                }
            ]
        },
        foodPairing: [
            "Yakju: jeon, boiled pork, pickled side dishes, richer Korean plates",
            "Cheongju: white-fish sashimi, shellfish, clear soups",
            "Shared zone: rice-based and gently seasoned foods"
        ],
        faqs: [
            {
                question: "Are Yakju and Cheongju the same word?",
                answer: "They can overlap in casual speech, but under modern legal and practical use they are better treated as different lanes."
            },
            {
                question: "Which feels more traditional?",
                answer: "Yakju often reads as more traditional because the traditional starter character is usually more visible in the glass."
            },
            {
                question: "Which one is easier for beginners?",
                answer: "Cheongju is often easier if you prefer clean, tidy styles. Yakju is rewarding if you want more savory depth and layered fermentation character."
            }
        ],
        dbSubcategoryKeywords: ['약주', '전통 약주', '개량 약주', '한국 청주', '청주', 'Yakju', 'Cheongju'],
        dbSubcategoryKeywordGroups: [
            ['약주', '전통 약주', '개량 약주', 'Yakju'],
            ['한국 청주', '청주', 'Korean Cheongju', 'Cheongju'],
        ],
    },
}
