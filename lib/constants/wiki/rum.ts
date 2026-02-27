import { SpiritCategory } from './types'

export const rum: SpiritCategory = {
    slug: 'rum',
    emoji: '🥃',
    nameKo: '럼',
    nameEn: 'Rum',
    taglineKo: '사탕수수에서 피어난 카리브해의 정열',
    taglineEn: 'The spirit of the Caribbean, born from sugar cane',
    color: 'amber',
    sections: {
        definition: "럼(rum)은 사탕수수에서 얻은 당(주로 몰라세스 또는 신선한 사탕수수 주스)을 발효·증류해 만든 증류주로, 숙성·블렌딩·증류 방식·가공(가당/향신료/색 조정) 여부에 따라 매우 넓은 스타일 스펙트럼을 가진다.",
        history: "17세기 카리브해 사탕수수 플랜테이션에서 몰라세스를 발효·증류하던 관행에서 시작되었다. 대서양 무역과 해적, 영국 해군의 배급 문화와 얽힌 파란만장한 역사를 지니고 있으며, 최근에는 원산지 보호와 숙성 기술의 미학을 강조하는 프리미엄 주류로 재정립되고 있다.",
        classifications: [
            {
                name: "몰라세스 럼 (Molasses-based Rum)",
                criteria: "당밀(몰라세스)을 원료로 발효·증류",
                description: "전 세계 럼의 표준적인 스타일이다. 카라멜, 토피, 흑설탕 같은 농밀한 단향과 스파이시한 풍미가 특징이다. 포트 스틸 비중이 높을수록 묵직한 바디를 가진다."
            },
            {
                name: "럼 아그리콜 (Rhum Agricole)",
                criteria: "신선한 사탕수수 주스를 그대로 발효·증류",
                description: "프랑스 해외 영토(마르티니크 등)의 전통 방식이다. 인위적인 단맛보다 사탕수수 자체의 풀내(Grassy), 허브, 플로럴한 향과 개운한 미네랄감이 돋보인다."
            },
            {
                name: "화이트 / 실버 럼 (White / Silver)",
                criteria: "무숙성 또는 단기 숙성 후 차콜 필터링으로 색 제거",
                description: "가장 가볍고 청량한 스타일이다. 은은한 사탕수수 단향과 시트러스함이 중심이 되어 다이키리, 모히토 등 칵테일 베이스로 최적화되어 있다."
            },
            {
                name: "골드 / 앰버 럼 (Gold / Amber)",
                criteria: "오크 숙성으로 자연스런 황금빛 획득",
                description: "바닐라, 토스트, 가벼운 카라멜 노트가 더해진다. 스트레이트로 즐기거나 럼 토닉, 럼 콕 등 하이볼에서 향의 존재감을 드러낸다."
            },
            {
                name: "다크 / 블랙 럼 (Dark / Black)",
                criteria: "긴 숙성 또는 색 조정을 통해 진한 갈색 획득",
                description: "초콜릿, 커피, 깊은 스파이스 풍미가 강렬하다. 칵테일의 풍미를 묵직하게 잡아주거나 고숙성 제품은 천천히 음미하는 용도로 즐긴다."
            },
            {
                name: "하이-에스터 럼 (High-Ester / Funky)",
                criteria: "장기 발효와 던더(Dunder) 시스템 활용",
                description: "파인애플, 익은 바나나, 캔디 같은 강렬한 ‘펑키(Funky)’ 아로마가 특징이다. 자메이카 럼에서 흔히 볼 수 있는 마니아적인 스타일이다."
            },
            {
                name: "스파이스드 럼 (Spiced Rum)",
                criteria: "증류주에 시나몬, 바닐라 등 향신료 가향",
                description: "베이킹 스파이스가 전면에 나서며 접근성이 좋다. 콜라나 진저 맥주와 섞었을 때 압도적인 풍미의 시너지를 보여준다."
            },
            {
                name: "솔레라 / 에이징 블렌드",
                criteria: "다양한 연수의 원액을 순환 블렌딩",
                description: "부드러운 질감과 일관된 하우스 스타일이 매력적이다. 건과일과 토피 향이 둥글게 통합되어 있어 초심자도 즐기기 쉽다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "에스터 강도 (펑키함)",
                label: "Funky Level",
                value: "None to High Pungency",
                description: "발효 과정이 길수록 열대과일과 익은 과일의 복합적인 아로마가 강해지며, 이는 럼 전용 품질 지표인 에스터 수치와 직결된다."
            },
            {
                metric: "질감/유질감",
                label: "Texture",
                value: "Crisp to Velvety",
                description: "아그리콜 럼의 산뜻함부터 고숙성 몰라세스 럼의 벨벳 같은 매끄러운 질감까지 증류와 숙성 환경에 따라 달라진다."
            },
            {
                metric: "숙성 속도/밀도",
                label: "Tropical Aging",
                value: "High Intensity Maturation",
                description: "고온다습한 카리브해의 기후는 오크통과의 성분 교환을 가속화해 짧은 연수에도 매우 진하고 농축된 풍미를 만든다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "당밀 (Molasses) 또는 사탕수수 주스",
                description: "럼의 맛을 결정하는 뿌리다. 당밀은 묵직하고 달콤한 베이스를, 주스는 신선하고 화사한 베이스를 제공한다."
            },
            {
                type: "발효제",
                name: "야생 효모 및 던더 (Dunder)",
                description: "이전 발효 부산물을 재사용하는 던더 기법은 럼 특유의 개성적인 발효향을 폭발시키는 핵심적인 노하우다."
            },
            {
                type: "숙성통",
                name: "아메리칸 화이트 오크 (Ex-Bourbon)",
                description: "사탕수수의 단맛을 버번 캐스크 유래의 바닐라, 코코넛 향으로 보완하며 풍성한 럼의 골격을 만든다."
            }
        ],
        manufacturingProcess: [
            {
                step: "준비/발효",
                name: "원료 전처리 및 장기 발효",
                description: "사탕수수 가공 방식에 맞춰 미생물 생태계를 관리하며, 수일 이상 지속되는 발효를 통해 복합적인 향미를 축적한다."
            },
            {
                step: "증류",
                name: "단식 증류(Pot) 및 연속식 증류(Column)",
                description: "개성 강한 포트 스틸 원액과 깔끔한 컬럼 스틸 원액을 목적에 맞게 생산하여 럼의 밸런스를 잡는다."
            },
            {
                step: "숙성/블렌딩",
                name: "열대 숙성 및 아상블라주",
                description: "덥고 습한 기후에서 빠르게 숙성시킨 뒤, 마스터 블렌더가 다양한 캐릭터를 조합해 하우스 고유의 스타일을 완성한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "튤립형 노징 글라스 또는 하이볼 잔",
            optimalTemperatures: [
                {
                    temp: "18~22℃ (상온)",
                    description: "숙성 럼의 바닐라, 카라멜, 오크 스파이스가 가장 풍성하게 열리는 최적의 온도다."
                },
                {
                    temp: "4~10℃ (칠드)",
                    description: "화이트 럼이나 라이트 럼의 청량한 사탕수수 향이 돋보이며 칵테일 페이스로 즐기기 좋은 온도다."
                }
            ],
            methods: [
                {
                    name: "니트 (Sipping Neat)",
                    description: "원액 그대로 마시면 숙성에서 오는 유질감과 고유의 펑키한 아로마를 가장 온전히 즐길 수 있다."
                },
                {
                    name: "물 한두 방울 (A Drop of Water)",
                    description: "고도수 럼이나 에스터가 강한 제품에 소량의 물을 더하면 향의 레이어가 화사하게 열리고 자극이 준다."
                },
                {
                    name: "럼 하이볼 (Rum & Mixers)",
                    description: "콜라(쿠바 리브레), 진저비어(다크 앤 스토미), 탄산수 등과 믹싱하여 럼의 단향을 시원하게 즐긴다."
                }
            ]
        },
        flavorTags: [
            { label: "바닐라/토피", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "카라멜/흑설탕", color: "bg-amber-700/20 text-zinc-950 dark:text-amber-300" },
            { label: "바나나/펑키", color: "bg-yellow-500/20 text-zinc-950 dark:text-yellow-300" },
            { label: "파인애플/열대과일", color: "bg-rose-500/20 text-zinc-950 dark:text-rose-300" },
            { label: "그라시/사탕수수", color: "bg-emerald-400/20 text-zinc-950 dark:text-emerald-300" },
            { label: "스파이스/시나몬", color: "bg-amber-500/20 text-zinc-950 dark:text-amber-300" },
            { label: "훈연/레더", color: "bg-stone-500/20 text-zinc-950 dark:text-stone-300" }
        ],
        foodPairing: [
            "저크 치킨 및 매콤한 바비큐 요리",
            "다크 초콜릿 및 티라미수",
            "그릴드 파인애플 및 열대과일 디저트",
            "바나나 브레드 및 견과류 정과",
            "훈제 치즈 및 숙성 체다 치즈"
        ],
        dbCategories: ['rum', 'white-rum', 'dark-rum', 'spiced-rum']
    }
}
