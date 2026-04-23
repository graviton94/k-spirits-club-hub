// lib/db/data-connect-admin.ts
import { getGoogleAccessToken } from '@/lib/auth/google-auth';

/**
 * LITE VERSION for Cloudflare Workers (Extreme Reliability Edition)
 * Replaces 'firebase-admin/data-connect' with standard REST calls.
 */

const LOCATION = 'asia-northeast3';
const SERVICE_ID = 'k-spirits-club-hub';

async function executeGraphql(operationName: string, query: string, variables: any = {}) {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Validate Environment
    if (!projectId || !clientEmail || !privateKey) {
        const missing = [];
        if (!projectId) missing.push('PROJECT_ID');
        if (!clientEmail) missing.push('CLIENT_EMAIL');
        if (!privateKey) missing.push('PRIVATE_KEY');
        throw new Error(`[Data Connect Admin] Missing Credentials: ${missing.join(', ')}`);
    }

    try {
        const accessToken = await getGoogleAccessToken();
        const url = `https://dataconnect.googleapis.com/v1/projects/${projectId}/locations/${LOCATION}/services/${SERVICE_ID}:executeGraphql`;

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Goog-Cloud-Resource-Prefix': `projects/${projectId}/locations/${LOCATION}/services/${SERVICE_ID}`
            },
            body: JSON.stringify({
                operationName,
                query,
                variables
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[Data Connect Admin] ❌ REST API Failure (${res.status}):`, errorText);
            throw new Error(`Data Connect REST API Failed (${res.status}): ${errorText}`);
        }

        const body = await res.json() as any;
        if (body.errors) {
            console.error(`[Data Connect Admin] ❌ GraphQL Error:`, JSON.stringify(body.errors));
            throw new Error(`Data Connect GQL Error: ${JSON.stringify(body.errors[0]?.message || body.errors)}`);
        }
        return body;
    } catch (err: any) {
        console.error(`[Data Connect Admin] ❌ Execution Panic:`, err.message);
        throw err;
    }
}

// --- REST Admin Implementation Functions ---

export const dbAdminListUserCabinet = async (userId: string) => {
    const query = `
        query listUserCabinet($userId: String!) {
            userCabinets(where: { userId: { eq: $userId } }) {
                spiritId
                isFavorite
                notes
                rating
                spirit {
                    id
                    name
                    category
                    imageUrl
                    thumbnailUrl
                    abv
                    distillery
                }
            }
        }
    `;
    const { data } = await executeGraphql('listUserCabinet', query, { userId });
    return data?.userCabinets || [];
};

export const dbAdminListUserReviews = async (userId: string) => {
    const query = `
        query listUserReviews($userId: String!) {
            spiritReviews(where: { userId: { eq: $userId } }) {
                id
                spiritId
                rating
                content
                nose
                palate
                finish
                createdAt
            }
        }
    `;
    const { data } = await executeGraphql('listUserReviews', query, { userId });
    return data?.spiritReviews || [];
};

export const dbAdminGetUserProfile = async (id: string) => {
    const query = `
        query getUserProfile($id: String!) {
            user(id: $id) {
                id
                nickname
                profileImage
                role
                themePreference
                isFirstLogin
                reviewsWritten
                heartsReceived
                tasteProfile
            }
        }
    `;
    const { data } = await executeGraphql('getUserProfile', query, { id });
    return data?.user || null;
};

export const dbAdminUpsertUser = async (vars: any) => {
    const query = `
        mutation upsertUser($id: String!, $email: String, $nickname: String, $profileImage: String, $role: String, $themePreference: String, $isFirstLogin: Boolean, $reviewsWritten: Int, $heartsReceived: Int, $tasteProfile: Any) {
            user_upsert(data: {
                id: $id,
                email: $email,
                nickname: $nickname,
                profileImage: $profileImage,
                role: $role,
                themePreference: $themePreference,
                isFirstLogin: $isFirstLogin,
                reviewsWritten: $reviewsWritten,
                heartsReceived: $heartsReceived,
                tasteProfile: $tasteProfile
            })
        }
    `;
    return await executeGraphql('upsertUser', query, vars);
};

export const dbAdminSearchSpiritsPublic = async (vars: {
    search: string;
    limit?: number;
    offset?: number;
}) => {
    const query = `
        query searchSpiritsPublic($search: String, $limit: Int, $offset: Int) {
            spirits(
                limit: $limit,
                offset: $offset,
                where: {
                    _and: [
                        { isPublished: { eq: true } },
                        {
                            _or: [
                                { name: { contains: $search } },
                                { nameEn: { contains: $search } },
                                { distillery: { contains: $search } }
                            ]
                        }
                    ]
                }
            ) {
                id
                name
                nameEn
                category
                imageUrl
                thumbnailUrl
                abv
                distillery
            }
        }
    `;
    const { data } = await executeGraphql('searchSpiritsPublic', query, vars);
    return data?.spirits || [];
};

export const dbAdminListRawSpirits = async (vars: {
    limit?: number;
    offset?: number;
    category?: string;
    isPublished?: boolean;
    search?: string;
}) => {
    const query = `
        query adminListRawSpirits($limit: Int, $offset: Int, $category: String, $isPublished: Boolean, $search: String) {
            spirits(
                limit: $limit,
                offset: $offset,
                where: {
                    _and: [
                        { category: { eq: $category } },
                        { isPublished: { eq: $isPublished } },
                        {
                            _or: [
                                { name: { contains: $search } },
                                { nameEn: { contains: $search } }
                            ]
                        }
                    ]
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
    return data?.spirits || [];
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
    const normalized = {
        ...vars,
        imageUrl: vars.imageUrl?.replace(/^http:\/\//i, 'https://'),
        thumbnailUrl: vars.thumbnailUrl?.replace(/^http:\/\//i, 'https://')
    };
    return await executeGraphql('upsertSpirit', query, normalized);
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
    return (data?.newsArticles || []).map((n: any) => n.link).filter(Boolean);
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
                newsTags: $tags
            }) {
                id
            }
        }
    `;
    return await executeGraphql('upsertNews', query, vars);
};

// --- Audit Queries ---
export const auditAllNews = async () => {
    const query = `
        query auditAllNews {
            newsArticles {
                id
                title
                link
                translations
            }
        }
    `;
    return await executeGraphql('auditAllNews', query);
};
