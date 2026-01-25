import { Spirit, SpiritStatus, SpiritFilter, SpiritSearchIndex } from '../db/schema';
import { getServiceAccountToken } from '../auth/service-account';

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
        if (value.stringValue) data[key] = value.stringValue;
        else if (value.integerValue) data[key] = Number(value.integerValue);
        else if (value.doubleValue) data[key] = Number(value.doubleValue); // Number
        else if (value.booleanValue) data[key] = value.booleanValue;
        else if (value.timestampValue) data[key] = value.timestampValue; // Date String?
        else if (value.arrayValue) {
            data[key] = (value.arrayValue.values || []).map((v: any) => v.stringValue);
        }
        else if (value.mapValue) {
            // Simplified map handling (one level deep for metadata)
            const mapData: any = {};
            const mapFields = value.mapValue.fields || {};
            for (const [mk, mv] of Object.entries(mapFields) as [string, any][]) {
                if (mv.stringValue) mapData[mk] = mv.stringValue;
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

export const spiritsDb = {
    async getAll(filter: SpiritFilter = {}): Promise<Spirit[]> {
        const token = await getServiceAccountToken();
        const runQueryUrl = `${BASE_URL}:runQuery`;

        const filters: any[] = [];

        // Unified PUBLISHED logic: Always apply both status and isPublished filters
        // This ensures consistent behavior across all queries
        if (filter.status && (filter.status as string) !== 'ALL') {
            filters.push({
                fieldFilter: {
                    field: { fieldPath: 'status' },
                    op: 'EQUAL',
                    value: { stringValue: filter.status }
                }
            });
        }

        // Always apply isPublished filter when explicitly specified
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
        if (results.length > 0) {
            console.log('[Firestore] First result sample:', {
                id: results[0].id,
                name: results[0].name,
                status: results[0].status,
                isPublished: results[0].isPublished
            });
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
        // Fetch all published spirits
        const publishedSpirits = await this.getAll({ 
            status: 'PUBLISHED' as SpiritStatus,
            isPublished: true 
        });

        // Map to minimized structure with short keys
        return publishedSpirits.map(spirit => ({
            i: spirit.id,
            n: spirit.name,
            en: spirit.metadata?.name_en ?? null,
            c: spirit.category,
            mc: spirit.mainCategory ?? null,
            sc: spirit.subcategory ?? null,
            t: spirit.thumbnailUrl ?? null
        }));
    }
};

export const cabinetDb = {
    async getAll(userId: string): Promise<any[]> {
        const token = await getServiceAccountToken();
        // Path: users/{userId}/cabinet (collection)
        // Root path construction for custom collections might differ, usually:
        // projects/{id}/databases/(default)/documents/users/{userId}/cabinet
        const url = `${BASE_URL}/users/${userId}/cabinet`;

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

        return json.documents.map((doc: any) => {
            // generic fromFirestore for cabinet items
            const obj: any = {};
            const fields = doc.fields || {};
            for (const [key, value] of Object.entries(fields) as [string, any][]) {
                if (value.stringValue) obj[key] = value.stringValue;
                else if (value.integerValue) obj[key] = Number(value.integerValue);
                else if (value.doubleValue) obj[key] = Number(value.doubleValue);
                else if (value.booleanValue) obj[key] = value.booleanValue;
                else if (value.timestampValue) obj[key] = value.timestampValue;
                else if (value.mapValue) {
                    // Handle nested map (e.g. userReview)
                    const mapData: any = {};
                    const mapFields = value.mapValue.fields || {};
                    for (const [mk, mv] of Object.entries(mapFields) as [string, any][]) {
                        if (mv.stringValue) mapData[mk] = mv.stringValue;
                        if (mv.integerValue) mapData[mk] = Number(mv.integerValue);
                        if (mv.doubleValue) mapData[mk] = Number(mv.doubleValue);
                        if (mv.arrayValue) mapData[mk] = (mv.arrayValue.values || []).map((v: any) => v.stringValue);
                    }
                    obj[key] = mapData;
                }
            }
            return obj;
        });
    },

    async upsert(userId: string, spiritId: string, data: any) {
        const token = await getServiceAccountToken();
        // Document ID = spiritId (to ensure uniqueness per spirit per user)
        const url = `${BASE_URL}/users/${userId}/cabinet/${spiritId}`;

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
        const url = `${BASE_URL}/users/${userId}/cabinet/${spiritId}`;
        await fetch(url, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};
