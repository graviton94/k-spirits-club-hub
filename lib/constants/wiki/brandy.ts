import { SpiritCategory } from './types'

export const brandy: SpiritCategory = {
    slug: 'brandy',
    emoji: '🍇',
    nameKo: '브랜디',
    nameEn: 'Brandy',
    taglineKo: '과일을 발효·증류해 만든 우아한 스피리츠',
    taglineEn: 'Elegant spirit distilled from fermented fruit, wine, or pomace',
    color: 'orange',
    sections: {
        definition: "브랜디(Brandy)는 포도나 사과·배 등 과일을 발효해 만든 과실주를 증류한 뒤, 오크 숙성을 거치거나 그대로 병입하여 완성하는 증류주다. 과실 본연의 향과 숙성을 통한 오크·바닐라·란시오(Rancio)까지 폭넓은 풍미 스펙트럼을 지닌다.",
        history: "중세 유럽에서 와인을 장거리 운송하기 위해 증류하여 농축하던 '브란데베인(Brandewijn)'에서 유래했다. 프랑스의 코냑과 아르마냑 지역을 중심으로 증류·숙성 기술이 비약적으로 발전하며 근대 주류 문화의 정점에 있는 프리미엄 스피릿으로 자리 잡았다.",
        classifications: [
            {
                name: "포도 브랜디 (Grape Brandy)",
                criteria: "포도즙을 발효한 베이스 와인을 증류",
                description: "가장 전형적인 브랜디다. 코냑과 아르마냑이 대표적이며, 포도의 꽃향기와 숙성된 건과일, 견과류 향이 조화를 이루는 우아한 스타일이다."
            },
            {
                name: "과실 브랜디 (Eau-de-vie / Fruit Brandy)",
                criteria: "사과, 배, 체리 등 포도 이외의 과일을 발효 후 증류",
                description: "원료 과실의 생동감 넘치는 아로마가 특징이다. 프랑스의 깔바도스(사과)가 대표적이며, 무숙성 스타일은 과일의 정수를 담은 듯한 향기를 보여준다."
            },
            {
                name: "포마스 브랜디 (Pomace / Grappa)",
                criteria: "와인 압착 후 남은 포도 껍질과 씨를 증류",
                description: "그라파(Grappa) 등이 대표적이다. 껍질 유래의 허브, 건초, 견과류 같은 독특한 페놀릭한 질감과 강렬한 개성을 지닌다."
            },
            {
                name: "코냑 AOC (Cognac)",
                criteria: "샤랑트 지역 생산 + 구리 포트스틸 2회 증류",
                description: "엄격한 기준에 의해 생산되며, 실키한 질감과 플로럴한 탑노트, 장기 숙성에서 오는 란시오(가죽, 버섯 향)의 정교함이 세계 최고 수준이다."
            },
            {
                name: "아르마냑 AOC (Armagnac)",
                criteria: "가스코뉴 지역 생산 + 전통 연속식 증류기 사용",
                description: "코냑보다 더 풍부한 향 성분이 남아 야생적이고 풍부한 과실향, 스파이스, 흙내음 등 테루아의 개성이 명확하게 드러나는 스타일이다."
            },
            {
                name: "헤레스 브랜디 (Brandy de Jerez)",
                criteria: "스페인 헤레스 지역 생산 + 솔레라 시스템 숙성",
                description: "셰리 캐스크 숙성을 통해 견과, 카라멜, 말린 과일 향이 매우 진하게 형성된다. 묵직하고 달콤한 인상을 주는 것이 특징이다."
            },
            {
                name: "V.S / V.S.O.P / X.O / Extra",
                criteria: "최연소 원액의 오크 숙성 기간(2년/4년/10년 이상)에 따른 분류",
                description: "숙성이 길어질수록 과실의 매력은 깊은 숙성미(초콜릿, 가죽, 견과)로 변하며 향의 층위가 기하급수적으로 복합해진다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "숙성 성숙도",
                label: "Maturation Path",
                value: "Fruit → Spice → Rancio",
                description: "시간에 따라 원료 과실향에서 오크 스파이스를 거쳐, 장기 숙성 브랜디의 정점인 란시오(Rancio) 향으로 진화한다."
            },
            {
                metric: "알코올 통합감",
                label: "Mouthfeel",
                value: "Velvety & Silky",
                description: "고급 브랜디일수록 높은 도수임에도 불구하고 입안에서 벨벳처럼 매끄럽게 감기며 타격감보다 향의 확산이 두드러진다."
            },
            {
                metric: "피니시 지속력",
                label: "Persistence",
                value: "Very Short up to 30 mins",
                description: "고숙성 XO 이상의 제품은 한 모금 뒤에도 입안과 코끝에 향이 수십 분간 남아있는 놀라운 지속력을 보여준다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "고산도 화이트 와인 (우니 블랑 등)",
                description: "산도가 높은 와인은 증류 후 향의 뼈대를 남기며, 장기 숙성 시 복합미로 발전할 수 있는 최적의 기반을 제공한다."
            },
            {
                type: "숙성용기",
                name: "프렌치 오크 (리무쟁/트롱세)",
                description: "오크 결의 밀도에 따라 탄닌의 추출 속도를 조절하며 브랜디에 바닐라, 시나몬, 견과류 풍미를 입힌다."
            }
        ],
        manufacturingProcess: [
            {
                step: "증류",
                name: "포트스틸 2회 증류 (코냑 방식)",
                description: "구리 증류기에서 두 번에 걸쳐 천천히 증류하여 순수하고 우아한 원액(Eau-de-vie)만을 정교하게 분리한다."
            },
            {
                step: "숙성",
                name: "배럴 에이징 및 산화",
                description: "오크통에서 수년~수십 년간 숨을 쉬며 알코올의 각을 깎고 숙성 에스터를 생성하여 향의 깊이를 완성한다."
            },
            {
                step: "블렌딩",
                name: "아상블라주 (Assemblage)",
                description: "마스터 블렌더가 수백 종의 원액을 조합하여 일관된 하우스 스타일과 입체적인 향미 레이어를 완성한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "튤립형 브랜디 잔 또는 스니프터",
            optimalTemperatures: [
                {
                    temp: "18~22℃ (상온)",
                    description: "숙성 브랜디의 복합적인 아로마가 가장 균형 있게 피어오르며 알코올 자극이 적절한 온도다."
                },
                {
                    temp: "14~16℃ (약간 서늘하게)",
                    description: "젊은 V.S급이나 과실 브랜디에서 과일 본연의 향이 더 산뜻하게 강조되는 온도다."
                }
            ],
            methods: [
                {
                    name: "니트 (Neat/Sipping)",
                    description: "잔에 따른 뒤 벤팅(공기 접촉) 시간을 충분히 갖고, 향의 변화를 느끼며 천천히 한 모금씩 마시는 정석적인 방법이다."
                },
                {
                    name: "핸드 워밍 (Hand Warming)",
                    description: "스니프터 잔의 아래쪽을 손바닥으로 감싸 온기를 전달하면 묵직한 숙성향과 란시오가 더욱 화려하게 발산된다."
                },
                {
                    name: "브랜디 하이볼 (Sidecar Style)",
                    description: "V.S.O.P급 브랜디에 탄산수나 진저에일을 곁들여 브랜디 특유의 고급스러운 단맛을 청량하게 즐길 수도 있다."
                }
            ]
        },
        flavorTags: [
            { label: "건과일/레이즌", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "바닐라/카라멜", color: "bg-amber-700/20 text-zinc-950 dark:text-amber-300" },
            { label: "오크/토스트", color: "bg-stone-600/20 text-zinc-950 dark:text-stone-300" },
            { label: "시나몬/스파이스", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "견과/셰리향", color: "bg-yellow-600/20 text-zinc-950 dark:text-yellow-300" },
            { label: "화이트 플라워", color: "bg-rose-400/20 text-zinc-950 dark:text-rose-300" },
            { label: "란시오/가죽", color: "bg-stone-700/20 text-zinc-950 dark:text-stone-300" }
        ],
        foodPairing: [
            "다크 초콜릿 및 테라미수",
            "아몬드, 호두 등 구운 견과류",
            "숙성 치즈 (콩테, 블루치즈)",
            "푸아그라 및 무거운 소스의 스테이크",
            "사과 타르트 및 크렘 브륄레"
        ],
        dbCategories: ['brandy', 'cognac', 'armagnac', 'calvados', 'pisco']
    }
}
