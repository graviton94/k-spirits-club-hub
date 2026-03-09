/**
 * Unit tests for localize-field utility
 * Tests locale-aware localization of country names, categories, and data sources
 */

import { localizeCountry, localizeCategory, localizeDataSource } from '../localize-field';

describe('localizeCountry', () => {
    describe('EN locale', () => {
        it('maps Korean 일본 to Japan', () => {
            expect(localizeCountry('일본', 'en')).toBe('Japan');
        });

        it('maps abbreviated MFDS code 일 to Japan', () => {
            expect(localizeCountry('일', 'en')).toBe('Japan');
        });

        it('maps Korean 대한민국 to South Korea', () => {
            expect(localizeCountry('대한민국', 'en')).toBe('South Korea');
        });

        it('maps Korean 미국 to United States', () => {
            expect(localizeCountry('미국', 'en')).toBe('United States');
        });

        it('maps Korean 영국 to United Kingdom', () => {
            expect(localizeCountry('영국', 'en')).toBe('United Kingdom');
        });

        it('passes through already-English country names', () => {
            expect(localizeCountry('Scotland', 'en')).toBe('Scotland');
        });

        it('returns empty string for null input', () => {
            expect(localizeCountry(null, 'en')).toBe('');
        });

        it('returns empty string for empty string input', () => {
            expect(localizeCountry('', 'en')).toBe('');
        });
    });

    describe('KO locale', () => {
        it('returns Korean 일본 as-is', () => {
            expect(localizeCountry('일본', 'ko')).toBe('일본');
        });

        it('maps English Japan to 일본', () => {
            expect(localizeCountry('Japan', 'ko')).toBe('일본');
        });

        it('maps English South Korea to 대한민국', () => {
            expect(localizeCountry('South Korea', 'ko')).toBe('대한민국');
        });

        it('returns empty string for null input', () => {
            expect(localizeCountry(null, 'ko')).toBe('');
        });
    });
});

describe('localizeCategory', () => {
    describe('EN locale', () => {
        it('maps 청주 to Cheongju', () => {
            expect(localizeCategory('청주', 'en')).toBe('Cheongju');
        });

        it('maps 위스키 to Whisky', () => {
            expect(localizeCategory('위스키', 'en')).toBe('Whisky');
        });

        it('maps 싱글 몰트 스카치 위스키 to Single Malt Scotch Whisky', () => {
            expect(localizeCategory('싱글 몰트 스카치 위스키', 'en')).toBe('Single Malt Scotch Whisky');
        });

        it('maps 보통주 to Ordinary Sake', () => {
            expect(localizeCategory('보통주', 'en')).toBe('Ordinary Sake');
        });

        it('maps 희석식 소주 to Diluted Soju', () => {
            expect(localizeCategory('희석식 소주', 'en')).toBe('Diluted Soju');
        });

        it('falls back to original value for unmapped keys', () => {
            expect(localizeCategory('UnknownType', 'en')).toBe('UnknownType');
        });

        it('returns empty string for empty input', () => {
            expect(localizeCategory('', 'en')).toBe('');
        });

        it('returns empty string for null input', () => {
            expect(localizeCategory(null as any, 'en')).toBe('');
        });

        it('returns empty string for undefined input', () => {
            expect(localizeCategory(undefined as any, 'en')).toBe('');
        });
    });

    describe('KO locale', () => {
        it('returns Korean 청주 as-is', () => {
            expect(localizeCategory('청주', 'ko')).toBe('청주');
        });

        it('falls back to original value for unmapped keys', () => {
            expect(localizeCategory('UnknownType', 'ko')).toBe('UnknownType');
        });
    });
});

describe('localizeDataSource', () => {
    const fallbackManual = 'Manual Entry';
    const fallbackExternal = 'External Data';

    describe('EN locale', () => {
        it('localizes food_safety_korea source', () => {
            expect(localizeDataSource('food_safety_korea', 'en', fallbackManual, fallbackExternal))
                .toBe('Ministry of Food and Drug Safety (Public Data)');
        });

        it('localizes imported_food_maru source', () => {
            expect(localizeDataSource('imported_food_maru', 'en', fallbackManual, fallbackExternal))
                .toBe('Import Food Information Maru');
        });

        it('localizes manual source', () => {
            expect(localizeDataSource('manual', 'en', fallbackManual, fallbackExternal))
                .toBe('Manual Entry');
        });

        it('uses fallback for unknown sources', () => {
            expect(localizeDataSource('other', 'en', fallbackManual, fallbackExternal))
                .toBe('External Data');
        });
    });

    describe('KO locale', () => {
        it('returns Korean source label for food_safety_korea', () => {
            expect(localizeDataSource('food_safety_korea', 'ko', '운영진 수동 등록', '기타 외부 데이터'))
                .toBe('식품의약품안전처 (공공데이터)');
        });

        it('returns Korean source label for imported_food_maru', () => {
            expect(localizeDataSource('imported_food_maru', 'ko', '운영진 수동 등록', '기타 외부 데이터'))
                .toBe('수입식품정보마루');
        });
    });
});
