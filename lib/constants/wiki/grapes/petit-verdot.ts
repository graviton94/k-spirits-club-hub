import { SpiritCategory } from '../types'

export const petitVerdot: SpiritCategory = {
    slug: 'petit-verdot',
    emoji: '🌑',
    nameKo: '프티 베르도',
    nameEn: 'Petit Verdot',
    taglineKo: '보르도의 야성적인 연금술, 색과 힘을 완성하는 강렬한 한 방',
    taglineEn: 'Bordeaux’s wild alchemy, an intense blow that completes color and power',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '프티 베르도(Petit Verdot)는 잉크처럼 짙은 색상과 강력한 타닌을 지녀 보르도 블렌딩에서 "와인의 색과 힘을 입히는 연금술사"로 통합니다. 매우 늦게 익는 고집스러운 품종으로, 완벽하게 익었을 때 블랙베리, 제비꽃(Violet), 그리고 톡 쏘는 스파이시한 풍미가 환상적인 조화를 이룹니다. 블렌딩에 단 2~5%만 섞여도 와인의 품격과 장기 숙성력을 극적으로 끌어올리는 존재감을 보여줍니다.',
        history: '보르도 좌안(Left Bank) 지역에서 아주 오래전부터 재배되어 온 토착 품종으로 여겨집니다. 과거에는 너무 늦게 익는 특성 때문에 버림받기도 했으나, 기후가 온난해지면서 더 완벽한 숙성이 가능해지자 재평가받고 있습니다. 오늘날에는 보르도뿐만 아니라 호주(Riverland), 미국(Napa), 스페인 같이 뜨거운 태양이 내리쬐는 지역에서 단독 품종으로서의 잠재력도 폭발시키고 있습니다.',
        classifications: [
            { name: 'Left Bank Bordeaux Component', criteria: '블렌딩 역할', description: '명품 보르도 와인에 짙은 색조와 견고한 타닌 골격을 더해주는 역할' },
            { name: 'Varietal Petit Verdot', criteria: '신대륙 스타일', description: '충분한 일조량을 바탕으로 만든 묵직한 바벨 바디의 단일 품종 와인' }
        ],
        sensoryMetrics: [
            { label: '색상 (Color)', metric: '농도', value: '10/10', description: '밑바닥이 전혀 보이지 않는 짙은 흑자색' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '9/10', description: '단단하고 촘촘하여 입안을 가득 메우는 강력한 구조감' },
            { label: '산도 (Acidity)', metric: '청량감', value: '7/10', description: '농축된 바디를 뒷받침하는 탄탄한 산미' }
        ],
        flavorTags: [
            { label: '제비꽃 (Violet)', color: 'bg-purple-100/20 text-purple-700' },
            { label: '블랙체리', color: 'bg-red-900/20 text-red-900' },
            { label: '백후추', color: 'bg-stone-200/20 text-stone-700' }
        ],
        manufacturingProcess: [
            { step: '침출', name: '장기 침출', description: '프티 베르도 특유의 강력한 색과 타닌을 뽑아내기 위해 발효 전후로 오랜 시간 껍질과 함께 둡니다.' },
            { step: '숙성', name: '프렌치 오크 숙성', description: '야생적인 타닌을 잠재우고 복합적인 풍미를 입히기 위해 고품질 오크통 숙성이 필수적입니다.' }
        ],
        majorRegions: [
            { name: '메독 (Médoc)', description: '전통적인 보르도 블렌딩의 한 축을 담당하는 고전적 산지', emoji: '🇫🇷' },
            { name: '나파 밸리 (Napa Valley)', description: '화려하고 농축된 스타일의 프티 베르도가 탄생하는 신대륙의 거점', emoji: '🇺🇸' },
            { name: '호주 리버랜드', description: '풍부한 태양빛 아래서 단일 품종으로도 훌륭한 성공을 거둔 산지', emoji: '🇦🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 크고 넓은 대형 보르도 스타일 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '강력한 타닌이 음식과 조화롭게 녹아들고 향을 발산하기 좋은 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['강렬한 연기 향의 바비큐', '스테이크 푸아그라', '향이 강한 스튜', '숙성된 하드 치즈']
    },
    sectionsEn: {
        definition: "Petit Verdot is an inky, powerful red grape variety esteemed in Bordeaux blending as an 'alchemist of color and strength.' Formidably late-ripening, it demands a warm climate to reveal its spectacular profile of blackberry, violet, and sharp peppery spice. Even when added in small increments of 2–5%, it dramatically enhances a wine’s physical presence, structural integrity, and potential for long-term cellaring.",
        history: "A native variety of the Bordeaux Left Bank, Petit Verdot’s history is rooted in its reputation as a difficult but rewarding grape. Historically sidelined due to its failure to reach maturity in cooler vintages, the rise in global temperatures has led to a renewed interest and better expressions. Today, it has exploded in popularity across sun-drenched regions like Australia, Napa, and Spain, where it is increasingly celebrated as a powerful single-varietal wine.",
        classifications: [
            { name: 'Left Bank Bordeaux Component', criteria: 'Blending Role', description: 'Imparts intense pigment and firm tannin structure to noble Bordeaux blends.' },
            { name: 'Varietal Petit Verdot', criteria: 'New World Style', description: 'Bold, concentrated single-varietal wines characterized by immense body and complex aromatics.' }
        ],
        sensoryMetrics: [
            { label: 'Color', metric: 'Intensity', value: '10/10', description: 'Nearly opaque black-purple hue.' },
            { label: 'Tannins', metric: 'Astringency', value: '9/10', description: 'Firm, dense, and tightly knit structural backbone.' },
            { label: 'Acidity', metric: 'Crispness', value: '7/10', description: 'Vibrant acidity that provides balance to its concentrated body.' }
        ],
        flavorTags: [
            { label: 'Violet', color: 'bg-purple-100/20 text-purple-700' },
            { label: 'Black Cherry', color: 'bg-red-900/20 text-red-900' },
            { label: 'White Pepper', color: 'bg-stone-200/20 text-stone-700' }
        ],
        manufacturingProcess: [
            { step: 'Maceration', name: 'Extended Maceration', description: 'Prolonged skin contact is used to maximize the extraction of its immense color and powerful phenolic structure.' },
            { step: 'Aging', name: 'Quality French Oak Maturation', description: 'Essential to soften its rustic tannins and integrate complex aromatics over time.' }
        ],
        majorRegions: [
            { name: 'Médoc', description: 'The traditional homeland where it provides the final touch to prestigious blends.', emoji: '🇫🇷' },
            { name: 'Napa Valley', description: 'Produces opulent and deeply concentrated styles that challenge the status quo.', emoji: '🇺🇸' },
            { name: 'Riverland, Australia', description: "A key New World site where the grape reaches full ripeness as a standout varietal.", emoji: '🇦🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Large, wide-bowled Bordeaux-style Red Wine glass',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'Best range to allow its powerful tannins to harmonize and its floral notes to unfurl.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Smoky BBQ', 'Steak topped with Foie Gras', 'Rich venison stews', 'Aged hard cheeses']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['프티 베르도', 'petit verdot']
}
