import { SpiritCategory } from '../types'

export const tempranillo: SpiritCategory = {
        slug: 'tempranillo',
        emoji: '🏰',
        nameKo: '템프라니요',
        nameEn: 'Tempranillo',
        taglineKo: '스페인의 열정, 벨벳 같은 타닌과 잘 익은 가죽의 고전미',
        taglineEn: 'The passion of Spain, the classical beauty of velvety tannins and aged leather',
        color: 'red',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '템프라니요(Tempranillo)는 스페인을 상징하는 가장 위대한 레드 품종입니다. "일찍(Temprano)"이라는 어원에서 알 수 있듯이 다른 품종보다 빨리 익어 우아한 산도와 부드러운 타닌을 축적합니다. 진한 루비색과 함께 신선한 딸기 향부터 숙성된 가죽, 담배, 그리고 바닐라의 복합적인 아로마를 선사하는, 스페인 와인의 심장과도 같은 존재입니다.',
                history: '이베리아 반도에서 수천 년 전부터 재배되어 온 것으로 추정되는 유서 깊은 품종입니다. 특히 리오하(Rioja)와 리베라 델 두에로(Ribera del Duero) 지역에서 오크 숙성 시스템과 함께 발전하며 세계적인 명성을 얻었습니다. 스페인의 왕들을 위한 와인으로 사랑받아 왔으며, 오늘날에는 포르투갈(Tinta Roriz), 아르헨티나 등 전 세계에서 스페인의 품격을 전파하고 있습니다.',
                classifications: [
                        { name: 'Rioja Gran Reserva', criteria: '최고급 숙성', description: '최소 5년 이상의 숙성을 거쳐 바닐라와 가죽 풍미가 극대화된 리오하의 정점' },
                        { name: 'Ribera del Duero', criteria: '산지 스타일', description: '더욱 묵직한 구조감과 진한 색상, 검은 과실향을 지닌 파워풀한 템프라니요' },
                        { name: 'Joven / Crianza', criteria: '신선한 스타일', description: '과실 본연의 활기찬 매력을 강조하여 일찍 마시기 좋은 스타일' }
                ],
                sensoryMetrics: [
                        { label: '타닌 (Tannins)', metric: '수렴성', value: '7/10', description: '부드럽지만 힘이 느껴지는 우아한 벨벳 질감' },
                        { label: '산도 (Acidity)', metric: '청량감', value: '6/10', description: '음식과 조화를 이루는 안정적이고 부드러운 산미' },
                        { label: '바디 (Body)', metric: '무게감', value: '8/10', description: '입안을 기분 좋게 채워주는 미디엄-풀 바디' }
                ],
                flavorTags: [
                        { label: '말린 딸기', color: 'bg-red-200/20 text-red-700' },
                        { label: '가죽 / 담배', color: 'bg-amber-900/20 text-amber-900' },
                        { label: '바닐라 / 코코넛', color: 'bg-yellow-100/20 text-yellow-800' }
                ],
                manufacturingProcess: [
                        { step: '발효', name: '중단기 침출', description: '과도한 떫은맛을 피하면서도 깊은 색과 풍미를 얻기 위해 세밀하게 침출 시간을 조절합니다.' },
                        { step: '숙성', name: '아메리칸/프렌치 오크 숙성', description: '스페인 전통에 따라 오크통에서 수년간 숙성하며 특유의 부드러움과 복합미를 완성합니다.' }
                ],
                majorRegions: [
                        { name: '리오하 (Rioja)', description: '전 세계 템프라니요의 영적 고향이자 가장 클래식한 산지', emoji: '🇪🇸' },
                        { name: '리베라 델 두에로', description: '해발 고도가 높아 더욱 농축되고 힘 있는 템프라니요의 성지', emoji: '🇪🇸' },
                        { name: '토로 (Toro)', description: '강건하고 잉크처럼 진한 템프라니요가 탄생하는 곳', emoji: '🇪🇸' }
                ],
                servingGuidelines: {
                        recommendedGlass: '볼이 풍부한 표준 레드 와인 글라스',
                        optimalTemperatures: [
                                { temp: '16-18°C', description: '오크 숙성에서 오는 다채로운 풍미와 타닌이 가장 우아하게 조화되는 온도' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['구운 양고기', '이베리코 하몽', '각종 타파스 요리', '풍미가 강한 만체고 치즈']
        },
        sectionsEn: {
                definition: "Tempranillo is the undisputed sovereign of Spanish red grapes, representing the ultimate expression of the country's winemaking passion. Its name, derived from 'Temprano' (early), reflects its tendency to ripen ahead of other varieties, allowing it to accumulate elegant acidity and supple tannins. Offering a storied bouquet ranging from fresh strawberries to aged leather, tobacco, and vanilla, it is the beating heart of Spanish wine culture.",
                history: "A variety of profound antiquity, believed to have been cultivated on the Iberian Peninsula for millennia. It rose to global prominence through its association with the meticulous oak-aging systems of Rioja and Ribera del Duero. Once known as the 'Wine of Kings,' it now flourishes globally, including in Portugal (as Tinta Roriz) and Argentina, carrying the torch of Spanish winemaking prestige.",
                classifications: [
                        { name: 'Rioja Gran Reserva', criteria: 'Premium Aging', description: 'The absolute pinnacle of the variety, aged for at least five years to achieve maximal complexity and leather notes.' },
                        { name: 'Ribera del Duero', criteria: 'Regional Style', description: 'Distinguished by a heavier structure, darker pigment, and intense black fruit concentration.' },
                        { name: 'Joven / Crianza', criteria: 'Fresh Style', description: 'Accessible and vibrant expressions focusing on the grape’s primary fruit character for immediate enjoyment.' }
                ],
                sensoryMetrics: [
                        { label: 'Tannins', metric: 'Astringency', value: '7/10', description: 'Powerful yet remarkably smooth, offering an elegant velvety mouthfeel.' },
                        { label: 'Acidity', metric: 'Crispness', value: '6/10', description: 'Stable and well-integrated, making it a peerless companion for cuisine.' },
                        { label: 'Body', metric: 'Weight', value: '8/10', description: 'Features a substantial and satisfying medium-to-full bodily presence.' }
                ],
                flavorTags: [
                        { label: 'Dried Strawberry', color: 'bg-red-200/20 text-red-700' },
                        { label: 'Leather / Tobacco', color: 'bg-amber-900/20 text-amber-900' },
                        { label: 'Vanilla / Coconut', color: 'bg-yellow-100/20 text-yellow-800' }
                ],
                manufacturingProcess: [
                        { step: 'Fermentation', name: 'Precision Maceration', description: 'Techniques are focused on extracting deep color and complex aromatics while avoiding harsh seed tannins.' },
                        { step: 'Aging', name: 'Oak Maturation', description: 'A cornerstone of Spanish identity, requiring years in American or French oak to achieve hallmark roundness.' }
                ],
                majorRegions: [
                        { name: 'Rioja', description: 'The historic and spiritual heartland for the world’s most classic Tempranillo.', emoji: '🇪🇸' },
                        { name: 'Ribera del Duero', description: 'High-altitude vineyards producing powerful, dense, and structured expressions.', emoji: '🇪🇸' },
                        { name: 'Toro', description: 'Famous for producing robust, inky, and heavily concentrated Tempranillo.', emoji: '🇪🇸' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Standard Red Wine glass with a generous bowl',
                        optimalTemperatures: [
                                { temp: '16–18°C', description: 'The ideal range for the marriage of oak-derived complexities and fine-grained tannins.' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['Roasted lamb', 'Ibérico Jamón', 'Classic tapas', 'Aged Manchego cheese']
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['템프라니요', 'tempranillo', '리오하', 'rioja', '리베라 델 두에로']
}