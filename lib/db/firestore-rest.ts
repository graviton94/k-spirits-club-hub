import { Spirit, SpiritStatus, SpiritFilter, SpiritSearchIndex } from '../db/schema';
import { getServiceAccountToken } from '../auth/service-account';
import { getAppPath, APP_ID } from './path-config';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

/**
 * Helper to Convert Firestore JSON to Object
 */
function fromFirestore(doc: any): Spirit {
    const fields = doc.fields || {};
    const id = doc.name.split('/').pop();
    const data: any = { id };

    for (const [key, value] of Object.entries(fields) as [string, any][]) {
        if ('stringValue' in value) data[key] = value.stringValue;
        else if ('integerValue' in value) data[key] = Number(value.integerValue);
        else if ('doubleValue' in value) data[key] = Number(value.doubleValue); // Number
        else if ('booleanValue' in value) data[key] = value.booleanValue;
        else if ('timestampValue' in value) data[key] = value.timestampValue; // Date String?
        else if (value.arrayValue) {
            data[key] = (value.arrayValue.values || []).map((v: any) => v.stringValue);
        }
        else if (value.mapValue) {
            // Simplified map handling (one level deep for metadata)
            const mapData: any = {};
            const mapFields = value.mapValue.fields || {};
            for (const [mk, mv] of Object.entries(mapFields) as [string, any][]) {
                if ('stringValue' in mv) mapData[mk] = mv.stringValue;
                if (mv.arrayValue) mapData[mk] = (mv.arrayValue.values || []).map((v: any) => v.stringValue);
            }
            data[key] = mapData;
        }
    }
    return data as Spirit;
}

/**
 * Helper to Convert Object to Firestore JSON
 */
function toFirestore(data: Partial<Spirit>): any {
    const fields: any = {};
    for (const [key, value] of Object.entries(data)) {
        if (key === 'id') continue;
        if (value === undefined || value === null) continue; // Skip nulls

        if (typeof value === 'string') fields[key] = { stringValue: value };
        else if (typeof value === 'number') {
            if (Number.isInteger(value)) fields[key] = { integerValue: value.toString() };
            else fields[key] = { doubleValue: value };
        }
        else if (typeof value === 'boolean') fields[key] = { booleanValue: value };
        else if (Array.isArray(value)) {
            fields[key] = { arrayValue: { values: value.map(v => ({ stringValue: v })) } };
        }
        if (value instanceof Date) {
            fields[key] = { timestampValue: value.toISOString() };
        }
        else if (typeof value === 'object') {
            // Map (Metadata)
            const mapFields: any = {};
            for (const [mk, mv] of Object.entries(value)) {
                if (typeof mv === 'string') mapFields[mk] = { stringValue: mv };
                if (Array.isArray(mv)) mapFields[mk] = { arrayValue: { values: mv.map((v: any) => ({ stringValue: v })) } };
            }
            fields[key] = { mapValue: { fields: mapFields } };
        }
        // Handle Dates? Firestore uses timestampValue (RFC3339)
        // If data comes as String (ISO), it's stringValue unless we parse.
        // Let's assume schema asks for string/Date. The REST API takes RFC3339 strings for timestampValue.
    }
    return { fields };
}

/**
 * Helper to parse Firestore document fields into a plain object
 * Used by cabinetDb and reviewsDb for consistent deserialization
 */
function parseFirestoreFields(fields: any): any {
    const obj: any = {};
    
    for (const [key, value] of Object.entries(fields) as [string, any][]) {
        if ('stringValue' in value) obj[key] = value.stringValue;
        else if ('integerValue' in value) obj[key] = Number(value.integerValue);
        else if ('doubleValue' in value) obj[key] = Number(value.doubleValue);
        else if ('booleanValue' in value) obj[key] = value.booleanValue;
        else if ('timestampValue' in value) obj[key] = value.timestampValue;
        else if (value.arrayValue) {
            obj[key] = (value.arrayValue.values || []).map((v: any) => v.stringValue);
        }
        else if (value.mapValue) {
            const mapData: any = {};
            const mapFields = value.mapValue.fields || {};
            for (const [mk, mv] of Object.entries(mapFields) as [string, any][]) {
                if ('stringValue' in mv) mapData[mk] = mv.stringValue;
                else if ('integerValue' in mv) mapData[mk] = Number(mv.integerValue);
                else if ('doubleValue' in mv) mapData[mk] = Number(mv.doubleValue);
                else if (mv.arrayValue) mapData[mk] = (mv.arrayValue.values || []).map((v: any) => v.stringValue);
            }
            obj[key] = mapData;
        }
    }
    
    return obj;
}

export const spiritsDb = {
  async getAll(filter: SpiritFilter = {}): Promise<Spirit[]> {
        const token = await getServiceAccountToken();
        const runQueryUrl = `${BASE_URL}:runQuery`;

        const filters: any[] = [];

        // Apply filters based on the provided SpiritFilter
        // Note: Avoid using both status='PUBLISHED' AND isPublished=true together
        // as it creates redundancy (status='PUBLISHED' always implies isPublished=true)
        if (filter.status && (filter.status as string) !== 'ALL') {
            filters.push({
                fieldFilter: {
                    field: { fieldPath: 'status' },
                    op: 'EQUAL',
                    value: { stringValue: filter.status }
                }
            });
        }

        // CRITICAL FIX: Always apply isPublished filter when explicitly specified
        // This filter is used by public-facing queries to show only published content.
        // It is NOT applied by admin queries, which should see all spirits regardless of publish status.
        if (filter.isPublished !== undefined) {
            filters.push({
                fieldFilter: {
                    field: { fieldPath: 'isPublished' },
                    op: 'EQUAL',
                    value: { booleanValue: filter.isPublished }
                }
            });
        }

        if (filter.subcategory) {
            filters.push({
                fieldFilter: {
                    field: { fieldPath: 'subcategory' },
                    op: 'EQUAL',
                    value: { stringValue: filter.subcategory }
                }
            });
        }

        const structuredQuery: any = {
            from: [{ collectionId: 'spirits' }],
            limit: 5000
        };

        if (filters.length === 1) {
            structuredQuery.where = filters[0];
        } else if (filters.length > 1) {
            structuredQuery.where = {
                compositeFilter: {
                    op: 'AND',
                    filters: filters
                }
            };
        }

        // Log the query being executed for debugging (only in development)
        if (process.env.NODE_ENV === 'development') {
            console.log('[Firestore] Executing query with filters:', JSON.stringify(filter));
            console.log('[Firestore] Structured query:', JSON.stringify(structuredQuery, null, 2));
        }

        const parent = `projects/${PROJECT_ID}/databases/(default)/documents`;

        const res = await fetch(runQueryUrl, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                parent,
                structuredQuery
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            let errorMessage = errText;
            try {
                const errJson = JSON.parse(errText);
                errorMessage = errJson.error?.message || errText;

                // CRITICAL: Look for Index Creation Link
                if (errText.includes('index') || res.status === 400) {
                    console.error(' [FIRESTORE INDEX ERROR] ');
                    console.error('The current query requires a composite index.');
                    console.error('Please visit this link to create it:');
                    const match = errText.match(/https:\/\/console\.firebase\.google\.com[^\s"]+/);
                    if (match) {
                        console.error('👉', match[0]);
                    } else {
                        console.error('Full Error Body:', errText);
                    }
                }
            } catch (e) {
                console.error('Failed to parse Firestore error:', errText);
            }
            console.error(`[Firestore REST] ${res.status} Error:`, errorMessage);
            return [];
        }

        const json = await res.json();
        const results = json
            .filter((r: any) => r.document)
            .map((r: any) => fromFirestore(r.document));

        console.log(`[Firestore] Query returned ${results.length} spirits`);
        console.log('[SYSTEM_CHECK] Query filter:', JSON.stringify(filter));
        
        if (results.length === 0) {
            console.warn('[Firestore] ⚠️ WARNING: Query returned 0 results. Filter:', JSON.stringify(filter));
            console.warn('[Firestore] This may indicate:');
            console.warn('  1. No spirits match the filter criteria');
            console.warn('  2. Database is empty or spirits not yet imported');
            console.warn('  3. Service account permissions issue');
            console.warn('  4. Firestore composite index missing (check error messages above)');
        } else {
            console.log('[Firestore] First result sample:', {
                id: results[0].id,
                name: results[0].name,
                status: results[0].status,
                isPublished: results[0].isPublished
            });
            
            // Count published vs unpublished for diagnostics
            const publishedCount = results.filter((s: Spirit) => s.isPublished === true).length;
            const unpublishedCount = results.length - publishedCount;
            console.log(`[SYSTEM_CHECK] Total Docs: ${results.length} | Published: ${publishedCount} | Unpublished: ${unpublishedCount}`);
        }

        return results;
    },

    async getById(id: string): Promise<Spirit | null> {
        const token = await getServiceAccountToken();
        const path = `spirits/${id}`;
        const url = `${BASE_URL}/${path}`;

        console.log(`[Firestore] Fetching Spirit: ${url} (ID: ${id})`); // DEBUG

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 404) {
            console.error(`[Firestore] Spirit Not Found: ${url}`);
            return null;
        }
        if (!res.ok) throw new Error(await res.text());

        const doc = await res.json();
        return fromFirestore(doc);
    },

    async getByIds(ids: string[]): Promise<Spirit[]> {
        const promises = ids.map(id => this.getById(id));
        const results = await Promise.all(promises);
        return results.filter((s): s is Spirit => s !== null);
    },

    async upsert(id: string, data: Partial<Spirit>) {
        const token = await getServiceAccountToken();
        const path = `spirits/${id}`;

        // Construct Update Mask dynamically based on data keys
        const fieldPaths = Object.keys(data).filter(k => k !== 'id').map(k => `updateMask.fieldPaths=${k}`).join('&');
        const patchUrl = `${BASE_URL}/${path}?${fieldPaths}&updateMask.fieldPaths=updatedAt`;

        const body = toFirestore({ ...data, updatedAt: new Date() });

        const res = await fetch(patchUrl, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error(await res.text());
    },

    async delete(ids: string[]) {
        const token = await getServiceAccountToken();
        for (const id of ids) {
            const path = `spirits/${id}`;
            await fetch(`${BASE_URL}/${path}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
        }
    },

    /**
     * Get all PUBLISHED spirits for search index generation
     * Returns minimized data structure for bandwidth optimization
     * 
     * Note: This fetches all published spirits (up to Firestore's 5000 limit).
     * For very large datasets (>5000 spirits), consider implementing pagination
     * or using a different indexing strategy.
     */
    async getPublishedSearchIndex(): Promise<SpiritSearchIndex[]> {
        // Fetch all published spirits using isPublished flag
        // CRITICAL FIX: Use isPublished filter instead of status='PUBLISHED' to ensure
        // we capture all published items regardless of their exact status value
        const publishedSpirits = await this.getAll({ 
            isPublished: true
        });

        console.log(`[SearchIndex] Total published spirits fetched: ${publishedSpirits.length}`);

        // Map to minimized structure with short keys
        // DEFENSIVE: Handle missing required fields with defaults to prevent data loss
        const validSpirits = publishedSpirits.filter(spirit => {
            const isValid = spirit.id && spirit.name && spirit.category;
            if (!isValid) {
                console.warn(`[SearchIndex] Skipping malformed spirit:`, {
                    id: spirit.id,
                    hasName: !!spirit.name,
                    hasCategory: !!spirit.category,
                    isPublished: spirit.isPublished
                });
            }
            return isValid;
        });

        console.log(`[SearchIndex] Valid spirits after filtering: ${validSpirits.length}`);

        return validSpirits.map(spirit => ({
            i: spirit.id,
            n: spirit.name,
            en: spirit.metadata?.name_en ?? null,
            c: spirit.category,
            mc: spirit.mainCategory ?? null,
            sc: spirit.subcategory ?? null,
            t: spirit.thumbnailUrl ?? spirit.imageUrl ?? null, // Fallback to imageUrl if thumbnailUrl missing
            a: spirit.abv ?? 0,
            d: spirit.distillery ?? null
        }));
    }
};

export const cabinetDb = {
    async getAll(userId: string): Promise<any[]> {
        const token = await getServiceAccountToken();
        // Path: artifacts/{appId}/users/{userId}/cabinet (collection)
        const cabinetPath = getAppPath('userCabinet', { userId });
        const url = `${BASE_URL}/${cabinetPath}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 404) return []; // Collection doesn't exist yet
        if (!res.ok) {
            // If collection empty/not found, REST might error or return empty. verify.
            // Often it returns 200 with { documents: [] } or just {}
            return [];
        }

        const json = await res.json();
        if (!json.documents) return [];

        return json.documents.map((doc: any) => parseFirestoreFields(doc.fields || {}));
    },

    async upsert(userId: string, spiritId: string, data: any) {
        const token = await getServiceAccountToken();
        // Document ID = spiritId (to ensure uniqueness per spirit per user)
        const cabinetPath = getAppPath('userCabinet', { userId });
        const url = `${BASE_URL}/${cabinetPath}/${spiritId}`;

        // Convert data to Firestore JSON. Can reuse toFirestore(data)? 
        // We need to support 'userReview' object structure. 
        // `toFirestore` in this file is tailored for Spirit, but it handles Map generically enough (1 level).
        // Let's use it.
        const body = toFirestore(data);

        // For upsert without merge complexity, we can use PATCH with null updateMask (if we passed all fields)
        // OR standard commit. REST API `patch` creates if missing.
        // We'll use PATCH with updateMask for known fields to merge, 
        // OR just simple PATCH with all fields? 
        // If we want to simple SET (overwrite), we don't pass updateMask.

        // Wait, toFirestore handles `id` skip.

        // We'll use generic PATCH to upsert.
        // If we want merge, we must specify updateMask.
        // If we want replace/create, passing no updateMask is ambiguous in REST? 
        // Check docs: "If the document does not exist, it will be created."
        // "If the document exists, it is updated... If mask is not set, the entire document is replaced."

        const res = await fetch(url, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error(await res.text());
    },

    async delete(userId: string, spiritId: string) {
        const token = await getServiceAccountToken();
        const cabinetPath = getAppPath('userCabinet', { userId });
        const url = `${BASE_URL}/${cabinetPath}/${spiritId}`;
        await fetch(url, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async getById(userId: string, spiritId: string): Promise<any | null> {
        const token = await getServiceAccountToken();
        const cabinetPath = getAppPath('userCabinet', { userId });
        const url = `${BASE_URL}/${cabinetPath}/${spiritId}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 404) return null; // Document doesn't exist
        if (!res.ok) {
            console.error('Failed to get cabinet item:', await res.text());
            return null;
        }

        const doc = await res.json();
        return parseFirestoreFields(doc.fields || {});
    }
};

export const reviewsDb = {
    async upsert(spiritId: string, userId: string, data: any) {
        const token = await getServiceAccountToken();
        // Document ID = ${spiritId}_${userId} for uniqueness
        const reviewId = `${spiritId}_${userId}`;
        const reviewsPath = getAppPath('reviews');
        const url = `${BASE_URL}/${reviewsPath}/${reviewId}`;

        const body = toFirestore(data);

        const res = await fetch(url, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Failed to upsert review:', errorText);
            throw new Error(`Failed to upsert review: ${errorText}`);
        }
    },

    async delete(spiritId: string, userId: string): Promise<void> {
        const token = await getServiceAccountToken();
        const reviewId = `${spiritId}_${userId}`;
        const reviewsPath = getAppPath('reviews');
        const url = `${BASE_URL}/${reviewsPath}/${reviewId}`;
        
        try {
            const res = await fetch(url, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Don't throw on 404 - review might not exist
            if (!res.ok && res.status !== 404) {
                const errorText = await res.text();
                console.error('Failed to delete review:', errorText);
                // Don't throw - we want dual-delete to be resilient
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            // Don't throw - we want dual-delete to be resilient
        }
    },

    async getById(spiritId: string, userId: string): Promise<any | null> {
        const token = await getServiceAccountToken();
        const reviewId = `${spiritId}_${userId}`;
        const reviewsPath = getAppPath('reviews');
        const url = `${BASE_URL}/${reviewsPath}/${reviewId}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 404) return null;
        if (!res.ok) {
            console.error('Failed to get review:', await res.text());
            return null;
        }

        const doc = await res.json();
        return parseFirestoreFields(doc.fields || {});
    },

    async getAllForSpirit(spiritId: string): Promise<any[]> {
        const token = await getServiceAccountToken();
        const reviewsPath = getAppPath('reviews');
        const url = `${BASE_URL}/${reviewsPath}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 404) return [];
        if (!res.ok) return [];

        const json = await res.json();
        if (!json.documents) return [];

        // Filter for this spirit's reviews
        return json.documents
            .map((doc: any) => parseFirestoreFields(doc.fields || {}))
            .filter((review: any) => review.spiritId === spiritId);
    }
};
