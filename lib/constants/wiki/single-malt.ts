import { SpiritCategory } from './types'

export const singleMalt: SpiritCategory = {
    slug: 'single-malt',
    emoji: '🥃',
    nameKo: '싱글 몰트 위스키 (Single Malt)',
    nameEn: 'Single Malt Whisky',
    taglineKo: '단일 증류소의 테루아와 장인정신이 빚어낸 액체 예술',
    taglineEn: 'The liquid art of a single distillery and its unique terroir',
    color: 'amber',
    sections: {
        definition: "싱글몰트 위스키(Single Malt Whisky)란 단일 증류소(Single Distillery)에서 100% 맥아 보리(Malted Barley), 물, 효모라는 단 3가지 핵심 재료(Ingredients)만을 사용하여 발효 및 구리 팟 스틸(Pot Still)에서 증류한 위스키를 뜻한다. 여러 증류소의 원액을 섞는 '블렌디드 몰트'나 다른 곡물을 섞는 '블렌디드 위스키'와 엄격히 구분된다. 어떠한 첨가물 없이도 원재료의 풍미와 증류소 고유의 떼루아(Terroir)가 가장 진하게 투영되는 프리미엄 위스키의 정수다.",
        history: "몰트 위스키의 역사는 중세 수도원 증류 기술에서 시작되어, 1823년 세제 개편(Excise Act) 이후 '더 글렌리벳'이 최초의 합법 면허를 취득하며 현대적 산업의 기틀을 마련했다. 초기에는 대부분 블렌디드 위스키의 재료로 쓰였으나, 1963년 '글렌피딕'이 단일 증류소 원액만을 담은 '싱글몰트'를 전 세계에 마케팅하며 독립적인 카테고리로 급성장했다. 현재는 숙성 연수를 넘어 캐스크 피니시(Cask Finish), 논칠 필터링(Non-chill Filtered) 등 장인정신 기반의 다양성이 핵심 가치가 되었다.",
        classifications: [
            {
                name: "싱글 몰트 스카치 위스키 (Single Malt Scotch)",
                criteria: "스코틀랜드 내 단일 증류소 생산, 100% 맥아 보리 사용, 구리 팟 스틸 증류, 최소 700리터 이하 오크통에서 3년 이상 숙성, 최소 40% ABV 이상 병입",
                description: "전 세계 싱글몰트의 기준이다. 법적으로 스코틀랜드 현지에서 증류 및 숙성되어야 하며, 색소 이외의 첨가물은 일절 금지된다. 하이랜드, 스페이사이드, 아일라 등 지역별 기후와 물의 성질, 피트 사용 여부에 따라 극명하게 갈리는 향미 프로파일이 특징이다."
            },
            {
                name: "캐스크 스트렝스 (Cask Strength / CS)",
                criteria: "숙성 후 병입 전 물을 섞어 도수를 낮추는 과정(Proofing) 없이, 캐스크 속 원액 그대로 병입 (통상 52~65% ABV)",
                description: "위스키 본연의 농축된 향과 질감을 가장 순수하게 경험할 수 있다. 도수가 높지만 알코올의 화끈함 속에 감춰진 오크 유래 에스터와 오일 성분이 풍부하며, 유저의 취향에 따라 물을 한두 방울 섞어 향을 여는 '가수' 과정을 통해 복합미를 탐구하기에 최적이다."
            },
            {
                name: "싱글 캐스크 (Single Cask / Single Barrel)",
                criteria: "여러 통의 원액을 섞어 맛을 표준화하는 '바팅(Vatting)' 없이, 오직 단 하나의 오크통에서 나온 원액만 병입",
                description: "동일한 증류소 제품이라도 오크통의 위치, 나무의 결, 숙성 환경에 따른 '우연한 걸작'을 만날 수 있는 희소성 높은 카테고리다. 병마다 고유의 캐스크 번호와 병 번호가 기록되며, 해당 통이 소진되면 다시는 맛볼 수 없는 유일무이한 개성을 지닌다."
            },
            {
                name: "피티드 위스키 (Peated Whisky)",
                criteria: "맥아 건조 시 이탄(Peat)을 태워 그 연기로 몰트를 훈연하여 페놀 성분을 고착시킴 (PPM 단위로 강도 측정)",
                description: "강렬한 스모키함, 메디시널(병원 소독약), 해풍의 짠맛 등이 특징이다. 아일라(Islay) 지역 위스키들이 대표적이며, 훈연 과정의 시간과 온도에 따라 베이컨 같은 묵직한 훈제 향부터 화사한 재(Ash)의 느낌까지 다양한 스펙트럼을 형성한다."
            },
            {
                name: "캐스크 피니시 (Cask Finish)",
                criteria: "주요 숙성 후 다른 종류의 캐스크(셰리, 와인, 럼 등)로 옮겨 추가 숙성",
                description: "전(前) 내용물의 잔향을 입혀 풍미 레이어를 확장합니다. 짧은 기간에 독특한 캐릭터를 덧칠할 수 있는 세밀한 공정입니다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수 (ABV)",
                label: "Strength",
                value: "40~46% (Standard) / 52~65% (CS)",
                description: "법적 최소 도수는 40%이다. 최근 프리미엄 몰트는 냉각 여과를 하지 않기 위해 46% 이상으로 병입하는 경우가 많으며, 도수가 높을수록 향기 분자의 휘발성이 강해져 노징(Nosing) 시 더 풍부한 정보를 제공한다."
            },
            {
                metric: "피트 스모크 (PPM)",
                label: "Peatiness",
                value: "0 (Unpeated) ~ 50+ (Heavy Peat)",
                description: "PPM(Phenol Parts Per Million)은 맥아의 페놀 함량을 나타낸다. 0~10은 저피트, 30 이상은 고피트로 분류되며, 증류 컷(Cut) 지점에 따라 실제 액체에 남는 스모키함의 질감은 달라질 수 있다."
            },
            {
                metric: "숙성 정보",
                label: "Age Statement",
                value: "NAS / 10~18년 / 21년+",
                description: "병에 표기된 연수는 사용된 원액 중 가장 어린 것의 나이다. 최근에는 연수 표기가 없는 NAS(Non-Age Statement) 제품도 캐스크 블렌딩의 기술력을 강조하며 프리미엄 시장에서 큰 비중을 차지하고 있다."
            },
            {
                metric: "캐스크 영향도",
                label: "Cask Influence",
                value: "First-fill / Refill",
                description: "처음 사용된 퍼스트필 캐스크는 오크의 바닐라와 탄닌이 강하며, 여러 번 사용된 리필 캐스크는 나무의 영향력을 줄여 증류소 본연의 섬세한 과실 향(New Make 캐릭터)을 더 잘 보여준다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "맥아 보리 (Malted Barley)",
                description: "Single malt whisky ingredients의 가장 핵심으로 100% 보리만을 사용한다. 비스킷, 갓 구운 빵, 고소한 견과류의 바탕을 형성하며 보리의 품종과 몰팅 방식은 위스키 바디감에 큰 영향을 준다."
            },
            {
                type: "발효제",
                name: "효모 (Yeast) & 양조수",
                description: "위스키가 무엇으로 만들어지는지(what is made from)를 묻는다면 물과 효모를 빼놓을 수 없다. 효모는 화사한 과일향을 생성하며, 물의 미네랄은 입안에서의 질감을 결정짓는 테루아의 핵심이다."
            },
            {
                type: "숙성 도구",
                name: "오크 캐스크 (Oak Cask)",
                description: "바닐린(바닐라), 락톤(코코넛), 탄닌(구조감)을 부여한다. 이전 내용물(버번, 셰리, 포트와인 등)에 따라 위스키의 색상과 2차 풍미 레이어가 결정된다."
            }
        ],
        manufacturingProcess: [
            { step: "몰팅", name: "Malting & Kilning", description: "보리를 물에 불려 발아시킨 뒤 건조하여 전분을 당으로 바꿀 효소를 활성화한다. 이때 피트 연기로 건조하면 스모키한 풍미가 입혀진다." },
            { step: "당화/발효", name: "Mashing & Fermentation", description: "분쇄된 맥아(Grist)에 뜨거운 물을 부어 당액(Wort)을 추출하고, 이를 효모와 함께 48~100시간 동안 발효시켜 '워시(Wash)'라고 불리는 맥주와 유사한 액체를 만든다." },
            { step: "증류", name: "Pot Still Distillation", description: "구리 팟 스틸에서 두 번 증류한다. 1차 증류(Wash Still)로 도수를 높이고, 2차 증류(Spirit Still)에서 가장 깨끗한 중간 부분(Hearts)만을 정밀하게 분리해낸다." },
            { step: "숙성/완성", name: "Maturation & Vatting", description: "증류액을 오크통에 담아 최소 3년 이상 숙성한다. 이후 마스터 블렌더가 여러 캐스크를 조합(Vatting)하여 증류소 고유의 하우스 스타일을 완성하고 병입한다." }
        ],
        servingGuidelines: {
            recommendedGlass: "글렌캐런(Glencairn) 또는 튤립형 노징 글라스",
            optimalTemperatures: [
                {
                    temp: "18~22℃ (실온)",
                    description: "과실 향과 오크 풍미가 가장 균형 있게 휘발되며 스타일 차이가 선명하게 드러납니다."
                },
                {
                    temp: "18~22℃ + 가수",
                    description: "알코올 자극이 줄고 닫혀 있던 섬세한 꽃과 꿀 향이 열려 복합미가 살아납니다."
                }
            ],
            methods: [
                {
                    name: "니트 (Neat)",
                    description: "첨가물 없이 잔에 따라 향(Nosing)을 먼저 즐기고, 소량을 머금어 혀 전체로 질감과 피니시를 느끼는 가장 정석적인 방법이다."
                },
                {
                    name: "가수 (Water Addition)",
                    description: "상온의 생수를 한두 방울 떨어뜨리면 위스키의 표면장력이 깨지며 감춰진 에스터 성분이 폭발적으로 피어오르는 경험을 할 수 있다."
                },
                {
                    name: "하이볼 (Highball)",
                    description: "얼음과 탄산수를 1:3 비율로 섞어 몰트 본연의 고소함과 시트러스한 청량감을 가볍게 즐기는 방식으로, 식사와의 궁합이 뛰어나다."
                },
                {
                    name: "온더락 (On the Rocks)",
                    description: "커다란 구형 얼음 위에 부어 마시면 낮은 온도로 인해 알코올의 각이 줄어들고 부드러운 단맛과 묵직한 질감이 강조된다."
                }
            ]
        },
        flavorTags: [
            { label: "바닐라/카라멜", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "건포도/셰리", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "청사과/배", color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
            { label: "꿀/플로럴", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "스모키/피트", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "해풍/브인", color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' }
        ],
        foodPairing: [
            "훈제 연어 및 신선한 굴",
            "스테이크 및 양갈비 구이",
            "숙성 체다 및 블루 치즈",
            "다크 초콜릿 및 테라미수",
            "견과류와 건과일 플래터"
        ],
        dbCategories: ['위스키'],
        relatedPageSlug: 'scotch-whisky-regions',
        relatedPageLabelKo: '🗺️ 스코틀랜드 5대 산지별 위스키 개성 탐험하기 →',
        relatedPageLabelEn: '🗺️ Explore Scotland\'s 5 Whisky Regions →',
        faqs: [
            {
                question: "싱글몰트와 블렌디드 위스키의 차이점은 무엇인가요?",
                answer: "싱글몰트는 오직 '단일 증류소'에서 '맥아 보리(Malted Barley)'만으로 만든 위스키입니다. 반면 블렌디드 위스키는 여러 증류소의 몰트 위스키와 저렴한 그레인(옥수수, 밀 등) 위스키를 부드럽게 섞어 대중적인 맛을 낸 것입니다."
            },
            {
                question: "피트(Peat)란 무엇이며 왜 병원 소독약 냄새가 나나요?",
                answer: "피트는 식물 퇴적물이 진흙처럼 굳은 이탄을 의미합니다. 스코틀랜드 아일라 지역 등에선 보리를 건조할 때 석탄 대신 이탄을 태웠고, 이 연기가 보리에 스며들어 특유의 스모키함과 요오드(소독약) 향을 만들어냅니다."
            },
            {
                question: "숙성 연수(Age Statement)가 높을수록 항상 좋은 위스키인가요?",
                answer: "반드시 그렇지는 않습니다. 오래 숙성할수록 오크통의 나무 향이 강해져 부드럽고 복합적이 될 수 있지만, 증류소 원액 본연의 개성(꽃향, 과실향)은 오히려 젊은 연수(10~15년)에서 더 선명하게 느낄 수 있습니다."
            }
        ]
    },
    sectionsEn: {
        definition: "If you're wondering what is single malt whisky made from, the answer is remarkably simple but strictly regulated. Single Malt Whisky refers to whisky produced at a single distillery using exactly three single malt whisky ingredients: 100% malted barley, water, and yeast. The wort is fermented, distilled in copper pot stills, and matured in oak casks. The term 'single' denotes its origin from one distillery, distinguishing it from blended whiskies that combine spirits from multiple sources.",
        history: "The origins of malt whisky lie in the medieval distillation traditions of Scotland and Ireland, evolving into its modern form through the establishment of taxation, licensing, and refining of distillation techniques in the 18th and 19th centuries. Since the 1960s, distilleries began marketing their brands under the 'Single Malt' identity, growing into a premium category defined by cask experimentation, high-proof bottlings, and single-cask diversity.",
        classifications: [
            {
                name: "Single Malt Scotch Whisky",
                criteria: "Produced at a single Scottish distillery from 100% malted barley; distilled in pot stills; matured in oak (max 700L) for at least 3 years in Scotland; bottled at minimum 40% ABV.",
                description: "The global benchmark. It must legally be distilled and matured in Scotland, with no additives allowed except for plain caramel coloring. Profiles vary by region—Speyside, Highland, Islay—each defined by its water and climate."
            },
            {
                name: "Cask Strength (CS)",
                criteria: "Bottled directly from the cask without water dilution (Proofing), typically ranging from 52% to 65% ABV.",
                description: "Offers the most undiluted and concentrated experience of the spirit. It carries a rich density of wood-derived esters and essential oils, allowing enthusiasts to 'open' the profile with a few drops of water."
            },
            {
                name: "Single Cask (Single Barrel)",
                criteria: "Bottled from one individual cask without any vatting or blending with other barrels from the same distillery.",
                description: "A highly collectible category preserving the 'unique masterpiece' of a specific cask. Factors like warehouse location and wood grain create a profile that can never be replicated once the cask is empty."
            },
            {
                name: "Peated Whisky",
                criteria: "Malted barley is dried over peat fires to infuse smoke and phenolic compounds, measured in PPM (Phenol Parts Per Million).",
                description: "Known for intense smoky, medicinal, and briny notes. Depending on the distillation cut, the flavor can range from heavy, bacon-like smoke to delicate, floral ash."
            },
            {
                name: "Cask Finish",
                criteria: "A spirit is moved to a secondary cask type (Sherry, Wine, Rum, etc.) for a final period of maturation.",
                description: "Expands the flavor profile by layering residual aromas from the previous contents. A delicate process used to add unique character over a short duration."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Strength (ABV)",
                label: "ABV Level",
                value: "40~46% (Standard) / 52~65% (CS)",
                description: "The legal minimum is 40% ABV. Many premium malts are bottled at 46% or higher to avoid chill-filtration, as higher alcohol content keeps flavorful oils in suspension and enhances aromatic volatility."
            },
            {
                metric: "Peat Smoke (PPM)",
                label: "Peatiness",
                value: "0 (Unpeated) ~ 50+ (Heavy Peat)",
                description: "PPM (Phenol Parts Per Million) measures the phenol content in the malted barley. While 30+ is considered 'heavy peat,' the perceived smokiness depends on the distillation cut and maturation period."
            },
            {
                metric: "Age Statement",
                label: "Age (Years)",
                value: "NAS / 10~18 Years / 21+ Years",
                description: "The stated age represents the youngest whisky in the bottle. 'NAS' (Non-Age Statement) expressions focus on cask character and flavor profile rather than just time, becoming a significant part of the premium market."
            },
            {
                metric: "Cask Influence",
                label: "Cask Type",
                value: "First-fill / Refill",
                description: "First-fill casks impart bold vanilla and spice, while refill casks allow the distillery’s core fruity 'New Make' character to shine through more cleanly with less wood interference."
            }
        ],
        coreIngredients: [
            {
                type: "Primary Material",
                name: "Malted Barley",
                description: "The crown jewel of single malt whisky ingredients. 100% barley creates a foundation of biscuit, cereal, and nutty notes. The specific grain variety and malting method are critical to the spirit's body."
            },
            {
                type: "Fermentation Agent",
                name: "Yeast & Brewing Water",
                description: "When asked what is single malt whisky made from, pure water and yeast are the essential drivers of flavor. Yeast creates fruity esters, while water minerality defines the final mouthfeel."
            },
            {
                type: "Aging Vessel",
                name: "Oak Casks",
                description: "Imparts vanillin, lactones, and tannins. Previous contents (Bourbon, Sherry, Port) dictate the secondary flavor layers and the whiskey's natural hue."
            }
        ],
        manufacturingProcess: [
            { step: "Malting", name: "Malting & Kilning", description: "Barley is steeped and germinated to activate enzymes, then dried. Using peat during kilning infuses the malt with smoky compounds." },
            { step: "Mashing", name: "Extraction & Fermentation", description: "Sugars are extracted from the ground malt (Grist) into a liquid (Wort), which is then fermented with yeast for 48-100 hours to create a beer-like 'Wash.'" },
            { step: "Distillation", name: "Pot Still Distillation", description: "Distilled twice in copper stills. The first distillation (Wash Still) increases alcohol, and the second (Spirit Still) carefully separates the 'Hearts' for aging." },
            { step: "Maturation", name: "Aging & Vatting", description: "The spirit spends at least 3 years in oak. The Master Blender then combines (vats) selected casks to maintain the consistent house style before bottling." }
        ],
        servingGuidelines: {
            recommendedGlass: "Glencairn Glass or Tulip-shaped Nosing Glass",
            optimalTemperatures: [
                {
                    temp: "18~22°C (Room Temp)",
                    description: "The balance between fruity aromas and oak flavors is most prominent, clearly revealing stylistic differences."
                },
                {
                    temp: "18~22°C + Water",
                    description: "Reduces alcohol sting and 'unlocks' delicate floral and honey notes, enhancing complexity."
                }
            ],
            methods: [
                {
                    name: "Neat",
                    description: "The gold standard: enjoy the nose first, then take a small sip to feel the texture and finish across the entire palate."
                },
                {
                    name: "Water Addition",
                    description: "Dropping a few drops of room-temp water breaks the surface tension, causing hidden esters to bloom explosively."
                },
                {
                    name: "Highball",
                    description: "Mixed with ice and soda water (1:3). A refreshing way to enjoy the malt's nuttiness and citrus notes, great with meals."
                },
                {
                    name: "On the Rocks",
                    description: "Pouring over a large ice sphere mellows the alcohol heat and emphasizes soft sweetness and a heavy texture."
                }
            ]
        },
        flavorTags: [
            { label: "Vanilla/Caramel", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "Dried Fruit/Sherry", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "Green Apple/Pear", color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
            { label: "Honey/Floral", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "Smoky/Peat", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "Brine/Sea Breeze", color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' }
        ],
        foodPairing: [
            "Smoked Salmon and Fresh Oysters",
            "Steak and Grilled Lamb Chops",
            "Aged Cheddar and Blue Cheese",
            "Dark Chocolate and Tiramisu",
            "Nut and Dried Fruit Platters"
        ],
        dbCategories: ['위스키'],
        relatedPageSlug: 'scotch-whisky-regions',
        relatedPageLabelKo: '🗺️ 스코틀랜드 5대 산지별 위스키 개성 탐험하기 →',
        relatedPageLabelEn: '🗺️ Explore Scotland\'s 5 Whisky Regions →',
        faqs: [
            {
                question: "What is the difference between single malt and blended whisky?",
                answer: "A single malt is made entirely from malted barley at one specific distillery. A blended whisky combines malt whiskies from multiple distilleries with cheaper grain whiskies (like corn or wheat) to create a smoother, more consistent, and mass-market appealing flavor."
            },
            {
                question: "What does 'peat' or 'peated' mean in single malt?",
                answer: "Peat is partially decayed vegetation found in bogs. In some regions like Islay, distilleries burn peat to dry the malted barley. The aromatic smoke infuses the barley with phenols, giving the final whisky its distinctive smoky, medicinal, or campfire-like flavor."
            },
            {
                question: "Does an older age statement mean a better whisky?",
                answer: "Not necessarily. While older age statements (18+ years) extract more complex wood sugars, vanilla, and tannins from the cask making them smoother, younger whiskies (10-15 years) often showcase the distillery's vibrant core characteristics like fresh fruit, floral notes, or intense smoke much better."
            }
        ]
    }
}
