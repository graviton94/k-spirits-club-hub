import { SpiritCategory } from '../types'

export const koshu: SpiritCategory = {
    slug: 'koshu',
    emoji: '🗾',
    nameKo: '코슈',
    nameEn: 'Koshu',
    taglineKo: '동양의 우아함, 일본 테루아가 빚어낸 한 폭의 수묵화 같은 화이트',
    taglineEn: 'Oriental elegance, a white wine like an ink wash painting by Japanese terroir',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '코슈(Koshu)는 일본을 대표하는 가장 중요한 토착 화이트 품종으로, 야마나시(Yamanashi) 현의 고유한 테루아를 전 세계에 알린 주역입니다. 분홍빛 껍질을 가진 유전적으로 독특한 품종으로, 극도의 순수함과 섬세한 시트러스 향, 그리고 미세한 쌉쌀함(피노 그리와 유사)이 어우러진 것이 특징입니다. 인위적인 강렬함보다는 여백의 미를 강조한 듯한 깔끔하고 투명한 스타일이 돋보입니다.',
        history: '약 1,000년 전 실크로드를 통해 중국에서 일본으로 건너온 포도가 일본 특유의 기후에 적응하며 탄생한 것으로 알려져 있습니다. DNA 분석 결과 유럽 품종(Vitis vinifera)과 동양 야생 품종의 하이브리드로 밝혀졌습니다. 오랫동안 식용 포도로 사랑받아 왔으나, 21세기 들어 현대적인 양조 기술과 결합하여 영국과 유럽 등 세계 무대에서 "일본 와인의 자존심"으로 당당히 인정받게 되었습니다.',
        classifications: [
            { name: 'Koshu Sur Lie', criteria: '양조 스타일', description: '효모 찌꺼기와 함께 숙성하여 가벼운 코슈에 복합미와 두툼한 질감을 더한 스타일' },
            { name: 'Barrel Fermented Koshu', criteria: '양조 스타일', description: '은은한 오크 향을 입혀 너트류의 고소함과 풍성함을 더한 스타일' },
            { name: 'Koshu Sparkling', criteria: '탄산 방식', description: '코슈 고유의 깔끔한 산미를 극대화한 청량한 스파클링 와인' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '7/10', description: '날카롭기보다 부드럽고 섬세한 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '3/10', description: '물처럼 깨끗하고 투명한 라이트 바디' },
            { label: '미네랄 (Minerality)', metric: '풍미', value: '6/10', description: '화산 토양에서 오는 은은한 염분과 미네랄' }
        ],
        flavorTags: [
            { label: '유자', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '젖은 돌', color: 'bg-slate-200/20 text-slate-700' },
            { label: '백차', color: 'bg-green-50/20 text-green-600' }
        ],
        manufacturingProcess: [
            { step: '침출', name: '짧은 스킨 컨택', description: '껍질의 분홍색이 배어 나오지 않으면서도 아로마를 추출하기 위해 극도로 짧게 침출합니다.' },
            { step: '숙성', name: '스테인리스 숙성', description: '코슈의 순수한 향을 보존하기 위해 주로 산소 접촉을 차단하는 스테인리스 탱크를 사용합니다.' }
        ],
        majorRegions: [
            { name: '야마나시 (Yamanashi)', description: '일본 코슈의 90% 이상이 생산되는 절대적인 중심지', emoji: '🇯🇵' },
            { name: '카츠누마 (Katsunuma)', description: '야마나시 현 내에서도 가장 유서 깊고 뛰어난 코슈 산지', emoji: '🇯🇵' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 좁고 직선적인 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '7-9°C', description: '코슈 특유의 시트러스한 청량감과 깔끔한 목넘김이 정점인 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['계절 생선회(사시미)', '야채 덴퓨라', '소금으로 간을 한 생선 구이', '두부 요리']
    },
    sectionsEn: {
        definition: "Koshu is Japan’s most significant and iconic indigenous white grape variety, acting as the global ambassador for the unique terroir of Yamanashi Prefecture. Distinguishable by its thick, pink-tinted skins, Koshu produces wines of extraordinary purity, characterized by delicate citrus notes and a subtle, pleasant bitterness. It favors subtleness and restraint over power, yielding a style as clean and transparent as an ink wash painting.",
        history: "Koshu is believed to have arrived in Japan via the Silk Road from China approximately 1,000 years ago, eventually adapting to the Japanese climate. Genetic analysis confirms it is a natural hybrid of the European Vitis vinifera and East Asian wild grapes. Long enjoyed as a table grape, it underwent a winemaking revolution in the 21st century, gaining global recognition in London and Europe as the 'Pride of Japanese Wine.'",
        classifications: [
            { name: 'Koshu Sur Lie', criteria: 'Winemaking Style', description: 'Aged on the lees to add textural weight and savory complexity to the light-bodied grape.' },
            { name: 'Barrel Fermented Koshu', criteria: 'Winemaking Style', description: 'Briefly aged or fermented in oak to introduce subtle nutty and toasty nuances.' },
            { name: 'Koshu Sparkling', criteria: 'Carbonation Style', description: 'Refining the grape’s natural crispness into an elegant and refreshing sparkling wine.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '7/10', description: 'Soft and nuanced rather than sharp or aggressive.' },
            { label: 'Body', metric: 'Weight', value: '3/10', description: 'Very light, clean, and ethereal on the palate.' },
            { label: 'Minerality', metric: 'Depth', value: '6/10', description: 'Exhibits a hint of volcanic salinity and stone-like purity.' }
        ],
        flavorTags: [
            { label: 'Yuzu', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Wet Stones', color: 'bg-slate-200/20 text-slate-700' },
            { label: 'White Tea', color: 'bg-green-50/20 text-green-600' }
        ],
        manufacturingProcess: [
            { step: 'Maceration', name: 'Limited Skin Contact', description: 'Meticulously timed to extract aromatics while avoiding the extraction of color from its pink skins.' },
            { step: 'Maturation', name: 'Stainless Steel Maturation', description: "Used preferentially to protect the grape's delicate, pure aromatic profile from oxidation." }
        ],
        majorRegions: [
            { name: 'Yamanashi', description: 'The absolute heartland of Japanese viticulture, producing over 90% of the nation’s Koshu.', emoji: '🇯🇵' },
            { name: 'Katsunuma', description: 'The historic and premier sub-region within Yamanashi for high-quality Koshu.', emoji: '🇯🇵' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Narrow, upright White Wine Glass',
            optimalTemperatures: [
                { temp: '7–9°C', description: 'The ideal range to highlight its refreshing citrus character and clean finish.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Seasonal Sashimi', 'Vegetable Tempura', 'Salt-grilled fish', 'Silken Tofu dishes']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['코슈', 'koshu']
}
