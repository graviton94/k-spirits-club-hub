import { SpiritCategory } from './types'

export const liqueur: SpiritCategory = {
    slug: 'liqueur',
    emoji: '🧪',
    nameKo: '리큐르',
    nameEn: 'Liqueur',
    taglineKo: '천만 가지 향과 맛을 빚어내는 칵테일의 연금술',
    taglineEn: 'The alchemy of flavors — from ancient elixirs to modern mixology',
    color: 'emerald',
    sections: {
        definition: "리큐르(Liqueur)는 중성 주정 또는 증류주(브랜디·럼·위스키 등)에 과일, 허브, 향신료, 견과, 커피, 크림 같은 향미 원료와 당(감미)을 더해 만든 가향(플레이버드) 주류다. 일반적으로 단독 음용뿐 아니라 칵테일의 향·당도·질감을 설계하는 ‘조미료’ 역할을 한다.",
        history: "리큐르의 뿌리는 중세 유럽 수도원과 약방에서 허브·향신료를 술에 우려내 만든 약용 엘릭서(tonic) 문화에 있다. 17~19세기에는 설탕의 보급과 증류 기술의 발전으로 상업적 리큐르 브랜드가 등장했으며, 20세기 칵테일 문화의 확산과 함께 세계적으로 표준화되었다.",
        classifications: [
            {
                name: "과일(프루트) 리큐르",
                criteria: "과일 기반의 향미 침출 및 당분 부여",
                description: "베리, 복숭아, 체리 등 과실 향을 전면에 내세우며 산미와 당도의 균형이 핵심이다. 스파클링 와인이나 하이볼 칵테일의 향미 보강에 자주 쓰인다."
            },
            {
                name: "시트러스/오렌지 리큐르",
                criteria: "오렌지 껍질 향 필(Peel) 위주 (트리플 섹, 퀴라소 등)",
                description: "마가리타, 사이드카 같은 클래식 칵테일의 핵심 구성요소다. 산미와 결합했을 때 향이 폭발적으로 확장되며, 하이엔드 제품은 브랜디 베이스를 사용하기도 한다."
            },
            {
                name: "허벌 & 비터 리큐르 (아마로)",
                criteria: "다종의 허브, 뿌리, 씨앗 블렌딩 및 쓴맛 보타니컬 사용",
                description: "멘톨감, 송진, 약초의 복합미가 특징이다. 식후주(Digestif)로 발달했으며 단맛과 쓴맛의 조화가 피니시를 결정하는 중요한 축이 된다."
            },
            {
                name: "아니스(Anise) 리큐르",
                criteria: "아니스/펜넬 특유의 감초 향, 물을 타면 투명도가 변하는 루슈 현상",
                description: "강한 감초, 화한 허브 향이 특징이다. 소화주로도 즐기며, 물이나 얼음과 만나면 질감이 우유처럼 부드러워지는 독특한 시각적 변화가 있다."
            },
            {
                name: "견과(넛) & 커피 & 카카오 리큐르",
                criteria: "아몬드, 커피, 카카오 원료의 추출액 기반",
                description: "마지팬, 로스팅 향, 초콜릿의 깊은 풍미가 두드러진다. 디저트 칵테일에서 압도적인 존재감을 발휘한다."
            },
            {
                name: "크림(Cream) 리큐르",
                criteria: "유제품(크림) + 증류주 + 당 유화 공정",
                description: "풍부한 점도와 부드러운 단맛이 특징이다. 차게 마실수록 질감이 깔끔해지며, 칵테일 설계 시 산도가 높은 재료와의 분리 위험을 주의해야 한다."
            },
            {
                name: "‘Crème de …’ 스타일",
                criteria: "법적 최저 당분 함량 기준을 충족하는 고당도 리큐르",
                description: "이름의 ‘크렘’은 유제품이 아니라 점도 높은 질감을 의미한다. 농축된 향과 실키한 텍스처 덕분에 소량으로도 강한 풍미를 제공한다."
            },
            {
                name: "배럴 숙성 리큐르",
                criteria: "침출/블렌딩 후 오크 캐스크에서 추가 에이징",
                description: "바닐라, 토스트 등 오크 유래 풍미가 더해져 단맛이 둥글어진다. 위스키나 브랜디 애호가에게도 친숙한 묵직한 스타일이다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수",
                label: "ABV (%)",
                value: "15~55% (광범위)",
                description: "도수가 높을수록 향 성분을 강하게 운반하고 바디가 탄탄해지며, 낮을수록 디저트 성격이 강해진다."
            },
            {
                metric: "당도/점도",
                label: "Viscosity",
                value: "High to Syrupy",
                description: "당 함량이 높을수록 입안을 코팅하는 질감이 증가한다. 차게 서빙하면 점도가 올라가 더욱 묵직하게 느껴진다."
            },
            {
                metric: "쓴맛/약초 표현",
                label: "Bitterness",
                value: "Variable (아마로는 High)",
                description: "보타니컬 성분의 쓴맛과 단맛의 조화가 고급스러운 풍미의 핵심이다. 식후주로 갈수록 쓴맛의 존재감이 커진다."
            }
        ],
        coreIngredients: [
            {
                type: "베이스 스피릿",
                name: "중성 주정 또는 숙성 증류주 (브랜디/럼 등)",
                description: "리큐르의 바탕 맛을 만든다. 숙성 증류주 베이스는 원료 향에 고유의 깊이와 레이어를 추가한다."
            },
            {
                type: "향미 원료",
                name: "과일, 허브, 향신료, 견과, 등",
                description: "침출과 증류를 통해 추출된 에센스가 리큐르의 정체성을 결정짓는다."
            },
            {
                type: "감미료",
                name: "설탕, 시럽, 꿀 등",
                description: "단맛뿐 아니라 향의 확산과 질감을 만든다. 적절한 당도는 알코올의 공격성을 줄이고 향을 돋보이게 한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "추출",
                name: "침출(Maceration) 및 퍼콜레이션",
                description: "스피릿에 원료를 담가 향을 용출시키거나 연속적으로 통과시켜 원액을 얻는다."
            },
            {
                step: "증류",
                name: "재증류 (Redistillation)",
                description: "추출액을 다시 증류하여 거친 맛을 줄이고 화사한 탑노트를 맑게 강조한다."
            },
            {
                step: "조합/여과",
                name: "배합 및 안정화",
                description: "당도와 도수를 정밀하게 맞추고, 불순물을 여과한 뒤 일정 기간 휴식시켜 향미를 통합한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "코디얼 글라스, 록스 글라스 또는 칵테일 쿠페",
            optimalTemperatures: [
                {
                    temp: "6~10℃ (칠드)",
                    description: "단맛이 단정하게 정돈되며, 과일이나 크림 계열의 리큐르를 깔끔한 디저트 톤으로 즐기기에 좋다."
                },
                {
                    temp: "18~22℃ (상온)",
                    description: "허브나 아마로 계열의 복합적인 아로마가 풍부하게 열리며, 피니시의 쓴맛과 스파이스가 선명해진다."
                }
            ],
            methods: [
                {
                    name: "니트 (Neat/Sipping)",
                    description: "작은 잔에 따라 향과 맛을 조금씩 음미하는 방식으로, 식후주(Digestif)로 가장 추천된다."
                },
                {
                    name: "온더락 (On the Rocks)",
                    description: "얼음 위에 부어 마시면 도수는 완화되고 질감은 묵직해지며 단맛이 차분하게 가라앉는다."
                },
                {
                    name: "푸스 카페 (Pousse-Café)",
                    description: "각 리큐르의 비중 차이를 이용해 층층이 쌓아 화려한 시각적 효과를 내며 마시는 방식이다."
                },
                {
                    name: "디저트 토핑 (Affogato Style)",
                    description: "아이스크림이나 에스프레소에 곁들여 리큐르의 농축된 풍미를 시너지 효과로 즐길 수 있다."
                }
            ]
        },
        flavorTags: [
            { label: "시트러스/오렌지", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-300" },
            { label: "베리/과일", color: "bg-rose-600/20 text-zinc-950 dark:text-rose-300" },
            { label: "허브/보타니컬", color: "bg-emerald-600/20 text-zinc-950 dark:text-emerald-300" },
            { label: "민트/쿨링", color: "bg-sky-400/20 text-zinc-950 dark:text-sky-300" },
            { label: "바닐라/카라멜", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "견과/마지팬", color: "bg-amber-500/20 text-zinc-950 dark:text-amber-300" },
            { label: "커피/로스팅", color: "bg-stone-700/20 text-zinc-950 dark:text-stone-300" },
            { label: "다크 초콜릿", color: "bg-stone-600/20 text-zinc-950 dark:text-stone-300" },
            { label: "비터/약초", color: "bg-stone-500/20 text-zinc-950 dark:text-stone-300" },
            { label: "크리미/밀키", color: "bg-amber-400/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "다크 초콜릿 및 티라미수",
            "바닐라 아이스크림 및 에스프레소",
            "각종 과일 타르트 및 샤베트",
            "블루 치즈 및 숙성 하드 치즈",
            "훈제 햄 및 사퀴테리 (비터 계열)"
        ],
        dbCategories: ['리큐르']
    }
}
