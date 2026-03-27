import { SpiritCategory } from './types'

export const bourbon: SpiritCategory = {
    slug: 'bourbon',
    dbCategories: ['위스키'],
    emoji: '🇺🇸',
    nameKo: '버번 위스키',
    nameEn: 'Bourbon Whiskey',
    taglineKo: '미국을 대표하는 강렬하고 달콤한 옥수수 베이스 위스키',
    taglineEn: 'The bold and sweet American whiskey made from corn',
    color: 'amber',
    sections: {
        definition: "버번 위스키(Bourbon Whiskey)는 1964년 미국 의회에서 승인된 '미국의 고유 증류주(America’s Native Spirit)'이다. 미국 내에서 생산되어야 하며, 옥수수 함량이 최소 51%인 곡물 매시를 증류해 내부를 불에 태운 ‘새 아메리칸 오크통’에서 숙성한다. 특히 스카치나 캐나디안 위스키와 달리 색소나 향료 등 어떤 첨가물도 허용하지 않는 엄격한 순수성을 자랑하며, 오크통에서 유래한 천연 바닐라와 카라멜의 달콤함이 핵심이다.",
        history: "버번은 18세기 후반 켄터키로 이주한 정착민들에 의해 시작되었으며, '엘리야 크레이그' 목사가 처음으로 오크통 내부를 태워 숙성했다는 전설이 유명하다. 19세기 미시시피 강을 따라 뉴올리언스의 '버번 스트리트'로 운송되며 그 명칭이 굳어졌다. 1897년 'Bottled-in-Bond' 법 제정은 저품질 위스키로부터 소비자를 보호하고 버번의 품질 기준을 정립한 역사적 전환점이 되었으며, 오늘날 전 세계에서 가장 규제가 엄격하고 신뢰받는 위스키 스타일 중 하나로 자리 잡았다.",
        classifications: [
            {
                name: "버번 위스키 (Bourbon Whiskey)",
                criteria: "미국 내 생산, 옥수수 51% 이상 매시빌, 증류 시 160 proof(80% ABV) 이하 유지, 새 탄화 오크통에 125 proof(62.5% ABV) 이하로 입창, 첨가물(색소/향료) 절대 금지, 최소 80 proof(40% ABV) 이상 병입",
                description: "인공적인 색소 없이 오직 '새 오크통'과의 상호작용만으로 호박색과 향미를 얻는다. 옥수수의 비중이 높을수록 질감이 오일리하고 달콤해지며, 숙성 중 증발하는 '엔젤스 쉐어(Angel's Share)' 비율이 스코틀랜드보다 훨씬 높아 숙성이 매우 빠르게 진행되는 것이 특징이다."
            },
            {
                name: "스트레이트 버번 (Straight Bourbon)",
                criteria: "기본 버번 요건 + 최소 2년 이상 숙성, 물 이외의 어떤 혼합물도 불가, 4년 미만 숙성 시 반드시 라벨에 숙성 연수(Age Statement) 표기 의무",
                description: "가장 대중적이고 신뢰받는 카테고리로, 최소 2년의 시간이 오크통의 거친 면을 깎아내어 카라멜, 토피, 가죽의 복합적인 노트를 완성한다. 숙성 연수가 표기되지 않은 스트레이트 버번은 최소 4년 이상 숙성되었음을 의미한다."
            },
            {
                name: "보틀드 인 본드 (Bottled-in-Bond, BiB)",
                criteria: "단일 증류소 + 단일 증류 시즌(상/하반기) + 연방 보세 창고에서 최소 4년 숙성 + 정확히 100 proof(50% ABV)로 병입",
                description: "위스키의 '황금 표준'이라 불리며, 생산 과정의 투명성을 법적으로 보장한다. 50%라는 높은 도수는 타격감 있는 바디감을 선사하며, 유저들이 검색하는 'Bourbon Proof'의 가장 이상적인 기준으로 평가받는다."
            },
            {
                name: "싱글 배럴 (Single Barrel)",
                criteria: "하나의 배럴에서 병입(통상 배럴 간 블렌딩 없음)",
                description: "배럴 위치(상층의 고온·증발), 목재 편차, 충전 강도(entry proof), 숙성 환경에 따른 ‘통 단위 개성’이 극대화된다. 같은 라벨이라도 배럴별로 바닐라·스파이스·과실·오크의 비율이 크게 달라질 수 있다."
            },
            {
                name: "스몰 배치 (Small Batch)",
                criteria: "법적 정의는 없으며, 일반적으로 제한된 수의 배럴을 배치 단위로 블렌딩",
                description: "하우스 스타일을 유지하면서도 배치마다 미세한 개성을 남기는 방식이다. 제조사가 의도한 밸런스(단맛/스파이스/오크)를 비교적 안정적으로 제공하면서, 싱글 배럴보다 일관성이 높다."
            },
            {
                name: "캐스크 스트렝스 / 배럴 프루프 (Cask Strength / Barrel Proof)",
                criteria: "배럴에서 나온 도수에 가깝게(또는 희석 최소화) 병입",
                description: "알코올의 볼륨과 향의 농도가 높아 오크·향신료·캔디드 프루트가 강하게 분출되지만, 자극도 커질 수 있다. 물 몇 방울(또는 소량 가수)로 향이 열리며 바닐라·카라멜·과실이 더 또렷해지는 경우가 많다."
            },
            {
                name: "위티드 버번 (Wheated Bourbon)",
                criteria: "매시빌의 ‘향신료 곡물(secondary grain)’로 호밀 대신 밀을 주로 사용",
                description: "호밀 특유의 후추/허브 스파이스가 줄고, 빵·비스킷·꿀·토피 같은 부드러운 단맛이 강조되는 경향이 있다. 입 안에서 질감이 둥글고 크리미하게 느껴지기 쉬워 버번 입문자에게도 적합하다."
            },
            {
                name: "하이-라이 버번 (High-Rye Bourbon)",
                criteria: "옥수수 51% 이상을 유지하되 호밀 비율을 상대적으로 높게 설계",
                description: "후추, 계피, 정향 같은 ‘베이킹 스파이스’와 드라이한 허브 톤이 뚜렷해져, 단맛 대비 긴장감이 생긴다. 올드패션드 같은 칵테일에서 비터·시트러스와의 결이 좋아 선호도가 높다."
            },
            {
                name: "피니시드 버번 (Cask-Finished Bourbon)",
                criteria: "버번(또는 스트레이트 버번)으로 기본 숙성을 거친 뒤, 다른 종류의 통에서 추가 숙성(피니시)",
                description: "법적 ‘버번’ 규정(새 탄화 오크통 숙성)으로 만든 베이스 위에, 피니시 캐스크의 풍미(와인/럼/셰리/포트 등)가 레이어링된다. 달콤함·과실·스파이스가 증폭될 수 있지만, 베이스의 오크/곡물 캐릭터와 균형이 중요하다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "도수/알코올 볼륨",
                label: "ABV/Proof",
                value: "40~65% ABV (80~130 proof)",
                description: "미국식 단위인 'Proof'는 ABV 수치의 정확히 2배이다. 80 proof는 법적 최소치이며, 매니아들은 100 proof(50% ABV) 이상의 고도수에서 오는 진한 오크 스파이스와 타격감을 선호한다."
            },
            {
                metric: "옥수수 비율",
                label: "Mash Bill (Corn %)",
                value: "51~80% (일반적 범위)",
                description: "옥수수 비율이 높을수록 꿀·카라멜·콘브레드 같은 달콤하고 둥근 톤이 강화되는 경향이 있다. 단, 과도한 단맛이 느껴질 경우 오크 스파이스/탄닌과의 균형이 핵심이다."
            },
            {
                metric: "향신료 곡물 성격",
                label: "Rye vs Wheat",
                value: "Rye High / Balanced / Wheat Dominant",
                description: "호밀은 후추·허브·건조한 스파이스로 ‘날카로운 윤곽’을 만들고, 밀은 빵·비스킷·토피 톤으로 ‘부드러운 질감’을 만든다. 같은 숙성 연수라도 secondary grain에 따라 피니시의 드라이함과 스파이스 강도가 크게 달라진다."
            },
            {
                metric: "배럴 탄화 강도",
                label: "Char Level (통상 #1~#4)",
                value: "#3~#4 (상업적 표준 빈도 높음)",
                description: "탄화가 깊을수록 목재 내부의 열분해로 바닐라(리그닌 유래), 카라멜/토피(당 분해), 스모키/토스트 노트가 강화되기 쉽다. 동시에 탄화층이 여과층 역할을 해 거친 요소를 누그러뜨릴 수 있다."
            },
            {
                metric: "숙성 연수",
                label: "Age Statement (Years)",
                value: "2~12+ years",
                description: "연수가 증가할수록 오크 유래 탄닌·스파이스·가죽/담배 같은 성숙 노트가 증가한다. 다만 과숙성 시 마른 나무/쓴맛이 두드러질 수 있어, 증류소 스타일과 창고 환경(기후·배럴 위치)이 결과를 좌우한다."
            },
            {
                metric: "배럴 입창 도수",
                label: "Entry Proof",
                value: "50~62.5% ABV (최대 62.5%)",
                description: "입창 도수는 숙성 중 추출되는 성분의 비율에 영향을 준다. 상대적으로 낮은 입창 도수는 달콤·오일리한 질감이 강조될 수 있고, 높은 입창 도수는 스파이스·오크의 날이 서게 느껴질 수 있다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "옥수수 (Corn)",
                description: "버번의 법적·감각적 핵심. 꿀, 카라멜, 콘브레드 같은 달콤한 베이스를 형성하고, 오크 숙성에서 생성되는 바닐라/토피 노트의 ‘받침대’ 역할을 한다."
            },
            {
                type: "주원료",
                name: "호밀 (Rye) 또는 밀 (Wheat)",
                description: "호밀은 후추·정향·허브 같은 스파이스로 구조감을 만들고, 밀은 부드러운 단맛과 크리미한 질감을 강화한다. 브랜드의 하우스 스타일을 가장 직관적으로 바꾸는 변수다."
            },
            {
                type: "주원료",
                name: "맥아 보리 (Malted Barley)",
                description: "당화 효소(아밀라아제) 공급원으로 전분을 발효 가능한 당으로 바꿔 발효 효율과 바디를 결정한다. 견과, 비스킷 같은 고소한 뉘앙스를 소량 부여하기도 한다."
            },
            {
                type: "발효제",
                name: "효모 (Yeast Strain)",
                description: "에스터·고급 알코올 생성 패턴을 통해 과일(사과/바나나/체리), 플로럴, 스파이스의 방향성을 결정한다. 같은 매시빌이라도 효모가 다르면 향의 ‘결’이 크게 달라진다."
            },
            {
                type: "숙성통",
                name: "새 탄화 아메리칸 오크통 (New Charred American Oak)",
                description: "버번 향미의 대부분을 제공하는 핵심 요소. 리그닌·헤미셀룰로오스 분해로 바닐라, 카라멜, 코코넛(오크 락톤), 토스트/스모크가 형성되며, 숙성 중 산화·농축으로 복합미가 쌓인다."
            },
            {
                type: "공정 보조",
                name: "사워 매시(Backset) 또는 pH 조정",
                description: "이전 증류 잔액(backset)을 일부 되돌려 pH를 안정화하고 미생물 오염 리스크를 낮춘다. 발효의 일관성을 높여 하우스 스타일 유지에 기여한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "분쇄",
                name: "Grist Milling",
                description: "옥수수·호밀/밀·맥아 보리를 목표 입도(분말/거친 분쇄)로 분쇄해 추출 효율을 확보한다. 지나친 미분은 점도 상승과 여과/펌핑 문제를 만들 수 있어 균형이 중요하다."
            },
            {
                step: "당화 전 처리",
                name: "Cooking & Gelatinization",
                description: "옥수수 전분을 젤라틴화시키기 위해 고온으로 쿠킹한 뒤, 단계적으로 온도를 내려 다른 곡물과 맥아를 투입한다. 이 단계의 온도·시간 제어가 바디감과 발효 효율에 직접 연결된다."
            },
            {
                step: "당화",
                name: "Enzymatic Saccharification",
                description: "맥아 효소로 전분을 당으로 전환해 발효 가능한 당 조성을 만든다. 당 조성이 달라지면 발효 산물(에스터/알데하이드)도 달라져 향의 방향성이 바뀐다."
            },
            {
                step: "매시 설계",
                name: "Sour Mash Process",
                description: "backset(사워 워터)을 재사용해 pH를 안정화하고 발효 환경을 일정하게 만든다. 결과적으로 매 배치의 편차를 줄이고, 증류소 고유의 프로파일을 꾸준히 유지하는 데 유리하다."
            },
            {
                step: "발효",
                name: "Fermentation (3~7 days typical)",
                description: "효모가 당을 알코올과 향 성분(에스터, 고급 알코올 등)으로 전환한다. 발효 온도가 높으면 과일·스파이스가 강해질 수 있으나 거친 요톤도 생길 수 있어, 온도/시간/효모 관리가 핵심이다."
            },
            {
                step: "증류",
                name: "Continuous Column Still + Doubler/Thumper",
                description: "컬럼 스틸로 연속 증류해 효율을 확보하고, 더블러/섬퍼로 2차 증류에 준하는 정제와 향 조정을 한다. 160 proof 이하로 증류해야 곡물의 풍미가 유지되며, 컷(헤드/하트/테일) 선택이 클린함과 바디를 결정한다."
            },
            {
                step: "배럴링",
                name: "Entry Proof & Barreling",
                description: "증류액을 62.5% ABV 이하로 조정해 새 탄화 오크통에 채운다. 입창 도수는 숙성 중 용출되는 성분의 비율과 질감에 영향을 주며, 향미 균형의 중요한 레버다."
            },
            {
                step: "숙성",
                name: "Rickhouse Maturation",
                description: "창고 내 온도·일교차로 위스키가 목재를 드나들며 바닐라/카라멜/오크 스파이스를 얻고 산화로 복합미가 쌓인다. 상층은 더 진하고 오키하게, 하층은 더 부드럽고 균형적으로 성숙하는 경향이 있어 배럴 위치가 큰 변수다."
            },
            {
                step: "배치 구성",
                name: "Batching / Blending / Barrel Selection",
                description: "목표 프로파일에 맞춰 여러 배럴을 블렌딩(스몰 배치)하거나 개성 있는 한 통을 선택(싱글 배럴)한다. 이 단계에서 달콤함·스파이스·오크·과실의 밸런스를 설계한다."
            },
            {
                step: "병입",
                name: "Proofing, Filtration & Bottling",
                description: "병입 도수로 희석(또는 무가수로 병입)하고, 필요 시 여과(칠 필터링/논칠)를 적용한다. 칠 필터링은 저온 혼탁을 줄이지만 질감과 향의 일부를 덜어낼 수 있어, 스타일에 따라 선택이 갈린다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "글렌캐런(Glencairn) 또는 올드패션드 글라스(온더락)",
            optimalTemperatures: [
                {
                    temp: "18~22℃ (니트)",
                    description: "바닐라, 카라멜, 오크 스파이스가 가장 선명하고, 입안에서 점도감과 여운이 길게 이어진다."
                },
                {
                    temp: "18~22℃ + 가수",
                    description: "높은 알코올의 자극을 풀어주어 감춰져 있던 과실과 에스터 톤이 화사하게 드러난다."
                },
                {
                    temp: "0~4℃ (온더락)",
                    description: "자극이 줄고 옥수수 특유의 단맛이 부각되어 묵직하고 부드럽게 마시기 좋다."
                }
            ],
            methods: [
                {
                    name: "니트 (Neat)",
                    description: "상온에서 얼음이나 물 없이 마시는 방법으로, 버번 특유의 묵직한 바디감과 직관적인 오크의 풍미를 온전히 느낄 수 있는 정석적인 방법이다."
                },
                {
                    name: "가수 (Water Addition)",
                    description: "상온의 물을 한두 방울 떨어뜨리면 위스키의 표면장력이 깨지며 캐스크 스트렝스 같이 도수가 높은 버번의 숨겨진 카라멜과 과실 향이 폭발적으로 피어오른다."
                },
                {
                    name: "하이볼 / 칵테일",
                    description: "올드패션드, 맨해튼, 위스키 사워 같은 클래식 칵테일의 베이스로 가장 완벽하며, 탄산수와 섞는 하이볼로 즐기면 스모키함과 펀치력이 탄산과 훌륭한 조화를 이룬다."
                },
                {
                    name: "온더락 (On the Rocks)",
                    description: "크고 단단한 구형 얼음 위에 부어 마시면 낮은 온도로 인해 알코올의 거친 각이 줄어들고, 녹아내리는 얼음물과 함께 달달하고 마시기 편한 상태로 변화한다."
                }
            ]
        },
        flavorTags: [
            { label: "바닐라/카라멜", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "토피/브라운슈가", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "메이플/꿀", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "오크/토스트", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "코코넛", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "스파이스(시나몬)", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "후추/호밀", color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
            { label: "체리/과실", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "가죽/타바코", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "스모키/숯", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "민트/허브", color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' }
        ],
        foodPairing: [
            "바비큐(브리스킷/풀드포크) & 스모크 소스",
            "그릴드 스테이크/양고기",
            "프라이드 치킨(스파이시)",
            "베이컨/메이플 글레이즈",
            "에이징 체다·고다 등 숙성 치즈",
            "피칸 파이/카라멜 디저트",
            "다크 초콜릿(70% 이상)·초코 브라우니",
            "로스티드 넛츠(피칸/아몬드)",
            "버섯구이·트러플 풍미 요리",
            "훈제 연어 또는 훈제 오리"
        ],
        relatedPageSlug: 'us-whiskey-regions',
        relatedPageLabelKo: '🗺️ 미국 위스키 산지별 스타일 탐험하기 (켄터키·테네시·라이) →',
        relatedPageLabelEn: '🗺️ Explore American Whiskey Regions (Kentucky, Tennessee, Rye) →',
        faqs: [
            {
                question: "버번 배럴 하나에서 위스키가 몇 병이나 나오나요?",
                answer: "표준 53갤런(약 200리터) 배럴 기준으로, 숙성 기간 동안 증발하는 '천사의 몫(Angel's Share)'을 제외하면 보통 150~200병 정도가 생산됩니다."
            },
            {
                question: "버번 특유의 단맛은 설탕 때문인가요?",
                answer: "아니요. 버번은 법적으로 어떠한 인공 첨가물이나 색소, 설탕을 넣을 수 없습니다. 특유의 바닐라와 달콤한 캐러멜 풍미는 오직 안을 불에 그을린 '새 참나무통(New Charred Oak)'에서 숙성하며 천연 성분을 추출하여 얻어진 것입니다."
            },
            {
                question: "버번이라 부르기 위한 법적 요건은 무엇인가요?",
                answer: "반드시 미국 내에서 제조되어야 하며, 원재료의 51% 이상이 옥수수여야 합니다. 또한 불에 그을린 새 아메리칸 오크통에서 숙성해야 하고, 병입 시 알코올 도수가 최소 40% (80 proof) 이상이어야 합니다."
            }
        ]
    },
    sectionsEn: {
        definition: "Bourbon Whiskey is a 'distinctive product of the United States,' officially recognized by Congress in 1964 as America’s Native Spirit. It must be produced in the USA from a grain mash of at least 51% corn and aged in new, charred American oak containers. Unlike Scotch or Canadian whisky, Bourbon strictly prohibits any additives like coloring or flavoring, ensuring a pure and bold profile of natural vanilla and caramel.",
        history: "The origins of Bourbon date back to the late 18th century with settlers in Kentucky. Legend credits Reverend Elijah Craig as the first to age spirit in charred oak barrels. Its name was popularized as it was shipped down the Mississippi River to 'Bourbon Street' in New Orleans. The 1897 Bottled-in-Bond Act was a historic milestone that protected consumers from low-quality spirits and established the rigorous standards that make Bourbon one of the world's most trusted whiskey styles today.",
        classifications: [
            {
                name: "Bourbon Whiskey",
                criteria: "Produced in the USA; mash bill of 51%+ corn; distilled at no more than 160 proof (80% ABV); entered into new charred oak at no more than 125 proof (62.5% ABV); no additives (color/flavor) allowed; bottled at 80 proof (40% ABV) or higher.",
                description: "Bourbon gains its amber hue and rich flavor solely through interaction with new oak. A higher corn percentage results in an oily, sweet texture. Due to the warmer climate in the US, the 'Angel's Share' (evaporation) is much higher than in Scotland, leading to a more rapid and intense maturation process."
            },
            {
                name: "Straight Bourbon",
                criteria: "Meets all Bourbon requirements + aged for at least 2 years; no coloring or flavoring added; must include an age statement if aged less than 4 years.",
                description: "The gold standard for reliability. At least 2 years of aging rounds off the edges, developing complex notes of caramel, toffee, and leather. If no age is stated, the Straight Bourbon is guaranteed to be at least 4 years old."
            },
            {
                name: "Bottled-in-Bond (BiB)",
                criteria: "Product of one distillery + one distilling season + aged in a federally bonded warehouse for at least 4 years + bottled at exactly 100 proof (50% ABV).",
                description: "Often called the 'Gold Standard,' this category legally guarantees transparency. The 100-proof strength provides a robust body and is the ideal benchmark for users searching for the authentic 'Bourbon Proof' experience."
            },
            {
                name: "Single Barrel",
                criteria: "Bottled from a individual, unique barrel without blending.",
                description: "Maximizes the specific character of a single cask, influenced by its location in the rickhouse (high heat/evaporation at the top), wood variance, and entry proof. Ratios of vanilla, spice, and fruit can vary significantly even under the same label."
            },
            {
                name: "Small Batch",
                criteria: "No legal definition; generally refers to blending a limited number of selected barrels.",
                description: "Aims to maintain a house style while allowing for subtle batch nuances. It provides a more consistent balance of sweetness and spice compared to single barrel offerings."
            },
            {
                name: "Cask Strength / Barrel Proof",
                criteria: "Bottled at the proof directly from the barrel (or with minimal dilution).",
                description: "Features intense alcohol volume and concentrated flavors of oak, baking spices, and candied fruit. Adding a few drops of water often opens up hidden notes of vanilla and caramel."
            },
            {
                name: "Wheated Bourbon",
                criteria: "Uses wheat as the secondary 'flavor grain' instead of rye.",
                description: "Reduces the peppery/herbal spice of rye, emphasizing soft sweetness like bread, biscuits, honey, and toffee. Known for a rounder, creamier mouthfeel, making it highly approachable for beginners."
            },
            {
                name: "High-Rye Bourbon",
                criteria: "Maintains 51% corn but features a significantly higher proportion of rye.",
                description: "Brings forward 'baking spices' like black pepper, cinnamon, and cloves along with dry herbal tones. The spicy tension contrasts the corn sweetness, pairing exceptionally well with bitters and citrus in cocktails."
            },
            {
                name: "Cask-Finished Bourbon",
                criteria: "Bourbon that has undergone additional maturation (finishing) in a different type of cask after initial aging in new charred oak.",
                description: "Layers secondary flavors (from wine, rum, sherry, or port casks) onto the traditional bourbon base. It amplifies sweetness and fruitiness, though balancing the finish with the original oak character is key."
            }
        ],
        sensoryMetrics: [
            {
                metric: "Proof / Alcohol Volume",
                label: "ABV/Proof",
                value: "40~65% ABV (80~130 proof)",
                description: "The American 'Proof' unit is exactly double the ABV percentage. 80 proof is the legal minimum, while enthusiasts often seek 100 proof (50% ABV) or higher for more concentrated oak spices and a bolder mouthfeel."
            },
            {
                metric: "Corn Proportion",
                label: "Mash Bill (Corn %)",
                value: "51~80% (Typical Range)",
                description: "Higher corn content bolsters sweet, round tones like honey and cornbread. Balance with oak tannins and spice is critical to prevent cloying sweetness."
            },
            {
                metric: "Secondary Grain Character",
                label: "Rye vs Wheat",
                value: "Rye High / Balanced / Wheat Dominant",
                description: "Rye provides a sharp outline with pepper and herbs; wheat creates a soft texture with biscuit and toffee notes. This grain choice dictates the spice intensity of the finish."
            },
            {
                metric: "Barrel Char Level",
                label: "Char Level (#1 to #4)",
                value: "#3 to #4 (Commercial Standard)",
                description: "Deeper char levels increase vanilla (from lignin), caramel (from sugar breakdown), and smoky/toasted notes. The char also acts as a filter to mellow harsh elements."
            },
            {
                metric: "Age Statement",
                label: "Age (Years)",
                value: "2~12+ years",
                description: "Increased age brings more wood-derived tannins, leather, and tobacco. However, over-aging can lead to dry wood bitterness, depending on the rickhouse microclimate."
            },
            {
                metric: "Barrel Entry Proof",
                label: "Entry Proof",
                value: "50~62.5% ABV (Max 62.5%)",
                description: "The proof at which the spirit enters the barrel affects the ratio of extracted components. Lower entry proofs can yield a sweeter, oilier texture, while higher proofs may sharpen spice and oak notes."
            }
        ],
        coreIngredients: [
            {
                type: "Primary Grain",
                name: "Corn",
                description: "The legal and sensory heart of Bourbon. It forms a sweet base of honey and cornbread, acting as a canvas for the vanilla and toffee notes from the oak."
            },
            {
                type: "Flavor Grain",
                name: "Rye or Wheat",
                description: "Rye provides structure through pepper and cloves; wheat enhances soft sweetness and creamy texture. This is the primary variable for a brand's house style."
            },
            {
                type: "Enzyme Source",
                name: "Malted Barley",
                description: "Provides amylase enzymes to convert starches into fermentable sugars. It also adds subtle nutty and biscuity nuances."
            },
            {
                type: "Fermenter",
                name: "Yeast Strain",
                description: "Dictates the direction of esters and higher alcohols, producing fruity (apple/cherry), floral, or spicy notes."
            },
            {
                type: "Maturation Vessel",
                name: "New Charred American Oak",
                description: "The source of most bourbon flavors. Breakdown of wood components creates vanilla, caramel, coconut (oak lactones), and smoke."
            },
            {
                type: "Process Aid",
                name: "Sour Mash (Backset)",
                description: "A portion of the previous distillation residue is reused to stabilize pH and prevent microbial contamination, ensuring consistency across batches."
            }
        ],
        manufacturingProcess: [
            {
                step: "Milling",
                name: "Grist Milling",
                description: "Grains are ground to a specific particle size to optimize extraction efficiency. A balance is needed to prevent high viscosity and pumping issues."
            },
            {
                step: "Cooking",
                name: "Gelatinization",
                description: "Corn is cooked at high temperatures to gelatinize starch, followed by step-cooling before adding other grains and malt."
            },
            {
                step: "Mashing",
                name: "Enzymatic Saccharification",
                description: "Malt enzymes convert starches into sugars. The sugar composition influences the resulting fermentation products (esters/aldehydes)."
            },
            {
                step: "Mash Design",
                name: "Sour Mash Process",
                description: "The backset stabilizes pH, maintaining a consistent fermentation environment and the distillery's unique profile over time."
            },
            {
                step: "Fermentation",
                name: "Fermentation (3–7 days)",
                description: "Yeast converts sugars into alcohol and aromatic compounds. Careful management of temperature and time is key to controlling fruitiness vs. harshness."
            },
            {
                step: "Distillation",
                name: "Continuous Column Still + Doubler/Thumper",
                description: "Continuous distillation ensures efficiency, while the doubler/thumper provides a secondary refinement. Distilling below 160 proof preserves grain character."
            },
            {
                step: "Barreling",
                name: "Entry Proof & Barreling",
                description: "Spirit is diluted to no more than 62.5% ABV and put into new charred oak. This 'entry proof' is a critical lever for flavor balance and texture."
            },
            {
                step: "Maturation",
                name: "Rickhouse Maturation",
                description: "Temperature fluctuations cause the whiskey to move in and out of the wood, gaining vanilla, caramel, and spice while oxidizing for complexity."
            },
            {
                step: "Batching",
                name: "Blending & Barrel Selection",
                description: "Barrels are blended for small batches or a single stand-out cask is selected for bottling to meet specific flavor goals."
            },
            {
                step: "Bottling",
                name: "Proofing & Filtration",
                description: "The whiskey is proofed with water (unless barrel proof) and filtered. Non-chill filtration is often preferred for retaining full texture and flavor oils."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "Glencairn Glass or Old Fashioned Glass (for Rocks)",
            optimalTemperatures: [
                {
                    temp: "18~22°C (Neat)",
                    description: "Best for experiencing vivid vanilla, caramel, and oak spices with a long, viscous finish."
                },
                {
                    temp: "18~22°C + Water",
                    description: "A few drops of water break surface tension, allowing hidden esters and floral/fruit notes to bloom."
                },
                {
                    temp: "0~4°C (On the Rocks)",
                    description: "Reduces alcohol bite and highlights the round sweetness of the corn for a smooth, chilled experience."
                }
            ],
            methods: [
                {
                    name: "Neat",
                    description: "The standard way to appreciate the heavy body and direct oak profile without dilution or chilling."
                },
                {
                    name: "With Water",
                    description: "Recommended for high-proof or barrel-proof expressions to release complex aromas."
                },
                {
                    name: "Cocktails",
                    description: "The backbone of classics like the Old Fashioned, Manhattan, or Whiskey Sour. Also excellent in highballs where smokiness meets carbonation."
                },
                {
                    name: "On the Rocks",
                    description: "Serving over a large, clear ice sphere mellows the alcohol's edge, transitioning the drink into a softer, sweeter profile."
                }
            ]
        },
        flavorTags: [
            { label: "Vanilla/Caramel", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "Toffee/Brown Sugar", color: 'bg-orange-200 text-orange-950 dark:bg-orange-900/40 dark:text-orange-100' },
            { label: "Maple/Honey", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "Oak/Toasted", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "Coconut", color: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-900/40 dark:text-yellow-100' },
            { label: "Cinnamon Spice", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "Pepper/Rye", color: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100' },
            { label: "Cherry/Stone Fruit", color: 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100' },
            { label: "Leather/Tobacco", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "Smoke/Char", color: 'bg-stone-200 text-stone-950 dark:bg-stone-900/40 dark:text-stone-100' },
            { label: "Mint/Herbal", color: 'bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' }
        ],
        foodPairing: [
            "BBQ (Brisket/Pulled Pork) with Smokey Sauce",
            "Grilled Steak or Lamb",
            "Spicy Fried Chicken",
            "Bacon with Maple Glaze",
            "Aged Cheeses (Cheddar, Gouda)",
            "Pecan Pie or Caramel Desserts",
            "Dark Chocolate (70%+) or Brownies",
            "Roasted Nuts (Pecans, Almonds)",
            "Grilled Mushrooms with Truffle Oil",
            "Smoked Salmon or Duck"
        ],
        relatedPageSlug: 'us-whiskey-regions',
        relatedPageLabelKo: '🗺️ 미국 위스키 산지별 스타일 탐험하기 (켄터키·테네시·라이) →',
        relatedPageLabelEn: '🗺️ Explore American Whiskey Regions (Kentucky, Tennessee, Rye) →',
        faqs: [
            {
                question: "How many bottles of bourbon per barrel?",
                answer: "A standard 53-gallon (about 200 liters) bourbon barrel typically yields around 150 to 200 bottles. This number varies depending on the 'Angel's Share'—the amount of liquid that naturally evaporates during the multi-year aging process."
            },
            {
                question: "Does bourbon have sugar?",
                answer: "No, bourbon does not contain any added sugar. By law, bourbon production strictly prohibits the addition of flavoring, coloring, or sweetening additives. The sweet vanilla and caramel notes you taste come entirely from the natural wood sugars extracted from the newly charred oak barrels during maturation."
            },
            {
                question: "What are the strict bourbon requirements?",
                answer: "To legally be called bourbon, the whiskey must be produced in the United States, made from a grain mixture that is at least 51% corn, and aged in new, charred oak containers. Furthermore, it must be distilled to no more than 160 proof, entered into the barrel at no more than 125 proof, and bottled at no less than 80 proof (40% ABV)."
            }
        ]
    }
}
