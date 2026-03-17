import { Spirit } from './schema';
import { getAppPath } from './paths';

const PUBLIC_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.FIREBASE_PROJECT_ID ||
  'k-spirits-club';

const PUBLIC_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  'AIzaSyAOVKaysc-eFVXnCtWQR_BU4RArp76BkcQ';

const PUBLIC_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PUBLIC_PROJECT_ID}/databases/(default)/documents`;

function fromFirestoreValue(value: any): any {
  if (!value) return null;

  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('timestampValue' in value) return value.timestampValue;

  if (value.arrayValue) {
    return (value.arrayValue.values || []).map((entry: any) => fromFirestoreValue(entry));
  }

  if (value.mapValue) {
    const obj: Record<string, unknown> = {};
    const fields = value.mapValue.fields || {};

    for (const [key, entry] of Object.entries(fields)) {
      obj[key] = fromFirestoreValue(entry);
    }

    return obj;
  }

  return null;
}

function fromFirestoreDoc(doc: any): Spirit {
  const fields = doc.fields || {};
  const id = doc.name.split('/').pop();
  const data: Record<string, unknown> = { id };

  for (const [key, value] of Object.entries(fields)) {
    data[key] = fromFirestoreValue(value);
  }

  return data as unknown as Spirit;
}

async function fetchPublicJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function getPublicSpiritById(id: string): Promise<Spirit | null> {
  const collectionPath = getAppPath().spirits;
  const url = `${PUBLIC_BASE_URL}/${collectionPath}/${id}?key=${PUBLIC_API_KEY}`;
  const doc = await fetchPublicJson(url);

  if (!doc) {
    return null;
  }

  return fromFirestoreDoc(doc);
}

export async function getPublicLatestFeatured(category: string, limit: number = 6): Promise<Spirit[]> {
  const url = `${PUBLIC_BASE_URL}:runQuery?key=${PUBLIC_API_KEY}`;
  const queryResult = await fetchPublicJson(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: `projects/${PUBLIC_PROJECT_ID}/databases/(default)/documents`,
      structuredQuery: {
        from: [{ collectionId: getAppPath().spirits }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'isPublished' },
            op: 'EQUAL',
            value: { booleanValue: true },
          },
        },
        orderBy: [{ field: { fieldPath: 'updatedAt' }, direction: 'DESCENDING' }],
        limit: 250,
      },
    }),
  });

  const docs = Array.isArray(queryResult)
    ? queryResult.filter((entry: any) => entry.document).map((entry: any) => fromFirestoreDoc(entry.document))
    : [];

  return docs
    .filter((spirit) => spirit.category === category && spirit.isPublished)
    .slice(0, limit);
}
