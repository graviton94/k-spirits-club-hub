import { SpiritCategory } from './types'

export const vodka: SpiritCategory = {
    slug: 'vodka',
    dbCategories: ['일반증류주'],
    emoji: '❄️',
    nameKo: '보드카',
    nameEn: 'Vodka',
    taglineKo: '무색·무취의 순수함, 모든 칵테일의 투명한 캔버스',
    taglineEn: 'Crystal-clear and neutral — the ultimate cocktail canvas',
    color: 'sky',
    sections: {
        definition: "보드카(Vodka)는 곡물·감자·포도 등 농산물을 발효한 뒤 고도수로 증류(정류)해 향·불순물을 최소화하고, 물로 희석해 병입하는 무색의 ‘중성(Neutral) 증류주’다. 기본 철학은 깨끗하고 드라이한 프로파일이지만, 원료(곡물/감자/포도), 증류 강도, 여과 과정에 따라 미세한 질감과 풍미의 차이가 발생한다.",
        history: "보드카의 뿌리는 동유럽(러시아·폴란드)에서 중세 말에 확산된 증류 문화에서 시작되었다. 19세기 연속식 증류 기술의 발전으로 ‘향이 적고 깨끗한’ 현대적 스타일이 완성되었으며, 20세기 중반 이후 칵테일 문화의 폭발적 성장과 함께 세계에서 가장 많이 소비되는 베이스 스피릿으로 자리 잡았다.",
        classifications: [
            {
                name: "곡물(Grain) 보드카",
                criteria: "밀·호밀·옥수수 등 곡물 전분 기반",
                description: "가장 대중적인 스타일로, 밀 기반은 크리미한 질감을, 호밀 기반은 은은한 후추 같은 스파이스를, 옥수수 기반은 둥글고 가벼운 단맛 인상을 특징으로 한다."
            },
            {
                name: "감자(Potato) 보드카",
                criteria: "감자 전분 발효 및 증류",
                description: "질감이 더 두툼하고 무게감 있게 느껴지며, 특유의 흙내음이나 고소함이 동반되기도 한다. 스트레이트나 온더락으로 즐길 때 질감의 매력이 가장 잘 드러난다."
            },
            {
                name: "포도/와인 보드카",
                criteria: "포도 또는 와인 부산물 증류",
                description: "중성적인 특성을 유지하면서도 질감이 실키하고 미세한 과일·꽃 향의 잔향이 남는다. 드라이한 마티니 칵테일 베이스로 뛰어난 궁합을 보여준다."
            },
            {
                name: "플레이버드(Flavored) 보드카",
                criteria: "천연/합성 향료나 과일 등을 첨가하여 풍미 부여",
                description: "레몬, 바닐라, 베리 등 명확한 향을 지니고 있어 칵테일 제조가 용이하다. 가당 여부에 따라 제품별로 바디감과 단맛의 차이가 크다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수",
                label: "ABV (%)",
                value: "37.5% ~ 40% (표준)",
                description: "40%는 칵테일의 구조감을 지지하는 표준 도수이며, 프리미엄 보드카는 높은 도수에서도 알코올 자극이 적고 매끄러운 것이 특징이다."
            },
            {
                metric: "중성도",
                label: "Neutrality",
                value: "Extremely High",
                description: "반복적인 증류와 여과를 통해 불순물을 제거하여 어떤 믹서와 섞여도 그 본연의 맛을 방해하지 않는 투명한 성격을 가진다."
            },
            {
                metric: "질감/바디",
                label: "Mouthfeel",
                value: "Silky to Heavy",
                description: "원료와 여과 방식에 따라 혀끝에서 느껴지는 미끈함이나 무게감이 결정된다. 연수를 사용할수록 부드러운 목넘김을 선사한다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "농산물 (밀, 호밀, 감자, 포도 등)",
                description: "전분질이 풍부한 농산물을 발효하여 알코올을 얻는다. 원료에 따라 최종적인 질감과 미세한 풍미의 결이 결정된다."
            },
            {
                type: "정제제",
                name: "활성탄 (Charcoal)",
                description: "자작나무 숯 등을 통해 향과 불순물을 흡착 정제하여 극한의 순수함과 매끄러운 질감을 부여한다."
            },
            {
                type: "희석수",
                name: "정밀 여과수 (Soft Water)",
                description: "보드카의 절반 이상을 차지하는 물의 미네랄 설계가 목넘김의 부드러움을 완성한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "증류",
                name: "연속식 정류 (Rectification)",
                description: "컬럼 스틸에서 알코올 순도를 95% 이상으로 정류하여 원료의 잡향과 잡미를 완벽히 제거한다."
            },
            {
                step: "여과",
                name: "차콜 필터링 (Filtration)",
                description: "증류 원액을 활성탄 층에 수 차례 통과시켜 미세한 불순물까지 정제하고 질감을 부드럽게 깎아낸다."
            },
            {
                step: "안정화",
                name: "가수 및 휴지 (Resting)",
                description: "준비된 물을 섞어 도수를 맞춘 뒤, 일정 기간 안정화하여 물과 알코올이 완벽히 융합되도록 유도한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "작은 튤립잔, 샷 글라스 또는 마티니 글라스",
            optimalTemperatures: [
                {
                    temp: "-2~4℃ (극저온)",
                    description: "냉동실에 보관해 질감이 걸쭉해진 보드카는 알코올의 공격성이 줄고 극한의 청량감을 준다."
                },
                {
                    temp: "6~10℃",
                    description: "원료의 미세한 질감이나 고품질 보드카의 섬세한 향을 느끼기에 적합한 온도다."
                }
            ],
            methods: [
                {
                    name: "프로스트 샷 (Chilled Shot)",
                    description: "스트레이트로 마실 때는 잔과 잔을 모두 차갑게 얼려 원샷하기보다 입안에 머금어 질감을 느끼는 것이 좋다."
                },
                {
                    name: "보드카 마티니 (Cocktail Base)",
                    description: "베르무트와 결합해 깨끗하고 드라이한 미학을 보여준다. 가니시(올리브, 레몬)에 따라 향미가 극명하게 갈린다."
                },
                {
                    name: "보드카 토닉 / 하이볼",
                    description: "탄산수나 토닉워터를 믹싱하여 가장 청량하게 즐기는 대중적인 음용 방식이다."
                }
            ]
        },
        flavorTags: [
            { label: "클린/뉴트럴", color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
            { label: "매끄러운 질감", color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
            { label: "은은한 단맛", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "알싸한 후추", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "크리미/실키", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "미네랄리티", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' }
        ],
        foodPairing: [
            "진하고 기름진 안주 (삼겹살, 훈제 오리)",
            "훈제 연어 및 캐비어",
            "염장 피클 및 사워크라우트",
            "호밀빵과 블리니",
            "짭짤한 하드 치즈"
        ]
    },
    sectionsEn: {
        definition: "Vodka is a colorless 'Neutral Spirit' produced by fermenting and distilling agricultural raw materials—such as grains, potatoes, or grapes—to a high proof to minimize impurities and aromatics. While its core philosophy is a clean and dry profile, subtle variations in texture and flavor emerge depending on the base material, distillation intensity, and filtration process.",
        history: "Vodka's roots lie in the distillation cultures of Eastern Europe (Russia and Poland) that spread during the late Middle Ages. The development of continuous distillation in the 19th century perfected the modern 'low-aroma, ultra-clean' style. Since the mid-20th century, it has become the world's most consumed base spirit, fueled by the explosive growth of cocktail culture.",
        classifications: [
            {
                name: "Grain Vodka",
                criteria: "Based on starches from wheat, rye, or corn.",
                description: "The most popular style. Wheat-based vodkas offer a creamy texture, rye-based versions provide a subtle peppery spice, and corn-based spirits lean toward a rounded, light sweetness."
            },
            {
                name: "Potato Vodka",
                criteria: "Fermentation and distillation of potato starch.",
                description: "Features a heavier, more viscous mouthfeel with distinctive earthy or nutty undertones. Its textural appeal is best appreciated when served neat or on the rocks."
            },
            {
                name: "Grape/Wine Vodka",
                criteria: "Distilled from grapes or wine by-products.",
                description: "Maintains neutrality while offering a silky texture and delicate floral or fruity echoes. It pairs exceptionally well as a base for dry Martinis."
            },
            {
                name: "Flavored Vodka",
                criteria: "Infused with natural or artificial flavorings and fruits.",
                description: "Includes clear notes of lemon, vanilla, or berries, making cocktail preparation effortless. Body and sweetness vary significantly depending on whether sugar is added."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Alcohol by Volume",
                label: "ABV (%)",
                value: "37.5% ~ 40% (Standard)",
                description: "40% is the standard proof for supporting cocktail structure. Premium vodkas are characterized by low alcoholic burn and a smooth finish even at higher proofs."
            },
            {
                metric: "Neutrality",
                label: "Neutrality",
                value: "Extremely High",
                description: "Repeated distillation and filtration remove impurities, creating a transparent character that doesn't interfere with the flavor of any mixer."
            },
            {
                metric: "Mouthfeel/Body",
                label: "Mouthfeel",
                value: "Silky to Heavy",
                description: "Texture is determined by the raw material and filtration method. The use of soft water contributes to an exceptionally smooth swallow."
            }
        ],
        coreIngredients: [
            {
                type: "Primary Material",
                name: "Agricultural Base (Wheat, Rye, Potato, Grape, etc.)",
                description: "Starch-rich raw materials are fermented to produce alcohol. The choice of base dictates the final texture and subtle flavor nuances."
            },
            {
                type: "Purification Agent",
                name: "Activated Charcoal",
                description: "Often derived from birch wood, charcoal adsorbs odors and impurities, imparting extreme purity and a polished texture."
            },
            {
                type: "Dilution Water",
                name: "Precision Filtered Soft Water",
                description: "Since water accounts for over half of the bottle, its mineral profile is crucial for achieving a smooth, effortless throat-feel."
            }
        ],
        manufacturingProcess: [
            {
                step: "Distillation",
                name: "Continuous Rectification",
                description: "Alcohol is rectified in column stills to over 95% purity to completely eliminate off-notes and aromas from the raw materials."
            },
            {
                step: "Filtration",
                name: "Charcoal Filtering",
                description: "The distillate is passed through layers of activated charcoal multiple times to refine micro-impurities and soften the texture."
            },
            {
                step: "Stabilization",
                name: "Dilution & Resting",
                description: "Purified water is added to reach the target proof, followed by a resting period to allow the water and alcohol molecules to bond perfectly."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Small Tulip Glass, Shot Glass, or Martini Glass",
            optimalTemperatures: [
                {
                    temp: "-2~4°C (Ice Cold)",
                    description: "Stored in the freezer, the vodka's texture becomes syrupy, reducing alcoholic bite and providing extreme refreshment."
                },
                {
                    temp: "6~10°C",
                    description: "Suitable for appreciating the subtle texture or delicate aromatics of high-quality premium vodkas."
                }
            ],
            methods: [
                {
                    name: "Frosted Shot",
                    description: "When drinking neat, both the glass and the bottle should be frozen. Sip to feel the texture rather than just downing the shot."
                },
                {
                    name: "Vodka Martini",
                    description: "Combined with vermouth to showcase the aesthetic of clean, dry spirits. The choice of garnish (olive or lemon) significantly alters the profile."
                },
                {
                    name: "Vodka Tonic / Highball",
                    description: "Mixing with soda or tonic water is the most popular way to enjoy vodka's refreshing and crisp nature."
                }
            ]
        },
        flavorTags: [
            { label: "Clean/Neutral", color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
            { label: "Smooth Texture", color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
            { label: "Subtle Sweetness", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "White Pepper", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "Creamy/Silky", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "Minerality", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' }
        ],
        foodPairing: [
            "Rich and Savory Snacks (Pork Belly, Smoked Duck)",
            "Smoked Salmon and Caviar",
            "Salted Pickles and Sauerkraut",
            "Rye Bread and Blini",
            "Salty Hard Cheeses"
        ],
        faqs: [
            {
                question: "What is vodka and what is it made from?",
                answer: "Vodka is a clear, neutral distilled spirit made from fermented agricultural products, most commonly grains (wheat, rye, corn) or potatoes. It is distilled to a very high purity to remove most flavor compounds, then diluted with water to drinking strength — typically 37.5% to 40% ABV."
            },
            {
                question: "What is the history and origin of vodka?",
                answer: "Vodka's origins lie in Eastern Europe, with Russia and Poland both claiming its invention. Early vodkas date back to the 9th-12th centuries as medicinal spirits. The development of continuous distillation in the 19th century perfected the clean, neutral style widely known today. It became globally popular in the mid-20th century through cocktail culture."
            },
            {
                question: "What is the alcohol content of vodka?",
                answer: "Standard vodka is bottled at 40% ABV (alcohol by volume), which is equivalent to 80 proof in the US. The legal minimum in most countries is 37.5% ABV. Some premium or cask-strength vodkas can reach higher levels, but flavored or light vodkas may be slightly lower."
            }
        ]
    }
}
