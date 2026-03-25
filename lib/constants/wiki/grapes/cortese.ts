import { SpiritCategory } from '../types'

export const cortese: SpiritCategory = {
    slug: 'cortese',
    emoji: '🍋',
    nameKo: '코르테제',
    nameEn: 'Cortese',
    taglineKo: '피에몬테의 고결한 백색, 가비(Gavi)의 품격 있는 미네랄',
    taglineEn: 'The noble white of Piedmont, the elegant minerals of Gavi',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '코르테제(Cortese)는 이탈리아 북동부 피에몬테를 대표하는 고급 화이트 품종으로, 특히 가비(Gavi) 마을에서 생산되는 와인으로 전 세계적인 명성을 얻었습니다. 입안을 자극하는 상쾌한 시트러스 산미와 해안가의 정취를 닮은 짭조름한 미네랄 풍미가 조화를 이루며, 우아하면서도 깔끔한 뒷맛이 특징입니다.',
        history: '17세기 이탈리아 알레산드리아(Alessandria) 지역의 문헌에서 처음 언급될 정도로 깊은 역사를 가진 품종입니다. 과거 부유한 제노바 미식가들에게 제공될 고급 해산물 요리에 곁들일 와인으로 선택되면서 그 가치를 인정받기 시작했습니다. 1970년대 이후 현대적인 양조 기술과 결합하여 이탈리아에서 가장 세련된 화이트 와인 중 하나로 자리매김했습니다.',
        classifications: [
            { name: 'Gavi di Gavi', criteria: '산지 등급', description: '가비 지역 중에서도 핵심인 가비 마을 내 시립 경계에서 생산된 최상위 등급' },
            { name: 'Cortese dell\'Alto Monferrato', criteria: '산지 스타일', description: '몬페라토 지역에서 생산되는 가볍고 산뜻한 스타일의 코르테제' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '8/10', description: '날카롭지만 세련된 화이트 와인의 산미' },
            { label: '미네랄 (Minerality)', metric: '풍미 강도', value: '9/10', description: '부서진 조개껍데기나 젖은 돌 같은 해양 미네랄' },
            { label: '바디 (Body)', metric: '무게감', value: '5/10', description: '매끄럽고 섬세한 미디엄 바디' }
        ],
        flavorTags: [
            { label: '레몬 껍질', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '청실배', color: 'bg-green-100/20 text-green-700' },
            { label: '아카시아', color: 'bg-slate-100/20 text-slate-600' }
        ],
        manufacturingProcess: [
            { step: '온도 조절', name: '저온 침출 및 발효', description: '품종 고유의 섬세한 꽃향과 산미를 보존하기 위해 철저한 저온 제어 하에 양조합니다.' },
            { step: '안정화', name: '앙금 숙성 (Lees)', description: '때때로 질감을 부드럽게 하고 복합미를 더하기 위해 효모 찌꺼기와 함께 짧게 숙성합니다.' }
        ],
        majorRegions: [
            { name: '가비 AOCG (Gavi DOCG)', description: '코르테제가 가장 위대하게 표현되는 피에몬테의 산지', emoji: '🇮🇹' },
            { name: '몬페라토 (Monferrato)', description: '코르테제와 다른 품종들이 조화를 이루는 산지', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '튤립 모양의 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '8-10°C', description: '특유의 미네랄리티와 레몬향이 가장 돋보이는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['리구리아 스타일 해산물 파스타', '흰 살 생선 회', '야채 튀김(Fritto Misto)']
    },
    sectionsEn: {
        definition: "Cortese is the flagship white grape variety of Piedmont, Italy, renowned worldwide for the elegant wines of Gavi. It is defined by its bracing citrus acidity and a savory, saline minerality reminiscent of the coastal breeze. The grape produces wines that are sophisticated, clean, and perfectly balanced.",
        history: "With a documented history in the Alessandria region dating back to the 17th century, Cortese was long favored by wealthy Genoese merchants for its ability to pair perfectly with premium seafood. Its popularity surged after the 1970s as modern winemaking techniques highlighted its capacity for producing some of Italy's most refined and age-worthy white wines.",
        classifications: [
            { name: 'Gavi di Gavi', criteria: 'Appellation Tier', description: 'Wines produced specifically within the municipal boundaries of the town of Gavi.' },
            { name: 'Cortese dell\'Alto Monferrato', criteria: 'Regional Style', description: 'A lighter, fresher style produced in the wider Monferrato area.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '8/10', description: 'Sharp and clean acidity that defines its refreshing profile.' },
            { label: 'Minerality', metric: 'Intensity', value: '9/10', description: 'Oceanic minerals like crushed shells or wet stones.' },
            { label: 'Body', metric: 'Weight', value: '5/10', description: 'Smooth, delicate, and refined medium body.' }
        ],
        flavorTags: [
            { label: 'Lemon Peel', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Green Pear', color: 'bg-green-100/20 text-green-700' },
            { label: 'Acacia', color: 'bg-slate-100/20 text-slate-600' }
        ],
        manufacturingProcess: [
            { step: 'Temperature Control', name: 'Cold Maceration', description: 'Controlled meticulously at low temperatures to preserve delicate floral notes and acidity.' },
            { step: 'Stabilization', name: 'Short Lees Aging', description: 'Frequently aged on the lees for a few months to round out the palate and add textural depth.' }
        ],
        majorRegions: [
            { name: 'Gavi DOCG', description: 'The absolute pinnacle for Cortese expression in the heart of Piedmont.', emoji: '🇮🇹' },
            { name: 'Monferrato', description: 'A significant region producing crisp and approachable Cortese-based wines.', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Tulip-shaped White Wine Glass',
            optimalTemperatures: [
                { temp: '8-10°C', description: 'The ideal range to highlight its characteristic minerality and lemony zest.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Ligurian seafood pasta', 'White fish sashimi', 'Vegetable Fritto Misto']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['코르테제', 'cortese']
}
