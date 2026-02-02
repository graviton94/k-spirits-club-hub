import { Spirit } from '../db/schema';

const REGION_MAP: Record<string, string> = {
    'USA': '미국', 'U.S.A.': '미국', 'America': '미국', 'United States': '미국',
    'South Korea': '대한민국', 'Republic of Korea': '대한민국', 'Korea': '대한민국',
    'Scotland': '스코틀랜드', 'United Kingdom': '영국', 'UK': '영국',
    'Japan': '일본', 'Nippon': '일본', 'Ireland': '아일랜드', 'France': '프랑스',
    'Deutschland': '독일', 'Germany': '독일', 'India': '인도', 'Taiwan': '대만',
    'Australia': '호주', 'Canada': '캐나다',
    'Speyside': '스페이사이드', 'Highland': '하이랜드', 'Lowland': '로우랜드',
    'Islay': '아일라', 'Campbeltown': '캠벨타운', 'Islands': '아일랜드(Islands)',
};

const DISTILLERY_TO_REGION: Record<string, string> = {
    'Macallan': '스페이사이드', 'Balvenie': '스페이사이드', 'Glenfiddich': '스페이사이드',
    'Glenlivet': '스페이사이드', 'Ardbeg': '아일라', 'Laphroaig': '아일라',
    'Lagavulin': '아일라', 'Bowmore': '아일라', 'Glenmorangie': '하이랜드',
    'Dalmore': '하이랜드', 'Talisker': '아일랜드(Islands)', 'Highland Park': '아일랜드(Islands)',
    'Springbank': '캠벨타운', 'Jack Daniel\'s': '테네시', 'Jim Beam': '켄터키',
    'Yamazaki': '일본(야마나시)', 'Hakushu': '일본(야마나시)', 'Kavalan': '이란'
};

const DISTILLERY_MAP: Record<string, string> = {
    'THE MACALLAN DISTILLERS LTD': 'Macallan',
    'THE GLENMORANGIE COMPANY LTD': 'Glenmorangie',
    'THE BALVENIE DISTILLERY COMPANY LIMITED': 'Balvenie',
    'JACK DANIEL DISTILLERY': 'Jack Daniel\'s',
    'JIM BEAM BRANDS CO': 'Jim Beam',
    'KAVALAN DISTILLERY': 'Kavalan',
};

export function normalizeSpiritData(spirit: Partial<Spirit>): Partial<Spirit> {
    const changes: Partial<Spirit> = {};
    let isChanged = false;

    // 1. Distillery Name Inference
    let currentDistillery = spirit.distillery;
    if (spirit.name) {
        const nameLower = spirit.name.toLowerCase();
        const mappings: Record<string, string> = {
            'ardbeg': 'Ardbeg', '아드벡': 'Ardbeg',
            'laphroaig': 'Laphroaig', '라프로익': 'Laphroaig',
            'macallan': 'Macallan', '맥캘란': 'Macallan',
            'balvenie': 'Balvenie', '발베니': 'Balvenie',
            'springbank': 'Springbank', '스프링뱅크': 'Springbank',
            'hwayo': 'Hwayo', '화요': 'Hwayo',
        };

        for (const [key, val] of Object.entries(mappings)) {
            if (nameLower.includes(key)) {
                if (currentDistillery !== val) {
                    changes.distillery = val;
                    currentDistillery = val;
                    isChanged = true;
                }
                break;
            }
        }
    }

    // 2. Corporate Mapping
    if (!changes.distillery && spirit.distillery) {
        for (const [key, val] of Object.entries(DISTILLERY_MAP)) {
            if (spirit.distillery === key || spirit.distillery.startsWith(key)) {
                changes.distillery = val;
                currentDistillery = val;
                isChanged = true;
                break;
            }
        }
    }

    // 3. Region Inference
    if (currentDistillery && DISTILLERY_TO_REGION[currentDistillery]) {
        const targetRegion = DISTILLERY_TO_REGION[currentDistillery];
        if (spirit.region !== targetRegion) {
            changes.region = targetRegion;
            isChanged = true;
        }
    } else if (spirit.region && REGION_MAP[spirit.region]) {
        if (spirit.region !== REGION_MAP[spirit.region]) {
            changes.region = REGION_MAP[spirit.region];
            isChanged = true;
        }
    }

    // 4. Subcategory Standardizing
    if (spirit.subcategory) {
        if (spirit.subcategory.includes('(') && spirit.subcategory.includes(')')) {
            changes.subcategory = spirit.subcategory.replace(/\s*\(.*?\)\s*/g, '').trim();
            isChanged = true;
        }
    }

    return isChanged ? changes : {};
}
