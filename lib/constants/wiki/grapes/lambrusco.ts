import { SpiritCategory } from '../types'

export const lambrusco: SpiritCategory = {
    slug: 'lambrusco',
    emoji: '🍕',
    nameKo: '람브루스코',
    nameEn: 'Lambrusco',
    taglineKo: '에밀리아의 붉은 기포, 미식을 완성하는 기분 좋은 청량함의 마법',
    taglineEn: 'Emilias red bubbles, the magic of pleasant freshness that completes gastronomy',
    color: 'red',
    hideFromWikiHubGrid: true,
    sections: {
        definition: '람브루스코(Lambrusco)는 이탈리아 에밀리아-로마냐 지역을 대표하는 세계적인 레드 스파크링 와인 품종입니다. "레드 와인이 기포를 가졌다"는 독특한 개성과 함께, 딸기와 라즈베리의 화사한 과실향, 그리고 입안을 씻어주는 날카로운 산미가 특징입니다. 가벼운 당도가 있는 스타일부터 드라이한 스타일까지, 이탈리아 미식 문화의 정점인 파르마 햄이나 루 등 무거운 요리와 가장 완벽한 조화를 이룹니다.',
        history: '이름은 고대 에트루리아 언어인 "라브루스카(Labrusca, 야생 포도)"에서 유래했을 만큼 야생적인 생명력을 지닌 품종입니다. 20세기 후반에는 저렴한 스위트 와인으로 대량 생산되어 이미지가 실추되기도 했으나, 최근에는 명망 있는 생산자들에 의해 람브루스코 고유의 섬세함과 복합미를 살린 프리미엄 드라이 스타일이 복원되면서 전 세계 힙한 와인바의 필수 리스트로 자리 잡았습니다.',
        classifications: [
            { name: 'Lambrusco di Sorbara', criteria: '최고급 스타일', description: '가장 옅은 색상과 날카로운 산도, 우아한 꽃향기를 지닌 람브루스코의 정점' },
            { name: 'Lambrusco Grasparossa', criteria: '진한 스타일', description: '잉크처럼 진한 색상과 탄탄한 타닌, 묵직한 바디감을 지닌 파워풀한 스타일' },
            { name: 'Secco / Amabile / Dolce', criteria: '당도 등급', description: '드라이(Secco)부터 매우 달콤한(Dolce) 스타일까지 취향에 맞는 다양한 선택' }
        ],
        sensoryMetrics: [
            { label: '기포 (Effervescence)', metric: '청량감', value: '8/10', description: '입안을 가볍게 자극하는 섬세하고 활기찬 기포' },
            { label: '과실향 (Fruitiness)', metric: '강도', value: '9/10', description: '갓 딴 베리류의 신선하고 폭발적인 아로마' },
            { label: '산도 (Acidity)', metric: '청량감', value: '9/10', description: '느끼한 음식을 금세 씻어주는 날렵하고 높은 산미' }
        ],
        flavorTags: [
            { label: '야생 딸기', color: 'bg-red-200/20 text-red-600' },
            { label: '보라색 꽃', color: 'bg-purple-100/20 text-purple-700' },
            { label: '발사믹', color: 'bg-stone-200/20 text-stone-800' }
        ],
        manufacturingProcess: [
            { step: '발효', name: '샤르마 방식 (Charmat)', description: '과실의 신선함을 극대화하기 위해 대형 스테인리스 탱크에서 2차 발효를 진행합니다.' },
            { step: '블렌딩', name: '품종 블렌딩', description: '솔바라, 그라스파로사 등 다양한 람브루스코 변종을 섞어 원하는 색과 질감을 완성합니다.' }
        ],
        majorRegions: [
            { name: '모데나 (Modena)', description: '람브루스코의 정통성과 최고의 품질이 집중된 핵심 지역', emoji: '🇮🇹' },
            { name: '레조 에밀리아', description: '다채롭고 풍성한 스타일의 람브루스코가 생산되는 산지', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: '표준 와인 글라스 또는 볼이 약간 넓은 샴페인 글라스',
            optimalTemperatures: [
                { temp: '10-13°C', description: '기포의 신선함과 레드 와인의 과실향이 가장 맛있게 느껴지는 온도' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['파르마 햄과 프로슈토', '라구 소스 파스타', '페퍼로니 피자', '볼로냐 소시지(모르타델라)']
    },
    sectionsEn: {
        definition: "Lambrusco is a world-class red sparkling variety that defines the gastronomic identity of Italy's Emilia-Romagna. Offering a unique fusion of red wine depth and effervescent energy, it is prized for its vibrant bouquet of strawberries and raspberries, supported by a bracing, palate-cleansing acidity. Ranging from bone-dry to delightfully sweet, it is the legendary companion for the rich, cured meats and pastas that sit at the apex of Italian cuisine.",
        history: "Derived from the ancient Etruscan word 'Labrusca' (wild vine), the grape possesses a rugged, natural vitality. While its reputation suffered in the late 20th century due to mass-produced sweet versions, a new generation of dedicated producers has spearheaded a prestige revolution. Today, high-quality dry Lambrusco—noted for its elegance and mineral depth—is a staple in the world's most sophisticated and trend-setting wine bars.",
        classifications: [
            { name: 'Lambrusco di Sorbara', criteria: 'Premium Style', description: 'The most elegant expression, known for its pale color, electric acidity, and floral aromatics.' },
            { name: 'Lambrusco Grasparossa', criteria: 'Robust Style', description: 'Distinguished by its inky depth, firmer tannins, and a more substantial physical presence.' },
            { name: 'Secco / Amabile / Dolce', criteria: 'Sugar Grade', description: 'Ranges from bone-dry (Secco) to lusciously sweet (Dolce), catering to every palate.' }
        ],
        sensoryMetrics: [
            { label: 'Effervescence', metric: 'Crispness', value: '8/10', description: 'Vibrant and persistent bubbles that provide a refreshing lift.' },
            { label: 'Fruitiness', metric: 'Intensity', value: '9/10', description: 'A concentrated explosion of fresh forest berries and wild florals.' },
            { label: 'Acidity', metric: 'Structure', value: '9/10', description: 'Razor-sharp acidity that effortlessly cuts through rich, fatty cuisine.' }
        ],
        flavorTags: [
            { label: 'Wild Strawberry', color: 'bg-red-200/20 text-red-600' },
            { label: 'Violet / Hibiscus', color: 'bg-purple-100/20 text-purple-700' },
            { label: 'Balsamic Edge', color: 'bg-stone-200/20 text-stone-800' }
        ],
        manufacturingProcess: [
            { step: 'Fermentation', name: 'Charmat Method', description: 'Conducted in pressurized stainless steel tanks to capture the grape’s youthful and exuberant fruit character.' },
            { step: 'Selection', name: 'Clonal Precision', description: 'Vintners carefully select specific clones like Sorbara or Salamino to achieve the desired balance of color and tannin.' }
        ],
        majorRegions: [
            { name: 'Modena', description: 'The absolute spiritual heartland for the highest quality and most authentic expressions.', emoji: '🇮🇹' },
            { name: 'Reggio Emilia', description: 'A key region for diverse, full-flavored, and traditionally crafted styles.', emoji: '🇮🇹' }
        ],
        servingGuidelines: {
            recommendedGlass: 'Standard Red Wine glass or a slightly wide Tulip glass',
            optimalTemperatures: [
                { temp: '10–13°C', description: 'Best for showcasing the refreshing bubbles alongside its characteristic red berry aromatics.' }
            ],
            decantingNeeded: false
        },
        foodPairing: ['Parma ham and Prosciutto', 'Pasta al Ragu', 'Pepperoni Pizza', 'Mortadella and Parmigiano-Reggiano']
    },
    dbCategories: ['과실주'],
    dbSubcategoryKeywords: ['람브루스코', 'lambrusco', '에밀리아 로마냐']
}
