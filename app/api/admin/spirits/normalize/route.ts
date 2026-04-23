import { NextRequest, NextResponse } from 'next/server';
import { dbAdminListRawSpirits, dbUpsertSpirit } from '@/lib/db/data-connect-client';

export const runtime = 'edge';

// Mappings for Normalization - Preserved from legacy
const REGION_MAP: Record<string, string> = {
    'USA': '미국',
    'U.S.A.': '미국',
    'America': '미국',
    'United States': '미국',
    'South Korea': '대한민국',
    'Republic of Korea': '대한민국',
    'Korea': '대한민국',
    'Scotland': '스코틀랜드',
    'United Kingdom': '영국',
    'UK': '영국',
    'Japan': '일본',
    'Nippon': '일본',
    'Ireland': '아일랜드',
    'France': '프랑스',
    'Deutschland': '독일',
    'Germany': '독일',
    'India': '인도',
    'Taiwan': '대만',
    'Australia': '호주',
    'Canada': '캐나다',
    'Speyside': '스페이사이드',
    'Highland': '하이랜드',
    'Lowland': '로우랜드',
    'Islay': '아일라',
    'Isle of Islay': '아일라',
    'Campbeltown': '캠벨타운',
    'Islands': '아일랜드(Islands)',
    'Kentucky': '켄터키',
    'Tennessee': '테네시',
    'Texas': '텍사스',
    'New York': '뉴욕',
    'California': '캘리포니아',
    'Cognac': '꼬냑',
    'Champagne': '샹파뉴',
    'Brittany': '브르타뉴',
    'Bavaria': '바이에른',
    'Yilan': '이란',
    'Nantou': '난터우',
};

const DISTILLERY_TO_REGION: Record<string, string> = {
    'Macallan': '스페이사이드',
    'Balvenie': '스페이사이드',
    'Glenfiddich': '스페이사이드',
    'Glenlivet': '스페이사이드',
    'Ardbeg': '아일라',
    'Laphroaig': '아일라',
    'Lagavulin': '아일라',
    'Bowmore': '아일라',
    'Bruichladdich': '아일라',
    'Bunnahabhain': '아일라',
    'Caol Ila': '아일라',
    'Kilchoman': '아일라',
    'Glenmorangie': '하이랜드',
    'Dalmore': '하이랜드',
    'Oban': '하이랜드',
    'Glendronach': '하이랜드',
    'Aberfeldy': '하이랜드',
    'Dalwhinnie': '하이랜드',
    'Clynelish': '하이랜드',
    'Old Pulteney': '하이랜드',
    'Talisker': '아일랜드(Islands)',
    'Highland Park': '아일랜드(Islands)',
    'Jura': '아일랜드(Islands)',
    'Arran': '아일랜드(Islands)',
    'Tobermory': '아일랜드(Islands)',
    'Ledaig': '아일랜드(Islands)',
    'Scapa': '아일랜드(Islands)',
    'Springbank': '캠벨타운',
    'Glen Scotia': '캠벨타운',
    'Kilkerran': '캠벨타운',
    'Longrow': '캠벨타운',
    'Auchentoshan': '로우랜드',
    'Glenkinchie': '로우랜드',
    'Bladnoch': '로우랜드',
    'Littlemill': '로우랜드',
    'Jack Daniel\'s': '테네시',
    'George Dickel': '테네시',
    'Jim Beam': '켄터키',
    'Maker\'s Mark': '켄터키',
    'Wild Turkey': '켄터키',
    'Buffalo Trace': '켄터키',
    'Woodford Reserve': '켄터키',
    'Knob Creek': '켄터키',
    'Bulleit': '켄터키',
    'Garrison Brothers': '텍사스',
    'Hudson Whiskey': '뉴욕',
    'St. George Spirits': '캘리포니아',
    'Yamazaki': '일본(야마나시)',
    'Hakushu': '일본(야마나시)',
    'Yoichi': '일본(홋카이도)',
    'Miyagikyo': '일본(미야기)',
    'Chichibu': '일본(시가)',
    'Fuji Gotemba': '일본(시즈오카)',
    'Kanosuke': '일본(가고시마)',
    'Jameson': '아일랜드',
    'Bushmills': '북아일랜드',
    'Redbreast': '아일랜드',
    'Teeling': '더블린',
    'Red': '이란', 
    'Kavalan': '이란',
    'Omar': '난터우',
    'Amrut': '벵갈루루',
    'Paul John': '고아',
    'Indri': '하리아나',
    'Armorik': '브르타뉴',
    'Kornog': '브르타뉴',
    'Ki One': '경기도 남양주시',
    'Ki-One': '경기도 남양주시',
    'Three Societies': '경기도 남양주시',
    'Hwayo': '경기도 이천시',
    'Andong': '경상북도 안동시',
    'Won Soju': '경기도 원주시',
    'Damyang': '전라남도 담양군',
    'Jeju': '제주특별시',
    'Sunyang': '대전광역시',
    'Muhak': '경상남도 창원시'
};

const DISTILLERY_MAP: Record<string, string> = {
    'THE MACALLAN DISTILLERS LTD': 'Macallan',
    'THE GLENMORANGIE COMPANY LTD': 'Glenmorangie',
    'THE BALVENIE DISTILLERY COMPANY LIMITED': 'Balvenie',
    'WILLIAM GRANT & SONS IRISH BRANDS LIMITED': 'William Grant & Sons',
    'CHIVAS BROTHERS LIMITED': 'Chivas Brothers',
    'DIAGEO SCOTLAND LIMITED': 'Diageo',
    'PERNOD RICARD': 'Pernod Ricard',
    'JAMESON': 'Jameson',
    'JACK DANIEL DISTILLERY': 'Jack Daniel\'s',
    'JIM BEAM BRANDS CO': 'Jim Beam',
    'KAVALAN DISTILLERY': 'Kavalan',
    'AMRUT DISTILLERIES PVT LTD': 'Amrut',
};

const SUBCATEGORY_MAP: Record<string, string> = {
    'Weizen': '헤페바이젠',
    'Hefeweizen': '헤페바이젠',
    'Pilsner': '필스너',
    'IPA': 'IPA',
    'Stout': '스타우트',
    'Pale Ale': '페일 에일',
    'Lager': '라거',
    'Single Malt Scotch Whisky': '싱글몰트',
    'Blended Scotch Whisky': '블렌디드',
    'Bourbon': '버번',
};

export async function GET(req: NextRequest) {
    try {
        console.log(`[Normalize] SQL Process started`);

        const LIMIT = 500;
        let offset = 0;
        let totalProcessed = 0;
        let updatedCount = 0;
        const logs: string[] = [];

        while (true) {
            const rawSpirits = await dbAdminListRawSpirits({ limit: LIMIT, offset });
            if (!rawSpirits || rawSpirits.length === 0) break;

            for (const spirit of rawSpirits as any[]) {
                totalProcessed++;
                let isChanged = false;
                const changes: any = {};

                let currentDistillery = spirit.distillery;

                // 1. Name-based Inference
                if (spirit.name) {
                    const nameLower = spirit.name.toLowerCase();
                    if (nameLower.includes('ardbeg') || nameLower.includes('아드벡')) {
                        currentDistillery = 'Ardbeg';
                        changes.distillery = 'Ardbeg';
                        isChanged = true;
                    } else if (nameLower.includes('laphroaig') || nameLower.includes('라프로익')) {
                        currentDistillery = 'Laphroaig';
                        changes.distillery = 'Laphroaig';
                        isChanged = true;
                    } else if (nameLower.includes('macallan') || nameLower.includes('맥캘란')) {
                        currentDistillery = 'Macallan';
                        changes.distillery = 'Macallan';
                        isChanged = true;
                    } else if (nameLower.includes('hwayo') || nameLower.includes('화요')) {
                        currentDistillery = 'Hwayo';
                        changes.region = '경기도 이천시';
                        isChanged = true;
                    }
                }

                // 2. Corporate Mapping
                if (!changes.distillery && spirit.distillery) {
                    for (const [key, value] of Object.entries(DISTILLERY_MAP)) {
                        if (spirit.distillery === key || spirit.distillery.startsWith(key)) {
                            changes.distillery = value;
                            currentDistillery = value;
                            isChanged = true;
                            break;
                        }
                    }
                }

                // 3. Region Normalization
                let region = spirit.region;
                if (currentDistillery && DISTILLERY_TO_REGION[currentDistillery]) {
                    const targetRegion = DISTILLERY_TO_REGION[currentDistillery];
                    if (region !== targetRegion) {
                        changes.region = targetRegion;
                        isChanged = true;
                    }
                } else if (region && REGION_MAP[region]) {
                    if (region !== REGION_MAP[region]) {
                        changes.region = REGION_MAP[region];
                        isChanged = true;
                    }
                }

                // 4. Subcategory Normalization
                if (spirit.subcategory) {
                    if (SUBCATEGORY_MAP[spirit.subcategory]) {
                        changes.subcategory = SUBCATEGORY_MAP[spirit.subcategory];
                        isChanged = true;
                    } else if (spirit.subcategory.includes('(')) {
                        changes.subcategory = spirit.subcategory.replace(/\s*\(.*?\)\s*/g, '').trim();
                        isChanged = true;
                    }
                }

                if (isChanged) {
                    await dbUpsertSpirit({
                        id: spirit.id,
                        ...changes
                    });
                    updatedCount++;
                    if (logs.length < 50) {
                        logs.push(`Updated [${spirit.name}]: ${JSON.stringify(changes)}`);
                    }
                }
            }

            offset += LIMIT;
            if (rawSpirits.length < LIMIT) break;
            // Early break for safety in edge runtime (avoid timeout)
            if (totalProcessed > 2000) break; 
        }

        return NextResponse.json({
            success: true,
            totalProcessed,
            updatedCount,
            logs
        });

    } catch (error: any) {
        console.error('[Normalize] Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
