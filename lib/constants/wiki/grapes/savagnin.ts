import { SpiritCategory } from '../types'

export const savagnin: SpiritCategory = {
    slug: 'savagnin',
    emoji: '🧀',
    nameKo: '사바냉',
    nameEn: 'Savagnin',
    taglineKo: '쥬라 전설의 주인공, "옐로 와인"에 깃든 견과류와 세월의 깊이',
    taglineEn: 'The protagonist of Jura legends, the depth of nuts and time in "Yellow Wine"',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '사바냉(Savagnin)은 프랑스 쥬라(Jura) 지역의 고고한 자부심을 상징하는 화이트 품종입니다. 매우 날카롭고 탄탄한 산도를 지녀 셰리와 유사한 산화 숙성을 견디기에 최적이며, 이를 통해 전설적인 "뱅 존(Vin Jaune, 옐로 와인)"을 탄생시킵니다. 호두, 헤이즐넛, 그리고 독특한 커리 스파이스 풍미를 지녀 전 세계 화이트 와인 중 가장 독창적이고 강렬한 개성을 자랑합니다.',
        history: '프랑스 동부의 쥬라 지역에서 수 세기 동안 재배되어 온 매우 유서 깊은 품종으로, 게뷔르츠트라미너의 조상 격인 품종으로도 알려져 있습니다. 쥬라의 험준한 지형과 서늘한 기후 속에서 천천히 익어가며 에너지를 응축시키며, "뱅 존"이라는 독보적인 세계관을 구축하여 한정된 생산량에도 불구하고 전 세계 전문가들 사이에서 숭상받는 존재가 되었습니다.',
        classifications: [
            { name: 'Vin Jaune', criteria: '산화 숙성 스타일', description: '효모막 아래서 6년 3개월 이상 숙성되어 황금빛 도는 호두와 카레 풍미의 정점' },
            { name: 'Savagnin Ouillé', criteria: '현대적 스타일', description: '산화시키지 않고 가득 채운(Ouillé) 오크통에서 숙성하여 신선한 산도와 미네랄을 강조한 스타일' },
            { name: 'Arbois / Château-Chalon', criteria: '최고급 산지', description: '사바냉이 가장 위대하게 표현되는 쥬라의 노른자위 산지' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '10/10', description: '수년간의 산화 숙성을 이겨내는 날카롭고 강인한 산미' },
            { label: '복합미 (Complexity)', metric: '풍미', value: '10/10', description: '호두, 건조 과일, 향신료 등 상상 이상의 다층적인 맛' },
            { label: '숙성력 (Aging)', metric: '잠재력', value: '10/10', description: '뱅 존의 경우 수십 년 이상 변치 않는 불멸의 생명력' }
        ],
        flavorTags: [
            { label: '구운 호두', color: 'bg-amber-100/20 text-amber-800' },
            { label: '커리 스파이스', color: 'bg-yellow-200/20 text-yellow-900' },
            { label: '젖은 돌 / 미네랄', color: 'bg-slate-200/20 text-slate-700' }
        ],
        manufacturingProcess: [
            { step: '숙성', name: '수 프리 (Sous Voile)', description: '와인통을 다 채우지 않고 수년간 효모막(Voile) 아래서 산화시키며 독특한 풍미를 입힙니다.' },
            { step: '병입', name: '클라블랭 (Clavelin) 병입', description: '620ml 용량의 독특한 쥬라 전용 병에 담아 뱅 존의 정체성을 완성합니다.' }
        ],
        majorRegions: [
            { name: '샤토 샬롱', description: '가장 위대한 뱅 존이 생산되는 사바냉의 영적 고향', emoji: '🇫🇷' },
            { name: '에투알 (L\'Étoile)', description: '별 모양 화석이 발견되는 토양에서 자란 섬세한 사바냉 산지', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 좁고 향을 모아주는 화이트 또는 레드 글라스도 가능',
            optimalTemperatures: [
                { temp: '14-16°C', description: '뱅 존 등 산화 스타일은 차갑기보다 약간 온도가 있을 때 깊은 풍미가 살아남' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['숙성된 콩테(Comté) 치즈', '모렐 버섯 크림 소스 닭요리', '스파이시한 아시안 요리', '견과류']
    },
    sectionsEn: {
        definition: "Savagnin is the proud and noble emblem of the Jura region in France. Renowned for its fierce, high-toned acidity, it is the only grape capable of enduring the prolonged oxidative aging required to create the legendary 'Vin Jaune' (Yellow Wine). Offering an unparalleled profile of walnuts, hazelnuts, and exotic curry spices, it stands as one of the most original and powerful personalities in the world of white wine.",
        history: "A variety of profound antiquity from Eastern France, Savagnin is now recognized as a direct ancestor of the Traminer (Gewürztraminer) family. Flourishing in the rugged terrain and cool climate of the Jura, it concentrates immense energy over a long growing season. Despite limited production, its status in 'Vin Jaune' has earned it a cult-like reverence among wine professionals and connoisseurs globally.",
        classifications: [
            { name: 'Vin Jaune', criteria: 'Oxidative Style', description: 'Aged under a veil of yeast for over six years to achieve iconic notes of walnut and saffron.' },
            { name: 'Savagnin Ouillé', criteria: 'Non-Oxidative Style', description: 'Matured in topped-up barrels to emphasize the variety’s pure, electric acidity and mineral depth.' },
            { name: 'Château-Chalon', criteria: 'Flagship Terroir', description: "The premier sub-zone dedicated exclusively to the production of high-grade Vin Jaune." }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '10/10', description: 'Sharp, unyielding acidity that acts as the backbone for decades of evolution.' },
            { label: 'Complexity', metric: 'Flavor Depth', value: '10/10', description: 'A dizzying array of roasted nuts, dried exotic fruits, and complex salinity.' },
            { label: 'Aging', metric: 'Potential', value: '10/10', description: 'Virtually immortal, with Vin Jaune famously remaining fresh for 50 to 100 years.' }
        ],
        flavorTags: [
            { label: 'Roasted Walnut', color: 'bg-amber-100/20 text-amber-800' },
            { label: 'Curry Spice', color: 'bg-yellow-200/20 text-yellow-900' },
            { label: 'Wet Stone', color: 'bg-slate-200/20 text-slate-700' }
        ],
        manufacturingProcess: [
            { step: 'Aging', name: 'Sous Voile', description: 'Left in barrels without topping up, allowing a layer of yeast (the veil) to form and protect the wine while imparting unique flavors.' },
            { step: 'Bottling', name: 'Clavelin bottle', description: 'Bottled in the unique 620ml Clavelin container, symbolizing the portion remaining after years of evaporation.' }
        ],
        majorRegions: [
            { name: 'Château-Chalon', description: 'The grandest Cru of Jura, producing the most austere and long-lived Savagnin.', emoji: '🇫🇷' },
            { name: 'L\'Étoile', description: 'Named for its star-shaped fossils, yielding exceptionally mineral and saline expressions.', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Narrow White or even a standard Red Wine glass for complexity',
            optimalTemperatures: [
                { temp: '14–16°C', description: 'The ideal range for letting the oxidative nuances of Vin Jaune fully express themselves.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Aged Comté Cheese', 'Poulet aux Morilles (Chicken with morels)', 'Spicy Asian fusion', 'Assorted roasted nuts']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['사바냉', 'savagnin', '뱅 존', 'vin jaune']
}
