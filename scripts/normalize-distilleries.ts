import * as fs from 'fs';
import * as path from 'path';

/**
 * Advanced Distillery Normalization Script
 * 
 * Normalizes distillery names by:
 * 1. Trimming whitespace
 * 2. Standardizing abbreviations
 * 3. Removing common suffixes
 * 4. Case-insensitive deduplication
 * 5. Sorting alphabetically
 */

const METADATA_PATH = path.join(process.cwd(), 'lib', 'constants', 'spirits-metadata.json');

// Abbreviation mappings (expand to full form)
const ABBREVIATIONS: Record<string, string> = {
    'Dist\\.': 'Distillery',
    'Distilleries': 'Distillery',
    'Co\\.': 'Company',
    'Corp\\.': 'Corporation',
    'Ltd\\.': 'Limited',
    'Inc\\.': 'Incorporated',
    'Mfg\\.': 'Manufacturing',
    'Bros\\.': 'Brothers',
    'Brg\\.': 'Brewing',
    'Brewery': 'Brewing',
    'Breweries': 'Brewing',
    '&': 'and',
};

// Suffixes to remove (case-insensitive, at end of string)
const SUFFIXES_TO_REMOVE = [
    'Distillery',
    'Distilleries',
    'Brewing',
    'Brewery',
    'Company',
    'Corporation',
    'Limited',
    'Incorporated',
    'LLC',
    'LTD',
    'Inc',
    'Co',
];

function normalizeDistilleryName(name: string): string {
    let normalized = name.trim();

    // Step 1: Expand abbreviations
    Object.entries(ABBREVIATIONS).forEach(([abbr, full]) => {
        const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
        normalized = normalized.replace(regex, full);
    });

    // Step 2: Remove trailing suffixes
    SUFFIXES_TO_REMOVE.forEach(suffix => {
        // Remove if it's at the end, possibly with punctuation
        const regex = new RegExp(`\\s+${suffix}\\s*[,.]?$`, 'i');
        normalized = normalized.replace(regex, '');
    });

    // Step 3: Clean up extra spaces and punctuation
    normalized = normalized
        .replace(/\s+/g, ' ')  // Multiple spaces to single
        .replace(/\s*,\s*/g, ', ')  // Normalize commas
        .replace(/\s*&\s*/g, ' and ')  // Normalize &
        .trim();

    // Step 4: Remove trailing commas or periods
    normalized = normalized.replace(/[,.]$/, '');

    return normalized;
}

function advancedNormalization() {
    console.log('📖 Reading spirits-metadata.json...');

    const rawData = fs.readFileSync(METADATA_PATH, 'utf-8');
    const metadata = JSON.parse(rawData);

    const originalDistilleries: string[] = metadata.distilleries || [];
    console.log(`\n📊 Original count: ${originalDistilleries.length} distilleries\n`);

    // Track transformations for reporting
    const transformations: Array<{ original: string, normalized: string }> = [];

    // Normalize all names
    const normalized = originalDistilleries.map(original => {
        const norm = normalizeDistilleryName(original);
        if (norm !== original) {
            transformations.push({ original, normalized: norm });
        }
        return norm;
    });

    console.log(`✨ Applied normalization rules to ${transformations.length} names\n`);

    // Show examples of transformations
    console.log('📋 Example transformations:');
    transformations.slice(0, 20).forEach(({ original, normalized }) => {
        console.log(`   "${original}" → "${normalized}"`);
    });
    if (transformations.length > 20) {
        console.log(`   ... and ${transformations.length - 20} more transformations`);
    }
    console.log();

    // Case-insensitive deduplication
    const distilleryMap = new Map<string, string>();

    normalized.forEach(distillery => {
        const lowerKey = distillery.toLowerCase();

        if (!distilleryMap.has(lowerKey)) {
            distilleryMap.set(lowerKey, distillery);
        } else {
            // Keep the version with more uppercase letters (likely official name)
            const existing = distilleryMap.get(lowerKey)!;
            const existingUpper = (existing.match(/[A-Z]/g) || []).length;
            const newUpper = (distillery.match(/[A-Z]/g) || []).length;

            if (newUpper > existingUpper) {
                distilleryMap.set(lowerKey, distillery);
            }
        }
    });

    const deduped = Array.from(distilleryMap.values());
    const duplicatesRemoved = normalized.length - deduped.length;

    console.log(`🔍 After deduplication: ${deduped.length} unique distilleries`);
    console.log(`   Removed ${duplicatesRemoved} duplicates\n`);

    // Sort alphabetically (case-insensitive)
    const sorted = deduped.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    // Save back to metadata
    metadata.distilleries = sorted;

    const updatedJson = JSON.stringify(metadata, null, 2);
    fs.writeFileSync(METADATA_PATH, updatedJson, 'utf-8');

    console.log('✅ Advanced normalization complete!');
    console.log(`\n📈 Summary:`);
    console.log(`   Original entries: ${originalDistilleries.length}`);
    console.log(`   After normalization: ${normalized.length}`);
    console.log(`   After deduplication: ${sorted.length}`);
    console.log(`   Total reduction: ${originalDistilleries.length - sorted.length} entries (${((1 - sorted.length / originalDistilleries.length) * 100).toFixed(1)}%)`);
    console.log(`\n💾 Saved to: ${METADATA_PATH}`);
}

// Run
try {
    advancedNormalization();
} catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
}
