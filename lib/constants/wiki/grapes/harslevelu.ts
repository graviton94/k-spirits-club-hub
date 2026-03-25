import { SpiritCategory } from '../types'

export const harslevelu: SpiritCategory = {
    slug: 'harslevelu',
    emoji: '🍂',
    nameKo: '하르슐레벨뤼',
    nameEn: 'Hárslevelű',
    taglineKo: '보리수 잎의 전설, 토카이가 울리는 향기로운 금빛 찬가',
    taglineEn: 'Legend of the Linden leaf, Tokajs fragrant golden anthem',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '하르슐레벨뤼(Hárslevelű)는 헝가리어로 "보리수(Linden) 잎"이라는 뜻을 가진 화이트 품종으로, 푸르민트와 함께 토카이 와인의 위대한 풍미를 완성하는 핵심 요소입니다. 보리수 꽃향기와 꿀, 그리고 은은한 스파이시함이 특징이며, 푸르민트보다 조금 더 부드럽고 향기로운 면모를 보여줍니다. 드라이한 와인에서는 풍성한 질감을, 귀부 와인인 토카이 아쑤에서는 복합적인 아로마의 층을 더해줍니다.',
        history: '푸르민트와 마찬가지로 수 세기 동안 헝가리 토카이 지역에서 재배되어 온 유서 깊은 품종입니다. 유전적으로 푸르민트의 후손 혹은 가까운 친척으로 밝혀졌으며, 두 품종의 블렌딩은 세계에서 가장 완벽한 화이트/디저트 와인 조합 중 하나로 꼽힙니다. 최근에는 품종 특유의 화사함을 살린 고품질 드라이 단일 품종 와인으로서의 가치가 더욱 높게 평가받고 있습니다.',
        classifications: [
            { name: 'Dry Hárslevelű', criteria: '당도 스타일', description: '보리수 향과 꿀의 풍미를 머금은 우아하고 리치한 드라이 와인' },
            { name: 'Aszú Component', criteria: '블렌딩 역할', description: '토카이 아쑤에 블렌딩되어 향기로운 꽃향과 아로마의 화려함을 담당' }
        ],
        sensoryMetrics: [
            { label: '향기 (Aroma)', metric: '복합미', value: '9/10', description: '보리수 꽃과 꿀, 아카시아의 화사한 조화' },
            { label: '산도 (Acidity)', metric: '산량', value: '7/10', description: '부드러우면서도 뼈대를 지탱하는 충분한 산미' },
            { label: '질감 (Texture)', metric: '피니시', value: 'High', description: '입안을 가득 채우는 풍성하고 오일리한 질감' }
        ],
        flavorTags: [
            { label: '보리수 꽃', color: 'bg-yellow-50/20 text-yellow-600' },
            { label: '벌꿀', color: 'bg-amber-100/20 text-amber-700' },
            { label: '살구', color: 'bg-orange-100/20 text-orange-700' }
        ],
        manufacturingProcess: [
            { step: '수확', name: '선별 수확', description: '아로마가 가장 정점에 달했을 때 선별적으로 수확하여 향의 농도를 조절합니다.' },
            { step: '침출', name: '짧은 껍질 침출', description: '특유의 화사한 꽃향기를 더 많이 추출하기 위해 발효 전 짧게 껍질 침출을 거치기도 합니다.' }
        ],
        majorRegions: [
            { name: '토카이 (Tokaj)', description: '하르슐레벨뤼의 심장이자 전 세계 최고의 재배지', emoji: '🇭🇺' },
            { name: '쇼믈로 (Somló)', description: '화산 토양 위에서 더욱 강렬한 미네랄과 보리수 향을 뿜어내는 산지', emoji: '🇭🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 약간 큰 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '10-12°C', description: '특유의 향기로운 아로마가 가장 잘 피어오르는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['크림 소스 파스타', '구운 가금류 요리', '말린 과일과 견과류', '매운 소스의 아시안 요리']
    },
    sectionsEn: {
        definition: "Hárslevelű, meaning 'Linden Leaf' in Hungarian, is a noble white grape variety that, alongside Furmint, forms the structural and aromatic backbone of the world-famous Tokaj wines. It is characterized by seductive aromas of linden blossom, honey, and subtle spice. While Furmint provides the focus and acidity, Hárslevelű adds a layer of perfume and a plush, rounded texture to both dry and sweet Aszú wines.",
        history: "Like its companion Furmint, Hárslevelű has been cultivated in the Tokaj region for centuries. Genetic research reveals it is a relative (possibly a descendant) of Furmint. The blend of these two varieties is considered one of the most successful pairings in the world of fine wine. Recently, single-varietal dry Hárslevelű has gained widespread acclaim for its aromatic elegance and luxurious mouthfeel.",
        classifications: [
            { name: 'Dry Hárslevelű', criteria: 'Sugar Style', description: 'An elegant, rich dry wine that showcases pure floral notes and honeyed undertones.' },
            { name: 'Aszú Component', criteria: 'Blending Role', description: "Provides the essential floral aromatics and aromatic 'perfume' to the dense Tokaji Aszú wines." }
        ],
        sensoryMetrics: [
            { label: 'Aroma', metric: 'Complexity', value: '9/10', description: 'A vibrant harmony of linden blossom, honey, and acacia.' },
            { label: 'Acidity', metric: 'Intensity', value: '7/10', description: 'Softer than Furmint but with enough structure to maintain freshness.' },
            { label: 'Texture', metric: 'Palate Feel', value: 'High', description: 'Offers a generous, slightly oily, and opulent mouthfeel.' }
        ],
        flavorTags: [
            { label: 'Linden Blossom', color: 'bg-yellow-50/20 text-yellow-600' },
            { label: 'Honey', color: 'bg-amber-100/20 text-amber-700' },
            { label: 'Apricot', color: 'bg-orange-100/20 text-orange-700' }
        ],
        manufacturingProcess: [
            { step: 'Harvesting', name: 'Selective Picking', description: 'Harvested selectively when floral aromatic volatile compounds reach their absolute peak.' },
            { step: 'Maceration', name: 'Brief Skin Contact', description: 'Sometimes undergoes short skin contact before fermentation to further enhance the extraction of floral esters.' }
        ],
        majorRegions: [
            { name: 'Tokaj', description: 'The absolute spiritual and physical heart of Hárslevelű cultivation.', emoji: '🇭🇺' },
            { name: 'Somló', description: 'Produces intense, mineral-driven Hárslevelű with a distinct volcanic edge.', emoji: '🇭🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Slightly wider-bowled White Wine Glass',
            optimalTemperatures: [
                { temp: '10–12°C', description: 'Ideal for allowing the complex floral and honeyed aromatics to fully blossom.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Creamy pasta dishes', 'Roasted poultry', 'Dried fruits and nuts', 'Spicy Asian fusion cuisine']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['하르슐레벨뤼', 'harslevelu']
}
