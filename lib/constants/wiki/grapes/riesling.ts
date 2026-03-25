import { SpiritCategory } from '../types'

export const riesling: SpiritCategory = {
        slug: 'riesling',
        emoji: '👑',
        nameKo: '리슬링',
        nameEn: 'Riesling',
        taglineKo: '화이트의 제왕, 고결한 산도와 페트롤(Petrol)향의 위대한 대서사시',
        taglineEn: 'The King of Whites, an epic of noble acidity and majestic petrol notes',
        color: 'yellow',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '리슬링(Riesling)은 샤르도네와 함께 세계에서 가장 위대한 화이트 품종으로 꼽히는 "화이트의 제왕"입니다. 타의 추종을 불허하는 날카로운 산도와 투명한 미네랄리티, 그리고 시간이 흐를수록 발현되는 독특한 "페트롤(휘발유) 향"이 특징입니다. 드라이한 스타일부터 극강의 달콤함을 지닌 디저트 와인까지 모든 당도 스펙트럼에서 완벽한 균형미를 보여주는 유일무이한 품종입니다.',
                history: '독일 라인(Rhine) 강 유역이 고향으로, 15세기부터 그 기록이 존재할 만큼 깊은 역사를 자랑합니다. 독일 황실의 총애를 받으며 "귀족적인 포도"로 대우받았고, 껍질이 단단해 추위에 강한 특성 덕분에 북유럽의 척박한 테루아를 전 세계에 알렸습니다. 오늘날에는 독일 모젤(Mosel)을 넘어 프랑스 알자스, 호주 이든 밸리 등 전 세계에서 테루아를 가장 정교하게 반영하는 품종으로 평가받습니다.',
                classifications: [
                        { name: 'Kabinett', criteria: '독일 등급', description: '가장 일찍 수확한, 가볍고 청량하며 뛰어난 균형을 지닌 스타일' },
                        { name: 'Spätlese / Auslese', criteria: '독일 등급', description: '늦게 수확하거나 선별 수확하여 더욱 농축된 과실미와 복합미를 지닌 스타일' },
                        { name: 'Beerenauslese (BA) / TBA', criteria: '디저트 등급', description: '귀부 현상을 거친 포도로 만든 세계 최고의 농축된 디저트 와인' }
                ],
                sensoryMetrics: [
                        { label: '산도 (Acidity)', metric: '청량감', value: '10/10', description: '입안을 깨끗하게 씻어주는 날카롭고 전율적인 산미' },
                        { label: '미네랄 (Minerality)', metric: '산지 특성', value: '10/10', description: '슬레이트 토양 등에서 유래한 젖은 돌과 짠맛의 조화' },
                        { label: '숙성력 (Aging)', metric: '잠재력', value: '10/10', description: '수십 년간 진화하며 페트롤과 꿀 향의 조화를 이끌어냄' }
                ],
                flavorTags: [
                        { label: '라임 / 레몬', color: 'bg-yellow-100/20 text-yellow-700' },
                        { label: '페트롤 (Petrol)', color: 'bg-stone-500/20 text-stone-800' },
                        { label: '백도 복숭아', color: 'bg-red-50/20 text-red-600' }
                ],
                manufacturingProcess: [
                        { step: '발효', name: '중립적 저온 발효', description: '리슬링 고유의 섬세한 향을 지키기 위해 산소 접촉을 차단하고 스테인리스 탱크에서 차갑게 발효합니다.' },
                        { step: '오크 배제', name: '뉴 오크 미사용', description: '포도와 테루아 본연의 아로마를 가리지 않기 위해 새 오크통 사용을 철저히 배제합니다.' }
                ],
                majorRegions: [
                        { name: '모젤 (Mosel)', description: '가파른 슬레이트 언덕에서 탄생하는 세계에서 가장 우아한 리슬링의 성지', emoji: '🇩🇪' },
                        { name: '알자스 (Alsace)', description: '보다 묵직하고 드라이하며 미네랄이 강력한 스타일의 산지', emoji: '🇫🇷' },
                        { name: '클레어 & 이든 밸리', description: '호주의 서늘한 고지대에서 자란 라임 향 가득한 드라이 리슬링 산지', emoji: '🇦🇺' }
                ],
                servingGuidelines: {
                        recommendedGlass: '볼이 약간 좁고 입구가 모인 전형적인 리슬링 글라스',
                        optimalTemperatures: [
                                { temp: '7-9°C', description: '드라이하거나 가벼운 스타일의 신선함을 즐기기에 최적' },
                                { temp: '10-12°C', description: '숙성된 리슬링이나 묵직한 스타일의 복합미를 느끼기에 적합' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['태국/베트남 등 아시안 퀴진', '매콤한 양념 치킨', '신선한 생선회(사시미)', '스파이시한 소시지 요리']
        },
        sectionsEn: {
                definition: "Riesling is the 'King of White Grapes,' a title shared only with Chardonnay. It is defined by its peerless, high-toned acidity, crystalline minerality, and the unique 'petrol' (kerosene) aroma that develops with age. Unmatched in its versatility, Riesling maintains perfect balance across the entire sugar spectrum, from bone-dry table wines to some of the world’s most concentrated and prestigious dessert elixirs.",
                history: "Native to the Rhine River region in Germany, Riesling has a documented history dating back to the 15th century. Favored by German royalty as the 'noble grape,' its hardiness and thick skins allowed it to survive and reflect the harshest Northern European terroirs. Today, it is revered globally—from the Mosel valley to Alsace and Australia’s Eden Valley—as a variety that translates the specificities of the land with surgical precision.",
                classifications: [
                        { name: 'Kabinett', criteria: 'German Tier', description: 'The lightest style, focused on fresh acidity, purity of fruit, and elegant balance.' },
                        { name: 'Spätlese / Auslese', criteria: 'German Tier', description: 'Late-harvest or selectively picked grapes offering richer fruit intensity and deeper complexity.' },
                        { name: 'Beerenauslese (BA) / TBA', criteria: 'Dessert Tier', description: 'Some of the world’s most prized sweet wines, made from berries shriveled by noble rot.' }
                ],
                sensoryMetrics: [
                        { label: 'Acidity', metric: 'Crispness', value: '10/10', description: 'Piercing, electric acidity that provides incredible freshness and longevity.' },
                        { label: 'Minerality', metric: 'Terroir Depth', value: '10/10', description: 'Wet slate, flint, and saline notes derived from its specific rocky environments.' },
                        { label: 'Aging', metric: 'Potential', value: '10/10', description: 'One of the few whites that can age gracefully for decades, evolving into honey and petrol.' }
                ],
                flavorTags: [
                        { label: 'Lime / Lemon', color: 'bg-yellow-100/20 text-yellow-700' },
                        { label: 'Petrol', color: 'bg-stone-500/20 text-stone-800' },
                        { label: 'White Peach', color: 'bg-red-50/20 text-red-600' }
                ],
                manufacturingProcess: [
                        { step: 'Fermentation', name: 'Neutral Cool Fermentation', description: 'Conducted in stainless steel with zero oxygen contact to preserve the grape’s fleeting and delicate aromatics.' },
                        { step: 'Vessel Selection', name: 'Strict No-Oak Policy', description: 'Winemakers almost universally avoid new oak to prevent masking the variety’s extreme purity.' }
                ],
                majorRegions: [
                        { name: 'Mosel', description: "The spiritual capital of Riesling, known for ethereal wines from impossibly steep slate hills.", emoji: '🇩🇪' },
                        { name: 'Alsace', description: 'Famous for creating powerful, dry, and profoundly mineral-driven expressions.', emoji: '🇫🇷' },
                        { name: 'Clare & Eden Valley', description: "Australia's premier high-altitude sites for lime-scented, bone-dry Riesling.", emoji: '🇦🇺' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Slightly narrow, tulip-shaped Riesling glass',
                        optimalTemperatures: [
                                { temp: '7–9°C', description: 'Ideal for younger, drier styles where freshness is paramount.' },
                                { temp: '10–12°C', description: 'Allows the complex tertiary notes of aged or richer Rieslings to fully open.' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['Spicy Thai or Vietnamese cuisine', 'Spicy glazed chicken', 'Sashimi and fresh seafood', 'Spicy sausages']
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['리슬링', 'riesling']
}