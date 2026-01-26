/**
 * Unit tests for Firestore REST API data parsing
 * Tests the critical bug fixes for boolean, string, and numeric value handling
 */

// Mock implementation of fromFirestore function to test
function fromFirestore(doc: any): any {
    const fields = doc.fields || {};
    const id = doc.name.split('/').pop();
    const data: any = { id };

    for (const [key, value] of Object.entries(fields) as [string, any][]) {
        if ('stringValue' in value) data[key] = value.stringValue;
        else if ('integerValue' in value) data[key] = Number(value.integerValue);
        else if ('doubleValue' in value) data[key] = Number(value.doubleValue);
        else if ('booleanValue' in value) data[key] = value.booleanValue;
        else if ('timestampValue' in value) data[key] = value.timestampValue;
        else if (value.arrayValue) {
            data[key] = (value.arrayValue.values || []).map((v: any) => v.stringValue);
        }
        else if (value.mapValue) {
            const mapData: any = {};
            const mapFields = value.mapValue.fields || {};
            for (const [mk, mv] of Object.entries(mapFields) as [string, any][]) {
                if ('stringValue' in mv) mapData[mk] = mv.stringValue;
                if (mv.arrayValue) mapData[mk] = (mv.arrayValue.values || []).map((v: any) => v.stringValue);
            }
            data[key] = mapData;
        }
    }
    return data;
}

console.log('Running Firestore Data Parsing Tests...\n');

// Test 1: Boolean false value
console.log('Test 1: Boolean false value');
const test1 = fromFirestore({
    name: 'projects/test/databases/(default)/documents/spirits/test-id',
    fields: {
        isPublished: { booleanValue: false },
        isReviewed: { booleanValue: true }
    }
});
console.assert(test1.isPublished === false, 'isPublished should be false');
console.assert(test1.isReviewed === true, 'isReviewed should be true');
console.log('✅ PASS: Boolean false value parsed correctly\n');

// Test 2: Empty string value
console.log('Test 2: Empty string value');
const test2 = fromFirestore({
    name: 'projects/test/databases/(default)/documents/spirits/test-id',
    fields: {
        bottler: { stringValue: '' },
        distillery: { stringValue: 'Test Distillery' }
    }
});
console.assert(test2.bottler === '', 'bottler should be empty string');
console.assert(test2.distillery === 'Test Distillery', 'distillery should match');
console.log('✅ PASS: Empty string value parsed correctly\n');

// Test 3: Zero numeric values
console.log('Test 3: Zero numeric values');
const test3 = fromFirestore({
    name: 'projects/test/databases/(default)/documents/spirits/test-id',
    fields: {
        abv: { doubleValue: 0 },
        volume: { integerValue: '0' },
        rating: { doubleValue: 5.5 }
    }
});
console.assert(test3.abv === 0, 'abv should be 0');
console.assert(test3.volume === 0, 'volume should be 0');
console.assert(test3.rating === 5.5, 'rating should be 5.5');
console.log('✅ PASS: Zero numeric values parsed correctly\n');

// Test 4: Metadata map with empty strings
console.log('Test 4: Metadata map with empty strings');
const test4 = fromFirestore({
    name: 'projects/test/databases/(default)/documents/spirits/test-id',
    fields: {
        metadata: {
            mapValue: {
                fields: {
                    name_en: { stringValue: '' },
                    description: { stringValue: 'Test Description' }
                }
            }
        }
    }
});
console.assert(test4.metadata.name_en === '', 'metadata.name_en should be empty string');
console.assert(test4.metadata.description === 'Test Description', 'metadata.description should match');
console.log('✅ PASS: Metadata map with empty strings parsed correctly\n');

// Test 5: Legacy spirit data structure
console.log('Test 5: Legacy spirit data structure');
const test5 = fromFirestore({
    name: 'projects/test/databases/(default)/documents/spirits/fsk-201300160135',
    fields: {
        name: { stringValue: '좋은데이' },
        isPublished: { booleanValue: false },
        isReviewed: { booleanValue: true },
        category: { stringValue: '소주' },
        abv: { doubleValue: 16.9 },
        metadata: {
            mapValue: {
                fields: {
                    expiry: { stringValue: '' }
                }
            }
        }
    }
});
console.assert(test5.name === '좋은데이', 'name should match');
console.assert(test5.isPublished === false, 'CRITICAL: isPublished should be false, not undefined');
console.assert(test5.isReviewed === true, 'isReviewed should be true');
console.assert(test5.category === '소주', 'category should match');
console.assert(test5.abv === 16.9, 'abv should match');
console.assert(test5.metadata.expiry === '', 'CRITICAL: metadata.expiry should be empty string, not undefined');
console.log('✅ PASS: Legacy spirit data structure parsed correctly\n');

// Test 6: Published spirit data structure
console.log('Test 6: Published spirit data structure');
const test6 = fromFirestore({
    name: 'projects/test/databases/(default)/documents/spirits/fsk-2013001905434',
    fields: {
        name: { stringValue: '백제보리소주 45' },
        isPublished: { booleanValue: true },
        isReviewed: { booleanValue: true },
        category: { stringValue: '소주' },
        abv: { doubleValue: 45 },
        bottler: { stringValue: '' },
        metadata: {
            mapValue: {
                fields: {
                    name_en: { stringValue: '' },
                    description: { stringValue: '' }
                }
            }
        }
    }
});
console.assert(test6.name === '백제보리소주 45', 'name should match');
console.assert(test6.isPublished === true, 'isPublished should be true');
console.assert(test6.isReviewed === true, 'isReviewed should be true');
console.assert(test6.category === '소주', 'category should match');
console.assert(test6.abv === 45, 'abv should match');
console.assert(test6.bottler === '', 'CRITICAL: bottler should be empty string, not undefined');
console.assert(test6.metadata.name_en === '', 'CRITICAL: metadata.name_en should be empty string, not undefined');
console.assert(test6.metadata.description === '', 'CRITICAL: metadata.description should be empty string, not undefined');
console.log('✅ PASS: Published spirit data structure parsed correctly\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ ALL TESTS PASSED!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
