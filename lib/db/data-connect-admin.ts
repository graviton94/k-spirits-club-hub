// lib/db/data-connect-admin.ts
import { getGoogleAccessToken } from '@/lib/auth/google-auth';

/**
 * LITE VERSION for Cloudflare Workers.
 * Replaces 'firebase-admin/data-connect' with standard REST calls.
 * This saves ~15MB of bundle size caused by firebase-admin dependencies.
 */

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const LOCATION = 'asia-northeast3';
const SERVICE_ID = 'k-spirits-club-hub';

async function executeGraphql(operationName: string, query: string, variables: any = {}) {
    const accessToken = await getGoogleAccessToken();
    const url = `https://dataconnect.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/services/${SERVICE_ID}:executeGraphql`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Goog-Cloud-Resource-Prefix': `projects/${PROJECT_ID}/locations/${LOCATION}/services/${SERVICE_ID}`
        },
        body: JSON.stringify({
            operationName,
            query,
            variables
        }),
    });

    const body = await res.json() as any;
    if (!res.ok) {
        throw new Error(`Data Connect Admin Error: ${JSON.stringify(body)}`);
    }
    return body;
}

// --- Admin Queries ---

export const dbAdminListNewsLinks = async () => {
    const query = `
        query auditAllNews {
            newsArticles {
                id
                link
            }
        }
    `;
    const { data } = await executeGraphql('auditAllNews', query);
    return data.newsArticles.map((n: any) => n.link).filter(Boolean);
};

export const dbAdminListRawSpirits = async (vars: {
    limit?: number;
    offset?: number;
    category?: string;
    isPublished?: boolean;
}) => {
    const query = `
        query adminListRawSpirits($limit: Int, $offset: Int, $category: String, $isPublished: Boolean) {
            spirits(
                limit: $limit,
                offset: $offset,
                where: {
                    category: { eq: $category },
                    isPublished: { eq: $isPublished }
                },
                orderBy: [{ updatedAt: DESC }]
            ) {
                id
                name
                imageUrl
                updatedAt
            }
        }
    `;
    const { data } = await executeGraphql('adminListRawSpirits', query, vars);
    return data.spirits;
};

export const dbAdminUpsertSpirit = async (vars: any) => {
    const query = `
        mutation upsertSpirit($id: String!, $name: String!, $imageUrl: String, $thumbnailUrl: String, $isPublished: Boolean) {
            spirit_upsert(data: {
                id: $id,
                name: $name,
                imageUrl: $imageUrl,
                thumbnailUrl: $thumbnailUrl,
                isPublished: $isPublished
            }) {
                id
            }
        }
    `;
    // We assume the normalization (http -> https) happens at a higher level or here
    const normalized = {
        ...vars,
        imageUrl: vars.imageUrl?.replace(/^http:\/\//i, 'https://'),
        thumbnailUrl: vars.thumbnailUrl?.replace(/^http:\/\//i, 'https://')
    };
    return await executeGraphql('upsertSpirit', query, normalized);
};

export const dbAdminUpsertNews = async (vars: any) => {
    const query = `
        mutation upsertNews($id: String!, $title: String!, $content: String!, $link: String, $source: String, $date: String, $translations: Any, $tags: Any) {
            newsArticle_upsert(data: {
                id: $id,
                title: $title,
                content: $content,
                link: $link,
                source: $source,
                date: $date,
                translations: $translations,
                tags: $tags
            }) {
                id
            }
        }
    `;
    return await executeGraphql('upsertNews', query, vars);
};

export const dbAdminDeleteSpirit = async (id: string) => {
    const query = `
        mutation deleteSpirit($id: String!) {
            spirit_delete(key: { id: $id }) {
                id
            }
        }
    `;
    return await executeGraphql('deleteSpirit', query, { id });
};

// Export audit queries as requested by other modules
export const auditAllNews = async () => {
    const query = `
        query auditAllNews {
            newsArticles {
                id
                title
                link
            }
        }
    `;
    return await executeGraphql('auditAllNews', query);
};
