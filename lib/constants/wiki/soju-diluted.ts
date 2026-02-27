import { SpiritCategory } from './types'

export const sojuDiluted: SpiritCategory = {
    slug: 'soju-diluted',
    emoji: '🍶',
    nameKo: '희석식 소주',
    nameEn: 'Diluted Soju',
    taglineKo: '대한민국 국민 술, 부드럽고 깔끔한 희석식 소주',
    taglineEn: 'Korea\'s most popular spirit — clean, smooth, and versatile',
    color: 'cyan',
    sections: {
        definition: "희석식 소주는 타피오카, 고구마 등으로 만든 순도 95% 이상의 주정(에탄올)에 물과 감미료를 섞어 도수를 낮춘 한국의 대중적인 주류입니다.",
        history: "1960년대 식량 부족으로 인한 양곡관리법 시행으로 쌀을 이용한 주류 제조가 금지되면서, 값싸고 대량생산이 가능한 희석식 소주가 국민술로 자리 잡게 되었습니다.",
        subtypes: [
            { name: '일반 희석식 소주', description: '참이슬, 처음처럼 등 16도 전후의 부드러운 도수와 감미료의 은은한 단맛을 특징으로 하는 대중적인 소주.' },
            { name: '프리미엄 희석식 소주', description: '일부 증류식 소주 원액을 블렌딩하거나 여과 공법을 고급화하여 알코올 역한 맛을 줄인 제품.' },
            { name: '과일 소주 (리큐르)', description: '자몽, 청포도 등 과일 향료와 단맛을 일방향으로 강하게 첨가한 저도수 혼합주.' }
        ],
        flavorTags: [
            { label: '알코올향/타격감', color: 'bg-zinc-400/20 text-zinc-300 border-zinc-400/30' },
            { label: '단맛(감미료)', color: 'bg-cyan-300/20 text-cyan-200 border-cyan-300/30' },
            { label: '깔끔함/청량감', color: 'bg-sky-300/20 text-sky-200 border-sky-300/30' }
        ],
        production: "발효 원액을 연속식 증류기로 증류하여 고순도 주정 생산 → 주정에 정제수를 섞어 희석 → 스테비아, 에리스리톨/과당 등 감미료 첨가 → 숯(활성탄) 여과 불순물 제거 → 병입",
        howToEnjoy: [
            "샷(Shot): 차갑게 냉장 보관 한 뒤 소주잔에 따라 단숨에 털어 마시기",
            "소맥: 맥주와 적절한 비율로 섞어 시원하고 청량한 폭탄주로 마시기",
            "과일 믹스: 과일 주스, 홍차 토닉 등과 섞어 알코올 향 덮고 달콤하게 즐기기"
        ],
        foodPairing: ["삼겹살/돼지구이", "김치찌개/부대찌개", "매콤한 제육볶음", "각종 국밥", "배달 야식(족발/치킨)"],
        dbCategories: ['soju']
    }
}
