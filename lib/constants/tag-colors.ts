export type TagColorVariant = 'amber' | 'orange' | 'red' | 'pink' | 'purple' | 'blue' | 'cyan' | 'teal' | 'green' | 'lime' | 'yellow' | 'stone' | 'slate';

export const TAG_COLOR_MAPPING: Record<string, TagColorVariant> = {
    // Nose - 과일
    '과일_시트러스': 'amber',
    '과일_베리_열대과일': 'pink',
    '과일_말린_조린': 'orange',

    // Nose - 꽃 & 허브
    '꽃': 'purple',
    '허브_식물_채소': 'green',

    // Nose - 향신료 & 달콤함
    '향신료': 'red',
    '달콤함_과자_유제품': 'yellow',

    // Nose - 견과 & 우디
    '고소함_곡물_로스팅': 'stone',
    '우디_흙_산화': 'stone',

    // Nose - 기타
    '스모크_피트_미네랄_해안': 'slate',
    '화학적_결함': 'slate',

    // Palate
    '단맛_산미': 'lime',
    '바디_질감': 'blue',
    '입안촉감_구조': 'cyan',
    '발효_감칠맛': 'teal',

    // Finish
    '길이': 'blue',
    '성질': 'purple',
};

export const TAG_COLORS: Record<TagColorVariant, { bg: string, text: string, border: string, hex: string }> = {
    amber: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-700', hex: '#f59e0b' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-700', hex: '#f97316' },
    red: { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-700', hex: '#ef4444' },
    pink: { bg: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-700', hex: '#ec4899' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-700', hex: '#a855f7' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700', hex: '#3b82f6' },
    cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-700', hex: '#06b6d4' },
    teal: { bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-700', hex: '#14b8a6' },
    green: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-700', hex: '#22c55e' },
    lime: { bg: 'bg-lime-100 dark:bg-lime-900/40', text: 'text-lime-700 dark:text-lime-300', border: 'border-lime-200 dark:border-lime-700', hex: '#84cc16' },
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-700', hex: '#eab308' },
    stone: { bg: 'bg-stone-100 dark:bg-stone-800', text: 'text-stone-700 dark:text-stone-300', border: 'border-stone-200 dark:border-stone-600', hex: '#78716c' },
    slate: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-600', hex: '#64748b' },
};

/**
 * Identify the appropriate color for a given tag by matching it against known categories.
 * This function essentially mimics the classification in spirits-metadata.json
 */
export function getTagColor(tag: string): { bg: string, text: string, border: string, hex: string } {
    const normalizedTag = tag.toLowerCase();

    // Default fallback
    let variant: TagColorVariant = 'stone';

    // Simple heuristic matching based on keywords in tag
    if (normalizedTag.match(/레몬|라임|자몽|귤|오렌지|복숭아|사과|배|자두|멜론|포도/)) variant = 'amber';
    else if (normalizedTag.match(/딸기|베리|체리|파인애플|망고|리치|바나나/)) variant = 'pink';
    else if (normalizedTag.match(/건포도|무화과|대추|잼|마멀레이드/)) variant = 'orange';
    else if (normalizedTag.match(/아카시아|들꽃|장미|제비꽃|라벤더|국화|꽃|플로랄/)) variant = 'purple';
    else if (normalizedTag.match(/민트|허브|솔잎|풀|고수|채소|올리브/)) variant = 'green';
    else if (normalizedTag.match(/시나몬|후추|고추|생강|스파이시/)) variant = 'red';
    else if (normalizedTag.match(/카라멜|꿀|시럽|초콜릿|크림|버터|바닐라/)) variant = 'yellow';
    else if (normalizedTag.match(/보리|곡물|빵|견과|커피|구운|탄향/)) variant = 'stone';
    else if (normalizedTag.match(/오크|나무|가죽|담배|흙|버섯/)) variant = 'stone';
    else if (normalizedTag.match(/스모키|피트|해초|소금|돌/)) variant = 'slate';
    else if (normalizedTag.match(/화학|고무|약품/)) variant = 'slate';
    else if (normalizedTag.match(/드라이|산미|새콤/)) variant = 'lime';
    else if (normalizedTag.match(/바디|오일리|실키/)) variant = 'blue';
    else if (normalizedTag.match(/탄산|청량|미네랄/)) variant = 'cyan';
    else if (normalizedTag.match(/발효|치즈|간장/)) variant = 'teal';
    else if (normalizedTag.match(/여운|깔끔|피니시/)) variant = 'blue';

    return TAG_COLORS[variant];
}
