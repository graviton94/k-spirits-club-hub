import { SpiritCategory } from '../types'

export const pinotMeunier: SpiritCategory = {
    slug: 'pinot-meunier',
    emoji: '🥐',
    nameKo: '피노 뫼니에',
    nameEn: 'Pinot Meunier',
    taglineKo: '샴페인의 숨은 공신, 풍성한 과실향과 부드러운 포용력의 미학',
    taglineEn: 'The hidden contributor of Champagne, the aesthetics of rich fruitiness and soft embrace',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '피노 뫼니에(Pinot Meunier)는 샴페인을 만드는 3대 핵심 품종 중 하나로, 샴페인에 신선한 과일향과 풍만함, 그리고 즉각적인 접근성을 부여하는 품종입니다. "방앗간 주인(Miller)"이라는 뜻의 이름처럼 잎 뒷면에 하얀 가루를 뿌린 듯한 솜털이 달린 것이 특징입니다. 피노 누아보다 추위에 강하고 일찍 싹을 틔우며, 블렌딩에 부드러운 과실미의 뼈대를 제공합니다.',
        history: '피노 누아의 돌연변이 품종으로 여겨지며, 프랑스 샴페인 지역 중에서도 서늘하고 서리가 내리기 쉬운 발레 드 라 마른(Vallée de la Marne) 지역에서 오랫동안 왕좌를 지켜왔습니다. 과거에는 블렌딩용 품종으로만 치부되어 가려져 있었으나, 최근에는 뫼니에 고유의 신선함과 이국적인 아로마를 강조한 단품종(Blanc de Noirs) 샴페인들이 평론가들 사이에서 새롭게 각광받고 있습니다.',
        classifications: [
            { name: 'Champagne Blend Component', criteria: '주요 역할', description: '샴페인에 풍부한 신선함과 즉각적인 과실향을 더해주는 블렌딩의 조연' },
            { name: 'Blanc de Noirs (100% Meunier)', criteria: '희귀 스타일', description: '뫼니에만 사용하여 만든, 이국적이고 풍만한 풍미의 상급 샴페인' },
            { name: 'Still Red Meunier', criteria: '비발포성 레드', description: '루이르나 독일 등에서 생산되는 가볍고 향기로운 레드 와인' }
        ],
        sensoryMetrics: [
            { label: '과실향 (Fruitiness)', metric: '강도', value: '9/10', description: '폭발적인 붉은 과일과 이국적인 열대 과실의 향' },
            { label: '산도 (Acidity)', metric: '청량감', value: '7/10', description: '샴페인의 골격을 형성하는 충분한 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '5/10', description: '부드럽고 둥글게 감싸주는 중간 정도의 바디감' }
        ],
        flavorTags: [
            { label: '라즈베리', color: 'bg-red-200/20 text-red-600' },
            { label: '구운 빵', color: 'bg-amber-100/20 text-amber-700' },
            { label: '살구', color: 'bg-orange-50/20 text-orange-600' }
        ],
        manufacturingProcess: [
            { step: '재배', name: '서리 방지 재배', description: '추위에 강한 특성을 살려 샴페인 지역의 가장 서늘한 계곡가에서 주로 재배합니다.' },
            { step: '발효', name: '전통 방식 2차 발효', description: '샴페인 제조 공법에 따라 병 안에서 효모와 함께 발효하여 복합적인 풍미를 얻습니다.' }
        ],
        majorRegions: [
            { name: '발레 드 라 마른', description: '전 세계 피노 뫼니에 생산의 진정한 성지', emoji: '🇫🇷' },
            { name: '무르-라-마른 (Meunier Village)', description: '고품질 뫼니에 생산지로 손꼽히는 샴페인의 핵심 지역', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: '튤립 모양의 샴페인 글라스 또는 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '8-10°C', description: '뫼니에 특유의 풍성한 과실향과 부드러운 기포가 가장 잘 조화되는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['가벼운 카나페', '훈제 연어', '크림 소스 버섯 요리', '과일 타르트']
    },
    sectionsEn: {
        definition: "Pinot Meunier is one of the three cornerstone grape varieties of Champagne, prized for its ability to infuse the blend with fresh fruitiness, roundness, and immediate approachability. Its name, meaning 'Miller,' refers to the flour-like white down on the undersides of its leaves. Hardier than Pinot Noir and better at resisting spring frosts, it provides a succulent, fruit-forward skeletal framework to most Champagne compositions.",
        history: "Considered a genetic mutation of Pinot Noir, Pinot Meunier has historically dominated the frost-prone Vallée de la Marne within the Champagne region. While long overshadowed as a workhorse blending grape, it has recently moved into the limelight. Modern artisan producers are increasingly creating single-varietal (Blanc de Noirs) Meunier Champagnes that are celebrated for their exotic aromas and rich, accessible character.",
        classifications: [
            { name: 'Champagne Blend Component', criteria: 'Primary Role', description: 'Imparts exuberant freshness and immediate fruit intensity to iconic sparkling blends.' },
            { name: 'Blanc de Noirs (100% Meunier)', criteria: 'Rare Style', description: 'Prestigious grower Champagnes that highlight the variety’s specific exotic and plush profile.' },
            { name: 'Still Red Meunier', criteria: 'Red Style', description: 'Light, aromatic, and refreshing still red wines produced in small quantities in Loire or Germany.' }
        ],
        sensoryMetrics: [
            { label: 'Fruitiness', metric: 'Intensity', value: '9/10', description: 'Boasts an explosion of red berries and hints of exotic tropical fruits.' },
            { label: 'Acidity', metric: 'Structure', value: '7/10', description: 'Providing the essential crispness required for top-tier sparkling wine.' },
            { label: 'Body', metric: 'Weight', value: '5/10', description: 'Offers a soft, rounded, and welcoming presence on the palate.' }
        ],
        flavorTags: [
            { label: 'Raspberry', color: 'bg-red-200/20 text-red-600' },
            { label: 'Baked Bread', color: 'bg-amber-100/20 text-amber-700' },
            { label: 'Apricot', color: 'bg-orange-50/20 text-orange-600' }
        ],
        manufacturingProcess: [
            { step: 'Viticulture', name: 'Frost-Resistant Farming', description: 'Strategically planted in the coolest valley bottoms where it thrives despite challenging weather conditions.' },
            { step: 'Fermentation', name: 'Méthode Traditionnelle', description: 'Undergoes secondary fermentation in the bottle on lees to gain depth and autolytic complexity.' }
        ],
        majorRegions: [
            { name: 'Vallée de la Marne', description: 'The undisputed global heartland for high-quality Pinot Meunier production.', emoji: '🇫🇷' },
            { name: 'Champagne (General)', description: 'Widely planted across the region as a vital component of the world’s most famous sparkling wine.', emoji: '🇫🇷' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Tulip-style Champagne or White Wine glass',
            optimalTemperatures: [
                { temp: '8–10°C', description: 'The ideal range for enjoying its exuberant fruit profile and refined bubbles.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Light canapés', 'Smoked salmon', 'Creamy mushroom dishes', 'Fruit tarts']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['피노 뫼니에', 'pinot meunier']
}
