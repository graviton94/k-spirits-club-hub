import { SpiritCategory } from '../types'

export const marsanne: SpiritCategory = {
    slug: 'marsanne',
    emoji: '🍯',
    nameKo: '마르산느',
    nameEn: 'Marsanne',
    taglineKo: '론 계곡의 황금빛 질감, 밀도 높은 허니 터치와 견고한 구조감',
    taglineEn: 'The golden texture of the Rhône Valley, dense honey touch and solid structure',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '마르산느(Marsanne)는 프랑스 북부 론 지역을 대표하는 고귀한 화이트 품종입니다. 묵직한 바디감과 함께 밀랍, 허니밀, 그리고 잘 익은 배의 풍미가 특징이며, 산도는 낮지만 입안을 가득 채우는 오일리한 질감이 독보적입니다. 루산느(Roussanne)와 함께 블렌딩되어 세계 최고의 화이트 론 와인을 만들어내며, 시간이 흐를수록 견과류와 마르멜로의 복합미가 깊어지는 놀라운 숙성 잠재력을 지니고 있습니다.',
        history: '북부 론의 생 조셉(Saint-Joseph)과 크로즈 에르미타주(Crozes-Hermitage) 지역에서 유래한 것으로 알려져 있습니다. 수 세기 동안 루산느와 짝을 이루어 이 지역의 화이트 와인 전통을 지탱해왔습니다. 19세기 호주로 건너가 세계에서 가장 오래된 마르산느 고목들이 빅토리아 주에 보존되어 있을 정도로 신대륙에서도 그 가치를 인정받고 있습니다.',
        classifications: [
            { name: 'Northern Rhône White', criteria: '산지 스타일', description: '에르미타주, 생 조셉 등에서 생산되는 묵직하고 복합적인 최상급 화이트' },
            { name: 'Marsanne-Roussanne Blend', criteria: '블렌딩 방식', description: '마르산느의 구조감과 루산느의 아로마가 결합된 전형적인 론 스타일' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '8/10', description: '화이트 와인 중 보기 드문 묵직하고 유질감 있는 풀 바디' },
            { label: '산도 (Acidity)', metric: '청량감', value: '4/10', description: '온화하고 부드러운 산미' },
            { label: '숙성력 (Aging)', metric: '잠재력', value: '9/10', description: '10년 이상 숙성 시 견과류와 꿀 향이 폭발적으로 발달' }
        ],
        flavorTags: [
            { label: '밀랍 (Beeswax)', color: 'bg-yellow-100/20 text-yellow-800' },
            { label: '꿀', color: 'bg-amber-100/20 text-amber-700' },
            { label: '구운 아몬드', color: 'bg-orange-100/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '나무 배럴 발효', description: '질감을 더 풍성하게 하고 복합미를 부여하기 위해 오크통에서 발효를 진행하기도 합니다.' },
            { step: '숙성', name: '앙금 숙성 (Lees Aging)', description: '특유의 오일리한 질감을 극대화하기 위해 효모 앙금과 함께 장기간 숙성합니다.' }
        ],
        majorRegions: [
            { name: '북부 론 (Northern Rhône)', description: '마르산느의 영적 고향이자 에르미타주 와인의 심장', emoji: '🇫🇷' },
            { name: '빅토리아 고울번 밸리', description: '세계에서 가장 오래된 마르산느 나무들이 자라는 호주의 산지', emoji: '🇦🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 넓고 둥근 화이트 와인 또는 샤르도네 글라스',
            optimalTemperatures: [
                { temp: '12-14°C', description: '너무 차가우면 특유의 풍부한 질감과 꿀 향이 가려질 수 있음' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['크림 소스를 곁들인 가금류 요리', '구운 바닷가재(로브스터)', '인도식 카레', '숙성된 연성 치즈']
    },
    sectionsEn: {
        definition: "Marsanne is a noble white grape variety that stands as a primary pillar of France's Northern Rhône Valley. Celebrated for its substantial body and luxurious texture, it features complex notes of beeswax, honeydew melon, and ripe pear. While it possesses moderate acidity, its oily mouthfeel and profound structural depth are peerless. Often blended with Roussanne, it produces some of the world's most prestigious whites, boasting incredible aging potential where it evolves into a bouquet of nuts and quince.",
        history: "Originating in the Northern Rhône appellations of Saint-Joseph and Crozes-Hermitage, Marsanne has stood as a guardian of the region's white wine tradition for centuries. In the 19th century, it migrated to Australia, where the Goulburn Valley in Victoria now hosts some of the world's oldest productive Marsanne vines, preserving a vital piece of viticultural history.",
        classifications: [
            { name: 'Northern Rhône White', criteria: 'Regional Style', description: 'Weighty, complex, and prestigious whites from top appellations like Hermitage.' },
            { name: 'Marsanne-Roussanne Blend', criteria: 'Blending Style', description: 'A classic Rhône composition where Marsanne provides structure and Roussanne contributes aromatic finesse.' }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '8/10', description: 'A rare, full-bodied white with a distinctively rich and oily texture.' },
            { label: 'Acidity', metric: 'Crispness', value: '4/10', description: 'Soft, moderate, and integrated acidity.' },
            { label: 'Aging', metric: 'Potential', value: '9/10', description: 'Notes of honey and toasted nuts develop explosively after a decade of cellaring.' }
        ],
        flavorTags: [
            { label: 'Beeswax', color: 'bg-yellow-100/20 text-yellow-800' },
            { label: 'Honey', color: 'bg-amber-100/20 text-amber-700' },
            { label: 'Roasted Almond', color: 'bg-orange-100/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Barrel Fermentation', description: 'Often fermented in oak to enhance textural creaminess and introduce subtle secondary complexities.' },
            { step: 'Aging', name: 'Extended Lees Aging', description: 'Aged on the yeast sediment for prolonged periods to maximize its hallmark viscous mouthfeel.' }
        ],
        majorRegions: [
            { name: 'Northern Rhône', description: "The spiritual home and the heart of prestigious Hermitage Blanc.", emoji: '🇫🇷' },
            { name: 'Victoria Goulburn Valley', description: "Home to some of the world's oldest and most concentrated Marsanne plantings.", emoji: '🇦🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Wide-bowled White Wine or Chardonnay glass',
            optimalTemperatures: [
                { temp: '12–14°C', description: 'Warmer than typical whites to allow its rich texture and honeyed bouquet to fully express.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Creamy poultry dishes', 'Grilled lobster', 'Mild Indian curries', 'Aged soft cheeses']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['마르산느', 'marsanne']
}
