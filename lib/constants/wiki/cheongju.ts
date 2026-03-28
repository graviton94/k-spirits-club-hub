import { SpiritCategory } from './types'

export const cheongju: SpiritCategory = {
    slug: 'cheongju',
    dbCategories: ['청주'],
    emoji: '🍶',
    nameKo: '청주 (한국 맑은술)',
    nameEn: 'Cheongju (Korean Clear Rice Wine)',
    taglineKo: '입국과 정교한 여과로 완성하는 담백하고 또렷한 한국식 맑은술',
    taglineEn: 'A polished Korean clear rice wine style shaped by koji-led fermentation and precise clarity',
    color: 'cyan',
    sections: {
        definition: "이 페이지의 '청주'는 한국식 맑은술 스타일을 설명하기 위한 위키 구분이다. 사이트의 제품 데이터에서는 법적·행정 분류를 그대로 유지하기 위해 '청주' 카테고리를 건드리지 않으며, 그 안에서 '한국 청주'와 '사케'를 서브카테고리로 나누어 안내한다. 일반적으로 한국 청주는 쌀과 물, 입국(쌀코지) 중심의 당화·발효와 정교한 여과를 통해 맑고 단정한 향미를 보여주는 스타일을 뜻한다.",
        history: "조선시대의 청주는 술덧에서 맑은 부분을 떠낸 고급 맑은술 전반을 가리키는 말로 널리 쓰였다. 근대 이후 주세 제도 정비와 함께 원료·누룩 사용 기준이 법정 주종을 가르는 핵심 요소가 되었고, 오늘날에는 같은 '맑은 술'이라도 전통 누룩 비중에 따라 약주와 청주가 갈린다. 최근에는 한국 청주를 사케와 구별되는 로컬 스타일로 해석하려는 시도가 늘면서, 저온 발효와 여과 기술을 바탕으로 담백함·쌀 향·식중주 적합성을 강조한 제품들이 주목받고 있다.",
        classifications: [
            {
                name: "입국 기반 한국 청주",
                criteria: "쌀 + 입국(쌀코지) 중심 당화·발효 + 맑은 여과",
                description: "가장 현대적인 한국 청주 해석이다. 배·사과 같은 은은한 과실 향과 깨끗한 피니시, 부드러운 쌀 감칠맛이 특징이며, 깔끔한 식중주로 쓰기 좋다."
            },
            {
                name: "드라이 청주",
                criteria: "낮은 잔당, 산뜻한 산미, 짧고 단정한 피니시",
                description: "회, 샐러드, 두부 요리처럼 섬세한 음식과 잘 맞는다. 차게 마셨을 때 청량감이 살아나고, 향보다는 구조감과 입안의 정갈함이 돋보인다."
            },
            {
                name: "감칠맛 중심 청주",
                criteria: "중간 이상의 아미노산도, 곡물감과 우마미 강조",
                description: "온도가 올라갈수록 쌀의 단맛과 국물 요리와의 궁합이 살아난다. 전, 찜, 조림류와 매칭하기 좋은 스타일이다."
            },
            {
                name: "비살균 생청주",
                criteria: "열처리 없이 병입, 냉장 유통 전제",
                description: "갓 빚은 듯한 생동감과 더 뚜렷한 향을 보여준다. 다만 시간과 온도에 따라 향미 변화가 빠르므로 보관과 음용 타이밍이 중요하다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수 (ABV)",
                label: "Strength",
                value: "12~16%",
                description: "도수가 높아질수록 온감과 바디가 올라가고, 낮을수록 산뜻한 식중주 성격이 강조된다."
            },
            {
                metric: "맑기 / 탁도",
                label: "Clarity",
                value: "투명 ~ 약한 미탁",
                description: "맑기가 높을수록 향이 단정하게 느껴지고, 질감은 가벼워지는 경향이 있다."
            },
            {
                metric: "잔당 / 드라이함",
                label: "Residual Sugar",
                value: "Dry ~ Off-dry",
                description: "잔당이 낮으면 해산물과의 페어링이 쉬워지고, 약간의 잔당이 있으면 쌀의 부드러운 인상이 살아난다."
            },
            {
                metric: "감칠맛",
                label: "Umami",
                value: "Low to Medium",
                description: "우마미가 높아질수록 한식 반찬과의 접점이 넓어지고, 상온에서 풍미가 더 입체적으로 열린다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "멥쌀 및 찹쌀",
                description: "멥쌀은 단정하고 깔끔한 바디를, 찹쌀은 더 부드러운 질감과 은은한 단맛을 만든다."
            },
            {
                type: "당화·발효",
                name: "입국(쌀코지)과 효모",
                description: "입국은 깨끗한 쌀 단맛과 과실 에스터를 정교하게 끌어내며, 스타일을 사케와 닮게 만들면서도 한국식 물성과 페어링 방향을 만든다."
            },
            {
                type: "마무리",
                name: "정밀 여과와 저온 안정화",
                description: "맑은 인상과 유통 안정성을 결정하는 마지막 단계로, 텍스처와 향의 선명도를 크게 좌우한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "준비",
                name: "쌀 세척·침지·증자",
                description: "쌀의 수분 흡수율을 정교하게 맞춰 깨끗한 당화와 발효 기반을 만든다."
            },
            {
                step: "발효",
                name: "입국 중심 병행복발효",
                description: "저온 구간을 안정적으로 유지해 쌀의 단정한 단맛과 사과·배 계열 향을 보존한다."
            },
            {
                step: "마감",
                name: "압착·여과·숙성",
                description: "압착 후 미세 여과와 저온 안정화를 거치며, 스타일에 따라 생청주 또는 살균 청주로 완성된다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "작은 화이트 와인 글라스 또는 얇은 사케 글라스",
            optimalTemperatures: [
                {
                    temp: "6~9℃",
                    description: "드라이한 청주와 생청주에서 청량감, 산미, 과실 향을 또렷하게 보여준다."
                },
                {
                    temp: "10~14℃",
                    description: "대부분의 한국 청주가 가장 균형 있게 느껴지는 구간으로, 쌀의 감칠맛과 깔끔함이 함께 산다."
                },
                {
                    temp: "16~18℃",
                    description: "감칠맛 중심 스타일이나 상차림과 곁들이는 식중주에서 바디와 곡물감이 더 잘 열린다."
                }
            ],
            methods: [
                {
                    name: "니트 (Neat)",
                    description: "여과된 질감과 쌀 향의 균형을 가장 정확하게 파악하기 좋은 방식이다."
                },
                {
                    name: "가벼운 에어링",
                    description: "잔을 한두 번 돌리면 차갑게 잠겨 있던 배·사과·꽃 향이 부드럽게 열린다."
                },
                {
                    name: "식중주 서빙",
                    description: "짠맛, 감칠맛, 담백함이 있는 한식과 함께할 때 청주의 장점이 가장 선명하게 드러난다."
                }
            ]
        },
        flavorTags: [
            { label: "배/사과", color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
            { label: "은은한 꽃향", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "맑은 쌀향", color: 'bg-slate-100 text-slate-900 dark:bg-slate-900/40 dark:text-slate-100' },
            { label: "드라이한 피니시", color: 'bg-cyan-100 text-cyan-950 dark:bg-cyan-900/40 dark:text-cyan-100' },
            { label: "감칠맛", color: 'bg-amber-100 text-amber-950 dark:bg-amber-900/40 dark:text-amber-100' },
            { label: "식중주 밸런스", color: 'bg-indigo-100 text-indigo-950 dark:bg-indigo-900/40 dark:text-indigo-100' }
        ],
        foodPairing: [
            "흰살생선회와 가벼운 해산물 요리",
            "두부, 계란찜, 담백한 전 요리",
            "맑은 국물 전골과 조개찜",
            "간장 베이스의 한식 반찬",
            "은은한 염도의 치즈와 크래커"
        ],
        faqs: [
            {
                question: "청주와 사케는 같은 카테고리인가요?",
                answer: "사이트 데이터에서는 법적 분류를 유지하기 위해 둘 다 '청주' 카테고리 아래에 있을 수 있지만, 위키에서는 한국 청주와 일본 사케를 서브카테고리와 스타일 관점에서 구분해 설명한다."
            },
            {
                question: "청주와 약주는 어떻게 다른가요?",
                answer: "전통 누룩 사용 비율과 법적 분류 기준이 핵심 차이다. 실무적으로는 약주가 더 전통 누룩의 복합 향을, 청주는 더 맑고 단정한 입국 기반 스타일을 보여주는 경우가 많다."
            },
            {
                question: "청주는 차게 마시는 게 좋나요?",
                answer: "대부분의 한국 청주는 10~14℃에서 가장 균형이 좋지만, 드라이한 스타일은 더 차게, 감칠맛 중심 스타일은 약간 높은 온도에서 더 잘 열린다."
            }
        ],
        dbSubcategoryKeywords: ['한국 청주', '청주', 'Korean Cheongju', 'Cheongju']
    },
    sectionsEn: {
        definition: "This page uses 'Cheongju' to explain the Korean clear-rice-wine style. In the site database, we keep the legal and administrative category as Cheongju, then separate products under that umbrella with subcategories such as 'Korean Cheongju' and 'Sake'. In practice, Korean Cheongju usually refers to a clean, filtered rice wine style built around ipguk (rice koji), polished fermentation control, and a precise, food-friendly profile.",
        history: "Historically, Cheongju referred broadly to the clear portion drawn from a fermented rice mash. Modern tax law later turned ingredient and starter usage into legal dividing lines, which is why today's Korean market can contain both Yakju-like heritage discussions and Sake-like clean brewing styles under adjacent terminology. More recently, Korean breweries have revisited Cheongju as a local style of clear rice wine, emphasizing crisp structure, rice aroma, and compatibility with Korean cuisine.",
        classifications: [
            {
                name: "Ipguk-based Korean Cheongju",
                criteria: "Rice + rice koji-led saccharification and fermentation + clear filtration",
                description: "The most modern interpretation of Korean Cheongju. Expect restrained pear and apple notes, a tidy finish, and gentle rice-driven umami that works beautifully at the table."
            },
            {
                name: "Dry Cheongju",
                criteria: "Lower residual sugar, brisk acidity, short and neat finish",
                description: "Ideal for sashimi, salads, tofu dishes, and other delicate foods. Chilling highlights the clean structure and crisp texture."
            },
            {
                name: "Umami-forward Cheongju",
                criteria: "Moderate amino-acid depth with grainy savory texture",
                description: "As the temperature rises, rice sweetness and savory depth become more expressive. This style pairs especially well with pancakes, braises, and richer Korean side dishes."
            },
            {
                name: "Nama / Fresh Cheongju",
                criteria: "Unpasteurized bottling with chilled distribution",
                description: "Shows brighter aromatics and a freshly brewed feel. It is vivid and expressive, but more sensitive to storage temperature and time."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Strength",
                label: "ABV (%)",
                value: "12% ~ 16%",
                description: "Higher ABV adds warmth and body, while lower ABV keeps the style lighter and easier to use as a meal-friendly pour."
            },
            {
                metric: "Clarity",
                label: "Clarity",
                value: "Crystal clear ~ light haze",
                description: "The clearer the wine, the more restrained and precise the aromatic impression tends to be."
            },
            {
                metric: "Residual Sugar",
                label: "Dryness",
                value: "Dry ~ Off-dry",
                description: "Drier versions shine with seafood, while a touch of sweetness helps the rice character feel softer and rounder."
            },
            {
                metric: "Umami",
                label: "Savory Depth",
                value: "Low to Medium",
                description: "More umami broadens pairing flexibility and makes the wine open up further at cool-room temperatures."
            }
        ],
        coreIngredients: [
            {
                type: "Primary Material",
                name: "Non-glutinous and Glutinous Rice",
                description: "Non-glutinous rice keeps the profile clean and linear, while glutinous rice can soften the texture and add subtle sweetness."
            },
            {
                type: "Saccharification & Fermentation",
                name: "Ipguk (Rice Koji) and Yeast",
                description: "Rice koji supports a polished, fruit-leaning fermentation profile and helps define Korean Cheongju as distinct from both Yakju and Sake in presentation."
            },
            {
                type: "Finishing",
                name: "Fine Filtration and Cold Stabilization",
                description: "These steps shape the final clarity, shelf stability, and tactile precision of the finished wine."
            }
        ],
        manufacturingProcess: [
            {
                step: "Preparation",
                name: "Washing, Soaking, and Steaming Rice",
                description: "Moisture control is tuned carefully to support clean saccharification and an even fermentation curve."
            },
            {
                step: "Fermentation",
                name: "Koji-led Parallel Fermentation",
                description: "Low-temperature control preserves restrained rice sweetness and subtle pear-apple aromatics."
            },
            {
                step: "Finishing",
                name: "Pressing, Filtration, and Resting",
                description: "The wine is pressed, clarified, and stabilized, then finished either as a fresh unpasteurized style or a more shelf-stable pasteurized bottling."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Small white-wine glass or a thin-walled sake glass",
            optimalTemperatures: [
                {
                    temp: "6~9°C",
                    description: "Best for drier or fresh styles where crispness and bright fruit should take the lead."
                },
                {
                    temp: "10~14°C",
                    description: "The sweet spot for most Korean Cheongju, balancing rice umami with precision and freshness."
                },
                {
                    temp: "16~18°C",
                    description: "A good range for more savory, meal-oriented expressions that need a little more openness."
                }
            ],
            methods: [
                {
                    name: "Neat",
                    description: "The cleanest way to assess filtration texture, rice aroma, and overall balance."
                },
                {
                    name: "Light Aeration",
                    description: "A gentle swirl releases pear, apple, and floral tones that can stay tucked in when heavily chilled."
                },
                {
                    name: "Table Service",
                    description: "Cheongju shows its best side alongside savory, salty, and delicately seasoned Korean dishes."
                }
            ]
        },
        flavorTags: [
            { label: "Pear/Apple", color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
            { label: "Soft Floral", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "Clean Rice", color: 'bg-slate-100 text-slate-900 dark:bg-slate-900/40 dark:text-slate-100' },
            { label: "Dry Finish", color: 'bg-cyan-100 text-cyan-950 dark:bg-cyan-900/40 dark:text-cyan-100' },
            { label: "Umami", color: 'bg-amber-100 text-amber-950 dark:bg-amber-900/40 dark:text-amber-100' },
            { label: "Meal-friendly", color: 'bg-indigo-100 text-indigo-950 dark:bg-indigo-900/40 dark:text-indigo-100' }
        ],
        foodPairing: [
            "White-fleshed sashimi and light seafood dishes",
            "Tofu, steamed egg, and delicate Korean pancakes",
            "Clear broths and shellfish hot pots",
            "Soy-based Korean side dishes",
            "Mild cheeses and crackers"
        ],
        faqs: [
            {
                question: "Are Cheongju and Sake the same category here?",
                answer: "In the database, both can sit under the legal Cheongju umbrella. In the wiki, we separate Korean Cheongju and Japanese Sake by subcategory and style so users can understand the difference more clearly."
            },
            {
                question: "How is Cheongju different from Yakju?",
                answer: "The biggest distinction comes from starter usage and legal classification. In practice, Yakju often leans more traditional and Nuruk-driven, while Cheongju usually presents a cleaner, more filtered rice-wine style."
            },
            {
                question: "Should Cheongju always be served cold?",
                answer: "Not always. Most bottles show the best balance around 10 to 14°C, but drier styles can go colder and savory styles can benefit from a slightly warmer pour."
            }
        ],
        dbSubcategoryKeywords: ['한국 청주', '청주', 'Korean Cheongju', 'Cheongju']
    }
}
