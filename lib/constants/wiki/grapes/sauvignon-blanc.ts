import { SpiritCategory } from '../types'

export const sauvignonBlanc: SpiritCategory = {
        slug: 'sauvignon-blanc',
        emoji: '🌿',
        nameKo: '소비뇽 블랑',
        nameEn: 'Sauvignon Blanc',
        taglineKo: '초록빛 신선함의 대명사, 코를 찌르는 아로마와 바삭한 산미의 유혹',
        taglineEn: 'The hallmark of green freshness, the temptation of piercing aroma and crisp acidity',
        color: 'yellow',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '소비뇽 블랑(Sauvignon Blanc)은 전 세계에서 가장 사랑받는 화이트 품종 중 하나로, 한 모금 마시는 순간 입안 가득 퍼지는 소름 돋는 신선함이 특징입니다. 잔을 채우는 강렬한 풀 내음, 갓 깎은 잔디, 라임, 발랄한 구스베리 향은 소비뇽 블랑만의 전매특허입니다. 매우 높은 산도와 가벼운 바디감을 지녀, 전 세계 어디에서나 갈증을 해소해 주는 최고의 에너자이저 같은 와인입니다.',
                history: '프랑스 루아르 밸리(Loire Valley)와 보르도(Bordeaux)가 고향이며, "야생(Sauvage)"이라는 프랑스어 어원처럼 강인한 생명력을 자랑합니다. 18세기에는 카베르네 프랑과 교배되어 레드 와인의 왕인 "카베르네 소비뇽"을 탄생시킨 어머니 품종이기도 합니다. 1980년대 뉴질랜드 말보로(Marlborough) 지역에서 혁신적인 스타일로 재탄생하며 전 세계적인 화이트 와인 붐을 일으켰습니다.',
                classifications: [
                        { name: 'Sancerre / Pouilly-Fumé', criteria: '프랑스 클래식', description: '루아르의 석회질/부싯돌 토양에서 오는 날카로운 미네랄과 우아한 산미의 정수' },
                        { name: 'Marlborough Sauvignon', criteria: '신대륙 스타일', description: '폭발적인 패션프루트와 자몽 향, 바삭한 산미가 돋보이는 뉴질랜드의 아이콘' },
                        { name: 'Fumé Blanc', criteria: '오크 숙성 스타일', description: '미국 나파 밸리 등에서 오크 숙성을 통해 질감을 부드럽게 다듬은 스타일' }
                ],
                sensoryMetrics: [
                        { label: '산도 (Acidity)', metric: '청량감', value: '10/10', description: '입안을 짜릿하게 자극하는 매우 높고 바삭한 산미' },
                        { label: '향기 (Aroma)', metric: '강도', value: '10/10', description: '누구나 즉시 알아챌 수 있는 강렬한 허브와 열대 과실 향' },
                        { label: '바디 (Body)', metric: '무게감', value: '3/10', description: '경쾌하고 직선적인 라이트-미디엄 바디' }
                ],
                flavorTags: [
                        { label: '갓 깎은 풀', color: 'bg-green-100/20 text-green-700' },
                        { label: '구스베리 / 패션프루트', color: 'bg-yellow-100/20 text-yellow-800' },
                        { label: '라임', color: 'bg-green-50/20 text-green-600' }
                ],
                manufacturingProcess: [
                        { step: '발효', name: '중립적 저온 발효', description: '특유의 신선한 아로마와 산미를 보존하기 위해 주로 스테인리스 탱크에서 차갑게 발효합니다.' },
                        { step: '오크 사용 자제', name: '순수성 유지', description: '대부분의 소비뇽 블랑은 품종 본연의 활기찬 과실향을 지키기 위해 오크 숙성을 하지 않습니다.' }
                ],
                majorRegions: [
                        { name: '말보로 (Marlborough)', description: '전 세계 소비뇽 블랑 유행의 중심이 된 뉴질랜드의 성지', emoji: '🇳🇿' },
                        { name: '루아르 밸리 (Loire)', description: '상세르와 퓌이 퓌메로 대표되는 고전적이고 우아한 산지', emoji: '🇫🇷' },
                        { name: '카사블랑카 밸리', description: '서늘한 해풍의 영향으로 고품질 소비뇽 블랑을 생산하는 칠레의 산지', emoji: '🇨🇱' }
                ],
                servingGuidelines: {
                        recommendedGlass: '입구가 약간 좁은 전형적인 화이트 와인 글라스',
                        optimalTemperatures: [
                                { temp: '7-10°C', description: '차갑게 서빙하여 특유의 바삭한 산미와 상쾌한 아로마를 극대화해야 하는 온도' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['염소 치즈(Chèvre)', '신선한 생선회(사시미)', '아스파라거스 요리', '각종 해산물 샐러드']
        },
        sectionsEn: {
                definition: "Sauvignon Blanc is one of the world's most recognizable and beloved white varieties, defined by an immediate and electrifying freshness. It is famously high-toned, offering a signature bouquet of freshly cut grass, lime zests, and exuberant gooseberry. With its piercing high acidity and light-to-medium body, it acts as the ultimate energizing white wine, universally cherished for its thirst-quenching vitality.",
                history: "Native to the Loire Valley and Bordeaux in France, the name derives from the French 'Sauvage' (wild), reflecting its vigorous and resilient nature. Historically significant as the mother variety that crossed with Cabernet Franc in the 18th century to create Cabernet Sauvignon. Its modern global explosion was sparked in the 1980s by the innovative, fruit-forward style pioneered in Marlborough, New Zealand.",
                classifications: [
                        { name: 'Sancerre / Pouilly-Fumé', criteria: 'French Classic', description: 'Pure expressions of flinty minerality and refined acidity from the limestone soils of the Loire.' },
                        { name: 'Marlborough Sauvignon', criteria: 'New World Style', description: 'An international icon known for explosive passion fruit, grapefruit, and crunchy acidity.' },
                        { name: 'Fumé Blanc', criteria: 'Oak-Aged Style', description: "A style popularized in Napa Valley using oak maturation to soften the variety’s edges and add texture." }
                ],
                sensoryMetrics: [
                        { label: 'Acidity', metric: 'Crispness', value: '10/10', description: 'Vibrant, high, and electric acidity that dances on the tongue.' },
                        { label: 'Aroma', metric: 'Intensity', value: '10/10', description: 'Overwhelmingly intense and instantly recognizable herbal and tropical bouquet.' },
                        { label: 'Body', metric: 'Weight', value: '3/10', description: 'Typically features a light, focused, and linear physical presence.' }
                ],
                flavorTags: [
                        { label: 'Fresh Cut Grass', color: 'bg-green-100/20 text-green-700' },
                        { label: 'Gooseberry / Passion Fruit', color: 'bg-yellow-100/20 text-yellow-800' },
                        { label: 'Lime', color: 'bg-green-50/20 text-green-600' }
                ],
                manufacturingProcess: [
                        { step: 'Fermentation', name: 'Cool Stainless Steel Fermentation', description: 'Conducted at low temperatures in neutral vessels to capture and protect its fleeting primary aromatics.' },
                        { step: 'Vessel Selection', name: 'Purity Focus', description: 'The vast majority avoid new oak maturation to maintain the variety’s hallmark zesty and grassy profile.' }
                ],
                majorRegions: [
                        { name: 'Marlborough', description: 'The global epicenter for the modern, fruit-driven Sauvignon Blanc revolution.', emoji: '🇳🇿' },
                        { name: 'Loire Valley', description: 'The ancestral source of the variety’s most elegant and mineral-focused wines.', emoji: '🇫🇷' },
                        { name: 'Casablanca Valley', description: 'Chile’s premier cool-climate region producing exceptionally crisp and clean expressions.', emoji: '🇨🇱' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Standard White Wine glass with a slightly tapered rim',
                        optimalTemperatures: [
                                { temp: '7–10°C', description: 'Best served well-chilled to emphasize its refreshing acidic structure and vibrant aromatics.' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['Goat cheese (Chèvre)', 'Fresh sashimi', 'Asparagus dishes', 'Seafood salads with citrus dressing']
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['소비뇽 블랑', 'sauvignon blanc', '상세르', 'sancerre']
}