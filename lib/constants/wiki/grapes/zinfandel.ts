import { SpiritCategory } from '../types'

export const zinfandel: SpiritCategory = {
    slug: 'zinfandel',
    emoji: '🇺🇸',
    nameKo: '진판델',
    nameEn: 'Zinfandel',
    taglineKo: '캘리포니아의 태양, 달콤한 잼의 풍요로움과 뜨거운 풍미의 축제',
    taglineEn: 'The sun of California, a festival of jammy richness and hot flavors',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '진판델(Zinfandel)은 미국 캘리포니아 와인의 자부심을 상징하는 레드 품종입니다. 높은 당도를 축적하는 특성 덕분에 알코올 도수가 높고, 잘 익은 블랙베리, 딸기 잼, 그리고 입안을 자극하는 검은 후추의 스파이시함이 특징입니다. 풍성한 과실미와 묵직한 바디감을 지녀, 신대륙 와인의 호쾌하고 화려한 매력을 가장 잘 보여주는 품종입니다.',
        history: '오랫동안 미국의 토착 품종으로 여겨졌으나, 21세기 유전자 분석을 통해 크로아티아의 "트리비드라그(Tribidrag)"와 이탈리아의 "프리미티보(Primitivo)"와 같은 품종임이 밝혀졌습니다. 19세기 캘리포니아 골드러시 시대에 유입되어 척박한 땅에서도 잘 자라며 미국인들의 국민 와인이 되었고, 특히 고목(Old Vines)에서 생산되는 진판델은 독보적인 농축미를 자랑합니다.',
        classifications: [
            { name: 'Old Vine Zinfandel', criteria: '수령 등급', description: '50년~100년 이상 된 고목에서 생산되어 경이로운 농축미와 깊이를 지닌 스타일' },
            { name: 'White Zinfandel', criteria: '로제 스타일', description: '1970년대 선풍적 인기를 끌었던, 달콤하고 가벼운 핑크빛 로제 스타일' },
            { name: 'Lodi Zinfandel', criteria: '주요 산지', description: '진판델의 수도라 불리는 로다이 지역의 뜨거운 태양이 빚어낸 리치하고 과감한 스타일' }
        ],
        sensoryMetrics: [
            { label: '과실향 (Fruitiness)', metric: '농도', value: '10/10', description: '신선한 딸기부터 달콤한 자두 잼까지 이어지는 과실의 향연' },
            { label: '알코올 (Alcohol)', metric: '도수', value: '9/10', description: '입안을 뜨겁게 달궈주는 높고 묵직한 알코올 볼륨' },
            { label: '스파이스 (Spice)', metric: '풍미', value: '8/10', description: '시나몬과 검은 후추가 어우러진 이국적인 풍미' }
        ],
        flavorTags: [
            { label: '딸기 잼', color: 'bg-red-200/20 text-red-700' },
            { label: '검은 후추', color: 'bg-stone-700/20 text-stone-900' },
            { label: '시나몬', color: 'bg-orange-100/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: '수확', name: '불균일 숙성 관리', description: '한 송이 안에서도 포도알이 익는 속도가 다르므로, 최적의 당도를 위해 선별 수확이 중요합니다.' },
            { step: '발효', name: '고당도 발효', description: '높은 당도가 충분한 알코올과 풍미로 변환될 수 있도록 정교한 효모 관리가 필요합니다.' }
        ],
        majorRegions: [
            { name: '로다이 (Lodi)', description: '전 세계에서 가장 오래된 진판델 고목들이 살아 숨 쉬는 성지', emoji: '🇺🇸' },
            { name: '드라이 크리크 밸리', description: '우아한 산미와 탄탄한 구조감을 가진 균형 잡힌 진판델의 산지', emoji: '🇺🇸' },
            { name: '나파 밸리 (Napa)', description: '가장 럭셔리하고 웅장한 스타일의 진판델이 탄생하는 곳', emoji: '🇺🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 넓고 입구가 넉넉한 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '높은 알코올과 풍성한 과실 잼 향이 가장 호쾌하게 어우러지는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['바비큐 폭립', '매콤한 제육볶음', '베이컨 치즈 버거', '블루 치즈']
    },
    sectionsEn: {
        definition: "Zinfandel is the proud emblem of California winemaking, offering a bold and unapologetic expression of the American sun. Known for its ability to accumulate high sugar levels, it produces wines with elevated alcohol and a lush profile of blackberries, strawberry jam, and tingling black pepper spice. It represents the ultimate exuberant and flamboyant side of New World red wine.",
        history: "Long considered a native American grape, DNA testing in the 21st century revealed it is identical to Croatia's 'Tribidrag' and Italy's 'Primitivo.' It arrived in California during the 19th-century Gold Rush and became a staple due to its resilience. Today, 'Old Vine' Zinfandel—harvested from vineyards that are 50 to 100+ years old—is revered as a national treasure for its incomparable concentration and soulful depth.",
        classifications: [
            { name: 'Old Vine Zinfandel', criteria: 'Vine Age', description: 'Sourced from century-old vines, offering incredible complexity, spice, and concentrated fruit.' },
            { name: 'White Zinfandel', criteria: 'Rosé Style', description: 'A massively popular, sweet, and approachable pink-colored wine style popularized in the 1970s.' },
            { name: 'Lodi Zinfandel', criteria: 'Regional Style', description: "The definitive rich and jammy style from the variety's unofficial global capital." }
        ],
        sensoryMetrics: [
            { label: 'Fruitiness', metric: 'Intensity', value: '10/10', description: 'A riot of ripe berries ranging from fresh strawberries to stewed plums.' },
            { label: 'Alcohol', metric: 'Power', value: '9/10', description: 'Often features high alcohol levels that provide a warm, full-bodied mouthfeel.' },
            { label: 'Spice', metric: 'Edge', value: '8/10', description: 'Signature notes of cinnamon, clove, and cracked black pepper.' }
        ],
        flavorTags: [
            { label: 'Strawberry Jam', color: 'bg-red-200/20 text-red-700' },
            { label: 'Black Pepper', color: 'bg-stone-700/20 text-stone-900' },
            { label: 'Cinnamon', color: 'bg-orange-100/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: 'Harvesting', name: 'Uneven Ripening Management', description: 'Requires precise timing as berries within a single bunch often ripen at different rates, leading to raisins and green berries together.' },
            { step: 'Fermentation', name: 'High-Brix Fermentation', description: 'Demands expert yeast management to handle the high sugar levels and convert them into the variety’s signature robust alcohol and flavor.' }
        ],
        majorRegions: [
            { name: 'Lodi', description: 'The historic heartland home to the world’s largest concentration of ancient Zinfandel vines.', emoji: '🇺🇸' },
            { name: 'Dry Creek Valley', description: 'Produces structured, balanced, and spicy Zinfandels with great aging potential.', emoji: '🇺🇸' },
            { name: 'Napa Valley', description: 'Source for the most luxurious, opulent, and high-end expressions of the variety.', emoji: '🇺🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Generous, wide-bowled Red Wine glass',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'Ideal for allowing the rich, jammy fruit and exotic spices to bloom on the palate.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['BBQ Pork Ribs', 'Spicy Korean bulgogi', 'Bacon Cheeseburger', 'Piquant Blue cheeses']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['진판델', 'zinfandel', '캘리포니아', 'california']
}
