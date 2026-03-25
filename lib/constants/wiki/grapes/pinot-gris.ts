import { SpiritCategory } from '../types'

export const pinotGris: SpiritCategory = {
    slug: 'pinot-gris',
    emoji: '🍑',
    nameKo: '피노 그리 (피노 그리지오)',
    nameEn: 'Pinot Gris (Pinot Grigio)',
    taglineKo: '회색빛의 반전, 풍성한 질감과 상쾌한 산미의 두 얼굴',
    taglineEn: 'The twist of gray, the two faces of rich texture and refreshing acidity',
    color: 'yellow',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '피노 그리(Pinot Gris)는 피노 누아의 변종으로, 분홍빛이 도는 회색 껍질을 가진 화이트 품종입니다. 양조 스타일에 따라 프랑스식의 풍성하고 오일리한 "피노 그리"와 이탈리아식의 가볍고 산뜻한 "피노 그리지오(Pinot Grigio)"로 나뉩니다. 산뜻한 사과, 배 향부터 잘 익은 열대 과실과 꿀 풍미까지 넓은 스펙트럼을 보여주며, 입안을 매끄럽게 감싸는 특유의 질감이 매력적입니다.',
        history: '부르고뉴에서 유래했으나 오늘날에는 프랑스 알자스와 이탈리아 북부에서 가장 화려하게 꽃피웠습니다. 중세 시대에는 헝가리로 건너가 "수르케바라트(Szürkebarát, 회색 친구)"라는 이름으로 사랑받기도 했습니다. 단일 품종임에도 불구하고 생산자의 철학과 지역 테루아에 따라 완전히 다른 성격을 보여주는 카멜레온 같은 품종으로, 전 세계 화이트 와인 시장에서 독보적인 인기를 유지하고 있습니다.',
        classifications: [
            { name: 'Alsace Pinot Gris', criteria: '프랑스 스타일', description: '풀바디의 묵직한 질감과 복합적인 아로마를 지닌 숙성 잠재력이 큰 스타일' },
            { name: 'Italian Pinot Grigio', criteria: '이탈리아 스타일', description: '가볍고 청량하며 직선적인 산미를 강조한 마시기 편한 스타일' },
            { name: 'Pinot Grigio Rosato', criteria: '로제 스타일', description: '껍질 침출을 통해 연한 분홍색을 띤 구리빛(Ramato)의 로제 와인' }
        ],
        sensoryMetrics: [
            { label: '바디 (Body)', metric: '무게감', value: '7/10', description: '화이트 와인 중에서도 상대적으로 높은 유질감과 두께감' },
            { label: '산도 (Acidity)', metric: '청량감', value: '5/10', description: '온화하고 부드러운 산미 (알자스) 또는 바삭한 산미 (이탈리아)' },
            { label: '아로마 (Aroma)', metric: '강도', value: 'Medium', description: '배, 복숭아, 그리고 은은한 스파이시함' }
        ],
        flavorTags: [
            { label: '서양배', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: '복숭아', color: 'bg-orange-100/20 text-orange-700' },
            { label: '아몬드', color: 'bg-amber-100/20 text-amber-800' }
        ],
        manufacturingProcess: [
            { step: '침출', name: '스킨 컨택 (Skin Contact)', description: '질감을 더하고 풍미를 농축하기 위해 때때로 포도 껍질과 함께 짧게 침출합니다.' },
            { step: '숙성', name: '앙금 숙성 (Lees)', description: '특유의 크리미한 질감을 극대화하기 위해 효모 앙금과 함께 숙성 과정을 거치기도 합니다.' }
        ],
        majorRegions: [
            { name: '알자스 (Alsace)', description: '풍성하고 복합미 넘치는 세계 최고의 피노 그리 산지', emoji: '🇫🇷' },
            { name: '베네토 & 프리울리', description: '전 세계적으로 유행하는 피노 그리지오 스타일의 본고장', emoji: '🇮🇹' },
            { name: '오리건 (Oregon)', description: '미국 내에서 가장 우아하고 균형 잡힌 피노 그리 생산지로 명성', emoji: '🇺🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준형 화이트 와인 글라스',
            optimalTemperatures: [
                { temp: '8-10°C', description: '이탈리아식 그리지오 스타일의 상쾌함을 즐기기에 적합' },
                { temp: '10-12°C', description: '알자스식 피노 그리 특유의 풍부한 향을 느끼기에 적합' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['해산물 프리토(튀김)', '크림 파스타', '태국식 볶음 요리', '구운 가금류']
    },
    sectionsEn: {
        definition: "Pinot Gris is a genetic variant of Pinot Noir, known for its distinctive copper-gray skins. Based on the winemaking style, it is categorized into two archetypes: the French 'Pinot Gris'—rich, oily, and full-bodied—and the Italian 'Pinot Grigio'—light, crisp, and refreshing. It spans a vast spectrum of flavors from fresh green apple and pear to lush tropical fruit and honeyed complexity, all tied together by its hallmark silken texture.",
        history: "Originally from Burgundy, Pinot Gris achieved global fame through the grand cru vineyards of Alsace and the high-volume success of Northern Italy. In the Middle Ages, it was also celebrated in Hungary as 'Szürkebarát' (Gray Friend). A true chameleon of the wine world, it reflects the philosophy of the winemaker and the terroir of the land more than most varieties, ensuring its enduring popularity across the globe.",
        classifications: [
            { name: 'Alsace Pinot Gris', criteria: 'French Style', description: 'Full-bodied, complex, and capable of significant bottle aging.' },
            { name: 'Italian Pinot Grigio', criteria: 'Italian Style', description: 'Light, zesty, and focused on clean acidity for immediate enjoyment.' },
            { name: 'Pinot Grigio Rosato', criteria: 'Rosé Style', description: "Often called 'Ramato,' these copper-hued or pink wines result from brief skin contact with the grape’s darker skins." }
        ],
        sensoryMetrics: [
            { label: 'Body', metric: 'Weight', value: '7/10', description: 'Relatively high viscousity and mouth-coating richness for a white.' },
            { label: 'Acidity', metric: 'Crispness', value: '5/10', description: 'Moderate and soft in Alsace; bright and crunchy in Italian styles.' },
            { label: 'Aroma', metric: 'Intensity', value: 'Medium', description: 'Dominated by pear, peach, and subtle spicy undertones.' }
        ],
        flavorTags: [
            { label: 'Pear', color: 'bg-yellow-100/20 text-yellow-700' },
            { label: 'Peach', color: 'bg-orange-100/20 text-orange-700' },
            { label: 'Almond', color: 'bg-amber-100/20 text-amber-800' }
        ],
        manufacturingProcess: [
            { step: 'Maceration', name: 'Skin Contact', description: 'Sometimes used to extract color and phenolic depth, enhancing the variety’s textural appeal.' },
            { step: 'Aging', name: 'Lees Maturation', description: 'Conducted post-fermentation to maximize the creamy and expansive mouthfeel associated with the variety.' }
        ],
        majorRegions: [
            { name: 'Alsace', description: 'The premier global region for dense, complex, and powerful Pinot Gris.', emoji: '🇫🇷' },
            { name: 'Veneto & Friuli', description: 'The ancestral and largest producing area for the light and zesty Pinot Grigio style.', emoji: '🇮🇹' },
            { name: 'Oregon', description: "Recognized as the premier American site for producing balanced and sophisticated Pinot Gris.", emoji: '🇺🇸' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard White Wine glass',
            optimalTemperatures: [
                { temp: '8–10°C', description: 'Best for emphasizing the zesty freshness of the Italian style.' },
                { temp: '10–12°C', description: 'Allows the rich bouquet and texture of Alsatian styles to truly emerge.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Seafood Fritto', 'Creamy pasta', 'Thai stir-fry', 'Roasted poultry']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['피노 그리', 'pinot gris', '피노 그리지오', 'pinot grigio']
}
