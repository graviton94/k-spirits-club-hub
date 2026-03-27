import { SpiritCategory } from './types'

export const redWineRegions: SpiritCategory = {
    slug: 'red-wine-regions',
    dbCategories: ['과실주'],
    emoji: '🗺️',
    nameKo: '레드 와인 세계 산지 가이드',
    nameEn: 'Red Wine Regions of the World',
    taglineKo: '보르도, 부르고뉴, 토스카나, 나파 밸리까지 — 세계 레드 와인 산지와 대표 품종의 개성',
    taglineEn: 'From Bordeaux and Burgundy to Tuscany and Napa Valley — the world\'s great red wine regions and their defining grapes',
    color: 'red',
    sections: {
        definition: '레드 와인의 개성은 포도 품종과 양조 방식에 못지않게 "어디서 재배되었는가"에 의해 결정된다. 같은 까베르네 소비뇽이라도 보르도 토양에서 자라면 삼나무와 흑연의 우아함을, 나파 밸리의 따뜻한 햇살 아래에서는 풍부한 과실미를 드러낸다. 이것이 "테루아(Terroir)"다 — 토양, 기후, 지형, 양조 문화까지 총망라한 개념이 와인 한 잔의 정체성을 만든다.',
        history: '레드 와인 산지의 구분은 수천 년의 역사를 가진다. 로마 제국의 와인 문화를 이어받은 구세계(유럽)가 장구한 전통을 확립했고, 18~19세기 아메리카·호주·남아프리카 등지의 유럽 이민자들이 신세계 와인 산업을 개척했다. 1976년 "파리의 심판"에서 캘리포니아 와인이 프랑스 구세계를 이기며 세계 와인 지형이 크게 바뀌었다. 오늘날은 구세계의 테루아 전통과 신세계의 기술·혁신이 상호 영향을 주고받으며 발전하고 있다.',
        classifications: [
            {
                name: '보르도 (Bordeaux) — 프랑스',
                criteria: '주요 품종: 까베르네 소비뇽, 메를로, 까베르네 프랑 등 블렌드 | 좌안(메독): 까베르네 소비뇽 중심·강렬한 구조 | 우안(생테밀리옹·포므롤): 메를로 중심·부드러운 질감 | 1855년 공식 등급 체계',
                description: '세계 프리미엄 레드 와인의 기준점. 구조적이고 숙성 잠재력이 뛰어난 "블렌드" 시스템을 발전시켜, 매 빈티지 기후에 따라 최적의 품종 비율을 조정한다. 좌안의 까베르네 소비뇽 중심 와인은 블랙커런트, 삼나무, 흑연, 미네랄의 우아함이 특징이고, 우안의 메를로 중심 와인은 더 부드럽고 과실미가 풍부하다. 피숑 바론, 무똥 로트실트, 페트뤼스 같은 샤또가 세계 최고가 와인의 상징이다.',
                flavorTags: [
                    { label: '블랙커런트/삼나무', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: '흑연/미네랄', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: '가죽/담배', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: '체리/자두(우안)', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                ]
            },
            {
                name: '부르고뉴 (Burgundy / Bourgogne) — 프랑스',
                criteria: '단일 품종: 피노 누아 | 포도밭 등급 시스템(그랑 크뤼 > 프르미에 크뤼 > 빌라쥬 > 레지오날) | 코트 드 뉘, 코트 드 본 서브 지역 | 기후에 매우 민감',
                description: '세계에서 가장 섬세하고 복잡한 레드 와인의 고향. 피노 누아 한 품종으로 포도밭 위치에 따라 극적으로 다른 결과를 만들어내는 테루아의 예술이다. 그랑 크뤼(로마네·콩티, 라 타슈, 샹베르탱 등)는 세계에서 가장 희귀하고 비싼 와인에 속한다. 어린 부르고뉴는 체리·라즈베리, 숙성된 빈티지는 버섯·송로버섯·숲바닥·가죽의 복합적인 3차 향을 보인다.',
                flavorTags: [
                    { label: '체리/라즈베리', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: '버섯/흙내(숙성)', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: '장미/바이올렛', color: 'bg-pink-100 text-pink-950 dark:bg-pink-900/40 dark:text-pink-100' },
                    { label: '미네랄/섬세함', color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
                ]
            },
            {
                name: '토스카나 (Tuscany) — 이탈리아',
                criteria: '주요 품종: 산조베제 (Sangiovese) | 키안티 클라시코, 브루넬로 디 몬탈치노, 몬테풀차노 등 DOCG | 슈퍼 투스칸(국제 품종 블렌드) 별도 존재',
                description: '산조베제는 이탈리아 레드 와인의 왕이다. 높은 산도와 중간~고탄닌이 특징으로 토마토 소스 파스타, 미트 요리와 천상의 결합을 이룬다. 브루넬로 디 몬탈치노는 세계에서 최고의 숙성 잠재력을 가진 이탈리아 레드 와인 중 하나다(최소 10년 이상 셀러링 권장). 키안티 클라시코는 체리, 허브, 미네랄의 생동감 있는 스타일로 파스타 애호가들의 기본 선택이다.',
                flavorTags: [
                    { label: '체리/토마토', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: '허브/후추', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
                    { label: '산도/탄닌 구조', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: '흙내/가죽(숙성)', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                ]
            },
            {
                name: '나파 밸리 & 소노마 (Napa Valley & Sonoma) — 캘리포니아',
                criteria: '나파: 까베르네 소비뇽 왕국 | 소노마: 다양한 품종(피노 누아, 진판델, 샤르도네) | 지중해성 기후(따뜻하고 일조량 풍부) | 1976년 파리의 심판에서 최초 세계적 인정',
                description: '신세계 프리미엄 와인의 상징. 나파 밸리의 까베르네 소비뇽은 보르도보다 과실미가 풍부하고 탄닌이 부드러우며 알코올이 높다. 풍부한 일조량이 포도를 완숙시켜 블랙베리·카시스·다크 초콜릿의 진하고 농밀한 풍미를 만든다. 케이머스, 오퍼스 원, 스크리밍 이글이 세계적인 나파 아이콘 와인이다.',
                flavorTags: [
                    { label: '블랙베리/카시스', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: '다크 초콜릿/바닐라', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: '실크/부드러운 탄닌', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: '블루베리/자두', color: 'bg-blue-100 text-blue-950 dark:bg-blue-900/40 dark:text-blue-100' },
                ]
            },
            {
                name: '리오하 (Rioja) — 스페인',
                criteria: '주요 품종: 템프라니요 (Tempranillo) | 크리안자, 레세르바, 그란 레세르바 숙성 등급 | 아메리칸 오크와 프랑스 오크 혼용',
                description: '이베리아 반도 최고의 레드 와인 산지. 템프라니요의 높은 산도와 중간 탄닌이 긴 오크 숙성과 결합하여 스페인 레드 와인만의 독특한 스타일 — 말린 딸기, 바닐라, 가죽, 담배 — 을 창조한다. 아메리칸 오크의 코코넛·크리미한 뉘앙스가 구세계 와인에서 특이하게 달콤한 풍미 레이어를 만든다.',
                flavorTags: [
                    { label: '말린 딸기/체리', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: '바닐라/코코넛', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: '가죽/담배', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: '드라이 허브/후추', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
                ]
            },
            {
                name: '바로사 밸리 (Barossa Valley) — 호주',
                criteria: '주요 품종: 쉬라즈 (Shiraz) | 따뜻한 대륙성 기후 | 올드 바인(수령 100년+ 포도나무) 보유 | 세계 최고령 쉬라즈 포도나무 산지',
                description: '호주 레드 와인의 플래그십. 바로사의 쉬라즈는 세계에서 가장 진하고 강렬한 레드 와인 중 하나로, 블랙베리·블루베리·다크 초콜릿·후추·베이킹 스파이스의 풍성하고 볼드한 풍미가 특징이다. 세계에서 가장 오래된 쉬라즈 포도나무들(1843년 식재)이 아직도 생산 중인 바로사는 "올드 바인(Old Vine)" 와인의 성지로 불린다.',
                flavorTags: [
                    { label: '블랙베리/블루베리', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: '다크 초콜릿/후추', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: '베이킹 스파이스', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: '진한 바디/볼드', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                ]
            }
        ],
        sensoryMetrics: [
            {
                metric: '구세계 vs 신세계',
                label: 'Old/New World',
                value: '섬세함·복잡성(구세계) vs 과실미·접근성(신세계)',
                description: '구세계(프랑스·이탈리아·스페인)는 흙내, 미네랄, 드라이한 허브, 복잡한 3차 향을 강조한다. 신세계(캘리포니아·호주·칠레)는 풍부한 과실미, 높은 알코올, 부드러운 탄닌을 특징으로 한다. 어느 쪽이 우월하다기보다, 개인 취향과 음식 매칭에 따라 선택이 달라진다.',
            },
            {
                metric: '탄닌 구조',
                label: 'Tannin Level',
                value: '낮음(피노 누아) → 높음(네비올로·까베르네)',
                description: '탄닌은 와인의 수명과 구조를 결정한다. 피노 누아는 섬세하고 고운 탄닌, 까베르네 소비뇽과 네비올로(바롤로)는 초기에는 거칠지만 숙성되면서 벨벳처럼 부드러워지는 그리피(Grippy) 탄닌이 특징이다.',
            },
            {
                metric: '기후 영향',
                label: 'Climate Type',
                value: '서늘한 기후 → 우아함·산도 / 따뜻한 기후 → 과실미·바디',
                description: '부르고뉴의 서늘한 기후가 피노 누아를 섬세하고 산도 높은 스타일로 만드는 반면, 나파의 따뜻한 기후는 까베르네를 완숙시켜 진하고 과실미 넘치는 스타일을 만든다. 기후는 포도의 당도, 산도, 탄닌 성숙도의 최종 결정권자다.',
            }
        ],
        coreIngredients: [
            {
                type: '지역별 시그니처 품종',
                name: '품종 × 산지 매칭',
                description: '까베르네 소비뇽 × 보르도/나파, 피노 누아 × 부르고뉴/오리건, 산조베제 × 토스카나, 쉬라즈 × 바로사, 템프라니요 × 리오하. 각 조합이 세계 최고의 레드 와인을 만들어낸다.'
            },
            {
                type: '공통 공정',
                name: '껍질 접촉 및 오크 숙성',
                description: '껍질과의 접촉 시간(Maceration)이 탄닌과 색소 추출량을 결정하고, 오크 배럴 숙성이 바닐라·스파이스 등 2차 아로마를 더한다. 이 두 과정의 길이와 강도가 지역 스타일을 차별화하는 가장 중요한 양조 변수다.'
            }
        ],
        manufacturingProcess: [
            {
                step: '양조',
                name: '껍질 침용 및 말로락틱 발효',
                description: '알코올 발효 중 포도 껍질과의 접촉으로 색소·탄닌·에스터를 추출한다. 이후 거친 사과산을 부드러운 젖산으로 전환하는 말로락틱 발효로 레드 와인 특유의 부드러운 질감이 완성된다.'
            },
            {
                step: '숙성',
                name: '오크 배럴 숙성 및 병 숙성',
                description: '새 오크 배럴은 강한 오크 향을 부여하고, 오래된 배럴은 미세산소공급(MOX) 역할만 한다. 보르도, 부르고뉴는 프랑스 오크, 리오하는 아메리칸 오크를 혼용하여 지역 스타일을 차별화한다.'
            }
        ],
        servingGuidelines: {
            recommendedGlass: '보르도 형 또는 부르고뉴형 레드 와인 글라스',
            optimalTemperatures: [
                { temp: '14~16℃ (피노 누아·가벼운 레드)', description: '섬세한 꽃향과 붉은 과실향이 가장 화사하게 피어오른다.' },
                { temp: '16~18℃ (미디엄~풀바디)', description: '보르도, 토스카나, 리오하 대부분의 레드 와인에 적합한 온도.' },
                { temp: '18~20℃ (바로사 쉬라즈·강한 타닌)', description: '고탄닌 다크 와인의 구조감과 오크 숙성향이 풍부하게 열린다.' }
            ],
            methods: [
                { name: '디캔팅', description: '타닌이 강한 어린 보르도나 브루넬로는 서빙 1~2시간 전 디캔팅하면 탄닌이 풀리고 향이 활짝 열린다.' },
                { name: '구세계-신세계 비교', description: '같은 품종(예: 까베르네 소비뇽)으로 보르도 크뤼 부르주아와 나파 밸리 와인을 나란히 비교하면, 테루아와 철학의 차이를 직접 체험할 수 있다.' }
            ]
        },
        flavorTags: [
            { label: '보르도: 구조·우아함', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: '부르고뉴: 섬세·테루아', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: '토스카나: 산도·음식친화적', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: '나파: 과실미·볼드', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: '리오하: 오크·스파이스', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: '바로사: 진함·파워풀', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
        ],
        foodPairing: [
            '보르도 — 양고기 구이, 숙성 치즈, 트러플 요리',
            '부르고뉴 — 연어/참치 스테이크, 버섯 리조또, 오리 요리',
            '토스카나 — 토마토 파스타, 피렌체 스테이크(비스테카), 경질 치즈',
            '나파 — 바비큐 립, 숙성 체다, 다크 초콜릿',
            '리오하 — 양갈비, 초리소, 프레소 치즈',
            '바로사 쉬라즈 — 캥거루 스테이크, 블랙 페퍼 요리, 강한 치즈',
        ],
        relatedPageSlug: 'red-wine',
        relatedPageLabelKo: '← 레드 와인 백과로 돌아가기',
        relatedPageLabelEn: '← Back to Red Wine Wiki',
    },
    sectionsEn: {
        definition: 'The character of red wine is determined not only by grape variety and winemaking technique, but equally by "where it was grown." The same Cabernet Sauvignon produces the elegant cedar and graphite of Bordeaux, and the opulent blackberry richness of Napa Valley. This is "Terroir" — the concept that encompasses soil, climate, topography, and winemaking tradition to shape the identity of every glass.',
        history: 'The distinction of red wine regions spans millennia. The Old World (Europe) inherited Roman viticultural traditions to develop enduring regional identities. From the 18th–19th centuries, European emigrants developed the New World wine industries of the Americas, Australia, and South Africa. The 1976 "Judgment of Paris" marked a watershed moment when California wines outscored French icons in a blind tasting, fundamentally reshaping the global wine landscape. Today, Old World terroir tradition and New World technical innovation continually influence each other.',
        classifications: [
            {
                name: 'Bordeaux — France',
                criteria: 'Key varieties: Cabernet Sauvignon, Merlot, Cabernet Franc (blended) | Left Bank (Médoc): Cab-dominant, structured | Right Bank (Saint-Émilion, Pomerol): Merlot-dominant, supple | 1855 Classification system',
                description: 'The global benchmark for premium red wine. Bordeaux\'s genius lies in its "blended" system, allowing winemakers to adjust varietal ratios each vintage to achieve the optimal balance. Left Bank wines (Pauillac, Saint-Julien) are defined by Cab\'s black currant, cedar, graphite, and gravelly minerality. Right Bank expressions (Pomerol\'s Petrus, Saint-Émilion Grand Cru) bring silkier, plummier, more immediately accessible Merlot-driven charm at extraordinary price points.',
                flavorTags: [
                    { label: 'Blackcurrant/Cedar', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: 'Graphite/Mineral', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: 'Leather/Tobacco', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: 'Cherry/Plum (Right Bank)', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                ]
            },
            {
                name: 'Burgundy (Bourgogne) — France',
                criteria: 'Single variety: Pinot Noir | Vineyard classification (Grand Cru > Premier Cru > Village > Regional) | Côte de Nuits and Côte de Beaune sub-regions | Highly climate-sensitive',
                description: 'Home to the world\'s most delicate and complex red wines. The extraordinary power of Burgundy lies in showcasing how a single grape variety — Pinot Noir — can express the micro-terroir of individual vineyard plots with unrivaled precision. Grands Crus like Romanée-Conti, La Tâche, and Chambertin are among the rarest and most expensive wines on earth. Young Burgundy expresses vibrant cherry and raspberry; aged Burgundy evolves into a mesmerizing landscape of mushroom, truffle, forest floor, and leather.',
                flavorTags: [
                    { label: 'Cherry/Raspberry', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: 'Mushroom/Earthy (Aged)', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: 'Rose/Violet', color: 'bg-pink-100 text-pink-950 dark:bg-pink-900/40 dark:text-pink-100' },
                    { label: 'Mineral/Delicate', color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
                ]
            },
            {
                name: 'Tuscany — Italy',
                criteria: 'Primary variety: Sangiovese | DOCG appellations: Chianti Classico, Brunello di Montalcino, Vino Nobile di Montepulciano | Super Tuscans (international variety blends) also exist',
                description: 'Sangiovese is the king of Italian red wine. Its naturally high acidity and medium-to-high tannins make it a supremely "food-friendly" variety — a dream partner for tomato-based pasta and grilled meats. Brunello di Montalcino is one of Italy\'s most long-lived wines, requiring at minimum a decade of cellaring to reveal its full complexity of dried cherry, leather, dried roses, and iron. Chianti Classico is the everyday hero: vibrant, cherry-forward, and reliably excellent.',
                flavorTags: [
                    { label: 'Cherry/Tomato Leaf', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: 'Dried Herbs/Pepper', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
                    { label: 'Acidity/Tannin Structure', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: 'Leather/Earth (Aged)', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                ]
            },
            {
                name: 'Napa Valley & Sonoma — California',
                criteria: 'Napa: Cabernet Sauvignon stronghold | Sonoma: diverse varieties (Pinot Noir, Zinfandel, Chardonnay) | Mediterranean climate (warm, abundant sunshine) | First globally recognized in the 1976 Judgment of Paris',
                description: 'The symbol of New World premium wine excellence. Napa Valley Cabernet Sauvignon is richer in fruit than Bordeaux, with softer tannins and higher natural alcohol. The generous California sunshine fully ripens grapes to deliver deeply concentrated Blackberry, black cherry, dark chocolate, and espresso. Caymus, Opus One, and Screaming Eagle are Napa\'s most iconic labels; the latter is among the most sought-after cult wines on earth.',
                flavorTags: [
                    { label: 'Blackberry/Cassis', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: 'Dark Chocolate/Vanilla', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: 'Silky/Soft Tannins', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: 'Blueberry/Plum', color: 'bg-blue-100 text-blue-950 dark:bg-blue-900/40 dark:text-blue-100' },
                ]
            },
            {
                name: 'Rioja — Spain',
                criteria: 'Primary variety: Tempranillo | Aging grades: Crianza, Reserva, Gran Reserva | Mix of American and French oak | D.O.Ca. (Spain\'s highest wine designation)',
                description: 'The Iberian Peninsula\'s most celebrated red wine region. Tempranillo\'s naturally high acidity and moderate tannins, combined with rigorous aging in oak — notably American oak with its characteristic coconut and creamy vanillin influence (unusual for Old World wines) — produce a uniquely accessible yet age-worthy style. Top Riojas develop gorgeous notes of dried strawberry, leather, tobacco, and exotic spice over decades of evolution.',
                flavorTags: [
                    { label: 'Dried Strawberry/Cherry', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: 'Vanilla/Coconut', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: 'Leather/Tobacco', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: 'Dried Herbs/Pepper', color: 'bg-green-100 text-green-950 dark:bg-green-900/40 dark:text-green-100' },
                ]
            },
            {
                name: 'Barossa Valley — South Australia',
                criteria: 'Primary variety: Shiraz | Warm continental climate | Among the world\'s oldest surviving Shiraz vines (planted 1843) | "Old Vine Charter" classification for centenarian vines',
                description: 'Australia\'s most famous wine region and one of the world\'s great red wine destinations. Barossa Shiraz is bold, concentrated, and unapologetically powerful — blackberry, blueberry, dark chocolate, cracked black pepper, and baking spice cascade across the palate in a defining display of New World viticulture. The region\'s "Old Vine" treasures — Grenache, Mourvedre and Shiraz vines over 100 years old — produce wines of extraordinary complexity that rival the world\'s finest.',
                flavorTags: [
                    { label: 'Blackberry/Blueberry', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                    { label: 'Dark Chocolate/Pepper', color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
                    { label: 'Baking Spice', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
                    { label: 'Full Body/Powerful', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
                ]
            }
        ],
        sensoryMetrics: [
            {
                metric: 'Old World vs. New World',
                label: 'Style Spectrum',
                value: 'Elegance/Complexity (OW) vs. Fruitiness/Accessibility (NW)',
                description: 'Old World (France, Italy, Spain) emphasizes earth, minerality, dried herbs, and complex tertiary aromas. New World (California, Australia, Chile) showcases pure, ripe fruit, higher alcohol, and softer tannins. Neither is "better" — the choice depends on food pairing, occasion, and personal taste.',
            },
            {
                metric: 'Tannin Structure',
                label: 'Tannin Level',
                value: 'Low (Pinot Noir) → High (Nebbiolo/Cab)',
                description: 'Tannin determines a wine\'s lifespan and structural backbone. Pinot Noir has fine, silky tannins. Cabernet Sauvignon and Nebbiolo (the star of Barolo) have grippy, chewy tannins when young that evolve into pure velvet with a decade or more of aging.',
            },
            {
                metric: 'Climate Influence',
                label: 'Climate Type',
                value: 'Cool Climate → Elegance/Acidity / Warm Climate → Fruit/Body',
                description: 'Burgundy\'s cool climate holds Pinot Noir\'s acidity high and limits richness, producing ethereal delicacy. Napa\'s warmth allows Cabernet to fully ripen, producing density and concentration. Climate is the ultimate arbiter of a wine\'s sugar, acidity, and tannin ripeness.',
            }
        ],
        coreIngredients: [
            {
                type: 'Signature Variety by Region',
                name: 'Variety × Terroir Matchmaking',
                description: 'Cabernet Sauvignon × Bordeaux/Napa, Pinot Noir × Burgundy/Oregon, Sangiovese × Tuscany, Shiraz × Barossa, Tempranillo × Rioja. Each pairing represents a pinnacle of regional wine expression refined over generations.'
            },
            {
                type: 'Universal Process',
                name: 'Maceration & Oak Aging',
                description: 'The duration of skin contact (maceration) determines tannin and anthocyanin extraction. Oak barrel aging adds secondary vanilla, spice, and structure. The length and intensity of these two processes are the primary technical differentiators of regional styles.'
            }
        ],
        manufacturingProcess: [
            {
                step: 'Winemaking',
                name: 'Alcoholic Fermentation with Skin Contact',
                description: 'Co-fermenting juice with grape skins extracts color, tannin, and aromatic compounds. Afterwards, malolactic fermentation (MLF) converts harsh malic acid into soft lactic acid, completing the foundation of red wine\'s soft mouthfeel.'
            },
            {
                step: 'Maturation',
                name: 'Oak Barrel Aging',
                description: 'New French oak adds powerful spice and tannin; older barrels contribute primarily micro-oxygenation. Bordeaux and Burgundy use French oak for precision; Rioja employs a mix of French and American oak (giving its distinctive creamy-vanilla character) to cement the regional house style.'
            }
        ],
        servingGuidelines: {
            recommendedGlass: 'Bordeaux-type or Burgundy-type Red Wine Glass',
            optimalTemperatures: [
                { temp: '14–16°C (Pinot Noir / Light Reds)', description: 'The ideal temperature for delicate wines to display their full floral and bright cherry character.' },
                { temp: '16–18°C (Medium to Full-Bodied)', description: 'The sweet spot for most Bordeaux, Tuscan, and Rioja reds to balance fruit, tannin, and acidity harmoniously.' },
                { temp: '18–20°C (Barossa Shiraz / High-Tannin)', description: 'Bold, structured dark wines open up beautifully at this temperature, revealing full oak complexity.' }
            ],
            methods: [
                { name: 'Decanting', description: 'Young, tannic Bordeaux or Brunello di Montalcino should be decanted 1–2 hours before serving to soften grip and fully open the aromatic spectrum.' },
                { name: 'Old World vs. New World Comparison', description: 'Place a Bordeaux Cru Bourgeois alongside a Napa Valley Cabernet of the same vintage for a vivid, educational contrast in terroir philosophy and winemaking style.' }
            ]
        },
        flavorTags: [
            { label: 'Bordeaux: Structure & Elegance', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: 'Burgundy: Delicate & Terroir', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: 'Tuscany: Acidic & Food-Friendly', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: 'Napa: Fruity & Bold', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: 'Rioja: Oak & Spice', color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: 'Barossa: Powerful & Dark', color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
        ],
        foodPairing: [
            'Bordeaux — Grilled Lamb, Aged Cheeses, Truffle Dishes',
            'Burgundy — Salmon/Tuna Steak, Mushroom Risotto, Duck',
            'Tuscany — Tomato Pasta, Bistecca Fiorentina, Hard Cheeses',
            'Napa — BBQ Ribs, Aged Cheddar, Dark Chocolate',
            'Rioja — Lamb Chops, Chorizo, Hard Spanish Cheese',
            'Barossa Shiraz — Black Pepper Steaks, Strong Aged Cheese',
        ],
        relatedPageSlug: 'red-wine',
        relatedPageLabelKo: '← 레드 와인 백과로 돌아가기',
        relatedPageLabelEn: '← Back to Red Wine Wiki',
    }
}
