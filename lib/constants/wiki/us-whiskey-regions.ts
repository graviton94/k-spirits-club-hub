import { SpiritCategory } from './types'

export const usWhiskeyRegions: SpiritCategory = {
    slug: 'us-whiskey-regions',
    emoji: '🇺🇸',
    nameKo: '미국 위스키 지역 가이드',
    nameEn: 'American Whiskey Regions Guide',
    taglineKo: '켄터키 버번 벨트부터 테네시, 신흥 아메리칸 싱글몰트까지 — 미국 위스키 산지의 모든 것',
    taglineEn: 'From the Kentucky Bourbon Belt to Tennessee and the rise of American Single Malt — a complete regional guide',
    color: 'amber',
    sections: {
        definition: '미국 위스키는 단순히 "버번"으로만 이뤄지지 않는다. 켄터키의 버번 벨트에서 출발하는 전통적인 스타일을 중심으로, 테네시의 독자적인 공정, 동부 해안의 라이 위스키 전통, 그리고 최근 급부상한 신흥 아메리칸 싱글몰트까지 — 미국의 지리적 다양성은 각기 다른 토질, 기후, 물, 곡물 문화와 결합해 세계 어디에도 없는 독창적인 위스키 문화를 만들어냈다.',
        history: '미국 위스키의 역사는 18세기 후반 스코틀랜드·아일랜드 이민자들이 가져온 증류 기술에서 비롯된다. 켄터키의 석회암 여과수, 비옥한 옥수수 농업, 다목적 오크 자원이 결합하며 버번이 발전했다. 1897년 "Bottled-in-Bond Act", 1897~1960년대 금주법의 도전, 1964년 의회의 "미국의 고유 증류주" 공식 선언을 거치며 버번은 오늘날 세계 최대의 프리미엄 위스키 카테고리로 성장했다. 2010년대 이후 크래프트 증류소 붐과 함께 아메리칸 싱글몰트라는 새로운 카테고리도 부상하고 있다.',
        classifications: [
            {
                name: '켄터키 (Kentucky) — 버번의 고향',
                criteria: '법적으로 버번은 미국 어디서나 생산 가능하지만, 전체 버번의 약 95%가 켄터키에서 생산됨 | 대표 증류소: 버팔로 트레이스, 헤븐 힐, 포 로지스, 메이커스 마크, 짐 빔, 와일드 터키',
                description: '켄터키가 버번의 심장인 이유는 지리학적 조건에 있다. 석회암(Limestone) 지층을 통과한 지하수는 철분이 제거되고 칼슘과 마그네슘이 풍부해진다. 이 물이 발효와 숙성에서 독특한 결과를 만들어낸다. 또한 켄터키의 극단적인 온도 편차(여름 35℃ / 겨울 -15℃)가 버번을 오크 안에서 빠르게 팽창·수축시켜 다른 지역보다 훨씬 빠른 "숙성 가속 효과"를 만든다. 이것이 켄터키 버번의 바닐라·카라멜이 타 지역보다 더 진하고 빠르게 발현되는 비결이다.',
                flavorTags: [
                    { label: '바닐라/카라멜', color: 'bg-amber-500/20 text-zinc-950 dark:text-amber-300' },
                    { label: '오크/토스트', color: 'bg-stone-600/20 text-zinc-950 dark:text-stone-300' },
                    { label: '토피/메이플', color: 'bg-amber-700/20 text-zinc-950 dark:text-amber-500' },
                    { label: '과실(체리·사과)', color: 'bg-rose-500/20 text-zinc-950 dark:text-rose-300' },
                ]
            },
            {
                name: '테네시 (Tennessee) — 버번이 아닌 테네시 위스키',
                criteria: '법적으로 "테네시 위스키"는 버번의 모든 요건을 충족 + "링컨 카운티 공정(Lincoln County Process)" 의무 적용 | 대표 증류소: 잭 다니엘스, 조지 디켈, 벤자민 프리차드(예외적으로 LCP 미적용)',
                description: '테네시 위스키의 가장 큰 특징은 "링컨 카운티 공정"이다. 증류된 원액을 배럴에 넣기 전, 최소 10피트(약 3m) 두께의 사탕단풍나무 숯 층을 천천히 통과시켜 거친 요소를 걸러내는 것이다. 이 공정으로 테네시 위스키는 버번보다 훨씬 부드럽고 달콤하며 약간의 스모키한 숯 뉘앙스를 가진다. 잭 다니엘스의 "Jack Daniel\'s Old No.7"은 세계에서 가장 많이 팔리는 위스키다.',
                flavorTags: [
                    { label: '숯/스모키(은은)', color: 'bg-stone-700/20 text-zinc-950 dark:text-stone-300' },
                    { label: '바닐라/메이플', color: 'bg-amber-400/20 text-zinc-950 dark:text-amber-300' },
                    { label: '부드러움/크림', color: 'bg-yellow-200/20 text-zinc-950 dark:text-yellow-100' },
                    { label: '견과류/오크', color: 'bg-stone-500/20 text-zinc-950 dark:text-stone-300' },
                ]
            },
            {
                name: '라이 위스키 벨트 (Rye Country) — 동부 및 중부',
                criteria: '라이 위스키는 버번과 달리 호밀이 매시빌의 51% 이상 | 펜실베이니아, 메릴랜드 역사적 전통 / 현대 크래프트 산지: 뉴욕, 콜로라도 | 대표: 버들라이프, 세이어스 위스키',
                description: '라이 위스키는 미국 위스키의 또 다른 역사적 전통이다. 금주법 이전 펜실베이니아와 메릴랜드 스타일의 라이 위스키는 매우 풀바디하고 스파이시했다. 현재 라이 위스키는 크래프트 증류소 붐과 함께 부활하고 있으며, 호밀 특유의 후추·허브·드라이한 스파이스 덕분에 올드패션드, 맨해튼 등 클래식 칵테일 베이스로 강력한 존재감을 보인다.',
                flavorTags: [
                    { label: '후추/호밀 스파이스', color: 'bg-emerald-600/20 text-zinc-950 dark:text-emerald-300' },
                    { label: '드라이 허브', color: 'bg-green-500/20 text-zinc-950 dark:text-green-300' },
                    { label: '레몬/시트러스', color: 'bg-lime-400/20 text-zinc-950 dark:text-lime-300' },
                    { label: '오크/타닌', color: 'bg-stone-600/20 text-zinc-950 dark:text-stone-300' },
                ]
            },
            {
                name: '아메리칸 싱글몰트 (American Single Malt) — 신흥 크래프트 산지',
                criteria: '최근 ASMWC(아메리칸 싱글몰트 위스키 협회) 주도로 카테고리 규정 논의 중 | 주요 산지: 오리건, 워싱턴, 텍사스, 콜로라도, 버지니아 | 대표: 웨스트랜드, 벌칸, 로스트 스피릿츠',
                description: '스카치 싱글몰트 위스키의 방법론을 미국의 원재료와 기후로 재해석한 새로운 카테고리다. 오리건의 다습하고 온화한 기후, 텍사스의 극단적 열기, 콜로라도의 고산 건조 기후가 각각 전혀 다른 숙성 결과를 만들어낸다. 아직 카테고리 자체가 성장 중에 있지만, 세계 위스키 시장에서 가장 빠르게 주목받는 새로운 물결이다.',
                flavorTags: [
                    { label: '미국산 오크/코코넛', color: 'bg-amber-400/20 text-zinc-950 dark:text-amber-300' },
                    { label: '열대과일/허브', color: 'bg-green-400/20 text-zinc-950 dark:text-green-300' },
                    { label: '피트(선택적)', color: 'bg-stone-600/20 text-zinc-950 dark:text-stone-200' },
                    { label: '실험적·개성적', color: 'bg-purple-500/20 text-zinc-950 dark:text-purple-300' },
                ]
            }
        ],
        sensoryMetrics: [
            {
                metric: '온도 편차 (숙성 가속)',
                label: 'Climate Effect',
                value: '켄터키 연간 편차: 약 50℃',
                description: '스코틀랜드의 연간 온도 편차 ~15℃에 비해 켄터키는 50℃에 달한다. 이 거대한 열 팽창·수축 사이클이 오크 숙성을 극적으로 가속시켜, 켄터키 4년 버번은 스카치 8~10년 위스키에 맞먹는 오크 영향도를 보이기도 한다.',
            },
            {
                metric: '석회암 여과수',
                label: 'Limestone Water',
                value: '켄터키 특유 — 철분 제거·칼슘 풍부',
                description: '켄터키의 지하수는 석회암 지층을 통과하며 발효를 방해하는 철분이 자연스럽게 제거된다. 칼슘과 마그네슘이 풍부한 이 물이 효모 활동에 유리한 환경을 만들어 버번 특유의 달콤한 과실 에스터를 풍부하게 만드는 데 기여한다.',
            },
            {
                metric: '매시빌 (곡물 비율)',
                label: 'Mash Bill',
                value: '옥수수 51~80% + 호밀 or 밀',
                description: '버번의 법적 최소 옥수수 비율은 51%이지만 대부분의 증류소는 65~78% 수준을 사용한다. 위티드 버번(밀 사용)은 메이커스 마크, 로케트 등이 대표적이며 부드럽고 달콤하다. 하이라이 버번(호밀 비율 높음)은 더 스파이시하고 긴장감 있는 피니시를 보인다.',
            }
        ],
        coreIngredients: [
            {
                type: '핵심 원료',
                name: '옥수수 (Corn)',
                description: '미국 중서부의 풍부한 옥수수 농업이 버번의 경제적·감각적 토대다. 달콤한 콘브레드, 꿀, 바닐라의 기저를 형성한다.'
            },
            {
                type: '지역 변수',
                name: '켄터키 석회암 지하수',
                description: '철분을 자연 제거한 미네랄 풍부 연수. 효모 활동에 최적 환경을 제공하고 버번 고유의 달콤한 과실 에스터 생성에 기여한다.'
            },
            {
                type: '숙성 핵심',
                name: '새 탄화 아메리칸 오크통',
                description: '한 번씩만 사용하는 NEW 오크통 규정이 버번의 가장 강렬하고 빠른 풍미 흡수를 만든다. 사용된 버번 통은 이후 스카치나 데킬라, 럼 숙성에 두루 활용된다.'
            }
        ],
        manufacturingProcess: [
            {
                step: '사워 매시',
                name: 'Sour Mash Process',
                description: '이전 증류의 잔액(backset)을 새 발효에 투입해 pH를 안정화한다. 미생물 오염을 방지하고 일관된 하우스 스타일을 유지하는 켄터키 버번의 전통 기법이다.'
            },
            {
                step: '링컨 카운티 공정',
                name: 'Lincoln County Process (Tennessee Only)',
                description: '증류 원액을 3m 두께의 사탕단풍 숯 층으로 여과해 거친 불순물을 제거한다. 테네시 위스키만의 독특하고 매끄러운 질감을 만드는 비밀이다.'
            },
            {
                step: '릭하우스 숙성',
                name: 'Rickhouse Maturation',
                description: '켄터키의 대형 목조 창고(Rickhouse)는 온도 편차를 최대로 활용한다. 상층부는 고온으로 더 빠르고 오키하게, 하층부는 서늘하고 균형 잡힌 방향으로 숙성된다. 같은 증류소라도 배럴 위치에 따라 맛이 크게 달라진다.'
            }
        ],
        servingGuidelines: {
            recommendedGlass: '글렌캐런 또는 올드패션드 글라스',
            optimalTemperatures: [
                { temp: '18~22℃ (니트)', description: '켄터키 버번의 진한 바닐라·카라멜이 가장 선명하게 드러난다.' },
                { temp: '0~4℃ (온더락)', description: '온도가 내려가면 알코올의 날이 죽고 옥수수 특유의 둥글고 달콤한 맛이 부각된다.' }
            ],
            methods: [
                { name: '니트 vs 가수 비교', description: '고도수 버번(예: 이글레어 10 배럴 프루프)은 한 잔은 니트로, 한 잔은 몇 방울의 물을 넣어 비교하면 가수가 어떻게 향을 열어주는지 극적으로 체험할 수 있다.' },
                { name: '칵테일 탐험', description: '올드패션드(버번 + 비터 + 설탕)와 맨해튼(버번 + 스위트 베르무트 + 비터)은 미국 위스키의 가장 위대한 칵테일 활용이다. 버번의 달콤함과 라이의 스파이스 중 어느 쪽과 어울리는지 비교해보자.' }
            ]
        },
        flavorTags: [
            { label: '버번: 바닐라·카라멜', color: 'bg-amber-500/20 text-zinc-950 dark:text-amber-300' },
            { label: '테네시: 부드러움·숯향', color: 'bg-stone-500/20 text-zinc-950 dark:text-stone-200' },
            { label: '라이: 스파이시·드라이', color: 'bg-emerald-600/20 text-zinc-950 dark:text-emerald-300' },
            { label: '아메리칸 싱글몰트: 실험적', color: 'bg-purple-400/20 text-zinc-950 dark:text-purple-300' },
        ],
        foodPairing: [
            '켄터키 버번 — 바비큐 브리스킷, 피칸 파이, 버팔로 윙',
            '테네시 위스키 — 프라이드 치킨, 메이플 글레이즈 베이컨',
            '라이 위스키 — 훈제 파스트라미, 호밀빵 샌드위치',
            '아메리칸 싱글몰트 — 아티산 치즈, 시즈널 푸드 페어링',
        ],
        dbCategories: ['위스키'],
        relatedPageSlug: 'bourbon',
        relatedPageLabelKo: '← 버번 위스키 백과로 돌아가기',
        relatedPageLabelEn: '← Back to Bourbon Whiskey Wiki',
    },
    sectionsEn: {
        definition: 'American whiskey is far more than just Bourbon. From the traditional styles of Kentucky\'s Bourbon Belt to Tennessee\'s unique charcoal-filtering process, the East Coast\'s Rye whiskey heritage, and the rapidly growing American Single Malt movement — America\'s geographic diversity combines with distinct soils, climates, water sources, and grain cultures to create a whiskey culture unlike anywhere else in the world.',
        history: 'The history of American whiskey begins with Scottish and Irish immigrants who brought distilling knowledge to the New World in the late 18th century. Kentucky\'s limestone-filtered water, abundant corn agriculture, and native oak resources converged to develop Bourbon. The 1897 Bottled-in-Bond Act, the challenge of Prohibition (1920–1933), and Congress\'s 1964 designation of Bourbon as America\'s Native Spirit mark the milestones of its evolution. The 2010s craft distillery boom sparked a new chapter, giving rise to the American Single Malt category.',
        classifications: [
            {
                name: 'Kentucky — The Birthplace of Bourbon',
                criteria: 'While Bourbon can legally be made anywhere in the US, approximately 95% is produced in Kentucky | Key Distilleries: Buffalo Trace, Heaven Hill, Four Roses, Maker\'s Mark, Jim Beam, Wild Turkey',
                description: 'Kentucky\'s dominance isn\'t an accident — it\'s geological. Limestone bedrock filters the groundwater, removing iron (which impedes fermentation) and enriching it with calcium and magnesium (which yeast thrives on). Kentucky\'s extreme temperature swings (summer 35°C / winter -15°C) cause dramatic wood expansion and contraction cycles that dramatically accelerate the maturation process. This is why a 4-year-old Kentucky bourbon can carry as much oak character as an 8–10 year Scotch whisky.',
                flavorTags: [
                    { label: 'Vanilla/Caramel', color: 'bg-amber-500/20 text-zinc-950 dark:text-amber-300' },
                    { label: 'Oak/Toast', color: 'bg-stone-600/20 text-zinc-950 dark:text-stone-300' },
                    { label: 'Toffee/Maple', color: 'bg-amber-700/20 text-zinc-950 dark:text-amber-500' },
                    { label: 'Cherry/Apple', color: 'bg-rose-500/20 text-zinc-950 dark:text-rose-300' },
                ]
            },
            {
                name: 'Tennessee — Tennessee Whiskey, Not Bourbon',
                criteria: 'Tennessee Whiskey must meet all Bourbon requirements PLUS mandatory Lincoln County Process | Key Distilleries: Jack Daniel\'s, George Dickel, Benjamin Prichard\'s (exempt from LCP)',
                description: 'Tennessee whiskey\'s defining feature is the Lincoln County Process. Before barreling, the new spirit is slowly dripped through at least 10 feet (3 meters) of sugar maple charcoal, filtering out harsh congeners. The result is a spirit noticeably smoother and sweeter than standard bourbon, with a subtle, pleasant charcoal smokiness. Jack Daniel\'s Old No. 7 is the world\'s best-selling whiskey, making Tennessee Whiskey the most consumed American whiskey globally.',
                flavorTags: [
                    { label: 'Charcoal/Subtle Smoke', color: 'bg-stone-700/20 text-zinc-950 dark:text-stone-300' },
                    { label: 'Vanilla/Maple', color: 'bg-amber-400/20 text-zinc-950 dark:text-amber-300' },
                    { label: 'Smooth/Creamy', color: 'bg-yellow-200/20 text-zinc-950 dark:text-yellow-100' },
                    { label: 'Nutmeg/Oak', color: 'bg-stone-500/20 text-zinc-950 dark:text-stone-300' },
                ]
            },
            {
                name: 'Rye Whiskey — The Spicy Heritage',
                criteria: 'Rye Whiskey: mash of 51%+ rye grain | Historical heartlands: Pennsylvania & Maryland | Modern craft producers: New York, Colorado, Vermont | Examples: WhistlePig, Sazerac Rye, High West',
                description: 'Rye whiskey is American whiskey\'s other great tradition. Pre-Prohibition Pennsylvania and Maryland Rye was known for full body and bold spice. Today it has undergone a spectacular revival, driven by the cocktail renaissance. The rye grain\'s innate black pepper, caraway, dry herb, and grain tannins make it the ideal backbone for classic cocktails like the Old Fashioned, the Manhattan, and the Sazerac.',
                flavorTags: [
                    { label: 'Black Pepper/Rye Spice', color: 'bg-emerald-600/20 text-zinc-950 dark:text-emerald-300' },
                    { label: 'Dry Herbs', color: 'bg-green-500/20 text-zinc-950 dark:text-green-300' },
                    { label: 'Citrus/Lemon', color: 'bg-lime-400/20 text-zinc-950 dark:text-lime-300' },
                    { label: 'Oak/Tannin', color: 'bg-stone-600/20 text-zinc-950 dark:text-stone-300' },
                ]
            },
            {
                name: 'American Single Malt — The New Frontier',
                criteria: 'Led by the ASMWC (American Single Malt Whiskey Commission), category definition currently being formalized | Key regions: Oregon, Washington, Texas, Colorado, Virginia | Notable producers: Westland, Stranahan\'s, Lost Spirits',
                description: 'American Single Malt reimagines the methodology of Scotch single malt using American ingredients, climate, and innovation. Oregon\'s cool, humid Pacific climate, Texas\'s extreme heat, and Colorado\'s high-altitude dryness each produce dramatically different aging profiles. While still an emerging category, American Single Malt is one of the fastest-growing and most talked-about segments in the global whiskey market.',
                flavorTags: [
                    { label: 'American Oak/Coconut', color: 'bg-amber-400/20 text-zinc-950 dark:text-amber-300' },
                    { label: 'Tropical Fruit/Herbs', color: 'bg-green-400/20 text-zinc-950 dark:text-green-300' },
                    { label: 'Peat (Optional)', color: 'bg-stone-600/20 text-zinc-950 dark:text-stone-200' },
                    { label: 'Experimental/Innovative', color: 'bg-purple-500/20 text-zinc-950 dark:text-purple-300' },
                ]
            }
        ],
        sensoryMetrics: [
            {
                metric: 'Temperature Variance (Accelerated Maturation)',
                label: 'Climate Effect',
                value: 'Kentucky Annual Swing: ~50°C',
                description: 'Compared to Scotland\'s ~15°C annual variance, Kentucky\'s 50°C temperature swings cause the wood to expand and contract dramatically. This accelerated cycling is why Kentucky bourbon matures so intensely quickly — a 4-year expression can match the oak character of an 8–10 year Scotch.',
            },
            {
                metric: 'Limestone Limestone-Filtered Water',
                label: 'Limestone Water',
                value: 'Kentucky-specific — iron-free, calcium-rich',
                description: 'Groundwater filtered through limestone bedrock removes iron (a natural yeast inhibitor) and concentrates calcium and magnesium (which yeast thrives on). This geological advantage is widely cited as a primary reason Kentucky produces bourbon of such consistent quality and sweetness.',
            },
            {
                metric: 'Mash Bill (Grain Ratio)',
                label: 'Mash Bill',
                value: 'Corn 51–80% + Rye or Wheat',
                description: 'Wheated bourbons (Maker\'s Mark, Larceny) substitute wheat for rye as the secondary grain, producing a rounder, softer, creamier profile. High-Rye bourbons (Bulleit, Four Roses) emphasize baking spices and a dry, tense finish. The secondary grain is the single most important variable defining a bourbon\'s house character.',
            }
        ],
        coreIngredients: [
            {
                type: 'Cornerstone',
                name: 'Corn',
                description: 'America\'s dominant agricultural crop and the legal and sensory foundation of bourbon. It forms a canvas of golden sweetness — honey, cornbread, vanilla — upon which the oak layers its complexity.'
            },
            {
                type: 'Regional Variable',
                name: 'Kentucky Limestone Groundwater',
                description: 'Iron-free, calcium-rich water that creates an optimal fermentation environment. The scientific backbone of Kentucky\'s bourbon dominance, this geological advantage cannot be replicated elsewhere.'
            },
            {
                type: 'Maturation Cornerstone',
                name: 'New Charred American Oak',
                description: 'The mandatory use of virgin charred oak containers (used only once) means bourbon extracts maximum flavor from new wood on every cycle. After use, these "spent" casks travel the world to mature Scotch, rum, and tequila.'
            }
        ],
        manufacturingProcess: [
            {
                step: 'Sour Mash',
                name: 'Sour Mash Process',
                description: 'A portion of the previous distillation\'s spent stillage (backset) is added to each new fermentation to stabilize pH, prevent microbial contamination, and maintain house flavor consistency — a cornerstone of Kentucky bourbon tradition.'
            },
            {
                step: 'Lincoln County Process',
                name: 'Charcoal Mellowing (Tennessee Only)',
                description: 'The new-make spirit is percolated through 10 feet of sugar maple charcoal before barreling. This "pre-aging" step strips harsh compounds, creating Tennessee whiskey\'s signature silky-smooth character.'
            },
            {
                step: 'Rickhouse Maturation',
                name: 'Multi-Floor Warehouse Aging',
                description: 'Barrels on higher rickhouse floors experience more intense heat, gaining richer, more intense oak flavors. Lower floors see cooler conditions and gentler, more balanced maturation. The same distillate from the same day can taste dramatically different depending on barrel location — creating "single barrel" diversity within a single warehouse.'
            }
        ],
        servingGuidelines: {
            recommendedGlass: 'Glencairn Glass or Old Fashioned Glass',
            optimalTemperatures: [
                { temp: '18–22°C (Neat)', description: 'Kentucky bourbon\'s deep vanilla and caramel register most vividly at room temperature.' },
                { temp: '0–4°C (On the Rocks)', description: 'Chilling softens the alcohol heat and brings the corn\'s round, gentle sweetness to the foreground.' }
            ],
            methods: [
                { name: 'Neat vs. Water Comparison', description: 'For high-proof expressions (e.g., Eagle Rare Barrel Proof), serve one measure neat, one with a few drops of water. The difference reveals how water\'s dilution unlocks hidden esters and floral notes.' },
                { name: 'Cocktail Exploration', description: 'The Old Fashioned (bourbon + bitters + sugar) and the Manhattan (bourbon + sweet vermouth + bitters) represent bourbon\'s greatest cocktail achievements. Compare them side by side with a High-Rye version to see how grain choice changes the cocktail dynamic.' }
            ]
        },
        flavorTags: [
            { label: 'Bourbon: Vanilla & Caramel', color: 'bg-amber-500/20 text-zinc-950 dark:text-amber-300' },
            { label: 'Tennessee: Smooth & Charcoal', color: 'bg-stone-500/20 text-zinc-950 dark:text-stone-200' },
            { label: 'Rye: Spicy & Dry', color: 'bg-emerald-600/20 text-zinc-950 dark:text-emerald-300' },
            { label: 'American Single Malt: Experimental', color: 'bg-purple-400/20 text-zinc-950 dark:text-purple-300' },
        ],
        foodPairing: [
            'Kentucky Bourbon — BBQ Brisket, Pecan Pie, Buffalo Wings',
            'Tennessee Whiskey — Fried Chicken, Maple-Glazed Bacon',
            'Rye Whiskey — Smoked Pastrami, Rye Bread Sandwiches',
            'American Single Malt — Artisan Cheese, Seasonal Food Pairings',
        ],
        dbCategories: ['위스키'],
        relatedPageSlug: 'bourbon',
        relatedPageLabelKo: '← 버번 위스키 백과로 돌아가기',
        relatedPageLabelEn: '← Back to Bourbon Whiskey Wiki',
    }
}
