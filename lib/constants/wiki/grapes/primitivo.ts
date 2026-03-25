import { SpiritCategory } from '../types'

export const primitivo: SpiritCategory = {
    slug: 'primitivo',
    emoji: '🇮🇹',
    nameKo: '프리미티보',
    nameEn: 'Primitivo',
    taglineKo: '풀리아의 정열, 풍부한 당도와 태양을 닮은 진한 과밀감',
    taglineEn: 'The passion of Puglia, rich sugar and sun-like concentrated richness',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '프리미티보(Primitivo)는 이탈리아 남부 풀리아(Puglia) 지역의 뜨거운 태양을 가장 잘 담아낸 레드 품종입니다. "가장 먼저 익는(Primitivus)" 이라는 이름처럼 조숙한 품종으로, 높은 당도를 축적하여 알코올 도수가 높고 진한 블랙베리, 자두, 그리고 말린 무화과의 풍미가 특징입니다. 미국 캘리포니아의 진판델(Zinfandel)과 유전적으로 동일하지만, 풀리아 특유의 흙 내음과 남성적인 힘이 느껴지는 품종입니다.',
        history: '고대 크로아티아에서 이탈리아 남부로 건너온 것으로 추정되는 유서 깊은 품종입니다. 오랫동안 이탈리아 본토 와인의 도수를 높여주는 블렌딩용으로 쓰였으나, 1990년대 진판델과의 유전적 일치성이 밝혀지면서 세계적인 주목을 받기 시작했습니다. 오늘날에는 만두리아(Manduria) 지역을 중심으로 시칠리아의 네로 다볼라와 함께 남부 이탈리아 레드의 부흥을 이끄는 프리미엄 품종으로 자리 잡았습니다.',
        classifications: [
            { name: 'Primitivo di Manduria DOC', criteria: '최고급 산지', description: '가장 농축되고 힘 있는 프리미티보가 생산되는, 풀리아 최고의 명성지' },
            { name: 'Primitivo del Salento', criteria: '접근성 좋은 스타일', description: '풍부한 과실향과 부드러운 타닌을 지녀 일상적으로 즐기기 좋은 스타일' },
            { name: 'Dolce Naturale', criteria: '디저트 스타일', description: '포도를 나무에서 말려 당도를 극대화한, 진하고 농밀한 스위트 레드 와인' }
        ],
        sensoryMetrics: [
            { label: '알코올 (Alcohol)', metric: '도수', value: '10/10', description: '입안을 가득 채우는 뜨겁고 묵직한 알코올 볼륨' },
            { label: '과실향 (Fruitiness)', metric: '농도', value: '9/10', description: '잘 익은 자두, 무화과, 말린 과일의 풍성한 풍미' },
            { label: '바디 (Body)', metric: '무게감', value: '9/10', description: '풀리아의 열기를 머금은 육중하고 파워풀한 바디' }
        ],
        flavorTags: [
            { label: '말린 무화과', color: 'bg-red-900/20 text-red-900' },
            { label: '블랙베리', color: 'bg-purple-900/20 text-purple-900' },
            { label: '흙 / 담배', color: 'bg-amber-900/20 text-amber-900' }
        ],
        manufacturingProcess: [
            { step: '포도 수확', name: '조기 수확', description: '산도를 지키기 위해 포도가 충분한 당도를 얻는 즉시 빠르게 수확을 진행합니다.' },
            { step: '숙성', name: '오크 숙성', description: '야생적인 타닌을 잠재우고 바닐라와 초콜릿 풍미를 더하기 위해 주로 오크통 숙성을 거칩니다.' }
        ],
        majorRegions: [
            { name: '만두리아 (Manduria)', description: '프리미티보가 가장 위대하고 힘 있게 표현되는 세계적인 성지', emoji: '🇮🇹' },
            { name: '지오이아 델 콜레', description: '고지대에 위치하여 보다 세련된 산도와 우아함을 가진 프리미티보 산지', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 풍부하고 깊은 대형 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '높은 알코올과 진한 과실향이 가장 조화롭게 균형을 이루는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['숯불에 구운 양고기', '미트소스 라자냐', '향이 강한 페코리노 치즈', '바비큐 요리']
    },
    sectionsEn: {
        definition: "Primitivo is the definitive power variety of Puglia in Southern Italy, perfectly capturing the intense Mediterranean sun. Its name, meaning 'first to ripen' (Primitivus), reflects its early harvest nature. It is characterized by exceptionally high sugar levels leading to robust alcohol, combined with deep notes of blackberry, ripe plum, and dried figs. While genetically identical to California's Zinfandel, it offers a more rugged, earthy, and masculine profile typical of its Italian terroir.",
        history: "A variety of profound antiquity believed to have migrated from Illyrian (modern-day Croatia) tribes to Southern Italy. For generations, it was used primarily as a blending component to add muscle and color to Northern wines. Since the discovery of its genetic link to Zinfandel in the 1990s, it has undergone a dramatic prestige revolution, spearheaded by the producers of Manduria, emerging as a global symbol of high-end Southern Italian red wine.",
        classifications: [
            { name: 'Primitivo di Manduria DOC', criteria: 'Flagship Terroir', description: 'The absolute standard for the most concentrated, powerful, and iconic expressions of the variety.' },
            { name: 'Primitivo del Salento', criteria: 'Approachable Style', description: 'Fruit-forward and supple, designed for immediate enjoyment and food friendliness.' },
            { name: 'Dolce Naturale', criteria: 'Dessert Style', description: 'A luscious sweet red made from partially dried grapes, offering extreme concentration and depth.' }
        ],
        sensoryMetrics: [
            { label: 'Alcohol', metric: 'Power', value: '10/10', description: 'Frequently reaches high levels that provide a warm, authoritative mouthfeel.' },
            { label: 'Fruitiness', metric: 'Intensity', value: '9/10', description: 'Dominated by sun-drenched notes of blackberry jam and dried Mediterranean fruits.' },
            { label: 'Body', metric: 'Weight', value: '9/10', description: 'Features a massive, palate-coating full-bodied presence.' }
        ],
        flavorTags: [
            { label: 'Dried Fig', color: 'bg-red-900/20 text-red-900' },
            { label: 'Blackberry', color: 'bg-purple-900/20 text-purple-900' },
            { label: 'Earth / Tobacco', color: 'bg-amber-900/20 text-amber-900' }
        ],
        manufacturingProcess: [
            { step: 'Harvesting', name: 'Strategic Early Picking', description: 'Vital to harvest the moment optimal sugar is reached to prevent the loss of necessary Balancing acidity.' },
            { step: 'Aging', name: 'Oak Maturation', description: 'Matured in barrel to tame its vigorous tannins and introduce secondary layers of baking spice and dark cocoa.' }
        ],
        majorRegions: [
            { name: 'Manduria', description: 'The undisputed spiritual home where Primitivo achieves its grandest scale.', emoji: '🇮🇹' },
            { name: 'Gioia del Colle', description: 'Higher altitude vineyards producing more structured and acid-driven, elegant expressions.', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Large, deep Red Wine glass with a generous bowl',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'The ideal range for balancing its potent alcohol with its rich, dark fruit core.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Grilled lamb chops', 'Rich Lasagna al Forno', 'Sharp Pecorino or Parmesan', 'Hearty roasted game']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['프리미티보', 'primitivo', '만두리아', 'manduria']
}
