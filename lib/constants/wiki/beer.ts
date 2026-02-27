import { SpiritCategory } from './types'

export const beer: SpiritCategory = {
    slug: 'beer',
    emoji: '🍺',
    nameKo: '맥주',
    nameEn: 'Beer',
    taglineKo: '보리와 홉으로 빚은 세계에서 가장 많이 마시는 술',
    taglineEn: 'Brewed from barley and hops — humanity\'s most beloved drink',
    color: 'yellow',
    sections: {
        definition: "맥주(Beer)란 보리 등 곡물을 발아·건조한 맥아를 당화해 얻은 맥즙(wort)을 효모로 발효시키고, 홉으로 쓴맛과 향·보존성을 부여한 발효주다. 양조 공정에 따라 청량한 라거부터 묵직한 에일까지 매우 넓은 스펙트럼을 가진다.",
        history: "인류 역사와 함께해온 가장 오래된 발효주 중 하나다. 중세 수도원의 양조 기술 발전과 근대 냉장 기술 및 효모 연구를 통해 현대적인 스타일이 정립되었으며, 최근에는 다양한 홉과 부재료를 사용하는 크래프트 맥주 문화가 세계적으로 확산되었다.",
        classifications: [
            {
                name: "라거 (Lager, 하면발효)",
                criteria: "하면발효 효모 사용, 8~13℃ 저온 발효 및 라거링(저온 숙성)",
                description: "효모 부산물이 적어 깔끔하고 청량한 맛이 특징이다. 필스너, 헬레스, 복(Bock) 등이 대표적이며 탄산감과 몰트의 단맛, 홉의 은은한 향이 균형을 이룬다."
            },
            {
                name: "에일 (Ale, 상면발효)",
                criteria: "상면발효 효모 사용, 15~24℃ 실온 발효",
                description: "과일(에스터) 및 향신료(페놀) 뉘앙스가 풍부하다. 페일 에일, IPA, 스타우트 등 개성이 뚜렷한 스타일이 많으며 향미의 폭이 매우 넓다."
            },
            {
                name: "홉 포워드 (IPA / Pale Ale)",
                criteria: "높은 홉 사용량 및 드라이 홉핑(Dry Hopping) 공정 강조",
                description: "시트러스, 열대과일, 솔 향 등 홉 고유의 아로마와 선명한 쓴맛이 특징이다. 향의 신선도가 품질을 결정하는 핵심 요소다."
            },
            {
                name: "다크 / 로스티드 (Stout / Porter)",
                criteria: "검게 볶은 맥아(Roasted Malt) 사용",
                description: "커피, 다크 초콜릿, 토스트, 견과류 향이 돋보인다. 부드러운 질감과 묵직한 바디감을 지니며 디저트와도 훌륭한 조화를 이룬다."
            },
            {
                name: "밀맥주 (Wheat Beer)",
                criteria: "밀맥아 비중 30~70% 이상의 고함량",
                description: "거품이 풍부하고 질감이 크리미하다. 벨기에식(오렌지/허브)과 독일식(바나나/정향)으로 나뉘며 쓴맛이 낮아 목넘김이 편안하다."
            },
            {
                name: "사워 / 야생발효 (Sour & Lambic)",
                criteria: "유산균 이나 야생 효모(브렛)를 이용한 발효",
                description: "요구르트 같은 산뜻한 산미부터 가죽, 건초 같은 펑키한 복합미까지 독특한 풍미를 선사한다. 와인만큼이나 정교한 블렌딩 기술이 요구된다."
            },
            {
                name: "배럴 에이징 (Barrel-Aged)",
                criteria: "버번, 위스키, 와인 등 오크통에서 장기 숙성",
                description: "오크 유래 바닐라와 코코넛 향, 이전 술의 잔향이 맥주에 입혀져 극강의 복합미와 높은 도수를 완성하는 프리미엄 스타일이다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "쓴맛 지수",
                label: "IBU",
                value: "5 ~ 100+ (Extreme Range)",
                description: "수치가 높을수록 홉의 쓴맛이 강해진다. 단, 잔당과 바디가 높으면 체감 쓴맛은 중화될 수 있다."
            },
            {
                metric: "색상 등급",
                label: "SRM / EBC",
                value: "2 (Pale) ~ 40+ (Pitch Black)",
                description: "맥아의 굽기 정도에 따라 투명한 금색부터 진한 갈색, 칠흑 같은 검은색까지 결정된다."
            },
            {
                metric: "바디/질감",
                label: "Mouthfeel",
                value: "Light to Creamy",
                description: "탄산의 강도와 맥아 단백질 함량에 따라 가벼운 청량감부터 묵직한 오일리함까지 다양한 촉감을 선사한다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "맥아 (Malted Barley / Wheat)",
                description: "맥주의 색과 단맛, 바디의 뼈대를 만든다. 볶은 정도에 따라 다채로운 풍미 곡선을 형성한다."
            },
            {
                type: "향미원료",
                name: "홉 (Hops)",
                description: "쓴맛과 향, 보존성을 담당한다. 감귤, 솔, 꽃 등 맥주의 아로마 향수와 같은 역할을 한다."
            },
            {
                type: "발효제",
                name: "양조용 효모 (Yeast)",
                description: "당을 알코올과 탄산으로 바꾸며 과일이나 향신료 같은 섬세한 캐릭터를 입히는 주역이다."
            }
        ],
        manufacturingProcess: [
            {
                step: "추출/끓임",
                name: "당화 및 보일링",
                description: "곡물 전분을 당으로 바꾼 뒤, 홉을 넣고 끓여 쓴맛을 추출하고 살균하는 초기 공정이다."
            },
            {
                step: "발효",
                name: "상면/하면 발효",
                description: "효모의 특성에 맞춘 온도에서 발효하며 맥주 고유의 풍미와 탄산을 생성한다."
            },
            {
                step: "완성",
                name: "라거링 및 컨디셔닝",
                description: "저온 숙성을 통해 잡미를 제거하고 맛을 정돈하여 고유의 투명도와 밸런스를 확보한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "튤립 글라스, 파인트, 또는 바이젠 전용잔",
            optimalTemperatures: [
                {
                    temp: "3~6℃ (라거)",
                    description: "탄산의 청량감과 홉의 시트러스함이 가장 예리하게 살아나며 입안을 시원하게 씻어주는 온도다."
                },
                {
                    temp: "8~12℃ (에일/IPA)",
                    description: "홉의 화사한 열대과일 아로마와 에스터의 복합미가 풍성하게 피어오르기 시작하는 구간이다."
                },
                {
                    temp: "13~16℃ (스타우트/숙성주)",
                    description: "로스팅된 맥아의 커피향과 오크 숙성의 복합적인 3차 향을 즐기기에 가장 적합한 온도다."
                }
            ],
            methods: [
                {
                    name: "적절한 거품 형성 (Head Pouring)",
                    description: "잔을 약간 기울여 따르다가 마지막에 똑바로 세워 2~3cm 두께의 거품을 만들어 향을 가두고 산화를 방지한다."
                },
                {
                    name: "병 내 발효 맥주 마시기",
                    description: "효모가 포함된 맥주는 흔들지 않고 90%를 따른 뒤, 남은 부분을 가볍게 흔들어 효모와 함께 따라 풍미를 더하기도 한다."
                },
                {
                    name: "비어 칵테일 (Beer Mixing)",
                    description: "청량한 라거에 레몬에이드(라들러)나 토마토 주스를 섞어 가볍게 즐기는 방법도 훌륭하다."
                }
            ]
        },
        flavorTags: [
            { label: "홉 시트러스/열대과일", color: "bg-yellow-400/20 text-zinc-950 dark:text-yellow-300" },
            { label: "솔·레진/파인", color: "bg-emerald-600/20 text-zinc-950 dark:text-emerald-300" },
            { label: "몰트 비스킷/빵", color: "bg-amber-500/20 text-zinc-950 dark:text-amber-300" },
            { label: "로스티드 커피/카카오", color: "bg-stone-700/20 text-zinc-950 dark:text-stone-300" },
            { label: "바나나/클로브", color: "bg-rose-500/20 text-zinc-950 dark:text-rose-300" },
            { label: "상큼한 산미/요거트", color: "bg-sky-300/20 text-zinc-950 dark:text-sky-300" },
            { label: "오크/바닐라", color: "bg-amber-700/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "프라이드 치킨 및 각종 튀김",
            "피자 및 치즈 토핑 요리",
            "스테이크 및 바비큐",
            "소시지 및 샤퀴테리",
            "다크 초콜릿 및 티라미수"
        ],
        dbCategories: ['beer', 'ale', 'lager', 'ipa', 'stout']
    }
}
