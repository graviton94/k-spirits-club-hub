import { SpiritCategory } from '../types'

export const chardonnay: SpiritCategory = {
        slug: 'chardonnay',
        emoji: '🥂',
        nameKo: '샤르도네',
        nameEn: 'Chardonnay',
        taglineKo: '화이트 와인의 여왕, 테루아와 양조 기술을 그리는 투명한 캔버스',
        taglineEn: 'The Queen of Whites, a transparent canvas for terroir and technique',
        color: 'yellow',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '샤르도네(Chardonnay)는 전 세계에서 가장 사랑받는 화이트 와인 품종으로, 환경과 양조 방식에 따라 극적으로 변화하는 "팔색조" 같은 매력을 지니고 있습니다. 서늘한 지역에서는 청사과와 시트러스의 날카로운 산미를, 따뜻한 지역에서는 열대 과일과 버터 같은 묵직한 질감을 보여줍니다. 중성적인 성격 덕분에 양조가의 철학을 가장 잘 투영할 수 있는 품종으로 알려져 있으며, 세계 최고의 스파클링 와인인 샴페인의 핵심 원료이기도 합니다.',
                history: '프랑스 부르고뉴 지방에서 유래한 샤르도네는 피노 누아와 구애 블랑의 교배를 통해 탄생했습니다. 수 세기 동안 샤블리(Chablis)와 꼬트 드 보느(Côte de Beaune)에서 세계 최정상의 화이트 와인을 생산하며 그 위상을 공고히 했습니다. 20세기 후반 캘리포니아, 호주 등 신대륙으로 퍼져나가며 전 세계적인 유행(Anything But Chardonnay 운동이 일어날 정도의 대유행)을 선도했으며, 현재는 전 세계 와인 생산지 어디에서나 볼 수 있는 가장 성공적인 국제 품종이 되었습니다.',
                classifications: [
                        { name: 'Unoaked / Chablis Style', criteria: '양조 스타일', description: '오크를 쓰지 않아 날카로운 산미와 미네랄리티가 강조된 신선한 스타일' },
                        { name: 'Oaked / Burgundy Style', criteria: '양조 스타일', description: '오크 숙성과 젖산 발효를 통해 버터, 바닐라 풍미와 리치한 질감을 가진 스타일' },
                        { name: 'Blanc de Blancs', criteria: '샴페인/스파클링', description: '100% 샤르도네로만 만든 우아하고 섬세한 스파클링 와인 스타일' }
                ],
                sensoryMetrics: [
                        { label: '바디 (Body)', metric: '무게감', value: '7/10', description: '유연한 미디엄에서 묵직한 풀 바디' },
                        { label: '산도 (Acidity)', metric: '청량감', value: '7/10', description: '지역에 따라 변하는 균형 잡힌 산미' },
                        { label: '복합미 (Complexity)', metric: '풍합 강도', value: '9/10', description: '부드러운 버터향부터 강렬한 미네랄리티까지' }
                ],
                flavorTags: [
                        { label: '레몬', color: 'bg-yellow-100/20 text-yellow-700' },
                        { label: '바닐라', color: 'bg-orange-100/20 text-orange-800' },
                        { label: '버터', color: 'bg-amber-100/20 text-amber-800' }
                ],
                manufacturingProcess: [
                        { step: '발효', name: '젖산 발효 (MLF)', description: '날카로운 사과산을 부드러운 유산으로 바꾸어 크리미한 질감을 부여합니다.' },
                        { step: '숙성', name: '배럴 숙성 및 리 저음 (Batonnage)', description: '오크통에서 효모 찌꺼기를 저어주며 복합적인 견과류와 토스트 향을 입힙니다.' }
                ],
                majorRegions: [
                        { name: '부르고뉴 (Burgundy)', description: '샤르도네의 영원한 고향이자 품질의 기준점', emoji: '🇫🇷' },
                        { name: '나파 밸리 (Napa Valley)', description: '풍부하고 묵직한 오크 숙성 샤르도네의 대명사', emoji: '🇺🇸' },
                        { name: '샴페인 (Champagne)', description: '가장 우아하고 섬세한 스파클링의 근간', emoji: '🇫🇷' }
                ],
                servingGuidelines: {
                        recommendedGlass: '폭이 넓은 화이트 와인 또는 몽라셰 글라스',
                        optimalTemperatures: [
                                { temp: '10-12°C', description: '오크 숙성된 경우 약간 높게 서빙하여 풍성한 향을 만끽' },
                                { temp: '7-10°C', description: '샤블리 등 산뜻한 스타일의 경우 낮게 서빙' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['버터 스칼럽 구이', '크림 소스 파스타', '로스트 치킨', '연어 스테이크']
        },
        sectionsEn: {
                definition: "Chardonnay is the most beloved white wine grape in the world, often called a 'chameleon' due to its ability to dramatically change based on terroir and winemaking techniques. From the sharp citrus and mineral notes of cool regions to the ripe tropical fruit and buttery textures of warmer climates, it reflects the winemaker's philosophy unlike any other. It is also the essential component of the world's most prestigious sparkling wine, Champagne.",
                history: "Originating in Burgundy, France, Chardonnay is a cross between Pinot Noir and Gouais Blanc. For centuries, it has set the global standard for premium white wines in regions like Chablis and the Côte de Beaune. In the late 20th century, it exploded in popularity in the New World (USA, Australia), leading to the 'ABC' (Anything But Chardonnay) movement as a backlash to its ubiquity. Today, it remains the most successful and widely planted international white variety.",
                classifications: [
                        { name: 'Unoaked / Chablis Style', criteria: 'Winemaking Style', description: 'Focuses on crisp acidity and steel-like minerality without oak influence.' },
                        { name: 'Oaked / Burgundy Style', criteria: 'Winemaking Style', description: 'Features buttery, vanilla notes and a rich, creamy texture from barrel fermentation and MLF.' },
                        { name: 'Blanc de Blancs', criteria: 'Champagne Style', description: 'Elegant and delicate sparkling wine made entirely from 100% Chardonnay grapes.' }
                ],
                sensoryMetrics: [
                        { label: 'Body', metric: 'Weight', value: '7/10', description: 'Ranging from supple medium to weighty full body.' },
                        { label: 'Acidity', metric: 'Crispness', value: '7/10', description: 'Balanced acidity that varies according to region.' },
                        { label: 'Complexity', metric: 'Depth', value: '9/10', description: 'Varies from clean minerals to heavy buttery and toasty notes.' }
                ],
                flavorTags: [
                        { label: 'Lemon', color: 'bg-yellow-100/20 text-yellow-700' },
                        { label: 'Vanilla', color: 'bg-orange-100/20 text-orange-800' },
                        { label: 'Butter', color: 'bg-amber-100/20 text-amber-800' }
                ],
                manufacturingProcess: [
                        { step: 'Fermentation', name: 'Malolactic Fermentation (MLF)', description: 'Converts sharp malic acid into soft lactic acid, providing a creamy, rounded mouthfeel.' },
                        { step: 'Aging', name: 'Barrel Aging & Batonnage', description: 'Stirring the lees (yeast sediment) in the barrel to impart complex nutty and toasted flavors.' }
                ],
                majorRegions: [
                        { name: 'Burgundy', description: 'The historic homeland and global benchmark for Chardonnay quality.', emoji: '🇫🇷' },
                        { name: 'Napa Valley', description: 'Famous for rich, full-bodied, and oak-forward Chardonnay styles.', emoji: '🇺🇸' },
                        { name: 'Champagne', description: 'The foundation of the most elegant and sophisticated sparkling wines.', emoji: '🇫🇷' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Wide-bowled White Wine or Montrachet Glass',
                        optimalTemperatures: [
                                { temp: '10–12°C', description: 'Ideal for oaked styles to fully express rich, creamy bouquets.' },
                                { temp: '7–10°C', description: 'Preferred for fresh, unoaked styles like Chablis.' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['Buttered grilled scallops', 'Creamy pasta dishes', 'Roasted chicken', 'Grilled salmon']
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['샤르도네', 'chardonnay']
}