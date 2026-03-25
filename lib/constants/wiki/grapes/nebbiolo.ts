import { SpiritCategory } from '../types'

export const nebbiolo: SpiritCategory = {
    slug: 'nebbiolo',
    emoji: '🌫️',
    nameKo: '네비올로',
    nameEn: 'Nebbiolo',
    taglineKo: '안개의 전설, 야수 같은 타닌 속에 숨겨진 장미와 타르의 우아함',
    taglineEn: 'The legend of fog, the elegance of rose and tar hidden within beastly tannins',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '네비올로(Nebbiolo)는 이탈리아 피에몬테를 상징하는 세상에서 가장 고귀하고 까다로운 레드 품종입니다. 옅은 루비색과 달리 입안에서는 폭발적인 타닌과 높은 산도를 지녀 "장미와 타르(Roses and Tar)"라는 독보적인 표현으로 묘사됩니다. 시간이 흐를수록 벽돌 색조로 변하며 흙, 트러플, 그리고 말린 꽃향기의 복합적인 층을 만들어내는, 명실상부한 "와인의 왕(Barolo)"의 품격 그 자체입니다.',
        history: '이름은 피에몬테의 수확기에 끼는 안개(Nebbia)에서 유래했을 만큼 지역 테루아와 밀접한 관련이 있습니다. 13세기부터 이미 고품질 와인으로 명성을 얻었으며, 사보이 왕가의 사랑을 받으며 "왕의 와인, 와인의 왕"이라는 칭호를 얻었습니다. 피에몬테의 랑게(Langhe) 지역 외에는 전 세계 어디에서도 그 위대한 잠재력을 완벽히 드러내지 않는, 지독하게도 로컬 테루아를 고집하는 품종으로도 유명합니다.',
        classifications: [
            { name: 'Barolo DOCG', criteria: '최고급 산지', description: '강력한 타닌과 웅장한 구조감, 수십 년의 숙성력을 지닌 네비올로의 정점' },
            { name: 'Barbaresco DOCG', criteria: '산지 스타일', description: '바롤로보다 약간 더 우아하고 부드러운 질감을 지닌 고귀한 네비올로' },
            { name: 'Langhe Nebbiolo', criteria: '대중성', description: '더 가볍고 일찍 마실 수 있는 접근성 좋은 스타일의 네비올로' }
        ],
        sensoryMetrics: [
            { label: '타닌 (Tannins)', metric: '수렴성', value: '10/10', description: '입안을 꽉 죄는 압도적이고 강력한 타닌' },
            { label: '산도 (Acidity)', metric: '청량감', value: '9/10', description: '타닌과 조화를 이루는 매우 높고 견고한 산미' },
            { label: '색상 (Color)', metric: '농도', value: '3/10', description: '피노 누아처럼 맑고 투명하며 오렌지색 띠를 두른 옅은 루비' }
        ],
        flavorTags: [
            { label: '장미 꽃잎', color: 'bg-pink-100/20 text-pink-700' },
            { label: '타르 (Tar)', color: 'bg-stone-800/20 text-stone-900' },
            { label: '트러플', color: 'bg-amber-900/20 text-amber-950' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '장기 침출', description: '극강의 구조감과 아로마를 얻기 위해 낮은 온도에서 아주 오랜 기간 껍질과 함께 침출 및 발효를 진행합니다.' },
            { step: '숙성', name: '대형 슬로베니아 오크 숙성', description: '바닐라 같은 오크 향을 최소화하고 품종 고유의 섬세함을 지키기 위해 주로 거대한 오크통(Botte)에서 수년간 숙성합니다.' }
        ],
        majorRegions: [
            { name: '랑게 (Langhe)', description: '바롤로와 바르바레스코가 위치한 네비올로의 절대적인 성지', emoji: '🇮🇹' },
            { name: '발텔리나 (Valtellina)', description: '롬바르디아의 가파른 테라스에서 생산되는 우아하고 섬세한 네비올로 산지', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '볼이 아주 넓은 대형 브루고뉴/피에몬테 전용 글라스',
            optimalTemperatures: [
                { temp: '18-20°C', description: '단단한 타닌이 풀리고 복합적인 장미와 흙 내음이 가장 풍성하게 열리는 온도' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['트러플 리조토', '숙성된 붉은 육류', '브레이즈드 비프(바롤로 알라 브라사토)', '강한 풍미의 숙성 치즈']
    },
    sectionsEn: {
        definition: "Nebbiolo is the flagship red grape of Italy's Piedmont, celebrated as one of the world's most noble and demanding varieties. Despite its pale ruby color, it delivers a formidable punch of explosive tannins and high acidity. It is quintessentially described as 'Roses and Tar'—a poetic duality of ethereal floral aromatics and rugged, earthy depth. As it matures, it develops complex layers of truffle, clay, and dried herbs, standing as the undisputed 'King of Wines.'",
        history: "Its name likely derives from 'Nebbia' (fog), a reference to the thick mist that blankets the Piedmont hills during the autumn harvest. Documented since the 13th century, it was the favored variety of the House of Savoy, earning the title 'Wine of Kings, King of Wines.' Famously terroir-sensitive, Nebbiolo rarely expresses its full grandeur outside its ancestral home in the Langhe hills.",
        classifications: [
            { name: 'Barolo DOCG', criteria: 'Premium Appellation', description: 'The pinnacle of Nebbiolo, known for massive tannins, grand structure, and legendary longevity.' },
            { name: 'Barbaresco DOCG', criteria: 'Regional Style', description: 'A more elegant and slightly softer counterpart to Barolo, yet maintaining noble complexity.' },
            { name: 'Langhe Nebbiolo', criteria: 'Accessibility', description: 'A fresher, younger style that offers a more immediate window into the grape’s character.' }
        ],
        sensoryMetrics: [
            { label: 'Tannins', metric: 'Astringency', value: '10/10', description: 'Overwhelmingly powerful and grippy in its youth.' },
            { label: 'Acidity', metric: 'Crispness', value: '9/10', description: 'Electric, high acidity that preserves structural integrity over decades.' },
            { label: 'Color', metric: 'Intensity', value: '3/10', description: 'Deceptively pale ruby with an orange-tinged rim.' }
        ],
        flavorTags: [
            { label: 'Rose Petals', color: 'bg-pink-100/20 text-pink-700' },
            { label: 'Tar', color: 'bg-stone-800/20 text-stone-900' },
            { label: 'Truffle', color: 'bg-amber-900/20 text-amber-950' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Extended Maceration', description: 'Involves prolonged contact with the skins at controlled temperatures to extract maximum structural polyphenols.' },
            { step: 'Aging', name: 'Traditional Large Cask (Botte)', description: 'Matured for years in massive Slavonian oak vats to preserve delicate aromatics while slowly integrating tannins.' }
        ],
        majorRegions: [
            { name: 'Langhe', description: 'The absolute spiritual heartland containing the Barolo and Barbaresco zones.', emoji: '🇮🇹' },
            { name: 'Valtellina', description: 'High-altitude terraces in Lombardy yielding a distinctively ethereal and mineral-driven Nebbiolo.', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Very large, wide-bowled Burgundy/Piedmont glass',
            optimalTemperatures: [
                { temp: '18–20°C', description: 'Essential for allowing its firm tannins to soften and its complex bouquet to unfurl.' }
            ],
            decantingNeeded: true
        },
        foodPairing: ['Truffle risotto', 'Aged red meats', 'Barolo-style braised beef', 'Strong matured cheeses']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['네비올로', 'nebbiolo']
}
