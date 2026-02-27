import { SpiritCategory } from './types'

export const baijiu: SpiritCategory = {
    slug: 'baijiu',
    emoji: '🏮',
    nameKo: '고량주',
    nameEn: 'Baijiu',
    taglineKo: '수수를 원료로 한 중국의 전통 증류주',
    taglineEn: 'China\'s ancient sorghum spirit — world\'s most consumed liquor',
    color: 'red',
    sections: {
        definition: "고량주(Baijiu, 백주)는 수수(고량)를 주원료로 밀, 보리 등으로 만든 발효제(누룩/곡자)를 사용해 세계에서 유일하게 고체 발효 및 증류 방식으로 빚어내는 중국의 고도수 전통 증류주입니다.",
        history: "황하 유역 고대 문명에서 시작된 양조 기술이 발전하여 원나라 때 유입된 증류 기술과 접목되며 현재의 모습으로 꽃을 피웠습니다.",
        subtypes: [
            { name: '농향형 (濃香型)', description: '수정방, 연태고량주 등으로 대표되며, 발효 구덩이에서 생성된 에스테르로 인해 파인애플 등 달콤하고 화려한 열대과일 향이 폭발합니다.' },
            { name: '장향형 (醬香型)', description: '마오타이로 대표되며, 된장이나 간장 같이 구수하고 복합적이며 입안에 깊게 각인되는 강렬한 향이 특징.' },
            { name: '청향형 (清香型)', description: '이과두주, 분주 등으로 대표되며, 잡미 없이 깔끔하고 맑은 단맛과 산뜻함을 선도하는 스타일.' },
            { name: '미향형 (米香型)', description: '주로 남부에서 쌀로 빚어 은은하고 부드러운 쌀의 풍미를 냅니다.' }
        ],
        flavorTags: [
            { label: '파인애플/열대과일', color: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30' },
            { label: '구수함/간장(장향)', color: 'bg-stone-600/20 text-stone-400 border-stone-600/30' },
            { label: '깔끔함/청량함(청향)', color: 'bg-sky-400/20 text-sky-300 border-sky-400/30' },
            { label: '화사하고 긴 피니시', color: 'bg-red-500/20 text-red-300 border-red-500/30' }
        ],
        production: "수수 등 원재료 찌기 → 고체 상태의 곡자(누룩) 혼합 후 발효 구덩이(교지)나 옹기에서 고체 발효 → 시루(甑)에 넣고 증기 통과시키는 고체 증류 → 도자기 항아리(도단) 장기 숙성 → 정교한 구배(블렌딩)",
        howToEnjoy: [
            "작은 전용잔: 향이 워낙 강하므로 작은 백주잔(10~15ml)에 따라 마시기",
            "니트 음미: 조금씩 머금었다 넘기며 식도를 타고 다시 올라오는 깊은 호흡(회향) 만끽하기",
            "연태 하이볼: 한국에서 유행하는 방식으로 백주에 맥주(연맥)나 토닉을 섞어 부드럽게 마시기"
        ],
        foodPairing: ["베이징덕(북경오리)", "양장피/고추잡채", "마라샹궈/훠궈", "기름진 볶음/튀김 중화요리 전반", "양갈비/양꼬치"],
        dbCategories: ['baijiu']
    }
}
