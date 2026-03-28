import { SpiritCategory } from './types'

export const yakju: SpiritCategory = {
    slug: 'yakju',
    dbCategories: ['약주'],
    emoji: '🍶',
    nameKo: '약주 (한국 전통 청주)',
    nameEn: 'Yakju (Korean Clear Rice Wine)',
    taglineKo: '쌀과 전통 누룩이 빚어낸 맑고 기품 있는 우리 술',
    taglineEn: 'The refined clarity and elegant complexity of Korean traditional rice wine',
    color: 'amber',
    sections: {
        definition: "한국식 청주(약주)는 쌀·물·전통 누룩(국)을 발효한 술덧에서 맑은 부분만 떠내거나 압착·여과해 얻는 ‘우리 맑은술’로, 일상에서는 청주라 부르지만 현행 주세법 체계에서는 대개 ‘약주’로 분류된다. 법적 구분의 핵심은 (1) 주세법 별표에서 ‘청주’는 원료 곡류를 쌀(찹쌀 포함)로 한정하고, (2) 주세법 시행령 [별표 3]에서 청주는 원료쌀 대비 전통 누룩 사용량을 1% 미만으로 제한하는 반면 전통 누룩을 1% 이상 쓰면 같은 맑은 술이라도 ‘약주’로 분류된다는 점이다.",
        history: "곡물로 빚은 술밑(밑술/술덧)에 ‘용수’를 박아 맑게 괸 술을 떠낸 것을 예로부터 ‘청주’라 했고, 조선시대에는 이 맑은 술을 ‘약주’라 부르기도 하며 제례·진상·상용주로 폭넓게 발전했다. 근대 이후 주세 제도 정비 과정에서 ‘청주’가 별도의 법정 주종으로 재정의되면서(원료·누룩 사용 기준 등) 전통 누룩 기반의 맑은 술은 법적으로 ‘약주’로 편입되어 용어 혼란이 생겼다. 최근에는 지역 전통주·무형유산·소규모 양조 활성화와 함께 전통 약주(=전통 청주)의 재현·현대화가 진행되며, 여과·살균·저장기술의 발전으로 스타일 스펙트럼이 넓어졌다.",
        classifications: [
            {
                name: "전통 약주형",
                criteria: "전분질 원료(주로 쌀/찹쌀) + 전통 누룩(복합 미생물 누룩) 사용",
                description: "쌀만 사용하는 경우 원료 중량 대비 전통 누룩을 1% 이상 사용하면 법적으로 ‘약주’로 분류된다. 전통 누룩의 곰팡이·효모·유산균이 함께 작용해 곡물의 고소함, 누룩 특유의 구수·흙내·요거트 같은 젖산 향, 감칠맛이 복합적으로 나타난다. 저온 장기 숙성 시 거친 향이 정리되고 꿀·견과·약재 뉘앙스가 더해져 ‘밥과 잘 맞는 맑은 술’로 완성된다."
            },
            {
                name: "입국 청주형",
                criteria: "쌀(찹쌀 포함) + 입국(쌀코지, 흩임누룩) 중심의 당화·발효",
                description: "전통 누룩은 원료쌀 대비 1% 미만 사용해야 법적 ‘청주’ 기준에 부합한다. 일본 사케와 유사한 ‘깨끗함·섬세함’이 핵심으로, 과일 에스터(배·사과·바나나 계열)와 은은한 꽃향, 깔끔한 피니시가 특징이다. 전통 누룩의 강한 복합 발효향은 상대적으로 약하고, 쌀의 단정한 단맛·감칠맛을 정교하게 조율하기 쉽다."
            },
            {
                name: "소곡주 (Sogokju)",
                criteria: "소곡(小麴) 또는 소형 누룩 발효제를 사용한 다단 담금 방식",
                description: "지역·가문 레시피에 따라 덧술 횟수·숙성 기간이 길다. 당화력이 높고 향이 진해 달콤한 향(꿀·찹쌀·꽃)과 부드러운 점성, 비교적 높은 도수가 잘 나타난다. 숙성을 거치면 약과·조청·견과류 같은 ‘한과’ 톤이 깊어져 기름진 한식(전, 수육)과 궁합이 좋다."
            },
            {
                name: "과하주 (Gwahaju)",
                criteria: "발효 중/후에 증류주를 혼합해 도수를 올린 전통 강화주",
                description: "달콤함과 농밀한 바디, 견과·말린 과일·카라멜 같은 산화 숙성 향이 두드러질 수 있다. 더운 계절의 변질을 막기 위한 지혜에서 발전한 방식으로, 단맛·도수·숙성감의 조합이 디저트/치즈/육포류 페어링에 강하다."
            },
            {
                name: "살균약주 (Pasteurized)",
                criteria: "63℃ 이상 열처리를 수행하여 미생물을 불활성화",
                description: "실무적으로 63℃ 이상에서 30분 또는 동등 이상의 효력으로 가열한다. 2차 발효나 혼탁 발생 위험이 줄어 유통稳定性이 확보된다. 대신 신선한 과일·꽃 향 일부가 둔화될 수 있으며, 곡물 고소함·숙성감이 더 또렷하게 느껴지는 경향이 있는 것이 장점이다."
            },
            {
                name: "비살균약주 (Raw / Fresh)",
                criteria: "열처리 없이 여과·병입하여 효모와 유산균이 잔존",
                description: "냉장 유통이 필수적이며 병내 변화 가능성이 높다. 갓 빚은 듯한 생동감(향의 선명함, 미세한 탄산감, 산미의 활력)이 매력이다. 다만 온도·시간에 따라 맛이 변할 수 있어 개봉 후에는 빠르게 음용하는 것이 좋다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수 (ABV)",
                label: "Strength",
                value: "12~18% (스타일에 따라 변동)",
                description: "도수가 높을수록 바디감과 온감이 증가하며, 단맛과 감칠맛이 더 진하게 느껴질 수 있다."
            },
            {
                metric: "탁도/맑기",
                label: "Clarity",
                value: "≤18 EBC (미탁 이하 기준)",
                description: "수치가 낮을수록 투명하며, 향이 섬세하고 질감이 가벼워지는 경향이 있다."
            },
            {
                metric: "잔당/드라이함",
                label: "Residual Sugar",
                value: "0~40 g/L (Dry ~ Semi-sweet)",
                description: "잔당이 낮으면 드라이하고 산미가 도드라지며, 높으면 부드러운 단맛과 점성이 증가한다."
            },
            {
                metric: "산도 및 pH",
                label: "Acidity",
                value: "Acidity 3.0~7.0 / pH 3.4~4.2",
                description: "산도가 높을수록 상큼하고 입맛을 돋우며, pH가 낮을수록 저장 안정성과 선명한 산미가 확보된다."
            },
            {
                metric: "감칠맛 (Umami)",
                label: "Amino Acidity",
                value: "Low to High",
                description: "아미노산이 많을수록 감칠맛과 바디가 증가하고, 숙성 시 견과/간장/버섯 같은 노트가 나타날 수 있다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "멥쌀 및 찹쌀",
                description: "멥쌀은 담백한 바디를, 찹쌀은 부드러운 질감과 달큰한 인상을 강화하며 꿀·한과 같은 풍미를 만든다."
            },
            {
                type: "발효제",
                name: "전통 누룩 및 입국(쌀코지)",
                description: "전통 누룩은 복합적인 개성을, 입국은 깔끔하고 정교한 스타일을 결정짓는 핵심 분기점이다."
            },
            {
                type: "수질 및 부재료",
                name: "양조용수 및 약재·꽃 등",
                description: "미네랄 함량에 따라 발효 속도가 달라지며, 꽃이나 솔잎 등 부재료는 계절감과 향의 확장성을 부여한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "전처리/발효",
                name: "고두밥 증자 및 다단 담금",
                description: "쌀의 전분을 젤라틴화하고 단계적으로 투입(이양/삼양)하여 효모의 스트레스를 줄이며 복합적인 향을 뽑아낸다."
            },
            { step: "발효 제어", name: "병행복발효 및 저온 관리", description: "당화와 발효가 동시에 진행되는 구조를 제어하며, 저온 발효를 통해 섬세한 과실 에스터와 산뜻한 피니시를 완성한다." },
            {
                step: "분리/마무리",
                name: "용수 채취 및 정밀 여과",
                description: "자연적인 용수 박기나 기계적 여과를 통해 미탁 이하의 투명도를 확보하고, 저온 숙성을 거쳐 맛을 안정화한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "작은 화이트 와인 글라스 또는 사케 전용 글라스",
            optimalTemperatures: [
                {
                    temp: "6~10℃ (차게)",
                    description: "산미와 청량감이 또렷해지고, 과일·꽃 향이 깔끔하게 올라온다. 드라이한 약주에 적합."
                },
                {
                    temp: "12~15℃ (서늘하게)",
                    description: "쌀의 단맛과 감칠맛이 균형을 이루는 구간으로, 대부분의 전통 약주에 범용적이다."
                },
                {
                    temp: "18~20℃ (상온)",
                    description: "바디감과 고소함, 숙성 뉘앙스가 가장 잘 드러나며 한식 반찬과의 페어링이 극대화된다."
                }
            ],
            methods: [
                {
                    name: "니트 (Neat)",
                    description: "고유의 맑은 색과 다층적인 향을 느끼며 천천히 머금어 시음하는 정석적인 방법이다."
                },
                {
                    name: "온주 (Warming)",
                    description: "35~40℃ 정도로 따뜻하게 데우면 단맛과 감칠맛이 부드럽게 확장되고 누룩의 구수함이 도드라진다."
                },
                {
                    name: "에어링 (Airing)",
                    description: "잔을 가볍게 돌려주면 저온 숙성 중 갇혀 있던 미세한 꽃 향과 과일 향이 더욱 선명하게 피어오른다."
                }
            ]
        },
        flavorTags: [
            { label: "찐쌀/고두밥", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "누룩/발효향", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "배/사과/꽃", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "요거트/젖산", color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
            { label: "조청/꿀", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "감칠맛/우마미", color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' }
        ],
        foodPairing: [
            "흰살 생선회 및 해산물 요리",
            "각종 전과 부침 (파전, 감자전 등)",
            "수육/보쌈 및 닭백숙",
            "간장게장 및 장아찌류",
            "한과/약과 또는 크림치즈 디저트"
        ],
        dbSubcategoryKeywords: ['약주', '전통 약주', '개량 약주', 'Yakju']
    },
    sectionsEn: {
        definition: "Korean Clear Rice Wine (Yakju/Cheongju) is a refined traditional spirit made by fermenting rice, water, and Nuruk (traditional starter), followed by a precise clarification or filtration process. While commonly called 'Cheongju' (clear wine), it is legally classified as 'Yakju' if the amount of traditional Nuruk used exceeds 1% of the rice weight, or 'Cheongju' if it is less than 1%—a distinction rooted in modern Korean liquor tax laws.",
        history: "Historically, the clear liquid gathered by inserting a 'Yongsu' (wicker cylinder) into a fermented mash (Suldut) was prized as Cheongju. During the Joseon Dynasty, it was also called 'Yakju' (medicinal wine) and widely used for ancestral rites, royal tributes, and daily enjoyment. Modern regulations redefined Cheongju based on specific Nuruk ratios, leading to the current legal distinction. Recently, a revival of regional heritage and small-scale breweries has modernized these traditional styles through advanced filtration and maturation techniques.",
        classifications: [
            {
                name: "Traditional Yakju Style",
                criteria: "Rice/Sweet rice + Traditional Nuruk (Complex wild microbes) > 1%",
                description: "The interaction of fungi, yeast, and lactic acid bacteria in traditional Nuruk creates a complex profile of toasted grain, earthy clay, and yogurt-like lactic notes. Long-term cold aging refines harsh aromas, introducing nuances of honey and nuts, making it the perfect 'meal-pairing clear wine.'"
            },
            {
                name: "Koji-based Cheongju Style",
                criteria: "Rice + Ipguk (Rice Koji) fermentation (Nuruk < 1%)",
                description: "A clean, delicate style similar to Japanese Sake. It emphasizes fruity esters (pear, apple, banana), subtle floral notes, and a crisp finish. It focuses on the elegant sweetness and umami of the rice itself, with less of the intense funky aromatics found in traditional Nuruk."
            },
            {
                name: "Sogokju",
                criteria: "Multiple-stage brewing using small or specialized Nuruk starters.",
                description: "Features a long fermentation and maturation period based on regional or family recipes. It is known for its high saccharification, resulting in a sweet, honey-like aroma, silky viscosity, and a relatively high ABV. Aging develops deep tones of grain syrup and nuts, pairing beautifully with rich Korean dishes like savory pancakes (Jeon) or boiled pork."
            },
            {
                name: "Gwahaju",
                criteria: "Fortified traditional wine where distilled spirits are added during/after fermentation.",
                description: "A wisdom-born style developed to prevent spoilage during hot seasons. It exhibits a dense body with oxidative aging notes like dried fruits, caramel, and nuts. Its balance of sweetness and higher proof makes it an excellent pairing for desserts, jerky, or aged cheeses."
            },
            {
                name: "Pasteurized Yakju",
                criteria: "Heat-treated at 63°C or higher to inactivate microbes.",
                description: "Ensures distribution stability by preventing secondary fermentation. While some delicate floral/fruit notes may be muted, the toasted grain character and maturation notes become more pronounced and stable over time."
            },
            {
                name: "Raw / Fresh Yakju",
                criteria: "Bottled without heat treatment, retaining live yeast and enzymes.",
                description: "Requires strictly chilled distribution. It offers a vibrant experience with vivid aromas, subtle natural carbonation, and lively acidity. The flavor evolves over time in the bottle, so it is best enjoyed fresh."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Strength",
                label: "ABV (%)",
                value: "12% ~ 18% (Variable by style)",
                description: "Higher ABV increases body and warmth, often enhancing the perception of sweetness and umami."
            },
            {
                metric: "Clarity",
                label: "Clarity",
                value: "≤18 EBC (Ultra-clear to Slight Haze)",
                description: "Lower values indicate higher transparency, which usually correlates with more delicate aromas and a lighter mouthfeel."
            },
            {
                metric: "Residual Sugar",
                label: "Residual Sugar",
                value: "0~40 g/L (Dry ~ Semi-sweet)",
                description: "Low sugar results in a dry profile where acidity shines; high sugar increases viscosity and a rounded, mellow sweetness."
            },
            {
                metric: "Acidity",
                label: "Acidity & pH",
                value: "Acidity 3.0~7.0 / pH 3.4~4.2",
                description: "Higher acidity provides a refreshing, appetite-stimulating quality, while lower pH ensures storage stability and a bright finish."
            },
            {
                metric: "Umami",
                label: "Amino Acidity",
                value: "Low to High",
                description: "Higher amino acid content increases savory richness and body, potentially developing notes of nuts, soy, or mushrooms during aging."
            }
        ],
        coreIngredients: [
            {
                type: "Primary Material",
                name: "Non-glutinous & Glutinous Rice",
                description: "Non-glutinous rice provides a clean body, while glutinous (sweet) rice enhances the silky texture and honey-like sweetness."
            },
            {
                type: "Fermentation Starter",
                name: "Nuruk (Traditional) vs. Ipguk (Koji)",
                description: "Traditional Nuruk provides complex, wild character; Ipguk (Koji) allows for a cleaner, more precisely controlled style."
            },
            {
                type: "Water & Adjuncts",
                name: "Brewing Water & Botanicals",
                description: "Mineral content affects fermentation speed. Additions like pine needles or flowers add seasonal elegance and aromatic expansion."
            }
        ],
        manufacturingProcess: [
            {
                step: "Pre-treatment/Fermentation",
                name: "Steamed Rice & Multiple-stage Brewing",
                description: "Rice is gelatinized (Godubap) and added in stages (Damyang) to reduce yeast stress and extract complex aromatic layers."
            },
            {
                step: "Fermentation Control",
                name: "Parallel Multiple Fermentation",
                description: "Simultaneous saccharification and fermentation are carefully managed at low temperatures to preserve delicate esters and a clean finish."
            },
            {
                step: "Clarification/Finishing",
                name: "Clarification & Fine Filtration",
                description: "Clear liquid is gathered using traditional methods or mechanical filtration, followed by cold maturation for flavor stabilization."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Small White Wine Glass or Specialty Sake Glass",
            optimalTemperatures: [
                {
                    temp: "6~10°C (Chilled)",
                    description: "Accentuates acidity and crispness, highlighting clean fruit and floral notes. Best for dry styles."
                },
                {
                    temp: "12~15°C (Cool)",
                    description: "The 'sweet spot' for most traditional Yakju, where rice sweetness and umami achieve perfect balance."
                },
                {
                    temp: "18~20°C (Room Temp)",
                    description: "Maximizes body, toasted notes, and aging nuances. Ideal for pairing with heavy Korean side dishes."
                }
            ],
            methods: [
                {
                    name: "Neat",
                    description: "The standard way to appreciate the clear color and multi-layered aromas through slow sipping."
                },
                {
                    name: "Warming (Onju)",
                    description: "Gently heating to 35–40°C expands the sweetness and umami while bringing the toasted Nuruk scent to the forefront."
                },
                {
                    name: "Airing",
                    description: "Swirling the glass helps release delicate fruit and floral notes that may have been 'locked' during cold storage."
                }
            ]
        },
        flavorTags: [
            { label: "Steamed Rice", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "Nuruk/Fermented", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "Pear/Apple/Floral", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "Yogurt/Lactic", color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
            { label: "Honey/Grain Syrup", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "Umami/Savory", color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' }
        ],
        foodPairing: [
            "White-fleshed Sashimi and Raw Seafood",
            "Savory Korean Pancakes (Jeon) and Fritters",
            "Boiled Pork (Suyuk) or Ginseng Chicken Soup",
            "Soy-marinated Crab and Pickled Vegetables",
            "Traditional Confections (Hangwa) or Cream Cheese"
        ],
        faqs: [
            {
                question: "What is Yakju?",
                answer: "Yakju is a refined, traditional Korean clear rice wine. After fermenting rice, water, and Nuruk (starter culture), the murky solids are filtered out or allowed to settle, leaving a clear, golden liquid that offers elegant, multi-layered aromas."
            },
            {
                question: "What is the difference between Yakju and Cheongju?",
                answer: "Historically, both refer to the same traditional clear rice wine. However, under modern South Korean liquor tax laws, if the wine uses more than 1% traditional Nuruk (wild starter), it is legally classified as 'Yakju.' If it uses less than 1% (often relying on Japanese-style Koji), it is legally 'Cheongju.'"
            },
            {
                question: "How does Yakju compare to Sake?",
                answer: "Both are clear rice wines, but traditional Yakju relies on 'Nuruk', introducing complex wild microbes and lactic acid bacteria. This gives Yakju a nuttier, tangier, and more earthy 'umami' profile compared to the highly refined, delicate fruit-forward typicality of Sake."
            }
        ],
        dbSubcategoryKeywords: ['약주', '전통 약주', '개량 약주', 'Yakju']
    }
}
