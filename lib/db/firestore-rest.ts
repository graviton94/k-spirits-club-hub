import { Spirit, SpiritStatus, SpiritFilter, SpiritSearchIndex, ModificationRequest } from '../db/schema';
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
 * Helper to convert a plain value to Firestore REST Value structure
 */
function toFirestoreValue(value: any): any {
    if (value === null || value === undefined) return null;

    if (typeof value === 'string') return { stringValue: value };
    if (typeof value === 'boolean') return { booleanValue: value };
    if (typeof value === 'number') {
        if (Number.isInteger(value)) return { integerValue: value.toString() };
        return { doubleValue: value };
    }
    const isDate = value instanceof Date || Object.prototype.toString.call(value) === '[object Date]';
    if (isDate) return { timestampValue: (value as Date).toISOString() };

    if (Array.isArray(value)) {
        return {
            arrayValue: {
                values: value.map(v => toFirestoreValue(v)).filter(v => v !== null)
            }
        };
    }

    if (typeof value === 'object') {
        const fields: any = {};
        for (const [k, v] of Object.entries(value)) {
            const fireValue = toFirestoreValue(v);
            if (fireValue !== null) fields[k] = fireValue;
        }
        return { mapValue: { fields } };
    }

    return null;
}

/**
 * Helper to convert a Firestore REST Value structure to a plain JS value
 */
function fromFirestoreValue(value: any): any {
    if (!value) return null;

    if ('stringValue' in value) return value.stringValue;
    if ('booleanValue' in value) return value.booleanValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return Number(value.doubleValue);
    if ('timestampValue' in value) return value.timestampValue;

    if (value.arrayValue) {
        return (value.arrayValue.values || []).map((v: any) => fromFirestoreValue(v));
    }

    if (value.mapValue) {
        const obj: any = {};
        const fields = value.mapValue.fields || {};
        for (const [k, v] of Object.entries(fields)) {
            obj[k] = fromFirestoreValue(v);
        }
        return obj;
    }

    return null;
}

/**
 * Helper to Convert Object to Firestore JSON
 */
function toFirestore(data: any): any {
    const fields: any = {};
    for (const [key, value] of Object.entries(data)) {
        if (key === 'id') continue;
        const fireValue = toFirestoreValue(value);
        if (fireValue !== null) {
            fields[key] = fireValue;
        }
    }
    return { fields };
}

/**
 * Helper to parse Firestore document fields into a plain object
 */
function parseFirestoreFields(fields: any): any {
    const obj: any = {};
    for (const [key, value] of Object.entries(fields)) {
        obj[key] = fromFirestoreValue(value);
    }
    return obj;
}

export const spiritsDb = {
    async getAll(filter: SpiritFilter = {}, pagination?: { page: number, pageSize: number }): Promise<Spirit[]> {
        const token = await getServiceAccountToken();
        const runQueryUrl = `${BASE_URL}:runQuery`;
        const collectionPath = getAppPath().spirits;

        const filters: any[] = [];
        const isSearchActive = !!filter.searchTerm; // If search is active, we cannot paginate at DB level easily

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

        if (filter.category && (filter.category as string) !== 'ALL') {
            // Smart Filter: Match either category OR subcategory (replicating legacy behavior)
            filters.push({
                compositeFilter: {
                    op: 'OR',
                    filters: [
                        { fieldFilter: { field: { fieldPath: 'category' }, op: 'EQUAL', value: { stringValue: filter.category } } },
                        { fieldFilter: { field: { fieldPath: 'subcategory' }, op: 'EQUAL', value: { stringValue: filter.category } } }
                    ]
                }
            });
        }

        if (filter.country && (filter.country as string) !== 'ALL') {
            filters.push({
                fieldFilter: {
                    field: { fieldPath: 'country' },
                    op: 'EQUAL',
                    value: { stringValue: filter.country }
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

            // PAGINATION LOGIC:
            // If NOT searching (which requires in-memory filtering), use DB pagination.
            // If searching, fetch MAX (5000) to filter in memory.
            limit: isSearchActive ? 5000 : (pagination ? pagination.pageSize : 5000)
        };

        // Add Offset and OrderBy if paginating (and not searching)
        if (pagination && !isSearchActive) {
            structuredQuery.offset = (pagination.page - 1) * pagination.pageSize;
            // Ensure consistent ordering for pagination
            structuredQuery.orderBy = [{ field: { fieldPath: 'updatedAt' }, direction: 'DESCENDING' }];
        }

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

        // Simplified Upsert: Use standard PATCH instead of :commit to avoid UpdateMask complexity
        // We handle timestamp manually (Edge runtime time is sufficient)
        const payload: any = {
            ...data,
            updatedAt: new Date().toISOString()
        };

        const converted = toFirestore(payload);

        // Construct Update Mask: Explicitly list all keys being sent
        // This ensures partial updates work without deleting other fields
        // and without "field missing in payload" errors.
        const fieldKeys = Object.keys(converted.fields);
        const queryParams = new URLSearchParams();
        fieldKeys.forEach(key => queryParams.append('updateMask.fieldPaths', key));

        const patchUrl = `${url}?${queryParams.toString()}`;

        console.log(`[Spirit Upsert] Patching ${id}. Fields:`, fieldKeys.join(', '));

        const res = await fetch(patchUrl, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(converted)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Failed to upsert spirit. Status:', res.status);
            console.error('Error Body:', errorText);
            throw new Error(`Failed to upsert spirit (${res.status}): ${errorText}`);
        }
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
            en: spirit.name_en ?? spirit.metadata?.name_en ?? null,
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

        console.log(`[Firestore] Fetching Cabinet: ${url}`); // DEBUG PATH

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

        // 1. Check if it's a new review to increment user stats
        const isNew = !(await this.getById(spiritId, userId));

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

        // 2. Increment user review count if new
        if (isNew) {
            await userDb.incrementStats(userId, { reviewsWritten: 1 });
        }

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
        // BUFFER: Store top 6 instead of 3
        const updated = [reviewData, ...filtered].slice(0, 6);

        // 3. Update the 6 slots (0-5)
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

            // Re-sync "Latest 3" with fallback to prevent wiping
            const reviewId = `${spiritId}_${userId}`;
            await this.refreshRecentSlots(reviewId);
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    },

    async refreshRecentSlots(excludedId?: string) {
        const token = await getServiceAccountToken();
        const reviewsPath = getAppPath().reviews;
        const recentPath = getAppPath().recentReviews;

        // 1. Fetch current top 3 from cache (Fallback source)
        const currentCached = await this.getRecent();

        // 2. Fetch fresh top 3 from master collection
        const parent = `projects/${PROJECT_ID}/databases/(default)/documents/${reviewsPath.split('/').slice(0, -1).join('/')}`;
        const collectionId = reviewsPath.split('/').pop();

        let freshReviews: any[] = [];
        let queryFailed = false;

        try {
            const res = await fetch(`${BASE_URL}:runQuery`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    parent,
                    structuredQuery: {
                        from: [{ collectionId }],
                        orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }],
                        limit: 6 // BUFFER: Fetch more to have backups
                    }
                })
            });

            if (!res.ok) {
                console.error('Failed to query reviews for refresh (HTTP Error):', await res.text());
                queryFailed = true;
            } else {
                const json = await res.json();
                if (Array.isArray(json)) {
                    freshReviews = json
                        .filter((r: any) => r.document)
                        .map((r: any) => parseFirestoreFields(r.document.fields || {}));
                }
            }
        } catch (err) {
            console.error('Failed to query reviews for refresh (Exception):', err);
            queryFailed = true;
        }

        // 3. Determine the final list
        let finalList: any[] = [];

        if (!queryFailed && freshReviews.length > 0) {
            // Happy path: We got fresh data
            finalList = freshReviews;
        } else {
            // Fallback path: Query failed OR returned 0 items (which might be a bug if we know we have data)
            // We use the cached version, filtering out the excluded ID if provided.
            console.warn('[refreshRecentSlots] Using cached fallback strategy. QueryFailed:', queryFailed, 'FreshCount:', freshReviews.length);

            finalList = currentCached;
            if (excludedId) {
                finalList = finalList.filter(r => `${r.spiritId}_${r.userId}` !== excludedId);
            }
        }

        // Limit to 6 items (Buffer size)
        finalList = finalList.slice(0, 6);

        // 4. Overwrite slots 0-5
        const updatePromises = [0, 1, 2, 3, 4, 5].map(async (index) => {
            const url = `${BASE_URL}/${recentPath}/${index}`;
            const review = finalList[index];
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

        const reviews = json.documents.map((doc: any) => {
            const data = parseFirestoreFields(doc.fields || {});
            if (!data.spiritId) {
                data.spiritId = doc.name.split('/').pop();
            }
            return data;
        });

        // Optimization: Fetch all related spirits to get authoritative Image URL and Name
        // This fixes the issue where review documents might have missing or outdated image URLs
        const spiritIds = [...new Set(reviews.map((r: any) => r.spiritId))].filter(Boolean);

        if (spiritIds.length > 0) {
            try {
                // Fix: Call spiritsDb directly, not 'this'
                const spirits = await spiritsDb.getByIds(spiritIds as string[]);
                const spiritMap = new Map(spirits.map((s: Spirit) => [s.id, s]));

                // Merge spirit data into review
                return reviews.map((r: any) => {
                    const spirit = spiritMap.get(r.spiritId);
                    if (spirit) {
                        return {
                            ...r,
                            imageUrl: spirit.thumbnailUrl || spirit.imageUrl || r.imageUrl, // Prefer Spirit Image
                            spiritName: spirit.name || r.spiritName, // Prefer Spirit Name
                            category: spirit.category // Useful for fallbacks
                        };
                    }
                    return r;
                });
            } catch (error) {
                console.error('Failed to enrich reviews with spirit data:', error);
                return reviews; // Fallback to existing data
            }
        }

        return reviews;
    },

    async toggleLike(spiritId: string, reviewUserId: string, likerUserId: string): Promise<{ likes: number, isLiked: boolean }> {
        const token = await getServiceAccountToken();
        const reviewId = `${spiritId}_${reviewUserId}`;
        const mainPath = `${getAppPath().reviews}/${reviewId}`;
        const commitUrl = `${BASE_URL.replace('/documents', '')}:commit`;

        // 1. Get current review to check if already liked
        const review = await this.getById(spiritId, reviewUserId);
        if (!review) throw new Error('Review not found');

        const likedBy = review.likedBy || [];
        const isLiked = likedBy.includes(likerUserId);
        const newLikesCount = isLiked ? (review.likes || 1) - 1 : (review.likes || 0) + 1;
        const newLikedBy = isLiked ? likedBy.filter((id: string) => id !== likerUserId) : [...likedBy, likerUserId];

        // 2. Perform atomic updates across all mirrors and profile
        const paths = [
            mainPath,
            `${getAppPath().spiritReviews(spiritId)}/${reviewUserId}`,
            `${getAppPath().userReviews(reviewUserId)}/${spiritId}`
        ];

        const writes = paths.map(path => ({
            update: {
                name: `projects/${PROJECT_ID}/databases/(default)/documents/${path}`,
                fields: {
                    likes: { integerValue: newLikesCount.toString() },
                    likedBy: { arrayValue: { values: newLikedBy.map((id: string) => ({ stringValue: id })) } }
                }
            },
            updateMask: { fieldPaths: ['likes', 'likedBy'] }
        }));

        // 3. Increment author heart count
        // 3. Increment author heart count
        // FIX: Split into two operations because 'update' and 'transform' cannot be in the same Write object
        // However, for efficiency and since profile should exist, we just use transform.
        // If the profile strictly uses 'users' collection, it should exist if they reviewed.
        const profilePath = `users/${reviewUserId}`;
        writes.push({
            transform: {
                document: `projects/${PROJECT_ID}/databases/(default)/documents/${profilePath}`,
                fieldTransforms: [
                    {
                        fieldPath: 'heartsReceived',
                        increment: { integerValue: isLiked ? "-1" : "1" }
                    }
                ]
            }
        } as any);

        await fetch(commitUrl, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ writes })
        });

        return { likes: newLikesCount, isLiked: !isLiked };
    },

    /**
     * Get user review statistics
     * Returns count of reviews and total likes received
     */
    async getUserStats(userId: string): Promise<{ reviewCount: number, totalLikes: number }> {
        const token = await getServiceAccountToken();
        const reviewsPath = getAppPath().userReviews(userId);
        const url = `${BASE_URL}/${reviewsPath}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 404) return { reviewCount: 0, totalLikes: 0 };
        if (!res.ok) {
            console.error(`Failed to fetch user stats for ${userId}:`, res.status, res.statusText);
            return { reviewCount: 0, totalLikes: 0 };
        }

        const json = await res.json();
        if (!json.documents) return { reviewCount: 0, totalLikes: 0 };

        const reviews = json.documents.map((doc: any) => parseFirestoreFields(doc.fields || {}));
        const reviewCount = reviews.length;
        const totalLikes = reviews.reduce((sum: number, review: any) => sum + (review.likes || 0), 0);

        return { reviewCount, totalLikes };
    }
};

export const userDb = {
    async incrementStats(userId: string, stats: { reviewsWritten?: number, heartsReceived?: number }) {
        const token = await getServiceAccountToken();
        const docPath = `users/${userId}`;
        const commitUrl = `${BASE_URL.replace('/documents', '')}:commit`;

        const fieldTransforms = [];
        if (stats.reviewsWritten) {
            fieldTransforms.push({
                fieldPath: 'reviewsWritten',
                increment: { integerValue: stats.reviewsWritten.toString() }
            });
        }
        if (stats.heartsReceived) {
            fieldTransforms.push({
                fieldPath: 'heartsReceived',
                increment: { integerValue: stats.heartsReceived.toString() }
            });
        }

        if (fieldTransforms.length === 0) return;

        const body = {
            writes: [{
                transform: {
                    document: `projects/${PROJECT_ID}/databases/(default)/documents/${docPath}`,
                    fieldTransforms
                }
            }]
        };

        await fetch(commitUrl, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
    }
};

export const trendingDb = {
    async logEvent(spiritId: string, action: 'view' | 'wishlist' | 'cabinet' | 'review') {
        const token = await getServiceAccountToken();
        const dateId = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        // FIX: Use subcollection 'spirits' for cleaner structure and to avoid issues
        // Path: artifacts/.../trending/daily/{dateId}/spirits/{spiritId}
        const dailyDocPath = `${getAppPath().trendingDaily(dateId)}/spirits/${spiritId}`;
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

        // Configuration constants for trending algorithm
        const DAYS_TO_CHECK = 7;
        const DAILY_DECAY_FACTOR = 0.7; // 70% weight reduction per day
        const AGGREGATION_MULTIPLIER = 2; // Fetch 2x items for better aggregation
        const MIN_DAYS_TO_CHECK = 2; // Minimum days to check before early exit

        const aggregatedScores = new Map<string, { score: number, stats: any }>();

        for (let daysAgo = 0; daysAgo < DAYS_TO_CHECK; daysAgo++) {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            const dateId = date.toISOString().split('T')[0];
            const dailyPath = getAppPath().trendingDaily(dateId);

            // Use runQuery for efficient top-N retrieval
            const runQueryUrl = `${BASE_URL}:runQuery`;

            // FIX: Query the 'spirits' subcollection within the daily document
            // Parent: projects/.../databases/(default)/documents/artifacts/.../trending/daily/{dateId}
            const parent = `projects/${PROJECT_ID}/databases/(default)/documents/${dailyPath}`;
            const collectionId = 'spirits';

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
                        limit: limit * AGGREGATION_MULTIPLIER
                    }
                })
            });

            if (!res.ok) continue;

            const json = await res.json();
            if (!Array.isArray(json)) continue;

            // Aggregate scores with decay factor (more recent days have higher weight)
            const decayFactor = Math.pow(DAILY_DECAY_FACTOR, daysAgo);

            json.filter((r: any) => r.document).forEach((r: any) => {
                const doc = r.document;
                const fields = parseFirestoreFields(doc.fields || {});
                const spiritId = doc.name.split('/').pop();
                const score = (fields.totalScore || 0) * decayFactor;

                const existing = aggregatedScores.get(spiritId);
                if (existing) {
                    // Accumulate score with decay factor
                    existing.score += score;
                    // Aggregate stats - note: this sums daily counts across days,
                    // which is intentional to show total engagement over the period
                    existing.stats.views += fields.views || 0;
                    existing.stats.wishlist += fields.wishlistAdds || 0;
                    existing.stats.cabinet += fields.cabinetAdds || 0;
                    existing.stats.reviews += fields.reviewsCount || 0;
                } else {
                    aggregatedScores.set(spiritId, {
                        score,
                        stats: {
                            views: fields.views || 0,
                            wishlist: fields.wishlistAdds || 0,
                            cabinet: fields.cabinetAdds || 0,
                            reviews: fields.reviewsCount || 0
                        }
                    });
                }
            });

            // If we have enough data from recent days, stop checking older days
            if (aggregatedScores.size >= limit && daysAgo >= MIN_DAYS_TO_CHECK) {
                break;
            }
        }

        // Convert map to array and sort by aggregated score
        return Array.from(aggregatedScores.entries())
            .map(([spiritId, data]) => ({
                spiritId,
                score: data.score,
                stats: data.stats
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
};

/**
 * New Arrivals Cache Database
 * Manages the cache document for the top 10 most recently confirmed spirits
 */
export const newArrivalsDb = {
    /**
     * Sync the new_arrivals cache with the top 10 published spirits by updatedAt
     * Called when admin confirms/publishes a spirit
     */
    async syncCache(): Promise<any> {
        const token = await getServiceAccountToken();
        const spiritsPath = 'spirits';
        const newArrivalsPath = getAppPath().newArrivals;

        try {
            // 1. Query top 10 published spirits ordered by updatedAt DESC
            // NOTE: This requires a Firestore Composite Index: Collection: spirits, Fields: isPublished (ASC), updatedAt (DESC)
            const runQueryUrl = `${BASE_URL}:runQuery`;
            const parent = `projects/${PROJECT_ID}/databases/(default)/documents`;

            const queryBody = {
                parent,
                structuredQuery: {
                    from: [{ collectionId: spiritsPath }],
                    where: {
                        fieldFilter: {
                            field: { fieldPath: 'isPublished' },
                            op: 'EQUAL',
                            value: { booleanValue: true }
                        }
                    },
                    orderBy: [
                        { field: { fieldPath: 'updatedAt' }, direction: 'DESCENDING' }
                    ],
                    limit: 10
                }
            };

            // console.log('DEBUG: Sync Query:', JSON.stringify(queryBody));

            const res = await fetch(runQueryUrl, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify(queryBody)
            });

            if (!res.ok) {
                const text = await res.text();
                // If index is missing, this will fail with 400.
                console.error('Failed to query spirits for new arrivals:', text);
                return { success: false, error: text, status: res.status };
            }

            const json = await res.json();
            if (!Array.isArray(json)) return { success: false, error: 'Response not array', json };

            const top10 = json
                .filter((r: any) => r.document)
                .map((r: any) => fromFirestore(r.document))
                .filter(s => s.imageUrl || s.thumbnailUrl); // Only include spirits with images

            // Debug return
            const debugResult = {
                found: top10.length,
                rawCount: json.length,
                firstItem: top10[0]
            };

            // 2. Update the new_arrivals cache with these 10 spirits
            const updatePromises = top10.map(async (spirit, index) => {
                const url = `${BASE_URL}/${newArrivalsPath}/${index}`;

                // OPTIMIZATION: Store only essential fields for the "New Arrivals" card
                // This reduces document size and bandwidth usage significantly.
                // We exclude heavy fields like description, tasting_note, searchKeywords, etc.
                const minifiedSpirit: Partial<Spirit> = {
                    id: spirit.id,
                    name: spirit.name,
                    imageUrl: spirit.imageUrl,
                    thumbnailUrl: spirit.thumbnailUrl,
                    category: spirit.category, // Required for fallback image
                    subcategory: spirit.subcategory,
                    updatedAt: spirit.updatedAt,
                    createdAt: spirit.createdAt
                };

                const body = toFirestore(minifiedSpirit);

                // CRITICAL FIX: Inject the real Spirit ID into the fields
                // toFirestore filters out 'id' by default (as it's usually the doc ID)
                // but here we are storing spirits inside a numbered collection (0, 1, 2...),
                // so we must explicity store the original Product ID as a field.
                if (spirit.id) {
                    body.fields.id = { stringValue: spirit.id };
                }

                const res = await fetch(url, {
                    method: 'PATCH',
                    headers: { Authorization: `Bearer ${token}` },
                    body: JSON.stringify(body)
                });

                if (!res.ok) {
                    console.error(`Failed to update new arrivals slot ${index}:`, await res.text());
                }
            });

            await Promise.all(updatePromises);

            // 3. Delete extra slots
            if (top10.length < 10) {
                const deletePromises = [];
                for (let i = top10.length; i < 10; i++) {
                    const url = `${BASE_URL}/${newArrivalsPath}/${i}`;
                    deletePromises.push(
                        fetch(url, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    );
                }
                await Promise.all(deletePromises);
            }

            return { success: true, ...debugResult };
        } catch (error) {
            console.error('Error syncing new arrivals cache:', error);
            return { success: false, error: error instanceof Error ? error.message : String(error) };
        }
    },

    /**
     * Get the cached new arrivals (top 10 most recently confirmed spirits)
     */
    async getAll(): Promise<Spirit[]> {
        const token = await getServiceAccountToken();
        const newArrivalsPath = getAppPath().newArrivals;
        const url = `${BASE_URL}/${newArrivalsPath}`;

        try {
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 404) return [];
            if (!res.ok) return [];

            const json = await res.json();
            if (!json.documents) return [];

            return json.documents
                .map((doc: any) => fromFirestore(doc))
                .filter((s: Spirit) => s.id) // Filter out invalid documents
                .sort((a: Spirit, b: Spirit) => {
                    // Sort by updatedAt (descending)
                    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                    return dateB - dateA;
                });
        } catch (error) {
            console.error('Error getting new arrivals:', error);
            return [];
        }
    }
};

export const tasteProfileDb = {
    async get(userId: string): Promise<any | null> {
        const token = await getServiceAccountToken();
        // Path: users/{userId}/taste_data/profile
        // Note: 'taste_data' is a subcollection, 'profile' is the document ID
        const path = `users/${userId}/taste_data/profile`;
        const url = `${BASE_URL}/${path}`;

        try {
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 404) return null;
            if (!res.ok) {
                console.warn(`[TasteProfile] Failed to fetch: ${res.status}`);
                return null;
            }

            const doc = await res.json();
            return parseFirestoreFields(doc.fields || {});
        } catch (error) {
            console.error('[TasteProfile] Error fetching:', error);
            return null;
        }
    },

    async save(userId: string, data: any) {
        const token = await getServiceAccountToken();
        const path = `users/${userId}/taste_data/profile`;
        const url = `${BASE_URL}/${path}`;

        // Add userId to data if not present, though path determines location
        const payload = { ...data, userId };

        // Use PATCH to upsert
        const body = toFirestore(payload);

        // Generate UpdateMask for all top-level keys
        const fieldKeys = Object.keys(body.fields);
        const queryParams = new URLSearchParams();
        fieldKeys.forEach(key => queryParams.append('updateMask.fieldPaths', key));

        const patchUrl = `${url}?${queryParams.toString()}`;

        const res = await fetch(patchUrl, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to save taste profile: ${errorText}`);
        }
    },

    async getUsage(userId: string): Promise<{ date: string, count: number }> {
        const token = await getServiceAccountToken();
        const path = `users/${userId}/taste_data/usage`;
        const url = `${BASE_URL}/${path}`;

        try {
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 404) return { date: '', count: 0 };

            const doc = await res.json();
            const data = parseFirestoreFields(doc.fields || {});
            return { date: data.date || '', count: data.count || 0 };
        } catch (error) {
            return { date: '', count: 0 };
        }
    },

    async incrementUsage(userId: string, date: string) {
        const token = await getServiceAccountToken();
        const path = `users/${userId}/taste_data/usage`;
        const url = `${BASE_URL}/${path}`;
        const commitUrl = `${BASE_URL.replace('/documents', '')}:commit`;

        // We need an atomic increment that DOES NOT increment if the date is different
        // But Firestore REST :commit condition is complex.
        // Simplified Logic: Read -> Check -> Write (Optimistic Locking is hard here, so we trust "Latest win" for now or just overwrite)

        // Better approach: Just blindly overwrite if date is different, or increment if same.
        // But to be safe and simple: just read in API route, check logic, then simple upsert here.
        // Actually, let's keep logic in API route and just provide a 'setUsage' here.
        // Renaming to updateUsage for clarity.

        const body = toFirestore({ date, count: 1 }); // Fallback body? No, we want to specify count.
    },

    async setUsage(userId: string, date: string, count: number) {
        const token = await getServiceAccountToken();
        const path = `users/${userId}/taste_data/usage`;
        const url = `${BASE_URL}/${path}`;

        const body = toFirestore({ date, count });
        const fieldKeys = ['date', 'count'];
        const queryParams = new URLSearchParams();
        fieldKeys.forEach(key => queryParams.append('updateMask.fieldPaths', key));

        const patchUrl = `${url}?${queryParams.toString()}`;

        await fetch(patchUrl, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }
};

export const modificationDb = {
    async add(request: Omit<ModificationRequest, 'id'>) {
        if (!PROJECT_ID) {
            throw new Error("FIREBASE_PROJECT_ID is not defined in environment variables.");
        }

        const token = await getServiceAccountToken();
        const collectionPath = 'modification_requests';
        const url = `${BASE_URL}/${collectionPath}`;

        console.log(`[modificationDb] Submitting to ${url}`);

        const body = toFirestore(request);
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[modificationDb] Error: ${res.status}`, errorText);
            throw new Error(`Failed to submit modification request: ${errorText}`);
        }

        const doc = await res.json();
        const id = doc.name.split('/').pop();
        console.log(`[modificationDb] Success: Created document ${id}`);
        return id;
    },

    async getAll(): Promise<ModificationRequest[]> {
        const token = await getServiceAccountToken();
        const collectionPath = getAppPath().modificationRequests;
        const runQueryUrl = `${BASE_URL}:runQuery`;

        const parent = `projects/${PROJECT_ID}/databases/(default)/documents`;

        const res = await fetch(runQueryUrl, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                parent,
                structuredQuery: {
                    from: [{ collectionId: 'modification_requests' }],
                    orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }],
                    limit: 1000
                }
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error(`[modificationDb] Failed to fetch requests:`, errText);
            return [];
        }

        const json = await res.json();
        const results = json
            .filter((r: any) => r.document)
            .map((r: any) => {
                const fields = r.document.fields || {};
                const id = r.document.name.split('/').pop();
                const data: any = { id };

                for (const [key, value] of Object.entries(fields) as [string, any][]) {
                    data[key] = fromFirestoreValue(value);
                }

                return data as ModificationRequest;
            });

        console.log(`[modificationDb] Fetched ${results.length} modification requests`);
        return results;
    },

    async updateStatus(id: string, status: 'pending' | 'checked' | 'resolved'): Promise<void> {
        const token = await getServiceAccountToken();
        const collectionPath = getAppPath().modificationRequests;
        const url = `${BASE_URL}/${collectionPath}/${id}`;

        const payload = { status };
        const converted = toFirestore(payload);

        const patchUrl = `${url}?updateMask.fieldPaths=status`;

        const res = await fetch(patchUrl, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(converted)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[modificationDb] Failed to update status:`, errorText);
            throw new Error(`Failed to update modification request status: ${errorText}`);
        }

        console.log(`[modificationDb] Updated request ${id} to status: ${status}`);
    }
};

