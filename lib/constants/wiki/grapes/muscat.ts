import { SpiritCategory } from '../types'

export const muscat: SpiritCategory = {
    slug: 'muscat',
    emoji: '🍇',
    nameKo: '뮈스카 (머스캣)',
    nameEn: 'Muscat',
    taglineKo: '향기의 제왕, 인류와 함께해 온 가장 오래되고 매혹적인 포도 향기',
    taglineEn: 'The King of Aromas, the oldest and most fascinating grape scent shared with humanity',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '뮈스카(Muscat, 혹은 머스캣)는 단일 품종이 아닌 200여 종에 달하는 방대한 패밀리를 지칭하는 이름이며, 와인용 중에서 가장 오래된 역사를 지닌 품종입니다. "포도를 먹을 때 나는 바로 그 향"을 와인에서 가장 직관적으로 보여주는 것이 특징입니다. 화사한 흰 꽃, 오렌지 꽃, 그리고 꿀 풍미를 기본으로 하며, 가벼운 스파클링 와인부터 묵직한 주정 강화 와인까지 전 세계 어디에서나 사랑받고 있습니다.',
        history: '고대 이집트와 그리스 시대부터 기록이 존재할 정도로 인류와 가장 오래도록 함께한 품종입니다. 이질적인 유전적 변이를 거쳐 전 세계로 퍼져나갔으며, 그중 "뮈스카 블랑 아 쁘띠 그랭(Muscat Blanc à Petits Grains)"은 가장 고결하고 향기로운 품종으로 꼽힙니다. 중세 시대에도 귀족들의 선물용 와인으로 쓰였을 만큼 시대를 초월한 인기를 누려왔습니다.',
        classifications: [
            { name: 'Moscato d\'Asti', criteria: '이탈리아 스파클링', description: '낮은 알코올과 달콤한 기포, 환상적인 꽃향을 지닌 피에몬테의 대표작' },
            { name: 'Muscat de Beaumes de Venise', criteria: '프랑스 주정 강화', description: '발효 중 알코올을 첨가하여 천연 당도와 향기를 고도로 농축시킨 스타일' },
            { name: 'Dry Muscat / Moscatel', criteria: '드라이 스타일', description: '강렬한 아로마는 유지하면서 당도만 제거한 깔끔하고 향기로운 테이블 와인' }
        ],
        sensoryMetrics: [
            { label: '향기 (Aroma)', metric: '강도', value: '10/10', description: '누구나 즉각적으로 알아챌 수 있는 압도적인 화사함' },
            { label: '산도 (Acidity)', metric: '청량감', value: '6/10', description: '달콤함을 뒷받침하는 부드러운 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '4/10', description: '일반적으로 가볍고 산뜻한 바디감' }
        ],
        flavorTags: [
            { label: '오렌지 꽃', color: 'bg-orange-100/20 text-orange-700' },
            { label: '신선한 포도', color: 'bg-green-100/20 text-green-700' },
            { label: '복숭아', color: 'bg-red-100/20 text-red-600' }
        ],
        manufacturingProcess: [
            { step: '침출', name: '스킨 컨택 (Skin Contact)', description: '뮈스카 고유의 강력한 아로마 성분(테르펜)을 최대한 추출하기 위해 짧게 껍질 침출을 거칩니다.' },
            { step: '발효 차단', name: '저온 발효 중단', description: '모스카토 다스티 스타일의 경우, 원하는 당도에 도달했을 때 급냉하여 발효를 멈춥니다.' }
        ],
        majorRegions: [
            { name: '피에몬테 (Piedmont)', description: '모스카토 다스티의 세계적인 성지', emoji: '🇮🇹' },
            { name: '알자스 (Alsace)', description: '훌륭한 드라이 뮈스카 와인이 생산되는 곳', emoji: '🇫🇷' },
            { name: '세투발 & 헤레스', description: '스페인과 포르투갈의 유서 깊은 모스카텔 산지', emoji: '🇪🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준 화이트 또는 튤립형 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '6-9°C', description: '차갑게 서빙하여 신선한 과실 본연의 향을 즐기기에 좋은 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['신선한 과일 플래터', '딸기 케이크', '가벼운 견과류', '매콤한 인도 요리(드라이 스타일)']
    },
    sectionsEn: {
        definition: "Muscat is not a single grape but an expansive family of over 200 varieties, standing as the oldest cultivated lineage in winemaking history. It is uniquely recognizable for its 'grapey' aroma—the scent of fresh table grapes—which is rare in wine. Characterized by vibrant white flowers, orange blossom, and honeyed notes, it is used globally for everything from light-hearted sparkling wines to deeply concentrated fortified elixirs.",
        history: "With records dating back to ancient Egypt and Greece, Muscat has shared a longer history with humanity than almost any other variety. Across the millennia, it spread globally, with 'Muscat Blanc à Petits Grains' emerging as the most noble and fragrant family member. It was a favored gift among medieval royalty, maintaining a timeless popularity that continues into the modern era.",
        classifications: [
            { name: "Moscato d'Asti", criteria: 'Italian Sparkler', description: 'Piedmont’s famous sweet, low-alcohol sparkling wine with divine floral aromatics.' },
            { name: 'Muscat de Beaumes de Venise', criteria: 'French Fortified', description: 'A style where fermentation is stopped by spirit addition to preserve natural sweetness and intense perfume.' },
            { name: 'Dry Muscat / Moscatel', criteria: 'Dry Table Style', description: 'Preserves the intense aromatic profile while finishing bone-dry and refreshing.' }
        ],
        sensoryMetrics: [
            { label: 'Aroma', metric: 'Intensity', value: '10/10', description: 'An overwhelming, instantly recognizable floral and fruity bouquet.' },
            { label: 'Acidity', metric: 'Crispness', value: '6/10', description: 'Gentle acidity that supports its characteristic sweetness.' },
            { label: 'Body', metric: 'Weight', value: '4/10', description: 'Typically features a light, refreshing, and nimble mouthfeel.' }
        ],
        flavorTags: [
            { label: 'Orange Blossom', color: 'bg-orange-100/20 text-orange-700' },
            { label: 'Fresh Grape', color: 'bg-green-100/20 text-green-700' },
            { label: 'Peach', color: 'bg-red-100/20 text-red-600' }
        ],
        manufacturingProcess: [
            { step: 'Maceration', name: 'Skin Contact', description: 'Brief contact with skins is often used to maximize the extraction of terpene compounds, which carry the grape’s aroma.' },
            { step: 'Fermentation Control', name: 'Arrested Fermentation', description: 'In sparkling styles, fermentation is halted by rapid cooling to retain desired residual sugars.' }
        ],
        majorRegions: [
            { name: 'Piedmont', description: "The world's premier region for delicate and sweet Moscato d'Asti.", emoji: '🇮🇹' },
            { name: 'Alsace', description: 'Known for producing exceptionally pure and aromatic dry Muscat wines.', emoji: '🇫🇷' },
            { name: 'Setúbal & Jerez', description: 'Historic Iberian regions for world-class Moscatel sweet and fortified wines.', emoji: '🇪🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White or Tulip-shaped Wine glass',
            optimalTemperatures: [
                { temp: '6–9°C', description: 'Best served well-chilled to emphasize its fresh, PRIMARY fruit character.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Fresh fruit platters', 'Strawberry cake', 'Light nuts', 'Spicy Indian curries (Dry style)']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['뮈스카', '머스캣', '머스캇', 'muscat', '모스카토', 'moscato']
}
