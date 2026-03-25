import { SpiritCategory } from '../types'

export const parellada: SpiritCategory = {
    slug: 'parellada',
    emoji: '🥂',
    nameKo: '파렐랴다',
    nameEn: 'Parellada',
    taglineKo: '카탈루냐의 신선한 숨결, 까바(Cava)에 우아한 꽃향기를 더하다',
    taglineEn: 'The fresh breath of Catalonia, adding elegant floral notes to Cava',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '파렐랴다(Parellada)는 스페인 카탈루냐 지역의 고산지대에서 주로 재배되는 고품격 화이트 품종입니다. 스페인의 대표 스파클링 와인인 까바(Cava)를 구성하는 핵심 3대 품종 중 하나로, 와인에 섬세한 꽃향기와 신선한 청사과 향, 그리고 우아한 품격을 부여합니다. 마카베오, 자렐로와 함께 어우러져 까바 특유의 균형 잡힌 구조감을 완성하는 역할을 합니다.',
        history: '스페인 카탈루냐의 전통적인 품종으로, 특히 서늘한 기후를 가진 높은 고도의 "페네데스 슈페리어(Penedès Superior)" 지역에서 가장 뛰어난 품질을 보여줍니다. 다른 까바 품종들보다 늦게 익는 만숙형이지만, 그만큼 섬세하고 정교한 아로마를 축적할 수 있어 오랫동안 고품질 스파클링 와인 생산의 필수 성분으로 대접받아 왔습니다.',
        classifications: [
            { name: 'Cava Companion', criteria: '주요 역할', description: '까바 블렌딩에서 우아한 아로마와 섬세함을 담당하는 핵심 품종' },
            { name: 'Montonega', criteria: '희귀 변종', description: '가장 높은 고지대에서 자라는 파렐랴다의 클론으로, 더욱 농축된 산미와 풍미를 지님' }
        ],
        sensoryMetrics: [
            { label: '향기 (Aroma)', metric: '섬세함', value: '8/10', description: '청사과와 하얀 꽃의 매우 정교한 아로마' },
            { label: '산도 (Acidity)', metric: '청량감', value: '7/10', description: '고산지대에서 유래한 깨끗하고 상쾌한 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '3/10', description: '가볍고 우아하며 직선적인 라이트 바디' }
        ],
        flavorTags: [
            { label: '청사과', color: 'bg-green-100/20 text-green-700' },
            { label: '시트러스', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '야생화', color: 'bg-slate-100/20 text-slate-600' }
        ],
        manufacturingProcess: [
            { step: '재배', name: '고산지대 재배', description: '특유의 신선함과 산도를 유지하기 위해 해발 500m 이상의 서늘한 지역에서 주로 재배합니다.' },
            { step: '발효', name: '스테인리스 저온 발효', description: '파렐랴다의 섬세한 향을 지키기 위해 산소 접촉을 피하고 차가운 탱크에서 발효합니다.' }
        ],
        majorRegions: [
            { name: '페네데스 (Penedès)', description: '전 세계 파렐랴다 생산의 중심지이자 고귀한 까바의 고향', emoji: '🇪🇸' },
            { name: '카탈루냐 (Catalonia)', description: '스페인 북동부의 다양한 테루아에서 자라나는 파렐랴다의 산지', emoji: '🇪🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준 화이트 또는 플루트형 스파클링 글라스',
            optimalTemperatures: [
                { temp: '6-8°C', description: '파렐랴다 특유의 청량한 아로마와 바삭한 산미가 가장 기분 좋은 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['가벼운 해산물 샐러드', '굴 요리', '부드러운 고트 치즈', '과일을 곁들인 타파스']
    },
    sectionsEn: {
        definition: "Parellada is a high-quality white grape variety primarily cultivated in the highlands of Catalonia, Spain. As one of the three foundational grapes for Cava—Spain's premier sparkling wine—it contributes delicate floral notes, fresh green apple aromatics, and refined elegance. It works in harmony with Macabeo and Xarello to complete the balanced structure and sophisticated profile iconic to traditional method Cava.",
        history: "A traditional Catalan variety, Parellada achieves its zenith in the cooler, high-altitude vineyards of 'Penedès Superior.' Being a late-ripening variety compared to its blending partners, it focuses on accumulating intricate and subtle aromatics. This has cemented its reputation as an indispensable component for high-quality sparkling wine production over many generations.",
        classifications: [
            { name: 'Cava Companion', criteria: 'Primary Role', description: 'The essential component responsible for the elegant aroma and finesse in traditional Cava blends.' },
            { name: 'Montonega', criteria: 'Rare Variant', description: 'A high-altitude clone of Parellada known for its even more concentrated acidity and flavor intensity.' }
        ],
        sensoryMetrics: [
            { label: 'Aroma', metric: 'Delicacy', value: '8/10', description: 'Extremely refined notes of green apple and white blossoms.' },
            { label: 'Acidity', metric: 'Crispness', value: '7/10', description: 'Clean and refreshing acidity derived from its high-altitude heritage.' },
            { label: 'Body', metric: 'Weight', value: '3/10', description: 'Light, elegant, and focused on the palate.' }
        ],
        flavorTags: [
            { label: 'Green Apple', color: 'bg-green-100/20 text-green-700' },
            { label: 'Citrus', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Wildflowers', color: 'bg-slate-100/20 text-slate-600' }
        ],
        manufacturingProcess: [
            { step: 'Viticulture', name: 'High-Altitude Farming', description: 'Grown at elevations above 500m to preserve natural freshness and vibrant acidity.' },
            { step: 'Fermentation', name: 'Cool Stainless Steel Fermentation', description: 'Maintained at low temperatures to protect the variety’s fleeting and delicate aromatics from oxidation.' }
        ],
        majorRegions: [
            { name: 'Penedès', description: 'The undisputed heartland for producing the finest and most expressive Parellada.', emoji: '🇪🇸' },
            { name: 'Catalonia', description: 'Home to the diverse terroirs where Spain’s premier sparkling wine grapes thrive.', emoji: '🇪🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White or Sparkling Flute glass',
            optimalTemperatures: [
                { temp: '6–8°C', description: 'The best range for enjoying its crisp aromatics and refreshing, bright acidity.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Light seafood salads', 'Oysters', 'Mild goat cheese', 'Fruit-based tapas']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['파렐랴다', 'parellada']
}
