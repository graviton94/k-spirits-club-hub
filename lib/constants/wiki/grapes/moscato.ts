import { SpiritCategory } from '../types'

export const moscato: SpiritCategory = {
        slug: 'moscato',
        emoji: '🥂',
        nameKo: '모스카토',
        nameEn: 'Moscato',
        taglineKo: '달콤한 기쁨의 찬가, 화사한 포도 본연의 향기와 부드러운 기포',
        taglineEn: 'The anthem of sweet joy, the brilliant original grape aroma and soft bubbles',
        color: 'yellow',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '모스카토(Moscato)는 전 세계에서 가장 직관적이고 사랑스러운 화이트 품종입니다. "머스크(Musk)" 향이 나는 포도라는 이름처럼, 갓 수확한 신선한 포도 본연의 향기와 오렌지 블로섬, 복숭아의 달콤한 아로마가 일품입니다. 주로 가벼운 기포와 낮은 알코올 도수로 생산되어, 와인을 처음 접하는 사람부터 전문가까지 품종 본연의 즐거움을 만끽하게 해주는 "미소 짓게 하는 와인"입니다.',
                history: '인류가 재배한 가장 오래된 포도 품종 중 하나로, 고대 그리스와 로마 시대부터 사랑받아 왔습니다. 이탈리아 북부 피에몬테 지역에서 탄생한 "모스카토 다스티(Moscato d\'Asti)"를 통해 세계적인 명성을 얻었으며, 오늘날에는 프랑스, 미국, 호주 등 전 세계에서 다양한 스타일의 디저트 와인과 스파클링 와인으로 재탄생되어 축제의 자리를 빛내고 있습니다.',
                classifications: [
                        { name: 'Moscato d\'Asti DOCG', criteria: '최고급 스타일', description: '이탈리아 아스티 지역의 정통 스타일로, 가장 신선하고 품격 있는 기포와 단맛의 조화' },
                        { name: 'Pink Moscato', criteria: '로제 스타일', description: '약간의 레드 품종을 섞어 화사한 색상과 베리 향을 더한 트렌디한 스타일' },
                        { name: 'Muscat de Beaumes-de-Venise', criteria: '강화 스타일', description: '프랑스 남부에서 생산되는, 알코올을 더해 농축미와 깊이를 더한 고품격 디저트 와인' }
                ],
                sensoryMetrics: [
                        { label: '당도 (Sweetness)', metric: '감미', value: '10/10', description: '기분 좋은 천연 당분이 전하는 달콤한 유혹' },
                        { label: '향기 (Aroma)', metric: '화사함', value: '10/10', description: '오렌지 꽃, 꿀, 인동덩굴의 폭발적인 향기' },
                        { label: '알코올 (Alcohol)', metric: '도수', value: '3/10', description: '부담 없이 즐길 수 있는 낮고 가벼운 도수' }
                ],
                flavorTags: [
                        { label: '오렌지 블로섬', color: 'bg-orange-50/20 text-orange-600' },
                        { label: '백복숭아', color: 'bg-red-50/20 text-red-600' },
                        { label: '아카시아 꿀', color: 'bg-yellow-100/20 text-yellow-800' }
                ],
                manufacturingProcess: [
                        { step: '발효', name: '아스티 방식 (Asti)', description: '발효 도중 온도를 낮추어 당분을 남기고 자연스러운 기포를 가둡니다.' },
                        { step: '여과', name: '저온 정밀 여과', description: '품종 특유의 신선한 아로마를 보존하기 위해 병입 전 차갑고 정밀하게 여과합니다.' }
                ],
                majorRegions: [
                        { name: '아스티 (Asti)', description: '전 세계 모스카토 유행의 발원지이자 가장 우아한 모스카토의 성지', emoji: '🇮🇹' },
                        { name: '론 밸리 (Rhône)', description: '농축된 고품격 뮤스카(Muscat) 디저트 와인이 탄생하는 곳', emoji: '🇫🇷' }
                ],
                servingGuidelines: {
                        recommendedGlass: '튤립형 샴페인 글라스 또는 표준 화이트 와인 글라스',
                        optimalTemperatures: [
                                { temp: '6-8°C', description: '아주 차갑게 서빙하여 당미를 깔끔하게 다듬고 기포의 청량감을 극대화해야 하는 온도' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['신선한 과일 샐러드', '여성용 디저트(케이크, 소르베)', '매콤한 아시안 요리(태국, 한국)', '블루 치즈']
        },
        sectionsEn: {
                definition: "Moscato is universally cherished as one of the world's most intuitive and delightful white varieties. True to its name (derived from the word 'Musk'), it offers a pure, unadulterated perfume of freshly harvested grapes, orange blossoms, and ripe peaches. Typically produced with a gentle effervescence and low alcohol, it is a 'wine of smiles' that brings immediate pleasure to everyone from novices to the most experienced connoisseurs.",
                history: "Believed to be one of the oldest domesticated grape families, Moscato has been cultivated since the eras of Ancient Greece and Rome. It achieved global icon status through 'Moscato d'Asti' from Italy’s Piedmont region. Today, it identifies as a global citizen, produced across France, the US, and Australia in styles ranging from bone-dry to lusciously sweet, always serving as the life of the party.",
                classifications: [
                        { name: "Moscato d'Asti DOCG", criteria: 'Premium Italian', description: 'The absolute benchmark for quality: elegant, lightly sparkling, and perfectly balanced sweetness.' },
                        { name: 'Pink Moscato', criteria: 'Rosé Style', description: 'A trendy and vibrant expression blended with a touch of red grapes for berry notes and color.' },
                        { name: 'Muscat de Beaumes-de-Venise', criteria: 'Fortified Style', description: 'A prestigious French dessert wine where fermentation is stopped by alcohol to preserve intense natural sugars.' }
                ],
                sensoryMetrics: [
                        { label: 'Sweetness', metric: 'Sugar Content', value: '10/10', description: 'Dominated by luscious, natural grape sugars that provide pure joy.' },
                        { label: 'Aroma', metric: 'Intensity', value: '10/10', description: 'An explosive bouquet of orange blossom, honey, and honeysuckle.' },
                        { label: 'Alcohol', metric: 'Weight', value: '3/10', description: 'Wonderfully light and sessionable, making it ideal for any daytime celebration.' }
                ],
                flavorTags: [
                        { label: 'Orange Blossom', color: 'bg-orange-50/20 text-orange-600' },
                        { label: 'White Peach', color: 'bg-red-50/20 text-red-600' },
                        { label: 'Acacia Honey', color: 'bg-yellow-100/20 text-yellow-800' }
                ],
                manufacturingProcess: [
                        { step: 'Fermentation', name: 'Asti Method', description: 'Fermentation is halted by cooling, preserving residual sugar and trapping natural CO2 for gentle bubbles.' },
                        { step: 'Filtration', name: 'Cold Precision Filtration', description: 'Conducted at low temperatures to ensure the wine remains stable and the delicate primary aromatics are locked in.' }
                ],
                majorRegions: [
                        { name: 'Asti', description: 'The historic and spiritual center for the world’s most refined Moscato expressions.', emoji: '🇮🇹' },
                        { name: 'Rhône Valley', description: 'Renowned for producing powerful and concentrated fortified Muscat dessert wines.', emoji: '🇫🇷' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Tulip-shaped Flute or Standard White Wine glass',
                        optimalTemperatures: [
                                { temp: '6–8°C', description: 'Best served very cold to keep the sweetness crisp and the bubbles lively.' }
                        ],
                        decantingNeeded: false
                },
                foodPairing: ['Fresh fruit salads', 'Pastries and Sorbets', 'Spicy Asian fusion (Thai or Spicy Korean)', 'Piquant Blue cheeses']
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['모스카토', 'moscato', '아스티', '스티']
}