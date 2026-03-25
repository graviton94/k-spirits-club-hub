import { SpiritCategory } from '../types'

export const aligote: SpiritCategory = {
        slug: 'aligote',
        emoji: '🍋',
        nameKo: '알리고테',
        nameEn: 'Aligoté',
        taglineKo: '부르고뉴의 또 다른 화이트, 생동감 넘치는 산미와 순수한 투명함',
        taglineEn: 'The other white of Burgundy, vibrant acidity and pure transparency',
        color: 'yellow',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '알리고테(Aligoté)는 부르고뉴의 "두 번째" 화이트 품종으로, 샤르도네의 그늘에 가려져 있었으나 최근 그 가치가 급격히 재조명받고 있습니다. 샤르도네보다 훨씬 높고 날카로운 산미와 가벼운 바디감, 그리고 미네랄 풍미가 특징이며, 생산자의 철학에 따라 가볍고 청량한 스타일부터 묵직한 오크 숙성 스타일까지 다양한 스펙트럼을 보여줍니다.',
                history: '18세기부터 부르고뉴에서 재배된 기록이 있으며, 유전적으로는 샤르도네와 마찬가지로 피노 누아와 구애 블랑(Gouais Blanc)의 교배종입니다. 과거에는 주로 "키르(Kir)" 칵테일의 베이스 와인으로 사용되거나 척박한 땅에서 자라는 범용 품종으로 여겨졌으나, 최근에는 부르고뉴 알리고테 AOC의 품질 향상과 부즈롱(Bouzeron) 지역의 성공으로 독립적인 고급 와인 품종으로 인정받고 있습니다.',
                classifications: [
                        { name: 'Bourgogne Aligoté AOC', criteria: '산지 범위', description: '부르고뉴 전역에서 생산되는 신선한 스타일' },
                        { name: 'Bouzeron AOC', criteria: '최고급 산지', description: '알리고테만을 위해 지정된 빌라쥬 등급의 고급 산지' }
                ],
                sensoryMetrics: [
                        { label: '산도 (Acidity)', metric: '산량', value: '9/10', description: '매우 높고 바삭한(Crisp) 산미' },
                        { label: '바디 (Body)', metric: '무게감', value: '3/10', description: '가볍고 직선적인 바디감' },
                        { label: '미네랄 (Minerality)', metric: '풍미 유형', value: 'High', description: '석회질 토양의 미네랄리티' }
                ],
                flavorTags: [
                        { label: '레몬', color: 'bg-yellow-100/20 text-yellow-700' },
                        { label: '청사과', color: 'bg-green-100/20 text-green-700' },
                        { label: '흰 꽃', color: 'bg-slate-100/20 text-slate-700' }
                ],
                manufacturingProcess: [
                        { step: '발효', name: '스테인리스 발효', description: '신선한 산도를 유지하기 위해 주로 스테인리스 스틸 탱크에서 발효합니다.' },
                        { step: '숙성', name: '리(Lee) 숙성', description: '가벼운 바디감에 질감을 더하기 위해 발효 후 효모 찌꺼기와 함께 숙성(Sur Lie) 과정을 거치기도 합니다.' }
                ],
                majorRegions: [
                        { name: '부즈롱 (Bouzeron)', description: '알리고테의 정점을 보여주는 꼬트 샬로네즈의 마을', emoji: '🇫🇷' },
                        { name: '부르고뉴 (Burgundy)', description: '주로 덜 유리한 경사면이나 평지에서 재배', emoji: '🇫🇷' }
                ],
                servingGuidelines: {
                        recommendedGlass: '화이트 와인 글라스',
                        optimalTemperatures: [
                                { temp: '8-10°C', description: '날카로운 산미와 미네랄리티를 즐기기 좋은 온도' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['굴 요리', '부르고뉴 달팽이(에스카르고)', '키슈'],
        },
        sectionsEn: {
                definition: "Aligoté is the 'other' white grape of Burgundy, often overshadowed by Chardonnay but lately enjoying a significant renaissance. Known for its sharp, vibrant acidity and lean body, it offers a distinct mineral edge. Depending on the winemaker's philosophy, styles range from light and refreshing to complex, oak-aged expressions.",
                history: "Cultivated in Burgundy since the 18th century, Aligoté is a cross between Pinot Noir and Gouais Blanc, similar to Chardonnay. Historically relegated to the simpler 'Kir' cocktails or planted in less favorable sites, it has recently earned independent prestige through the quality improvements in Bourgogne Aligoté AOC and the success of the Bouzeron appellation.",
                classifications: [
                        { name: 'Bourgogne Aligoté AOC', criteria: 'Regional Scope', description: 'A fresh and vibrant style produced throughout Burgundy.' },
                        { name: 'Bouzeron AOC', criteria: 'Premier Cru Level', description: 'A village-level appellation dedicated solely to premium Aligoté.' }
                ],
                sensoryMetrics: [
                        { label: 'Acidity', metric: 'Intensity', value: '9/10', description: 'Very high and crisp acidity.' },
                        { label: 'Body', metric: 'Weight', value: '3/10', description: 'Lean and linear mouthfeel.' },
                        { label: 'Minerality', metric: 'Profile', value: 'High', description: 'Steely minerality reflecting limestone soils.' }
                ],
                flavorTags: [
                        { label: 'Lemon', color: 'bg-yellow-100/20 text-yellow-700' },
                        { label: 'Green Apple', color: 'bg-green-100/20 text-green-700' },
                        { label: 'White Flowers', color: 'bg-slate-100/20 text-slate-700' }
                ],
                manufacturingProcess: [
                        { step: 'Fermentation', name: 'Stainless Steel Fermentation', description: 'Primarily fermented in stainless steel to preserve its bright acidity and fresh fruit character.' },
                        { step: 'Aging', name: 'Lees Aging', description: 'Often aged on the lees (Sur Lie) to add texture and depth to its light body.' }
                ],
                majorRegions: [
                        { name: 'Bouzeron', description: "The pinnacle of Aligoté production in the Côte Chalonnaise.", emoji: '🇫🇷' },
                        { name: 'Burgundy', description: 'Widely planted, often on slopes less suitable for Chardonnay.', emoji: '🇫🇷' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'White Wine Glass',
                        optimalTemperatures: [
                                { temp: '8-10°C', description: 'Best for emphasizing its crisp acidity and saline mineral notes.' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['Oysters', 'Escargot de Bourgogne', 'Quiche'],
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['알리고테', 'aligote']
}