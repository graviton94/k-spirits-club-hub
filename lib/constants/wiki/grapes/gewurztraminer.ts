import { SpiritCategory } from '../types'

export const gewurztraminer: SpiritCategory = {
    slug: 'gewurztraminer',
    emoji: '🌹',
    nameKo: '게뷔르츠트라미너',
    nameEn: 'Gewürztraminer',
    taglineKo: '아로마의 폭발, 리치와 장미향이 빚어낸 화려한 오리엔탈의 향연',
    taglineEn: 'An aromatic explosion, a colorful oriental feast of lychee and rose',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '게뷔르츠트라미너(Gewürztraminer)는 전 세계에서 가장 향기가 강렬하고 개성 있는 화이트 품종 중 하나입니다. "게뷔르츠(Gewürz)"가 독일어로 "향신료"를 뜻하듯, 리치, 장미, 생강, 그리고 계피 같은 이국적이고 화려한 풍미가 특징입니다. 껍질 색이 분홍빛을 띠어 와인에서도 황금빛이나 구리빛 색조가 나타나며, 낮은 산도와 높은 알코올, 그리고 입안을 가득 채우는 오일리한 질감이 독보적입니다.',
        history: '이탈리아 북부 알토 아디제(Alto Adige)의 트라민(Tramin) 마을에서 유래한 트라미너 품종의 변이종입니다. 오랜 역사를 통해 유럽 전역으로 퍼졌으나, 프랑스 알자스(Alsace) 지역에 정착하면서 세계에서 가장 훌륭한 결과물을 만들어내기 시작했습니다. 오늘날 알자스 4대 고귀한 품종 중 하나로 꼽히며, 그 어떤 품종과도 비교할 수 없는 독특한 아로마 프로필로 "블라인드 테이스팅의 황제"라고도 불립니다.',
        classifications: [
            { name: 'Dry Style', criteria: '당도 스타일', description: '강렬한 아로마는 유지하되 끝맛을 드라이하게 마무리한 스타일' },
            { name: 'Vendanges Tardives (VT)', criteria: '수확 시기', description: '늦수확을 통해 당도와 풍미를 농축한 세미 스위트 스타일' },
            { name: 'Selection de Grains Nobles (SGN)', criteria: '최고급 귀부', description: '귀부된 포도로만 만든 압도적 농축미의 최상급 디저트 와인' }
        ],
        sensoryMetrics: [
            { label: '향기 (Aroma)', metric: '강도', value: '10/10', description: '압도적인 리치와 장미 꽃잎의 아로마' },
            { label: '산도 (Acidity)', metric: '청량감', value: '3/10', description: '매우 낮고 부드러운 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '8/10', description: '풀바디에 가까운 오일리하고 리치한 질감' }
        ],
        flavorTags: [
            { label: '리치', color: 'bg-red-100/20 text-red-600' },
            { label: '장미 petals', color: 'bg-pink-100/20 text-pink-700' },
            { label: '생강', color: 'bg-orange-100/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: '침출', name: '스킨 컨택 (Skin Contact)', description: '품종 고유의 강력한 아로마와 풍부한 질감을 추출하기 위해 발효 전 짧은 시간 껍질과 함께 침출합니다.' },
            { step: '발효', name: '발효 중단', description: '특유의 바디감을 완성하고 아로마와 농밀함을 조절하기 위해 잔류 당분을 남기고 발효를 종료하기도 합니다.' }
        ],
        majorRegions: [
            { name: '알자스 (Alsace)', description: '게뷔르츠트라미너가 생산되는 세계에서 가장 중요한 거점', emoji: '🇫🇷' },
            { name: '알토 아디제 (Alto Adige)', description: '품종의 기원지이자 산뜻하고 드라이한 스타일의 산지', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '10-12°C', description: '너무 차가우면 특유의 화려한 아로마가 닫힐 수 있으므로 약간 높은 화이트 온도를 선호' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['강한 향신료를 쓴 인도/태국 요리', '묑스테르(Munster) 등 냄새가 강한 치즈', '매콤한 하만/중국 요리', '푸아그라']
    },
    sectionsEn: {
        definition: "Gewürztraminer is one of the most intensely aromatic and distinctive white grape varieties in the world. As 'Gewürz' means 'spice' in German, it is defined by exotic and opulent notes of lychee, rose petals, ginger, and cinnamon. Its pink-skinned berries impart a deep golden or coppery hue to the wine, and it is singular for its low acidity, high alcohol potential, and a characteristically oily, rich texture.",
        history: "A mutation of the Traminer variety, it originated in the village of Tramin in Northern Italy’s Alto Adige. While it spread across Europe over centuries, it reached its ultimate expression in the Alsace region of France. Today, it is honored as one of the four 'Noble Grapes' of Alsace and is often called the 'King of Blind Tastings' due to its unmistakable and overwhelming aromatic profile.",
        classifications: [
            { name: 'Dry Style', criteria: 'Sugar Profile', description: 'Maintains explosive aromatics with a dry, clean finish.' },
            { name: 'Vendanges Tardives (VT)', criteria: 'Harvest Timing', description: 'A semi-sweet style made from late-harvested grapes with concentrated sugars.' },
            { name: 'Selection de Grains Nobles (SGN)', criteria: 'Premium Botrytis', description: 'A legendary dessert wine made from noble rot berries with extraordinary concentration.' }
        ],
        sensoryMetrics: [
            { label: 'Aroma', metric: 'Intensity', value: '10/10', description: 'Overwhelmingly powerful lychee and floral petals.' },
            { label: 'Acidity', metric: 'Crispness', value: '3/10', description: 'Soft and very low acidity, contributing to its richness.' },
            { label: 'Body', metric: 'Weight', value: '8/10', description: 'Full-bodied with a luxurious, oily, and viscous texture.' }
        ],
        flavorTags: [
            { label: 'Lychee', color: 'bg-red-100/20 text-red-600' },
            { label: 'Rose Petals', color: 'bg-pink-100/20 text-pink-700' },
            { label: 'Ginger', color: 'bg-orange-100/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: 'Maceration', name: 'Short Skin Contact', description: 'The juice is kept with the skins briefly before fermentation to extract the powerful aromas and oil-rich compounds.' },
            { step: 'Fermentation', name: 'Arrested Fermentation', description: 'Often stopped before all sugar is converted to maintain its characteristic richness and aromatic fullness.' }
        ],
        majorRegions: [
            { name: 'Alsace', description: 'The global benchmark and most significant region for premium Gewürztraminer.', emoji: '🇫🇷' },
            { name: 'Alto Adige', description: 'Initial homeland producing fresher, crisp, and dry varietal expressions.', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White Wine Glass',
            optimalTemperatures: [
                { temp: '10–12°C', description: 'Served slightly warmer than standard whites to allow its complex bouquet to fully open.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Aromatic Indian or Thai dishes', 'Strong cheeses like Munster', 'Spicy Sichuan or Hunan cuisine', 'Foie Gras']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['게뷔르츠트라미너', 'gewurztraminer']
}
