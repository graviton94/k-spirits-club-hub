import { SpiritCategory } from './types'

export const wine: SpiritCategory = {
    slug: 'wine',
    emoji: '🍷',
    nameKo: '와인',
    nameEn: 'Wine',
    taglineKo: '포도의 발효로 탄생하는 세계에서 가장 오래된 술',
    taglineEn: 'The world\'s oldest drink — fermented grapes, infinite complexity',
    color: 'purple',
    sections: {
        definition: "와인(Wine)은 넓은 의미로 과실을 발효시켜 만든 양조주 전체를 가리키지만, 통상적으로는 신선한 포도(포도즙)를 발효시켜 만든 술(포도주)을 의미합니다.",
        history: "기원전 6000년경 조지아 인근에서 시작된 것으로 알려져 있으며, 이집트, 그리스, 로마 제국을 거쳐 기독교 문화와 함께 유럽 전역으로 확산되어 인류 문명과 가장 오랫동안 함께한 술입니다.",
        subtypes: [
            { name: '레드 와인', description: '적포도를 껍질과 씨 단위로 함께 발효시켜 타닌의 떫은맛과 붉은 색상을 얻어낸 와인.' },
            { name: '화이트 와인', description: '주로 청포도(일부 적포도 껍질 제외)의 즙만 짜서 껍질 없이 발효시킨 맑고 산미 있는 와인.' },
            { name: '스파클링 와인', description: '발효 과정에서 생기는 탄산가스를 날려 보내지 않고 병 안에 가둬 기포를 지닌 와인. (샴페인, 까바 등)' },
            { name: '로제 와인', description: '적포도로 레드 와인과 같이 침용 과정을 거치다가 색이 선홍빛으로 우러나면 껍질을 제거해 만든 가벼운 와인.' }
        ],
        flavorTags: [
            { label: '붉은 과실(체리/베리)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
            { label: '청과실(사과/복숭아)', color: 'bg-green-400/20 text-green-300 border-green-400/30' },
            { label: '타닌(떫음)/오크', color: 'bg-stone-600/20 text-stone-400 border-stone-600/30' },
            { label: '플로럴/미네랄', color: 'bg-sky-400/20 text-sky-300 border-sky-400/30' }
        ],
        production: "포도 수확 → 줄기 제거 및 파쇄 → 발효(레드는 껍질 포함, 화이트는 즙만) → 숙성(오크통 또는 스테인리스/시멘트) → 병입 (품종과 제조법에 따라 천차만별)",
        howToEnjoy: [
            "글라스 음미: 품종과 종류(레드, 화이트, 샴페인)에 맞는 형태의 와인잔을 선택",
            "온도 조절: 레드는 16~18도의 서늘한 실온, 화이트와 로제는 8~12도로 칠링하여 마시기",
            "스월링(Swirling): 잔을 가볍게 돌려 와인이 산소와 접촉하게 한 뒤 피어오르는 다채로운 향 즐기기"
        ],
        foodPairing: ["레드: 소/양고기 스테이크, 진한 풍미의 치즈", "화이트: 굴, 가리비 등 해산물 요리, 흰살 생선", "로제/스파클링: 가당한 핑거푸드, 과일 샐러드, 식전주"],
        dbCategories: ['wine', 'red_wine', 'white_wine']
    }
}
