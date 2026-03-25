import { SpiritCategory } from '../types'

export const trebbiano: SpiritCategory = {
    slug: 'trebbiano',
    emoji: '🍋',
    nameKo: '트레비아노',
    nameEn: 'Trebbiano (Ugni Blanc)',
    taglineKo: '지중해의 실용성, 상쾌한 산미와 브랜디의 위대한 모태',
    taglineEn: 'The practicality of the Mediterranean, refreshing acidity and the great mother of brandy',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '트레비아노(Trebbiano), 혹은 프랑스에서 "위니 블랑(Ugni Blanc)"으로 불리는 이 품종은 세계에서 가장 많이 재배되는 화이트 품종 중 하나입니다. 높은 산도와 중립적인 아로마가 특징으로, 단독 와인보다는 블렌딩이나 세계 최고의 브랜디인 "코냑(Cognac)"과 "아르마냑"의 핵심 원료로 가장 유명합니다. 가볍고 상쾌한 드라이 화이트 와인부터 고귀한 증류주까지 아우르는 실용적인 개성의 소유자입니다.',
        history: '이탈리아 전역에서 고대부터 재배되어 온 유서 깊은 품종으로, 중세 시대에 프랑스로 전파되어 "위니 블랑"이라는 이름을 얻었습니다. 이탈리아에서는 수확량이 많고 산도가 좋아 일상적인 식탁 와인으로 사랑받았으며, 프랑스에서는 그 높은 산도 덕분에 증류에 가장 적합한 품종으로 선택되어 오늘날 전 세계 브랜디 시장을 지탱하는 거대한 뿌리가 되었습니다.',
        classifications: [
            { name: 'Trebbiano Toscano', criteria: '이탈리아 표준', description: '토스카나 지역을 중심으로 생산되는 가볍고 산뜻한 데일리 화이트 와인' },
            { name: 'Ugni Blanc (Cognac)', criteria: '증류 등급', description: '코냑 생산의 90% 이상을 차지하는, 증류 후에도 산뜻함을 유지해주는 핵심 원료' },
            { name: 'Trebbiano d\'Abruzzo DOC', criteria: '프리미엄 산지', description: '아브루초 지역의 구릉지에서 생산되는, 보다 깊고 복합적인 미네랄을 지닌 상급 와인' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '10/10', description: '증류와 블렌딩에 필수적인 높고 날카로운 산미' },
            { label: '아로마 (Aroma)', metric: '화사함', value: '4/10', description: '레몬, 청사과, 그리고 은은한 들꽃의 중립적인 향기' },
            { label: '바디 (Body)', metric: '무게감', value: '3/10', description: '갈증을 해소해주는 가볍고 경쾌한 바디감' }
        ],
        flavorTags: [
            { label: '레몬', color: 'bg-yellow-50/20 text-yellow-600' },
            { label: '청사과', color: 'bg-green-50/20 text-green-600' },
            { label: '흰 꽃', color: 'bg-slate-50/20 text-slate-700' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '중립적 저온 발효', description: '특유의 높은 산도를 보존하기 위해 오크 숙성을 배제하고 스테인리스 탱크에서 발효합니다.' },
            { step: '증류 (브랜디)', name: '이중 증류', description: '코냑 제조 시 1차, 2차 증류를 거쳐 품종의 산미를 농축된 생명수(Eau-de-vie)로 바꿉니다.' }
        ],
        majorRegions: [
            { name: '토스카나 (Tuscany)', description: '이탈리아 식탁 와인의 핵심이자 트레비아노의 고향', emoji: '🇮🇹' },
            { name: '코냑 & 아르마냑', description: '세계 최고의 브랜디가 탄생하는 프랑스의 핵심 산지', emoji: '🇫🇷' },
            { name: '아브루초', description: '최근 가장 뛰어난 품질의 트레비아노 와인이 생산되는 곳', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준 화이트 와인 글라스 또는 튤립형 증류주 잔',
            optimalTemperatures: [
                { temp: '7-10°C', description: '차갑게 서빙하여 특유의 날카로운 산미와 청량감을 즐겨야 하는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['가벼운 파스타', '신선한 해산물 튀김', '숙성되지 않은 프레시 치즈', '해산물 샐러드']
    },
    sectionsEn: {
        definition: "Trebbiano, internationally known as 'Ugni Blanc' in France, is one of the most widely planted and significant white varieties on Earth. Noted for its high acidity and relatively neutral aromatic profile, it is less famous as a standalone varietal and more renowned as the indispensable base for the world's finest brandies, including Cognac and Armagnac. It is a highly practical grape that spans the spectrum from crisp, unpretentious table wines to the most prestigious distilled spirits.",
        history: "A variety of great antiquity cultivated across Italy since Roman times, it migrated to France in the middle ages where it adopted the name Ugni Blanc. While valued in Italy for its immense yields and refreshing acidity as a local staple, French distillers discovered its high acid was the perfect vehicle for distillation, leading it to become the massive backbone of the global premium brandy industry.",
        classifications: [
            { name: 'Trebbiano Toscano', criteria: 'Italian Standard', description: 'The light and zesty white wine consumed as a daily staple in Central Italy.' },
            { name: 'Ugni Blanc (Cognac)', criteria: 'Distillation Grade', description: 'The variety accounting for over 90% of Cognac production, essential for maintaining freshness during aging.' },
            { name: "Trebbiano d'Abruzzo DOC", criteria: 'Premium Terroir', description: 'Grown on the hills of Abruzzo to produce wines with surprising depth, texture, and mineral complexity.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '10/10', description: 'Hallmark high, sharp acidity essential for both distillation and blending.' },
            { label: 'Aroma', metric: 'Intensity', value: '4/10', description: 'Subtle and clean notes of lemon, green apple, and white orchard blossoms.' },
            { label: 'Body', metric: 'Weight', value: '3/10', description: 'Features a light, thirst-quenching, and linear physical presence.' }
        ],
        flavorTags: [
            { label: 'Lemon', color: 'bg-yellow-50/20 text-yellow-600' },
            { label: 'Green Apple', color: 'bg-green-50/20 text-green-600' },
            { label: 'White Flowers', color: 'bg-slate-50/20 text-slate-700' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Cool Stainless Steel Fermentation', description: 'Avoids oak contact to ensure the grape’s natural crispness and high acid are preserved for wine or spirit base.' },
            { step: 'Distillation', name: 'Double Distillation (Cognac)', description: 'Concentrates the grape’s high-acid juice into sophisticated and complex spirits with immense aging potential.' }
        ],
        majorRegions: [
            { name: 'Tuscany', description: 'The historic heartland where it produces the classic Italian table white.', emoji: '🇮🇹' },
            { name: 'Cognac & Armagnac', description: 'The world’s premier regions for luxury brandy production using Ugni Blanc.', emoji: '🇫🇷' },
            { name: 'Abruzzo', description: 'Famed for producing surprisingly high-quality and age-worthy still white wines.', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White Wine glass or Tulip-shaped spirit glass',
            optimalTemperatures: [
                { temp: '7–10°C', description: 'Best served well-chilled to emphasize its bracing acidity and clean finish.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Light pasta dishes', 'Fresh seafood fritto misto', 'Fresh cheeses like Ricotta or Mozzarella', 'Summer salads']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['트레비아노', 'trebbiano', '위니 블랑', 'ugni blanc', '코냑']
}
