import { SpiritCategory } from '../types'

export const sauvignonGrise: SpiritCategory = {
    slug: 'sauvignon-grise',
    emoji: '🌫️',
    nameKo: '소비뇽 그리',
    nameEn: 'Sauvignon Gris',
    taglineKo: '소비뇽의 화려한 변신, 짙은 핑크빛 껍질이 선사하는 우아한 질감',
    taglineEn: 'Sauvignon’s brilliant transformation, elegant texture from deep pink skin',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '소비뇽 그리(Sauvignon Gris)는 소비뇽 블랑의 희귀한 변종으로, 이름처럼 포도 껍질이 회색빛을 가미한 분홍색을 띠는 것이 특징입니다. 소비뇽 블랑의 활기찬 아로마를 유지하면서도, 보다 묵직한 바디감과 매끄러운 질감, 그리고 이국적인 향신료 향을 더해 매우 우아하고 미학적인 풍미를 선사합니다. "더 성숙하고 세련된 스타일의 소비뇽"이라고 불리기도 합니다.',
        history: '프랑스 보르도 지역에서 유래한 고대 품종으로, 필록세라 위기 이전에는 널리 재배되었으나 이후 수확량이 적다는 이유로 거의 사라졌던 품종입니다. 하지만 최근 보르도와 칠레의 몇몇 생산자들이 이 품종의 독특한 개성과 높은 품질에 주목하여 다시금 식재 면적을 늘리고 있으며, 특히 고급 화이트 블렌딩 와인에 복합미를 더하는 비밀병기로 평가받고 있습니다.',
        classifications: [
            { name: 'Graves / Pessac-Léognan Component', criteria: '블렌딩 역할', description: '최고급 보르도 화이트 와인에 바디감과 질감을 보완하기 위해 섞이는 귀한 품종' },
            { name: 'Varietal Sauvignon Gris', criteria: '단독 스타일', description: '칠레나 프랑스 일부 산지에서 생산되는, 특유의 향신료 향과 오일리한 질감을 강조한 와인' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '7/10', description: '소비뇽 블랑보다 훨씬 묵직하고 매끄러운 유질감' },
            { label: '향기 (Aroma)', metric: '발현도', value: '8/10', description: '자몽, 패션프루트에 이국적인 스파이스 맛이 가미된 향' },
            { label: '산도 (Acidity)', metric: '청량감', value: '8/10', description: '풍성한 질감을 깔끔하게 마무리해 주는 탄탄한 산미' }
        ],
        flavorTags: [
            { label: '핑크 자몽', color: 'bg-red-50/20 text-red-600' },
            { label: '생강 / 스파이스', color: 'bg-orange-100/20 text-orange-700' },
            { label: '복숭아', color: 'bg-orange-200/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: '침출', name: '단기 스킨 컨택', description: '껍질에 들어있는 특유의 오키하고 향기로운 성분을 추출하기 위해 짧게 침출 과정을 거칩니다.' },
            { step: '숙성', name: '오크 및 앙금 숙성', description: '특유의 우아한 바디감을 완성하기 위해 가벼운 오크 숙성이나 효모 앙금과 함께 숙성하기도 합니다.' }
        ],
        majorRegions: [
            { name: '보르도 (Bordeaux)', description: '소비뇽 그리의 고향이자 최고의 블렌딩 와인이 탄생하는 곳', emoji: '🇫🇷' },
            { name: '레이다 밸리 (Leyda Valley)', description: '칠레의 서늘한 해안가에서 신선함과 질감을 동시에 갖춘 소비뇽 그리가 생산되는 곳', emoji: '🇨🇱' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준형 화이트 또는 약간 넓은 잔',
            optimalTemperatures: [
                { temp: '9-12°C', description: '너무 차가우면 특유의 풍성한 질감을 느끼기 어려우므로 약간의 온도가 있는 상태가 좋습니다.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['구운 연어', '크림 소스 가리비 요리', '태국식 커리', '숙성된 염소 치즈']
    },
    sectionsEn: {
        definition: "Sauvignon Gris is a rare, pink-skinned mutation of Sauvignon Blanc. While it shares the vibrant aromatic DNA of its cousin, it offers a more expansive body, a silken texture, and intriguing notes of exotic spices. Often described as a 'more mature and sophisticated Sauvignon,' it sits perfectly between the zesty energy of Sauvignon Blanc and the physical weight of varieties like Sémillon.",
        history: "A historic variety from the Bordeaux region, it was widely planted before the Phylloxera crisis but nearly vanished afterward due to its low yields. Recently, forward-thinking producers in Bordeaux and Chile have rediscovered its unique personality. It is now increasingly valued as a 'secret weapon' to add textural depth and aromatic complexity to high-end white blends and premium single-varietal wines.",
        classifications: [
            { name: 'Graves / Pessac-Léognan Component', criteria: 'Blending Role', description: 'Adds vital physical weight and silken texture to some of the world’s most prestigious white Bordeaux blends.' },
            { name: 'Varietal Sauvignon Gris', criteria: 'Singular Style', description: 'High-quality expressions from Chile or France emphasizing the variety’s specific spicy aromatics and oily texture.' }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '7/10', description: 'Possesses significantly more physical presence and viscosity than standard Sauvignon Blanc.' },
            { label: 'Aroma', metric: 'Intensity', value: '8/10', description: 'Complex notes of pink grapefruit and passion fruit laced with exotic spice.' },
            { label: 'Acidity', metric: 'Crispness', value: '8/10', description: 'Firm enough to maintain balance against its rich, expansive mouthfeel.' }
        ],
        flavorTags: [
            { label: 'Pink Grapefruit', color: 'bg-red-50/20 text-red-600' },
            { label: 'Ginger / Spice', color: 'bg-orange-100/20 text-orange-700' },
            { label: 'Peach', color: 'bg-orange-200/20 text-orange-800' }
        ],
        manufacturingProcess: [
            { step: 'Maceration', name: 'Short Skin Contact', description: 'Used to extract the aromatic and textural phenolic compounds localized in the grape’s pink skins.' },
            { step: 'Aging', name: 'Lees & Oak Maturation', description: 'Frequently matured on the lees or in neutral oak to build the variety’s characteristic elegance and body.' }
        ],
        majorRegions: [
            { name: 'Bordeaux', description: 'The ancestral homeland where it contributes to world-class dry white blends.', emoji: '🇫🇷' },
            { name: 'Leyda Valley', description: "Chile's coastal powerhouse for producing Sauvignon Gris with crystalline acidity and rich texture.", emoji: '🇨🇱' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White Wine glass or one with a slightly larger bowl',
            optimalTemperatures: [
                { temp: '9–12°C', description: 'Ideally served slightly less chilled than Sauvignon Blanc to appreciate its textural richness.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Grilled salmon', 'Scallops in cream sauce', 'Thai green curry', 'Aged goat cheese']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['소비뇽 그리', 'sauvignon gris']
}
