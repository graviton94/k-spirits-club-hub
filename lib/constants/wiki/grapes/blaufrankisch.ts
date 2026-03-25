import { SpiritCategory } from '../types'

export const blaufrankisch: SpiritCategory = {
    slug: 'blaufrankisch',
    emoji: '🫐',
    nameKo: '블라우프렝키쉬',
    nameEn: 'Blaufränkisch',
    taglineKo: '오스트리아의 고귀한 레드, 깊은 산미와 검은 과실의 우아한 구조감',
    taglineEn: 'The noble red of Austria, deep acidity and elegant structure of dark fruit',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '블라우프렝키쉬(Blaufränkisch)는 오스트리아를 대표하는 가장 고귀한 레드 품종입니다. "동유럽의 피노 누아"라고 불릴 만큼 우아하고 섬세한 구조감을 지니면서도, 검은 체리와 블루베리의 농축된 과실향, 그리고 후추와 같은 스파이시한 풍미가 특징입니다. 특히 높은 산미와 견고한 타닌 덕분에 장기 숙성 잠재력이 매우 뛰어나며, 테루아를 아주 예민하게 반영하는 품종으로 알려져 있습니다.',
        history: '중부 유럽에서 유래한 이 품종은 수 세기 동안 재배되어 왔습니다. 독일어권에서는 "Lemberger", 헝가리에서는 "Kékfrankos"로 불리며 각 지역의 역사와 함께해 왔습니다. 19세기 "Fränkisch"라는 이름은 당시 최고급 품질의 포도를 의미하는 용어였으며, 블라우프렝키쉬 역시 최상급 레드 와인을 생산하는 품종으로 인정받아 왔습니다. 현대 오스트리아에서는 특히 부르겐란트(Burgenland) 지역을 중심으로 세계적인 명성의 프리미엄 와인이 탄생하고 있습니다.',
        classifications: [
            { name: 'Klassik', criteria: '숙성 스타일', description: '오크 숙성을 최소화하여 신선하고 과실향이 풍부한 스타일' },
            { name: 'Reserve', criteria: '품질 등급', description: '더 오래된 포도나무에서 수확하고 장기 오크 숙성을 거친 중후한 스타일' },
            { name: 'DAC Single Vineyard', criteria: '원산지 보호', description: '특정 밭의 테루아를 반영한 최고급 단일 빈야드 스타일' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '산량', value: '8/10', description: '선명하고 생생한 산미' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '7/10', description: '견고하지만 입자감이 고운 타닌' },
            { label: '바디 (Body)', metric: '무게감', value: '7/10', description: '단단하고 세련된 미디엄-풀 바디' }
        ],
        flavorTags: [
            { label: '블랙 체리', color: 'bg-red-900/20 text-red-950' },
            { label: '블루베리', color: 'bg-blue-900/20 text-blue-950' },
            { label: '검은 후추', color: 'bg-stone-600/20 text-stone-800' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '스테인리스 및 대형 오크 발효', description: '섬세한 향 보존을 위해 발효 용기 선택에 신중을 기합니다.' },
            { step: '숙성', name: '장기 오크 숙성', description: '타닌을 정제하고 복합미를 완성하기 위해 주로 225L 또는 대형 오크통(Fuder)에서 12-24개월 숙성합니다.' }
        ],
        majorRegions: [
            { name: '부르겐란트 (Burgenland)', description: '오스트리아 블라우프렝키쉬의 절대적인 성지', emoji: '🇦🇹' },
            { name: '쇼프론 (Sopron)', description: '역사적인 연결고리를 가진 헝가리의 주요 산지', emoji: '🇭🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: '부르고뉴 스타일 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '우아한 향기와 복합적인 풍미가 극대화되는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['구운 오리 요리', '허브를 곁들인 양갈비', '버섯 소스 스테이크'],
    },
    sectionsEn: {
        definition: "Blaufränkisch is the most noble and representative red grape variety of Austria. Often referred to as 'the Pinot Noir of Eastern Europe,' it combines elegant and delicate structure with concentrated aromas of black cherry and blueberry, along with peppery spiciness. Its high acidity and firm tannins provide outstanding aging potential, and it is known for being extremely sensitive to reflecting its specific terroir.",
        history: "Originating in Central Europe, this variety has been cultivated for centuries. Known as 'Lemberger' in German-speaking countries and 'Kékfrankos' in Hungary, it is deeply woven into regional history. In the 19th century, the name 'Fränkisch' denoted grapes of the highest quality, and Blaufränkisch was recognized for producing superior red wines. Today, Austrian producers in the Burgenland region are creating world-class premium wines from this variety.",
        classifications: [
            { name: 'Klassik', criteria: 'Aging Style', description: 'A style that minimizes oak to highlight fresh fruit character.' },
            { name: 'Reserve', criteria: 'Quality Tier', description: 'A more powerful style harvested from older vines and subjected to long-term oak aging.' },
            { name: 'DAC Single Vineyard', criteria: 'Appellation', description: 'Premium wines focusing on the distinct terroir of a specific vineyard.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Intensity', value: '8/10', description: 'Sharp and lively acidity.' },
            { label: 'Tannins', metric: 'Astringency', value: '7/10', description: 'Firm yet fine-grained tannins.' },
            { label: 'Body', metric: 'Weight', value: '7/10', description: 'Structured and refined medium-to-full body.' }
        ],
        flavorTags: [
            { label: 'Black Cherry', color: 'bg-red-900/20 text-red-950' },
            { label: 'Blueberry', color: 'bg-blue-900/20 text-blue-950' },
            { label: 'Black Pepper', color: 'bg-stone-600/20 text-stone-800' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Stainless & Large Oak Fermentation', description: 'Careful selection of fermentation vessels to preserve its delicate bouquet.' },
            { step: 'Aging', name: 'Long-term Oak Maturation', description: 'Typically aged for 12-24 months in 225L barrels or large Fuders to refine tannins and build complexity.' }
        ],
        majorRegions: [
            { name: 'Burgenland', description: "The absolute heartland of high-quality Austrian Blaufränkisch.", emoji: '🇦🇹' },
            { name: 'Sopron', description: 'A key historic Hungarian region closely linked with the variety.', emoji: '🇭🇺' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Burgundy Style Red Wine Glass',
            optimalTemperatures: [
                { temp: '16-18°C', description: 'The range where its elegant bouquet and complex flavors reach their peak.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Roasted duck', 'Herb-crusted lamb', 'Steak with mushroom sauce'],
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['블라우프렝키쉬', 'blaufrankisch']
}
