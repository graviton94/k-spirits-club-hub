import { SpiritCategory } from '../types'

export const syrah: SpiritCategory = {
        slug: 'syrah',
        emoji: '⚔️',
        nameKo: '시라 (쉬라즈)',
        nameEn: 'Syrah (Shiraz)',
        taglineKo: '검은 후추의 전율, 강인한 힘과 우아한 제비꽃의 대립적 조화',
        taglineEn: 'The thrill of black pepper, the contrasting harmony of powerful strength and elegant violet',
        color: 'red',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '시라(Syrah)는 전 세계에서 가장 역동적이고 강인한 레드 품종 중 하나입니다. 코를 찌르는 검은 후추의 스파이시함과 제비꽃 향, 그리고 묵직한 타닌과 블랙베리 풍미가 특징입니다. 프랑스 북부 론의 우아하고 절제된 "시라" 스타일부터, 호주 바로사 밸리의 농축되고 파워풀한 "쉬라즈" 스타일까지, 레드 와인이 보여줄 수 있는 극한의 에너지를 담고 있는 품종입니다.',
                history: '프랑스 남동부 론 계곡의 토착 품종으로, 수 세기 동안 전설적인 "에르미타주" 와인의 주인공으로 명성을 떨쳤습니다. 19세기 호주로 건너가 "쉬라즈(Shiraz)"라는 이름으로 재탄생하며 신대륙 레드 와인의 아이콘이 되었고, 오늘날에는 열강의 태양을 머금은 스타일과 서늘한 기후의 세련된 스타일을 모두 아우르는 전 세계적인 품종으로 사랑받고 있습니다.',
                classifications: [
                        { name: 'Northern Rhône Syrah', criteria: '프랑스 스타일', description: '후추, 올리브, 제비꽃의 우아하고 세련된 아로마와 탄탄한 골격을 지닌 스타일' },
                        { name: 'Barossa Shiraz', criteria: '호주 스타일', description: '폭발적인 검은 과실, 초콜릿, 리치한 유질감과 강력한 힘을 지닌 스타일' },
                        { name: 'Syrah-Viognier Blend', criteria: '희귀 스타일', description: '화이트 품종인 비오니에를 소량 섞어 화사한 향기와 색을 극대화한 코트 로티(Côte Rôtie) 스타일' }
                ],
                sensoryMetrics: [
                        { label: '바디 (Body)', metric: '무게감', value: '9/10', description: '입안을 가득 채우는 강력하고 묵직한 풀바디' },
                        { label: '타닌 (Tannins)', metric: '수렴성', value: '8/10', description: '탄탄하고 힘이 느껴지면서도 입자가 고운 타닌' },
                        { label: '스파이스 (Spice)', metric: '향신료 느낌', value: '10/10', description: '시라를 상징하는 강력한 검은 후추와 향신료 풍미' }
                ],
                flavorTags: [
                        { label: '검은 후추', color: 'bg-stone-700/20 text-stone-900' },
                        { label: '제비꽃 (Violet)', color: 'bg-purple-100/20 text-purple-700' },
                        { label: '블랙베리', color: 'bg-purple-900/20 text-purple-900' }
                ],
                manufacturingProcess: [
                        { step: '침출', name: '장기 침출 및 발효', description: '시라 특유의 강력한 색과 타닌을 뽑아내기 위해 오랜 시간 정교하게 발효 과정을 거칩니다.' },
                        { step: '숙성', name: '오크 숙성', description: '부드러운 타닌과 복합미를 위해 주로 프렌치 또는 아메리칸 오크통에서 수개월 이상 숙성합니다.' }
                ],
                majorRegions: [
                        { name: '북부 론 (Northern Rhône)', description: '에르미타주와 크로즈 에르미타주를 품은 시라의 영원한 고향', emoji: '🇫🇷' },
                        { name: '바로사 밸리 (Barossa)', description: '전 세계에서 가장 농축되고 강력한 쉬라즈가 탄생하는 호주의 명지', emoji: '🇦🇺' },
                        { name: '맥라렌 베일', description: '부드럽고 풍부한 질감의 상급 쉬라즈를 생산하는 호주 남부 산지', emoji: '🇦🇺' }
                ],
                servingGuidelines: {
                        recommendedGlass: '볼이 깊고 넉넉하며 입구가 약간 오목한 대형 레드 와인 글라스',
                        optimalTemperatures: [
                                { temp: '16-18°C', description: '특유의 스파이시함과 검은 과실 풍미가 가장 조화롭게 퍼지는 온도' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['숯불 갈비 및 스테이크', '진한 풍미의 양고기 요리', '향신료가 강한 소시지', '숙성된 치즈']
        },
        sectionsEn: {
                definition: "Syrah is one of the most dynamic and resilient red varieties, offering a spectrum of red winemaking intensity like no other. It is famously defined by its sharp black pepper spice, violet aromatics, and dense tannic structure. From the restrained, elegant, and savory 'Syrah' style of the Northern Rhône to the opulent, powerful, and fruit-driven 'Shiraz' of Australia, it embodies the ultimate energy of red wine.",
                history: "A native of the Rhône Valley in France, Syrah has enjoyed centuries of prestige as the heart of legendary wines like Hermitage. In the 19th century, it was introduced to Australia, where it was rechristened 'Shiraz' and became the icon of New World reds. Today, it flourishes globally, celebrated for its ability to produce both cool-climate architectural masterpieces and sun-drenched, voluptuous titans.",
                classifications: [
                        { name: 'Northern Rhône Syrah', criteria: 'French Style', description: 'Focuses on elegance, featuring notes of pepper, olive, violet, and a firm structural frame.' },
                        { name: 'Barossa Shiraz', criteria: 'Australian Style', description: 'Opulent and concentrated, characterized by explosive black fruit, chocolate, and immense physical power.' },
                        { name: 'Syrah-Viognier Blend', criteria: 'Exotic Style', description: 'The Côte Rôtie tradition of co-fermenting with a touch of white Viognier for elevated aromatics and color.' }
                ],
                sensoryMetrics: [
                        { label: 'Body', metric: 'Weight', value: '9/10', description: 'A bold, mouth-filling, and authoritative full-bodied presence.' },
                        { label: 'Tannins', metric: 'Astringency', value: '8/10', description: 'Features a firm and powerful backbone with a fine-grained texture.' },
                        { label: 'Spiciness', metric: 'Aromatic Edge', value: '10/10', description: 'The absolute hallmark of the variety: intense, tingling black pepper notes.' }
                ],
                flavorTags: [
                        { label: 'Black Pepper', color: 'bg-stone-700/20 text-stone-900' },
                        { label: 'Violet', color: 'bg-purple-100/20 text-purple-700' },
                        { label: 'Blackberry', color: 'bg-purple-900/20 text-purple-900' }
                ],
                manufacturingProcess: [
                        { step: 'Fermentation', name: 'Refined Extraction', description: 'Requires careful maceration to extract its intense pigment and structured tannins without becoming overly harsh.' },
                        { step: 'Aging', name: 'Oak Maturation', description: 'Commonly aged in French (for elegance) or American (for sweetness) oak to build complexity and soften the palate.' }
                ],
                majorRegions: [
                        { name: 'Northern Rhône', description: 'The spiritual and historic homeland, defined by steep granite slopes.', emoji: '🇫🇷' },
                        { name: 'Barossa Valley', description: 'The premier global source for iconic, concentrated, and century-old Shiraz.', emoji: '🇦🇺' },
                        { name: 'McLaren Vale', description: 'Produces lush, chocolatey, and velvety expressions of high-end Shiraz.', emoji: '🇦🇺' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Large, deep-bowled Red Wine glass with a slightly tapered rim',
                        optimalTemperatures: [
                                { temp: '16–18°C', description: 'Best for allowing its spicy aromatics and dark fruit density to fully integrate.' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['Grilled ribs and peppered steak', 'Rich game and lamb dishes', 'Highly seasoned sausages', 'Piquant aged cheeses']
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['시라', 'syrah', '쉬라즈', 'shiraz', '에르미타주', 'hermitage']
}