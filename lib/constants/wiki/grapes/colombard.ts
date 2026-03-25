import { SpiritCategory } from '../types'

export const colombard: SpiritCategory = {
    slug: 'colombard',
    emoji: '🍏',
    nameKo: '콜롱바르',
    nameEn: 'Colombard',
    taglineKo: '프렌치 브랜디의 투명한 영혼, 생동감 넘치는 산미의 백색 선율',
    taglineEn: 'The transparent soul of French Brandy, a vibrant melody of white acidity',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '콜롱바르(Colombard)는 탁월한 산미와 풍부한 과즙을 지닌 화이트 품종으로, 전통적으로 프랑스의 코냑(Cognac)과 아르마냑(Armagnac) 증류를 위한 기초 와인으로 명성을 떨쳐왔습니다. 중성적이면서도 레몬과 청사과 같은 선명한 과실향을 제공하며, 신대륙에서는 이를 활용해 상쾌한 데일리 테이블 와인으로도 널리 생산합니다.',
        history: '프랑스 남서부 가스코뉴(Gascogne) 지역의 토착 품종으로, 슈냉 블랑(Chenin Blanc)과 구애 블랑(Gouais Blanc)의 자연 교배를 통해 탄생했습니다. 수 세기 동안 브랜디 증류를 위한 품질 표준 품종으로 자리를 지켜왔으며, 20세기 후반 캘리포니아와 남아공 등지에서 고유의 산뜻함을 살린 가성비 좋은 화이트 와인으로 큰 인기를 얻으며 재발견되었습니다.',
        classifications: [
            { name: 'Distillation Base', criteria: '용도별 분류', description: '브랜디의 아로마를 극대화하기 위해 산도를 높게 유지한 증류 전용 스타일' },
            { name: 'IGP Côtes de Gascogne', criteria: '산지 스타일', description: '신선하고 마시기 편한 스타일의 프랑스 테이블 화이트 와인' }
        ],
        sensoryMetrics: [
            { label: '산도 (Acidity)', metric: '청량감', value: '8/10', description: '매우 높고 바삭한 느낌의 산미' },
            { label: '바디 (Body)', metric: '무게감', value: '4/10', description: '가볍고 직선적인 구조' },
            { label: '향기 (Aroma)', metric: '강도', value: 'Medium', description: '시트러스와 청사과 중심의 아로마' }
        ],
        flavorTags: [
            { label: '레몬', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '청사과', color: 'bg-green-100/20 text-green-700' },
            { label: '패션프루트', color: 'bg-orange-100/20 text-orange-700' }
        ],
        manufacturingProcess: [
            { step: '수확', name: '조기 수확', description: '증류용 기초 와인을 만들 때는 높은 산도를 유지하기 위해 포도가 완전히 익기 전 조기에 수확합니다.' },
            { step: '발효', name: '산소 접촉 차단 발효', description: '산화되기 쉬운 품종 특성을 고려하여 스테인리스 탱크에서 공기 접촉을 최소화하며 발효합니다.' }
        ],
        majorRegions: [
            { name: '가스코뉴 (Gascogne)', description: '프랑스 콜롱바르의 핵심 산지이자 아르마냑의 고향', emoji: '🇫🇷' },
            { name: '센트럴 밸리 (Central Valley)', description: '캘리포니아의 대규모 콜롱바르 재배지', emoji: '🇺🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '7-10°C', description: '콜롱바르 특유의 상쾌한 산미가 가장 잘 느껴지는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['가벼운 해산물 찜', '신선한 염소 치즈', '동남아시아 스타일의 매콤한 요리']
    },
    sectionsEn: {
        definition: "Colombard is a white grape variety prized for its exceptional acidity and abundant juice. Historically, it earned its reputation as a major component for distilling French Cognac and Armagnac. It offers a neutral yet crisp profile featuring vibrant notes of lemon and green apple. In the New World, it is celebrated for producing refreshing, fruit-forward daily table wines.",
        history: "Native to the Gascogne region of Southwest France, Colombard is a natural cross between Chenin Blanc and Gouais Blanc. For centuries, it served as the quality benchmark for brandy base wines. In the late 20th century, it was rediscovered in regions like California and South Africa, gaining popularity as an affordable yet crisp white wine choice.",
        classifications: [
            { name: 'Distillation Base', criteria: 'By Usage', description: 'A style maintained with high acidity specifically to serve as a base for premium brandy.' },
            { name: 'IGP Côtes de Gascogne', criteria: 'Regional Style', description: 'Fresh, easy-drinking French table white wines from its spiritual home.' }
        ],
        sensoryMetrics: [
            { label: 'Acidity', metric: 'Crispness', value: '8/10', description: 'Very high and tart, providing a sharp backbone.' },
            { label: 'Body', metric: 'Weight', value: '4/10', description: 'Light and linear structural profile.' },
            { label: 'Aroma', metric: 'Intensity', value: 'Medium', description: 'Focused on citrus and green orchard fruit aromas.' }
        ],
        flavorTags: [
            { label: 'Lemon', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Green Apple', color: 'bg-green-100/20 text-green-700' },
            { label: 'Passion Fruit', color: 'bg-orange-100/20 text-orange-700' }
        ],
        manufacturingProcess: [
            { step: 'Harvesting', name: 'Early Harvest', description: 'To preserve high acidity for distillation, grapes are harvested early before full ripeness.' },
            { step: 'Fermentation', name: 'Reductive Fermentation', description: 'Conducted in stainless steel tanks to minimize oxygen contact and preserve delicate esters.' }
        ],
        majorRegions: [
            { name: 'Gascogne', description: 'The heart of French Colombard production and the home of Armagnac.', emoji: '🇫🇷' },
            { name: 'Central Valley', description: 'Large-scale plantings in California used for crisp, approachable white blends.', emoji: '🇺🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White Wine Glass',
            optimalTemperatures: [
                { temp: '7-10°C', description: 'The ideal range for highlighting its characteristically refreshing acidity.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Steamed seafood', 'Fresh goat cheese', 'Spicy Southeast Asian cuisine']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['콜롱바르', 'colombard']
}
