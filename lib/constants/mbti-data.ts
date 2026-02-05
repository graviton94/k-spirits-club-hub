export type MBTI_TYPE =
    | 'ENFJ' | 'ENFP' | 'ENTJ' | 'ENTP'
    | 'ESFJ' | 'ESFP' | 'ESTJ' | 'ESTP'
    | 'INFJ' | 'INFP' | 'INTJ' | 'INTP'
    | 'ISFJ' | 'ISFP' | 'ISTJ' | 'ISTP';

export interface MBTIQuestion {
    id: number;
    question_ko: string;
    question_en: string;
    options: {
        text_ko: string;
        text_en: string;
        type: 'E' | 'I' | 'N' | 'S' | 'T' | 'F' | 'J' | 'P';
        score: number;
    }[];
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
    recommendedKeywords: string[]; // Still used for DB search (primarily Korean tags)
}

export const MBTI_QUESTIONS: MBTIQuestion[] = [
    {
        id: 1,
        question_ko: "주말 저녁, 당신의 기분을 좋게 하는 행동은?",
        question_en: "What makes you feel better on a weekend evening?",
        options: [
            { text_ko: "시끌벅적한 술자리에 합류한다", text_en: "Joining a lively drinking party", type: 'E', score: 1 },
            { text_ko: "조용한 바에서 혼술을 즐기거나 집에서 쉰다", text_en: "Enjoying a drink alone at a quiet bar or resting at home", type: 'I', score: 1 }
        ]
    },
    {
        id: 2,
        question_ko: "술을 고를 때 당신의 기준은?",
        question_en: "What is your criteria when choosing an alcoholic drink?",
        options: [
            { text_ko: "실패 없는 베스트셀러나 익숙한 것", text_en: "Proven bestsellers or something familiar", type: 'S', score: 1 },
            { text_ko: "새로운 한정판이나 독특한 스토리의 술", text_en: "New limited editions or drinks with unique stories", type: 'N', score: 1 }
        ]
    },
    {
        id: 3,
        question_ko: "술자리에서 누군가 고민을 털어놓는다면?",
        question_en: "If someone shares their worries at a drinking party?",
        options: [
            { text_ko: "상황을 분석하고 현실적인 조언을 건넨다", text_en: "Analyzing the situation and giving practical advice", type: 'T', score: 1 },
            { text_ko: "상대방의 마음에 깊이 공감해주며 함께 마셔준다", text_en: "Empathizing deeply and drinking together", type: 'F', score: 1 }
        ]
    },
    {
        id: 4,
        question_ko: "마실 술을 정하는 방식은?",
        question_en: "How do you decide what to drink?",
        options: [
            { text_ko: "미리 맛집과 술 리스트를 철저히 조사해둔다", text_en: "Thoroughly researching bars and drink lists in advance", type: 'J', score: 1 },
            { text_ko: "가게에 가서 메뉴판을 보고 끌리는 걸 고른다", text_en: "Going to the store and picking what looks good on the menu", type: 'P', score: 1 }
        ]
    },
    // Placeholder for extra questions
    ...Array.from({ length: 8 }).map((_, i) => ({
        id: i + 5,
        question_ko: `임시 질문 ${i + 5} (나중에 채워질 예정)`,
        question_en: `Placeholder Question ${i + 5} (To be filled later)`,
        options: [
            { text_ko: "선택지 A", text_en: "Option A", type: (['E', 'N', 'T', 'J'][i % 4] as any), score: 1 },
            { text_ko: "선택지 B", text_en: "Option B", type: (['I', 'S', 'F', 'P'][i % 4] as any), score: 1 }
        ]
    }))
];

export const MBTI_RESULTS: Record<MBTI_TYPE, MBTIResult> = {
    ENFJ: {
        type: 'ENFJ',
        title_ko: '모두의 생맥주 🍺',
        title_en: "Everyone's Draft Beer 🍺",
        description_ko: '어디서나 환영받는 분위기 메이커! 시원한 건배사로 모두를 하나로 묶어버리는 화합의 끝판왕이에요. ✨',
        description_en: 'The ultimate mood maker! You bring everyone together with a refreshing toast and amazing energy. ✨',
        imagePath: '/MBTI/ENFJ.webp',
        compatible: ['INFP', 'ISFP'],
        incompatible: ['ISTP'],
        recommendedKeywords: ['청량한', '부드러운', '대중적인']
    },
    ENFP: {
        type: 'ENFP',
        title_ko: '상큼한 레몬 사와 🍋',
        title_en: 'Zesty Lemon Sawa 🍋',
        description_ko: '존재 자체가 비타민! 톡톡 튀는 아이디어와 상큼한 매력으로 술자리 인싸 등극은 시간문제예요. 🌈',
        description_en: 'A total human vitamin! Your bubbly charm and wild ideas make you the star of any party. 🌈',
        imagePath: '/MBTI/ENFP.webp',
        compatible: ['INFJ', 'INTJ'],
        incompatible: ['ISTJ'],
        recommendedKeywords: ['탄산감', '과일향', '화사한']
    },
    ENTJ: {
        type: 'ENTJ',
        title_ko: '카리스마 꼬냑 🥃',
        title_en: 'Charismatic Cognac 🥃',
        description_ko: '부드러운 카리스마가 흐르는 리더! 단체 대표로 뒷풀이에서도 분위기의 중심을 잡아주는군요. 👑',
        description_en: 'A smooth yet powerful leader! You lead your team with charm and confidence. 👑',
        imagePath: '/MBTI/ENTJ.webp',
        compatible: ['INTP', 'INFP'],
        incompatible: ['ISFJ'],
        recommendedKeywords: ['묵직한', '깊은', '바디감있는']
    },
    ENTP: {
        type: 'ENTP',
        title_ko: '예측불가 폭탄주 💣',
        title_en: 'Unpredictable Bomb-shot 💣',
        description_ko: '틀에 박힌 건 딱 질색인 쾌활한 괴짜! 매번 새로운 조합을 찾아 떠나는 실험적인 힙스터 바텐더군요? 🧪',
        description_en: 'A cheerful eccentric who hates the ordinary! You are the experimental hipster bartender making new rules. 🧪',
        imagePath: '/MBTI/ENTP.webp',
        compatible: ['INFJ', 'INTJ'],
        incompatible: ['ISFJ'],
        recommendedKeywords: ['개성있는', '독특한', '산미있는']
    },
    ESFJ: {
        type: 'ESFJ',
        title_ko: '다정한 깔루아 밀크 🥛',
        title_en: 'Sweet Kahlúa Milk 🥛',
        description_ko: '어느 술자리에나 꼭 필요한 다정다감 끝판왕! 달콤한 위로와 세심한 배려로 모두의 마음을 녹여요. 🥰',
        description_en: 'The kind-hearted socialite everyone needs! You melt hearts with sweet comfort and caring vibes. 🥰',
        imagePath: '/MBTI/ESFJ.webp',
        compatible: ['ISFP', 'INFP'],
        incompatible: ['INTJ'],
        recommendedKeywords: ['달콤한', '부드러운', '친숙한']
    },
    ESFP: {
        type: 'ESFP',
        title_ko: '팡 터지는 샴페인 🥂',
        title_en: 'Popping Champagne 🥂',
        description_ko: '당신이 나타나면 그곳이 바로 파티장! 한순간도 지루할 틈 없는 화려한 축제의 주인공이에요. 🎉',
        description_en: 'When you arrive, the party begins! A natural entertainer who keeps the celebration going non-stop. 🎉',
        imagePath: '/MBTI/ESFP.webp',
        compatible: ['ISFJ', 'ISTJ'],
        incompatible: ['INTJ'],
        recommendedKeywords: ['탄산감', '트로피컬', '화사한']
    },
    ESTJ: {
        type: 'ESTJ',
        title_ko: '엄근진 온더락 🧊',
        title_en: 'Serious On-the-Rocks 🧊',
        description_ko: '재미없단 소리 들어도 괜찮아요, 정석이 최고니까! 흐트러짐 없는 완벽한 밸런스가 진짜 매력이에요. ⚖️',
        description_en: "It's okay to be serious—perfection is your style! Your charm lies in being flawlessly balanced and reliable. ⚖️",
        imagePath: '/MBTI/ESTJ.webp',
        compatible: ['ISFP', 'ISTP'],
        incompatible: ['INFJ'],
        recommendedKeywords: ['정통적인', '드라이한', '깔끔한']
    },
    ESTP: {
        type: 'ESTP',
        title_ko: '화끈한 데킬라 샷 ⚡',
        title_en: 'Bold Tequila Shot ⚡',
        description_ko: '내일은 없다! 화끈한 원샷처럼 거침없이 인생을 즐기는 당신은 에너제틱한 야생마입니다. 🐎',
        description_en: "No tomorrow! You enjoy life like a bold shot—unstoppable, energetic, and always ready for action. 🐎",
        imagePath: '/MBTI/ESTP.webp',
        compatible: ['ISFJ', 'ISTJ'],
        incompatible: ['INFJ'],
        recommendedKeywords: ['강렬한', '시원한', '깔끔한']
    },
    INFJ: {
        type: 'INFJ',
        title_ko: '고독한 싱글몰트 🕯️',
        title_en: 'Solitary Single Malt 🕯️',
        description_ko: '신비로운 아우라의 깊은 통찰가. 피스 위스키처럼 묵직하고 복합적인 내면을 가졌군요. 🌌',
        description_en: 'An insightful soul with a mysterious aura. Your inner world is as deep and complex as a peaty malt. 🌌',
        imagePath: '/MBTI/INFJ.webp',
        compatible: ['ENFP', 'ENTP'],
        incompatible: ['ESTP'],
        recommendedKeywords: ['피트', '나무향', '은은한']
    },
    INFP: {
        type: 'INFP',
        title_ko: '달콤한 칵테일 🌸',
        title_en: 'Sweet Cocktail 🌸',
        description_ko: '술도 분위기도 몽글몽글한 게 좋아! 평범한 한 잔에도 낭만적인 의미를 가득 담는 감성 장인이에요. ☁️',
        description_en: "Soft vibes and fuzzy feelings! You are an emotional artist who pours meaning into every glass. ☁️",
        imagePath: '/MBTI/INFP.webp',
        compatible: ['ENFJ', 'ENTJ'],
        incompatible: ['ESTJ'],
        recommendedKeywords: ['부드러운', '꽃향', '아로마틱한']
    },
    INTJ: {
        type: 'INTJ',
        title_ko: '차가운 보드카 ❄️',
        title_en: 'Cold Vodka ❄️',
        description_ko: '감정 낭비는 사절, 효율이 우선! 군더더기 없는 투명하고 날카로운 분석력이 돋보이는 전략가예요. 🏹',
        description_en: 'No emotional waste, only efficiency! A strategist with a transparent and sharp mind that cuts to the chase. 🏹',
        imagePath: '/MBTI/INTJ.webp',
        compatible: ['ENFP', 'ENTP'],
        incompatible: ['ESFP'],
        recommendedKeywords: ['깔끔한', '드라이한', '깊은']
    },
    INTP: {
        type: 'INTP',
        title_ko: '실험적인 진 & 압생트 🧪',
        title_en: 'Experimental Gin & Absinthe 🧪',
        description_ko: '지식 탐구는 술잔에서도 계속된다! 뻔한 건 거부하는 지적인 힙스터 주당이 바로 당신이군요. 🧠',
        description_en: 'Knowledge seeking continues even in your glass! A smart hipster who rejects the ordinary. 🧠',
        imagePath: '/MBTI/INTP.webp',
        compatible: ['ENTP', 'ENFJ'],
        incompatible: ['ESFJ'],
        recommendedKeywords: ['독특한', '산미있는', '개성있는']
    },
    ISFJ: {
        type: 'ISFJ',
        title_ko: '포근한 뱅쇼 🧣',
        title_en: 'Cozy Vin Chaud 🧣',
        description_ko: '남들 챙기느라 바쁜 모두의 조력자! 따뜻한 온기처럼 주변을 묵묵히 보듬어주는 힐링 아이콘입니다. 🧡',
        description_en: 'The helper busy taking care of everyone! A healing icon who silently comforts those around with warmth. 🧡',
        imagePath: '/MBTI/ISFJ.webp',
        compatible: ['ESFP', 'ESTP'],
        incompatible: ['ENTJ'],
        recommendedKeywords: ['은은한', '부드러운', '달콤한']
    },
    ISFP: {
        type: 'ISFP',
        title_ko: '감성 터지는 로제 와인 🎀',
        title_en: 'Soulful Rosé Wine 🎀',
        description_ko: '분위기와 맛, 그리고 예쁜 게 최고! 현재의 감각에 충실하며 인생의 아름다움을 즐길 줄 알아요. 🎨',
        description_en: 'Vibes, flavor, and aesthetics rule! You know how to enjoy the beauty of life by staying true to your senses. 🎨',
        imagePath: '/MBTI/ISFP.webp',
        compatible: ['ENFJ', 'ESFJ'],
        incompatible: ['ENTJ'],
        recommendedKeywords: ['화사한', '꽃향', '감각적인']
    },
    ISTJ: {
        type: 'ISTJ',
        title_ko: '대쪽같은 전통주 🍶',
        title_en: 'Steadfast Traditional Spirit 🍶',
        description_ko: '유행은 가도 근본은 남는다! 대쪽같이 우리 술을 수호하는 신중하고 듬직한 클래식 수호자예요. 🌲',
        description_en: 'Trends fade, but the roots remain! A steadfast guardian of heritage who prefers timeless classics. 🌲',
        imagePath: '/MBTI/ISTJ.webp',
        compatible: ['ESFP', 'ESTP'],
        incompatible: ['ENFP'],
        recommendedKeywords: ['정통적인', '구수한', '깊은']
    },
    ISTP: {
        type: 'ISTP',
        title_ko: '시크한 크래프트 비어 🛸',
        title_en: 'Chic Craft Beer 🛸',
        description_ko: '남들 신경 안 써! 혼자서도 잘 노는 마이웨이 탐험가. 당신만의 독특한 취향 필터가 아주 힙하네요. 🎸',
        description_en: "You don't care what others think! A 'my way' explorer with a cool filter and unique taste. 🎸",
        imagePath: '/MBTI/ISTP.webp',
        compatible: ['ESTJ', 'ENTJ'],
        incompatible: ['ENFJ'],
        recommendedKeywords: ['개성있는', '청량한', '시원한']
    }
};
