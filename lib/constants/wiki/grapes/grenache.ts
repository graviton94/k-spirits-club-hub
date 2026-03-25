import { SpiritCategory } from '../types'

export const grenache: SpiritCategory = {
        slug: 'grenache',
        emoji: '🔥',
        nameKo: '그르나슈',
        nameEn: 'Grenache',
        taglineKo: '뜨거운 태양의 노래, 지중해를 사로잡은 달콤하고 풍만한 과실향',
        taglineEn: 'The song of the hot sun, the sweet and voluptuous fruit capturing the Mediterranean',
        color: 'red',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '그르나슈(Grenache, 스페인명 Garnacha)는 따뜻한 기후를 사랑하는 전 세계에서 가장 널리 재배되는 레드 품종 중 하나입니다. 껍질이 얇아 타닌은 부드럽지만 알코올 잠재력이 높고, 잘 익은 딸기, 라즈베리, 그리고 화사한 허브와 백후추의 풍미가 입안을 가득 채웁니다. 단독으로도 훌륭하지만, 시라나 무르베드르와 섞여 강력한 구조감을 보완하는 "블렌딩의 마스터"로도 유명합니다.',
                history: '스페인 아라곤(Aragón) 지역이 고향인 것으로 알려져 있으며, 수 세기에 걸쳐 지중해를 따라 프랑스 남부 전역으로 퍼져나갔습니다. 척박하고 건조한 환경에서도 잘 자라는 강인한 생명력 덕분에 론(Rhône) 계곡의 황제인 "샤토네프 뒤 파프"의 핵심 품종으로 자리 잡았으며, 오늘날 호주(McLaren Vale)와 미국에서도 뜨거운 사랑을 받고 있습니다.',
                classifications: [
                        { name: 'Southern Rhône GSM', criteria: '블렌딩 스타일', description: '그르나슈를 중심으로 시라, 무르베드르를 섞어 만드는 풍만하고 복합적인 스타일' },
                        { name: 'Vins Doux Naturels', criteria: '강화 와인', description: '바뉼스(Banyuls) 등에서 생산되는 그르나슈 기반의 달콤한 주정 강화 와인' },
                        { name: 'Old Vine Grenache', criteria: '나무 수령', description: '오래된 나무에서 생산되어 극도로 농축된 과실미와 깊이를 지닌 스타일' }
                ],
                sensoryMetrics: [
                        { label: '바디 (Body)', metric: '무게감', value: '8/10', description: '부드러우면서도 풍만하고 묵직한 바디' },
                        { label: '산도 (Acidity)', metric: '청량감', value: '4/10', description: '온화하고 부드러운 산미' },
                        { label: '알코올 (Alcohol)', metric: '강도', value: '9/10', description: '높은 당도에서 오는 풍부한 알코올감' }
                ],
                flavorTags: [
                        { label: '라즈베리', color: 'bg-red-200/20 text-red-600' },
                        { label: '말린 허브', color: 'bg-green-100/20 text-green-700' },
                        { label: '백후추', color: 'bg-stone-200/20 text-stone-700' }
                ],
                manufacturingProcess: [
                        { step: '발효', name: '고온 발효', description: '강렬한 아로마를 추출하기 위해 상대적으로 높은 온도에서 발효하기도 합니다.' },
                        { step: '숙성', name: '중립적 숙성', description: '섬세한 붉은 과실향을 가리지 않기 위해 새 오크통보다는 큰 콘크리트 탱크나 중고 오크통을 선호합니다.' }
                ],
                majorRegions: [
                        { name: '남부 론 (Southern Rhône)', description: '그르나슈의 가장 위대한 표현이 이루어지는 곳', emoji: '🇫🇷' },
                        { name: '프리오라트 (Priorat)', description: '스페인의 척박한 점판암 토양에서 탄생하는 가장 농축된 가르나차', emoji: '🇪🇸' },
                        { name: '맥라렌 베일 (McLaren Vale)', description: '호주의 뜨거운 태양 아래 완성되는 리치한 스타일', emoji: '🇦🇺' }
                ],
                servingGuidelines: {
                        recommendedGlass: '볼이 넓은 레드 와인 글라스',
                        optimalTemperatures: [
                                { temp: '16-18°C', description: '풍부한 과실향과 알코올이 잘 조화되는 온도' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['바비큐 요리', '허브를 곁들인 양고기 구이', '매콤한 스튜', '숙성된 치즈']
        },
        sectionsEn: {
                definition: "Grenache (known as Garnacha in Spain) is one of the most widely planted red grape varieties in the world, flourishing in warm climates. Characterized by thin skins and soft tannins, it boasts high alcohol potential and a palate bursting with ripe strawberry, raspberry, bright herbs, and white pepper. While it produces stunning single-varietal wines, it is world-renowned as a 'Master of Blending,' particularly in GSM (Grenache-Syrah-Mourvèdre) compositions.",
                history: "Originally from the Aragón region of Spain, Grenache migrated along the Mediterranean coast to Southern France over centuries. Its resilience in poor, dry soils made it the cornerstone of the Southern Rhône, particularly the legendary Châteauneuf-du-Pape. Today, it continues to enjoy a global following, with exceptional old-vine expressions in Australia’s McLaren Vale and across California.",
                classifications: [
                        { name: 'Southern Rhône GSM', criteria: 'Blending Style', description: 'A plush and complex style where Grenache provides the fruity core, supported by Syrah and Mourvèdre.' },
                        { name: 'Vins Doux Naturels', criteria: 'Fortified Wine', description: 'Sweet, fortified wines like Banyuls made from naturally concentrated Grenache grapes.' },
                        { name: 'Old Vine Grenache', criteria: 'Vine Age', description: 'Produced from historic, low-yielding vines to achieve extreme concentration and depth.' }
                ],
                sensoryMetrics: [
                        { label: 'Body', metric: 'Weight', value: '8/10', description: 'Plush, voluptuous, and full-bodied on the palate.' },
                        { label: 'Acidity', metric: 'Crispness', value: '4/10', description: 'Soft and moderate acidity that rounds out the texture.' },
                        { label: 'Alcohol', metric: 'Potency', value: '9/10', description: 'High alcohol potential derived from its ability to accumulate sugar.' }
                ],
                flavorTags: [
                        { label: 'Raspberry', color: 'bg-red-200/20 text-red-600' },
                        { label: 'Dried Herbs', color: 'bg-green-100/20 text-green-700' },
                        { label: 'White Pepper', color: 'bg-stone-200/20 text-stone-700' }
                ],
                manufacturingProcess: [
                        { step: 'Fermentation', name: 'High-Temperature Fermentation', description: 'Sometimes fermented at higher temperatures to fully extract its characteristic intense aromatics.' },
                        { step: 'Aging', name: 'Neutral Aging', description: 'Winemakers often prefer concrete vats or old oak to preserve the delicate red fruit profiles from excessive wood influence.' }
                ],
                majorRegions: [
                        { name: 'Southern Rhône', description: 'The absolute benchmark for the most prestigious Grenache-based blends.', emoji: '🇫🇷' },
                        { name: 'Priorat', description: 'Yields concentrated Garnacha from the rugged llicorella slate soils of Spain.', emoji: '🇪🇸' },
                        { name: 'McLaren Vale', description: 'A key Australian region known for rich and velvety old-vine expressions.', emoji: '🇦🇺' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Large-bowled Red Wine Glass',
                        optimalTemperatures: [
                                { temp: '16–18°C', description: 'The ideal range to balance its rich fruit with high alcohol content.' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['BBQ dishes', 'Herb-roasted lamb', 'Hearty spicy stews', 'Aged cheeses']
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['그르나슈', 'grenache', '가르나차', 'garnacha']
}