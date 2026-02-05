export type MBTI_TYPE =
    | 'ENFJ' | 'ENFP' | 'ENTJ' | 'ENTP'
    | 'ESFJ' | 'ESFP' | 'ESTJ' | 'ESTP'
    | 'INFJ' | 'INFP' | 'INTJ' | 'INTP'
    | 'ISFJ' | 'ISFP' | 'ISTJ' | 'ISTP';

export type MbtiDimension = 'EI' | 'SN' | 'TF' | 'JP';

export interface Question {
    id: number;
    dimension: MbtiDimension;
    question_ko: string;
    question_en: string;
    imagePath?: string;
    answers: [
        { text_ko: string; text_en: string; value: string },
        { text_ko: string; text_en: string; value: string }
    ];
}

export interface MBTIResult {
    type: MBTI_TYPE;
    title_ko: string;
    title_en: string;
    description_ko: string;
    description_en: string;
    imagePath: string;
    compatible: MBTI_TYPE[];
    incompatible: MBTI_TYPE[];
    tastingNotes_ko: string[];
    tastingNotes_en: string[];
}

// 🎯 총 12문항 (지표별 3개)
export const MBTI_QUESTIONS: Question[] = [
    // 1. E vs I (에너지 방향: 술자리 vs 혼술)
    {
        id: 1,
        dimension: 'EI',
        question_ko: "오랜만에 찾아온 불금!\n당신의 계획은?",
        question_en: "It's finally Friday night!\nWhat's your plan?",
        imagePath: "/MBTI/q1.webp",
        answers: [
            { text_ko: "친구들 다 불러!\n달려! 🔥", text_en: "Call everyone!\nLet's go! 🔥", value: 'E' },
            { text_ko: "집에서 혼술과\n넷플릭스 🎞️", text_en: "Drinks & Netflix\nat home 🏠", value: 'I' }
        ]
    },
    {
        id: 2,
        dimension: 'EI',
        question_ko: "바에서 혼술 중,\n옆 사람이 말을 건다면?",
        question_en: "Drinking alone at a bar.\nWhat if someone talks to you?",
        imagePath: "/MBTI/q2.webp",
        answers: [
            { text_ko: "오, 반가워요!\n같이 짠! 🍻", text_en: "Nice to meet you!\nCheers! 🍻", value: 'E' },
            { text_ko: "어색한 미소와\n대화 종료 📱", text_en: "Awkward smile..\nconversation ends 📱", value: 'I' }
        ]
    },
    {
        id: 3,
        dimension: 'EI',
        question_ko: "정적이 흐를 때\n나는 어떤 모습?",
        question_en: "When there's silence\nWhat do you do?",
        imagePath: "/MBTI/q3.webp",
        answers: [
            { text_ko: "정적은 못 참지!\n화제 투척 💬", text_en: "Can't stand silence!\nNew topic 💬", value: 'E' },
            { text_ko: "조용하게\n안주나 먹자.. 🥨", text_en: "Quiet snacks &\njust eat 🥨", value: 'I' }
        ]
    },

    // 2. S vs N (인식: 맛/현실 vs 분위기/상상)
    {
        id: 4,
        dimension: 'SN',
        question_ko: "새로운 술을 고를 때\n이게 포인트지!",
        question_en: "When choosing a new drink\nThis is the point!",
        imagePath: "/MBTI/q4.webp",
        answers: [
            { text_ko: "도수, 가격\n리뷰 체크 📊", text_en: "ABV, price\nand reviews 📊", value: 'S' },
            { text_ko: "디자인과 브랜드,\n갬성 🎨", text_en: "Design & brand,\nvibe 🎨", value: 'N' }
        ]
    },
    {
        id: 5,
        dimension: 'SN',
        question_ko: "친구가\n\"그 술 어때?\"라고 물어보면?",
        question_en: "When a friend asks\n'How's that drink?'",
        imagePath: "/MBTI/q5.webp",
        answers: [
            { text_ko: "오크 향에..\n쉐리 오크가.. 🌳", text_en: "Oaky aroma..\nSherry oak.. 🌳", value: 'S' },
            { text_ko: "가을 저녁..\n낙엽 밟는 느낌.. 🍂", text_en: "Autumn evening..\nfallen leaves.. 🍂", value: 'N' }
        ]
    },
    {
        id: 6,
        dimension: 'SN',
        question_ko: "안주를 고를 때\n당신의 스타일은?",
        question_en: "When picking side dishes\nWhat's your style?",
        imagePath: "/MBTI/q6.webp",
        answers: [
            { text_ko: "맛있고 푸짐한게\n최고 🍗", text_en: "Delicious & hearty\nis best 🍗", value: 'S' },
            { text_ko: "술과 완벽한\n페어링 중시 🍷", text_en: "Perfect pairing\nfor the vibe 🍷", value: 'N' }
        ]
    },

    // 3. T vs F (판단: 분석/팩트 vs 공감/관계)
    {
        id: 7,
        dimension: 'TF',
        question_ko: "술 마시는 중 친구의\n갑작스런 고민 상담",
        question_en: "A friend says, \"I feel down...\"\nYour response?",
        imagePath: "/MBTI/q7.webp",
        answers: [
            { text_ko: "무슨 일인데?\n원인 파악 🔍", text_en: "What happened?\nIdentifying cause 🔍", value: 'T' },
            { text_ko: "오늘은 털어놔,\n들어줄게 🫂", text_en: "Let it all out,\nI'm listening 🫂", value: 'F' }
        ]
    },
    {
        id: 8,
        dimension: 'TF',
        question_ko: "궁금했던 술\n완전 특이한 맛!",
        question_en: "You tried a new drink\nwith an exotic flavor!",
        imagePath: "/MBTI/q8.webp",
        answers: [
            { text_ko: "어우,\n먹던거 먹을래.. 🤢", text_en: "I'd rather have\nwhat I know.. 🤢", value: 'T' },
            { text_ko: "완전 신기해!\n좋은 경험 ✨", text_en: "It could be someone's\nfavorite! ✨", value: 'F' }
        ]
    },
    {
        id: 9,
        dimension: 'TF',
        question_ko: "취한 친구가 했던 말을\n반복.. 또 반복..",
        question_en: "If a drunk friend\nrepeats.. and repeats..",
        imagePath: "/MBTI/q9.webp",
        answers: [
            { text_ko: "이제 그만..\n택시 타자 🚕", text_en: "Let's stop..\nget a taxi 🚕", value: 'T' },
            { text_ko: "그랬구나~\n진짜 힘들었겠다 🥺", text_en: "I see..\nthat must be hard 🥺", value: 'F' }
        ]
    },

    // 4. J vs P (생활양식: 계획/통제 vs 즉흥/유동)
    {
        id: 10,
        dimension: 'JP',
        question_ko: "약속 장소를 정할 때\n나는 어떤 스타일?",
        question_en: "When deciding on a meeting place\nWhich style are you?",
        imagePath: "/MBTI/q10.webp",
        answers: [
            { text_ko: "예약 필수!\n핫플 조사! 📅", text_en: "Must reserve!\nResearch hot spots! 📅", value: 'J' },
            { text_ko: "일단 만나서\n발 닿는대로! 🏃", text_en: "Meet up and go\nwhere feet take me! 🏃", value: 'P' }
        ]
    },
    {
        id: 11,
        dimension: 'JP',
        question_ko: "술 마시는 도중\n새로운 친구가 합류한다면?",
        question_en: "A new friend\njoins mid-drinking?",
        imagePath: "/MBTI/q11.webp",
        answers: [
            { text_ko: "오.. 계산은\n어떻게 하지? 🤯", text_en: "Oh.. how do we split the bill? 🤯", value: 'J' },
            { text_ko: "오히려 좋아!\n일단 앉아! 🥳", text_en: "Oh, cool!\nSit down! 🥳", value: 'P' }
        ]
    },
    {
        id: 12,
        dimension: 'JP',
        question_ko: "한참 무르익을 때\n막차 시간이 코 앞이다!",
        question_en: "The last train is\njust around the corner!",
        imagePath: "/MBTI/q12.webp",
        answers: [
            { text_ko: "알람 맞춰놨지,\n다음에 봐! ⏰", text_en: "I set an alarm,\nsee you next time! ⏰", value: 'J' },
            { text_ko: "뭐? 막차 이미\n끊겼어?! 😱", text_en: "What? The last train is\nalready gone?! 😱", value: 'P' }
        ]
    }
];

export const MBTI_RESULTS: Record<MBTI_TYPE, MBTIResult> = {
    ENFJ: {
        type: 'ENFJ',
        title_ko: '모두의 생맥주 🍺',
        title_en: "Everyone's Draft Beer 🍺",
        description_ko: '어디서나 환영받는\n분위기 메이커! 시원한 건배사 담당!\n화합의 끝판왕이에요. ✨',
        description_en: 'The ultimate mood maker!\nYou bring everyone together\nwith refreshing energy. ✨',
        imagePath: '/MBTI/ENFJ.webp',
        compatible: ['INFP', 'ISFP'],
        incompatible: ['ISTP'],
        tastingNotes_ko: ['보리', '홉', '탄산'],
        tastingNotes_en: ['Barley', 'Hops', 'Carbonation']
    },
    ENFP: {
        type: 'ENFP',
        title_ko: '상큼한 레몬 사와 🍋',
        title_en: 'Zesty Lemon Sawa 🍋',
        description_ko: '존재 자체가 비타민!\n톡톡 튀는 매력.\n술자리 인싸는 나야! 🌈',
        description_en: 'A total human vitamin!\nYour bubbly charm makes you\nthe star of any party. 🌈',
        imagePath: '/MBTI/ENFP.webp',
        compatible: ['INFJ', 'INTJ'],
        incompatible: ['ISTJ'],
        tastingNotes_ko: ['레몬', '탄산', '상큼함'],
        tastingNotes_en: ['Lemon', 'Soda', 'Zesty']
    },
    ENTJ: {
        type: 'ENTJ',
        title_ko: '카리스마 꼬냑 🥃',
        title_en: 'Charismatic Cognac 🥃',
        description_ko: '부드러운 카리스마!\n분위기의 중심을 잡는\n듬직한 전략가군요. 👑',
        description_en: 'A powerful leader!\nYou lead the team with\ncharm and confidence. 👑',
        imagePath: '/MBTI/ENTJ.webp',
        compatible: ['INTP', 'INFP'],
        incompatible: ['ISFJ'],
        tastingNotes_ko: ['오크', '무화과', '건과일'],
        tastingNotes_en: ['Oak', 'Fig', 'Dried Fruit']
    },
    ENTP: {
        type: 'ENTP',
        title_ko: '예측불가 폭탄주 💣',
        title_en: 'Unpredictable Bomb-shot 💣',
        description_ko: '틀에 박힌 건 질색!\n새로움을 찾아 떠나는\n내가 바로 모험가! 🧪',
        description_en: 'A cheerful eccentric!\nYou are an experimental hipster\nwho rejects the ordinary. 🧪',
        imagePath: '/MBTI/ENTP.webp',
        compatible: ['INFJ', 'INTJ'],
        incompatible: ['ISFJ'],
        tastingNotes_ko: ['곡물', '알싸함', '유니크'],
        tastingNotes_en: ['Grain', 'Piquant', 'Unique']
    },
    ESFJ: {
        type: 'ESFJ',
        title_ko: '다정한 깔루아 밀크 ☕️',
        title_en: 'Sweet Kahlúa Milk ☕️',
        description_ko: '언제나 다정다감!\n달콤한 위로, 세심한 배려.\n모두의 마음을 녹여요. 🥰',
        description_en: 'The kind-hearted socialite!\nYou melt hearts with sweet comfort\nand caring vibes. 🥰',
        imagePath: '/MBTI/ESFJ.webp',
        compatible: ['ISFP', 'INFP'],
        incompatible: ['INTJ'],
        tastingNotes_ko: ['커피', '우유', '달콤함'],
        tastingNotes_en: ['Coffee', 'Milk', 'Sweet']
    },
    ESFP: {
        type: 'ESFP',
        title_ko: '팡 터지는 샴페인 🥂',
        title_en: 'Popping Champagne 🥂',
        description_ko: '당신이 나타나면\n그곳이 바로 파티장!\n오늘의 주인공은 바로 당신! 🎉',
        description_en: 'When you arrive, the party begins!\nA natural entertainer who keeps\nthe celebration going non-stop. 🎉',
        imagePath: '/MBTI/ESFP.webp',
        compatible: ['ISFJ', 'ISTJ'],
        incompatible: ['INTJ'],
        tastingNotes_ko: ['포도', '풍부한 기포', '화사함'],
        tastingNotes_en: ['Grape', 'Bubbly', 'Floral']
    },
    ESTJ: {
        type: 'ESTJ',
        title_ko: '엄근진 온더락 🧊',
        title_en: 'Serious On-the-Rocks 🧊',
        description_ko: '흐트러짐 없는 밸런스!\n신뢰감 있는 모습이\n당신의 진짜 매력이에요. ⚖️',
        description_en: "Perfection is your style!\nYour charm lies in being\nflawlessly balanced and reliable. ⚖️",
        imagePath: '/MBTI/ESTJ.webp',
        compatible: ['ISFP', 'ISTP'],
        incompatible: ['INFJ'],
        tastingNotes_ko: ['얼음', '묵직함', '깔끔함'],
        tastingNotes_en: ['Ice', 'Heavy', 'Clean']
    },
    ESTP: {
        type: 'ESTP',
        title_ko: '화끈한 데킬라 샷 ⚡',
        title_en: 'Bold Tequila Shot ⚡',
        description_ko: '내일은 없다! \n화끈한 원샷처럼\n거침없는 에너자이저! 🐎',
        description_en: "No tomorrow! You enjoy life\nlike a bold shot—unstoppable,\nenergetic, and ready for action. 🐎",
        imagePath: '/MBTI/ESTP.webp',
        compatible: ['ISFJ', 'ISTJ'],
        incompatible: ['INFJ'],
        tastingNotes_ko: ['아가베', '라임', '스파이시'],
        tastingNotes_en: ['Agave', 'Lime', 'Spicy']
    },
    INFJ: {
        type: 'INFJ',
        title_ko: '고독한 싱글몰트 🪵',
        title_en: 'Solitary Single Malt 🪵',
        description_ko: '신비로운 아우라의\n피트 위스키처럼\n복합적인 내면을 가졌군요. 🌌',
        description_en: 'An insightful soul with a mysterious aura.\nYour inner world is as deep and complex\nas a peaty malt. 🌌',
        imagePath: '/MBTI/INFJ.webp',
        compatible: ['ENFP', 'ENTP'],
        incompatible: ['ESTP'],
        tastingNotes_ko: ['피트', '훈연', '초콜릿'],
        tastingNotes_en: ['Peat', 'Smoky', 'Chocolate']
    },
    INFP: {
        type: 'INFP',
        title_ko: '달콤한 칵테일 🌸',
        title_en: 'Sweet Cocktail 🌸',
        description_ko: '몽글몽글한 게 좋아!\n평범한 한 잔에도 낭만적인\n의미를 담는 감성 장인 ☁️',
        description_en: "Soft vibes and fuzzy feelings!\nYou are an emotional artist who\npours meaning into every glass. ☁️",
        imagePath: '/MBTI/INFP.webp',
        compatible: ['ENFJ', 'ENTJ'],
        incompatible: ['ESTJ'],
        tastingNotes_ko: ['체리', '허브', '달콤함'],
        tastingNotes_en: ['Cherry', 'Herbs', 'Sweet']
    },
    INTJ: {
        type: 'INTJ',
        title_ko: '차가운 보드카 ❄️',
        title_en: 'Cold Vodka ❄️',
        description_ko: '감정 낭비 사절!\n투명하고 냉철한,\n전략가의 날카로움! 🏹',
        description_en: 'No emotional waste, only efficiency!\nA strategist with a transparent and sharp mind\nthat cuts to the chase. 🏹',
        imagePath: '/MBTI/INTJ.webp',
        compatible: ['ENFP', 'ENTP'],
        incompatible: ['ESFP'],
        tastingNotes_ko: ['투명함', '깔끔함', '강렬함'],
        tastingNotes_en: ['Clear', 'Clean', 'Strong']
    },
    INTP: {
        type: 'INTP',
        title_ko: '신비로운 압생트 🧪',
        title_en: 'Mysterious Absinthe 🧪',
        description_ko: '지식 탐구는 술잔에서도!\n신비로운 매력의\n힙스터가 바로 당신! 🧠',
        description_en: 'Knowledge seeking continues\nin your glass! A hipster who\nrejects the ordinary. 🧠',
        imagePath: '/MBTI/INTP.webp',
        compatible: ['ENTP', 'ENFJ'],
        incompatible: ['ESFJ'],
        tastingNotes_ko: ['보타니컬', '숲', '풀내음'],
        tastingNotes_en: ['Botanical', 'Forest', 'Herbal']
    },
    ISFJ: {
        type: 'ISFJ',
        title_ko: '포근한 뱅쇼 🧣',
        title_en: 'Cozy Vin Chaud 🧣',
        description_ko: '모두를 보듬어줘요.\n온기 가득 뱅쇼처럼 \n모두의 힐링 아이콘 🧡',
        description_en: 'A healing icon who silently comforts\nthose around with warmth,\nlike a cozy vin chaud. 🧡',
        imagePath: '/MBTI/ISFJ.webp',
        compatible: ['ESFP', 'ESTP'],
        incompatible: ['ENTJ'],
        tastingNotes_ko: ['시나몬', '와인', '오렌지'],
        tastingNotes_en: ['Cinnamon', 'Wine', 'Orange']
    },
    ISFP: {
        type: 'ISFP',
        title_ko: '감성 터지는 로제 와인 🎀',
        title_en: 'Soulful Rosé Wine 🎀',
        description_ko: '분위기와 맛, 예쁜 게 최고!\n감각에 충실하며\n지금을 즐기는 감성 와인 🎨',
        description_en: 'Vibes, flavor, and aesthetics rule!\nYou enjoy the beauty of life by staying\ntrue to your senses. 🎨',
        imagePath: '/MBTI/ISFP.webp',
        compatible: ['ENFJ', 'ESFJ'],
        incompatible: ['ENTJ'],
        tastingNotes_ko: ['딸기', '장미', '산뜻함'],
        tastingNotes_en: ['Strawberry', 'Rose', 'Bright']
    },
    ISTJ: {
        type: 'ISTJ',
        title_ko: '대쪽같은 전통주 🍶',
        title_en: 'Steadfast Traditional Spirit 🍶',
        description_ko: '유행은 가도\n근본은 남지!\n대쪽같은 전통 수호자! 🌲',
        description_en: 'Trends fade, but the roots remain!\nA steadfast guardian of heritage who\nprefers traditional classics. 🌲',
        imagePath: '/MBTI/ISTJ.webp',
        compatible: ['ESFP', 'ESTP'],
        incompatible: ['ENFP'],
        tastingNotes_ko: ['곡물', '누룩', '장인정신'],
        tastingNotes_en: ['Grain', 'Nuruk', 'Artisan']
    },
    ISTP: {
        type: 'ISTP',
        title_ko: '시크한 크래프트 비어 🛸',
        title_en: 'Chic Craft Beer 🛸',
        description_ko: '남들 신경 안 써!\n마이웨이 탐험가.\n내가 바로 진짜 힙스터! 🎸',
        description_en: "A 'my way' explorer with a cool filter!\nYou have a unique taste that stands out\nin any crowd. 🎸",
        imagePath: '/MBTI/ISTP.webp',
        compatible: ['ESTJ', 'ENTJ'],
        incompatible: ['ENFJ'],
        tastingNotes_ko: ['쌉싸름함', '청량함', '시원함'],
        tastingNotes_en: ['Bitter', 'Refresh', 'Cool']
    }
};
