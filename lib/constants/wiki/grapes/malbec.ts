import { SpiritCategory } from '../types'

export const malbec: SpiritCategory = {
        slug: 'malbec',
        emoji: '🫐',
        nameKo: '말벡',
        nameEn: 'Malbec',
        taglineKo: '안데스의 검은 진주, 강렬한 색조와 벨벳 같은 보랏빛 유혹',
        taglineEn: 'The black pearl of the Andes, intense hues and velvety purple temptation',
        color: 'red',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '말벡(Malbec)은 잉크처럼 진한 자줏빛 색조와 풍부한 육질을 자랑하는 강력한 레드 품종입니다. 잘 익은 자두, 블랙베리 같은 검은 과실향에 초콜릿과 연기 향이 더해진 묵직한 풍미가 특징입니다. 부드러운 타닌과 풍성한 질감 덕분에 전 세계 고기 요리 애호가들에게 절대적인 지지를 받는 "스테이크 와인의 정석"으로 통합니다.',
                history: '프랑스 남서부 카오르(Cahors) 지역이 고향으로, 원래 부르브뉴와 보르도 블렌딩의 조연으로 활약했습니다. 하지만 19세기 아르헨티나로 건너간 말벡은 안데스 산맥의 압도적인 일사량과 테루아를 만나며 완전히 재탄생했습니다. 오늘날 아르헨티나를 상징하는 국가 대표 품종이 되었으며, 프랑스 카오르의 "블랙 와인" 전통과 아르헨티나의 현대적인 화려함이라는 두 얼굴을 동시에 지니고 있습니다.',
                classifications: [
                        { name: 'Mendoza Malbec', criteria: '산지 스타일', description: '아르헨티나 고지대에서 자라 풍부한 과실 향과 부드러운 타닌을 지닌 스타일' },
                        { name: 'Cahors Black Wine', criteria: '프랑스 전통', description: '강한 타닌과 철분 느낌의 미네랄, 짙은 색조를 지닌 고전적인 스타일' },
                        { name: 'Malbec Lujan de Cuyo DOC', criteria: '아르헨티나 공식 인증', description: '아르헨티나 최초의 원산지 통제 명칭으로 인정받은 최상급 산지 등급' }
                ],
                sensoryMetrics: [
                        { label: '색상 (Color)', metric: '농도', value: '10/10', description: '밑바닥이 보이지 않을 정도의 짙은 자줏빛' },
                        { label: '바디 (Body)', metric: '무게감', value: '9/10', description: '입안을 가득 채우는 풀 바디의 웅장함' },
                        { label: '타닌 (Tannins)', metric: '수렴성', value: '7/10', description: '힘이 있지만 벨벳처럼 부드러운 타닌' }
                ],
                flavorTags: [
                        { label: '검은 자두', color: 'bg-purple-900/20 text-purple-900' },
                        { label: '다크 초콜릿', color: 'bg-stone-500/20 text-stone-800' },
                        { label: '블루베리', color: 'bg-blue-100/20 text-blue-700' }
                ],
                manufacturingProcess: [
                        { step: '침출', name: '저온 침출 (Cold Soak)', description: '말벡 특유의 짙은 색과 부드러운 과실 아로마를 극대화하기 위해 발효 전 저온에서 오래 침출합니다.' },
                        { step: '숙성', name: '프렌치 오크 숙성', description: '바닐라와 토스트 향을 입혀 와인의 구조감을 완성하기 위해 주로 오크통 숙성을 거칩니다.' }
                ],
                majorRegions: [
                        { name: '멘도사 (Mendoza)', description: '전 세계 말벡의 중심지이자 아르헨티나 와인의 심장', emoji: '🇦🇷' },
                        { name: '카오르 (Cahors)', description: '말벡의 고향으로 "블랙 와인"의 전설을 이어가는 곳', emoji: '🇫🇷' },
                        { name: '살타 (Salta)', description: '세계에서 가장 높은 고도의 포도밭에서 자란 응축된 말벡의 보고', emoji: '🇦🇷' }
                ],
                servingGuidelines: {
                        recommendedGlass: '크고 깊은 대형 레드 와인 글라스',
                        optimalTemperatures: [
                                { temp: '16-18°C', description: '풍부한 블랙 크루트의 향과 벨벳 같은 질감이 가장 잘 느껴지는 온도' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['구운 스테이크', '양고기 스테이크', '짙은 소스의 바비큐', '숙성된 하드 치즈']
        },
        sectionsEn: {
                definition: "Malbec is a powerful red grape variety renowned for its inky purple hue and robust, fleshy palate. Characterized by deep notes of ripe plum and blackberry, underscored by hints of chocolate and tobacco, it offers an imposing sensory experience. With its velvety tannins and generous texture, it has become globally celebrated as the 'Standard for Steak Wines,' a favorite among meat lovers everywhere.",
                history: "Native to Cahors in Southwest France, Malbec was historically a sturdy blending partner in Bordeaux. However, its true potential was unlocked in the 19th century when it migrated to Argentina. Finding its perfect home under the high-altitude sun of the Andes, it was completely reinvented. Today, it is Argentina’s national flagship variety, representing a bridge between the rustic 'Black Wine' tradition of France and modern South American opulence.",
                classifications: [
                        { name: 'Mendoza Malbec', criteria: 'Regional Style', description: 'A plush style with rich fruit flavors and supple tannins from Argentinian highlands.' },
                        { name: 'Cahors Black Wine', criteria: 'French Tradition', description: 'A structured, rustic style with firm tannins and iron-like mineral depth.' },
                        { name: 'Malbec Luján de Cuyo DOC', criteria: 'Official Appellation', description: "The first and premier DOC in Argentina, recognized for producing Malbec's most elegant expressions." }
                ],
                sensoryMetrics: [
                        { label: 'Color', metric: 'Intensity', value: '10/10', description: 'Almost opaque inky purple color.' },
                        { label: 'Body', metric: 'Weight', value: '9/10', description: 'Grand and voluminous full-bodied presence.' },
                        { label: 'Tannins', metric: 'Astringency', value: '7/10', description: 'Powerful yet remarkably velvety and integrated.' }
                ],
                flavorTags: [
                        { label: 'Black Plum', color: 'bg-purple-900/20 text-purple-900' },
                        { label: 'Dark Chocolate', color: 'bg-stone-500/20 text-stone-800' },
                        { label: 'Blueberry', color: 'bg-blue-100/20 text-blue-700' }
                ],
                manufacturingProcess: [
                        { step: 'Maceration', name: 'Cold Soak', description: 'Extended pre-fermentation soaking at low temperatures to extract deep pigment and lush PRIMARY aromas.' },
                        { step: 'Aging', name: 'French Oak Aging', description: 'Maturation in oak is nearly universal to define the structure and introduce vanilla and toast nuances.' }
                ],
                majorRegions: [
                        { name: 'Mendoza', description: "The absolute epicenter of global Malbec and the heart of Argentina's wine industry.", emoji: '🇦🇷' },
                        { name: 'Cahors', description: "The grape's historic homeland, synonymous with the legendary 'Black Wine.'", emoji: '🇫🇷' },
                        { name: 'Salta', description: 'Home to some of the world’s highest vineyards, producing incredibly concentrated Malbec.', emoji: '🇦🇷' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Large, deep-bowled Red Wine Glass',
                        optimalTemperatures: [
                                { temp: '16–18°C', description: 'Ideal for experiencing its rich black fruit bouquet and luxurious texture.' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['Grilled steak', 'Rack of lamb', 'Hearty BBQ in dark sauce', 'Aged hard cheeses']
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['말벡', 'malbec']
}