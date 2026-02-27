import { SpiritCategory } from './types'

export const champagne: SpiritCategory = {
    slug: 'champagne',
    emoji: '🥂',
    nameKo: '샴페인 (Champagne)',
    nameEn: 'Champagne',
    taglineKo: '축복과 환희의 순간을 수놓는 기포의 예술',
    taglineEn: 'The art of bubbles decorating moments of blessing and joy',
    color: 'yellow',
    sections: {
        definition: "샴페인(Champagne)은 프랑스 샹파뉴(Champagne) 지역의 AOC 규정에 따라 생산되며, 병내 2차 발효(전통 방식, méthode traditionnelle)로 자연 탄산을 얻는 고품질 스파클링 와인이다.",
        history: "샹파뉴 지방은 서늘한 기후로 인해 산도가 높은 베이스 와인이 만들어졌고, 17~18세기 병입·코르크·유리 기술의 발전과 함께 병내 발효 스파클링이 점차 정착했다. 19세기에는 침전물을 한 번에 제거하기 위한 리들링(remuage)과 디스고르주망(dégorgement) 공정이 체계화되며 현대 샴페인 생산 방식의 기반이 완성됐다. 20세기에는 원산지·생산 방식·숙성 기간 등을 엄격히 규정하는 AOC 체계가 확립되면서 샴페인이 ‘지역명+제조법’의 상징으로 자리 잡았다.",
        classifications: [
            {
                name: "Non-Vintage (NV) / Brut Sans Année (BSA)",
                criteria: "여러 빈티지의 베이스 와인과 리저브 와인을 블렌딩(하우스 스타일 유지 목적), 최소 숙성: 15개월",
                description: "하우스의 아이덴티티를 가장 잘 보여주는 유형으로, 산도·과실·오톨리시스(브리오슈/토스트) 균형이 특징이다. 리저브 와인 비율과 숙성 방식에 따라 고유의 스타일이 결정된다."
            },
            {
                name: "Vintage (Millésimé)",
                criteria: "단일 수확 연도 포도만 사용, 하우스가 선포한 해에만 출시, 최소 숙성: 36개월",
                description: "해당 해의 기후 특성이 뚜렷하며 구조감이 크다. 오랜 효모 숙성에서 오는 견과·빵·크림 노트와 시간의 흐름에 따른 3차 향(꿀·버섯·스파이스)의 발전이 매력적이다."
            },
            {
                name: "Blanc de Blancs",
                criteria: "화이트 품종(대부분 샤르도네 100%)만 사용",
                description: "샤르도네 특유의 산도, 시트러스, 분필 같은 미네랄 인상이 핵심이다. 젊을 때는 날렵하고 직선적이며, 숙성 시 토스트·헤이즐넛 같은 풍미가 깊어진다."
            },
            {
                name: "Blanc de Noirs",
                criteria: "흑포도 품종(피노 누아, 피노 뫼니에)만 사용",
                description: "과실 밀도와 바디감이 풍부하고 붉은 과실(딸기/체리)·구운 견과 뉘앙스가 두드러진다. 음식 페어링 범위가 넓어 육류 요리와도 잘 어울린다."
            },
            {
                name: "Rosé Champagne",
                criteria: "블렌딩(레드 와인 첨가) 또는 사니에(saignée) 방식으로 양조",
                description: "붉은 과실 향이 중심이며 구조감이 좋다. 사니에 방식은 풍미가 더 진하고 와인 같은 질감이 나타나는 경향이 있다."
            },
            {
                name: "Prestige Cuvée",
                criteria: "하우스 최고급 베이스 와인 엄선, 초장기 효모 숙성",
                description: "정교한 기포(펄라주), 깊은 오톨리시스와 미네랄 여운이 특징이다. ‘파워’보다는 ‘정밀도와 길이’로 평가받는 최고의 샴페인이다."
            },
            {
                name: "Brut Nature / Dosage Zéro",
                criteria: "도사주(추가 당분) 0~3 g/L",
                description: "가장 드라이하며 산도와 미네랄이 직설적으로 드러난다. 베이스 와인의 순수한 성숙도를 즐기기에 최적이다."
            },
            {
                name: "Extra Brut",
                criteria: "도사주 0~6 g/L",
                description: "매우 드라이하며 해산물, 특히 굴이나 사시미와 완벽한 조화를 이룬다."
            },
            {
                name: "Brut",
                criteria: "도사주 0~12 g/L",
                description: "가장 대중적인 스타일로 산도·과실·효모 풍미의 균형이 뛰어나 아페리티프부터 메인 요리까지 범용성이 높다."
            },
            {
                name: "Demi-Sec",
                criteria: "도사주 32~50 g/L",
                description: "명확한 단맛이 느껴져 디저트 페어링에 최적화된 스타일로 부드럽고 둥근 인상을 준다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "당도 (Dosage)",
                label: "도사주",
                value: "0~12 g/L (Brut 기준)",
                description: "최종 당도 수준으로 낮은 도사주일수록 드라이하고 미네랄리티가 선명해진다."
            },
            {
                metric: "탄산감 (Pressure)",
                label: "병내 압력",
                value: "약 5~6 bar",
                description: "높은 압력에 의한 기포의 에너지감이 강하며, 잔 형태와 온도에 따라 미세함이 달라진다."
            },
            {
                metric: "산도 (pH)",
                label: "Acidity",
                value: "pH 3.0~3.2",
                description: "서늘한 기후에서 오는 높은 산도는 샴페인 특유의 긴장감과 상쾌함을 만든다."
            },
            {
                metric: "효모 숙성 (Sur lie)",
                label: "오톨리시스 강도",
                value: "12~120개월 이상",
                description: "숙성 기간이 길수록 브리오슈·토스트·비스킷 같은 복합적인 풍미와 크리미한 질감이 형성된다."
            }
        ],
        coreIngredients: [
            {
                type: "포도 품종",
                name: "샤르도네 / 피노 누아 / 피노 뫼니에",
                description: "샴페인을 구성하는 3대 품종으로 각각 산도와 구조, 바디와 개성, 접근성과 과실 향을 담당한다."
            },
            {
                type: "발효제",
                name: "리큐르 드 티라주 & 효모",
                description: "2차 발효를 유도하는 핵심 성분으로 자연 탄산과 효모 자가분해 풍미를 완성한다."
            },
            {
                type: "하우스 자산",
                name: "리저브 와인 (Reserve wines)",
                description: "여러 수확 연도의 와인을 비축해두어 NV의 일관된 스타일과 복합미를 유지하는 비결이다."
            }
        ],
        manufacturingProcess: [
            { step: "양조", name: "1차 발효 & 블렌딩(아상블라주)", description: "베이스 와인을 만들고 품종과 빈티지를 조합해 하우스 특유의 균형을 만든다." },
            { step: "2차 발효", name: "티라주 & 병내 발효", description: "설탕과 효모를 추가해 병 안에서 2차 발효를 진행, 탄산을 가두는 단계다." },
            { step: "숙성/정리", name: "효모 숙성 & 리들링(침전물 모으기)", description: "장기 숙성으로 풍미를 키우고 병목으로 효모 찌꺼기를 모은다." },
            { step: "마무리", name: "디스고르주망 & 도사주", description: "침전물을 제거하고 최종 당도를 맞춘 뒤 코르크로 마감한다." }
        ],
        servingGuidelines: {
            recommendedGlass: "튤립형 샴페인 글라스 또는 중형 화이트 와인 글라스",
            optimalTemperatures: [
                {
                    temp: "6~8℃",
                    description: "매우 드라이한 Brut Nature나 아페리티프 스타일의 NV에 적합하다. 기포와 산도가 또렷해진다."
                },
                {
                    temp: "8~10℃",
                    description: "일반적인 Brut NV의 균형을 즐기기에 가장 좋은 온도다. 과실과 효모 향이 조화롭게 올라온다."
                },
                {
                    temp: "10~12℃",
                    description: "빈티지나 프레스티지 큐베에 권장한다. 브리오슈·견과류 등 풍부한 복합미가 넓게 펼쳐진다."
                }
            ],
            methods: [
                {
                    name: "사일런트 오프닝 (The Whisperer)",
                    description: "코르크를 딸 때 '펑' 소리 대신 속삭이듯 '치익' 하는 소리만 나게 하여 기포 손실을 최소화하는 전통적인 방법이다."
                },
                {
                    name: "슬로우 푸어링 (Slow Pouring)",
                    description: "잔을 살짝 기울여 천천히 따르면 기포 표면 영역이 넓어지는 것을 방지하여 탄산을 오랫동안 즐길 수 있다."
                },
                {
                    name: "칠링 (Chilling)",
                    description: "얼음과 물을 1:1로 채운 아이스 버킷에 20~30분간 담가두면 냉장고보다 훨씬 빠르고 균일하게 음용 온도를 맞출 수 있다."
                },
                {
                    name: "알맞은 잔 선택 (Proper Glassware)",
                    description: "향을 즐기려면 튤립형 잔을, 복합미를 느끼려면 일반 화이트 와인 잔을 선택하자. 잔을 닦을 때 세제 잔여물이 없어야 기포가 솟아오르는 것을 방해하지 않는다."
                }
            ]
        },
        flavorTags: [
            { label: "레몬/자몽 시트러스", color: "bg-yellow-400/20 text-zinc-950 dark:text-yellow-300" },
            { label: "청사과/배", color: "bg-emerald-400/20 text-zinc-950 dark:text-emerald-300" },
            { label: "화이트 플라워", color: "bg-rose-400/20 text-zinc-950 dark:text-rose-300" },
            { label: "분필/초크 미네랄", color: "bg-stone-400/20 text-zinc-950 dark:text-stone-300" },
            { label: "브리오슈/토스트", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "비스킷/빵", color: "bg-amber-500/20 text-zinc-950 dark:text-amber-300" },
            { label: "크리미 질감", color: "bg-amber-700/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "생굴 및 각종 해산물",
            "초밥 및 사시미",
            "프라이드 치킨 및 튀김류",
            "크림 파스타 및 리조또",
            "브리/카망베르 등 소프트 치즈",
            "과일 타르트 및 디저트"
        ],
        dbCategories: ['champagne', 'sparkling-wine', 'wine']
    }
}
