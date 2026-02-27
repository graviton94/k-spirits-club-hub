import { SpiritCategory } from './types'

export const whisky: SpiritCategory = {
    slug: 'whisky',
    emoji: '🥃',
    nameKo: '위스키',
    nameEn: 'Whisky',
    taglineKo: '곡물을 증류·숙성한 세계에서 가장 다양한 스피리츠',
    taglineEn: 'The world\'s most diverse distilled spirit, aged in oak barrels',
    color: 'amber',
    sections: {
        definition: "위스키는 맥아(Malted barley)를 비롯한 곡물 발효주를 증류한 뒤, 오크통에서 일정 기간 이상 숙성시킨 증류주다. 블렌딩 방식과 지역, 숙성 캐스크의 종류에 따라 수만 가지의 다채로운 풍미를 선사한다.",
        history: "스코틀랜드와 아일랜드에서 '생명의 물(Uisge Beatha)'이라 불리며 시작되었다. 19세기 연속식 증류기의 발명으로 부드러운 블렌디드 위스키가 대중화되었으며, 현재는 싱글 몰트의 개성과 캐스크 숙성의 미학이 전 세계 주류 시장의 트렌드를 이끌고 있다.",
        classifications: [
            {
                name: "싱글 몰트 위스키 (Single Malt)",
                criteria: "단일 증류소에서 100% 맥아만을 사용해 증류",
                description: "증류소 고유의 테루아와 철학이 담긴 개성적인 캐릭터를 자랑한다. 물의 품질, 증류기의 형태, 숙성 캐스크의 선택에 따라 풍미가 극명하게 갈린다."
            },
            {
                name: "블렌디드 위스키 (Blended)",
                criteria: "몰트 위스키와 그레인 위스키를 혼합하여 블렌딩",
                description: "여러 증류소의 원액을 조화롭게 섞어 부드럽고 균형 잡힌 맛을 낸다. 수십 년간 일관된 풍미를 유지하는 마스터 블렌더의 정교한 설계가 돋보인다."
            },
            {
                name: "블렌디드 몰트 (Blended Malt / Vatted)",
                criteria: "여러 증류소의 싱글 몰트 원액만을 혼합",
                description: "그레인 위스키 없이 몰트 원액끼리의 조합으로, 몰트 특유의 질감과 복합적인 풍미 밀도를 극대화한 스타일이다."
            },
            {
                name: "버번 위스키 (Bourbon)",
                criteria: "미국 생산, 옥수수 51% 이상 사용 및 불에 태운 새 오크통 숙성",
                description: "강렬한 바닐라, 캐러멜, 옥수수 특유의 풍부한 단맛과 오크의 스파이시함이 특징인 미국의 상징적인 위스키다."
            },
            {
                name: "캐스크 피니시 (Cask Finish)",
                criteria: "기본 숙성 후 다른 술을 담았던 통에서 추가 숙성(Finishing)",
                description: "셰리, 포트, 와인, 럼 캐스크 등에서 수개월~수년간 추가 숙성을 거쳐 건과일이나 향신료 같은 독특한 풍미 레이어를 덧입힌다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "피트/스모크 강도",
                label: "Peatiness",
                value: "None / Low / Heavy",
                description: "맥아 건조 시 이탄을 사용한 정도를 나타낸다. 해풍의 짭조름함부터 강력한 훈제 향까지 위스키의 개성을 결정하는 중요한 지표다."
            },
            {
                metric: "바디/질감",
                label: "Mouthfeel",
                value: "Light to Oily/Waxy",
                description: "냉각 여과(Chill Filtering) 여부와 몰트 비중이 질감을 결정한다. 고품질 위스키일수록 입안을 코팅하는 오일리한 무게감이 뛰어나다."
            },
            {
                metric: "숙성 복합미",
                label: "Maturation Complexity",
                value: "Primary to Tertiary",
                description: "시간이 흐름에 따라 원재료의 과실향에서 오크 스파이스를 거쳐, 가죽이나 담배 같은 깊은 3차 숙성향으로 진화하는 정도다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "보리 맥아 (Malted Barley) 및 곡물",
                description: "위스키의 뼈대를 형성한다. 맥아는 복합적인 향미를, 옥수수나 밀은 부드러운 단맛과 베이스 질감을 제공한다."
            },
            {
                type: "숙성용기",
                name: "오크 캐스크 (Oak Cask)",
                description: "위스키 풍미의 70% 이상을 결정짓는다. 이전 내용물(버번/셰리 등)의 흔적이 위스키에 고유의 색과 영혼을 불어넣는다."
            },
            {
                type: "물",
                name: "수원지의 연수/경수",
                description: "당화 과정과 병입 도수 조절에 필수적이다. 물의 미네랄 함량은 위스키의 깨끗하고 정교한 피니시에 기여한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "당화/발효",
                name: "매싱 및 위시 발효",
                description: "맥아 전분을 당으로 바꾼 뒤 효모를 넣어 발효한다. 이 과정에서 청사과나 꽃향 같은 과일 에스터가 생성된다."
            },
            {
                step: "증류",
                name: "포트스틸 또는 컬럼 증류",
                description: "구리 증류기에서 알코올을 농축하여 위스키의 정수를 추출한다. 증류기의 크기와 형태가 향의 농축도를 좌우한다."
            },
            {
                step: "숙성/완성",
                name: "캐스크 에이징 및 배팅",
                description: "오크통에서 최소 3년 이상 숙성하여 거친 알코올을 깎아내고, 블렌딩을 통해 하우스 특유의 밸런스를 완성한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "글렌캐런 글라스 또는 튤립형 위스키 코피타",
            optimalTemperatures: [
                {
                    temp: "18~22℃ (상온 니트)",
                    description: "위스키의 복합적인 아로마와 오크의 풍미가 가장 풍성하게 열려 테이스팅에 최적인 온도다."
                },
                {
                    temp: "4~8℃ (하이볼)",
                    description: "탄산수와 믹싱할 때 시원한 타격감과 위스키의 향이 청량하게 어우러지는 온도다."
                }
            ],
            methods: [
                {
                    name: "니트 (Neat/Nosing)",
                    description: "잔에 따라 향을 먼저 맡고(Nosing), 한 모금 머금어 입안 전체로 풍미를 느끼는 가장 정석적인 방법이다."
                },
                {
                    name: "가수 (Add a few drops of water)",
                    description: "상온의 물을 한두 방울 떨어뜨리면 표면 장력이 깨지며 갇혀 있던 꽃과 과실 향이 폭발적으로 피어오른다."
                },
                {
                    name: "하이볼 (Highball)",
                    description: "얼음과 탄산수를 1:3 비율로 섞어 레몬 또는 라임 가니시와 함께 위스키의 향을 캐주얼하고 시원하게 즐긴다."
                },
                {
                    name: "온더락 (On the Rocks)",
                    description: "큰 얼음 위에 부어 마시면 온도가 낮아지며 알코올의 공격성이 줄어들고 질감이 묵직해지는 변화를 즐길 수 있다."
                }
            ]
        },
        flavorTags: [
            { label: "바닐라/카라멜", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "꿀/피너츠", color: "bg-yellow-600/20 text-zinc-950 dark:text-yellow-300" },
            { label: "말린 과일/셰리", color: "bg-rose-600/20 text-zinc-950 dark:text-rose-300" },
            { label: "시트러스/사과", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-300" },
            { label: "스모키/피트", color: "bg-stone-700/20 text-zinc-950 dark:text-stone-300" },
            { label: "오크/스파이스", color: "bg-amber-700/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "부드러운 스테이크 및 바비큐 요리",
            "다크 초콜릿 및 테라미수",
            "훈제 연어 및 치즈 플레이트",
            "말린 과일 및 피칸 파이",
            "돈카츠 등 기름진 튀김 요리 (하이볼)"
        ],
        dbCategories: ['whisky']
    }
}
