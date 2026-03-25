import { SpiritCategory } from '../types'

export const auxerrois: SpiritCategory = {
    slug: 'auxerrois',
    emoji: '🏔️',
    nameKo: '옥세루아',
    nameEn: 'Auxerrois',
    taglineKo: '알자스의 숨은 보석, 부드러운 질감과 우아한 균형미',
    taglineEn: 'The hidden gem of Alsace, smooth texture and elegant balance',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '옥세루아(Auxerrois Blanc)는 주로 프랑스 알자스(Alsace) 지역에서 재배되는 화이트 품종으로, 흔히 "피노 블랑"과 혼동되거나 블렌딩되어 판매되지만 그보다 더 낮은 산미와 더 풍부한 바디감을 지닙니다. 잘 익은 복숭아, 멜론, 그리고 은은한 꿀 향이 매력적이며, 입안에서 느껴지는 매끄럽고 둥글둥글한 질감이 일품입니다. 피노 블랑보다 일찍 익으며 산도가 온화해, 편안하게 즐길 수 있는 고급스러운 화이트 와인을 생산합니다.',
        history: '이름은 프랑스 옥세르(Auxerre) 지역에서 유래한 것으로 보이나, 현재는 알자스와 룩셈부르크, 독일의 모젤 지역에서 주로 재배됩니다. 유전적으로는 피노 누아와 구애 블랑(Gouais Blanc)의 교배종으로, 샤르도네나 슈냉 블랑과 형제 격인 고귀한 혈통을 지니고 있습니다. 오랫동안 "피노 블랑"이라는 이름 뒤에 숨겨진 조연 역할을 해왔으나, 최근에는 단일 품종으로서 특유의 우아함이 재평가받으며 마니아 층을 형성하고 있습니다.',
        classifications: [
            { name: 'Alsace Auxerrois', criteria: '산지 스타일', description: '알자스에서 생산되는 풍부한 과실향과 리치한 질감의 스타일' },
            { name: 'Pinot Blanc Blend', criteria: '블렌딩 역할', description: '피노 블랑과 섞여 구조감과 부드러움을 더하는 스타일' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '4/10', description: '온화하고 부드러운 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '6/10', description: '적당한 무게감의 미디엄 바디' },
            { label: '질감 (Texture)', metric: '부드러움', value: '8/10', description: '크리미하고 매끄러움' }
        ],
        flavorTags: [
            { label: '복숭아', color: 'bg-orange-100/20 text-orange-700' },
            { label: '꿀', color: 'bg-yellow-200/20 text-yellow-800' },
            { label: '멜론', color: 'bg-green-100/20 text-green-700' }
        ],
        manufacturingProcess: [
            { step: '수확', name: '적기 수확', description: '산미가 너무 낮아지는 것을 방지하기 위해 완숙 직전의 타이밍을 잡아 수확합니다.' },
            { step: '숙성', name: '대형 오크 또는 탱크 숙성', description: '품종 고유의 섬세한 향을 유지하기 위해 중고 대형 오크통(Foudre)이나 스테인리스 탱크에서 숙성합니다.' }
        ],
        majorRegions: [
            { name: '알자스 (Alsace)', description: '옥세루아가 가장 널리 재배되는 세계적인 산지', emoji: '🇫🇷' },
            { name: '룩셈부르크 (Luxembourg)', description: '주요 화이트 품종으로 대접받는 곳', emoji: '🇱🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '10-12°C', description: '특유의 부드러운 향과 질감이 조화롭게 느껴지는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['양파 타르트 (Tarte Flambée)', '가벼운 가금류 요리', '아스파라거스'],
    },
    sectionsEn: {
        definition: "Auxerrois (Auxerrois Blanc) is a white grape variety primarily grown in the Alsace region of France. Often confused or blended with Pinot Blanc, it is distinguished by its lower acidity and fuller, richer body. It features enticing aromas of ripe peach, melon, and subtle honey, with a signature smooth and rounded mouthfeel. Its ability to ripen earlier and its gentle acidity make it an approachable yet luxurious white wine.",
        history: "While its name suggests an origin in Auxerre, France, it is now most prominently found in Alsace, Luxembourg, and Germany's Mosel region. Genetically, it is a cross between Pinot Noir and Gouais Blanc, making it a sibling to noble varieties like Chardonnay. For many years, it played a supporting role under the 'Pinot Blanc' umbrella, but it is now being rediscovered for the unique elegance it offers as a stand-alone varietal.",
        classifications: [
            { name: 'Alsace Auxerrois', criteria: 'Regional Style', description: 'Richly textured and fruit-forward style produced in Alsace.' },
            { name: 'Pinot Blanc Blend', criteria: 'Blending Role', description: 'Commonly mixed with Pinot Blanc to provide added body and plushness.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Intensity', value: '4/10', description: 'Moderate and soft acidity.' },
            { label: 'Body', metric: 'Weight', value: '6/10', description: 'A substantial medium body.' },
            { label: 'Texture', metric: 'Smoothness', value: '8/10', description: 'Creamy and velvety on the palate.' }
        ],
        flavorTags: [
            { label: 'Peach', color: 'bg-orange-100/20 text-orange-700' },
            { label: 'Honey', color: 'bg-yellow-200/20 text-yellow-800' },
            { label: 'Melon', color: 'bg-green-100/20 text-green-700' }
        ],
        manufacturingProcess: [
            { step: 'Harvesting', name: 'Precision Picking', description: 'Harvested just before peak ripeness to ensure a balance of moderate acidity and full body.' },
            { step: 'Aging', name: 'Large Oak or Tank Maturation', description: 'Typically aged in large used oak vessels (Foudres) or stainless steel to preserve its delicate aromatics.' }
        ],
        majorRegions: [
            { name: 'Alsace', description: 'The global heartland for the refined cultivation of Auxerrois.', emoji: '🇫🇷' },
            { name: 'Luxembourg', description: 'A region where the variety is treated with high regard as a primary white grape.', emoji: '🇱🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White Wine Glass',
            optimalTemperatures: [
                { temp: '10–12°C', description: 'The range where its smooth aromatics and rich texture are perfectly balanced.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Tarte Flambée (Onion Tart)', 'Light poultry dishes', 'Asparagus with hollandaise'],
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['옥세루아', 'auxerrois']
}
