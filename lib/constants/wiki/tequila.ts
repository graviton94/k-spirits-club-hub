import { SpiritCategory } from './types'

export const tequila: SpiritCategory = {
    slug: 'tequila',
    emoji: '🌵',
    nameKo: '데킬라',
    nameEn: 'Tequila',
    taglineKo: '멕시코 서부 아가베로 빚어낸 정열의 증류주',
    taglineEn: 'The spirited soul of Mexico, crafted from blue agave',
    color: 'orange',
    sections: {
        definition: "데킬라(Tequila)는 멕시코 지정 원산지에서 재배한 블루 웨버 아가베(Blue Weber Agave)의 당을 발효·증류해 만드는 멕시코의 대표적인 아가베 증류주이다.",
        history: "아가베 발효·증류 기술은 스페인 식민지 시기 증류 기술이 유입되며 발전했고, 할리스코 주 테킬라 지역을 중심으로 상업 생산이 본격화되었다. 현재는 ‘원산지 명칭(DO)’과 규격(NOM) 체계에 의해 생산 지역과 원료 기준이 표준화되어 엄밀히 관리되고 있다.",
        classifications: [
            {
                name: "100% 아가베 (100% de Agave)",
                criteria: "발효 당이 100% 블루 웨버 아가베에서만 유래",
                description: "프리미엄 데킬라의 기준으로, 아가베 본연의 허브, 시트러스, 후추 향이 선명하다. 설탕 단맛이 아닌 구운 아가베의 깊은 복합미를 제공한다."
            },
            {
                name: "미크스토 (Mixto)",
                criteria: "아가베 당 최소 51%와 기타 당류 혼합",
                description: "가격 접근성이 좋아 칵테일 베이스로 주로 쓰인다. 아가베의 개성보다는 단순한 단맛과 가벼운 바디감이 특징이다."
            },
            {
                name: "블랑코 / 실버 (Blanco / Plata)",
                criteria: "숙성하지 않거나 2개월 미만 휴지",
                description: "아가베의 식물성(허브), 시트러스, 알싸한 후추 향이 가감 없이 드러나는 순수하고 야생적인 풍미의 등급이다."
            },
            {
                name: "레포사도 (Reposado)",
                criteria: "오크 통에서 2개월 이상 1년 미만 숙성",
                description: "아가베의 개성을 유지하면서도 오크 유래 바닐라, 카라멜 향이 조화를 이루어 부드러운 질감을 형성한다."
            },
            {
                name: "아녜호 (Añejo)",
                criteria: "오크 통에서 1년 이상 3년 미만 숙성",
                description: "풍미가 농밀해지며 초콜릿, 견과, 깊은 스파이스 풍미가 위스키 같은 고유의 복합미를 선사하는 고숙성 등급이다."
            },
            {
                name: "엑스트라 아녜호 (Extra Añejo)",
                criteria: "오크 통에서 3년 이상 장기 숙성",
                description: "가장 진귀한 등급으로, 진한 다크 초콜릿, 가죽, 토피 향이 쌓이며 오크의 우아한 영향력이 극대화된 스타일이다."
            },
            {
                name: "크리스탈리노 (Cristalino)",
                criteria: "아녜호 이상을 여과하여 투명하게 만든 스타일",
                description: "숙성주의 부드러운 유질감은 유지하되 색과 거친 나무 향을 걷어내어, 맑은 외관 속의 묵직한 반전을 선사한다."
            }
        ],
        sensoryMetrics: [
            {
                metric: "아가베 순도",
                label: "Agave Purity",
                value: "100% Agave / Mixto(51% 미만)",
                description: "순도가 높을수록 식물성 허브와 흙내 같은 테루아 개성이 또렷하고, 낮을수록 깔끔하고 가벼운 인상을 준다."
            },
            {
                metric: "숙성 영향도",
                label: "Wood Influence",
                value: "None to Intense",
                description: "블랑코의 야생적인 풍미부터 엑스트라 아녜호의 위스키 같은 나무 질감까지 숙성 기간에 따라 결정된다."
            },
            {
                metric: "알싸함 (스파이스)",
                label: "Peppery Level",
                value: "White Pepper / Jalapeño",
                description: "아가베 특유의 알싸한 자극이 혀끝에서 느껴지며, 특히 블랑코 등급에서 그 매력이 가장 돋보인다."
            },
            {
                metric: "단맛 유형",
                label: "Sweetness",
                value: "Roasted Agave Honey",
                description: "설탕의 단맛이 아닌, 아가베 피냐를 구워냈을 때 느껴지는 깊은 조청이나 구운 꿀 같은 은은한 단맛이다."
            }
        ],
        coreIngredients: [
            {
                type: "주원료",
                name: "블루 웨버 아가베 (Blue Weber Agave)",
                description: "데킬라의 정체성이다. 최소 6~8년 이상 자란 아가베 피냐만을 사용하여 깊은 복합미의 기반을 만든다."
            },
            {
                type: "발효제",
                name: "전용 효모 및 정제수",
                description: "주스를 알코올로 바꾸며 열대 과일이나 요거트 같은 2차 풍미를 입히고 최종 질감을 결정한다."
            },
            {
                type: "숙성 용기",
                name: "엑스-버번 또는 와인 캐스크",
                description: "숙성 등급에 따라 바닐라, 시나몬, 견과류 향을 입히며 알코올의 공격성을 잠재우는 역할을 한다."
            }
        ],
        manufacturingProcess: [
            {
                step: "수확/조리",
                name: "히마(Jima) 및 쿠킹",
                description: "아가베 잎을 제거한 피냐를 가열하여 전분을 당으로 바꾼다. 전통 오븐(Hornos) 사용 여부가 단맛의 깊이를 좌우한다."
            },
            {
                step: "추출/발효",
                name: "밀링 및 발효",
                description: "가공된 아가베에서 즙을 짜내고 효모를 넣어 발효한다. 전통 맷돌(Tahona) 사용은 더 복합적인 토양 향을 남긴다."
            },
            {
                step: "증류/숙성",
                name: "단식 증류 및 에이징",
                description: "2회 증류를 통해 맑은 블랑코 원액을 얻고, 등급에 따라 오크통에서 수개월에서 수년간 숙성한다."
            }
        ],
        servingGuidelines: {
            recommendedGlass: "데킬라 코피타(Copita) 또는 튤립형 잔",
            optimalTemperatures: [
                {
                    temp: "14~16℃",
                    description: "블랑코의 신선한 시트러스와 아가베 향이 가장 돋보이며 알코올 자극이 적절히 억제되는 온도다."
                },
                {
                    temp: "18~22℃",
                    description: "아녜호 이상 고숙성 제품의 복합적인 카멜, 초콜릿, 오크 스파이스가 풍부하게 피어오르는 온도다."
                }
            ],
            methods: [
                {
                    name: "니트 (Sipping Neat)",
                    description: "상온에서 한 모금씩 천천히 마시며 아가베의 복합미를 즐기는 가장 정석적인 방법이다."
                },
                {
                    name: "상그리타 페어링 (With Sangrita)",
                    description: "매콤한 토마토/과일 주스인 '상그리타'를 샷과 번갈아 마시며 향미의 대비를 즐기는 전통 방식이다."
                },
                {
                    name: "가니시 하이볼",
                    description: "블랑코나 레포사도에 탄산수와 풍부한 라임 슬라이스를 곁들여 청량감을 극대화해 즐길 수 있다."
                }
            ]
        },
        flavorTags: [
            { label: "구운 아가베", color: "bg-amber-700/20 text-zinc-950 dark:text-amber-300" },
            { label: "라임/시트러스", color: "bg-sky-400/20 text-zinc-950 dark:text-sky-300" },
            { label: "화이트 페퍼", color: "bg-stone-600/20 text-zinc-950 dark:text-stone-300" },
            { label: "바닐라/카라멜", color: "bg-amber-600/20 text-zinc-950 dark:text-amber-300" },
            { label: "풀/허브", color: "bg-emerald-500/20 text-zinc-950 dark:text-emerald-300" },
            { label: "미네랄", color: "bg-stone-500/20 text-zinc-950 dark:text-stone-300" }
        ],
        foodPairing: [
            "라임을 곁들인 세비체 및 해산물",
            "돼지고기 타코 (카르니타스)",
            "양념된 그릴 육류 및 스테이크",
            "숙성된 치즈 (만체고, 고다)",
            "다크 초콜릿 및 견과류"
        ],
        dbCategories: ['tequila', 'mezcal']
    }
}
