import { SpiritCategory } from './types'

export const baijiu: SpiritCategory = {
    slug: 'baijiu',
    emoji: '🏮',
    nameKo: '백주',
    nameEn: 'Baijiu',
    taglineKo: '수수를 원료로 한 중국의 전통 고도수 증류주',
    taglineEn: 'China\'s ancient sorghum spirit — world\'s most consumed liquor',
    color: 'red',
    sections: {
        definition: "백주(白酒, 바이주)는 수수(고량) 등 곡물을 누룩(곡, 曲)으로 고체 발효한 뒤 증류해 만드는 중국의 대표적인 고도수 증류주이다. 지역·누룩·발효 환경에 따라 ‘향형(香型, Aroma type)’이라는 독자적 분류 체계가 발달해 매우 다양한 향미 스펙트럼을 가진다.",
        history: "백주의 뿌리는 중국의 오래된 곡물 발효주 문화와 증류 기술의 발전에 있으며, 지역별 원료·기후·발효 용기 차이가 축적되며 서로 다른 스타일이 형성되었다. 현대에는 ‘향형’ 중심으로 생산·유통·품질평가가 체계화되며 대형 브랜드와 지역 명주가 공존하는 산업으로 성장했다.",
        classifications: [
            {
                name: "장향형 (醬香型, Sauce Aroma)",
                criteria: "고온 대곡 사용 + 고온 적치·다회차 고체발효 + 긴 저장·블렌딩",
                description: "간장, 된장, 볶은 곡물, 견과 같은 구수하고 발효된 뉘앙스가 특징이다. 향이 층층이 전개되며 여운이 매우 길다. 마오타이가 대표적이다."
            },
            {
                name: "농향형 (濃香型, Strong Aroma)",
                criteria: "진흙 발효지 기반 고체발효 + 강한 에스터 캐릭터",
                description: "파인애플, 열대과일 같은 강한 에스터 향과 달큰한 곡물향이 특징이다. '노교지(오래된 발효지)'일수록 향이 훨씬 풍부하고 둥글다. 우량예, 수정방이 대표적이다."
            },
            {
                name: "청향형 (淸香型, Light Aroma)",
                criteria: "낮은 발효 온도 + 깨끗한 발효 환경 (항아리/석조)",
                description: "사과, 배, 화이트 플라워 같은 산뜻하고 깨끗한 향이 장점이다. 바디가 가볍고 드라이하게 마무리되어 깔끔한 매력이 있다. 분주가 대표적이다."
            },
            {
                name: "미향형 (米香型, Rice Aroma)",
                criteria: "쌀 기반 주원료 + 소곡 중심 발효",
                description: "쌀의 담백함과 은은한 꽃, 꿀 향이 두드러진다. 누룩취가 적어 입문자에게 가장 추천되는 부드러운 화사함이 특징이다."
            },
            {
                name: "봉향형 (鳳香型, Phoenix Aroma)",
                criteria: "청향의 깔끔함과 농향의 풍부함을 절충",
                description: "선명한 향과 빈틈없는 바디감의 균형이 핵심이다. 과일 에스터와 곡물의 고소함이 조화롭다. 서봉주가 대표적이다."
            },
            {
                name: "겸향형 (兼香型, Mixed Aroma)",
                criteria: "둘 이상의 향형 요소를 공정 또는 블렌딩으로 결합",
                description: "앞향은 과일 에스터가, 중후반에는 장향형의 구수함이 이어지는 식의 입체적인 레이어링이 특징이다."
            },
            {
                name: "지마향형 (芝麻香型, Sesame Aroma)",
                criteria: "고온 공정 비중 확대 + 로스티드/너티(참깨) 계열 향조",
                description: "참깨, 토스트, 가벼운 카카오 같은 ‘볶은 향’이 시그니처다. 고기 요리와의 궁합이 탁월하다."
            },
            {
                name: "특향형 (特香型, Special Aroma)",
                criteria: "다곡 배합 + 지역 고유의 복합 발효 공정",
                description: "단일 향형으로 설명하기 어려운 독특한 향미를 지닌다. 브랜드마다 다른 개성을 보여준다."
            },
            {
                name: "노백간향형 (Laobaigan Aroma)",
                criteria: "높은 도수 지향 + 깨끗하고 힘 있는 질감",
                description: "라인은 깔끔하지만 질감에 힘이 실린다. '맑은데 묵직한' 인상을 주며 알코올의 존재감이 뚜렷하다."
            },
            {
                name: "대곡주 / 소곡주 분류",
                criteria: "사용하는 누룩의 크기와 원료에 따른 구분",
                description: "대곡(Daqu)은 복합적인 발효향과 깊은 여운을, 소곡(Xiaoqu)은 산뜻하고 투명한 아로마를 만드는 경향이 있다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "도수/열감",
                label: "ABV (%)",
                value: "38~65% (52~53%대 표준)",
                description: "도수가 높을수록 향의 밀도가 올라가지만 알코올 열감이 강해질 수 있다. 숙성이 잘된 백주는 높은 도수에서도 둥글게 느껴진다."
            },
            {
                metric: "에스터 향 강도",
                label: "Ester Intensity",
                value: "Low to Extremely High",
                description: "파인애플, 바나나 같은 과일/캔디 뉘앙스의 농도를 나타내며 특히 농향형에서 품질의 척도가 된다."
            },
            {
                metric: "발효 구수함",
                label: "Fermentation Umami",
                value: "Sauce / Nutty Notes",
                description: "간장, 된장, 볶은 견과 같은 구수하고 감칠맛 있는 향의 강도로 장향형에서 가장 두드러진다."
            },
            {
                metric: "바디/점성",
                label: "Body Thickness",
                value: "Light to Full Body",
                description: "풀바디일수록 오일리한 질감이 입안에서 팽창하며, 라이트 바디는 청량하고 깨끗한 마무리를 유도한다."
            },
            {
                metric: "피니시 길이",
                label: "Finish Length",
                value: "Short to Extra Long",
                description: "좋은 백주는 알코올의 자극보다 향의 잔향이 훨씬 오래 남으며, 단계적으로 향이 변화한다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "수수(고량) 및 다곡(쌀, 옥수수, 밀 등)",
                description: "백주 풍미의 뼈대다. 고량은 깔끔한 성격을, 쌀과 옥수수는 부드러운 단맛과 고소함을 보탠다."
            },
            {
                type: "발효제",
                name: "대곡(Daqu) / 소곡(Xiaoqu)",
                description: "미생물 생태계를 설계하는 단계다. 어떤 누룩을 쓰느냐가 향형의 스타일을 결정하는 핵심 변수다."
            },
            {
                type: "발효 용기",
                name: "진흙 발효지(오래된 교지) & 항아리",
                description: "발효지에 서식하는 고유 미생물이 향을 결정한다. 수백 년 된 '노교지'는 농향형 백주의 보물로 여겨진다."
            },
            {
                type: "숙성 용기",
                name: "도기 숙성단 (토기 항아리)",
                description: "미세한 산화와 흡착을 통해 알코올의 거친 맛을 빼고 향을 둥글게 통합하는 역할을 한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "제곡",
                name: "누룩 제조 및 접종",
                description: "밀이나 쌀로 누룩을 빚어 향미의 전구물질을 생성하고 미생물 생태계를 구축한다."
            },
            {
                step: "발효",
                name: "고체 발효 (Solid-state)",
                description: "액체가 아닌 고체 상태에서 곡물을 발효하여 향미 성분을 고농도로 축적시킨다. 향형에 따라 수개월씩 지속된다."
            },
            {
                step: "증류",
                name: "증기 증류 및 분할 채주(勾調)",
                description: "고체 발효물을 쪄서 증류한다. 이때 향의 선명함에 따라 초류, 중류, 후류를 엄격히 분리하여 채취한다."
            },
            {
                step: "조정",
                name: "숙성 및 블렌딩 (勾兌)",
                description: "수년의 숙성을 거친 원액들을 정교하게 블렌딩하여 하우스 고유의 향형과 품질 일관성을 완성한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "바이주 전용 작은 잔 또는 튤립형 스니프터",
            optimalTemperatures: [
                {
                    temp: "18~22℃ (상온)",
                    description: "과일 에스터부터 구수한 숙성향까지 단계별 향의 변화를 가장 잘 느낄 수 있는 표준 온도다."
                },
                {
                    temp: "10~15℃ (약간 차갑게)",
                    description: "알코올 열감이 줄어 입문화가 쉬워지며, 청향형이나 미향형의 산뜻함이 강조된다."
                }
            ],
            methods: [
                {
                    name: "니트 (Small Sips)",
                    description: "매우 작은 잔에 따라 한 번에 들이키기보다 혀끝에서 조금씩 굴리며 향을 음미하는 것이 좋다."
                },
                {
                    name: "디켄팅 (Resting)",
                    description: "고도수 백주는 잔에 따른 뒤 5~10분 정도 두면 알코올의 공격성이 줄고 숨겨진 향이 살아난다."
                },
                {
                    name: "중식 페어링",
                    description: "기름진 요리나 향신료가 강한 중식과 함께할 때 백주의 높은 도수가 입안을 깔끔하게 씻어준다."
                }
            ]
        },
        flavorTags: [
            { label: "파인애플/열대과일", color: "bg-rose-600/20 text-zinc-950 dark:text-rose-300" },
            { label: "배/사과(청량함)", color: "bg-sky-400/20 text-zinc-950 dark:text-sky-300" },
            { label: "꽃/화이트플라워", color: "bg-rose-400/20 text-zinc-950 dark:text-rose-300" },
            { label: "볶은 곡물/고소함", color: "bg-yellow-600/20 text-zinc-950 dark:text-yellow-300" },
            { label: "참깨/토스트(너티)", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-300" },
            { label: "간장/된장(장향)", color: "bg-stone-600/20 text-zinc-950 dark:text-stone-300" },
            { label: "흙내/발효창고", color: "bg-stone-500/20 text-zinc-950 dark:text-stone-300" },
            { label: "후추/알싸함", color: "bg-amber-700/20 text-zinc-950 dark:text-amber-300" }
        ],
        foodPairing: [
            "훠궈 및 마라 요리",
            "양꼬치 및 양고기 구이",
            "동파육 등 진한 간장 조림 요리",
            "북경오리 및 로스트 덕",
            "짭짤한 건해산물 안주",
            "사천식 매운 볶음 요리"
        ],
        dbCategories: ['baijiu']
    }
}
