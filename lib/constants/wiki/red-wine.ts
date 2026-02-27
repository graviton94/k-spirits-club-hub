import { SpiritCategory } from './types'

export const redWine: SpiritCategory = {
    slug: 'red-wine',
    emoji: '🍷',
    nameKo: '레드 와인',
    nameEn: 'Red Wine',
    taglineKo: '포도 껍질에서 추출한 깊은 풍미와 타닌의 조화',
    taglineEn: 'The harmony of deep flavors and tannins from grape skins',
    color: 'red',
    sections: {
        definition: "레드 와인은 적포도의 껍질(스킨)·씨·과육을 함께 발효·침용하여 안토시아닌(색)과 타닌(구조감)을 추출해 만든 와인이다. 품종, 산지, 오크 숙성 여부에 따라 라이트 바디부터 풀 바디까지 폭넓은 스타일을 가진다.",
        history: "고대 메소포타미아와 지중해권에서 시작되어 수도원과 귀족 영지를 중심으로 산지별 전통이 확립되었다. 19세기 근대 양조 학문의 정립과 20세기 신세계 와인의 부상을 거쳐 현재는 테루아의 개성과 과학적 양조가 조화를 이루는 시대에 있다.",
        classifications: [
            {
                name: "단일 품종 와인 (Varietal)",
                criteria: "특정 포도 품종이 75~85% 이상 포함된 와인",
                description: "카베르네 소비뇽, 피노 누아 등 특정 품종 고유의 아로마와 구조를 전면에 드러낸다. 품종별 개성을 공부하기에 적합하다."
            },
            {
                name: "블렌드 와인 (Blend / Assemblage)",
                criteria: "재배 환경과 최종 의도에 따라 다수 품종 혼합",
                description: "보르도 스타일처럼 타닌, 산도, 과실향의 완벽한 균형을 목표로 한다. 블렌딩을 통해 매해 빈티지의 영향을 극복하고 일관된 품질을 유지한다."
            },
            {
                name: "부르고뉴 등급 (Cru / Terroir)",
                criteria: "포도밭의 등급(Gran Cru, Premier Cru 등)에 따른 분류",
                description: "최상급 밭일수록 지질과 미시기후의 영향이 크며, 장기 숙성 시 숲바닥, 버섯, 미네랄 등 복합적인 3차 향의 레이어가 압도적이다."
            },
            {
                name: "보르도 등급 (Grand Cru Classé)",
                criteria: "1855년 제정된 역사적인 등급 분류 체제",
                description: "강한 구조감과 장기 숙성 잠재력이 특징이다. 시더(삼나무), 가죽, 흑연 등의 품격 있는 향미를 선사하는 프리미엄 와인의 기준이다."
            },
            {
                name: "구세계 숙성 등급 (Reserva 등)",
                criteria: "스페인, 이탈리아 등의 법적 숙성 기간 기준",
                description: "숙성 기간이 길수록 과실향은 둥글어지고 담배, 가죽, 말린 과일의 중후한 풍미가 중심이 되는 숙성미를 강조한다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "바디감 (Body)",
                label: "Weight",
                value: "Light to Full Body",
                description: "알코올과 추출 농도에 따라 입안에서 느껴지는 중량감이다. 고품질 레드 와인은 무게감과 산도의 균형이 뛰어나다."
            },
            {
                metric: "탄닌 구조 (Tannins)",
                label: "Structure",
                value: "Soft to Grippy",
                description: "수렴성(떫은맛)을 주는 요소로 와인의 수명을 결정한다. 숙성됨에 따라 거친 질감이 벨벳처럼 부드럽게 정돈된다."
            },
            {
                metric: "숙성 레이어",
                label: "Complexity",
                value: "Primary to Tertiary",
                description: "신선한 과일(1차)에서 오크(2차), 그리고 가죽·버섯·견과(3차)로 이어지는 향의 진화 과정을 전문적으로 평가한다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "지정 포도 품종 (Vitis vinifera)",
                description: "카베르네 소비뇽, 피노 누아, 메를로, 시라 등 품종 자체가 와인의 뼈대와 향의 지도를 형성한다."
            },
            {
                type: "발효 공정",
                name: "침용(Maceration) 및 말로락틱 발효",
                description: "껍질에서 성분을 우려내는 침용과 거친 사과산을 부드러운 젖산으로 바꾸는 과정이 레드 와인의 부드러운 질감을 만든다."
            },
            {
                type: "숙성 도구",
                name: "오크 캐스크 (French / American)",
                description: "미세 산소 접촉을 통해 탄닌을 안정화하고 바닐라, 스파이스, 토스트의 레이어를 추가하는 필수의 과정이다."
            }
        ],
        manufacturingProcess: [
            {
                step: "발효/추출",
                name: "알코올 발효 및 스킨 컨택",
                description: "포도 즙과 껍질을 함께 발효하며 색과 탄닌을 추출한다. 온도 조절을 통해 우아함과 강렬함 사이의 스타일을 설계한다."
            },
            {
                step: "압착/숙성",
                name: "말로락틱 발효 및 에이징",
                description: "거친 산미를 다듬고 오크통에서 수개월에서 수년간 숙성하며 복합적인 3차 향미와 구조감을 완성한다."
            },
            {
                step: "완성",
                name: "블렌딩 및 병 숙성",
                description: "최종 아상블라주를 거쳐 병입한 뒤, 병 내에서도 향미가 안정화되고 통합될 수 있는 시간을 갖는다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "보르도 또는 부르고뉴 타입 레드 와인 잔",
            optimalTemperatures: [
                {
                    temp: "14~16℃ (가벼운 레드)",
                    description: "피노 누아처럼 섬세한 품종의 화사한 꽃향과 붉은 과실향이 가장 돋보이는 온도다."
                },
                {
                    temp: "16~18℃ (범용 레드)",
                    description: "대부분의 미디엄 바디 와인에서 탄닌, 산도, 풍미가 가장 조화롭게 느껴지는 구간이다."
                },
                {
                    temp: "18~20℃ (풀바디 레드)",
                    description: "고타닌 품종의 구조감과 오크 숙성향이 풍부하게 열리며 알코올의 온기가 기분 좋게 느껴지는 온도다."
                }
            ],
            methods: [
                {
                    name: "브리딩 (Breathing)",
                    description: "서빙 30분~1시간 전 코르크를 열어 와인이 서서히 숨을 쉬게 하여 잠들어 있던 아로마를 깨우는 과정이다."
                },
                {
                    name: "디캔팅 (Decanting)",
                    description: "고숙성 와인의 침전물을 분리하거나, 어린 와인을 공기와 신속히 접촉시켜 탄닌을 부드럽게 풀어주는 전문적인 방법이다."
                },
                {
                    name: "스월링 (Swirling)",
                    description: "잔을 가볍게 돌려 와인이 공기와 닿는 면적을 넓혀주면, 숨겨진 미세한 향의 레이어들이 더욱 선명하게 피어오른다."
                }
            ]
        },
        flavorTags: [
            { label: "블랙베리/카시스", color: "bg-rose-600/20 text-zinc-950 dark:text-rose-300" },
            { label: "체리/라즈베리", color: "bg-rose-400/20 text-zinc-950 dark:text-rose-400" },
            { label: "바닐라/토스트", color: "bg-amber-700/20 text-zinc-950 dark:text-amber-300" },
            { label: "후추/스파이스", color: "bg-yellow-600/20 text-zinc-950 dark:text-yellow-300" },
            { label: "흙내/버섯/숲", color: "bg-stone-600/20 text-zinc-950 dark:text-stone-300" },
            { label: "가죽/담배", color: "bg-stone-700/20 text-zinc-950 dark:text-stone-300" },
            { label: "미네랄리티", color: "bg-stone-500/20 text-zinc-950 dark:text-stone-300" }
        ],
        foodPairing: [
            "스테이크 및 양갈비 구이",
            "바비큐와 그릴 요리",
            "토마토 소스 파스타와 라자냐",
            "숙성된 하드 치즈 플래터",
            "오리 가슴살 및 로스트 치킨",
            "갈비찜 및 불고기"
        ],
        dbCategories: ['wine', 'red-wine']
    }
}
