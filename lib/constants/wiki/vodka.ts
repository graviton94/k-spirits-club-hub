import { SpiritCategory } from './types'

export const vodka: SpiritCategory = {
    slug: 'vodka',
    emoji: '❄️',
    nameKo: '보드카',
    nameEn: 'Vodka',
    taglineKo: '무색·무취의 순수함, 모든 칵테일의 캔버스',
    taglineEn: 'Crystal-clear and neutral — the ultimate cocktail canvas',
    color: 'blue',
    sections: {
        definition: "보드카(Vodka)는 주로 곡물(밀, 보리, 호밀)이나 감자 등을 발효해 연속 증류한 뒤, 숯으로 철저히 여과하여 불순물과 향미 요소까지 모두 제거한 무색·무취·무미의 증류주입니다.",
        history: "14~15세기 러시아와 폴란드에서 기원했으며, 혹한의 추위를 이기기 위해 마셨던 '생명의 물(지즈나야 보따)'에서 이름이 유래되었습니다.",
        subtypes: [
            { name: '클리어/퓨어 보드카', description: '향이 거의 없고 알코올의 순수한 타격감을 즐기는 전통적인 무색 투명 보드카 (예: 앱솔루트, 스미노프, 그레이구스).' },
            { name: '플레이버드 보드카', description: '레몬, 바닐라, 페퍼, 자몽 등의 향을 인위적으로 첨가하여 칵테일 재료로 쉽게 쓰이도록 만든 보드카.' }
        ],
        flavorTags: [
            { label: '깔끔함/순수함', color: 'bg-cyan-200/20 text-cyan-100 border-cyan-200/30' },
            { label: '알코올 타격감', color: 'bg-gray-300/20 text-gray-200 border-gray-300/30' },
            { label: '은은한 단맛(밀/감자)', color: 'bg-yellow-200/20 text-yellow-100 border-yellow-200/30' },
            { label: '크리미/스파이시(원료별)', color: 'bg-blue-300/20 text-blue-200 border-blue-300/30' }
        ],
        production: "원재료 당화 및 발효 → 연속식 증류기로 95% 이상의 고순도 알코올(주정) 추출 → 자작나무 숯 등을 통과시켜 극한의 여과 진행(냄새와 불순물 제거) → 물로 40% 내외로 희석 후 병입",
        howToEnjoy: [
            "샷(Shot): 냉동실에 병째 넣어 걸쭉해진(빙건) 보드카를 단숨에 털어 넣기",
            "모스코 뮬: 진저 비어, 라임 주스와 섞어 구리 잔에 담아 마시기",
            "심플 믹스: 깔끔한 맛 덕분에 주스(오렌지, 크랜베리)나 토닉워터 등 어떤 음료와 섞어도 잘 어울림 (스크류 드라이버, 보드카 토닉)"
        ],
        foodPairing: ["캐비어", "블리니(러시아 팬케이크)", "연어 그라브락스", "피클/올리브", "기름진 고기 요리"],
        dbCategories: ['vodka']
    }
}
