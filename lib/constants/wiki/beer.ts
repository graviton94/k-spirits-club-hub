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
        definition: "맥주(Beer)는 맥아(Malted barley)를 주원료로 당화시킨 즙에 홉(Hop)을 넣어 끓인 뒤, 맥주 효모를 사용해 발효시킨 지구상에서 가장 대중적이고 오래된 양조주 중 하나입니다.",
        history: "기원전 4000년경 메소포타미아 수메르인의 점토판에 빵을 물에 풀어 발효시킨 최초의 맥주가 기록되어 있습니다. 중세 수도원의 체계적 양조법 홉 도입으로 비약적으로 발전했습니다.",
        subtypes: [
            { name: '라거 (Lager)', description: '낮은 온도에서 발효하며 효모가 바닥으로 가라앉는 하면 발효 맥주. 황금빛, 뛰어난 청량감과 깔끔한 목넘김이 특징입니다. (페일 라거, 필스너 등)' },
            { name: '에일 (Ale)', description: '높은 온도에서 발효하여 효모가 위로 떠오르는 상면 발효 맥주. 다양한 과실향(에스테르)과 풍부한 바디감이 특징. (페일 에일, IPA, 스타우트 등)' },
            { name: '자연 발효 맥주 (Lambic)', description: '야생 효모를 이용해 자연 상태로 발효시키는 벨기에의 전통적 방식으로, 강렬한 신맛이 매력 포인트입니다.' }
        ],
        flavorTags: [
            { label: '몰트/빵/구수함', color: 'bg-amber-400/20 text-amber-300 border-amber-400/30' },
            { label: '홉(솔향/자몽/열대과일)', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
            { label: '쌉쌀함(쓴맛)', color: 'bg-stone-500/20 text-stone-300 border-stone-500/30' },
            { label: '청량감/탄산', color: 'bg-yellow-300/20 text-yellow-200 border-yellow-300/30' }
        ],
        production: "제맥(Malting, 보리에 싹 틔우기) → 당화(Mashing) 및 맥즙 여과 → 끓임(Boiling)과 알싸한 홉 투입 → 냉각 → 효모 접종 및 발효 → 장기/단기 숙성(Conditioning) → 여과(선택) 후 병입/캔입",
        howToEnjoy: [
            "전용 잔 사용: 라거는 길고 좁은 톨 글라스, 에일은 향이 모이는 튤립 글라스 등으로 시각과 후각을 만족",
            "거품 따르기: 잔을 기울여 부드럽게 따르다 마지막에 세워 마실 때 탄산 손실을 막아주는 적절한 폼(거품 층) 형성하기",
            "온도 조절: 라거는 아주 차갑게(4도), 풍미 깊은 에일과 흑맥주는 약간 높은 온도(8~12도)에서 즐기기"
        ],
        foodPairing: ["피자/햄버거", "치킨(치맥)", "프레첼/나초", "피시 앤 칩스", "소시지 감자 구이"],
        dbCategories: ['beer', 'ale', 'lager']
    }
}
