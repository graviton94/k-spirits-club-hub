import { Spirit, SpiritStatus, SpiritFilter, SpiritSearchIndex } from '../db/schema';
import { getServiceAccountToken } from '../auth/service-account';
import { getAppPath, APP_ID } from './paths';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

/**
 * Helper to Convert Firestore JSON to Object
 */
function fromFirestore(doc: any): Spirit {
    const fields = doc.fields || {};
    // Extract ID from the full path which might be deep
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
        const collectionPath = getAppPath().spirits;

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
            from: [{ collectionId: 'spirits' }], // collectionId is just the last p
            // Wait, for deep collections, structuredQuery 'from' might need full path if it's a subcollection query?
            // "If the collection ID is not unique, you must specify the parent." 
            // "from: [{ collectionId: 'spirits' }]" works if searching ALL collections named 'spirits'.
            // But we want specifically our new path.
            // When querying via runQuery, we should set the 'parent' field correctly.
            // parent: "projects/{projectId}/databases/(default)/documents/{parent_path}"
            limit: 5000
        };

        // Determine parent from collectionPath
        // collectionPath = "artifacts/k-spirits-club-hub/public/data/spirits"
        // parent = "projects/.../documents/artifacts/k-spirits-club-hub/public/data"
        const segments = collectionPath.split('/');
        const collectionId = segments.pop(); // 'spirits'
        const parentPath = segments.join('/'); // 'artifacts/k-spirits-club-hub/public/data'

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

        }

        const parent = `projects/${PROJECT_ID}/databases/(default)/documents/${parentPath}`;

        const res = await fetch(runQueryUrl, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                parent,
                structuredQuery: {
                    ...structuredQuery,
                    from: [{ collectionId }] // Query within the specific parent
                }
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
            // Count published vs unpublished for diagnostics
            const publishedCount = results.filter((s: Spirit) => s.isPublished === true).length;
            const unpublishedCount = results.length - publishedCount;
            console.log(`[SYSTEM_CHECK] Total Docs: ${results.length} | Published: ${publishedCount} | Unpublished: ${unpublishedCount}`);
        }

        return results;
    },

    async getById(id: string): Promise<Spirit | null> {
        const token = await getServiceAccountToken();
        const collectionPath = getAppPath().spirits;
        const url = `${BASE_URL}/${collectionPath}/${id}`;

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
        const collectionPath = getAppPath().spirits;
        const url = `${BASE_URL}/${collectionPath}/${id}`;

        // Construct Update Mask dynamically based on data keys
        const fieldPaths = Object.keys(data).filter(k => k !== 'id').map(k => `updateMask.fieldPaths=${k}`).join('&');
        const patchUrl = `${url}?${fieldPaths}&updateMask.fieldPaths=updatedAt`;

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
        const collectionPath = getAppPath().spirits;
        for (const id of ids) {
            const url = `${BASE_URL}/${collectionPath}/${id}`;
            await fetch(url, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
        }
    },

    /**
     * Get all PUBLISHED spirits for search index generation
     */
    async getPublishedSearchIndex(): Promise<SpiritSearchIndex[]> {
        // Fetch all published spirits using isPublished flag
        const publishedSpirits = await this.getAll({
            isPublished: true
        });

        console.log(`[SearchIndex] Total published spirits fetched: ${publishedSpirits.length}`);

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
            d: spirit.distillery ?? null,
            cre: spirit.createdAt ? (spirit.createdAt instanceof Date ? spirit.createdAt.toISOString() : (spirit.createdAt as any)) : null
        }));
    }
};

export const cabinetDb = {
    async getAll(userId: string): Promise<any[]> {
        const token = await getServiceAccountToken();
        // Path: artifacts/{appId}/users/{userId}/cabinet (collection)
        const cabinetPath = getAppPath().userCabinet(userId);
        const url = `${BASE_URL}/${cabinetPath}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 404) return []; // Collection doesn't exist yet
        if (!res.ok) {
            console.error(`Failed to fetch cabinet for user ${userId}: ${res.status} ${res.statusText}`);
            return [];
        }

        const json = await res.json();
        if (!json.documents) return [];

        return json.documents.map((doc: any) => {
            const data = parseFirestoreFields(doc.fields || {});
            // Ensure ID is present from document key if missing in fields
            if (!data.id) {
                data.id = doc.name.split('/').pop();
            }
            return data;
        });
    },

    async upsert(userId: string, spiritId: string, data: any) {
        const token = await getServiceAccountToken();
        // Document ID = spiritId (to ensure uniqueness per spirit per user)
        const cabinetPath = getAppPath().userCabinet(userId);
        const url = `${BASE_URL}/${cabinetPath}/${spiritId}`;

        // Construct Update Mask dynamically based on data keys
        const fieldPaths = Object.keys(data).filter(k => k !== 'id').map(k => `updateMask.fieldPaths=${k}`).join('&');
        const patchUrl = `${url}?${fieldPaths}`;

        const body = toFirestore(data);

        const res = await fetch(patchUrl, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error(await res.text());
    },

    async delete(userId: string, spiritId: string) {
        const token = await getServiceAccountToken();
        const cabinetPath = getAppPath().userCabinet(userId);
        const url = `${BASE_URL}/${cabinetPath}/${spiritId}`;
        await fetch(url, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async getById(userId: string, spiritId: string): Promise<any | null> {
        const token = await getServiceAccountToken();
        const cabinetPath = getAppPath().userCabinet(userId);
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
        const reviewData = {
            ...data,
            spiritId,
            userId,
            updatedAt: new Date().toISOString()
        };
        const body = toFirestore(reviewData);

        // Define paths
        const paths = [
            `${getAppPath().reviews}/${spiritId}_${userId}`,
            `${getAppPath().spiritReviews(spiritId)}/${userId}`,
            `${getAppPath().userReviews(userId)}/${spiritId}`
        ];

        // Construct update mask
        const fieldPaths = Object.keys(reviewData).filter(k => k !== 'id').map(k => `updateMask.fieldPaths=${k}`).join('&');

        const promises = paths.map(async (path) => {
            const patchUrl = `${BASE_URL}/${path}?${fieldPaths}`;
            const res = await fetch(patchUrl, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`Failed to upsert review at ${path}:`, errorText);
                throw new Error(`Failed to upsert review at ${path}: ${errorText}`);
            }
        });

        await Promise.all(promises);

        // Sync to "Latest 3" collection for home page
        try {
            await this.syncRecent(reviewData);
        } catch (err) {
            console.error('Failed to sync recent reviews:', err);
        }
    },

    async getRecent(): Promise<any[]> {
        const token = await getServiceAccountToken();
        const reviewsPath = getAppPath().recentReviews;
        const url = `${BASE_URL}/${reviewsPath}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 404) return [];
        if (!res.ok) return [];

        const json = await res.json();
        if (!json.documents) return [];

        return json.documents
            .map((doc: any) => parseFirestoreFields(doc.fields || {}))
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    async syncRecent(reviewData: any) {
        const token = await getServiceAccountToken();
        const reviewsPath = getAppPath().recentReviews;

        // 1. Get current top 3
        const current = await this.getRecent();

        // 2. Insert new one at the top and deduplicate (by same spirit + same user)
        const newId = `${reviewData.spiritId}_${reviewData.userId}`;
        const filtered = current.filter(r => `${r.spiritId}_${r.userId}` !== newId);
        const updated = [reviewData, ...filtered].slice(0, 3);

        // 3. Update the 3 slots (0, 1, 2)
        const promises = updated.map(async (review, index) => {
            const url = `${BASE_URL}/${reviewsPath}/${index}`;
            const body = toFirestore(review);
            await fetch(url, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify(body)
            });
        });

        await Promise.all(promises);
    },

    async delete(spiritId: string, userId: string): Promise<void> {
        const token = await getServiceAccountToken();
        const paths = [
            `${getAppPath().reviews}/${spiritId}_${userId}`,
            `${getAppPath().spiritReviews(spiritId)}/${userId}`,
            `${getAppPath().userReviews(userId)}/${spiritId}`
        ];

        try {
            const promises = paths.map(async (path) => {
                const url = `${BASE_URL}/${path}`;
                const res = await fetch(url, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok && res.status !== 404) {
                    const errorText = await res.text();
                    console.error(`Failed to delete review at ${path}:`, errorText);
                }
            });
            await Promise.all(promises);

            // Re-sync "Latest 3" by fetching the top 3 from the main reviews collection
            await this.refreshRecentSlots();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    },

    async refreshRecentSlots() {
        const token = await getServiceAccountToken();
        const reviewsPath = getAppPath().reviews;
        const recentPath = getAppPath().recentReviews;

        // 1. Fetch current reviews from public folder (using runQuery to get top 3 by date)
        const parent = `projects/${PROJECT_ID}/databases/(default)/documents/${reviewsPath.split('/').slice(0, -1).join('/')}`;
        const collectionId = reviewsPath.split('/').pop();

        const res = await fetch(`${BASE_URL}:runQuery`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                parent,
                structuredQuery: {
                    from: [{ collectionId }],
                    orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }],
                    limit: 3
                }
            })
        });

        if (!res.ok) return;
        const json = await res.json();
        const top3 = json
            .filter((r: any) => r.document)
            .map((r: any) => parseFirestoreFields(r.document.fields || {}));

        // 2. Overwrite slots 0, 1, 2
        const updatePromises = [0, 1, 2].map(async (index) => {
            const url = `${BASE_URL}/${recentPath}/${index}`;
            const review = top3[index];
            if (review) {
                await fetch(url, {
                    method: 'PATCH',
                    headers: { Authorization: `Bearer ${token}` },
                    body: JSON.stringify(toFirestore(review))
                });
            } else {
                // If fewer than 3 reviews remain, delete the extra slot
                await fetch(url, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        });

        await Promise.all(updatePromises);
    },

    async getById(spiritId: string, userId: string): Promise<any | null> {
        const token = await getServiceAccountToken();
        const reviewId = `${spiritId}_${userId}`;
        const reviewsPath = getAppPath().reviews;
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
        const reviewsPath = getAppPath().spiritReviews(spiritId);
        const url = `${BASE_URL}/${reviewsPath}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 404) return [];
        if (!res.ok) return [];

        const json = await res.json();
        if (!json.documents) return [];

        return json.documents.map((doc: any) => {
            const data = parseFirestoreFields(doc.fields || {});
            // Document ID is the userId in this subcollection
            if (!data.userId) {
                data.userId = doc.name.split('/').pop();
            }
            return data;
        });
    },

    async getAllForUser(userId: string): Promise<any[]> {
        const token = await getServiceAccountToken();
        const reviewsPath = getAppPath().userReviews(userId);
        const url = `${BASE_URL}/${reviewsPath}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 404) return [];
        if (!res.ok) return [];

        const json = await res.json();
        if (!json.documents) return [];

        return json.documents.map((doc: any) => {
            const data = parseFirestoreFields(doc.fields || {});
            // Document ID is the spiritId in this subcollection
            if (!data.spiritId) {
                data.spiritId = doc.name.split('/').pop();
            }
            return data;
        });
    }
};

export const trendingDb = {
    async logEvent(spiritId: string, action: 'view' | 'wishlist' | 'cabinet' | 'review') {
        const token = await getServiceAccountToken();
        const dateId = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const dailyDocPath = `${getAppPath().trendingDaily(dateId)}/${spiritId}`;
        const commitUrl = `${BASE_URL.replace('/documents', '')}:commit`;

        const fieldMap: Record<string, { field: string, weight: number }> = {
            'view': { field: 'views', weight: 1 },
            'wishlist': { field: 'wishlistAdds', weight: 5 },
            'cabinet': { field: 'cabinetAdds', weight: 10 },
            'review': { field: 'reviewsCount', weight: 20 }
        };

        const config = fieldMap[action];
        if (!config) return;

        // Atomic increment using Firestore REST commit
        const body = {
            writes: [
                {
                    transform: {
                        document: `projects/${PROJECT_ID}/databases/(default)/documents/${dailyDocPath}`,
                        fieldTransforms: [
                            {
                                fieldPath: config.field,
                                increment: { integerValue: "1" }
                            },
                            {
                                fieldPath: 'totalScore',
                                increment: { integerValue: config.weight.toString() }
                            }
                        ]
                    }
                }
            ]
        };

        await fetch(commitUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    },

    async getTopTrending(limit: number = 5): Promise<any[]> {
        const token = await getServiceAccountToken();
        const dateId = new Date().toISOString().split('T')[0];
        const dailyPath = getAppPath().trendingDaily(dateId);

        // Use runQuery for efficient top-N retrieval
        const runQueryUrl = `${BASE_URL}:runQuery`;
        const segments = dailyPath.split('/');
        const collectionId = segments.pop();
        const parentPath = segments.join('/');
        const parent = `projects/${PROJECT_ID}/databases/(default)/documents/${parentPath}`;

        const res = await fetch(runQueryUrl, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                parent,
                structuredQuery: {
                    from: [{ collectionId }],
                    orderBy: [
                        { field: { fieldPath: 'totalScore' }, direction: 'DESCENDING' }
                    ],
                    limit: limit
                }
            })
        });

        if (!res.ok) return [];

        const json = await res.json();
        if (!Array.isArray(json)) return [];

        return json
            .filter((r: any) => r.document)
            .map((r: any) => {
                const doc = r.document;
                const fields = parseFirestoreFields(doc.fields || {});
                const spiritId = doc.name.split('/').pop();

                return {
                    spiritId,
                    score: fields.totalScore || 0,
                    stats: {
                        views: fields.views || 0,
                        wishlist: fields.wishlistAdds || 0,
                        cabinet: fields.cabinetAdds || 0,
                        reviews: fields.reviewsCount || 0
                    }
                };
            });
    }
};

