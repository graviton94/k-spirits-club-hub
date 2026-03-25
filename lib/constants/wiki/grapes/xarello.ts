import { SpiritCategory } from '../types'

export const xarello: SpiritCategory = {
    slug: 'xarello',
    emoji: '🥂',
    nameKo: '샤렐로',
    nameEn: 'Xarel-lo',
    taglineKo: '카바의 강인한 골격, 세월을 이기는 미네랄과 고귀한 아로마',
    taglineEn: 'The robust skeleton of Cava, age-defying minerals and noble aroma',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '샤렐로(Xarel-lo)는 스페인 카탈루냐 지방을 대표하는 가장 고귀한 화이트 품종입니다. 스페인의 프리미움 스파클링 와인인 "카바(Cava)"의 핵심 3대 품종 중 하나로, 와인에 탄탄한 골격과 장기 숙성력, 그리고 독특한 미네랄 풍미를 부여하는 역할을 합니다. 화이트 품종 중 보기 드물게 항산화 성분(레스베라트롤)이 풍부하여, 세월이 흘러도 변치 않는 생동감을 자랑하는 "카바의 영혼"입니다.',
        history: '스페인 페네데스(Penedès) 지역의 토착 품종으로 오랜 시간 동안 카바 블렌딩의 조연으로 여겨졌으나, 최근 그 탁월한 숙성력과 깊은 풍미가 재발견되며 단일 품종 와인으로서도 각광받고 있습니다. 고대부터 재배되어 온 강인한 생명력을 바탕으로, 오늘날 스페인 화이트 와인의 품질을 상징하는 지표가 되었습니다.',
        classifications: [
            { name: 'Cava Blend Component', criteria: '스파클링 역할', description: '카바 블렌딩에서 가장 중요한 구조감과 장기 숙성을 위한 골격을 제공' },
            { name: 'Old Vine Xarel-lo', criteria: '고목 스타일', description: '수십 년 된 고목에서 수확하여 입안을 꽉 채우는 질감과 깊은 미네랄을 지닌 프리미엄 드라이 화이트' },
            { name: 'Penedès DO', criteria: '산지 등급', description: '샤렐로의 본고장 페네데스에서 생산되는 정통성과 개성이 듬뿍 담긴 와인' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '8/10', description: '스파클링 와인의 생동감을 유지해주는 탄탄한 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '7/10', description: '화이트 품종 중 매우 드물게 느껴지는 유질감과 묵직한 구조감' },
            { label: '미네랄 (Minerals)', metric: '강도', value: '9/10', description: '카탈루냐의 석회질 토양을 반영한 짭짤하고 날카로운 미네랄리티' }
        ],
        flavorTags: [
            { label: '레몬 / 라임', color: 'bg-yellow-50/20 text-yellow-600' },
            { label: '회향 (Fennel)', color: 'bg-green-100/20 text-green-700' },
            { label: '구운 빵 (Brioche)', color: 'bg-orange-100/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '저온 침출 및 발효', description: '샤렐로 특유의 아로마와 구조감을 극대화하기 위해 껍질과 함께 짧게 침출한 후 저온 발효합니다.' },
            { step: '숙성', name: '리(Lee) 숙성', description: '효모 찌꺼기와 함께 숙성(Sur Lie)하여 복합적인 풍미와 크리미한 질감을 더합니다.' }
        ],
        majorRegions: [
            { name: '페네데스 (Penedès)', description: '샤렐로가 태어나고 자란, 세계 최고의 카바가 생산되는 지역', emoji: '🇪🇸' },
            { name: '산 사두르니 다노이아', description: '카바의 수도라 불리는 이곳에서 가장 품질 좋은 샤렐로가 사용됩니다.', emoji: '🇪🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: '튤립형 스파클링 글라스 또는 표준 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '8-10°C', description: '카바의 기포와 샤렐로 특유의 미네랄리티가 가장 조화롭게 표현되는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['신선한 굴 요리', '감바스 알 아히요', '구운 생선 요리', '스페인식 하몬']
    },
    sectionsEn: {
        definition: "Xarel-lo is the most distinguished and noble white variety of Catalonia, Spain. It stands as one of the three paramount components of Cava, Spain's premier sparkling wine, where it is responsible for providing structural weight, incredible aging potential, and a unique mineral character. Exceptionally rich in antioxidants (resveratrol) for a white grape, it is known as the 'Soul of Cava' for its ability to maintain youthful vitality over decades.",
        history: "A native variety of the Penedès region, it was long considered a supporting actor in sparkling blends. However, modern viticulture has rediscovered its profound potential as a still varietal wine of high character. With ancient roots and a resilient nature, Xarel-lo has emerged as the defining benchmark for quality-driven Spanish white winemaking in the 21st century.",
        classifications: [
            { name: 'Cava Blend Component', criteria: 'Sparkling Role', description: 'The essential backbone of Cava, providing the structure required for extended cellar aging.' },
            { name: 'Old Vine Xarel-lo', criteria: 'Heritage Style', description: 'Produced from decades-old vines, offering a dense texture and deep, saline mineral expression.' },
            { name: 'Penedès DO', criteria: 'Regional Tier', description: 'The official designation for both sparkling and still wines that reflect the authentic Penedès terroir.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '8/10', description: 'Firm, persistent acidity that ensures the vibrancy of top-tier sparkling wines.' },
            { label: 'Body', metric: 'Weight', value: '7/10', description: 'Possesses a rare oily texture and physical structure not commonly found in white grapes.' },
            { label: 'Minerality', metric: 'Intensity', value: '9/10', description: 'Highly distinctive saline and flinty notes typical of Catalan limestone soils.' }
        ],
        flavorTags: [
            { label: 'Lemon / Lime', color: 'bg-yellow-50/20 text-yellow-600' },
            { label: 'Fresh Fennel', color: 'bg-green-100/20 text-green-700' },
            { label: 'Brioche / Toast', color: 'bg-orange-100/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Maceration & Cool Ferment', description: 'Utilizes short skin contact to maximize the extraction of structural compounds before a controlled fermentation.' },
            { step: 'Aging', name: 'Lee Contact (Sur Lie)', description: 'Matured on fine lees to introduce complexity, mouthfeel, and secondary savory aromatics.' }
        ],
        majorRegions: [
            { name: 'Penedès', description: 'The spiritual heartland where Xarel-lo achieves its most complex and diverse expressions.', emoji: '🇪🇸' },
            { name: 'Sant Sadurní d’Anoia', description: "The 'capital of Cava,' where the variety is handled with the utmost technical precision.", emoji: '🇪🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Tulip-shaped Champagne glass or Standard White Wine glass',
            optimalTemperatures: [
                { temp: '8–10°C', description: 'The ideal range to appreciate both the effervescence of Cava and the mineral depth of the grape.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Fresh oysters', 'Gambas al Ajillo (Garlic shrimp)', 'Grilled whole fish', 'Spanish Jamón Ibérico']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['샤렐로', 'xarello', 'xarel-lo', '페네데스', '카바']
}
