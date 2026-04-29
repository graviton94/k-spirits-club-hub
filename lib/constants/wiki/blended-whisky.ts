import { SpiritCategory } from './types'

export const blendedWhisky: SpiritCategory = {
    slug: 'blended-whisky',
    dbCategories: ['위스키'],
    emoji: '🥃',
    nameKo: '블랜디드 위스키 (Blended Whisky)',
    nameEn: 'Blended Whisky',
    taglineKo: '조화와 균형의 예술이 빚어낸 완성된 풍미',
    taglineEn: 'A perfected flavor crafted by the art of harmony and balance',
    color: 'amber',
    sections: {
        definition: "블랜디드 위스키(Blended Whisky)란 서로 다른 스타일(몰트·그레인) 또는 서로 다른 증류소의 위스키 원액을 의도적으로 배합해, 균형 잡힌 풍미와 일관된 하우스 스타일을 구현한 위스키이다. 블렌더는 원액의 개성(향·질감·오크 영향·피트)을 조합해 ‘부드러움, 복합성, 재현성’을 설계한다.",
        history: "블랜디드 위스키는 19세기 중반 연속식 증류(컬럼 스틸)로 가볍고 대량 생산 가능한 그레인 위스키가 등장하면서, 향이 강한 몰트 위스키와 섞어 더 부드럽고 안정적인 맛을 만들기 위해 본격적으로 발전했다. 이후 블렌딩 하우스와 브랜드가 성장하며 20세기 글로벌 위스키 시장의 주류가 되었고, 최근에는 블렌디드 몰트·월드 블렌드·캐스크 피니시 등으로 스타일과 프리미엄 세그먼트가 크게 다양화되었다.",
        classifications: [
            {
                name: "블렌디드 스카치 위스키 (Blended Scotch Whisky)",
                criteria: "스코틀랜드 내 몰트 위스키 1종 이상 + 그레인 위스키 1종 이상 블렌딩, 최소 3년 이상 오크 숙성",
                description: "그레인의 부드러운 질감 위에 몰트의 과일·꿀·오크·스파이스·피트 성격을 쌓아 균형을 만든다. 매년 일관된 하우스 스타일을 재현하는 마스터 블렌더의 능력이 집약된 주종이다."
            },
            {
                name: "블렌디드 몰트 위스키 (Blended Malt Whisky)",
                criteria: "서로 다른 증류소의 싱글 몰트 위스키들만을 블렌딩 (그레인 위스키 불포함)",
                description: "그레인의 가벼움 대신 몰트 특유의 질감과 향의 층위를 강조한다. 증류소별 원액의 개성을 헤치지 않으면서도 새로운 복합성을 창출해내는 매력이 있다."
            },
            {
                name: "블렌디드 그레인 위스키 (Blended Grain Whisky)",
                criteria: "서로 다른 증류소의 그레인 위스키 원액들만을 블렌딩",
                description: "연속식 증류 특유의 깔끔함과 크리미한 질감이 장점이다. 바닐라·코코넛·토피·시리얼 위주의 풍미를 지니며, 하이볼이나 칵테일 베이스로 매우 훌륭한 퍼포먼스를 보여준다."
            },
            {
                name: "에이지 스테이트먼트 (Age Statement Blend)",
                criteria: "라벨 표기 숙성 연수 = 블렌드 내 ‘가장 어린 원액’의 연수",
                description: "시간이 지남에 따라 오크의 바닐라·스파이스가 원숙해지며 알코올의 자극이 줄어든다. 연수가 높을수록 일반적으로 레이어가 복잡해지지만, 원액의 질과 블렌딩 설계가 더 본질적인 품질을 좌우한다."
            },
            {
                name: "캐스크 피니시 (Cask Finish / Re-casking)",
                criteria: "기본 숙성 후 셰리·와인·럼 등 다른 캐스크에서 추가 숙성",
                description: "완성된 블렌드 위에 추가적인 향미 레이어를 얹는 방식이다. 셰리는 건과일과 초콜릿을, 와인은 레드베리와 타닌을, 새 오크는 강렬한 바닐라와 토스트 뉘앙스를 강화한다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수 (ABV)",
                label: "Strength",
                value: "40~46% (일반적 범위)",
                description: "40~43% 전후는 부드럽고 하이볼 친화적이며, 46% 이상은 원액의 향미 밀도와 질감을 더 선명하게 느낄 수 있는 설계다."
            },
            {
                metric: "숙성 지표",
                label: "Maturity",
                value: "NAS / 8~12년 / 18년+",
                description: "숙성 시간이 흐를수록 오크의 영향(바닐라·스파이스)이 깊어지고 질감이 매끄러워진다. 연수는 스타일을 예측하는 핵심 힌트로 기능한다."
            },
            {
                metric: "피트 스모크 (Phenols)",
                label: "Peatiness",
                value: "None to Medium (0~15+ ppm)",
                description: "블렌드에서 피트는 향의 액센트 역할을 한다. ppm이 높아질수록 스모키·타르·해풍 뉘앙스가 뚜렷해지며 복합적인 인상을 완성한다."
            },
            {
                metric: "색상 및 처리",
                label: "Treatment",
                value: "Chill Filtered / Caramel Colored (일반적)",
                description: "대부분의 블렌디드 제품은 외관의 안정성과 색상 일관성을 위해 냉각여과와 카라멜 착색을 적용하여 균일한 품질을 유지한다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "몰트 및 그레인 원액",
                description: "몰트는 향의 골격(과일·꽃·피트)을, 그레인은 부드러운 질감과 바탕 단맛을 제공하여 전체적인 조화를 설계한다."
            },
            {
                type: "숙성통",
                name: "다양한 오크 캐스크",
                description: "버번, 셰리, 리필 캐스크 등을 조합하여 바닐라, 견과, 스파이스 등의 다층적인 향미 레이어를 형성한다."
            },
            {
                type: "발효제",
                name: "증류용 효모 및 물",
                description: "에스터(과일향)의 전구체를 형성하고, 최종 병입 도수 조절을 통해 촉감과 향의 발현 정도를 결정한다."
            }
        ],
        manufacturingProcess: [
            { step: "증류", name: "단식(몰트) & 연속식(그레인) 증류", description: "개성 넘치는 몰트 원주와 깔끔한 그레인 원주를 각각 추출하여 블렌딩을 위한 팔레트를 준비한다." },
            { step: "숙성", name: "개별 캐스크 숙성", description: "오크통에서 수년간 시간을 보내며 각 원액이 고유의 숙성 풍미를 갖추도록 정교하게 관리한다." },
            { step: "블렌딩", name: "바팅 & 레시피 빌딩", description: "블렌더가 수십 종의 원액을 배합하여 특정 스타일(부드러움/스모키/프루티 등)과 하우스 일관성을 만든다." },
            { step: "마무리", name: "마리징(Marrying) & 병입", description: "배합된 원액들을 일정 기간 휴지시켜 향이 융합되도록 한 뒤 보정 과정을 거쳐 병입한다." }
        ],
        servingGuidelines: {
            recommendedGlass: "글렌캐런 글라스 또는 위스키 코피타",
            optimalTemperatures: [
                {
                    temp: "18~22℃ (니트)",
                    description: "바니닐라·꿀·과일의 층위가 가장 잘 펼쳐진다. 알코올 자극이 낮아 니트로 음미하기에 가장 편안한 주종이다."
                },
                {
                    temp: "4~8℃ (하이볼)",
                    description: "그레인의 크리미한 단맛과 시트러스의 청량감이 강조된다. 음식과의 페어링 범용성이 극대화되는 구간이다."
                },
                {
                    temp: "0~2℃ (온더락)",
                    description: "향은 다소 닫히지만 질감이 매끄러워지고 알코올의 각이 줄어들어 시원하게 넘기기 좋다."
                }
            ],
            methods: [
                {
                    name: "니트 (Neat)",
                    description: "물이나 얼음 없이 상온에서 그대로 마시는 방법으로, 블렌디드 위스키 특유의 부드러움과 꿀, 바닐라, 과일의 조화로운 레이어를 가장 잘 느낄 수 있다."
                },
                {
                    name: "가수 (Water Addition)",
                    description: "상온의 물을 한두 방울 떨어뜨리면 위스키의 표면장력이 깨지며 닫혀 있던 에스터 향이 피어올라, 더욱 풍부하고 화사한 아로마를 경험하게 한다."
                },
                {
                    name: "하이볼 (Highball)",
                    description: "얼음과 탄산수를 1:3 비율로 섞어 마시는 가장 대중적인 방법이다. 블렌디드 위스키의 깔끔한 풍미가 탄산과 만나 청량감을 극대화하며 식사 도중 반주로도 훌륭하다."
                },
                {
                    name: "온더락 (On the Rocks)",
                    description: "큰 얼음 위에 위스키를 부어 마시는 방법으로, 온도가 낮아지며 알코올의 자극이 줄어들고 부드러운 질감과 오크의 달콤한 향이 강조되어 편안하게 즐기기 좋다."
                }
            ]
        },
        flavorTags: [
            { label: "바닐라/카라멜", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "꿀/토피", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "말린 과일", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "시트러스/레몬", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "토스티/시리얼", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "스모키/피트", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' }
        ],
        foodPairing: [
            "스테이크 및 바비큐 요리",
            "삼겹살 및 양념 불고기",
            "하드 치즈 및 각종 견과류",
            "다크 초콜릿 및 브라우니",
            "치킨 및 생선 튀김 요리 (하이볼)"
        ]
    },
    sectionsEn: {
        definition: "Blended Whisky is a spirit created by intentionally blending different styles (malt and grain) or whiskies from various distilleries to achieve a balanced flavor and a consistent house style. Blenders combine the individual characteristics of the spirits—aroma, texture, oak influence, and peat—to design 'smoothness, complexity, and reproducibility.'",
        history: "Blended whisky flourished in the mid-19th century with the advent of continuous distillation (column stills), which produced lighter, mass-producible grain whiskies that could be blended with robust malt whiskies for a smoother, more stable taste. As blending houses and brands grew, it became the mainstay of the 20th-century global whisky market. Recently, the category has diversified into premium segments including blended malts, world blends, and various cask finishes.",
        classifications: [
            {
                name: "Blended Scotch Whisky",
                criteria: "A blend of one or more single malt whiskies with one or more single grain whiskies, all produced in Scotland and aged in oak for at least 3 years.",
                description: "Built on a smooth grain texture, layers of fruit, honey, oak, spice, and peat from the malts are added to create balance. It showcases the master blender's ability to reproduce a consistent house style year after year."
            },
            {
                name: "Blended Malt Whisky",
                criteria: "A blend of single malt whiskies from two or more different distilleries (contains no grain whisky).",
                description: "Emphasizes the texture and aromatic depth of malt rather than the lightness of grain. It offers the unique charm of creating new complexity without overshadowing the individual character of each distillery's spirit."
            },
            {
                name: "Blended Grain Whisky",
                criteria: "A blend of single grain whiskies from two or more different distilleries.",
                description: "Known for the clean and creamy texture characteristic of continuous distillation. It features flavors of vanilla, coconut, toffee, and cereal, performing excellently in highballs or as a cocktail base."
            },
            {
                name: "Age Statement Blend",
                criteria: "The age displayed on the label reflects the 'youngest' whisky in the blend.",
                description: "As whisky ages, oak-derived vanilla and spice notes mature, and the alcohol burn subsides. While higher age statements generally suggest more complex layers, the quality of the base spirit and the blending design are more fundamental to the final quality."
            },
            {
                name: "Cask Finish / Re-casking",
                criteria: "Secondary maturation in different casks (e.g., Sherry, Wine, Rum) after initial aging.",
                description: "A method of adding additional flavor layers to a finished blend. Sherry casks enhance dried fruit and chocolate notes, wine casks add red berries and tannins, and virgin oak reinforces intense vanilla and toast nuances."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Alcohol by Volume (ABV)",
                label: "Strength",
                value: "40~46% (Typical Range)",
                description: "Around 40~43% is smooth and highball-friendly, while 46% and above is designed to more clearly showcase the flavor density and texture of the spirit."
            },
            {
                metric: "Maturity Index",
                label: "Maturity",
                value: "NAS / 8~12Y / 18Y+",
                description: "Over time, oak influences (vanilla, spice) deepen and the texture becomes silkier. The age statement serves as a key clue to predicting the style."
            },
            {
                metric: "Peat Smoke (Phenols)",
                label: "Peatiness",
                value: "None to Medium (0~15+ ppm)",
                description: "In a blend, peat acts as an aromatic accent. Higher ppm levels provide distinct smoky, tar, and sea breeze nuances, completing a complex impression."
            },
            {
                metric: "Color and Processing",
                label: "Treatment",
                value: "Chill Filtered / Caramel Colored (Standard)",
                description: "Most blended products undergo chill filtration and caramel coloring (E150a) to ensure visual stability and color consistency for uniform quality."
            }
        ],
        coreIngredients: [
            {
                type: "Base Spirits",
                name: "Malt and Grain Whiskies",
                description: "Malts provide the aromatic framework (fruit, floral, peat), while grains offer a smooth texture and foundational sweetness to create overall harmony."
            },
            {
                type: "Maturation",
                name: "Diverse Oak Casks",
                description: "A combination of Bourbon, Sherry, and Refill casks are used to build multi-layered flavor profiles including vanilla, nuts, and spices."
            },
            {
                type: "Fermentation Agents",
                name: "Distiller's Yeast and Water",
                description: "Forms ester (fruity) precursors and determines the mouthfeel and aroma expression through final ABV adjustment before bottling."
            }
        ],
        manufacturingProcess: [
            { step: "Distillation", name: "Pot (Malt) & Column (Grain) Distillation", description: "Preparing the blending palette by extracting characterful malt spirits and clean grain spirits separately." },
            { step: "Maturation", name: "Individual Cask Aging", description: "Precisely managing each spirit as it develops its unique aged character over several years in oak casks." },
            { step: "Blending", name: "Vatting & Recipe Building", description: "The blender combines dozens of spirits to create a specific style (smooth, smoky, fruity, etc.) and ensure house consistency." },
            { step: "Finishing", name: "Marrying & Bottling", description: "Resting the blended spirits for a certain period to allow the flavors to integrate before final adjustments and bottling." }
        ],
        servingGuidelines: {
            recommendedGlass: "Glencairn Glass or Whisky Copita",
            optimalTemperatures: [
                {
                    temp: "18~22°C (Neat)",
                    description: "The ideal range where layers of vanilla, honey, and fruit unfold best. With low alcohol sting, it is the most comfortable style to enjoy neat."
                },
                {
                    temp: "4~8°C (Highball)",
                    description: "Emphasizes the creamy sweetness of the grain and the refreshing quality of the citrus. This maximizes its versatility for food pairing."
                },
                {
                    temp: "0~2°C (On the Rocks)",
                    description: "While the aroma may close up slightly, the texture becomes smoother and the alcohol edge is rounded off for a refreshing sip."
                }
            ],
            methods: [
                {
                    name: "Neat",
                    description: "Drinking at room temperature without water or ice to best experience the harmonious layers of honey, vanilla, and fruit characteristic of blended whisky."
                },
                {
                    name: "Water Addition",
                    description: "Adding a drop or two of room-temperature water breaks the surface tension, allowing 'closed' ester aromas to bloom for a more fragrant experience."
                },
                {
                    name: "Highball",
                    description: "The most popular method, mixing whisky with sparkling water in a 1:3 ratio. The clean flavors of blended whisky meet carbonation for maximum refreshment, making it a great meal accompaniment."
                },
                {
                    name: "On the Rocks",
                    description: "Pouring whisky over large ice cubes. As the temperature drops, the alcohol burn is reduced, highlighting the smooth texture and sweet oak aromas for easy sipping."
                }
            ]
        },
        flavorTags: [
            { label: "Vanilla / Caramel", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "Honey / Toffee", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "Dried Fruit", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "Citrus / Lemon", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "Toasty / Cereal", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "Smoky / Peat", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' }
        ],
        foodPairing: [
            "Steak and Barbecue dishes",
            "Grilled Pork Belly and seasoned Bulgogi",
            "Hard Cheeses and assorted nuts",
            "Dark Chocolate and Brownies",
            "Fried Chicken or Fish and Chips (with Highball)"
        ]
    }
}
