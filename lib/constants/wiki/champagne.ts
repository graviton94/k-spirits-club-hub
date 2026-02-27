import { SpiritCategory } from './types'

export const champagne: SpiritCategory = {
    slug: 'champagne',
    emoji: '🥂',
    nameKo: '샴페인',
    nameEn: 'Champagne',
    taglineKo: '프랑스 샹파뉴 지방에서만 생산되는 스파클링 와인',
    taglineEn: 'Sparkling wine exclusively from France\'s Champagne region',
    color: 'yellow',
    sections: {
        definition: "샴페인(Champagne)은 프랑스 샹파뉴(Champagne) 지방에서 재배된 특정 포도 품종만 사용하고, 병 내 2차 발효 등 엄격한 전통 방식(Méthode Champenoise)을 지켜 만든 최고급 스파클링 와인입니다.",
        history: "17세기에 기포가 생기는 와인을 불량품으로 여겼으나, 돔 페리뇽(Dom Pérignon) 수사가 병 내 발효 기술을 연구하며 현재의 샴페인 기틀을 마련했습니다.",
        subtypes: [
            { name: '논 빈티지 (NV)', description: '여러 해의 와인을 섞어 양조장 특유의 일정한 하우스 스타일을 매년 유지하는 샴페인.' },
            { name: '빈티지', description: '작황이 특히 좋은 해에 수확한 포도로만 생산하는 고급 샴페인.' },
            { name: '블랑 드 블랑 / 블랑 드 누아', description: '청포도(샤르도네)만으로 만든 샴페인(블랑 드 블랑)과 적포도(피노 누아 등)로만 만든 샴페인(블랑 드 누아).' }
        ],
        flavorTags: [
            { label: '브리오슈/토스트(이스트)', color: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30' },
            { label: '청사과/레몬/시트러스', color: 'bg-lime-400/20 text-lime-300 border-lime-400/30' },
            { label: '아몬드/구운 견과류', color: 'bg-amber-600/20 text-amber-400 border-amber-600/30' },
            { label: '미네랄/초크', color: 'bg-stone-400/20 text-stone-300 border-stone-400/30' }
        ],
        production: "퀴베(Cuvée, 베이스 와인) 생산 → 아상블라주(블렌딩) → 티라주(병에 효모/당 첨가) → 병 내 2차 발효 및 숙성 → 르미아주(찌꺼기 모으기) 및 데고르주망(빼내기) → 도자주(당도 조절) 후 코르크 마감",
        howToEnjoy: [
            "칠링: 8~10도 정도로 시원하게 온도 낮추기",
            "버블과 향: 플루트 잔 또는 튤립/백포도주 잔에 따라 섬세하게 올라오는 기포와 복합적인 향미 흠향하기",
            "축하의 순간: 펑 하는 경쾌한 소리와 함께 특별한 자리를 축하하는 최고의 건배주"
        ],
        foodPairing: ["캐비어/굴/생선회", "프라이드 치킨(최고의 궁합)", "트러플 감자튀김", "신선한 딸기", "브리 치즈"],
        dbCategories: ['champagne', 'sparkling_wine']
    }
}
