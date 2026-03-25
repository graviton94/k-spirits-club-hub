import { SpiritCategory } from '../types'

export const cheninBlanc: SpiritCategory = {
        slug: 'chenin-blanc',
        emoji: '🍯',
        nameKo: '슈냉 블랑',
        nameEn: 'Chenin Blanc',
        taglineKo: '다채로운 변신의 귀재, 드라이부터 스위트까지의 완벽한 스펙트럼',
        taglineEn: 'The master of versatility, from crisp driness to golden sweetness',
        color: 'yellow',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '슈냉 블랑(Chenin Blanc)은 화이트 와인 품종 중 가장 다재다능한 능력을 지닌 "천의 얼굴"입니다. 매우 높은 산미를 바탕으로 드라이한 화이트 와인은 물론, 크레망(스파클링), 그리고 꿀처럼 달콤한 귀부 와인에 이르기까지 모든 스타일을 완벽하게 소화합니다. 젖은 돌 같은 미네랄리티와 잘 익은 사과, 꿀, 그리고 모과향이 특징이며, 특히 숙성될수록 귀중한 황금빛으로 변하며 놀라운 복합미를 보여줍니다.',
                history: '프랑스 루아르 밸리(Loire Valley)에서 9세기경부터 재배된 것으로 알려진 고대 품종입니다. 루아르의 앙주(Anjou)와 투렌(Touraine) 지역에서 역사적인 명성을 쌓았으며, 17세기에는 남아프리카 공화국으로 전해져 "스틴(Steen)"이라는 이름으로 불리며 그곳의 국가 대표 품종으로 자리 잡았습니다. 현재는 루아르의 우아한 클래식함과 남아공의 현대적이고 풍부한 과실 스타일이 공존하며 전 세계 와인 매니아들의 찬사를 받고 있습니다.',
                classifications: [
                        { name: 'Sec / Dry', criteria: '당도', description: '날카로운 산미와 미네랄이 강조된 드라이 스타일' },
                        { name: 'Moelleux / Sweet', criteria: '당도', description: '귀부병(Noble Rot)의 영향을 받아 농축된 꿀 풍미를 가진 스위트 스타일' },
                        { name: 'Sparkling / Crémant', criteria: '양조 스타일', description: '루아르 특유의 높은 산미를 활용한 섬세한 기포의 스타일' }
                ],
                sensoryMetrics: [
                        { label: '산도 (Acidity)', metric: '산량', value: '10/10', description: '모든 화이트 품종 중 가장 높은 수준의 산미' },
                        { label: '바디 (Body)', metric: '무게감', value: '6/10', description: '가벼움부터 묵직함까지 폭넓은 스펙트럼' },
                        { label: '당도 (Sweetness)', metric: '잔당분', value: 'Variable', description: '드라이부터 초고농축 스위트까지 존재' }
                ],
                flavorTags: [
                        { label: '사과', color: 'bg-green-100/20 text-green-700' },
                        { label: '꿀', color: 'bg-yellow-200/20 text-yellow-800' },
                        { label: '모과', color: 'bg-amber-100/20 text-amber-800' }
                ],
                manufacturingProcess: [
                        { step: '선별', name: '단계적 수확 (Tries)', description: '귀부 와인을 만들 때, 완벽하게 농축된 포도송이만을 고르기 위해 여러 번 밭을 돌며 수확합니다.' },
                        { step: '발효', name: '다양한 발효 온도', description: '드라이 와인은 신선함을 위해 저온 발효를, 감미 와인은 복합미를 위해 좀 더 높은 온도에서 발효합니다.' }
                ],
                majorRegions: [
                        { name: '루아르 밸리 (Loire Valley)', description: '부브레(Vouvray) 등 세계 최고의 슈냉 블랑 산지', emoji: '🇫🇷' },
                        { name: '남아프리카 공화국 (South Africa)', description: '슈냉 블랑 재배 면적 세계 1위의 국가', emoji: '🇿🇦' }
                ],
                servingGuidelines: {
                        recommendedGlass: '튤립 모양의 화이트 와인 글라스',
                        optimalTemperatures: [
                                { temp: '8-10°C', description: '드라이 스타일의 신선함을 느낄 수 있는 온도' },
                                { temp: '10-12°C', description: '귀부 와인의 복합적인 꿀 향을 즐기기 좋은 온도' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['태국 또는 베트남식 매콤한 요리', '푸아그라(스위트)', '하드 치즈', '크림 소스 화이트 미트 요리'],
        },
        sectionsEn: {
                definition: "Chenin Blanc is the 'master of versatility' among white wine grapes, capable of producing an extraordinary spectrum of styles. With its naturally electric acidity as a foundation, it excels in everything from bone-dry whites and delicate sparkling Crémants to lusciously sweet, honeyed botrytis wines. It is defined by notes of wet stone minerality, ripe apple, honey, and queence, developing profound complexity and golden hues as it ages.",
                history: "A noble variety originating in the Loire Valley, France, it has been recorded since the 9th century. Having built its reputation in the historic appellations of Anjou and Touraine, it traveled to South Africa in the 17th century where it became known as 'Steen'. Today, Chenin Blanc finds its dual identity between the elegant, acidic classics of the Loire and the modern, fruit-driven expressions of South Africa, where it remains the most planted variety.",
                classifications: [
                        { name: 'Sec / Dry', criteria: 'Sugar Content', description: 'A style emphasizing sharp acidity and bracing minerality.' },
                        { name: 'Moelleux / Sweet', criteria: 'Sugar Content', description: 'A concentrated dessert style influenced by Noble Rot (Botrytis), featuring rich honey flavors.' },
                        { name: 'Sparkling / Crémant', criteria: 'Winemaking Style', description: 'Delicate bubbles utilizing the variety’s naturally high acidity for freshness.' }
                ],
                sensoryMetrics: [
                        { label: 'Acidity', metric: 'Intensity', value: '10/10', description: 'Among the highest acidity levels of any white grape.' },
                        { label: 'Body', metric: 'Weight', value: '6/10', description: 'A broad spectrum ranging from lean to viscous.' },
                        { label: 'Sweetness', metric: 'Residual Sugar', value: 'Variable', description: 'Exists in every form from bone-dry to intensely sweet.' }
                ],
                flavorTags: [
                        { label: 'Apple', color: 'bg-green-100/20 text-green-700' },
                        { label: 'Honey', color: 'bg-yellow-200/20 text-yellow-800' },
                        { label: 'Quince', color: 'bg-amber-100/20 text-amber-800' }
                ],
                manufacturingProcess: [
                        { step: 'Selection', name: 'Successive Harvests (Tries)', description: 'For sweet wines, pickers make multiple passes through the vineyard to select only the perfectly botrytized berries.' },
                        { step: 'Fermentation', name: 'Varied Temperatures', description: 'Fermented at low temperatures for dry styles to maintain freshness, and at warmer levels for sweet wines to enhance complexity.' }
                ],
                majorRegions: [
                        { name: 'Loire Valley', description: "The ancestral home, famous for prestigious areas like Vouvray.", emoji: '🇫🇷' },
                        { name: 'South Africa', description: "The world's largest producer of Chenin Blanc by planting area.", emoji: '🇿🇦' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Tulip-shaped White Wine Glass',
                        optimalTemperatures: [
                                { temp: '8–10°C', description: 'Ideal for experiencing the freshness of dry styles.' },
                                { temp: '10–12°C', description: 'Perfect for releasing the complex honeyed bouquet of sweet styles.' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['Spicy Thai or Vietnamese cuisine', 'Foie Gras (with sweet styles)', 'Hard cheeses', 'Creamy white meat dishes'],
        }
}