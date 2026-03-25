import { SpiritCategory } from '../types'

export const sangiovese: SpiritCategory = {
        slug: 'sangiovese',
        emoji: '🏺',
        nameKo: '산조베제',
        nameEn: 'Sangiovese',
        taglineKo: '토스카나의 심장, 루비빛 태양과 흙 내음이 빚어낸 이탈리아의 자부심',
        taglineEn: 'The heart of Tuscany, Italian pride crafted by ruby sun and earthy notes',
        color: 'red',
        hideFromWikiHubGrid: true,
        sections: {
                definition: '산조베제(Sangiovese)는 이탈리아에서 가장 널리 재배되는 상징적인 레드 품종으로, "주피터의 피(Sanguis Jovis)"라는 이름의 유래처럼 고귀한 기품을 지녔습니다. 높은 산도와 탄탄한 타닌, 그리고 신선한 체리와 토마토, 흙 내음이 어우러진 복합적인 풍미가 특징입니다. 이탈리아 미식 문화와 떼어놓을 수 없는 조화를 이루며, 전 세계 와인 애호가들을 토스카나의 언덕으로 불러모으는 품종입니다.',
                history: '고대 에트루리아 시대부터 이탈리아 중부 지역에서 재배되어 온 것으로 추정되는 유서 깊은 품종입니다. 1970년대 "슈퍼 투스칸"의 탄생과 함께 국제 품종과 블렌딩되며 전 세계적인 명성을 얻었으며, 오늘날에는 끼안티(Chianti), 브루넬로 디 몬탈치노(BDM) 같은 전설적인 와인들의 주인공으로서 그 입지를 확고히 하고 있습니다.',
                classifications: [
                        { name: 'Brunello di Montalcino', criteria: '최고급 단독 스타일', description: '산조베제 그로소(Grosso) 클론 100%로 빚어낸, 압도적 구조감과 숙성력을 지닌 정점' },
                        { name: 'Chianti Classico', criteria: '산지 등급', description: '검은 수탉 로고가 상징하는, 토스카나 심장부에서 생산되는 우아하고 클래식한 스타일' },
                        { name: 'Super Tuscan Blend', criteria: '모던 블렌딩', description: '카베르네 소비뇽 등 국제 품종과 결합하여 현대적인 감각으로 재해석된 파워풀한 스타일' }
                ],
                sensoryMetrics: [
                        { label: '산도 (Acidity)', metric: '청량감', value: '9/10', description: '음식의 풍미를 돋우는 활기차고 선명한 산미' },
                        { label: '타닌 (Tannins)', metric: '수렴성', value: '8/10', description: '입안을 견고하게 잡아주는 구조감 있는 타닌' },
                        { label: '아로마 (Aroma)', metric: '복합미', value: 'High', description: '붉은 체리, 말린 허브, 토양, 가죽의 풍부한 향' }
                ],
                flavorTags: [
                        { label: '붉은 체리', color: 'bg-red-200/20 text-red-700' },
                        { label: '말린 허브', color: 'bg-green-100/20 text-green-800' },
                        { label: '흙 / 가죽', color: 'bg-amber-900/20 text-amber-900' }
                ],
                manufacturingProcess: [
                        { step: '발효', name: '전통적 장기 침출', description: '산조베제의 복합적인 향과 힘 있는 타닌을 얻기 위해 충분한 시간 동안 껍질과 함께 발효합니다.' },
                        { step: '숙성', name: '다양한 오크 숙성', description: '전통적인 대형 슬로베니아 오크(Botte) 또는 현대적인 프렌치 바리크를 사용하여 스타일의 다양성을 완성합니다.' }
                ],
                majorRegions: [
                        { name: '토스카나 (Tuscany)', description: '끼안티와 몬탈치노를 품은 산조베제의 절대적 성지', emoji: '🇮🇹' },
                        { name: '로마냐 (Romagna)', description: '보다 부드럽고 과실미가 강조된 산조베제가 생산되는 곳', emoji: '🇮🇹' }
                ],
                servingGuidelines: {
                        recommendedGlass: '볼이 적당히 넓은 표준형 또는 튤립형 레드 와인 글라스',
                        optimalTemperatures: [
                                { temp: '16-18°C', description: '특유의 활기찬 산도와 붉은 과실향이 가장 생동감 있게 느껴지는 온도' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['토마토 베이스 파스타', '티본 스테이크(비스테카 알라 피오렌티나)', '각종 살라미와 프로슈토', '라구 소스 요리']
        },
        sectionsEn: {
                definition: "Sangiovese is Italy's most iconic and widely planted red variety, possessing a noble character reflected in its name's origin, 'The Blood of Jove (Jupiter's Blood).' It is defined by its vibrant high acidity, firm tannic backbone, and a complex flavor profile of fresh red cherries, savory tomatoes, and earthy undertones. As the soul of Italian gastronomic culture, it continues to draw wine lovers to the rolling hills of Tuscany.",
                history: "A variety of ancient roots believed to have been cultivated since the Etruscan era in Central Italy. It gained global superstardom in the 1970s with the birth of the 'Super Tuscans,' where it was blended with international varieties. Today, it stands as the singular heart of legendary wines like Chianti and Brunello di Montalcino, serving as a beacon of Italian winemaking excellence.",
                classifications: [
                        { name: 'Brunello di Montalcino', criteria: 'Premium Varietal', description: 'The absolute pinnacle of the variety, using 100% Sangiovese Grosso for monumental structure and aging potential.' },
                        { name: 'Chianti Classico', criteria: 'Regional Tier', description: 'Represented by the Black Rooster logo, these wines offer the definitive classic and elegant Tuscan style.' },
                        { name: 'Super Tuscan Blend', criteria: 'Modern Blend', description: 'Powerful and contemporary styles where Sangiovese is married with grapes like Cabernet Sauvignon.' }
                ],
                sensoryMetrics: [
                        { label: 'Acidity', metric: 'Crispness', value: '9/10', description: 'Energetic and bright acidity that makes it a peerless food companion.' },
                        { label: 'Tannins', metric: 'Astringency', value: '8/10', description: 'Strong, structural tannins that provide a firm and long finish.' },
                        { label: 'Aroma', metric: 'Complexity', value: 'High', description: 'A storied bouquet of red cherry, dried herbs, scorched clay, and leather.' }
                ],
                flavorTags: [
                        { label: 'Red Cherry', color: 'bg-red-200/20 text-red-700' },
                        { label: 'Dried Herbs', color: 'bg-green-100/20 text-green-800' },
                        { label: 'Earth / Leather', color: 'bg-amber-900/20 text-amber-900' }
                ],
                manufacturingProcess: [
                        { step: 'Fermentation', name: 'Traditional Lengthy Maceration', description: 'Requires extended contact with skins to extract its hallmark complexity and structural depth.' },
                        { step: 'Aging', name: 'Diverse Oak Aging', description: 'Varies from maturation in large Slavonian oak vats (Botte) to contemporary French barriques depending on the desired style.' }
                ],
                majorRegions: [
                        { name: 'Tuscany', description: 'The undisputed spiritual home, containing the storied sub-zones of Chianti and Montalcino.', emoji: '🇮🇹' },
                        { name: 'Romagna', description: 'Focuses on producing softer, more fruit-forward expressions of the variety.', emoji: '🇮🇹' }
                ],
                servingGuidelines: {
                        recommendedGlass: 'Standard Red or Tulip-shaped Wine glass with a moderate bowl',
                        optimalTemperatures: [
                                { temp: '16–18°C', description: 'The sweet spot for balancing its lively acidity with its classic red fruit profile.' }
                        ],
                        decantingNeeded: true
                },
                foodPairing: ['Tomato-based pasta', 'Florentine T-bone steak', 'Salami and Prosciutto', 'Rich Ragu sauces']
        },
        dbCategories: ['과실주'],
        dbSubcategoryKeywords: ['산조베제', 'sangiovese', 'BDM', 'chianti']
}