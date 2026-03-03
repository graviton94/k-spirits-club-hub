import { SpiritCategory } from './types'

export const grainWhisky: SpiritCategory = {
    slug: 'grain-whisky',
    emoji: '🌾',
    nameKo: '그레인/라이 위스키',
    nameEn: 'Grain & Rye Whisky',
    taglineKo: '다양한 곡물이 만들어내는 스파이시하고 다채로운 풍미',
    taglineEn: 'Spicy and diverse flavors created by various grains',
    color: 'yellow',
    sections: {
        definition: "그레인 위스키(Grain Whisky)란 맥아 보리 외의 곡물(옥수수, 호밀, 밀 등)을 주원료로 당화·발효한 워시(Wash)를 증류하여 오크통에서 숙성한 위스키를 말한다. 일반적으로 연속식(컬럼) 증류기를 사용해 높은 도수까지 추출하므로 바디감이 가볍고 깔끔한 캐릭터를 지니며, 호밀(Rye) 위스키처럼 특정 곡물의 특성이 법적 스타일이 되는 경우도 포함된다.",
        history: "그레인 위스키의 역사는 19세기 중반 연속식 증류기(코피 스틸 등)의 발명과 맞닿아 있다. 이를 통해 곡물을 효율적으로 분리해 대량 생산이 가능한 ‘가벼운 위스키’가 탄생했고, 향이 강한 몰트 위스키와 섞는 블렌디드 위스키 산업의 뼈대가 되었다. 북미 지역에서는 호밀을 주원료로 한 라이 위스키가 초기부터 정착했으며, 현대에는 ‘싱글 그레인’ 자체의 매력이 독립적인 카테고리로 재조명받고 있다.",
        classifications: [
            {
                name: "싱글 그레인 스카치 위스키 (Single Grain Scotch)",
                criteria: "스코틀랜드 단일 증류소 생산, 물·맥아 보리(필수) + 기타 곡물 사용, 증류 도수 94.8% ABV 미만, 오크통 3년 이상 숙성",
                description: "컬럼 스틸의 특징인 매끄러운 질감과 깨끗한 바탕 위에 바닐라, 토피, 코코넛 같은 달콤한 오크 향이 주로 입혀진다. 최근 고연산(15년 이상)이나 셰리/와인 캐스크 피니시를 통해 놀라운 복합성을 보여주는 제품들이 다수 등장했다."
            },
            {
                name: "라이 위스키 (Rye Whiskey - 미국 기준)",
                criteria: "매시빌 중 호밀 51% 이상, 증류 도수 80% ABV 이하, 새 탄화 오크통 사용",
                description: "호밀 특유의 후추, 정향, 시나몬 같은 베이킹 스파이스와 드라이한 허브, 민트 뉘앙스가 뚜렷한 ‘스파이시 그레인 위스키’의 아이콘이다. 톡 쏘는 개성 덕분에 칵테일의 기주로 깊은 사랑을 받는다."
            },
            {
                name: "콘 위스키 (Corn Whiskey - 미국 기준)",
                criteria: "매시빌 중 옥수수 80% 이상, 새 오크통의 탄화 없이 또는 사용한 통에서 숙성",
                description: "새 오크의 강렬한 스파이스/바닐라보다는 옥수수 본연의 스위트콘, 콘브레드 같은 둥글고 달콤한 향이 전면에 나타난다. 부담 없이 깨끗하게 즐기거나 식중주로 활약하기 좋다."
            },
            {
                name: "블렌디드 그레인 (Blended Grain)",
                criteria: "서로 다른 증류소의 싱글 그레인 위스키들을 블렌딩",
                description: "다양한 그레인 원액의 개성과 장점만을 모아 궁극의 부드러움과 재현성을 추구한다. 바디감이 가벼워 하이볼이나 탄산음료와의 호환성이 어떤 위스키보다 높다."
            },
            {
                name: "캐나디안 위스키 (Canadian Whisky)",
                criteria: "캐나다에서 당화·발효·증류, 소형 오크통 3년 이상 숙성, 멀티그레인 혼합 잦음",
                description: "라이 위스키(Rye)로 흔히 불리지만, 캐나다에서는 특정 블렌딩 철학을 가리키는 고유명사처럼 쓰인다. 극도로 부드러운 질감과 은은한 스파이스, 가벼운 바디감이 특징이다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수 (ABV)",
                label: "Strength",
                value: "40~50% (일반적) / 55~65% (CS)",
                description: "도수가 높을수록 향기 물질의 응집력이 강하며 자극적이다. 그레인류는 도수가 낮을 때 크리미한 질감이 돋보이며, 물을 떨어뜨려 닫힌 향을 여는 과정이 매력적이다."
            },
            {
                metric: "증류 강도",
                label: "Distillation Strength",
                value: "65~80% (포트 스틸) / 88~94% (컬럼 스틸)",
                description: "증류 시 높은 알코올 도수로 뽑아낼수록 중질의 잡향이 날아가 가볍고 깨끗해진다. 반면 낮게 증류하면 발효된 곡물의 묵직한 캐릭터가 위스키에 그대로 이식된다."
            },
            {
                metric: "곡물 배합 비율",
                label: "Mash Bill",
                value: "주곡물 51% 이상 또는 멀티그레인",
                description: "호밀 함량이 향상되면 스파이시하고 드라이한 허브 톤이 상승하고, 옥수수나 밀 함량이 늘어나면 둥글고 크리미한 단맛이 지배하게 된다."
            },
            {
                metric: "숙성 기간",
                label: "Maturity",
                value: "NAS / 3~15년 / 고연산(18년+)",
                description: "연속식 증류기 기반의 가벼운 그레인 원액은 적절한 숙성(오크의 단맛 추가)이 핵심 조미료가 된다. 과숙성 시 나무의 쓴맛이 튈 수 있어 섬세한 캐스크 관리가 요구된다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "호밀 (Rye)",
                description: "그레인 위스키에 긴장감 있는 뼈대와 알싸한 질감(정향, 후추, 민트)을 공급하는 향신료 같은 존재다."
            },
            {
                type: "주원료",
                name: "옥수수 (Corn)",
                description: "밝은 느낌의 크리미한 옥수수 시럽, 콘브레드, 바닐라 질감을 만들어주는 감미료 같은 곡물이다."
            },
            {
                type: "주원료",
                name: "밀 (Wheat)",
                description: "호밀의 날카로움을 다듬어주고, 스코니나 비스킷 같이 부드럽고 온화한 곡물 단맛과 매끈한 목 넘김을 더한다."
            },
            {
                type: "보조원료",
                name: "맥아 보리 (Malted Barley)",
                description: "각종 전분을 발효 가능한 알코올 당으로 변환시키는 필수 효소원(엔자임) 역할을 하며 몰티한 풍미도 남긴다."
            },
            {
                type: "숙성통",
                name: "오크 캐스크 (Oak Cask)",
                description: "새 오크는 강렬한 스파이스와 바닐라를, 버번이나 와인 바리끄는 절제되고 레이어드된 과실/초콜릿 향미를 이끌어낸다."
            }
        ],
        manufacturingProcess: [
            {
                step: "처리",
                name: "그레인 빌(Grain Bill) 구성",
                description: "목표하는 스타일(단맛 vs 스파이스)에 맞게 곡물들을 이상적인 비율로 설계 및 배합한다."
            },
            {
                step: "당화",
                name: "쿠킹 & 매싱",
                description: "딱딱한 곡물을 전분화(Cooking)한 뒤, 뜨거운 물과 효소를 섞어 알코올 발효가 가능한 당으로 변환시킨다."
            },
            {
                step: "증류",
                name: "연속식 컬럼 증류 (Column Still)",
                description: "발효된 워시를 층층이 쌓인 단에서 반복적으로 끓이고 식혀 순수하고 깨끗한 알코올만을 대량으로 추출한다."
            },
            {
                step: "육성",
                name: "오크통 숙성 및 피니싱",
                description: "가벼운 바탕 위에 각 오크통의 색상, 향기(바닐라, 견과, 타닌)를 수년간 천천히 흡수시킨다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "글렌캐런(Glencairn) 또는 하이볼 글라스",
            optimalTemperatures: [
                {
                    temp: "18~22℃ (니트)",
                    description: "그레인 특유의 가볍고 달콤한 바닐라, 시리얼 톤이 온전히 느껴지며 라이(Rye) 위스키의 경우 알싸한 스파이스가 돋보인다."
                },
                {
                    temp: "4~8℃ (하이볼)",
                    description: "탄산수와 만나면 크리미한 질감이 상쾌하게 변하며 곡물의 단맛이 레몬/시트러스와 완벽한 조화를 이룬다."
                }
            ],
            methods: [
                {
                    name: "하이볼 (Highball)",
                    description: "그레인 위스키의 깨끗하고 가벼운 바디감은 하이볼 베이스로 최적의 퍼포먼스를 내며, 어떤 음식과도 부딪히지 않는 훌륭한 반주가 된다."
                },
                {
                    name: "니트 (Neat)",
                    description: "단일 증류소에서 생산된 고숙성 싱글 그레인이나 고급 라이 위스키의 섬세한 스파이스와 은은한 꿀 향을 직관적으로 즐기는 방식이다."
                },
                {
                    name: "칵테일 (Cocktail Base)",
                    description: "라이 위스키의 특유의 허브, 후추 뉘앙스는 올드패션드, 사제락 같은 클래식 칵테일에서 다른 부재료를 뚫고 중심축을 잡아주는 역할을 한다."
                }
            ]
        },
        flavorTags: [
            { label: "시리얼/곡물", color: "bg-amber-500/20 text-zinc-950 dark:text-amber-300" },
            { label: "바닐라/카라멜", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-400" },
            { label: "꿀/메이플", color: "bg-yellow-600/20 text-zinc-950 dark:text-yellow-300" },
            { label: "베이킹 스파이스", color: "bg-rose-600/20 text-zinc-950 dark:text-rose-300" },
            { label: "후추/민트(라이)", color: "bg-emerald-600/20 text-zinc-950 dark:text-emerald-300" },
            { label: "오크/토스트", color: "bg-stone-600/20 text-zinc-950 dark:text-stone-300" },
            { label: "시트러스", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-200" },
            { label: "청사과/배", color: "bg-emerald-400/20 text-zinc-950 dark:text-emerald-200" },
            { label: "코코넛/크리미", color: "bg-yellow-400/20 text-zinc-950 dark:text-yellow-300" },
            { label: "클린/드라이 피니시", color: "bg-sky-500/20 text-zinc-950 dark:text-sky-300" }
        ],
        foodPairing: [
            "치킨, 감자튀김 등 가벼운 튀김류 (하이볼)",
            "크래커와 고다 치즈 보드",
            "가벼운 훈제 연어 샐러드",
            "바비큐 립 (라이 위스키 한정 베스트)",
            "파스트라미, 델리 미트 샌드위치",
            "마카다미아, 아몬드 플래터",
            "다크 초콜릿 및 스파이시 코코아 디저트",
            "사과 파이, 시나몬 롤"
        ],
        dbCategories: ['위스키']
    },
    sectionsEn: {
        definition: "Grain Whisky is a distilled spirit produced from a mash of grains other than malted barley (such as corn, rye, or wheat), which is then saccharified, fermented, and matured in oak casks. Typically distilled using continuous column stills to high alcohol concentrations, it possesses a light body and clean character. This category also includes specific grain-led styles like Rye Whiskey.",
        history: "The history of Grain Whisky is closely tied to the invention of the continuous still (e.g., Coffey Still) in the mid-19th century. This allowed for the efficient mass production of a 'lighter whiskey' that became the structural backbone of the Blended Whisky industry. In North America, Rye Whiskey established early roots, while in modern times, 'Single Grain' whiskies are being rediscovered as a standalone premium category.",
        classifications: [
            {
                name: "Single Grain Scotch Whisky",
                criteria: "Produced at a single distillery in Scotland; distilled from water and malted barley (required) plus other whole grains; distilled at less than 94.8% ABV; matured in oak casks for at least 3 years.",
                description: "Characterized by the smooth texture of column distillation and a clean canvas of vanilla, toffee, and coconut derived from oak. Recent premium expressions with high age statements (15+ years) or unique finishes show remarkable complexity."
            },
            {
                name: "Rye Whiskey (US Standard)",
                criteria: "Mash bill of at least 51% rye; distilled at no more than 80% ABV; aged in new charred oak containers.",
                description: "An icon of 'spicy grain whiskey' featuring distinct notes of black pepper, cloves, and cinnamon (baking spices) alongside dry herbs and mint. Its punchy character makes it a bartender favorite for classic cocktails."
            },
            {
                name: "Corn Whiskey (US Standard)",
                criteria: "Mash bill of at least 80% corn; unaged or aged in used or uncharred oak containers.",
                description: "Lacks the intense spice/vanilla of new charred oak, instead showcasing the grain's natural sweetness like sweetcorn and cornbread. Known for a clean, round profile suitable for easy sipping or pairing with meals."
            },
            {
                name: "Blended Grain",
                criteria: "A blend of two or more Single Grain Whiskies from different distilleries.",
                description: "Aims for ultimate smoothness and consistency by combining the strengths of various grain spirits. Its light body makes it exceptionally compatible with highballs and carbonated mixers."
            },
            {
                name: "Canadian Whisky",
                criteria: "Mashed, fermented, and distilled in Canada; aged in small oak for at least 3 years; frequently involves multi-grain blending.",
                description: "Often colloquially referred to as 'Rye,' though the term describes a specific blending philosophy in Canada. Known for an extremely smooth texture, subtle spice, and light body."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Alcohol Strength (ABV)",
                label: "Strength",
                value: "40~50% (Standard) / 55~65% (Cask Strength)",
                description: "Higher ABV concentrates aromatic compounds but increases sensory intensity. Grain whiskies often show a creamy texture at lower proofs, while high-proof versions benefit from water to open up tightly wound aromas."
            },
            {
                metric: "Distillation Strength",
                label: "Distillation Proof",
                value: "65~80% (Pot Still) / 88~94% (Column Still)",
                description: "Distilling to a higher proof yields a cleaner, lighter spirit by removing heavier congeners. Conversely, lower distillation proofs preserve more of the raw, bready grain character."
            },
            {
                metric: "Grain Composition",
                label: "Mash Bill",
                value: "51%+ Primary Grain or Multi-grain",
                description: "Increased rye content heightens spicy and dry herbal tones, while higher proportions of corn or wheat lead to a rounder, creamier sweetness."
            },
            {
                metric: "Maturation Period",
                label: "Maturity",
                value: "NAS / 3~15 Years / Ultra-Aged (18+ Years)",
                description: "For light column-still spirits, oak influence acts as a primary seasoning. Precise cask management is required as over-aging can easily lead to excessive wood bitterness."
            }
        ],
        coreIngredients: [
            {
                type: "Primary Grain",
                name: "Rye",
                description: "Acts as the spice of the grain world, providing a tense backbone and a tingly texture with notes of cloves, pepper, and mint."
            },
            {
                type: "Primary Grain",
                name: "Corn",
                description: "Acts as a sweetener, producing bright notes of creamy corn syrup, cornbread, and a smooth vanilla texture."
            },
            {
                type: "Primary Grain",
                name: "Wheat",
                description: "Softens the edges of rye, adding gentle, bready sweetness reminiscent of scones or biscuits and a silky mouthfeel."
            },
            {
                type: "Processing Agent",
                name: "Malted Barley",
                description: "Essential enzyme source for converting starches into fermentable sugars, while also contributing a subtle malty flavor."
            },
            {
                type: "Maturation Vessel",
                name: "Oak Cask",
                description: "New oak provides bold spice and vanilla; used bourbon or wine barriques offer restrained, layered notes of fruit and chocolate."
            }
        ],
        manufacturingProcess: [
            {
                step: "Design",
                name: "Grain Bill Formulation",
                description: "Designing the ideal ratio of grains to achieve the target profile, balancing sweetness against spice."
            },
            {
                step: "Saccharification",
                name: "Cooking & Mashing",
                description: "Grains are cooked to gelatinize starch, then mixed with hot water and enzymes to create a fermentable sugary liquid."
            },
            {
                step: "Distillation",
                name: "Continuous Column Distillation",
                description: "The fermented wash is repeatedly boiled and cooled through stacked plates to efficiently extract high-purity alcohol on a large scale."
            },
            {
                step: "Maturation",
                name: "Cask Aging & Finishing",
                description: "The light spirit slowly absorbs color and aromatics (vanilla, nuts, tannins) from the oak over several years."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Glencairn Glass or Highball Glass",
            optimalTemperatures: [
                {
                    temp: "18~22°C (Neat)",
                    description: "Ideal for perceiving light vanilla and cereal tones, especially the sharp spices in Rye Whiskey."
                },
                {
                    temp: "4~8°C (Highball)",
                    description: "Refreshing creamy textures that harmonize perfectly with lemon/citrus garnishes and carbonation."
                }
            ],
            methods: [
                {
                    name: "Highball",
                    description: "The clean, light body of Grain Whisky delivers peak performance in highballs, making it an excellent versatile pairing for food."
                },
                {
                    name: "Neat",
                    description: "The best way to intuitively enjoy the delicate spice and honeyed notes of well-aged Single Grains or premium Rye."
                },
                {
                    name: "Cocktail Base",
                    description: "The herbal and peppery nuances of Rye are essential for anchoring classics like the Old Fashioned or Sazerac."
                }
            ]
        },
        flavorTags: [
            { label: "Cereal/Grain", color: "bg-amber-500/20 text-zinc-950 dark:text-amber-300" },
            { label: "Vanilla/Caramel", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-400" },
            { label: "Honey/Maple", color: "bg-yellow-600/20 text-zinc-950 dark:text-yellow-300" },
            { label: "Baking Spices", color: "bg-rose-600/20 text-zinc-950 dark:text-rose-300" },
            { label: "Pepper/Mint (Rye)", color: "bg-emerald-600/20 text-zinc-950 dark:text-emerald-300" },
            { label: "Oak/Toasted", color: "bg-stone-600/20 text-zinc-950 dark:text-stone-300" },
            { label: "Citrus", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-200" },
            { label: "Green Apple/Pear", color: "bg-emerald-400/20 text-zinc-950 dark:text-emerald-200" },
            { label: "Coconut/Creamy", color: "bg-yellow-400/20 text-zinc-950 dark:text-yellow-300" },
            { label: "Clean/Dry Finish", color: "bg-sky-500/20 text-zinc-950 dark:text-sky-300" }
        ],
        foodPairing: [
            "Fried Foods (Chicken, Fries) in Highball",
            "Crackers and Aged Gouda Cheese Board",
            "Light Smoked Salmon Salad",
            "BBQ Ribs (Best with Rye)",
            "Pastrami or Deli Meat Sandwiches",
            "Macadamia and Almond Platter",
            "Dark Chocolate or Spicy Cocoa Desserts",
            "Apple Pie and Cinnamon Rolls"
        ],
        dbCategories: ['위스키']
    }
}
