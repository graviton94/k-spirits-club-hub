import { SpiritCategory } from './types'

export const mezcal: SpiritCategory = {
    slug: 'mezcal',
    emoji: '🌵',
    nameKo: '메즈칼',
    nameEn: 'Mezcal',
    taglineKo: '대지의 불과 아가베가 빚어낸 스모키한 야생의 정수',
    taglineEn: 'The smoky essence of the Earth and Agave',
    color: 'stone',
    sections: {
        definition: "메즈칼(Mezcal)은 멕시코산 아가베(용설란) 피냐(piña, 심)를 가열·당화한 뒤 발효하여 증류한 아가베 증류주로, 특히 전통적인 피트 오븐(지중 화덕) 로스팅에서 오는 스모키함과 강한 테루아(지역성)가 특징이다. 테킬라가 주로 블루 아가베 1품종·특정 지역 중심인 반면, 메즈칼은 훨씬 다양한 아가베 품종과 생산 지역·공법을 포괄한다.",
        history: "아가베를 이용한 음료 문화는 스페인 도래 이전부터 존재했으며(예: 풀케), 증류 기술이 식민지 시기 이후 유입되면서 오늘날의 메즈칼 계열 증류주가 형성되었다. 오악사카(Oaxaca)를 중심으로 지역별 팔렌케(palenque, 증류장) 전통이 이어졌고, 20세기 후반까지는 지역 소비가 주류였으나 1990년대 이후 원산지 명칭(DO) 정비와 함께 세계 시장에서 프리미엄 증류주로 급성장했다.",
        classifications: [
            {
                name: "Mezcal (표준 카테고리)",
                criteria: "멕시코 메즈칼 DO 규격 충족, 현대적 설비 사용 가능",
                description: "가장 넓은 범주의 규정 카테고리로, 생산 효율을 높이기 위한 현대적 장비가 허용된다. 대량 생산형은 스모크와 발효 복합미가 상대적으로 단정하게 정리되는 경향이 있다."
            },
            {
                name: "Mezcal Artesanal (아르테사날)",
                criteria: "전통 피트 오븐 로스팅, 개방형 발효, 동/점토 포트 스틸 증류",
                description: "메즈칼의 ‘핵심 미학’으로 여겨지는 범주다. 로스팅에서 오는 훈연과 구운 아가베 향, 야생효모 발효에서 오는 유산균 뉘앙스 등 생산자의 개성과 지역 환경이 향미를 좌우한다."
            },
            {
                name: "Mezcal Ancestral (안세스트랄)",
                criteria: "수공 분쇄, 자연 발효, 점토 증류기 등 가장 전통적인 방식",
                description: "장작불 연기, 흙내, 미네랄 같은 ‘원초적’ 아로마가 강하다. 질감이 두껍고 오일리하며, 특정 토양과 미생물 환경을 가장 날것으로 드러내는 스타일로 평가된다."
            },
            {
                name: "Blanco / Joven (블랑코/호벤)",
                criteria: "오크 숙성 없이 증류 후 바로 또는 유리 용기 휴지 후 병입",
                description: "아가베 품종 본연의 단맛, 식물성 향, 꽃향이 가장 선명하게 드러난다. 스모키함이 오크에 가려지지 않아 향의 레이어가 또렷하고 피니시가 드라이하다."
            },
            {
                name: "Madurado en Vidrio (유리 숙성)",
                criteria: "유리 용기에서 12개월 이상 장기 휴지하여 풍미 안정화",
                description: "오크 향을 추가하지 않고도 알코올 자극이 부드러워지고 향이 깔끔하게 통합된다. 아가베 본연의 꽃향과 과실향을 유지하면서도 질감이 정돈되는 것이 장점이다."
            },
            {
                name: "Mezcal de Pechuga (페추가)",
                criteria: "3차 증류 시 과일, 향신료 및 육류(가슴살 등)와 함께 증류",
                description: "단백질과 지방 성분이 증기 흐름에 영향을 주어 질감을 극도로 실키하게 만든다. 과일과 스파이스 아로마가 풍성하게 폭발하는 전통 의례용 스타일이다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수",
                label: "ABV (%)",
                value: "45% ~ 55% (아르테사날 기준)",
                description: "도수가 높을수록 향의 휘발과 바디감이 커진다. 높은 도수에서도 아가베 고유의 달콤함과 복합미를 잃지 않는 것이 고급 메즈칼의 특징이다."
            },
            {
                metric: "스모크 강도",
                label: "Smoke Level",
                value: "Heavy Smoke (2/5 ~ 5/5)",
                description: "피트 오븐 로스팅에서 오는 연기와 그을음 향이다. 사용하는 목재와 조리 시간에 따라 달콤한 훈연부터 타르 같은 강렬한 향까지 다양하게 나타난다."
            },
            {
                metric: "식물성/허브 톤",
                label: "Vegetal Character",
                value: "Green Pepper / Cactus",
                description: "품종에 따른 풋풀, 그린 페퍼, 선인장 같은 뉘앙스다. 야생 아가베를 사용할수록 이 식물성 테루아가 더 복합적으로 드러난다."
            },
            {
                metric: "미네랄리티",
                label: "Minerality",
                value: "Wet Stone / Salinity",
                description: "점토 증류기나 수질, 토양에서 기인하는 젖은 흙, 돌가루, 짭조름한 염감의 인상이다. 피니시를 드라이하고 깨끗하게 만든다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "야생 및 재배 아가베 (Espadín, Tobalá 등)",
                description: "품종과 재배 환경이 향미를 결정한다. 에스파딘은 균형 잡힌 단맛을, 토발라 같은 야생종은 꽃향과 미네랄 개성을 주로 부여한다."
            },
            {
                type: "발효제",
                name: "로컬 야생 효모 및 토착 미생물",
                description: "개방형 발효 중에 유입되는 미생물들이 열대과일, 요구르트, 치즈 같은 복합적인 발효 향과 질감을 생성한다."
            },
            {
                type: "공정 원료",
                name: "지중 화덕 로스팅용 목재",
                description: "화덕을 달구는 돌과 연료로 쓰이는 나무의 종류가 메즈칼 특유의 훈연 성격을 최종적으로 결정짓는다."
            }
        ],
        manufacturingProcess: [
            {
                step: "로스팅",
                name: "피트 오븐 로스팅 (Roasting)",
                description: "지중 화덕에서 아가베를 흙으로 덮어 장시간 구워낸다. 이 과정에서 전분이 당화되고 매혹적인 스모크 향이 배어든다."
            },
            {
                step: "분쇄/발효",
                name: "전통 방식의 분쇄 및 자연 발효",
                description: "돌바퀴(타호나)로 아가베를 으깨고 나무나 석재 통에서 자연 발효시키며 풍미의 복합성을 층층이 쌓아 올린다."
            },
            {
                step: "증류",
                name: "단식 동 또는 점토 증류",
                description: "동 증류기는 선명한 향을, 점토 증류기는 오일리한 질감과 미네랄리티를 강조한다. 3차 증류(페추가) 여부로 완성도를 높인다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "메즈칼 코피타(Copita) 또는 튤립형 테이스팅 잔",
            optimalTemperatures: [
                {
                    temp: "18~22℃ (상온)",
                    description: "구운 아가베, 허브, 미네랄, 스모크의 레이어가 가장 균형 있게 열리는 표준 온도다."
                },
                {
                    temp: "14~16℃ (약간 서늘하게)",
                    description: "고도수 배치의 알코올 자극을 살짝 낮춰 풍미를 더 부드럽게 통합하여 즐기기 좋은 온도다."
                }
            ],
            methods: [
                {
                    name: "니트 (Sipping Neat)",
                    description: "작은 잔에 따라 향을 먼저 맡고, 한 모금을 머금어 아가베의 정수를 천천히 음미하는 정석적인 방법이다."
                },
                {
                    name: "가니시 페어링 (With Sal de Gusano)",
                    description: "오렌지 슬라이스에 벌레 소금을 곁들여 한 모금 뒤에 배어 물면 메즈칼의 훈연 향과 시트러스가 극적으로 강조된다."
                },
                {
                    name: "메즈칼 칵테일 (Negroni/Margarita)",
                    description: "강렬한 스모키함이 진이나 데킬라 자리를 대신하여 칵테일에 놀라운 깊이와 엣지를 더해준다."
                }
            ]
        },
        flavorTags: [
            { label: "스모키/훈연", color: "bg-stone-700/20 text-zinc-950 dark:text-stone-300" },
            { label: "구운 아가베", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "흙내/미네랄", color: "bg-stone-500/20 text-zinc-950 dark:text-stone-300" },
            { label: "허브/그린 페퍼", color: "bg-emerald-500/20 text-zinc-950 dark:text-emerald-300" },
            { label: "시트러스/오렌지", color: "bg-yellow-400/20 text-zinc-950 dark:text-yellow-300" },
            { label: "발효 과실/요거트", color: "bg-rose-400/20 text-zinc-950 dark:text-rose-300" },
            { label: "후추/알싸함", color: "bg-rose-600/20 text-zinc-950 dark:text-rose-300" }
        ],
        foodPairing: [
            "진한 몰레(Mole) 소스 요리",
            "바비큐 및 그릴 육류",
            "훈제 해산물 및 세비체",
            "과카몰리와 나초",
            "다크 초콜릿 및 견과류"
        ],
        dbCategories: ['일반증류주']
    }
}
