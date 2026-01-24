import { Spirit, SpiritStatus } from '../db/schema';
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
        else if (typeof value === 'object' && !(value instanceof Date)) {
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
    async getAll(status?: SpiritStatus | 'ALL'): Promise<Spirit[]> {
        const token = await getServiceAccountToken();
        const url = `${BASE_URL}/artifacts/graviton94-k-spirits-club-hub/public/data/spirits?pageSize=100`;
        // Note: Filter is not easy in one go via listDocuments REST without StructuredQuery. 
        // For simplicity, we fetch recent 100 or use runQuery.

        let queryUrl = url;

        // Use runQuery for filtering
        const runQueryUrl = `${BASE_URL}:runQuery`;
        const payload: any = {
            structuredQuery: {
                from: [{ collectionId: 'spirits' }],
                limit: 100
            }
        };

        // Note: The COLLECTION_PATH in old db was `artifacts/${appId}/public/data/spirits`.
        // Here we just use 'spirits' assuming it's a root or we need full path.
        // Actually, in the old file: `artifacts/${appId}/public/data/spirits`.
        // Firestore REST `parent` should be `projects/{id}/databases/(default)/documents/artifacts/{appId}/public/data`.
        // Then collectionId = spirits.

        // Simpler approach: Just use standard list if possible, or runQuery with path.
        // Ideally we keep using the full path.
        const parent = `projects/${PROJECT_ID}/databases/(default)/documents/artifacts/graviton94-k-spirits-club-hub/public/data`;

        if (status && status !== 'ALL') {
            payload.structuredQuery.where = {
                fieldFilter: {
                    field: { fieldPath: 'status' },
                    op: 'EQUAL',
                    value: { stringValue: status }
                }
            };
        }

        const res = await fetch(runQueryUrl, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                parent,
                structuredQuery: payload.structuredQuery
            })
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('Firestore REST Error:', err);
            return [];
        }

        const json = await res.json();
        // runQuery returns [{document: ...}, {readTime: ...}]
        return json
            .filter((r: any) => r.document)
            .map((r: any) => fromFirestore(r.document));
    },

    async getById(id: string): Promise<Spirit | null> {
        const token = await getServiceAccountToken();
        const path = `artifacts/graviton94-k-spirits-club-hub/public/data/spirits/${id}`;
        const url = `${BASE_URL}/${path}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 404) return null;
        if (!res.ok) throw new Error(await res.text());

        const doc = await res.json();
        return fromFirestore(doc);
    },

    async upsert(id: string, data: Partial<Spirit>) {
        const token = await getServiceAccountToken();
        const path = `artifacts/graviton94-k-spirits-club-hub/public/data/spirits/${id}`;
        const url = `${BASE_URL}/${path}?updateMask.fieldPaths=status&updateMask.fieldPaths=updatedAt&updateMask.fieldPaths=imageUrl&updateMask.fieldPaths=thumbnailUrl&updateMask.fieldPaths=metadata`;

        // Construct Update Mask dynamically based on data keys
        const fieldPaths = Object.keys(data).filter(k => k !== 'id').map(k => `updateMask.fieldPaths=${k}`).join('&');
        const patchUrl = `${BASE_URL}/${path}?${fieldPaths}`;

        const body = toFirestore({ ...data, updatedAt: new Date().toISOString() });

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
            const path = `artifacts/graviton94-k-spirits-club-hub/public/data/spirits/${id}`;
            await fetch(`${BASE_URL}/${path}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
        }
    }
};
