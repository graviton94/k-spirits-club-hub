import { NextRequest, NextResponse } from 'next/server';
import { spiritsDb } from '@/lib/db/firestore-rest';
import { Spirit } from '@/lib/db/schema';

export const runtime = 'edge';

// Mappings for Normalization - CORRECTED to preserve Granularity
const REGION_MAP: Record<string, string> = {
    // Countries & Broad Regions
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

    // Scotland regions
    'Speyside': '스페이사이드',
    'Highland': '하이랜드',
    'Lowland': '로우랜드',
    'Islay': '아일라',
    'Isle of Islay': '아일라',
    'Campbeltown': '캠벨타운',
    'Islands': '아일랜드(Islands)',

    // USA states
    'Kentucky': '켄터키',
    'Tennessee': '테네시',
    'Texas': '텍사스',
    'New York': '뉴욕',
    'California': '캘리포니아',

    // France regions
    'Cognac': '꼬냑',
    'Champagne': '샹파뉴',
    'Brittany': '브르타뉴',

    // Germany regions
    'Bavaria': '바이에른',

    // Taiwan regions
    'Yilan': '이란',
    'Nantou': '난터우',
};

const DISTILLERY_TO_REGION: Record<string, string> = {
    // Speyside
    'Macallan': '스페이사이드',
    'Balvenie': '스페이사이드',
    'Glenfiddich': '스페이사이드',
    'Glenjdich': '스페이사이드',
    'Glenlivet': '스페이사이드',
    'Aberlour': '스페이사이드',
    'Glenfarclas': '스페이사이드',
    'Mortlach': '스페이사이드',
    'Benriach': '스페이사이드',
    'Glentauchers': '스페이사이드',
    'Glenburgie': '스페이사이드',
    'Longmorn': '스페이사이드',
    'Craigellachie': '스페이사이드',

    // Islay
    'Ardbeg': '아일라',
    'Laphroaig': '아일라',
    'Lagavulin': '아일라',
    'Bowmore': '아일라',
    'Bruichladdich': '아일라',
    'Bunnahabhain': '아일라',
    'Caol Ila': '아일라',
    'Kilchoman': '아일라',
    'Port Charlotte': '아일라',
    'Octomore': '아일라',

    // Highland
    'Glenmorangie': '하이랜드',
    'Dalmore': '하이랜드',
    'Oban': '하이랜드',
    'Glendronach': '하이랜드',
    'Aberfeldy': '하이랜드',
    'Dalwhinnie': '하이랜드',
    'Clynelish': '하이랜드',
    'Old Pulteney': '하이랜드',
    'Royal Salute': '스페이사이드',

    // Islands
    'Talisker': '아일랜드(Islands)',
    'Highland Park': '아일랜드(Islands)',
    'Jura': '아일랜드(Islands)',
    'Arran': '아일랜드(Islands)',
    'Tobermory': '아일랜드(Islands)',
    'Ledaig': '아일랜드(Islands)',
    'Scapa': '아일랜드(Islands)',

    // Campbeltown
    'Springbank': '캠벨타운',
    'Glen Scotia': '캠벨타운',
    'Kilkerran': '캠벨타운',
    'Longrow': '캠벨타운',

    // Lowland
    'Auchentoshan': '로우랜드',
    'Glenkinchie': '로우랜드',
    'Bladnoch': '로우랜드',
    'Littlemill': '로우랜드',

    // USA
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

    // Japan
    'Yamazaki': '일본(야마나시)',
    'Hakushu': '일본(야마나시)',
    'Yoichi': '일본(홋카이도)',
    'Miyagikyo': '일본(미야기)',
    'Chichibu': '일본(시가)',
    'Fuji Gotemba': '일본(시즈오카)',
    'Kanosuke': '일본(가고시마)',

    // Ireland (New Enriched)
    'Jameson': '아일랜드',
    'Bushmills': '북아일랜드',
    'Redbreast': '아일랜드',
    'Teeling': '더블린',
    'Middleton': '코크',
    'Tullamore Dew': '오펄리',

    // Taiwan (New Enriched)
    'Kavalan': '이란',
    'Omar': '난터우',

    // India (New Enriched)
    'Amrut': '벵갈루루',
    'Paul John': '고아',
    'Indri': '하리아나',

    // France (New Enriched)
    'Armorik': '브르타뉴',
    'Kornog': '브르타뉴',

    // Korea
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
    'Pils': '필스너',
    'IPA (인디아 페일 에일)': 'IPA',
    'Indian Pale Ale': 'IPA',
    'Stout': '스타우트',
    'Pale Ale': '페일 에일',
    'Lager': '라거',
    'Ale': '에일',
    'Single Malt Scotch Whisky': '싱글몰트',
    'Blended Scotch Whisky': '블렌디드',
    'Bourbon': '버번',
    'Rye': '라이',
    'Vodka': '보드카',
    'Gin': '진',
    'Rum': '럼',
    'Tequila': '데킬라',
    '프룻 비어': '프룻비어',
};

export async function GET(req: NextRequest) {
    try {
        // 1. Fetch All Spirits
        const spirits = await spiritsDb.getAll({});
        const total = spirits.length;
        console.log(`[Normalize] Process started for ${total} spirits`);

        let updatedCount = 0;
        const updates: Promise<void>[] = [];
        const logs: string[] = [];

        // 2. Iterate and Normalize
        for (const spirit of spirits) {
            let isChanged = false;
            const changes: Partial<Spirit> = {};

            // --- Distillery Normalization & Inference ---
            let currentDistillery = spirit.distillery;

            // 0. Name-based Inference (Fixes Corporate Owner Ambiguity)
            // e.g. "Ardbeg Uigeadail" has owner "Glenmorangie Co", but should be distillery "Ardbeg"
            // 0. Name-based Inference (Fixes Corporate Owner Ambiguity & Korean Regional Recovery)
            if (spirit.name) {
                const nameLower = spirit.name.toLowerCase();

                // International Spirits
                if (nameLower.includes('ardbeg') || nameLower.includes('아드벡')) {
                    currentDistillery = 'Ardbeg';
                    changes.distillery = 'Ardbeg';
                    isChanged = true;
                } else if (nameLower.includes('laphroaig') || nameLower.includes('라프로익')) {
                    currentDistillery = 'Laphroaig';
                    changes.distillery = 'Laphroaig';
                    isChanged = true;
                } else if (nameLower.includes('lagavulin') || nameLower.includes('라가불린')) {
                    currentDistillery = 'Lagavulin';
                    changes.distillery = 'Lagavulin';
                    isChanged = true;
                } else if (nameLower.includes('macallan') || nameLower.includes('맥캘란')) {
                    currentDistillery = 'Macallan';
                    changes.distillery = 'Macallan';
                    isChanged = true;
                } else if (nameLower.includes('springbank') || nameLower.includes('스프링뱅크')) {
                    currentDistillery = 'Springbank';
                    changes.distillery = 'Springbank';
                    isChanged = true;
                }

                // Korean Spirits Recovery
                else if (nameLower.includes('hwayo') || nameLower.includes('화요')) {
                    currentDistillery = 'Hwayo';
                    changes.region = '여주'; // Force Region
                    isChanged = true;
                }
                else if (nameLower.includes('andong') || nameLower.includes('안동')) {
                    changes.region = '안동'; // Force Region
                    isChanged = true;
                }
                else if (nameLower.includes('won soju') || nameLower.includes('원소주')) {
                    changes.region = '원주'; // Force Region
                    isChanged = true;
                }
                else if (nameLower.includes('damyang') || nameLower.includes('담양')) {
                    changes.region = '담양'; // Force Region
                    isChanged = true;
                }
                else if (nameLower.includes('jeju') || nameLower.includes('제주') || nameLower.includes('hallasan') || nameLower.includes('한라산')) {
                    changes.region = '제주'; // Force Region
                    isChanged = true;
                }
                else if (nameLower.includes('sunyang') || nameLower.includes('선양')) {
                    changes.region = '대전'; // Force Region
                    isChanged = true;
                }
                else if (nameLower.includes('muhak') || nameLower.includes('무학') || nameLower.includes('goodday') || nameLower.includes('좋은데이')) {
                    changes.region = '경남'; // Force Region
                    isChanged = true;
                }
            }

            // 1. Corporate Mapping (Only if not already inferred by name)
            if (!changes.distillery && spirit.distillery) {
                // Exact or StartsWith Logic for Corporate Names
                for (const [key, value] of Object.entries(DISTILLERY_MAP)) {
                    if (spirit.distillery === key || spirit.distillery.startsWith(key)) {
                        changes.distillery = value;
                        currentDistillery = value; // Update for region check
                        isChanged = true;
                        break;
                    }
                }
            }

            // --- Region Normalization & RECOVERY ---
            let region = spirit.region;

            // 1. Recover Logic: If Distillery is known, FORCE specific region
            if (currentDistillery && DISTILLERY_TO_REGION[currentDistillery]) {
                const targetRegion = DISTILLERY_TO_REGION[currentDistillery];
                // Apply if current region is different (e.g. 'Scotland' vs 'Speyside')
                // OR if current region is missing
                if (region !== targetRegion) {
                    changes.region = targetRegion;
                    isChanged = true;
                }
            }
            // 2. Standard Mapping (Only if no recovery happened or to fix spelling)
            else if (region && REGION_MAP[region]) {
                if (region !== REGION_MAP[region]) {
                    changes.region = REGION_MAP[region];
                    isChanged = true;
                }
            }
            // 3. Spelling Fixes (Contains logic - CAREFUL here to not verify 'Scotland' -> 'UK' if user hates it)
            else if (region) {
                // Remove the "Includes Scotland" logic that flattened data
                // Only fix obvious ones
                if (region.includes('USA') && !region.includes(',')) {
                    // Only if it's JUST 'USA' or weirdly formatted. 
                    // If it is 'Kentucky, USA', we want to keep it or map to '켄터키'
                    // logic below handles the "clean up" but preserve granularity?
                }
            }

            // --- Subcategory Normalization ---
            if (spirit.subcategory) {
                const sub = spirit.subcategory;
                if (SUBCATEGORY_MAP[sub]) {
                    changes.subcategory = SUBCATEGORY_MAP[sub];
                    isChanged = true;
                }
                // Parentheses removal (e.g. "IPA (India Pale Ale)")
                else if (sub.includes('(') && sub.includes(')')) {
                    changes.subcategory = sub.replace(/\s*\(.*?\)\s*/g, '').trim();
                    isChanged = true;
                }
            }

            // 3. Queue Update
            if (isChanged && spirit.id) {
                updates.push(spiritsDb.upsert(spirit.id, changes));
                updatedCount++;
                logs.push(`Updated [${spirit.name}]: ${JSON.stringify(changes)}`);

                // Batch execution limiter (simple await every 50)
                if (updates.length >= 50) {
                    await Promise.all(updates);
                    updates.length = 0; // Clear array
                }
            }
        }

        // Final flush
        if (updates.length > 0) {
            await Promise.all(updates);
        }

        return NextResponse.json({
            success: true,
            totalProcessed: total,
            updatedCount: updatedCount,
            logs: logs.slice(0, 100) // Return first 100 logs to avoid huge response
        });

    } catch (error: any) {
        console.error('[Normalize] Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
