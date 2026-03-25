import { SpiritCategory } from '../types'

export const barbera: SpiritCategory = {
    slug: 'barbera',
    emoji: '🍕',
    nameKo: '바르베라',
    nameEn: 'Barbera',
    taglineKo: '피에몬테의 미소, 생생한 산미와 풍부한 붉은 과실의 즐거움',
    taglineEn: 'The smile of Piedmont, vibrant acidity and the joy of red fruit',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '바르베라(Barbera)는 이탈리아 피에몬테(Piedmont) 지역에서 가장 사랑받는 "서민의 품종"이자 "데일리 와인의 여왕"입니다. 타닌은 낮지만 산도가 매우 높고 선명한 루비색을 띠며, 신선한 체리와 블랙베리 향이 폭발적으로 느껴지는 것이 특징입니다. 마시기 편하면서도 음식과의 조화가 탁월해 피에몬테 사람들의 식탁에서 절대 빠지지 않는 품종입니다.',
        history: '피에몬테의 몽페라토(Monferrato) 언덕에서 유래한 것으로 알려졌으며, 수 세기 동안 이 지역 농민들의 든든한 동반자였습니다. 노블한 네비올로(Nebbiolo)가 귀족의 와인으로 대접받을 때, 바르베라는 일상에서 즐기는 친근한 와인으로 자리매김했습니다. 20세기 후반부터는 수확량 조절과 오크 숙성을 통해 장기 숙성이 가능한 프리미엄 스타일로도 진화하며 전 세계적으로 그 가치를 인정받고 있습니다.',
        classifications: [
            { name: 'Barbera d\'Asti', criteria: '산지 등급', description: '더 우아하고 화사한 향이 특징인 핵심 산지 스타일' },
            { name: 'Barbera d\'Alba', criteria: '산지 등급', description: '더 묵직한 바디감과 구조감을 가진 스타일' },
            { name: 'Barbera Superiore', criteria: '숙성 등급', description: '오크 숙성을 거쳐 더 복합적이고 중후해진 스타일' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '산량', value: '10/10', description: '매우 생생하고 활기찬 산미' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '3/10', description: '부드럽고 낮은 타닌' },
            { label: '바디 (Body)', metric: '무게감', value: '6/10', description: '균형 잡힌 미디엄 바디' }
        ],
        flavorTags: [
            { label: '빨간 체리', color: 'bg-red-200/20 text-red-600' },
            { label: '블랙베리', color: 'bg-purple-900/20 text-purple-950' },
            { label: '말린 허브', color: 'bg-green-100/20 text-green-800' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '스테인리스 발효', description: '신선한 과실향과 높은 산도를 유지하기 위해 주로 온도 조절 장치가 있는 탱크에서 발효합니다.' },
            { step: '숙성', name: '바리크(Barrique) 숙성', description: '높은 산도를 다독이고 바닐라와 향신료 풍미를 더하기 위해 작은 오크통에서 숙성하기도 합니다.' }
        ],
        majorRegions: [
            { name: '아스티 (Asti)', description: '품격 높은 바르베라의 전형을 보여주는 중심지', emoji: '🇮🇹' },
            { name: '알바 (Alba)', description: '네비올로와 함께 바르베라가 가장 힘 있게 자라는 곳', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '과실의 달콤함과 산미의 균형이 가장 완벽한 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['마르게리타 피자', '토마토 베이스의 파스타', '살라미와 치즈 플레이트'],
    },
    sectionsEn: {
        definition: "Barbera is the most beloved 'people's grape' and the 'queen of everyday wine' in Italy's Piedmont region. It is characterized by its bright ruby color, low tannins, and exceptionally high, linear acidity, featuring explosive aromas of fresh cherry and blackberry. Its approachability and superb food-pairing ability make it a staple on every table in Northwest Italy.",
        history: "Believed to have originated in the Monferrato hills of Piedmont, Barbera has been the reliable companion of local farmers for centuries. While the noble Nebbiolo was reserved for prestigious occasions, Barbera was the friendly wine for daily enjoyment. Since the late 20th century, winemakers have elevated the variety through yield control and careful oak aging, creating premium expressions capable of long-term aging.",
        classifications: [
            { name: "Barbera d'Asti", criteria: 'Appellation', description: 'A style known for its elegant, vibrant, and aromatic profile.' },
            { name: "Barbera d'Alba", criteria: 'Appellation', description: 'Typically offers more weight, structure, and darker fruit characteristics.' },
            { name: 'Barbera Superiore', criteria: 'Aging Tier', description: 'Requires oak aging, resulting in a more complex and full-bodied style.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Intensity', value: '10/10', description: 'Very lively and electric acidity.' },
            { label: 'Tannins', metric: 'Astringency', value: '3/10', description: 'Soft and supple tannins.' },
            { label: 'Body', metric: 'Weight', value: '6/10', description: 'Well-balanced medium body.' }
        ],
        flavorTags: [
            { label: 'Red Cherry', color: 'bg-red-200/20 text-red-600' },
            { label: 'Blackberry', color: 'bg-purple-900/20 text-purple-950' },
            { label: 'Dried Herbs', color: 'bg-green-100/20 text-green-800' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Stainless Steel Fermentation', description: 'Used to maintain its bright fruit purity and high natural acidity through temperature control.' },
            { step: 'Aging', name: 'Barrique Maturation', description: 'Modern styles often use small oak barrels to soften the acid and impart notes of vanilla and sweet spice.' }
        ],
        majorRegions: [
            { name: 'Asti', description: 'The absolute heartland for the most refined and typical expressions of Barbera.', emoji: '🇮🇹' },
            { name: 'Alba', description: 'A prestigious region where Barbera produces powerful and structured wines.', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard Red Wine Glass',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'The peak temperature for balancing fruit sweetness with its lively acidity.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Pizza Margherita', 'Tomato-based pasta dishes', 'Salami and aged cheese platters'],
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['바르베라', 'barbera']
}
