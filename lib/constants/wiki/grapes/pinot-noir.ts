import { SpiritCategory } from '../types'

export const pinotNoir: SpiritCategory = {
        slug: 'pinot-noir',
        emoji: '🍂',
        nameKo: '피노 누아',
        nameEn: 'Pinot Noir',
        taglineKo: '와인의 성배, 섬세함과 우아함이 빚어낸 영원한 보랏빛 갈망',
        taglineEn: 'The Holy Grail of wine, the eternal purple longing crafted by delicacy and elegance',
        color: 'red',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '피노 누아(Pinot Noir)는 세계에서 가장 고귀하고 변덕스러운 레드 품종으로, 와인 애호가들에게는 "성배"와 같은 존재입니다. 옅은 루비색과 실크처럼 매끄러운 질감, 그리고 딸기, 라즈베리, 장미 꽃잎의 섬세한 향이 특징입니다. 재배가 매우 까다롭지만, 완벽한 테루아를 만났을 때 보여주는 필설로 다할 수 없는 복합미와 우아함은 그 어떤 품종도 흉내 낼 수 없는 깊이를 선사합니다.',
                history: '프랑스 부르브뉴(Burgundy)가 고향이며, 수천 년 전부터 이 지역에서 재배되어 온 가장 오래된 품종 중 하나입니다. 중세 시대 시토회 수사들에 의해 각 밭의 미세한 차이(테루아)가 기록되면서 부르브뉴 와인의 위대한 역사가 시작되었습니다. 오늘날 보르도의 카베르네 소비뇽과 함께 세계 와인 시장의 양대 산맥을 이루며, 그랑 크뤼(Grand Cru) 밭에서 탄생하는 피노 누아는 세계에서 가장 비싼 와인의 대명사가 되었습니다.',
                classifications: [
                        { name: 'Burgundy Grand Cru', criteria: '최고급 테루아', description: '부르브뉴 최고의 밭에서 탄생하는 압도적 깊이와 장기 숙성력의 피노 누아' },
                        { name: 'Blanc de Noirs', criteria: '샴페인 스타일', description: '흑포도인 피노 누아만 사용하여 만든 풍만하고 힘 있는 화이트 샴페인' },
                        { name: 'Cool Climate Varietal', criteria: '신대륙 스타일', description: '뉴질랜드, 오리건 등 서늘한 신대륙 지역에서 생산되는 과실미 중심의 우아한 스타일' }
                ],
                sensoryMetrics: [
                        { label: '타닌 (Tannins)', metric: '수렴성', value: '3/10', description: '매우 섬세하고 비단처럼 부드러운 입안의 미감' },
                        { label: '산도 (Acidity)', metric: '청량감', value: '8/10', description: '와인의 생동감과 우아한 골격을 지탱하는 높은 산미' },
                        { label: '바디 (Body)', metric: '무게감', value: '4/10', description: '투명하고 가볍지만 깊이 있는 라이트-미디엄 바디' }
                ],
                flavorTags: [
                        { label: '라즈베리', color: 'bg-red-200/20 text-red-600' },
                        { label: '장미 꽃잎', color: 'bg-pink-100/20 text-pink-700' },
                        { label: '흙 (Earthy)', color: 'bg-amber-900/20 text-amber-900' }
                ],
                manufacturingProcess: [
                        { step: '발효', name: '송이 발효 (Whole Bunch)', description: '복합미와 허브 뉘앙스, 그리고 구조감을 더하기 위해 때때로 줄기째 발효를 진행합니다.' },
                        { step: '숙성', name: '프렌치 오크 숙성', description: '섬세한 아로마를 해치지 않기 위해 새 오크통의 비율을 조절하며 정교하게 숙성합니다.' }
                ],
                majorRegions: [
                        { name: '부르브뉴 (Burgundy)', description: '피노 누아의 영적 고향이자 불멸의 성지', emoji: '🇫🇷' },
                        { name: '센트럴 오타고', description: '강렬한 색과 순수한 과실미를 뿜어내는 뉴질랜드의 명지', emoji: '🇳🇿' },
                        { name: '윌래멋 밸리 (Oregon)', description: '부르브뉴에 필적하는 섬세함을 보여주는 미국의 핵심 산지', emoji: '🇺🇸' }
                ],
                servingGuidelines: {
                        recommendedGlass: '볼이 아주 넓은 대형 부르브뉴 전용 글라스',
                        optimalTemperatures: [
                                { temp: '14-16°C', description: '섬세한 붉은 과실향과 꽃 향기가 가장 풍성하게 피어오르는 온도' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['구운 오리 요리', '연어 스테이크', '버섯 요리', '부드러운 연성 치즈(브리, 까망베르)']
        },
        sectionsEn: {
                definition: "Pinot Noir is the world's most noble and temperamental red grape variety, often referred to as the 'Holy Grail' for wine enthusiasts. It is characterized by its pale ruby color, silken texture, and a delicate bouquet of strawberry, raspberry, and rose petals. While notoriously difficult to cultivate, when it meets its perfect terroir, it achieves a level of complexity and elegance that is unsurpassed in the world of wine.",
                history: "A native of Burgundy, France, Pinot Noir is one of the oldest cultivated varieties, with roots stretching back thousands of years. It was the Cistercian monks of the Middle Ages who first meticulously mapped the subtle differences in terroir across Burgundy, laying the foundation for its legendary status. Today, alongside Cabernet Sauvignon, it defines the pinnacle of the global wine market, with Grand Cru Pinot Noirs representing some of the most expensive and sought-after liquids on earth.",
                classifications: [
                        { name: 'Burgundy Grand Cru', criteria: 'Premium Terroir', description: 'The absolute pinnacle of the variety, offering profound depth and decades of aging potential.' },
                        { name: 'Blanc de Noirs', criteria: 'Champagne style', description: 'A white Champagne made exclusively from red Pinot Noir grapes, known for its power and structure.' },
                        { name: 'Cool Climate Varietal', criteria: 'New World Style', description: 'Refined, fruit-forward expressions from premium cool-climate regions like New Zealand and Oregon.' }
                ],
                sensoryMetrics: [
                        { label: 'Tannins', metric: 'Astringency', value: '3/10', description: 'Incredibly fine-grained and silken on the palate.' },
                        { label: 'Acidity', metric: 'Crispness', value: '8/10', description: 'Vibrant and high, providing the essential backbone for its elegant structure.' },
                        { label: 'Body', metric: 'Weight', value: '4/10', description: 'Transparent and light-to-medium bodied, yet possessing immense flavor concentration.' }
                ],
                flavorTags: [
                        { label: 'Raspberry', color: 'bg-red-200/20 text-red-600' },
                        { label: 'Rose Petals', color: 'bg-pink-100/20 text-pink-700' },
                        { label: 'Earthy', color: 'bg-amber-900/20 text-amber-900' }
                ],
                manufacturingProcess: [
                        { step: 'Fermentation', name: 'Whole Bunch Fermentation', description: 'Sometimes used to introduce herbal complexity, additional structure, and aromatic lift.' },
                        { step: 'Aging', name: 'Fine French Oak Maturation', description: 'Carefully managed use of oak to enhance complexity without masking the variety’s delicate aromatics.' }
                ],
                majorRegions: [
                        { name: 'Burgundy', description: 'The spiritual and historical heartland for the finest Pinot Noir.', emoji: '🇫🇷' },
                        { name: 'Central Otago', description: 'New Zealand’s premium region known for intense, pure-fruited expressions.', emoji: '🇳🇿' },
                        { name: 'Willamette Valley', description: 'The premier US destination for Pinot Noir with an elegance that rivals Burgundy.', emoji: '🇺🇸' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Very wide-bowled Burgundy glass',
                        optimalTemperatures: [
                                { temp: '14–16°C', description: 'Ideal for allowing its delicate red fruit and floral aromatics to fully blossom.' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['Roasted duck', 'Seared salmon', 'Mushroom-based dishes', 'Soft cheeses (Brie, Camembert)']
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['피노 누아', 'pinot noir', '슈페트부르군더', 'spatburgunder']
}