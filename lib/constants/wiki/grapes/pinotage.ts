import { SpiritCategory } from '../types'

export const pinotage: SpiritCategory = {
    slug: 'pinotage',
    emoji: '🔥',
    nameKo: '피노타지',
    nameEn: 'Pinotage',
    taglineKo: '남아공의 거친 찬가, 야성적인 검은 과실과 훈연 향의 하모니',
    taglineEn: 'South Africas wild anthem, a harmony of wild black fruits and smoky notes',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '피노타지(Pinotage)는 남아프리카 공화국을 상징하는 독보적인 토착 품종입니다. 우아한 "피노 누아(Pinot Noir)"와 강인한 "생소(Cinsault)"를 교배하여 탄생했으며, 진한 루비색과 함께 블랙베리, 구운 마시멜로, 연기, 그리고 때로는 개성 있는 페인트 나프타 향이 특징입니다. 부드러운 시작과 달리 묵직한 바디감과 야생적인 풍미를 지녀 전 세계 와인 중 가장 호불호가 갈리면서도 마니아층이 두터운 품종입니다.',
        history: '1925년 남아공 스텔렌보스 대학의 에이브러햄 페롤(Abraham Perold) 교수에 의해 탄생했습니다. 피노 누아의 고귀함과 생소의 다산성을 결합하려는 시도였으나, 결과물은 두 부모 품종과는 전혀 다른 남아공만의 독특한 개성을 가진 새로운 괴물로 태어났습니다. 한때 양조상의 결함으로 외면받기도 했으나, 현대에 들어 세밀한 온도 조절과 오크 숙성을 통해 위대한 프리미엄 와인으로 재평가받고 있습니다.',
        classifications: [
            { name: 'Coffee Pinotage', criteria: '풍미 스타일', description: '강하게 덖은 오크통을 사용하여 커피와 다크 초콜릿 향을 극대화한 독특한 스타일' },
            { name: 'Cape Blend', criteria: '블렌딩 등급', description: '피노타지를 최소 30% 이상 포함한 남아공 전통의 고품질 레드 블렌딩 와인' },
            { name: 'Old Vine Pinotage', criteria: '나무 수령', description: '수십 년 된 고목에서 생산되어 더욱 깊고 우아한 질감을 지닌 상급 스타일' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '8/10', description: '입안을 꽉 채우는 묵직하고 남성적인 바디' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '7/10', description: '힘이 있지만 잘 다듬어진 단단한 타닌' },
            { label: '스모키 (Smoky)', metric: '참나무 느낌', value: 'High', description: '피노타지 특유의 연기와 훈연 아로마' }
        ],
        flavorTags: [
            { label: '블랙베리', color: 'bg-purple-900/20 text-purple-900' },
            { label: '볶은 커피', color: 'bg-stone-700/20 text-stone-800' },
            { label: '훈연 연기', color: 'bg-slate-400/20 text-slate-700' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '고온 속성 발효', description: '특유의 개성을 살리기 위해 전통적으로 상대적으로 높은 온도에서 빠르게 발효를 진행하기도 합니다.' },
            { step: '숙성', name: '토스티한 오크 숙성', description: '연기나 커피 뉘앙스를 부여하기 위해 고도로 구워진 오크통(Toasted Oak)을 적극적으로 사용하기도 합니다.' }
        ],
        majorRegions: [
            { name: '스텔렌보스 (Stellenbosch)', description: '피노타지가 탄생한 곳이자 세계 최고의 품질이 생산되는 핵심지', emoji: '🇿🇦' },
            { name: '파를 (Paarl)', description: '더욱 묵직하고 농축된 스타일의 피노타지가 자라나는 산지', emoji: '🇿🇦' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 깊고 넉넉한 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '특유의 스모키한 향과 검은 과실 풍미가 가장 조화롭게 퍼지는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['바비큐 요리', '양고기 구이', '매운 양념의 제육볶음', '훈제 소시지']
    },
    sectionsEn: {
        definition: "Pinotage is the singular flagship red variety of South Africa, created by crossing the noble 'Pinot Noir' with the resilient 'Cinsault.' It is characterized by its deep ruby hue and a polarizing yet fascinating profile of blackberry, roasted marshmallow, woodsmoke, and occasionally, its signature 'paint-like' naphtha notes. Possessing a heavy body and wild flavors, it stands as one of the most distinctive and memorable varieties in the global wine scene.",
        history: "Developed in 1925 by Professor Abraham Perold at Stellenbosch University, the grape was an ambitious attempt to combine the elegance of Pinot Noir with the productivity of Cinsault. The result was a 'new beast' entirely unique to South Africa. Despite early struggles with winemaking defects, modern techniques such as precise temperature control and strategic oak aging have elevated Pinotage into the ranks of prestigious, internationally acclaimed premium wines.",
        classifications: [
            { name: 'Coffee Pinotage', criteria: 'Flavor Profile', description: 'A unique style using heavily toasted oak to maximize notes of espresso and dark chocolate.' },
            { name: 'Cape Blend', criteria: 'Regional Grade', description: 'A traditional South African red blend requiring a minimum of 30% Pinotage for quality certification.' },
            { name: 'Old Vine Pinotage', criteria: 'Vine Age', description: 'Sophisticated expressions from decades-old vines that offer greater depth, elegance, and longevity.' }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '8/10', description: 'A bold, masculine, and mouth-filling full-bodied presence.' },
            { label: 'Tannins', metric: 'Astringency', value: '7/10', description: 'Powerful yet increasingly refined in premium modern expressions.' },
            { label: 'Smokiness', metric: 'Intensity', value: 'High', description: 'The hallmark varietal character of woodsmoke and charred notes.' }
        ],
        flavorTags: [
            { label: 'Blackberry', color: 'bg-purple-900/20 text-purple-900' },
            { label: 'Roasted Coffee', color: 'bg-stone-700/20 text-stone-800' },
            { label: 'Woodsmoke', color: 'bg-slate-400/20 text-slate-700' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Rapid High-Temp Fermentation', description: 'Traditional methods often involve warmer fermentation to emphasize the variety’s specific aromatic character.' },
            { step: 'Aging', name: 'Toasted Oak Maturation', description: 'Frequent use of heavily toasted barrels to lean into the smoky and roasted flavor profile.' }
        ],
        majorRegions: [
            { name: 'Stellenbosch', description: "The birthplace and spiritual capital for high-quality, international-grade Pinotage.", emoji: '🇿🇦' },
            { name: 'Paarl', description: 'A warmer inland region producing rich, powerful, and deeply concentrated styles.', emoji: '🇿🇦' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Deep and generous Red Wine glass',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'The ideal range for allowing its smoky aromatics and dark fruit notes to harmonize.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Barbecue (Braai)', 'Grilled lamb', 'Spicy seasoned pork', 'Smoked sausages']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['피노타지', 'pinotage']
}
