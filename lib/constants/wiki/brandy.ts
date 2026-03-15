import { SpiritCategory } from './types'

export const brandy: SpiritCategory = {
    slug: 'brandy',
    emoji: '🍇',
    nameKo: '브랜디',
    nameEn: 'Brandy',
    taglineKo: '과일을 발효·증류해 만든 우아한 스피리츠',
    taglineEn: 'Elegant spirit distilled from fermented fruit, wine, or pomace',
    color: 'orange',
    sections: {
        definition: "브랜디(Brandy)는 포도나 사과·배 등 과일을 발효해 만든 과실주를 증류한 뒤, 오크 숙성을 거치거나 그대로 병입하여 완성하는 증류주다. 과실 본연의 향과 숙성을 통한 오크·바닐라·란시오(Rancio)까지 폭넓은 풍미 스펙트럼을 지닌다.",
        history: "중세 유럽에서 와인을 장거리 운송하기 위해 증류하여 농축하던 '브란데베인(Brandewijn)'에서 유래했다. 프랑스의 코냑과 아르마냑 지역을 중심으로 증류·숙성 기술이 비약적으로 발전하며 근대 주류 문화의 정점에 있는 프리미엄 스피릿으로 자리 잡았다.",
        classifications: [
            {
                name: "포도 브랜디 (Grape Brandy)",
                criteria: "포도즙을 발효한 베이스 와인을 증류",
                description: "가장 전형적인 브랜디다. 코냑과 아르마냑이 대표적이며, 포도의 꽃향기와 숙성된 건과일, 견과류 향이 조화를 이루는 우아한 스타일이다."
            },
            {
                name: "과실 브랜디 (Eau-de-vie / Fruit Brandy)",
                criteria: "사과, 배, 체리 등 포도 이외의 과일을 발효 후 증류",
                description: "원료 과실의 생동감 넘치는 아로마가 특징이다. 프랑스의 깔바도스(사과)가 대표적이며, 무숙성 스타일은 과일의 정수를 담은 듯한 향기를 보여준다."
            },
            {
                name: "포마스 브랜디 (Pomace / Grappa)",
                criteria: "와인 압착 후 남은 포도 껍질과 씨를 증류",
                description: "그라파(Grappa) 등이 대표적이다. 껍질 유래의 허브, 건초, 견과류 같은 독특한 페놀릭한 질감과 강렬한 개성을 지닌다."
            },
            {
                name: "코냑 AOC (Cognac)",
                criteria: "샤랑트 지역 생산 + 구리 포트스틸 2회 증류",
                description: "엄격한 기준에 의해 생산되며, 실키한 질감과 플로럴한 탑노트, 장기 숙성에서 오는 란시오(가죽, 버섯 향)의 정교함이 세계 최고 수준이다."
            },
            {
                name: "아르마냑 AOC (Armagnac)",
                criteria: "가스코뉴 지역 생산 + 전통 연속식 증류기 사용",
                description: "코냑보다 더 풍부한 향 성분이 남아 야생적이고 풍부한 과실향, 스파이스, 흙내음 등 테루아의 개성이 명확하게 드러나는 스타일이다."
            },
            {
                name: "헤레스 브랜디 (Brandy de Jerez)",
                criteria: "스페인 헤레스 지역 생산 + 솔레라 시스템 숙성",
                description: "셰리 캐스크 숙성을 통해 견과, 카라멜, 말린 과일 향이 매우 진하게 형성된다. 묵직하고 달콤한 인상을 주는 것이 특징이다."
            },
            {
                name: "V.S / V.S.O.P / X.O / Extra",
                criteria: "최연소 원액의 오크 숙성 기간(2년/4년/10년 이상)에 따른 분류",
                description: "숙성이 길어질수록 과실의 매력은 깊은 숙성미(초콜릿, 가죽, 견과)로 변하며 향의 층위가 기하급수적으로 복합해진다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "숙성 성숙도",
                label: "Maturation Path",
                value: "Fruit → Spice → Rancio",
                description: "시간에 따라 원료 과실향에서 오크 스파이스를 거쳐, 장기 숙성 브랜디의 정점인 란시오(Rancio) 향으로 진화한다."
            },
            {
                metric: "알코올 통합감",
                label: "Mouthfeel",
                value: "Velvety & Silky",
                description: "고급 브랜디일수록 높은 도수임에도 불구하고 입안에서 벨벳처럼 매끄럽게 감기며 타격감보다 향의 확산이 두드러진다."
            },
            {
                metric: "피니시 지속력",
                label: "Persistence",
                value: "Very Short up to 30 mins",
                description: "고숙성 XO 이상의 제품은 한 모금 뒤에도 입안과 코끝에 향이 수십 분간 남아있는 놀라운 지속력을 보여준다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "고산도 화이트 와인 (우니 블랑 등)",
                description: "산도가 높은 와인은 증류 후 향의 뼈대를 남기며, 장기 숙성 시 복합미로 발전할 수 있는 최적의 기반을 제공한다."
            },
            {
                type: "숙성용기",
                name: "프렌치 오크 (리무쟁/트롱세)",
                description: "오크 결의 밀도에 따라 탄닌의 추출 속도를 조절하며 브랜디에 바닐라, 시나몬, 견과류 풍미를 입힌다."
            }
        ],
        manufacturingProcess: [
            {
                step: "증류",
                name: "포트스틸 2회 증류 (코냑 방식)",
                description: "구리 증류기에서 두 번에 걸쳐 천천히 증류하여 순수하고 우아한 원액(Eau-de-vie)만을 정교하게 분리한다."
            },
            {
                step: "숙성",
                name: "배럴 에이징 및 산화",
                description: "오크통에서 수년~수십 년간 숨을 쉬며 알코올의 각을 깎고 숙성 에스터를 생성하여 향의 깊이를 완성한다."
            },
            {
                step: "블렌딩",
                name: "아상블라주 (Assemblage)",
                description: "마스터 블렌더가 수백 종의 원액을 조합하여 일관된 하우스 스타일과 입체적인 향미 레이어를 완성한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "튤립형 브랜디 잔 또는 스니프터",
            optimalTemperatures: [
                {
                    temp: "18~22℃ (상온)",
                    description: "숙성 브랜디의 복합적인 아로마가 가장 균형 있게 피어오르며 알코올 자극이 적절한 온도다."
                },
                {
                    temp: "14~16℃ (약간 서늘하게)",
                    description: "젊은 V.S급이나 과실 브랜디에서 과일 본연의 향이 더 산뜻하게 강조되는 온도다."
                }
            ],
            methods: [
                {
                    name: "니트 (Neat/Sipping)",
                    description: "잔에 따른 뒤 벤팅(공기 접촉) 시간을 충분히 갖고, 향의 변화를 느끼며 천천히 한 모금씩 마시는 정석적인 방법이다."
                },
                {
                    name: "핸드 워밍 (Hand Warming)",
                    description: "스니프터 잔의 아래쪽을 손바닥으로 감싸 온기를 전달하면 묵직한 숙성향과 란시오가 더욱 화려하게 발산된다."
                },
                {
                    name: "브랜디 하이볼 (Sidecar Style)",
                    description: "V.S.O.P급 브랜디에 탄산수나 진저에일을 곁들여 브랜디 특유의 고급스러운 단맛을 청량하게 즐길 수도 있다."
                }
            ]
        },
        flavorTags: [
            { label: "건과일/레이즌", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "바닐라/카라멜", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "오크/토스트", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "시나몬/스파이스", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "견과/셰리향", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "화이트 플라워", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "란시오/가죽", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' }
        ],
        foodPairing: [
            "다크 초콜릿 및 테라미수",
            "아몬드, 호두 등 구운 견과류",
            "숙성 치즈 (콩테, 블루치즈)",
            "푸아그라 및 무거운 소스의 스테이크",
            "사과 타르트 및 크렘 브륄레"
        ],
        dbCategories: ['브랜디'],
        relatedPageSlug: 'brandy-regions',
        relatedPageLabelKo: '🗺️ 코냑·아르마냑·그라파·피스코 세계 브랜디 산지 탐험 →',
        relatedPageLabelEn: '🗺️ Explore World Brandy Regions (Cognac, Armagnac, Grappa, Pisco) →',
        faqs: [
            {
                question: "코냑과 브랜디의 차이점은 무엇인가요?",
                answer: "브랜디는 과일을 증류한 모든 술을 통칭하는 큰 카테고리입니다. 코냑은 프랑스의 '코냑(Cognac)'이라는 특정 지방에서, 정해진 엄격한 법적 규정(포도 품종 제한, 구리 포트스틸 2회 증류 등)을 지켜 만들어진 최고급 브랜디만을 부르는 이름입니다. 즉, 모든 코냑은 브랜디이지만, 모든 브랜디가 코냑인 것은 아닙니다."
            },
            {
                question: "브랜디의 평균 알코올 도수는 얼마나 되나요?",
                answer: "대부분의 상업용 브랜디(코냑, 아르마냑 포함)는 병입 시 40% (80 proof)의 알코올 도수를 가집니다. 오크통 숙성 과정이나 정제수 가수를 통해 마시기 부드러운 도수인 40% 수준으로 맞추어 출시됩니다."
            }
        ]
    },
    sectionsEn: {
        definition: "Brandy is a distilled spirit produced by fermenting fruit juices—such as grapes, apples, or pears—into wine, which is then distilled and either aged in oak or bottled directly. It possesses a wide flavor spectrum, ranging from the essence of the raw fruit to complex notes of oak, vanilla, and 'Rancio' acquired through maturation.",
        history: "The term originates from 'Brandewijn' (burnt wine), a method used in medieval Europe to concentrate wine for long-distance transport. With significant advancements in distillation and aging techniques centered in the Cognac and Armagnac regions of France, brandy has established itself as a premium spirit at the pinnacle of modern drinking culture.",
        classifications: [
            {
                name: "Grape Brandy",
                criteria: "Distilled from base wine made by fermenting grape juice.",
                description: "The most classic form of brandy. Represented by Cognac and Armagnac, it is an elegant style where floral grape notes harmonize with aged dried fruits and nuts."
            },
            {
                name: "Fruit Brandy (Eau-de-vie)",
                criteria: "Distilled from fermented fruits other than grapes, such as apples, pears, or cherries.",
                description: "Characterized by the vibrant, lively aroma of the source fruit. Calvados (apple) from France is a prime example; unaged styles offer a pure aromatic essence of the fruit."
            },
            {
                name: "Pomace Brandy (Grappa)",
                criteria: "Distilled from the grape skins, pulp, and seeds (pomace) left over after winemaking.",
                description: "Represented by Italian Grappa. It features a unique phenolic texture with notes of herbs, hay, and nuts derived from the skins, offering an intense personality."
            },
            {
                name: "Cognac AOC",
                criteria: "Produced in the Charente region + double-distilled in copper pot stills.",
                description: "Produced under strict regulations, it is world-renowned for its silky texture, floral top notes, and the sophistication of Rancio (notes of leather and mushroom) developed through long-term aging."
            },
            {
                name: "Armagnac AOC",
                criteria: "Produced in the Gascony region + distilled using traditional continuous stills.",
                description: "Retains more aromatic compounds than Cognac, resulting in a more rustic, robust style with distinct terroir characteristics such as wild fruit, spice, and earthy tones."
            },
            {
                name: "Brandy de Jerez",
                criteria: "Produced in the Jerez region of Spain + aged using the Solera system.",
                description: "Heavy sherry cask influence creates deep notes of nuts, caramel, and dried fruits. It is characterized by a rich, heavy, and sweet impression."
            },
            {
                name: "V.S / V.S.O.S / X.O / Extra",
                criteria: "Classified by the oak aging period of the youngest eau-de-vie (2 / 4 / 10+ years).",
                description: "As aging progresses, the fruit's charm evolves into deep tertiary notes (chocolate, leather, nuts), with the complexity of flavor layers increasing exponentially."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Maturation Maturity",
                label: "Maturation Path",
                value: "Fruit → Spice → Rancio",
                description: "Over time, the profile evolves from raw fruitiness through oak spices to Rancio—the pinnacle of long-aged brandy aroma."
            },
            {
                metric: "Alcohol Integration",
                label: "Mouthfeel",
                value: "Velvety & Silky",
                description: "High-quality brandies feel velvety and smooth on the palate despite high ABV; the expansion of aroma is more prominent than the alcoholic 'burn'."
            },
            {
                metric: "Finish Persistence",
                label: "Persistence",
                value: "Very Short up to 30 mins",
                description: "Extraordinarily well-aged products (XO and above) can leave lingering notes in the mouth and nose for dozens of minutes after a single sip."
            }
        ],
        coreIngredients: [
            {
                type: "Primary Ingredient",
                name: "High-Acid White Wine (e.g., Ugni Blanc)",
                description: "High-acidity wines preserve the aromatic framework after distillation and provide the ideal foundation for developing complexity during long-term aging."
            },
            {
                type: "Aging Vessel",
                name: "French Oak (Limousin/Tronçais)",
                description: "The grain density of the oak controls the extraction rate of tannins, imparting flavors of vanilla, cinnamon, and nuts to the brandy."
            }
        ],
        manufacturingProcess: [
            {
                step: "Distillation",
                name: "Double Pot Still Distillation (Cognac Method)",
                description: "If you wonder how brandy is made, distillation is the core. It is slowly distilled twice in copper stills immediately following brandy fermentation to precisely isolate the purest heart of the spirit (Eau-de-vie)."
            },
            {
                step: "Maturation",
                name: "Barrel Aging and Oxidation",
                description: "The spirit 'breathes' in oak barrels for years, rounding off the harsh alcohol edge and creating aging esters to finalize its aromatic depth."
            },
            {
                step: "Blending",
                name: "Assemblage",
                description: "A Master Blender combines hundreds of different eaux-de-vie to achieve a consistent house style and create multi-dimensional flavor layers."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Tulip-shaped Brandy Glass or Snifter",
            optimalTemperatures: [
                {
                    temp: "18~22°C (Room Temp)",
                    description: "The temperature where the complex aromas of aged brandy bloom most harmoniously with appropriate alcohol integration."
                },
                {
                    temp: "14~16°C (Slightly Cool)",
                    description: "The temperature where the natural fruitiness of younger V.S. grades or fruit brandies is more crisply emphasized."
                }
            ],
            methods: [
                {
                    name: "Neat / Sipping",
                    description: "The standard method: pour into a glass, allow sufficient time for venting (aeration), and sip slowly to appreciate the evolution of aromas."
                },
                {
                    name: "Hand Warming",
                    description: "Cradling the bottom of a snifter glass with the palm transfers body heat, causing heavy aged notes and Rancio to radiate more vibrantly."
                },
                {
                    name: "Brandy Highball (Sidecar Style)",
                    description: "Mixing V.S.O.P grade brandy with sparkling water or ginger ale offers a refreshing way to enjoy the sophisticated sweetness unique to brandy."
                }
            ]
        },
        flavorTags: [
            { label: "Dried Fruit / Raisin", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "Vanilla / Caramel", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "Oak / Toast", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "Cinnamon / Spice", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "Nutty / Sherry-like", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "White Flowers", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "Rancio / Leather", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' }
        ],
        foodPairing: [
            "Dark Chocolate and Tiramisu",
            "Roasted nuts such as Almonds and Walnuts",
            "Aged Cheeses (Comté, Blue Cheese)",
            "Foie Gras and Steaks with heavy sauces",
            "Apple Tart and Crème Brûlée"
        ],
        dbCategories: ['브랜디'],
        relatedPageSlug: 'brandy-regions',
        relatedPageLabelKo: '🗺️ 코냑·아르마냑·그라파·피스코 세계 브랜디 산지 탐험 →',
        relatedPageLabelEn: '🗺️ Explore World Brandy Regions (Cognac, Armagnac, Grappa, Pisco) →',
        faqs: [
            {
                question: "What is the difference between Cognac and Brandy?",
                answer: "Brandy is a broad category for any spirit distilled from fermented fruit juice. Cognac is a specific, highly regulated type of brandy produced only in the Cognac region of France, using specific grape varieties and strict double-distillation methods. Simply put: all Cognac is brandy, but not all brandy is Cognac."
            },
            {
                question: "What is the average brandy alcohol percentage?",
                answer: "The vast majority of commercially available brandy, including Cognac and Armagnac, is bottled at 40% ABV (80 proof). While the spirit comes off the still at around 70% ABV, it naturally drops in proof during years of oak aging, and is usually cut with pure water before bottling to achieve the standard 40%."
            }
        ]
    }
}
