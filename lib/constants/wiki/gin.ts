import { SpiritCategory } from './types'

export const gin: SpiritCategory = {
    slug: 'gin',
    emoji: '🍸',
    nameKo: '진',
    nameEn: 'Gin',
    taglineKo: '주니퍼 베리의 숲을 담은 칵테일의 예술',
    taglineEn: 'The art of botanical balance, centered on juniper',
    color: 'emerald',
    sections: {
        definition: "진(gin)은 농업용 중성주정(Neutral Spirit)에 주니퍼 베리의 향을 중심으로 다양한 보태니컬(botanical)을 더해 향미를 만든 증류주다. 칵테일의 핵심 베이스로 쓰이며, ‘주니퍼 향이 지배적이어야 한다’는 명확한 규격적 정체성을 가진다.",
        history: "진의 뿌리는 16~17세기 네덜란드의 약용 증류주 예네버(Genever)에서 출발했다. 영국으로 전파된 뒤 18세기 대중적 소비 폭발과 19세기 연속식 증류기의 정교한 정제 기술을 거치며 드라이하고 선명한 현대적 스타일이 정립되었다.",
        classifications: [
            {
                name: "London Dry Gin (런던 드라이 진)",
                criteria: "증류 후에 물과 극미량 감미 외에 어떤 첨가물도 허용하지 않음",
                description: "가장 정석적인 드라이 진이다. 주니퍼의 솔향과 시트러스 제스트, 드라이한 피니시가 핵심이며 전 세계 칵테일 레시피의 기준점이 된다."
            },
            {
                name: "Distilled Gin (디스틸드 진)",
                criteria: "주니퍼 및 천연 보태니컬과 함께 ‘재증류’로 향을 부여",
                description: "향이 알코올 베이스에 매끈하게 통합되어 질감이 우아하다. 증류 후에도 추가적인 향료 첨가가 제한적으로 허용될 수 있는 범주다."
            },
            {
                name: "Contemporary / New Western",
                criteria: "주니퍼를 배경으로 특정 보태니컬(꽃/허브 등)을 강조한 스타일",
                description: "오이, 장미, 유자, 녹차 등 시그니처 보태니컬을 전면에 내세운다. 진 토닉 가니시에 따라 향미가 다층적으로 변화하는 매력이 있다."
            },
            {
                name: "Old Tom Gin (올드 톰)",
                criteria: "드라이 진보다 부드러운 단맛이 나는 전통 스타일",
                description: "런던 드라이와 예네버 사이의 연결고리로, 부드러운 바디와 은은한 단맛이 특징이다. 클래식 칵테일 톰 콜린스의 필수 재료다."
            },
            {
                name: "Navy Strength Gin (네이비 스트렝스)",
                criteria: "대체로 57% ABV 전후의 고도수 병입",
                description: "강력한 알코올 볼륨감 덕분에 탄산수나 시트러스 주스와 섞여도 향이 묻히지 않고 탄탄한 존재감을 보여준다."
            },
            {
                name: "Genever / Jenever (예네버/제네버)",
                criteria: "맥아와인(Malt Wine) 베이스의 전통 진",
                description: "진의 조상격으로, 위스키처럼 곡물의 구수함과 묵직한 바디감이 살아있다. 칵테일에서도 베이스의 중량감이 크게 느껴진다."
            },
            {
                name: "Barrel-Aged / Cask Gin",
                criteria: "오크 캐스크에서 일정 기간 숙성을 거친 진",
                description: "주니퍼향 위에 오크의 바닐라, 스파이스가 겹쳐져 진과 위스키의 접점 같은 인상을 준다. 니트로 즐기기에 매우 훌륭하다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "주니퍼 지배도",
                label: "Juniper Purity",
                value: "4~5 (Highly Dominant)",
                description: "수치가 높을수록 소나무, 송진 같은 주니퍼 코어가 선명하며 드라이한 청량감을 극대화한다."
            },
            {
                metric: "알코올 지지력",
                label: "ABV Structure",
                value: "37.5% ~ 57% (High)",
                description: "고도수일수록 보태니컬 오일 함량이 높아져 입안에서의 점성과 향의 여운이 길어진다."
            },
            {
                metric: "드라이함",
                label: "Dryness Level",
                value: "Bone Dry to Mellow",
                description: "감미가 낮을수록 피니시가 깔끔하며, 토닉의 당도나 레몬 가니시의 향을 더 선명하게 띄워준다."
            }
        ],
        coreIngredients: [
            {
                type: "필수원료",
                name: "주니퍼 베리 (Juniper Berries)",
                description: "진의 법적 정체성이다. 솔잎, 송진, 후추 같은 수지감과 드라이한 청량감을 부여하는 핵심 중의 핵심이다."
            },
            {
                type: "향미원료",
                name: "코리앤더 시드 & 시트러스 필",
                description: "상큼한 시트러스 탑노트와 따뜻한 스파이시함을 더해 주니퍼의 정적인 향에 생동감을 불어넣는다."
            },
            {
                type: "고정제",
                name: "안젤리카 및 오리스 루트",
                description: "개별 보태니컬의 향을 하나로 엮어주는 앵커 역할을 하며, 흙내음과 꽃향기를 더해 지속성을 높인다."
            }
        ],
        manufacturingProcess: [
            {
                step: "추출/인퓨전",
                name: "마세레이션 및 베이퍼 인퓨전",
                description: "보태니컬을 주정에 담그거나 증류 증기를 통과시켜 향을 추출한다. 방식에 따라 향의 밀도와 투명도가 결정된다."
            },
            {
                step: "증류",
                name: "포트 스틸 재증류",
                description: "보태니컬 오일이 함축된 원액을 다시 증류하여 불순물을 제거하고 맑고 정교한 정수만을 채취한다."
            },
            {
                step: "안정화",
                name: "메리아주 및 가수",
                description: "증류 직후 날카로운 향을 가라앉히기 위해 일정 기간 휴지하며, 물로 희석해 완벽한 밸런스를 맞춘다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "코파(발룬) 잔, 하이볼 잔 또는 튤립형 잔",
            optimalTemperatures: [
                {
                    temp: "4~8℃ (칠드)",
                    description: "탄산수와 섞어 진 토닉으로 즐길 때 리프레시감이 극대화되고 탄산이 가장 오래 유지되는 온도다."
                },
                {
                    temp: "10~14℃ (테이스팅)",
                    description: "니트나 마티니에서 주니퍼와 루트 계열 보태니컬의 복잡한 레이어를 가장 선명하게 느낄 수 있는 온도다."
                },
                {
                    temp: "15~20℃ (숙성 진)",
                    description: "캐스크 숙성 진의 오크 풍미와 위스키적 뉘앙스를 충분히 열어주며 즐기기에 좋은 온도다."
                }
            ],
            methods: [
                {
                    name: "진 토닉 (Gin & Tonic)",
                    description: "가장 대중적인 방식이다. 진의 보태니컬 구성에 맞춰 레몬, 라임, 오이, 허브 등 가니시를 선택해 즐긴다."
                },
                {
                    name: "진 마티니 (Martini)",
                    description: "베르무트와 결합하여 진의 드라이한 미학을 극한으로 끌어올리는 클래식 음용법이다."
                },
                {
                    name: "니트 (Neat/Nosing)",
                    description: "프리미엄 진이나 캐스크 진의 미세한 향 차이를 구별하며 천천히 음미하는 전문적인 방식이다."
                }
            ]
        },
        flavorTags: [
            { label: "주니퍼/솔잎", color: "bg-emerald-600/20 text-zinc-950 dark:text-emerald-300" },
            { label: "시트러스 제스트", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-300" },
            { label: "허브/그린", color: "bg-emerald-500/20 text-zinc-950 dark:text-emerald-300" },
            { label: "코리앤더/후추", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "플로럴", color: "bg-rose-500/20 text-zinc-950 dark:text-rose-300" },
            { label: "오이/청량감", color: "bg-sky-400/20 text-zinc-950 dark:text-sky-300" },
            { label: "어스티/흙내음", color: "bg-stone-600/20 text-zinc-950 dark:text-stone-300" }
        ],
        foodPairing: [
            "신선한 굴 및 생선회",
            "훈제 연어와 크림치즈",
            "허브를 곁들인 치킨 구이",
            "올리브 및 치즈 플래터",
            "레몬 또는 유자 파운드 케이크"
        ],
        dbCategories: ['gin', 'london-dry-gin', 'distilled-gin', 'old-tom-gin', 'navy-strength-gin', 'genever']
    }
}
