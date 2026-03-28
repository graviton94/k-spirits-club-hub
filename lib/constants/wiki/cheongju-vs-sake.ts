import { SpiritCategory } from './types'

export const cheongjuVsSake: SpiritCategory = {
    slug: 'cheongju-vs-sake',
    dbCategories: ['청주'],
    emoji: '⚖️',
    nameKo: '청주 vs 사케',
    nameEn: 'Cheongju vs Sake',
    taglineKo: '같은 맑은 쌀술처럼 보이지만 출발점과 스타일이 다른 두 세계',
    taglineEn: 'Two clear rice-wine worlds that look similar but diverge in brewing logic and drinking style',
    color: 'cyan',
    hideFromWikiHubGrid: true,
    sections: {
        definition: "청주와 사케는 모두 맑은 쌀술로 묶여 보이기 쉽지만, 한국식 청주는 한국 주세 체계와 양조 문맥 안에서 발전한 맑은술이고, 사케는 일본의 니혼슈 양조 규범 안에서 정미·등급·온도 문화가 정교하게 발전한 별개의 장르다. K-Spirits Club에서는 법적 카테고리는 유지하되, 실제 탐색 경험에서는 서브카테고리 기준으로 둘을 구분해 안내한다.",
        history: "한국의 청주는 역사적으로 '맑은 술' 전반을 가리키는 폭넓은 용어였고, 일본의 사케는 정미율과 등급 체계가 발달하며 독자적인 카테고리 언어를 갖추었다. 현대 시장에서는 둘 다 깔끔한 쌀술로 보일 수 있지만, 생산 문법과 소비 맥락, 그리고 맛의 지향점이 상당히 다르다.",
        classifications: [
            {
                name: "양조 출발점",
                criteria: "한국 청주 = 한국식 맑은술 해석 / 사케 = 일본 니혼슈 체계",
                description: "청주는 한국 전통주 맥락과 법적 청주 분류를 배경으로 읽는 것이 맞고, 사케는 일본식 정미율·긴조향·등급 언어를 함께 봐야 한다. 이름이 비슷해도 카테고리의 문화적 기준점이 다르다."
            },
            {
                name: "향미 구조",
                criteria: "청주 = 담백함·식중주성 / 사케 = 향의 등급 차와 스타일 스펙트럼",
                description: "한국 청주는 대체로 밥 반찬과 맞닿는 담백함과 절제된 과실 향이 강점이다. 사케는 준마이, 긴조, 다이긴조처럼 향의 화려함과 질감의 섬세함을 더 뚜렷하게 스타일링하는 경향이 있다."
            },
            {
                name: "마시는 상황",
                criteria: "청주 = 한식 식중주 / 사케 = 온도와 코스에 따른 스타일 선택",
                description: "청주는 식사와 나란히 가는 맥락에서 장점이 빠르게 드러난다. 사케는 차갑게 혹은 따뜻하게, 생선 중심 혹은 단독 시음 중심 등 서빙 전략 자체가 더 세분화돼 있다."
            },
            {
                name: "구매 판단 포인트",
                criteria: "청주 = 여과감·감칠맛 / 사케 = 등급·정미율·스타일",
                description: "청주는 '깔끔한지, 감칠맛이 어느 정도인지, 한식과 맞는지'를 먼저 보면 되고, 사케는 준마이/긴조/다이긴조 같은 등급과 향 성향을 함께 보는 편이 실패가 적다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "향의 화려함",
                label: "Aroma Lift",
                value: "Cheongju < Sake (대체로)",
                description: "일반적으로 사케 쪽이 향의 화려함과 스타일 차가 더 극적으로 드러나는 경우가 많다."
            },
            {
                metric: "식중주 적합성",
                label: "Table Versatility",
                value: "둘 다 높음 / 청주가 한식 쪽에 강점",
                description: "두 스타일 모두 음식과 잘 맞지만, 청주는 특히 한식 반찬과의 자연스러운 연결감이 강하다."
            }
        ],
        coreIngredients: [
            {
                type: "청주 쪽 포인트",
                name: "입국, 여과, 담백한 밸런스",
                description: "한국식 맑은술로서의 정갈함과 식중주성을 만드는 요소다."
            },
            {
                type: "사케 쪽 포인트",
                name: "정미율, 니혼슈 등급, 향 중심 설계",
                description: "스타일 차를 읽는 데 가장 중요한 판단 기준이다."
            }
        ],
        manufacturingProcess: [
            {
                step: "비교 1",
                name: "청주는 맑은 한국식 쌀술의 컨텍스트로 읽기",
                description: "법적 분류와 실제 상품 문맥을 함께 봐야 하며, 감칠맛과 식중주성이 핵심 판단 포인트다."
            },
            {
                step: "비교 2",
                name: "사케는 등급과 온도 설계로 읽기",
                description: "준마이, 긴조, 다이긴조처럼 세부 스타일과 향의 차이를 먼저 보면 선택이 쉬워진다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "작은 화이트 와인 글라스 또는 얇은 사케 글라스",
            optimalTemperatures: [
                {
                    temp: "청주 10~14℃",
                    description: "대부분의 한국 청주는 이 구간에서 가장 담백하고 균형 있게 열린다."
                },
                {
                    temp: "사케 5~15℃ 또는 40℃ 전후",
                    description: "사케는 스타일에 따라 냉주와 온주 모두 선택지가 넓다."
                }
            ],
            methods: [
                {
                    name: "한식과의 비교 시음",
                    description: "같은 음식에 청주와 사케를 나란히 두고 마시면 질감과 감칠맛의 차이가 가장 빨리 드러난다."
                }
            ]
        },
        foodPairing: [
            "청주: 전, 회, 맑은 국물 요리",
            "사케: 초밥, 사시미, 텐푸라",
            "공통: 흰살생선과 담백한 단백질 요리"
        ],
        faqs: [
            {
                question: "청주와 사케는 같은 술인가요?",
                answer: "아니다. 둘 다 맑은 쌀술로 보일 수 있지만 한국 청주는 한국식 맑은술 맥락에서, 사케는 일본 니혼슈 맥락에서 이해해야 한다."
            },
            {
                question: "사이트에서는 왜 둘 다 청주 카테고리처럼 보일 수 있나요?",
                answer: "법적 분류값은 유지하기 때문이다. 대신 실제 위키와 추천 로직에서는 서브카테고리를 읽어 한국 청주와 사케를 분리해 보여준다."
            },
            {
                question: "입문자는 무엇부터 마시면 좋나요?",
                answer: "한식 식사와 함께라면 청주, 향이 화려한 스타일 차를 느끼고 싶다면 사케 쪽이 더 직관적이다."
            }
        ],
        dbSubcategoryKeywords: ['한국 청주', '청주', '사케', '사케(니혼슈)', '준마이', '긴조', '다이긴조', 'Cheongju', 'Sake'],
        dbSubcategoryKeywordGroups: [
            ['한국 청주', '청주', 'Korean Cheongju', 'Cheongju'],
            ['사케', '사케(니혼슈)', '준마이', '긴조', '다이긴조', 'Sake', 'Junmai', 'Ginjo', 'Daiginjo'],
        ],
    },
    sectionsEn: {
        definition: "Cheongju and Sake can look similar at first glance because both are clear rice-based alcoholic drinks, but they sit in different cultural and brewing systems. Korean Cheongju should be understood within Korea's legal and traditional clear-rice-wine context, while Sake belongs to Japan's highly structured Nihonshu world shaped by polishing ratios, grade language, and temperature-specific service.",
        history: "Historically, Cheongju in Korea referred broadly to clear rice wine, while Sake in Japan evolved with a much more explicit vocabulary around polishing, grades, and aromatic styles. Modern drinkers often meet both as 'clean rice wines,' but the production logic and the intended drinking experience are not the same.",
        classifications: [
            {
                name: "Brewing Framework",
                criteria: "Cheongju = Korean clear-rice-wine context / Sake = Japanese Nihonshu framework",
                description: "Cheongju is best read through Korean legal and traditional rice-wine language. Sake is better understood through terms like Junmai, Ginjo, and Daiginjo."
            },
            {
                name: "Flavor Architecture",
                criteria: "Cheongju = restraint and meal-friendliness / Sake = style-driven aromatic range",
                description: "Cheongju often excels through calm rice umami and table-friendly balance. Sake more often emphasizes aromatic tiers and a wider spectrum of delicate stylistic differences."
            },
            {
                name: "Drinking Context",
                criteria: "Cheongju = Korean meal table / Sake = temperature and course pairing culture",
                description: "Cheongju shows its strengths quickly with Korean dishes. Sake offers a broader service language, including chilled, room-temperature, and warmed expressions."
            },
            {
                name: "Buying Signals",
                criteria: "Cheongju = filtration and umami / Sake = grade, polishing, and style terms",
                description: "For Cheongju, focus on clarity, savory depth, and meal use. For Sake, start with grade and aromatic profile for easier selection."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Aromatic Intensity",
                label: "Aroma Lift",
                value: "Cheongju < Sake (in general)",
                description: "In broad terms, Sake tends to show more explicit aromatic styling and more dramatic category language around it."
            },
            {
                metric: "Meal Versatility",
                label: "Table Use",
                value: "Both high / Cheongju especially strong with Korean food",
                description: "Both are versatile, but Cheongju often feels particularly natural next to Korean savory dishes."
            }
        ],
        coreIngredients: [
            {
                type: "Cheongju side",
                name: "Koji-led fermentation, filtration, restrained balance",
                description: "These are the main clues to understanding Korean clear rice wine as a table-oriented style."
            },
            {
                type: "Sake side",
                name: "Polishing ratio, Nihonshu grades, aroma design",
                description: "These are the most useful signals when reading how a Sake bottle will likely behave."
            }
        ],
        manufacturingProcess: [
            {
                step: "Compare 1",
                name: "Read Cheongju through Korean clear-rice-wine logic",
                description: "Legal classification, local meal culture, and savory balance matter more than Japanese-style grade language."
            },
            {
                step: "Compare 2",
                name: "Read Sake through grade and service style",
                description: "Junmai, Ginjo, and Daiginjo terms often tell you more directly what aromatic experience to expect."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Small white-wine glass or thin-walled sake glass",
            optimalTemperatures: [
                {
                    temp: "Cheongju 10~14°C",
                    description: "This is the most reliable range for balanced Korean Cheongju service."
                },
                {
                    temp: "Sake 5~15°C or around 40°C",
                    description: "Sake has a much broader and more codified service-temperature range depending on style."
                }
            ],
            methods: [
                {
                    name: "Side-by-side food tasting",
                    description: "Pour both styles next to the same dish and the textural and aromatic differences become much easier to notice."
                }
            ]
        },
        foodPairing: [
            "Cheongju: jeon, sashimi, clear broths",
            "Sake: sushi, sashimi, tempura",
            "Shared zone: white fish and lightly seasoned proteins"
        ],
        faqs: [
            {
                question: "Are Cheongju and Sake the same thing?",
                answer: "No. They can look similar as clear rice wines, but Korean Cheongju and Japanese Sake belong to different brewing and cultural frameworks."
            },
            {
                question: "Why can both appear under the Cheongju umbrella on the site?",
                answer: "Because the site preserves the legal category data. The wiki and recommendation logic then use subcategories to separate Korean Cheongju from Sake in practice."
            },
            {
                question: "Which is better for beginners?",
                answer: "Cheongju is a smooth entry if you want a meal-friendly Korean context. Sake is a better starting point if you want to learn clearly labeled aromatic styles."
            }
        ],
        dbSubcategoryKeywords: ['한국 청주', '청주', '사케', '사케(니혼슈)', '준마이', '긴조', '다이긴조', 'Cheongju', 'Sake'],
        dbSubcategoryKeywordGroups: [
            ['한국 청주', '청주', 'Korean Cheongju', 'Cheongju'],
            ['사케', '사케(니혼슈)', '준마이', '긴조', '다이긴조', 'Sake', 'Junmai', 'Ginjo', 'Daiginjo'],
        ],
    },
}
