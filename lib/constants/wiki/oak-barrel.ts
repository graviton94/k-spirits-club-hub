import { SpiritCategory } from './types'

export const oakBarrel: SpiritCategory = {
    slug: 'oak-barrel',
    emoji: '🪵',
    nameKo: '오크통 (캐스크)',
    nameEn: 'The Cask Guide',
    taglineKo: '나무의 수종과 시간이 빚어내는 스피리츠의 영혼',
    taglineEn: 'The soul of spirits, shaped by wood species and time',
    color: 'amber',
    sections: {
        definition: "오크통(캐스크, oak cask/barrel)은 참나무(Quercus 속)로 만든 숙성 용기로, 단순한 저장 용기가 아니라 술의 성분·향·색·질감을 새로 ‘설계’하는 반응기다. 숙성 중 술은 나무에서 용출되는 추출물(바닐린, 오크 락톤, 스파이스 계열 페놀, 탄닌 등)을 흡수하고, 동시에 나무의 미세 공극을 통한 산소 유입(미세 산화)과 증발(천사의 몫)을 겪으면서 거칠음이 둥글어지고 복합 향이 생성된다. 즉 오크통은 증류액의 성격을 완성시키는 ‘제2의 원재료’이자, 스타일을 규정하는 가장 강력한 도구다.",
        history: "오크통은 원래 운송과 보관을 위한 실용적 용기였으나(암포라 대비 강도·밀폐성·취급성 우수), 시간이 지나며 오크와 액체의 상호작용이 맛을 개선한다는 사실이 축적되면서 숙성 기술의 핵심으로 자리 잡았다. 18~19세기 이후 위스키·브랜디·럼 산업이 확장되면서 ‘새 오크/재사용 오크’, ‘용량’, ‘토스팅·차링’, ‘이전 내용물(버번·셰리·와인 등)’이 체계적으로 관리되기 시작했고, 오늘날에는 지속 가능한 산림 관리(FSC 등)와 원산지·수종·가공 이력의 추적, 재활용(리필·리컨디셔닝)까지 포함한 ‘캐스크 라이프사이클’ 관점으로 발전했다.",
        classifications: [
            {
                name: "아메리칸 화이트 오크 (Quercus alba)",
                criteria: "미국산 화이트 오크의 심재 중심 / 낮은 탄닌·높은 오크 락톤 / 버번 배럴의 표준",
                description: "조직이 치밀해 숙성 안정성이 뛰어나다. 코코넛, 우디 스위트, 바닐린이 풍부해 밝은 단맛을 만들고 황금색으로 빠르게 올라온다. 피트/스모크처럼 강한 원주 향을 부드럽게 감싸는 성격이다.",
                flavorTags: [
                    { label: "바닐라", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "코코넛(락톤)", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
                    { label: "토피/카라멜", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "꿀", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" }
                ]
            },
            {
                name: "유러피안 오크 (Quercus robur)",
                criteria: "유럽산 참나무 / 높은 탄닌 / 셰리 시즌드 캐스크에서 흔함",
                description: "탄닌 함량이 높아 견고한 바디와 드라이한 떫은맛을 준다. 산화 숙성과 만나 짙은 마호가니 색을 만들며 건과일, 견과, 가죽처럼 어두운 스펙트럼의 풍미를 강화한다.",
                flavorTags: [
                    { label: "건과일(레이즌)", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
                    { label: "호두/견과류", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "가죽/우디", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
                    { label: "다크 초콜릿", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" }
                ]
            },
            {
                name: "프렌치 세실 오크 (Quercus petraea)",
                criteria: "프랑스산 / 타이트 그레인 / 중간~높은 탄닌 및 향신료 페놀",
                description: "결이 촘촘해 추출이 천천히 진행되며 베이킹 스파이스, 구운 견과, 코코아 같은 세련된 건조함을 만든다. 질감(실키함)과 향의 층위를 만드는 데 유리하다.",
                flavorTags: [
                    { label: "베이킹 스파이스", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "구운 아몬드", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "시더/우디", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
                    { label: "코코아", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" }
                ]
            },
            {
                name: "미즈나라 캐스크 (Japanese Oak)",
                criteria: "일본산 물참나무 / 높은 기공률 / 장기 숙성용",
                description: "목재가 무르고 가공이 까다롭지만 긴 숙성에서 백단향, 인센스, 약재, 정향 같은 이국적 향을 낸다. 주질이 섬세한 원주일수록 미즈나라의 개성이 깨끗하게 드러난다.",
                flavorTags: [
                    { label: "백단향(샌달우드)", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
                    { label: "가라향/인센스", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
                    { label: "자스민/플로럴", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
                    { label: "은은한 꿀", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" }
                ]
            },
            {
                name: "버진 오크 (Virgin / New Oak)",
                criteria: "재사용하지 않은 새 오크통 / 직선적인 추출",
                description: "나무 성분이 가장 강하게 추출된다. 짧은 기간에도 색과 향이 빠르게 올라오지만 밸런스가 무너지면 우디함이나 쓴맛이 과해질 수 있어 정교한 설계가 필요하다.",
                flavorTags: [
                    { label: "강한 바닐라", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "로스티드 오크", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
                    { label: "카라멜라이즈", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
                    { label: "드라이 스파이스", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" }
                ]
            },
            {
                name: "Ex-Bourbon (First Fill)",
                criteria: "버번 숙성에 1회 사용된 배럴 / 균형형 추출",
                description: "바닐라, 토피, 코코넛 같은 달콤한 오크 노트를 남기되 과도한 우디함은 줄어든 상태다. 원주의 과실이나 꽃 향 같은 증류 캐릭터를 살리면서 질감과 단맛을 더한다.",
                flavorTags: [
                    { label: "바닐라 크림", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "시트러스 필", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
                    { label: "토피", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "라이트 오크", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" }
                ]
            },
            {
                name: "올로로소 셰리 (Ex-Oloroso)",
                criteria: "드라이 셰리아 올로로소를 담았던 대형 캐스크",
                description: "산화 숙성 셰리의 너티함과 건과일 특성이 배어 있다. 위스키와 럼에 호두, 헤이즐넛, 오렌지 껍질, 말린 과일 풍미와 리치한 바디를 부여한다.",
                flavorTags: [
                    { label: "호두/헤이즐넛", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "오렌지 필", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
                    { label: "건포도", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
                    { label: "리치 바디", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" }
                ]
            },
            {
                name: "PX 셰리 캐스크 (Ex-PX)",
                criteria: "당도 높은 페드로 히메네스 셰리를 담았던 캐스크",
                description: "점도 높은 단맛과 짙은 색이 강하게 이입된다. 대추야자, 무화과 잼, 몰라세스, 초콜릿 시럽 같은 농밀한 디저트 풍미를 빠르게 더한다.",
                flavorTags: [
                    { label: "대추야자", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "무화과 잼", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
                    { label: "몰라세스", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
                    { label: "초콜릿 시럽", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" }
                ]
            },
            {
                name: "레드 와인/포트 캐스크",
                criteria: "레드 와인 또는 포트 와인 숙성/피니시용",
                description: "와인 유래의 베리, 자두 과실미와 탄닌이 더해진다. 과일의 색감과 드라이한 구조가 강화되며 원주 스타일과의 궁합이 매우 중요한 캐스크다.",
                flavorTags: [
                    { label: "붉은 베리", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
                    { label: "자두/체리", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
                    { label: "와인 탄닌", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
                    { label: "다크 코코아", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" }
                ]
            },
            {
                name: "호그스헤드 (Hogshead)",
                criteria: "배럴을 재조립해 용량을 키운 범용 숙성용 (~250L)",
                description: "배럴보다 추출은 완만하고 산화 숙성이 안정적으로 진행된다. 오크 과다를 줄이면서도 충분한 바닐라와 토스트 노트를 주어 장기 숙성에 널리 쓰인다.",
                flavorTags: [
                    { label: "균형 잡힌 바닐라", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "은은한 토스트", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
                    { label: "과실감 유지", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
                    { label: "부드러운 질감", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" }
                ]
            },
            {
                name: "쿼터 캐스크/옥타브",
                criteria: "소형 캐스크 / 높은 표면적 비율로 빠른 숙성",
                description: "짧은 기간에 색과 오크 성분이 빠르게 올라와 성숙감을 만들지만 우디함에 취약하다. 피니시나 강한 캐릭터를 의도적으로 강화할 때 효과적이다.",
                flavorTags: [
                    { label: "빠른 컬러 업", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "스파이시 오크", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "농밀한 바디", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
                    { label: "우디 강도↑", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" }
                ]
            },
            {
                name: "리필 캐스크 (Refill)",
                criteria: "여러 번 사용되어 오크 영향이 줄어든 상태",
                description: "직접적인 오크 향은 약하지만 원주의 과일, 꽃, 곡물 캐릭터가 또렷하게 유지된다. 장기 숙성에서 부드러움과 복합성을 쌓는 훌륭한 캔버스 역할을 한다.",
                flavorTags: [
                    { label: "클린한 과실", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
                    { label: "플로럴", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
                    { label: "섬세한 오크", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
                    { label: "미네랄/드라이", color: "bg-sky-500/20 text-sky-300 border-sky-500/30" }
                ]
            },
            {
                name: "STR 캐스크 (Reconditioned)",
                criteria: "내부를 깎고(Shaved) 재가열한 재생 캐스크",
                description: "리필의 성격을 되살리면서 새 오크의 장점(바닐라/카라멜)을 절충했다. 붉은 과실과 로스티드 노트가 빠르게 올라와 피니시나 NAS 스타일 설계에 활용된다.",
                flavorTags: [
                    { label: "레드 프루트", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
                    { label: "토스트 카라멜", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "로스티드", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
                    { label: "퀵 피니시", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" }
                ]
            },
            {
                name: "차링 레벨 (Char #1–#4)",
                criteria: "내부 탄화 강도 / #4 alligator 등이 최고 강도",
                description: "차링 층은 불순물을 흡착하고 바닐라/스파이스 전구체를 활성화한다. 강도가 높을수록 스모키, 로스티드, 브라운 슈거 톤이 진하게 강화된다.",
                flavorTags: [
                    { label: "차콜/스모키", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
                    { label: "로스티드 커피", color: "bg-stone-500/20 text-stone-300 border-stone-500/30" },
                    { label: "메이플 슈거", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
                    { label: "스파이스", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" }
                ]
            }
        ],
        sensoryMetrics: [
            {
                metric: "탄닌 구조감",
                label: "Tannin",
                value: "L (American) → H (European/French)",
                description: "나무 탄닌은 입안의 골격과 건조감을 만든다. 유러피안 오크로 갈수록 구조감이 견고해지며 떫은맛의 밸런스가 강조된다."
            },
            {
                metric: "오크 락톤/바닐린",
                label: "Lactone & Vanillin",
                value: "High (American / Virgin)",
                description: "코코넛과 바닐라 향의 핵심 성분이다. 아메리칸 오크나 새 오크통에서 이 계열의 달콤한 향이 가장 풍부하게 표현된다."
            },
            {
                metric: "캐스크 용량",
                label: "Surface Area / Volume",
                value: "Octave > Barrel > Butt",
                description: "용량이 작을수록 술과 나무의 접촉 면적이 넓어져 추출이 빨라진다. 큰 통은 대신 산화 숙성이 안정적으로 진행되어 복합성을 쌓기 좋다."
            }
        ],
        coreIngredients: [
            {
                type: "수종",
                name: "참나무 (Quercus 속)",
                description: "화이트 오크, 로버, 세실, 미즈나라 등 각 수종의 밀도와 화학 성분이 술의 기본적인 아로마 방향을 결정한다."
            },
            {
                type: "가공",
                name: "토스팅 & 차링",
                description: "불로 열분해를 유도하여 카라멜, 바닐라, 스파이스 성분을 활성화하고 탄화층을 통해 거친 향을 정제한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "건조",
                name: "내추럴 시즈닝 (Seasoning)",
                description: "스테이브를 야외에서 수년간 건조해 거친 탄닌을 씻어내고 미생물 작용으로 향 성분을 안정화하는 핵심 단계다."
            },
            {
                step: "조립",
                name: "쿠퍼리지 (Coopering)",
                description: "못 없이 스테이브를 맞물려 밀폐 용기를 조립한다. 조립 정밀도에 따라 산소 유입과 증발 밸런스가 결정된다."
            },
            {
                step: "숙성",
                name: "마투레이션 및 산화",
                description: "술이 목재를 드나들며 추출, 산화, 증발, 에스터화가 진행된다. 기후와 습도는 이 속도와 농축도를 바꾸는 핵심 변수다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "튤립형 노징 글라스",
            methods: [
                {
                    name: "니트 (Neat)",
                    description: "캐스크 유래의 바닐라, 견과, 스파이스와 오일리한 질감을 가장 정석적으로 경험할 수 있다."
                },
                {
                    name: "브리딩 (Breathing)",
                    description: "잔에 따른 후 5~10분 정도 두면 알코올 자극이 가라앉고 늦게 올라오는 복합적인 레이어들이 또렷해진다."
                },
                {
                    name: "물 한 방울 (A Drop of Water)",
                    description: "표면 장력을 낮춰 캐스크 깊숙이 숨어있던 꽃향기와 섬세한 에스테르를 폭발적으로 깨워준다."
                }
            ]
        },
        foodPairing: [
            "다크 초콜릿 및 테라미수",
            "훈제 향이 강한 스테이크/바비큐",
            "숙성 하드 치즈 (체다, 구다)",
            "볶은 견과류 및 피칸 파이",
            "말린 무화과와 대추야자"
        ],
        dbCategories: ['whisky', 'rum', 'brandy', 'wine']
    }
}
