import { SpiritCategory } from './types'

export const whiteWine: SpiritCategory = {
    slug: 'white-wine',
    dbCategories: ['과실주'],
    emoji: '🥂',
    nameKo: '화이트 와인',
    nameEn: 'White Wine',
    taglineKo: '산뜻한 산미와 꽃향기가 전하는 청량한 위로',
    taglineEn: 'Refreshing acidity and floral aromas in a glass',
    color: 'yellow',
    sections: {
        definition: "화이트 와인은 주로 백포도 품종을 압착해 얻은 포도즙을 껍질과의 접촉을 최소화한 채 발효해 만드는 와인으로, 타닌이 낮고 산도·과실향·꽃향 중심의 풍미가 특징이다. 양조 방식에 따라 매우 드라이한 스타일부터 농밀한 디저트 와인까지 폭넓은 스펙트럼을 가진다.",
        history: "고대 지중해 문명권에서부터 시작되었으며, 20세기 후반 스테인리스 탱크와 온도 제어 발효 기술의 보급으로 산뜻하고 향이 선명한 ‘모던 스타일’ 화이트 와인이 대중화되었다. 현재는 오크 숙성이나 서리(Lees) 숙성 등을 통해 복합미를 극대화한 고품질 화이트 와인도 널리 사랑받고 있다.",
        classifications: [
            {
                name: "라이트 & 드라이 (Light & Dry)",
                criteria: "잔당이 거의 없고 가벼운 바디를 지닌 스타일",
                description: "레몬, 라임, 청사과 같은 상큼한 향과 높은 산미, 미네랄리티가 강조된다. 이탈리아 피노 그리지오나 샤블리(샤르도네) 초기 스타일이 대표적이다."
            },
            {
                name: "아로마틱 (Aromatic)",
                criteria: "꽃, 허브, 열대과일 등 품종 고유의 향이 매우 강렬함",
                description: "리슬링, 소비뇽 블랑, 게뷔르츠트라미너 등이 속하며, 코끝을 자극하는 화려한 향기 성분이 풍부하여 향신료 요리와 좋은 궁합을 보여준다."
            },
            {
                name: "풀바디 & 오크 (Full-bodied & Oaked)",
                criteria: "오크 배럴 발효/숙성을 거쳐 질감이 크리미함",
                description: "바닐라, 토스트, 견과류 향과 함께 버터처럼 매끄러운 텍스처를 가진다. 캘리포니아 샤르도네나 부르고뉴 뫼르소 등이 이 스타일에 해당한다."
            },
            {
                name: "세미-스위트 / 디저트 스타일 (Sweet)",
                criteria: "발효 중단 또는 당분 응축을 통해 잔당을 남긴 스타일",
                description: "농밀한 꿀과 잘 익은 과일 향이 특징이다. 소테른(귀부 와인)이나 아이스와인이 대표적이며, 높은 산도가 단맛을 받쳐주어 밸런스를 이룬다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "산도",
                label: "Acidity",
                value: "High to Vibrant (pH 2.9~3.4)",
                description: "화이트 와인의 생명력이다. 입안을 상쾌하게 씻어주며 침샘을 자극하여 식욕을 돋우는 역할을 담당한다."
            },
            {
                metric: "당도",
                label: "Sweetness Scale",
                value: "Bone Dry ~ Luscious",
                description: "발효 후 남은 잔당에 따라 맛의 무게감이 달라진다. 산도가 높을수록 실제 당도보다 덜 달게 느껴지는 경향이 있다."
            },
            {
                metric: "바디감/질감",
                label: "Body & Texture",
                value: "Crisp to Creamy",
                description: "품종과 양조 방식에 따라 정해진다. 가벼운 스타일은 '크리스피(Crisp)'하며, 오크/효모 숙성형은 무게감이 느껴지는 '리치(Rich)'한 질감을 가진다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "백포도 (샤르도네, 소비뇽 블랑, 리슬링 등)",
                description: "각 품종마다 고유한 향기 화합물(티올, 테르펜 등)과 산도 뼈대를 지니고 있어 와인의 기본 정체성을 만든다."
            },
            {
                type: "발효제",
                name: "저온 발효 효모",
                description: "상대적으로 낮은 온도에서 발효하며 포도 고유의 섬세한 꽃과 과일 향을 보존하는 데 최적화된 효모를 사용한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "추출",
                name: "직접 압착 (Direct Pressing)",
                description: "신선함을 위해 저온에서 수확한 포도를 즉시 압착한다. 껍질의 타닌 성분이 추출되지 않도록 맑은 과즙만을 분리한다."
            },
            {
                step: "발효",
                name: "저온 스테인리스 탱크 발효",
                description: "12~18℃의 낮은 온도에서 천천히 발효하여 화사한 아로마와 산도를 최대한 보존한다."
            },
            {
                step: "숙성",
                name: "리스 숙성 (Sur Lie)",
                description: "효모 침전물과 함께 숙성시키며 주기적으로 져어주어(Batonnage) 질감의 풍부함과 풍미를 극대화한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "작고 좁은 보울의 화이트 와인 잔",
            optimalTemperatures: [
                {
                    temp: "7~10℃",
                    description: "가볍고 드라이한 화이트 와인의 산미와 청량감을 극대화하기 좋은 온도다."
                },
                {
                    temp: "10~13℃",
                    description: "오크 숙성된 묵직한 화이트 와인의 복합적인 향을 느끼기에 적합한 온도다."
                }
            ],
            methods: [
                {
                    name: "차게 서빙 (Chilled Service)",
                    description: "아이스 버킷에 넣어 온도를 유지하며 마시는 것이 좋으며, 너무 차가우면 향이 닫힐 수 있으므로 주의한다."
                },
                {
                    name: "브리딩 (Breathing)",
                    description: "고품질 화이트 와인도 잔에서 10~15분 정도 공기와 접촉하면 향의 레이어가 더욱 화사해진다."
                },
                {
                    name: "스프리처 / 와인 에이드",
                    description: "가벼운 화이트 와인은 탄산수나 과일 슬라이스를 곁들여 칵테일처럼 즐기기에도 훌륭하다."
                }
            ]
        },
        flavorTags: [
            { label: "시트러스/레몬", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "청사과/배", color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
            { label: "열대과일/망고", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "화이트 플로럴", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "잔디/허브", color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
            { label: "바닐라/버터(오크)", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "미네랄/젖은돌", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' }
        ],
        foodPairing: [
            "신선한 생선회 및 해산물",
            "레몬과 허브를 곁들인 치킨 구이",
            "가벼운 샐러드 및 고트 치즈",
            "크림 파스타 및 리조또",
            "태국/베트남식 매콤한 요리"
        ],
        relatedPageSlug: 'white-wine-regions',
        relatedPageLabelKo: '🗺️ 샤블리·모젠·알자스·말버러의 화이트 와인 산지 탐험 →',
        relatedPageLabelEn: '🗺️ Explore White Wine Regions of the World →',
    },
    sectionsEn: {
        definition: "White wine is a style of wine primarily produced by fermenting the juice of white grape varieties with minimal skin contact. Characterized by low tannins and a profile centered on high acidity, fresh fruit, and floral aromas, it spans a vast spectrum from bone-dry table wines to luscious, concentrated dessert wines.",
        history: "Originating in the ancient Mediterranean civilizations, white wine evolved significantly in the late 20th century with the introduction of stainless steel tanks and temperature-controlled fermentation. This led to the popularity of the 'Modern Style'—crisp, clean, and aromatically vibrant. Today, premium white wines aged in oak or on lees (sur lie) are highly prized for their deep complexity.",
        classifications: [
            {
                name: "Light & Dry",
                criteria: "Minimal residual sugar and a light, ethereal body.",
                description: "Emphasizes zestiness with notes of lemon, lime, and green apple, supported by high acidity and minerality. Key examples include Italian Pinot Grigio and early-harvest Chablis (Chardonnay)."
            },
            {
                name: "Aromatic",
                criteria: "Intense, distinctive varietal aromas of flowers, herbs, and tropical fruits.",
                description: "Includes varieties like Riesling, Sauvignon Blanc, and Gewürztraminer. These wines possess powerful olfactory compounds that pair exceptionally well with spicy or ethnic cuisines."
            },
            {
                name: "Full-bodied & Oaked",
                criteria: "Creamy texture achieved through oak barrel fermentation and maturation.",
                description: "Features a smooth, buttery texture with secondary notes of vanilla, toast, and nuts. California Chardonnay and Burgundian Meursault are quintessential examples of this rich style."
            },
            {
                name: "Sweet / Dessert Style",
                criteria: "Residual sugar retained through arrested fermentation or concentrated grapes.",
                description: "Characterized by dense notes of honey and overripe fruits. Styles like Sauternes (Noble Rot) or Ice Wine balance their high sweetness with vibrant acidity for a harmonious finish."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Acidity",
                label: "Acidity",
                value: "High to Vibrant (pH 2.9~3.4)",
                description: "The lifeblood of white wine. It cleanses the palate and stimulates salivation, acting as the structural backbone that provides freshness."
            },
            {
                metric: "Sweetness Scale",
                label: "Sweetness",
                value: "Bone Dry ~ Luscious",
                description: "Weight on the palate varies based on residual sugar. Note that high acidity can make a wine taste less sweet than its actual sugar content suggests."
            },
            {
                metric: "Body & Texture",
                label: "Body & Texture",
                value: "Crisp to Creamy",
                description: "Determined by variety and technique. Lighter styles feel 'Crisp' or 'Zesty,' while those with oak or lees aging feel 'Rich' and 'Weighty.'"
            }
        ],
        coreIngredients: [
            {
                type: "Primary Material",
                name: "White Grapes (Chardonnay, Sauvignon Blanc, Riesling, etc.)",
                description: "Each variety contains unique aromatic compounds (Thiols, Terpenes) and an acid structure that defines the wine's identity."
            },
            {
                type: "Fermentation Agent",
                name: "Cold-fermenting Yeast Strains",
                description: "Yeasts optimized for lower temperatures to preserve delicate floral and fruit-driven primary aromas."
            }
        ],
        manufacturingProcess: [
            {
                step: "Extraction",
                name: "Direct Pressing",
                description: "Grapes harvested at cool temperatures are pressed immediately to separate clear juice from skins, preventing the extraction of harsh tannins."
            },
            {
                step: "Fermentation",
                name: "Low-Temperature Stainless Steel Fermentation",
                description: "Fermenting slowly at 12–18°C to retain the maximum amount of volatile aromatics and vibrant acidity."
            },
            {
                step: "Aging",
                name: "Sur Lie & Batonnage",
                description: "Aging the wine on its dead yeast cells (lees) and periodically stirring (batonnage) to enhance mouthfeel, richness, and savory complexity."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Small-bowled White Wine Glass with a Narrow Rim",
            optimalTemperatures: [
                {
                    temp: "7~10°C",
                    description: "Ideal for light, dry whites to maximize their refreshing acidity and crispness."
                },
                {
                    temp: "10~13°C",
                    description: "Suitable for fuller-bodied, oaked white wines to allow their complex layers of aroma to unfold."
                }
            ],
            methods: [
                {
                    name: "Chilled Service",
                    description: "Maintain temperature using an ice bucket, but avoid over-chilling as it can 'mute' the delicate aromatics."
                },
                {
                    name: "Breathing",
                    description: "High-quality white wines benefit from 10–15 minutes of air contact in the glass to open up their aromatic layers."
                },
                {
                    name: "Wine Spritzer",
                    description: "Lighter white wines can be mixed with soda water and fruit slices for a refreshing, low-alcohol alternative."
                }
            ]
        },
        flavorTags: [
            { label: "Citrus/Lemon", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "Green Apple/Pear", color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
            { label: "Tropical/Mango", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "White Floral", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "Grassy/Herbal", color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
            { label: "Vanilla/Butter", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "Mineral/Wet Stones", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' }
        ],
        foodPairing: [
            "Fresh Sashimi and Raw Seafood",
            "Grilled Chicken with Lemon and Herbs",
            "Light Salads and Goat Cheese",
            "Cream-based Pastas and Risotto",
            "Spicy Thai or Vietnamese Cuisine"
        ],
        relatedPageSlug: 'white-wine-regions',
        relatedPageLabelKo: '🗺️ 샤블리·모젠·알자스·말버러의 화이트 와인 산지 탐험 →',
        relatedPageLabelEn: '🗺️ Explore White Wine Regions of the World →',
    }
}
