import { SpiritCategory } from '../types'

export const mourvedre: SpiritCategory = {
        slug: 'mourvedre',
        emoji: '🐗',
        nameKo: '무르베드르',
        nameEn: 'Mourvèdre',
        taglineKo: '방돌의 야성, 강렬한 타닌과 고기 풍미가 빚어낸 묵직한 대작',
        taglineEn: 'The wildness of Bandol, a heavy masterpiece of intense tannins and meaty flavors',
        color: 'purple',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '무르베드르(Mourvèdre)는 지중해 연안의 뜨거운 태양을 머금고 자라는 가장 남성적이고 강인한 레드 품종입니다. 잉크처럼 진한 색상과 촘촘한 타닌, 그리고 가죽이나 야생 고기(Gamy)를 연상시키는 독특한 풍미가 특징이며, 풍부한 알코올과 함께 웅장한 구조감을 선사합니다. 남부 론의 GSM 블렌딩에서 깊이와 숙성력을 담당하는 핵심 축이자, 프랑스 방돌(Bandol) 지역 최고급 레드 와인의 주인공입니다.',
                history: '원래 스페인(모나스트렐)에서 유유히 건너온 품종으로, 프랑스 남부 프로방스와 론 계곡에 완벽히 정착했습니다. 19세기 필록세라 위기 이후 재배가 까다로워 한때 위기를 겪었으나, 방돌 지역의 생산자들이 이 품종의 위대함을 지켜내며 전 세계적으로 다시금 가치를 인정받게 되었습니다. 오늘날에는 뜨거운 기후에서도 산도와 구조를 잃지 않는 특성 덕분에 기후 변화 시대의 중요한 대안으로도 주목받고 있습니다.',
                classifications: [
                        { name: 'Bandol Rouge', criteria: '최고급 산지', description: '무르베드르 비중이 최소 50% 이상이며, 18개월 이상 오크 숙성되는 강력한 스타일' },
                        { name: 'Châteauneuf-du-Pape Blend', criteria: '블렌딩 역할', description: '그르나슈의 화사함에 무게감과 야생적인 복합미를 더해주는 역할' }
                ],
                sensoryMetrics: [
                        { label: '바디 (Body)', metric: '무게감', value: '10/10', description: '압도적인 밀도를 가진 최상급 풀 바디' },
                        { label: '타닌 (Tannins)', metric: '수렴성', value: '9/10', description: '강력하고 촘촘하여 장기 숙성을 지탱하는 근육질의 타닌' },
                        { label: '아로마 (Aroma)', metric: '복합미', value: 'High', description: '블랙베리, 가죽, 흙, 스모키한 야생의 향' }
                ],
                flavorTags: [
                        { label: '블랙베리', color: 'bg-purple-900/20 text-purple-900' },
                        { label: '가죽 (Leather)', color: 'bg-stone-600/20 text-stone-800' },
                        { label: '야생 고기', color: 'bg-red-950/20 text-red-950' }
                ],
                manufacturingProcess: [
                        { step: '포도 수확', name: '극도의 만숙', description: '타닌이 완벽하게 익을 때까지 기다려야 하므로 다른 품종보다 훨씬 늦게 수확합니다.' },
                        { step: '숙성', name: '큰 나무 오크통 (Foudres)', description: '품종 고유의 힘을 다듬고 복합미를 서서히 끌어내기 위해 주로 대형 오크통에서 장기 숙성합니다.' }
                ],
                majorRegions: [
                        { name: '방돌 (Bandol)', description: '무르베드르가 가장 품격 있고 위대하게 표현되는 세계 최고의 산지', emoji: '🇫🇷' },
                        { name: '남부 론 (Southern Rhône)', description: '전설적인 레드 블렌딩 와인을 완성하는 필수적인 성지', emoji: '🇫🇷' }
                ],
                servingGuidelines: {
                        recommendedGlass: '볼이 크고 깊은 대형 레드 와인 글라스',
                        optimalTemperatures: [
                                { temp: '16-18°C', description: '강한 타닌과 복합적인 야생 향이 고기 요리와 완벽하게 어우러지는 온도' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['스테이크 및 양갈비', '야생 멧돼지 요리', '진한 트러플 스테이크', '숙성된 하드 치즈']
        },
        sectionsEn: {
                definition: "Mourvèdre is the most masculine and resilient red grape variety, thriving under the intense Mediterranean sun. Characterized by its inky depth, dense tannin structure, and a unique 'gamy' profile reminiscent of leather and wild meats, it offers a monumental sensory experience. It serves as the structural pillar in Southern Rhône GSM blends and is the undisputed star of premium red wines from Bandol, France.",
                history: "Originally migrating from Spain (where it is known as Monastrell), Mourvèdre found its perfect home in the south of France. After facing a decline following the Phylloxera crisis due to its challenging cultivation, the dedicated producers of Bandol preserved its legacy. Today, it is increasingly valued globally for its ability to maintain acidity and structural integrity even in rising temperatures, making it a critical variety for the future.",
                classifications: [
                        { name: 'Bandol Rouge', criteria: 'Premium Appellation', description: 'Features at least 50% Mourvèdre and requires 18 months of oak aging for its characteristic power.' },
                        { name: 'Châteauneuf-du-Pape Blend', criteria: 'Blending Role', description: "Adds essential weight, color, and a wild complexity to Grenache's bright floral notes." }
                ],
                sensoryMetrics: [
                        { label: 'Body', metric: 'Weight', value: '10/10', description: 'An overwhelming, full-bodied presence with high density.' },
                        { label: 'Tannins', metric: 'Astringency', value: '9/10', description: 'Muscular, firm, and dense, providing the backbone for decades of aging.' },
                        { label: 'Aroma', metric: 'Complexity', value: 'High', description: 'Dominated by blackberry, leather, earth, and smoky, gamey nuances.' }
                ],
                flavorTags: [
                        { label: 'Blackberry', color: 'bg-purple-900/20 text-purple-900' },
                        { label: 'Leather', color: 'bg-stone-600/20 text-stone-800' },
                        { label: 'Wild Game', color: 'bg-red-950/20 text-red-950' }
                ],
                manufacturingProcess: [
                        { step: 'Harvesting', name: 'Extreme Late Ripening', description: 'Requires a significantly longer season than most varieties to ensure the physiological maturity of its tannins.' },
                        { step: 'Aging', name: 'Large Oak Foudres', description: 'Matured for extended periods in large oak vats to tame its power and introduce secondary aromatic layers.' }
                ],
                majorRegions: [
                        { name: 'Bandol', description: 'The premier global terroir where Mourvèdre achieves its most majestic form.', emoji: '🇫🇷' },
                        { name: 'Southern Rhône', description: 'Essential for producing the region’s most prestigious and long-lived red blends.', emoji: '🇫🇷' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Large, deep-bowled Red Wine glass',
                        optimalTemperatures: [
                                { temp: '16–18°C', description: 'The ideal range for its firm tannins and wild complexities to harmonize with cuisine.' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['Steak and lamb chops', 'Wild boar dishes', 'Truffle-infused venison', 'Aged hard cheeses']
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['무르베드르', 'mourvedre', '모나스트렐', 'monastrell']
}