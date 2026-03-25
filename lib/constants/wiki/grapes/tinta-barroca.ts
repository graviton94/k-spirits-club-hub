import { SpiritCategory } from '../types'

export const tintaBarroca: SpiritCategory = {
    slug: 'tinta-barroca',
    emoji: '🍇',
    nameKo: '틴타 바로카',
    nameEn: 'Tinta Barroca',
    taglineKo: '도루의 과육 넘치는 선물, 부드러운 타닌과 높은 당도의 풍요',
    taglineEn: 'The pulpy gift of Douro, the abundance of soft tannins and high sugar',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '틴타 바로카(Tinta Barroca)는 포르투갈 도루(Douro) 계곡의 5대 핵심 품종 중 하나로, 포트 와인의 "달콤하고 부드러운 힘"을 담당합니다. 높은 당도를 축적하는 능력을 지녀 와인에 풍만한 바디감과 높은 알코올, 그리고 잘 익은 체리와 장과류의 과실미를 선사합니다. 타닌이 거칠지 않고 부드러워 주로 다른 강력한 품종들을 보완하는 핵심 밸런서로 활약합니다.',
        history: '도루 계곡 서늘한 고지대인 "도루 수페리오르" 지역에서 가장 성공적으로 자라나는 품종입니다. 얇은 껍질 때문에 뜨거운 태양에 취약할 수 있지만, 도루의 험준한 지형 속에서 자신만의 영역을 구축해 왔습니다. 남아프리카 공화국으로도 전파되어 포트 스타일 와인의 성공을 이끄는 등 국제적으로도 그 가치를 인정받고 있습니다.',
        classifications: [
            { name: 'Ruby Port Component', criteria: '블렌딩 역할', description: '루비 포트와 같은 젊은 포트 와인에 풍부한 과실향과 알코올 도수를 보완하는 역할' },
            { name: 'Douro Red Blend', criteria: '드라이 스타일', description: '드라이 레드 와인 블렌딩 시 타닌을 부드럽게 만들고 입안을 채워주는 질감을 담당' }
        ],
        sensoryMetrics: [
            { label: '당도 (Sugar)', metric: '잠재 알코올', value: '10/10', description: '당도가 매우 높아 높은 도수의 와인을 만드는 데 최적' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '4/10', description: '공격적이지 않고 매끄럽게 넘어가는 부드러운 타닌' },
            { label: '과실향 (Fruitiness)', metric: '강도', value: '8/10', description: '체리와 자두 등 붉고 검은 과실의 풍부한 과즙미' }
        ],
        flavorTags: [
            { label: '잘 익은 체리', color: 'bg-red-200/20 text-red-700' },
            { label: '블랙베리', color: 'bg-purple-900/20 text-purple-900' },
            { label: '부드러운 스파이스', color: 'bg-orange-100/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: '재배', name: '고지대 재배', description: '얇은 껍질을 직사광선으로부터 보호하기 위해 주로 도루의 서늘한 북향 사면이나 고지대에서 재배합니다.' },
            { step: '발효', name: '과즙 본연의 추출', description: '타닌보다는 신선한 과즙과 알코올을 얻기 위해 침출 시간을 적절히 조절합니다.' }
        ],
        majorRegions: [
            { name: '도루 수페리오르 (Douro)', description: '틴타 바로카가 가장 편안하게 자라며 최고의 농축미를 보여주는 곳', emoji: '🇵🇹' },
            { name: '헬데르버그 (South Africa)', description: '포르투갈 밖에서 틴타 바로카가 가장 성공적으로 자리 잡은 산지', emoji: '🇿🇦' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준형 또는 볼이 넉넉한 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '특유의 리치한 당미와 과실향이 가장 조화롭게 퍼지는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['구운 소시지', '달콤스파이시한 양념 갈비', '초콜릿 디저트', '블루 치즈']
    },
    sectionsEn: {
        definition: "Tinta Barroca is one of the five paramount red grapes of Portugal's Douro Valley, responsible for the 'sweet, supple power' of legendary Ports. Possessing a natural gift for accumulating high sugar levels, it provides wines with immense physical body, high alcohol, and a lush palate of ripe cherries and berries. Known for its soft, non-aggressive tannins, it is a vital 'balancer' in traditional blends, smoothing out more rugged varieties.",
        history: "The variety finds its greatest success in the cooler, higher altitudes of the Douro Superior. Because of its relatively thin skins, it is susceptible to sun-scald, leading viticulturists to plant it on north-facing slopes and at higher elevations. It has also achieved significant international success in South Africa, where it plays a key role in their acclaimed Port-style fortified wines.",
        classifications: [
            { name: 'Ruby Port Component', criteria: 'Blending Role', description: 'Provides essential fruit intensity and alcohol depth to youthful and vibrant Ruby Ports.' },
            { name: 'Douro Red Blend', criteria: 'Dry Style', description: 'Used in dry reds to soften the overall tannin structure and add a rich, fleshy mouthfeel.' }
        ],
        sensoryMetrics: [
            { label: 'Sugar', metric: 'Potential Alcohol', value: '10/10', description: 'High sugar synthesis makes it ideal for producing naturally powerful wines.' },
            { label: 'Tannins', metric: 'Astringency', value: '4/10', description: 'Notably round and smooth, offering immediate approachability.' },
            { label: 'Fruitiness', metric: 'Intensity', value: '8/10', description: 'A pulpy, juicy core dominated by cherries and dark woodland berries.' }
        ],
        flavorTags: [
            { label: 'Ripe Cherry', color: 'bg-red-200/20 text-red-700' },
            { label: 'Blackberry', color: 'bg-purple-900/20 text-purple-900' },
            { label: 'Sweet Spice', color: 'bg-orange-100/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: 'Viticulture', name: 'High-Altitude Farming', description: 'Strategic planting in cooler zones protects the thin skins from intense UV exposure.' },
            { step: 'Fermentation', name: 'Juice-Driven Extraction', description: 'Techniques are tailored to maximize the extraction of rich juice and alcohol while keeping tannin levels moderate.' }
        ],
        majorRegions: [
            { name: 'Douro Superior', description: 'The premier sub-region for concentrated and balanced Tinta Barroca.', emoji: '🇵🇹' },
            { name: 'Helderberg, South Africa', description: "Recognized for producing exceptionally high-quality Tinta Barroca outside of Portugal.", emoji: '🇿🇦' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard or round-bowled Red Wine glass',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'Recommended to appreciate its rich textural sweetness and ripe fruit profile.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Grilled sausages', 'Sweet and spicy BBQ ribs', 'Berry-based chocolate desserts', 'Gorgonzola or Stilton']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['틴타 바로카', 'tinta barroca', '도루', '포트 와인']
}
