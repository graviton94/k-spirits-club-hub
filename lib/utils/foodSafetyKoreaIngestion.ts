/**
 * Data ingestion utility for Food Safety Korea API
 * 
 * This utility fetches liquor data from the Korean Food Safety Authority's open API
 * and transforms it into the K-Spirits Club database schema.
 * 
 * API Documentation: https://www.foodsafetykorea.go.kr/api/
 */

import type { Spirit } from '../db/schema';

interface FoodSafetyKoreaRecord {
  PRDLST_NM: string;        // Product name
  BSSH_NM: string;          // Business/Manufacturer name
  PRDT_SHAP_CD_NM: string;  // Product type
  POG_DAYCNT: string;       // Alcohol content (ABV)
  HIENG_LNTRT_DVS_NM: string; // High concentration division
  // Add more fields as needed
}

export class FoodSafetyKoreaIngestion {
  private apiKey: string;
  private baseUrl = 'https://openapi.foodsafetykorea.go.kr/api';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Fetch liquor records from Food Safety Korea API
   * @param startIdx Start index for pagination
   * @param endIdx End index for pagination
   */
  async fetchRecords(startIdx: number = 1, endIdx: number = 1000): Promise<FoodSafetyKoreaRecord[]> {
    const endpoint = `${this.baseUrl}/${this.apiKey}/C005/json/${startIdx}/${endIdx}`;
    
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.C005?.row) {
        return data.C005.row;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching from Food Safety Korea API:', error);
      return [];
    }
  }

  /**
   * Transform Food Safety Korea record to Spirit schema
   */
  transformRecord(record: FoodSafetyKoreaRecord): Partial<Spirit> {
    // Extract ABV from string (e.g., "40%" -> 40)
    const abv = parseFloat(record.POG_DAYCNT?.replace('%', '') || '0');

    return {
      name: record.PRDLST_NM || 'Unknown',
      distillery: record.BSSH_NM || 'Unknown',
      bottler: null,
      abv: abv || 0,
      volume: null, // Not provided in API
      category: this.categorizeSpirit(record.PRDT_SHAP_CD_NM),
      subcategory: record.PRDT_SHAP_CD_NM || null,
      country: 'South Korea',
      region: null,
      imageUrl: null,
      thumbnailUrl: null,
      source: 'food_safety_korea',
      externalId: `fsk-${record.PRDLST_NM}`, // Use product name as ID
      isPublished: false,
      isReviewed: false,
      reviewedBy: null,
      reviewedAt: null,
    };
  }

  /**
   * Categorize spirit based on Korean product type
   */
  private categorizeSpirit(productType: string): string {
    const type = productType?.toLowerCase() || '';
    
    if (type.includes('소주') || type.includes('soju')) return 'soju';
    if (type.includes('막걸리') || type.includes('makgeolli')) return 'makgeolli';
    if (type.includes('위스키') || type.includes('whisky') || type.includes('whiskey')) return 'whisky';
    if (type.includes('보드카') || type.includes('vodka')) return 'vodka';
    if (type.includes('진') || type.includes('gin')) return 'gin';
    if (type.includes('럼') || type.includes('rum')) return 'rum';
    if (type.includes('브랜디') || type.includes('brandy')) return 'brandy';
    if (type.includes('맥주') || type.includes('beer')) return 'beer';
    if (type.includes('와인') || type.includes('wine')) return 'wine';
    if (type.includes('청주') || type.includes('sake')) return 'sake';
    
    return 'other';
  }

  /**
   * Batch import spirits from Food Safety Korea
   */
  async batchImport(batchSize: number = 1000, maxRecords: number = 10000): Promise<{
    imported: number;
    failed: number;
    errors: string[];
  }> {
    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 1; i <= maxRecords; i += batchSize) {
      try {
        const records = await this.fetchRecords(i, Math.min(i + batchSize - 1, maxRecords));
        
        for (const record of records) {
          try {
            const spirit = this.transformRecord(record);
            // In production, save to database here
            // await db.createSpirit(spirit);
            imported++;
          } catch (error) {
            failed++;
            errors.push(`Failed to import record: ${error}`);
          }
        }

        // Rate limiting - wait 1 second between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        errors.push(`Failed to fetch batch ${i}-${i + batchSize}: ${error}`);
      }
    }

    return { imported, failed, errors };
  }
}

// Usage example:
// const ingestion = new FoodSafetyKoreaIngestion(process.env.FOOD_SAFETY_KOREA_API_KEY);
// const result = await ingestion.batchImport(1000, 100000);
