import { SpiritCategory } from './types'

export const sojuDistilled: SpiritCategory = {
    slug: 'soju-distilled',
    emoji: '🌾',
    nameKo: '증류식 소주',
    nameEn: 'Distilled Soju',
    taglineKo: '전통 방식으로 증류한 깊은 풍미의 한국 전통주',
    taglineEn: 'Traditional Korean spirit distilled for deep, complex flavors',
    color: 'sky',
    sections: {
        definition: "증류식 소주는 쌀, 보리, 고구마 등 곡물을 발효시킨 후 증류기를 사용해 순수하게 알코올을 뽑아낸 한국의 전통 증류주입니다.",
        history: "고려 시대 몽골(원나라)을 통해 아랍의 증류 기술(아라키)이 전래되며 시작되었고, 안동, 개성, 제주 등지에서 지역 명주로 발전했습니다.",
        subtypes: [
            { name: '상압 증류 소주', description: '일반적인 대기압에서 증류하여 거칠지만 원재료의 묵직하고 꼬릿한 풍미를 그대로 담아냅니다. (예: 전통 안동소주)' },
            { name: '감압 증류 소주', description: '증류기 내부 압력을 낮춰 낮은 온도에서 증류하여 탄내가 없고 깔끔하고 산뜻한 맛이 특징입니다. (예: 일품진로, 화요)' },
            { name: '오크 숙성 소주', description: '증류한 소주를 오크통에 숙성하여 위스키와 유사한 바닐라, 오크 향을 더한 현대적 소주입니다.' }
        ],
        flavorTags: [
            { label: '구수함/곡물향', color: 'bg-amber-600/20 text-amber-400 border-amber-600/30' },
            { label: '누룩향(쿰쿰함)', color: 'bg-stone-500/20 text-stone-300 border-stone-500/30' },
            { label: '깔끔함/산뜻함', color: 'bg-sky-400/20 text-sky-300 border-sky-400/30' },
            { label: '화사한 과실향', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' }
        ],
        production: "원재료 처리(찌기) → 누룩과 함께 발효(밑술, 덧술) → 증류(소주고리 또는 단식/연속식 증류기) → 숙성(옹기, 스테인리스, 오크통) → 여과 및 병입",
        howToEnjoy: [
            "니트(Neat): 튤립 글라스에 따라 원재료의 깊은 향미 온전히 느끼기",
            "온더락(On the rocks): 도수가 높은 소주를 얼음에 녹여가며 부드럽게 마시기",
            "하이볼(Highball): 토닉워터, 유자, 레몬 등과 섞어 가볍고 청량하게 즐기기"
        ],
        foodPairing: ["한상차림(한정식)", "방어/참치회", "삼겹살 구이", "수육/보쌈", "매운 소갈비찜"],
        dbCategories: ['distilled_soju', 'traditional_liquor']
    }
}
