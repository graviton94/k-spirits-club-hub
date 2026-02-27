import { SpiritCategory } from './types'

export const singleMalt: SpiritCategory = {
    slug: 'single-malt',
    emoji: '🥃',
    nameKo: '싱글 몰트 위스키',
    nameEn: 'Single Malt Whisky',
    taglineKo: '단일 증류소의 테루아와 장인정신이 빚어낸 액체 예술',
    taglineEn: 'The liquid art of a single distillery and its unique terroir',
    color: 'amber',
    sections: {
        definition: "싱글 몰트 위스키는 단 하나의 증류소(Single)에서 100% 보리 맥아(Malt)만을 사용해 증류하여 오크통에서 숙성시킨 위스키를 의미한다. 증류소마다 다른 물, 증류기의 형태, 숙성 환경이 그대로 맛에 투영되어 가장 개성적이고 복합적인 풍미를 보여준다.",
        history: "스코틀랜드 농가에서 시작된 몰트 위스키 증류는 19세기 밀주 시대를 거치며 정교한 기술로 발전했다. 20세기 중반까지 블렌디드 위스키의 핵심 원액으로만 쓰였으나, 현재는 개별 증류소 고유의 개성을 즐기는 프리미엄 주류 시장의 주인공으로 자리 잡았다.",
        classifications: [
            {
                name: "스카치 싱글 몰트 (Scotch)",
                criteria: "스코틀랜드 생산, 단식 증류기 사용, 최소 3년 이상 오크 숙성",
                description: "가장 엄격한 규정과 오랜 전통을 자랑한다. 하이랜드, 스페이사이드, 아일라 등 지역별로 뚜렷한 풍미 지도를 가지며 전 세계 위스키의 기준점이 된다."
            },
            {
                name: "캐스크 스트렝스 (Cask Strength / CS)",
                criteria: "숙성 후 물을 섞어 도수를 낮추지 않고 그대로 병입",
                description: "원액 그대로의 폭발적인 아로마와 묵직한 바디감을 느낄 수 있다. 마시는 사람의 취향에 따라 물 몇 방울을 더해 향을 열어가는 재미가 있다."
            },
            {
                name: "싱글 캐스크 (Single Cask)",
                criteria: "단 하나의 오크통에서 나온 원액만을 블렌딩 없이 병입",
                description: "다른 통과 섞이지 않아 해당 오크통이 가진 유일무이한 개성과 시간을 온전히 경험할 수 있는 극도의 희소성을 지닌 제품이다."
            },
            {
                name: "셰리 캐스크 숙성 (Sherry Cask)",
                criteria: "셰리 와인을 담았던 오크통(올로로소/PX 등)에서 숙성",
                description: "건포도, 다크 초콜릿, 견과류, 스파이시한 풍미가 특징이다. 농밀한 질감과 짙은 호박색 빛깔이 시각적인 즐거움까지 선사한다."
            },
            {
                name: "버번 캐스크 숙성 (Bourbon Cask)",
                criteria: "미국 버번 위스키를 담았던 오크통에서 숙성",
                description: "바닐라, 카라멜, 코코넛, 산뜻한 과일 향이 주를 이룬다. 상대적으로 정교하고 화사한 무드를 보여주며 원주 본연의 개성을 잘 드러낸다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "피트 강도 (Smoke)",
                label: "PPM Level",
                value: "None to 50+ (Heavy)",
                description: "맥아를 건조할 때 배어든 훈제향, 약재, 해풍의 뉘앙스다. 수치가 높을수록 강력한 스모키함과 요오드 향이 원물을 지배한다."
            },
            {
                metric: "질감/오일리함",
                label: "Mouthfeel",
                value: "Clean to Waxy",
                description: "증류기 형태와 냉각 여과 여부에 따라 결정된다. 고품질 몰트 위스키는 입안을 코팅하는 듯한 매끄럽고 묵직한 질감을 선사한다."
            },
            {
                metric: "알코올 수렴도",
                label: "Alcohol Integration",
                value: "Gentle to Intense (CS)",
                description: "숙성 연수가 높을수록 알코올의 공격성이 줄고 나무 성분과 하나로 통합되어 정교하고 우아한 목넘김을 완성한다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "100% 보리 맥아 (Malted Barley)",
                description: "위스키의 곡물 향과 단맛, 그리고 발효 루틴에서 생성되는 과실 에스터의 근본적인 원천이다."
            },
            {
                type: "향미 요소",
                name: "피트 (Peat) 및 수원지 물",
                description: "스코틀랜드의 대지와 물의 개성이 위스키에 투영되어 해풍의 짭짤함이나 대지의 훈연 향을 형성한다."
            },
            {
                type: "숙성 도구",
                name: "시즈닝 오크 캐스크",
                description: "셰리, 와인, 럼 등 이전에 담았던 술의 잔향이 몰트와 만나 수만 가지의 다층적인 향미 레이어를 창조한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "제국/당화",
                name: "몰팅 및 매싱",
                description: "보리에 싹을 틔워 전분을 당으로 바꾸고(몰팅), 따뜻한 물로 당액을 추출하여 풍미의 정수를 준비한다."
            },
            {
                step: "증류",
                name: "단식 증류 (Pot Still)",
                description: "구리 증류기에서 두 번 끓여 맑고 높은 도수의 원액을 얻는다. 증류기의 길이나 목의 각도가 향의 농축도를 결정한다."
            },
            {
                step: "숙성",
                name: "장기 캐스크 숙성",
                description: "원액이 오크통 속에서 숨을 쉬며 나무의 풍미를 흡수하고, 시간이 흐르며 복합적인 3차 향미를 완성해 나간다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "글렌캐런 글라스 또는 노징 튤립 잔",
            optimalTemperatures: [
                {
                    temp: "18~22℃ (상온)",
                    description: "알코올이 부드럽게 휘발되며 복합적인 아로마의 레이어가 가장 화려하게 펼쳐지는 온도다."
                }
            ],
            methods: [
                {
                    name: "니트 테이스팅 (Neat)",
                    description: "잔에 따라 향을 먼저 맡고(Nosing), 소량을 머금어 혀 전체로 질감과 풍미를 느끼는 정석적인 음용법이다."
                },
                {
                    name: "가수 (Adding Water)",
                    description: "상온의 생수를 한두 방울 떨어뜨리면 표면 장력이 깨지며 감춰진 섬세한 꽃과 과실 향이 폭발적으로 개방된다."
                },
                {
                    name: "브리딩 (Breathing)",
                    description: "잔에 따른 뒤 10~20분 정도 기다리면 거친 알코올 기운이 정돈되고 캐스크 유래의 깊은 숙성 향이 돋보이게 된다."
                }
            ]
        },
        flavorTags: [
            { label: "스모키/피트", color: "bg-stone-700/20 text-zinc-950 dark:text-stone-300" },
            { label: "건과일/셰리", color: "bg-rose-600/20 text-zinc-950 dark:text-rose-300" },
            { label: "바닐라/카라멜", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "꿀/꽃향기", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-300" },
            { label: "해풍/요오드", color: "bg-sky-500/20 text-zinc-950 dark:text-sky-300" },
            { label: "시나몬/스파이스", color: "bg-amber-500/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "훈제 연어 및 굴 요리 (피트 스타일)",
            "다크 초콜릿 및 말린 무화과",
            "스테이크 및 양갈비 구이",
            "블루 치즈 및 고다 치즈",
            "견과류 정과 및 타르트"
        ],
        dbCategories: ['whisky', 'single-malt']
    }
}
