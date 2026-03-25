import { SpiritCategory } from '../types'

export const merlot: SpiritCategory = {
        slug: 'merlot',
        emoji: '🍇',
        nameKo: '메를로',
        nameEn: 'Merlot',
        taglineKo: '벨벳의 우아함, 부드러운 타닌과 풍성한 플럼(Plum)의 미학',
        taglineEn: 'Velvet elegance, the aesthetics of soft tannins and lush plums',
        color: 'red',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '메를로(Merlot)는 전 세계에서 가장 사랑받는 레드 품종 중 하나로, 특유의 부드러운 질감과 풍성한 과실향 덕분에 "레드 와인의 벨벳"이라 불립니다. 잘 익은 블랙체리와 플럼의 달콤한 풍미가 특징이며, 카베르네 소비뇽에 비해 타닌이 둥글고 산미가 온화하여 누구나 쉽게 즐길 수 있는 편안함과 동시에 세계 최고의 명품 와인을 만들어내는 깊이를 동시에 지니고 있습니다.',
                history: '프랑스 보르도(Bordeaux) 지역이 고향이며, 카베르네 프랑(Cabernet Franc)의 후손으로 알려져 있습니다. 수 세기 동안 보르도 블렌딩의 조연으로 활약해왔으나, 보르도 우안(Right Bank)의 샤토 페트뤼스(Château Pétrus) 같은 전설적인 와인이 메를로 100% 혹은 그에 가까운 비율로 탄생하면서 그 위상이 정점에 달했습니다. 오늘날에는 전 세계 거의 모든 와인 생산지에서 재배되는 국제 품종의 리더로 자리 잡았습니다.',
                classifications: [
                        { name: 'Right Bank Bordeaux', criteria: '최고급 테루아', description: '생테밀리옹, 포메롤 등 진토 토양에서 탄생한 우아하고 장기 숙성력이 뛰어난 메를로' },
                        { name: 'New World Style', criteria: '풍미 스타일', description: '캘리포니아나 호주 등 따뜻한 지역에서 만들어진 농축된 과실미와 초콜릿 풍미의 메를로' },
                        { name: 'Entry Level Varietal', criteria: '대중성', description: '언제 어디서나 마시기 편한 부드럽고 과일 향 중심의 데일리 스타일' }
                ],
                sensoryMetrics: [
                        { label: '타닌 (Tannins)', metric: '수렴성', value: '4/10', description: '매끄럽고 둥글게 다듬어진 벨벳 같은 질감' },
                        { label: '바디 (Body)', metric: '무게감', value: '7/10', description: '풍성하면서도 부담스럽지 않은 미디엄 풀바디' },
                        { label: '과실미 (Fruitiness)', metric: '당도 느낌', value: '8/10', description: '잘 익은 플럼과 블랙체리의 풍부한 아로마' }
                ],
                flavorTags: [
                        { label: '블랙체리', color: 'bg-red-900/20 text-red-900' },
                        { label: '자두 (Plum)', color: 'bg-purple-800/20 text-purple-800' },
                        { label: '초콜릿', color: 'bg-stone-500/20 text-stone-800' }
                ],
                manufacturingProcess: [
                        { step: '발효', name: '온도 조절 발효', description: '과실의 순수함을 살리기 위해 주로 스테인리스 스틸이나 큰 오크통에서 정교하게 온도를 제어하며 발효합니다.' },
                        { step: '숙성', name: '프렌치 오크 숙성', description: '부드러운 타닌에 구조감을 더하고 바닐라, 스파이스 풍미를 입히기 위해 주로 프렌치 오크에서 숙성합니다.' }
                ],
                majorRegions: [
                        { name: '보르도 우안 (Right Bank)', description: '메를로가 가장 고귀하게 표현되는 포메롤과 생테밀리옹의 거점', emoji: '🇫🇷' },
                        { name: '나파 밸리 (Napa Valley)', description: '풍만하고 묵직한 고품질 메를로의 신대륙 중심지', emoji: '🇺🇸' },
                        { name: '투스카니 (Tuscany)', description: '슈퍼 투스칸 와인에서 우아함을 담당하는 메를로의 산지', emoji: '🇮🇹' }
                ],
                servingGuidelines: {
                        recommendedGlass: '볼이 둥글고 넉넉한 레드 와인 글라스',
                        optimalTemperatures: [
                                { temp: '16-18°C', description: '풍부한 과실향과 부드러운 타닌이 가장 우아하게 표현되는 온도' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['로스트 비프', '오리 가슴살 요리', '버섯 리조토', '숙성된 치즈', '매트 로프']
        },
        sectionsEn: {
                definition: "Merlot is one of the world's most beloved red grape varieties, often dubbed the 'Velvet of Red Wines' for its characteristic supple texture and lush fruit profile. It is defined by sweet flavors of ripe black cherry and plum. Compared to Cabernet Sauvignon, its tannins are rounder and its acidity more moderate, offering a friendly approachability for beginners while possessing the depth required for the world’s most prestigious collectibles.",
                history: "A native of the Bordeaux region in France, Merlot is a descendant of Cabernet Franc. After centuries of serving as a reliable supporting player in Bordeaux blends, it achieved legendary status through the masterpieces of the Right Bank, such as Château Pétrus. Today, it stands as a global leader among international varieties, grown successfully in nearly every winemaking corner of the globe.",
                classifications: [
                        { name: 'Right Bank Bordeaux', criteria: 'Premium Terroir', description: 'Elegant, long-lived Merlot from the clay-rich soils of Pomerol and Saint-Émilion.' },
                        { name: 'New World Style', criteria: 'Flavor Profile', description: 'Concentrated, fruit-forward wines with chocolatey nuances from warmer climates like California or Australia.' },
                        { name: 'Entry Level Varietal', criteria: 'Accessibility', description: 'Soft, fruit-focused, and easy-drinking styles perfect for daily enjoyment.' }
                ],
                sensoryMetrics: [
                        { label: 'Tannins', metric: 'Astringency', value: '4/10', description: 'Smooth, polished, and velvet-like on the palate.' },
                        { label: 'Body', metric: 'Weight', value: '7/10', description: 'Voluminous yet approachable medium-to-full body.' },
                        { label: 'Fruitiness', metric: 'Perceived Sweetness', value: '8/10', description: 'Vibrant aromas of ripe plum and succulent black cherry.' }
                ],
                flavorTags: [
                        { label: 'Black Cherry', color: 'bg-red-900/20 text-red-900' },
                        { label: 'Plum', color: 'bg-purple-800/20 text-purple-800' },
                        { label: 'Chocolate', color: 'bg-stone-500/20 text-stone-800' }
                ],
                manufacturingProcess: [
                        { step: 'Fermentation', name: 'Temperature Controlled Fermentation', description: 'Conducted in stainless steel or large oak vats with precise thermal regulation to protect the purity of fruit.' },
                        { step: 'Aging', name: 'French Oak Aging', description: 'Matured in French oak to add structural backbone and impart complex vanilla and spice notes.' }
                ],
                majorRegions: [
                        { name: 'Bordeaux Right Bank', description: 'The absolute pinnacle for Merlot expression, centered in Pomerol and Saint-Émilion.', emoji: '🇫🇷' },
                        { name: 'Napa Valley', description: "The premier New World hub for plush, powerful, and high-quality Merlot.", emoji: '🇺🇸' },
                        { name: 'Tuscany', description: 'Adds elegance and softness to world-renowned Super Tuscan blends.', emoji: '🇮🇹' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Generous, round-bowled Red Wine glass',
                        optimalTemperatures: [
                                { temp: '16–18°C', description: 'The best range to allow its voluptuous fruit and silky tannins to shine.' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['Roast beef', 'Duck breast', 'Mushroom risotto', 'Aged cheeses', 'Meatloaf']
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['메를로', 'merlot']
}