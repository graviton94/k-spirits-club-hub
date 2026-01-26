import { NextRequest, NextResponse } from 'next/server';
import { spiritsDb } from '@/lib/db/firestore-rest';
import { Spirit } from '@/lib/db/schema';

export const runtime = 'edge';

// Mappings for Normalization - CORRECTED to preserve Granularity
const REGION_MAP: Record<string, string> = {
    // Standardize Country Spellings only. DO NOT AGGREGATE REGIONS.
    'USA': '미국',
    'America': '미국',
    'United States': '미국',
    'South Korea': '대한민국',
    'Republic of Korea': '대한민국',
    'Korea': '대한민국',
    'Deutschland': '독일',
    'Germany': '독일',
    'Bavaria': '바이에른', // Keep specific
    'Speyside': '스페이사이드', // Keep specific
    'Highland': '하이랜드', // Keep specific
    'Lowland': '로우랜드', // Keep specific
    'Islay': '아일라', // Keep specific
    'Isle of Islay': '아일라', // Keep specific
    'Campbeltown': '캠벨타운', // Keep specific
    'Islands': '아일랜드(Islands)', // Keep specific (Island region of Scotland)
    'Cognac': '꼬냑',
    'Champagne': '샹파뉴',
};

// RECOVERY MAPPING: Restore Region from Distillery if it was wrongly flattened to '스코틀랜드'
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
    'Royal Salute': '스페이사이드', // Blend base, but often associated here or Speyside. Strategy: Keep widely accepted single malt origin or Blend origin. Royal Salute is blend, maybe '스코틀랜드' is okay, but user wants granularity.

    // Islands
    'Talisker': '아일랜드(Islands)', // Isle of Skye
    'Highland Park': '아일랜드(Islands)', // Orkney
    'Jura': '아일랜드(Islands)',
    'Arran': '아일랜드(Islands)',
    'Ledaig': '아일랜드(Islands)',

    // Campbeltown
    'Springbank': '캠벨타운',
    'Glen Scotia': '캠벨타운',
    'Kilkerran': '캠벨타운',

    // Lowland
    'Auchentoshan': '로우랜드',
    'Glenkinchie': '로우랜드',
    'Bladnoch': '로우랜드',

    // Tennessee (USA) - Restore state level
    'Jack Daniel\'s': '테네시',

    // Kentucky (USA) - Restore state level
    'Jim Beam': '켄터키',
    'Maker\'s Mark': '켄터키',
    'Wild Turkey': '켄터키',
    'Buffalo Trace': '켄터키',
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
