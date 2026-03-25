import { SpiritCategory } from '../types'

export const zweigelt: SpiritCategory = {
    slug: 'zweigelt',
    emoji: '🥨',
    nameKo: '쯔바이겔트',
    nameEn: 'Zweigelt',
    taglineKo: '오스트리아의 활기, 체리 향의 축제와 부드러운 유혹',
    taglineEn: 'The vitality of Austria, a festival of cherry aromas and soft temptation',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '쯔바이겔트(Zweigelt)는 오스트리아에서 가장 널리 재배되는 상징적인 레드 품종입니다. 1922년 프리드리히 쯔바이겔트 박사에 의해 생 로랑(St. Laurent)과 블라우프랭키슈(Blaufränkisch)의 교배로 탄생했습니다. 부모 품종의 장점만을 이어받아, 신선한 레드 체리와 라즈베리의 화사한 과실향, 그리고 매끄럽고 접근성 좋은 타닌이 특징인 "오스트리아 레드의 얼굴"입니다.',
        history: '탄생 이후 오스트리아 전역에 빠르게 퍼졌으며, 특히 부르겐란트(Burgenland)와 니더외스터라이히 지역의 다양한 테루아에서 성공적으로 자리 잡았습니다. 과거에는 가벼운 일상 와인으로 주로 소비되었으나, 최근에는 고목에서 수확한 포도를 오크 숙성하여 압도적인 농축미를 보여주는 프리미엄 쯔바이겔트들이 등장하며 오스트리아 와인의 위상을 높이고 있습니다.',
        classifications: [
            { name: 'Classic Zweigelt', criteria: '신선한 스타일', description: '오크 사용을 최소화하여 체리와 베리의 생동감 넘치는 과실미를 강조한 스타일' },
            { name: 'Reserve Zweigelt', criteria: '숙성 스타일', description: '선별된 포도를 오크통에서 숙성하여 깊은 바디감과 복합미를 갖춘 상급 와인' },
            { name: 'Neusiedlersee DAC', criteria: '산지 등급', description: '노이지들러 호수 주변의 노른자위 땅에서 생산되는 전형적이고 고품질의 쯔바이겔트' }
        ],
        sensoryMetrics: [
            { label: '과실향 (Fruitiness)', metric: '산뜻함', value: '10/10', description: '잔을 채우는 붉은 체리와 라즈베리의 강력한 존재감' },
            { label: '타닌 (Tannins)', metric: '수렴성', value: '5/10', description: '누구나 편안하게 즐길 수 있는 부드럽고 둥근 질감' },
            { label: '바디 (Body)', metric: '무게감', value: '6/10', description: '적당한 무게감과 기분 좋은 목 넘김' }
        ],
        flavorTags: [
            { label: '레드 체리', color: 'bg-red-200/20 text-red-700' },
            { label: '라즈베리', color: 'bg-pink-100/20 text-pink-700' },
            { label: '다크 초콜릿', color: 'bg-stone-800/20 text-stone-900' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '중단기 저온 침출', description: '쯔바이겔트 특유의 화사한 과실 아로마를 보존하기 위해 정교하게 온도를 조절하며 발효합니다.' },
            { step: '숙성', name: '점진적 오크 숙성', description: '품종의 과실감을 가리지 않으면서도 골격을 잡아주기 위해 주로 큰 오크통이나 중고 바리크를 사용합니다.' }
        ],
        majorRegions: [
            { name: '부르겐란트 (Burgenland)', description: '쯔바이겔트가 가장 풍요롭게 자라나는 오스트리아의 핵심 산지', emoji: '🇦🇹' },
            { name: '니더외스터라이히', description: '다양한 테루아를 반영한 세련된 스타일의 쯔바이겔트 생산지', emoji: '🇦🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준형 레드 와인 또는 볼이 약간 넓은 글라스',
            optimalTemperatures: [
                { temp: '14-16°C', description: '특유의 활기찬 레드 베리 향이 가장 생생하게 살아나는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['오스트리아식 돈가스(슈니첼)', '구운 가축 요리', '풍미 있는 버섯 요리', '연성 치즈']
    },
    sectionsEn: {
        definition: "Zweigelt is the most widely planted and iconic red variety in Austria. Created in 1922 by Dr. Friedrich Zweigelt through the crossing of St. Laurent and Blaufränkisch, it brilliantly inherits the best traits of its parents. Celebrated as the 'Face of Austrian Reds,' it is distinguished by its vibrant aromatics of fresh red cherries and raspberries, supported by supple, approachable tannins.",
        history: "Since its creation, Zweigelt has expanded rapidly across Austria, finding exceptional success in the diverse terroirs of Burgenland and Lower Austria. While historically valued for producing lively, everyday table wines, the variety is now increasingly utilized for premium, oak-aged expressions. These high-end wines, often sourced from old vines, showcase incredible concentration and depth, lifting the global prestige of Austrian red wine.",
        classifications: [
            { name: 'Classic Zweigelt', criteria: 'Fresh Style', description: 'Un-oaked or minimally oaked wines that emphasize pure, vibrant forest fruit character.' },
            { name: 'Reserve Zweigelt', criteria: 'Aging Style', description: 'Premium wines matured in barrel to introduce structural depth and secondary complexities like chocolate.' },
            { name: 'Neusiedlersee DAC', criteria: 'Regional Tier', description: "The flagship designation for high-quality, authentic Zweigelt from the shores of Lake Neusiedl." }
        ],
        sensoryMetrics: [
            { label: 'Fruitiness', metric: 'Zest', value: '10/10', description: 'An exuberant core of red cherry and raspberry that defines the variety.' },
            { label: 'Tannins', metric: 'Astringency', value: '5/10', description: 'Famously smooth and round, making it exceptionally approachable in its youth.' },
            { label: 'Body', metric: 'Weight', value: '6/10', description: 'A satisfying medium-bodied presence with a supple, silken finish.' }
        ],
        flavorTags: [
            { label: 'Red Cherry', color: 'bg-red-200/20 text-red-700' },
            { label: 'Raspberry', color: 'bg-pink-100/20 text-pink-700' },
            { label: 'Dark Chocolate', color: 'bg-stone-800/20 text-stone-900' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Gentle Maceration', description: 'Utilizes cold-soaking and temperature-controlled fermentation to preserve the fugitive primary fruit aromatics.' },
            { step: 'Aging', name: 'Strategic Maturation', description: 'Often matured in large, neutral oak casks or seasoned barriques to soften the wine without masking its fruit profile.' }
        ],
        majorRegions: [
            { name: 'Burgenland', description: "Austria's red wine powerhouse and the spiritual heartland for the finest Zweigelt.", emoji: '🇦🇹' },
            { name: 'Lower Austria', description: 'Produces elegant and focused expressions from diverse, cooler-climate terroirs.', emoji: '🇦🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard Red Wine or slightly wide Burgundy-style glass',
            optimalTemperatures: [
                { temp: '14–16°C', description: 'Ideal for enhancing its bright berry aromatics and smooth mouthfeel.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Wiener Schnitzel', 'Roasted poultry or game', 'Savory mushroom dishes', 'Soft-ripened cheeses']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['쯔바이겔트', 'zweigelt', '오스트리아']
}
