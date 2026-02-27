import { SpiritCategory } from './types'

export const vodka: SpiritCategory = {
    slug: 'vodka',
    emoji: '❄️',
    nameKo: '보드카',
    nameEn: 'Vodka',
    taglineKo: '무색·무취의 순수함, 모든 칵테일의 투명한 캔버스',
    taglineEn: 'Crystal-clear and neutral — the ultimate cocktail canvas',
    color: 'sky',
    sections: {
        definition: "보드카(Vodka)는 곡물·감자·포도 등 농산물을 발효한 뒤 고도수로 증류(정류)해 향·불순물을 최소화하고, 물로 희석해 병입하는 무색의 ‘중성(Neutral) 증류주’다. 기본 철학은 깨끗하고 드라이한 프로파일이지만, 원료(곡물/감자/포도), 증류 강도, 여과 과정에 따라 미세한 질감과 풍미의 차이가 발생한다.",
        history: "보드카의 뿌리는 동유럽(러시아·폴란드)에서 중세 말에 확산된 증류 문화에서 시작되었다. 19세기 연속식 증류 기술의 발전으로 ‘향이 적고 깨끗한’ 현대적 스타일이 완성되었으며, 20세기 중반 이후 칵테일 문화의 폭발적 성장과 함께 세계에서 가장 많이 소비되는 베이스 스피릿으로 자리 잡았다.",
        classifications: [
            {
                name: "곡물(Grain) 보드카",
                criteria: "밀·호밀·옥수수 등 곡물 전분 기반",
                description: "가장 대중적인 스타일로, 밀 기반은 크리미한 질감을, 호밀 기반은 은은한 후추 같은 스파이스를, 옥수수 기반은 둥글고 가벼운 단맛 인상을 특징으로 한다."
            },
            {
                name: "감자(Potato) 보드카",
                criteria: "감자 전분 발효 및 증류",
                description: "질감이 더 두툼하고 무게감 있게 느껴지며, 특유의 흙내음이나 고소함이 동반되기도 한다. 스트레이트나 온더락으로 즐길 때 질감의 매력이 가장 잘 드러난다."
            },
            {
                name: "포도/와인 보드카",
                criteria: "포도 또는 와인 부산물 증류",
                description: "중성적인 특성을 유지하면서도 질감이 실키하고 미세한 과일·꽃 향의 잔향이 남는다. 드라이한 마티니 칵테일 베이스로 뛰어난 궁합을 보여준다."
            },
            {
                name: "플레이버드(Flavored) 보드카",
                criteria: "천연/합성 향료나 과일 등을 첨가하여 풍미 부여",
                description: "레몬, 바닐라, 베리 등 명확한 향을 지니고 있어 칵테일 제조가 용이하다. 가당 여부에 따라 제품별로 바디감과 단맛의 차이가 크다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "알코올 도수",
                label: "ABV (%)",
                value: "37.5% ~ 40% (표준)",
                description: "40%는 칵테일의 구조감을 지지하는 표준 도수이며, 프리미엄 보드카는 높은 도수에서도 알코올 자극이 적고 매끄러운 것이 특징이다."
            },
            {
                metric: "중성도",
                label: "Neutrality",
                value: "Extremely High",
                description: "반복적인 증류와 여과를 통해 불순물을 제거하여 어떤 믹서와 섞여도 그 본연의 맛을 방해하지 않는 투명한 성격을 가진다."
            },
            {
                metric: "질감/바디",
                label: "Mouthfeel",
                value: "Silky to Heavy",
                description: "원료와 여과 방식에 따라 혀끝에서 느껴지는 미끈함이나 무게감이 결정된다. 연수를 사용할수록 부드러운 목넘김을 선사한다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "농산물 (밀, 호밀, 감자, 포도 등)",
                description: "전분질이 풍부한 농산물을 발효하여 알코올을 얻는다. 원료에 따라 최종적인 질감과 미세한 풍미의 결이 결정된다."
            },
            {
                type: "정제제",
                name: "활성탄 (Charcoal)",
                description: "자작나무 숯 등을 통해 향과 불순물을 흡착 정제하여 극한의 순수함과 매끄러운 질감을 부여한다."
            },
            {
                type: "희석수",
                name: "정밀 여과수 (Soft Water)",
                description: "보드카의 절반 이상을 차지하는 물의 미네랄 설계가 목넘김의 부드러움을 완성한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "증류",
                name: "연속식 정류 (Rectification)",
                description: "컬럼 스틸에서 알코올 순도를 95% 이상으로 정류하여 원료의 잡향과 잡미를 완벽히 제거한다."
            },
            {
                step: "여과",
                name: "차콜 필터링 (Filtration)",
                description: "증류 원액을 활성탄 층에 수 차례 통과시켜 미세한 불순물까지 정제하고 질감을 부드럽게 깎아낸다."
            },
            {
                step: "안정화",
                name: "가수 및 휴지 (Resting)",
                description: "준비된 물을 섞어 도수를 맞춘 뒤, 일정 기간 안정화하여 물과 알코올이 완벽히 융합되도록 유도한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "작은 튤립잔, 샷 글라스 또는 마티니 글라스",
            optimalTemperatures: [
                {
                    temp: "-2~4℃ (극저온)",
                    description: "냉동실에 보관해 질감이 걸쭉해진 보드카는 알코올의 공격성이 줄고 극한의 청량감을 준다."
                },
                {
                    temp: "6~10℃",
                    description: "원료의 미세한 질감이나 고품질 보드카의 섬세한 향을 느끼기에 적합한 온도다."
                }
            ],
            methods: [
                {
                    name: "프로스트 샷 (Chilled Shot)",
                    description: "스트레이트로 마실 때는 잔과 잔을 모두 차갑게 얼려 원샷하기보다 입안에 머금어 질감을 느끼는 것이 좋다."
                },
                {
                    name: "보드카 마티니 (Cocktail Base)",
                    description: "베르무트와 결합해 깨끗하고 드라이한 미학을 보여준다. 가니시(올리브, 레몬)에 따라 향미가 극명하게 갈린다."
                },
                {
                    name: "보드카 토닉 / 하이볼",
                    description: "탄산수나 토닉워터를 믹싱하여 가장 청량하게 즐기는 대중적인 음용 방식이다."
                }
            ]
        },
        flavorTags: [
            { label: "클린/뉴트럴", color: "bg-sky-600/20 text-zinc-950 dark:text-sky-300" },
            { label: "매끄러운 질감", color: "bg-sky-400/20 text-zinc-950 dark:text-sky-300" },
            { label: "은은한 단맛", color: "bg-amber-500/20 text-zinc-950 dark:text-amber-300" },
            { label: "알싸한 후추", color: "bg-rose-600/20 text-zinc-950 dark:text-rose-300" },
            { label: "크리미/실키", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "미네랄리티", color: "bg-stone-500/20 text-zinc-950 dark:text-stone-300" }
        ],
        foodPairing: [
            "진하고 기름진 안주 (삼겹살, 훈제 오리)",
            "훈제 연어 및 캐비어",
            "염장 피클 및 사워크라우트",
            "호밀빵과 블리니",
            "짭짤한 하드 치즈"
        ],
        dbCategories: ['vodka']
    }
}
