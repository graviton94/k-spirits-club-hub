// scripts/analyze_published_data.ts
/**
 * Published 데이터 분석 스크립트
 * 목적: 제조국, 지역, 증류소, 병입자 필드의 정규화 패턴 분석
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });
dotenv.config();

// Firebase Admin 초기화
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

initializeApp({
    credential: cert(serviceAccount as any),
});

const db = getFirestore();

interface Spirit {
    id: string;
    name: string;
    category: string;
    subcategory?: string;
    country?: string;
    region?: string;
    distillery?: string;
    bottler?: string;
    abv?: number;
    metadata?: {
        importer?: string;
        [key: string]: any;
    };
}

interface AnalysisResult {
    totalSpirits: number;
    countries: Map<string, number>;
    regions: Map<string, number>;
    distilleries: Map<string, number>;
    bottlers: Map<string, number>;
    importers: Map<string, number>;
    issues: {
        missingCountry: number;
        missingDistillery: number;
        suspectedImporterAsDistillery: string[];
        inconsistentRegions: { country: string; regions: string[] }[];
        unusualABV: { id: string; name: string; abv: number }[];
    };
}

// 수출입사 키워드 패턴
const IMPORTER_KEYWORDS = [
    '수입', '수출', 'import', 'export', '무역', 'trading',
    '디스트리뷰션', 'distribution', '코리아', 'korea',
    '인터내셔널', 'international', '글로벌', 'global',
    '주식회사', '(주)', 'co.,', 'ltd', 'inc'
];

async function analyzePublishedData(): Promise<AnalysisResult> {
    console.log('🔍 Fetching published spirits from Firestore...');

    const spiritsRef = db.collection('spirits');
    const snapshot = await spiritsRef.where('isPublished', '==', true).get();

    const result: AnalysisResult = {
        totalSpirits: snapshot.size,
        countries: new Map(),
        regions: new Map(),
        distilleries: new Map(),
        bottlers: new Map(),
        importers: new Map(),
        issues: {
            missingCountry: 0,
            missingDistillery: 0,
            suspectedImporterAsDistillery: [],
            inconsistentRegions: [],
            unusualABV: [],
        },
    };

    console.log(`📊 Analyzing ${result.totalSpirits} spirits...`);

    const regionsByCountry = new Map<string, Set<string>>();

    snapshot.forEach((doc) => {
        const data = doc.data() as Spirit;
        const spirit: Spirit = {
            id: doc.id,
            name: data.name,
            category: data.category,
            subcategory: data.subcategory,
            country: data.country,
            region: data.region,
            distillery: data.distillery,
            bottler: data.bottler,
            abv: data.abv,
            metadata: data.metadata,
        };

        // 제조국 집계
        if (spirit.country) {
            result.countries.set(
                spirit.country,
                (result.countries.get(spirit.country) || 0) + 1
            );

            // 제조국별 지역 집계
            if (spirit.region) {
                if (!regionsByCountry.has(spirit.country)) {
                    regionsByCountry.set(spirit.country, new Set());
                }
                regionsByCountry.get(spirit.country)!.add(spirit.region);
            }
        } else {
            result.issues.missingCountry++;
        }

        // 지역 집계
        if (spirit.region) {
            result.regions.set(
                spirit.region,
                (result.regions.get(spirit.region) || 0) + 1
            );
        }

        // 증류소/제조사 집계
        if (spirit.distillery) {
            result.distilleries.set(
                spirit.distillery,
                (result.distilleries.get(spirit.distillery) || 0) + 1
            );

            // 수출입사로 의심되는 케이스 체크
            const distilleryLower = spirit.distillery.toLowerCase();
            if (IMPORTER_KEYWORDS.some(keyword => distilleryLower.includes(keyword))) {
                result.issues.suspectedImporterAsDistillery.push(
                    `${spirit.id}: ${spirit.name} (distillery: ${spirit.distillery})`
                );
            }
        } else {
            result.issues.missingDistillery++;
        }

        // 병입자 집계
        if (spirit.bottler) {
            result.bottlers.set(
                spirit.bottler,
                (result.bottlers.get(spirit.bottler) || 0) + 1
            );
        }

        // 수입사 집계 (metadata)
        if (spirit.metadata?.importer) {
            result.importers.set(
                spirit.metadata.importer,
                (result.importers.get(spirit.metadata.importer) || 0) + 1
            );
        }

        // ABV 이상치 체크
        if (spirit.abv !== undefined) {
            if (spirit.abv > 100 || spirit.abv < 0) {
                result.issues.unusualABV.push({
                    id: spirit.id,
                    name: spirit.name,
                    abv: spirit.abv,
                });
            }
        }
    });

    // 제조국별 지역 불일치 체크
    regionsByCountry.forEach((regions, country) => {
        if (regions.size > 0) {
            result.issues.inconsistentRegions.push({
                country,
                regions: Array.from(regions).sort(),
            });
        }
    });

    return result;
}

function generateReport(result: AnalysisResult) {
    console.log('\n' + '='.repeat(80));
    console.log('📊 Published Data Analysis Report');
    console.log('='.repeat(80));

    console.log(`\n📈 총 발행된 제품 수: ${result.totalSpirits.toLocaleString()}`);

    // 제조국 통계
    console.log(`\n🌍 제조국 통계 (Top 20):`);
    const sortedCountries = Array.from(result.countries.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
    sortedCountries.forEach(([country, count], index) => {
        const percentage = ((count / result.totalSpirits) * 100).toFixed(1);
        console.log(`  ${index + 1}. ${country}: ${count} (${percentage}%)`);
    });

    // 지역 통계
    console.log(`\n🗺️  지역 통계 (Top 30):`);
    const sortedRegions = Array.from(result.regions.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30);
    sortedRegions.forEach(([region, count], index) => {
        console.log(`  ${index + 1}. ${region}: ${count}`);
    });

    // 증류소/제조사 통계
    console.log(`\n🏭 주요 증류소/제조사 (Top 50):`);
    const sortedDistilleries = Array.from(result.distilleries.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50);
    sortedDistilleries.forEach(([distillery, count], index) => {
        console.log(`  ${index + 1}. ${distillery}: ${count}`);
    });

    // 병입자 통계
    console.log(`\n🍾 병입자 통계 (Top 20):`);
    const sortedBottlers = Array.from(result.bottlers.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
    sortedBottlers.forEach(([bottler, count], index) => {
        console.log(`  ${index + 1}. ${bottler}: ${count}`);
    });

    // 이슈 리포트
    console.log(`\n⚠️  데이터 품질 이슈:`);
    console.log(`  - 제조국 누락: ${result.issues.missingCountry}`);
    console.log(`  - 증류소 누락: ${result.issues.missingDistillery}`);
    console.log(`  - 수출입사로 의심되는 증류소: ${result.issues.suspectedImporterAsDistillery.length}`);
    console.log(`  - 비정상 ABV: ${result.issues.unusualABV.length}`);

    if (result.issues.suspectedImporterAsDistillery.length > 0) {
        console.log(`\n🚨 수출입사로 의심되는 케이스 (최대 50개):`);
        result.issues.suspectedImporterAsDistillery.slice(0, 50).forEach((issue) => {
            console.log(`  - ${issue}`);
        });
    }

    if (result.issues.unusualABV.length > 0) {
        console.log(`\n🚨 비정상 ABV:`);
        result.issues.unusualABV.forEach((issue) => {
            console.log(`  - ${issue.id}: ${issue.name} (ABV: ${issue.abv})`);
        });
    }

    // 제조국별 지역
    console.log(`\n🗺️  제조국별 지역 분포:`);
    result.issues.inconsistentRegions
        .sort((a, b) => b.regions.length - a.regions.length)
        .slice(0, 10)
        .forEach(({ country, regions }) => {
            console.log(`  ${country} (${regions.length}개): ${regions.join(', ')}`);
        });

    console.log('\n' + '='.repeat(80));
}

function saveToFile(result: AnalysisResult) {
    const reportPath = 'data/analysis_report.json';

    const report = {
        timestamp: new Date().toISOString(),
        totalSpirits: result.totalSpirits,
        countries: Object.fromEntries(
            Array.from(result.countries.entries()).sort((a, b) => b[1] - a[1])
        ),
        regions: Object.fromEntries(
            Array.from(result.regions.entries()).sort((a, b) => b[1] - a[1])
        ),
        distilleries: Object.fromEntries(
            Array.from(result.distilleries.entries()).sort((a, b) => b[1] - a[1])
        ),
        bottlers: Object.fromEntries(
            Array.from(result.bottlers.entries()).sort((a, b) => b[1] - a[1])
        ),
        importers: Object.fromEntries(
            Array.from(result.importers.entries()).sort((a, b) => b[1] - a[1])
        ),
        issues: {
            missingCountry: result.issues.missingCountry,
            missingDistillery: result.issues.missingDistillery,
            suspectedImporterAsDistillery: result.issues.suspectedImporterAsDistillery,
            inconsistentRegions: result.issues.inconsistentRegions,
            unusualABV: result.issues.unusualABV,
        },
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved to: ${reportPath}`);
}

async function main() {
    try {
        const result = await analyzePublishedData();
        generateReport(result);
        saveToFile(result);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main();
