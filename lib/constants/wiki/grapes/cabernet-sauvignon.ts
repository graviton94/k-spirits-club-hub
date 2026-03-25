import { SpiritCategory } from '../types'

export const cabernetSauvignon: SpiritCategory = {
        slug: 'cabernet-sauvignon',
        emoji: '👑',
        nameKo: '카베르네 소비뇽',
        nameEn: 'Cabernet Sauvignon',
        taglineKo: '레드 와인의 제왕, 견고한 구조감과 압도적인 장기 숙성력',
        taglineEn: 'The King of Reds, solid structure and overwhelming aging potential',
        color: 'red',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '카베르네 소비뇽(Cabernet Sauvignon)은 전 세계 와인 시장을 지배하는 명실상부한 "레드 와인의 제왕"입니다. 두꺼운 껍질에서 비롯된 짙은 색상, 강력한 바디감, 그리고 높은 타닌과 산도의 완벽한 조화가 특징입니다. 블랙커런트(Cassis)와 삼나무(Cedar), 그리고 민트의 시원한 풍미가 뚜렷하게 느껴지며, 특히 오크 숙성을 통해 완성되는 복합미와 수십 년에 달하는 장기 숙성 잠재력은 이 품종을 세계 최고로 만들었습니다.',
                history: '17세기 프랑스 보르도에서 카베르네 프랑(Cabernet Franc)과 소비뇽 블랑(Sauvignon Blanc)의 우연한 교배를 통해 탄생한 것으로 알려져 있습니다. 19세기 메도크(Médoc) 지역의 등급 분류 제정 이후 보르도 좌안(Left Bank)의 핵심 품종으로 자리 잡았으며, 1976년 "파리의 심판"을 통해 미국 나파 밸리의 카베르네 소비뇽이 세계를 놀라게 하며 그 위상을 더욱 공고히 했습니다. 현재는 위도와 경도를 가리지 않고 전 세계 모든 프리미엄 와인 생산지의 중심을 차지하고 있습니다.',
                classifications: [
                        { name: 'Bordeaux Left Bank Style', criteria: '산지 스타일', description: '메를로 등과 블렌딩되어 강력한 구조와 우아함을 동시에 지닌 스타일' },
                        { name: 'Napa Valley Style', criteria: '산지 스타일', description: '풍부한 일조량으로 잘 익은 과실향과 부드러운 타닌, 묵직한 바디를 지닌 스타일' },
                        { name: 'Coonawarra Style', criteria: '특수 테루아', description: '호주의 테라 로사 토양에서 생산되는 민트와 유칼립투스 향이 강한 스타일' }
                ],
                sensoryMetrics: [
                        { label: '타닌 (Tannins)', metric: '수렴성', value: '10/10', description: '매우 견고하고 촘촘한 타닌' },
                        { label: '바디 (Body)', metric: '무게감', value: '10/10', description: '압도적인 묵직함의 풀 바디' },
                        { label: '산도 (Acidity)', metric: '청량감', value: '8/10', description: '장기 숙성을 뒷받침하는 높은 산미' }
                ],
                flavorTags: [
                        { label: '블랙커런트', color: 'bg-purple-900/20 text-purple-950' },
                        { label: '삼나무', color: 'bg-amber-900/20 text-amber-950' },
                        { label: '바닐라', color: 'bg-yellow-50/20 text-yellow-800' }
                ],
                manufacturingProcess: [
                        { step: '발효', name: '고온 발효', description: '타닌과 색상을 충분히 추출하기 위해 28-30°C의 비교적 높은 온도에서 발효를 진행합니다.' },
                        { step: '숙성', name: '새 프랑스 오크 숙성', description: '강력한 품종의 특성을 조화롭게 하기 위해 12-24개월 동안 새 오크통에서 천천히 숙성시키며 복합미를 부여합니다.' }
                ],
                majorRegions: [
                        { name: '보르도 메도크 (Médoc)', description: '카베르네 소비뇽의 영원한 고향이자 기준점', emoji: '🇫🇷' },
                        { name: '나파 밸리 (Napa Valley)', description: '신대륙 카베르네 소비뇽의 정점', emoji: '🇺🇸' },
                        { name: '쿠나와라 (Coonawarra)', description: '호주를 대표하는 고품질 레드 와인 생산지', emoji: '🇦🇺' }
                ],
                servingGuidelines: {
                        recommendedGlass: '폭이 넓고 큰 보르도 스타일 레드 와인 글라스',
                        optimalTemperatures: [
                                { temp: '16-18°C', description: '촘촘한 타닌이 부드럽게 풀리며 본연의 깊은 향이 발산되는 온도' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['숯불에 구운 안심 스테이크', '양갈비 구이', '숙성된 체다 치즈'],
        },
        sectionsEn: {
                definition: "Cabernet Sauvignon is the uncontested 'King of Reds,' dominating the global wine market. It is recognized for its deep color derived from thick skins, powerful full body, and an impeccable balance of high tannins and acidity. With signature aromas of blackcurrant (cassis), cedar, and cooling mint, it is celebrated for the immense complexity it gains through oak aging and its overwhelming potential for aging over several decades.",
                history: "Born in 17th-century Bordeaux from an accidental cross between Cabernet Franc and Sauvignon Blanc, it became the star of the Médoc region following the 1855 classification. Its status was globally solidified during the 1976 'Judgment of Paris,' where Napa Valley Cabernet Sauvignon triumphed over top French estates. Today, it is cultivated at the center of every premium wine region across the globe.",
                classifications: [
                        { name: 'Bordeaux Left Bank Style', criteria: 'Regional Style', description: 'Often blended with Merlot to achieve a balance of immense power and refined elegance.' },
                        { name: 'Napa Valley Style', criteria: 'Regional Style', description: 'Rich solar heat provides riper fruit profiles, softer tannins, and a massive body.' },
                        { name: 'Coonawarra Style', criteria: 'Special Terroir', description: 'Grown in Australian terra rossa soil, noted for distinct eucalyptus and mint nuances.' }
                ],
                sensoryMetrics: [
                        { label: 'Tannins', metric: 'Astringency', value: '10/10', description: 'Exceedingly firm and dense tannins.' },
                        { label: 'Body', metric: 'Weight', value: '10/10', description: 'An overwhelming, muscular full body.' },
                        { label: 'Acidity', metric: 'Crispness', value: '8/10', description: 'High acidity that supports long-term bottle maturation.' }
                ],
                flavorTags: [
                        { label: 'Blackcurrant', color: 'bg-purple-900/20 text-purple-950' },
                        { label: 'Cedar', color: 'bg-amber-900/20 text-amber-950' },
                        { label: 'Vanilla', color: 'bg-yellow-50/20 text-yellow-800' }
                ],
                manufacturingProcess: [
                        { step: 'Fermentation', name: 'High-Temperature Fermentation', description: 'Fermented at 28-30°C to ensure maximum extraction of color and tannins from the thick-skinned grapes.' },
                        { step: 'Aging', name: 'New French Oak Maturation', description: 'Aged for 12-24 months in new oak to integrate its powerful character and add layers of spicy complexity.' }
                ],
                majorRegions: [
                        { name: 'Médoc, Bordeaux', description: 'The historic heartland and global benchmark for Cabernet Sauvignon.', emoji: '🇫🇷' },
                        { name: 'Napa Valley', description: 'The undisputed pinnacle of New World Cabernet Sauvignon.', emoji: '🇺🇸' },
                        { name: 'Coonawarra', description: 'Australia’s premier region for high-quality red wine production.', emoji: '🇦🇺' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Large, wide Bordeaux-style Red Wine Glass',
                        optimalTemperatures: [
                                { temp: '16-18°C', description: 'The range where dense tannins soften and the deep bouquet is fully released.' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['Grilled ribeye or tenderloin steak', 'Roasted lamb chops', 'Aged cheddar cheese'],
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['카베르네 소비뇽', 'cabernet sauvignon']
}