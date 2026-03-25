import { SpiritCategory } from '../types'

export const palomino: SpiritCategory = {
    slug: 'palomino',
    emoji: '☀️',
    nameKo: '팔로미노',
    nameEn: 'Palomino',
    taglineKo: '셰리의 영혼, 안달루시아의 하얀 토양이 빚어낸 시간의 마법',
    taglineEn: 'The soul of Sherry, the magic of time crafted by Andalusian white soil',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '팔로미노(Palomino)는 스페인 남부 안달루시아(Andalusia)의 상징이자, 세계 최고의 주정 강화 와인인 셰리(Sherry)의 핵심 품종입니다. 알바리사(Albariza)라 불리는 눈부시게 하얀 석회질 토양에서 자라며, 자체적인 과실향은 담백하고 중성적이지만, 셰리의 독특한 숙성 과정을 통해 견과류, 소금기, 그리고 깊은 미네랄리티의 경이로운 복합미로 변화하는 "진화하는 품종"입니다.',
        history: '스페인 남부 제레즈(Jerez) 지역에서 수 세기 동안 재배되어 온 유서 깊은 품종으로, 카스티야의 왕 알폰소 10세의 기사였던 페르난 이바녜즈 팔로미노(Fernán Ibáñez Palomino)의 이름을 딴 것으로 전해집니다. 한때는 일반 테이블 와인으로도 쓰였으나, 셰리의 전 세계적인 성공과 함께 셰리 생산의 95% 이상을 차지하는 독보적인 지위를 확고히 했습니다.',
        classifications: [
            { name: 'Fino / Manzanilla Base', criteria: '셰리 스타일', description: '플로르(Flor) 효모 아래에서 숙성되어 극도의 드라이함과 신선한 소금기를 가진 스타일' },
            { name: 'Oloroso Base', criteria: '셰리 스타일', description: '산화 숙성을 통해 진한 호두 향과 묵직한 바디감을 가진 스타일' },
            { name: 'Vino de la Tierra de Cádiz', criteria: '테이블 와인 스타일', description: '최근 주목받는 팔로미노 본연의 깔끔함과 미네랄을 살린 일반 화이트 와인' }
        ],
        sensoryMetrics: [
            { label: '미네랄 (Minerality)', metric: '산지 특성', value: '10/10', description: '하얀 석회질 토양에서 오는 날카로운 미네랄 풍미' },
            { label: '산도 (Acidity)', metric: '청량감', value: '4/10', description: '자체 산도는 낮으나 숙성 과정을 통해 구조감을 완성' },
            { label: '바디 (Body)', metric: '무게감', value: '5/10', description: '매우 매끄럽고 건조한(Dry) 질감' }
        ],
        flavorTags: [
            { label: '아몬드', color: 'bg-amber-100/20 text-amber-800' },
            { label: '바다 소금', color: 'bg-blue-50/20 text-blue-700' },
            { label: '효모 (Yeasty)', color: 'bg-slate-100/20 text-slate-700' }
        ],
        manufacturingProcess: [
            { step: '발효/강화', name: '솔레라 시스템 (Solera)', description: '여러 층의 오크통을 거치며 오래된 와인과 새 와인을 섞어 일관된 품질을 만드는 독특한 숙성 방식' },
            { step: '생물학적 숙성', name: '플로르 (Flor) 숙성', description: '와인 표면에 형성된 효모막(Flor)을 통해 공기를 차단하고 독특한 견과향과 신선함을 유지합니다.' }
        ],
        majorRegions: [
            { name: '제레즈 (Jerez-Xérès-Sherry)', description: '전 세계 팔로미노의 성지이자 셰리의 본고장', emoji: '🇪🇸' },
            { name: '산루카 데 바라메다', description: '바다 해풍의 영향을 받은 만사니야의 생산지', emoji: '🇪🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준 화이트 또는 셰리 전용 코피타(Copita) 글라스',
            optimalTemperatures: [
                { temp: '7-9°C', description: '피노나 만사니야 등 신선한 스타일은 차갑게 서빙' },
                { temp: '12-14°C', description: '올로로소 등 산화 숙성 스타일은 풍부한 향을 위해' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['하몽 이베리코', '볶은 아몬드', '각종 해산물 튀김', '숙성된 치즈', '올리브']
    },
    sectionsEn: {
        definition: "Palomino is the iconic white grape of Andalusia, Southern Spain, and the beating heart of world-class Sherry (Jerez). Thriving in the brilliantly white, chalky soils known as 'Albariza,' the grape itself is relatively neutral in fruitiness but blossoms into a miracle of complexity through Sherry's unique aging processes. It evolves into a spectrum of flavors ranging from fresh salinity and almonds to deep, oxidative notes of walnut and dark spice.",
        history: "A variety with deep roots in the Jerez region, it is famously named after Fernán Ibáñez Palomino, a knight of King Alfonso X of Castile. Over centuries, it moved from a general table grape to its current undisputed dominance, accounting for over 95% of all Sherry production. Today, it stands as a testament to the power of terroir and transformational winemaking in Andalusian history.",
        classifications: [
            { name: 'Fino / Manzanilla Base', criteria: 'Sherry Style', description: 'Aged under a veil of flor yeast, resulting in extraordinary dryness and fresh, saline aromatics.' },
            { name: 'Oloroso Base', criteria: 'Sherry Style', description: 'Undergoes oxidative aging, developing a deep amber hue and rich, walnut-led intensity.' },
            { name: 'Vino de la Tierra de Cádiz', criteria: 'Table Wine Style', description: 'An emerging category focusing on the grape’s pure mineral character and clean structure.' }
        ],
        sensoryMetrics: [
            { label: 'Minerality', metric: 'Terroir Depth', value: '10/10', description: 'Sharp, chalky minerality derived from the unique Albariza soils.' },
            { label: 'Acidity', metric: 'Crispness', value: '4/10', description: 'Naturally moderate acidity that is refined through the fortification process.' },
            { label: 'Body', metric: 'Weight', value: '5/10', description: 'Features an incredibly smooth, bone-dry, and clean mouthfeel.' }
        ],
        flavorTags: [
            { label: 'Almond', color: 'bg-amber-100/20 text-amber-800' },
            { label: 'Sea Salt', color: 'bg-blue-50/20 text-blue-700' },
            { label: 'Yeasty', color: 'bg-slate-100/20 text-slate-700' }
        ],
        manufacturingProcess: [
            { step: 'Aging', name: 'Solera System', description: 'A dynamic system of fractional blending that ensures consistent quality and unmatched depth of age.' },
            { step: 'Biological Aging', name: 'Flor Maturation', description: 'A natural layer of yeast (flor) protects the wine from oxygen, introducing almonds and fresh-baked bread aromas.' }
        ],
        majorRegions: [
            { name: 'Jerez-Xérès-Sherry', description: 'The global spiritual home for Palomino and the definitive region for Sherry.', emoji: '🇪🇸' },
            { name: 'Sanlúcar de Barrameda', description: 'Famous for Manzanilla, a style defined by the saline influence of the coastal breeze.', emoji: '🇪🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White or dedicated Copita glass',
            optimalTemperatures: [
                { temp: '7–9°C', description: 'Best for fresh biological styles like Fino or Manzanilla.' },
                { temp: '12–14°C', description: 'Allows the rich, oxidative bouquet of Oloroso to truly shine.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Jamón Ibérico', 'Roasted almonds', 'Fried calamari', 'Aged hard cheeses', 'Olives']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['팔로미노', 'palomino', '셰리', 'sherry', '헤레스', 'jerez']
}
