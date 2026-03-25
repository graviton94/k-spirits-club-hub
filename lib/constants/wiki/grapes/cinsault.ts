import { SpiritCategory } from '../types'

export const cinsault: SpiritCategory = {
    slug: 'cinsault',
    emoji: '🌸',
    nameKo: '생소',
    nameEn: 'Cinsault',
    taglineKo: '지중해의 화사함, 향긋한 꽃향과 부드러운 터치',
    taglineEn: 'Mediterranean brightness, floral aromatics and soft touch',
    color: 'rose',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '생소(Cinsault)는 프랑스 남부 지중해 연안에서 수 세기 동안 사랑받아 온 화사한 레드 품종입니다. 껍질이 얇고 과즙이 풍부하여 주로 가볍고 향긋한 로제 와인이나, 다른 품종(그르나슈, 시라 등)의 강한 타닌을 부드럽게 완화해 주는 블렌딩 파트너로 활약합니다. 신선한 딸기와 라즈베리의 과실향, 그리고 장미나 제비꽃 같은 화사한 꽃향기가 뛰어납니다.',
        history: '프랑스 남부 랑그독(Languedoc) 지역에서 유래한 유서 깊은 품종으로, 한때는 높은 수확량 덕분에 프랑스 와인 생산량의 상당 부분을 차지했습니다. 1925년 남아공에서 피노 누아와 교배되어 "피노타지(Pinotage)"라는 독특한 품종을 탄생시킨 부모 품종이기도 합니다. 오늘날에는 수확량 조절을 통해 우아한 풍미를 극대화한 고품질 단일 품종 와인으로 점점 더 주목받고 있습니다.',
        classifications: [
            { name: 'Provence Rosé', criteria: '주요 스타일', description: '창백한 분홍색과 상쾌한 산미를 지닌 전형적인 지중해 로제' },
            { name: 'Languedoc Blend', criteria: '혼합 방식', description: '그르나슈, 시라와 섞여 와인에 향기로운 아로마를 더해주는 역할' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '4/10', description: '매우 가볍고 경쾌한 미디엄 바디' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '3/10', description: '은은하고 부드러워 걸림 없는 목넘김' },
            { label: '산도 (Acidity)', metric: '청량감', value: '6/10', description: '화사한 과실향을 뒷받침하는 적절한 산미' }
        ],
        flavorTags: [
            { label: '딸기', color: 'bg-red-400/20 text-red-600' },
            { label: '석류', color: 'bg-red-500/20 text-red-700' },
            { label: '장미', color: 'bg-pink-100/20 text-pink-600' }
        ],
        manufacturingProcess: [
            { step: '침출', name: '짧은 침출 (Short Maceration)', description: '로제 와인을 만들 때 맑은 분홍색을 얻기 위해 침출 시간을 극도로 짧게 유지합니다.' },
            { step: '발효', name: '저온 발효', description: '섬세한 꽃향기를 보존하기 위해 서늘한 온도에서 발효를 진행합니다.' }
        ],
        majorRegions: [
            { name: '프로방스 & 랑그독 (Provence & Languedoc)', description: '세계 최고의 생소 로제와 블렌딩 와인이 생산되는 곳', emoji: '🇫🇷' },
            { name: '스와트랜드 (Swartland)', description: '남아공의 오래된 나무에서 생산되는 농축된 생소의 명산지', emoji: '🇿🇦' }
        ],
        servingGuidelines: {
            recommendedGlass: '화이트 또는 전용 로제 와인 글라스',
            optimalTemperatures: [
                { temp: '8-11°C', description: '로제나 가벼운 레드로 즐길 때 가장 향긋한 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['지중해식 생선 요리', '가벼운 육류 샐러드', '매콤한 아시안 퀴진']
    },
    sectionsEn: {
        definition: "Cinsault (or Cinsaut) is a luminous red grape variety that has been cherished along the Mediterranean coast of Southern France for centuries. Known for its thin skins and juicy flesh, it is a primary component of fragrant rosé wines and a valued blending partner that softens the bold tannins of grapes like Grenache or Syrah. It is defined by fresh notes of strawberry, raspberry, and bright floral aromatics such as rose and violet.",
        history: "Originating in the Languedoc region of France, Cinsault was once prized for its high yields, making up a significant portion of French wine production. In 1925, it achieved global botanical fame by being crossed with Pinot Noir in South Africa to create the unique variety 'Pinotage.' Today, winemakers are rediscovering its potential through yield restriction, producing elegant, high-quality single-varietal wines.",
        classifications: [
            { name: 'Provence Rosé', criteria: 'Core Style', description: 'The archetypal Mediterranean rosé with a pale pink hue and refreshing acidity.' },
            { name: 'Languedoc Blend', criteria: 'Blending Usage', description: 'Used alongside Grenache and Syrah to impart fragrant aromatics to red blends.' }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '4/10', description: 'Very light and airy medium body.' },
            { label: 'Tannins', metric: 'Astringency', value: '3/10', description: 'Subtle and smooth with a clean finish.' },
            { label: 'Acidity', metric: 'Crispness', value: '6/10', description: 'Provides a bright backbone to its floral profiles.' }
        ],
        flavorTags: [
            { label: 'Strawberry', color: 'bg-red-400/20 text-red-600' },
            { label: 'Pomegranate', color: 'bg-red-500/20 text-red-700' },
            { label: 'Rose', color: 'bg-pink-100/20 text-pink-600' }
        ],
        manufacturingProcess: [
            { step: 'Maceration', name: 'Short Maceration', description: 'To achieve the characteristic pale pink of rosé, skin contact time is kept extremely brief.' },
            { step: 'Fermentation', name: 'Cool Fermentation', description: 'Fermented at lower temperatures to preserve delicate floral and fruity esters.' }
        ],
        majorRegions: [
            { name: 'Provence & Languedoc', description: "The heart of global Cinsault production for both rosés and blends.", emoji: '🇫🇷' },
            { name: 'Swartland', description: 'Renowned for concentrated Cinsault from historic old-vines in South Africa.', emoji: '🇿🇦' }
        ],
        servingGuidelines: {
            recommendedGlass: 'White Wine or Dedicated Rosé Glass',
            optimalTemperatures: [
                { temp: '8-11°C', description: 'The ideal range for enjoying its fragrant bouquet as a rosé or light red.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Mediterranean fish dishes', 'Light meat salads', 'Spicy Asian cuisine']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['생소', 'cinsault']
}
