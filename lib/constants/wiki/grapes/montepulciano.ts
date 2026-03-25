import { SpiritCategory } from '../types'

export const montepulciano: SpiritCategory = {
    slug: 'montepulciano',
    emoji: '🍇',
    nameKo: '몬테풀치아노',
    nameEn: 'Montepulciano',
    taglineKo: '아브루초의 정직한 풍요, 탄탄한 타닌과 진한 과즙의 하모니',
    taglineEn: 'The honest abundance of Abruzzo, a harmony of firm tannins and rich juice',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '몬테풀치아노(Montepulciano)는 이탈리아 중부 아브루초(Abruzzo) 지역을 대표하는 가장 사랑받는 레드 품종입니다. 진한 보랏빛이 감도는 색조와 입안을 꽉 채우는 블랙베리, 자두의 풍성한 과실미, 그리고 벨벳처럼 부드러운 타닌이 특징입니다. 합리적인 가격대에 뛰어난 품질을 보여주며, 이탈리아 식탁에서 결코 빠지지 않는 "대중의 친구" 같은 품종입니다.',
        history: '이름 때문에 토스카나의 도시 몬테풀치아노(비노 노빌레 디 몬탈치노의 산지)와 혼동되기도 하지만, 실제로는 아드리아해 연안의 아브루초 지역에 뿌리를 둔 별개의 품종입니다. 수 세기 동안 지역 주민들의 일상 와인으로 사랑받아 왔으며, 최근에는 고목(Old Vines)에서 생산되는 집중도 높은 프리미엄 와인들을 통해 국제적인 명성을 확고히 하고 있습니다.',
        classifications: [
            { name: 'Montepulciano d\'Abruzzo', criteria: '주요 등급', description: '아브루초의 뜨거운 태양과 해풍이 만들어낸, 진한 과실향과 부드러운 타닌의 정석' },
            { name: 'Cerasuolo d\'Abruzzo', criteria: '로제 스타일', description: '체리색(Cerasuolo)을 띤, 레드 와인에 가까운 묵직한 힘과 풍미를 지닌 최고의 로제 와인' },
            { name: 'Riserva Montepulciano', criteria: '숙성 등급', description: '오랜 시간 오크 숙성을 거쳐 초콜릿, 가죽, 감초 아로마를 입힌 웅장한 스타일' }
        ],
        sensoryMetrics: [
            { label: '색상 (Color)', metric: '농도', value: '10/10', description: '잉크처럼 진하고 선명한 루비-퍼플 색조' },
            { label: '바디 (Body)', metric: '무게감', value: '8/10', description: '중량감 있게 입안을 감싸는 매끄러운 바디감' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '6/10', description: '힘이 있지만 모나지 않고 부드러운 질감' }
        ],
        flavorTags: [
            { label: '블랙베리', color: 'bg-purple-900/20 text-purple-900' },
            { label: '붉은 자두', color: 'bg-red-200/20 text-red-700' },
            { label: '오레가노', color: 'bg-green-100/20 text-green-800' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '장기 침출', description: '몬테풀치아노 특유의 진한 색과 풍미를 최대한 뽑아내기 위해 껍질과 함께 충분히 발효합니다.' },
            { step: '숙성', name: '전통적 숙성', description: '신선한 과실미를 살리기 위한 스테인리스 숙성부터, 깊이를 더하기 위한 대형 오크통 숙성까지 다양하게 진행합니다.' }
        ],
        majorRegions: [
            { name: '아브루초 (Abruzzo)', description: '몬테풀치아노가 가장 정열적이고 풍요롭게 자라나는 절대적 본거지', emoji: '🇮🇹' },
            { name: '마르케 (Marche)', description: '로쏘 코네로 등을 통해 보다 우아한 스타일의 몬테풀치아노를 생산하는 곳', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '넉넉한 볼을 가진 표준 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '16-18°C', description: '진한 검은 과실 풍미와 부드러운 타닌이 가장 균형 있게 느껴지는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['미트볼 파스타', '구운 돼지갈비', '중등도 숙성 치즈', '매콤한 라구 소스 요리']
    },
    sectionsEn: {
        definition: "Montepulciano is the beloved hallmark red grape of Central Italy's Abruzzo region. It is characterized by its deep, inky violet-ruby hue, an expansive palate of blackberries and ripe plums, and famously soft, velvet-like tannins. Offering exceptional quality and value, it is widely cherished across Italy as a reliable 'Friend of the People,' fitting seamlessly into any dining occasion.",
        history: "Despite sharing a name with the Tuscan town of Montepulciano, this grape is entirely distinct and indigenous to the Adriatic coast of Abruzzo. While long celebrated as the daily wine of the region, it has recently achieved international acclaim through the production of high-concentration, old-vine expressions. These modern premiums highlight the grape’s potential for profound depth and long-term aging.",
        classifications: [
            { name: "Montepulciano d'Abruzzo", criteria: 'Primary DOC', description: 'The absolute standard: intense fruit, moderate acidity, and incredibly approachable tannins.' },
            { name: "Cerasuolo d'Abruzzo", criteria: 'Rosé Style', description: "A deep cherry-colored ('Cerasuolo') wine that offers the physical power and complexity closer to a light red than a typical rosé." },
            { name: 'Riserva Montepulciano', criteria: 'Aging Tier', description: 'Matured for extended periods in oak to develop secondary notes of chocolate, licorice, and leather.' }
        ],
        sensoryMetrics: [
            { label: 'Color', metric: 'Intensity', value: '10/10', description: 'Nearly opaque purple-ruby in concentrated versions.' },
            { label: 'Body', metric: 'Weight', value: '8/10', description: 'Features a smooth, generous, and satisfying bodily presence.' },
            { label: 'Tannins', metric: 'Astringency', value: '6/10', description: 'Characteristically fine-grained and approachable even in its youth.' }
        ],
        flavorTags: [
            { label: 'Blackberry', color: 'bg-purple-900/20 text-purple-900' },
            { label: 'Red Plum', color: 'bg-red-200/20 text-red-700' },
            { label: 'Oregano', color: 'bg-green-100/20 text-green-800' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Extended Maceration', description: 'Utilized to extract the grape’s immense pigment and rich phenolic profile without introducing bitterness.' },
            { step: 'Aging', name: 'Traditional Maturation', description: 'Varies from stainless steel to maintain freshness to large oak vats for building structural complexity.' }
        ],
        majorRegions: [
            { name: 'Abruzzo', description: 'The undisputed spiritual heartland where the variety reaches its most authentic and exuberant form.', emoji: '🇮🇹' },
            { name: 'Marche', description: 'Produces elegant and structured expressions, most notably under the Rosso Cònero designation.', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Generous, rounded standard Red Wine glass',
            optimalTemperatures: [
                { temp: '16–18°C', description: 'The ideal range for enjoying its juicy fruit intensity alongside its smooth tannin structure.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Pasta with meatballs', 'Sticky BBQ ribs', 'Medium-aged hard cheeses', 'Rich, spicy Ragu dishes']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['몬테풀치아노', 'montepulciano d\'abruzzo', 'montepulciano']
}
