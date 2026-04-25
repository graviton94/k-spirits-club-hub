// lib/db/data-connect-admin.ts
import { getGoogleAccessToken } from '@/lib/auth/google-auth';
import { getEnv } from '@/lib/env';

/**
 * LITE VERSION for Cloudflare Workers (High Compatibility Edition)
 */

const DEFAULT_LOCATION = 'asia-northeast3';
const DEFAULT_SERVICE_ID = 'k-spirits-club-hub';

async function executeGraphql(operationName: string, query: string, variables: any = {}) {
    const projectId = getEnv('FIREBASE_PROJECT_ID') || getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    const clientEmail = getEnv('FIREBASE_CLIENT_EMAIL');
    const privateKey = getEnv('FIREBASE_PRIVATE_KEY');
    
    // Allow overriding from env or use defaults
    const location = getEnv('DATA_CONNECT_LOCATION') || DEFAULT_LOCATION;
    const serviceId = getEnv('DATA_CONNECT_SERVICE_ID') || DEFAULT_SERVICE_ID;

    // Validate Environment with detailed missing info
    if (!projectId || !clientEmail || !privateKey) {
        const missing = [];
        if (!projectId) missing.push('PROJECT_ID');
        if (!clientEmail) missing.push('CLIENT_EMAIL');
        if (!privateKey) missing.push('PRIVATE_KEY');
        
        const errorMsg = `[Data Connect Admin] Missing Vars: ${missing.join(', ')}. Check /api/health.`;
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        const accessToken = await getGoogleAccessToken();
        // CORRECT ENDPOINT: firebasedataconnect.googleapis.com
        const url = `https://firebasedataconnect.googleapis.com/v1/projects/${projectId}/locations/${location}/services/${serviceId}:executeGraphql`;

        console.log(`[Data Connect Admin] Calling ${operationName} at ${location}/${serviceId}`);

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Goog-Cloud-Resource-Prefix': `projects/${projectId}/locations/${location}/services/${serviceId}`
            },
            body: JSON.stringify({
                operationName,
                query,
                variables
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            const logMsg = `[Data Connect Admin] REST Error (${res.status}) for ${operationName} at ${url}: ${errorText}`;
            console.error(logMsg);
            throw new Error(`Data Connect REST Error (${res.status}): ${errorText.substring(0, 200)}...`);
        }

        const body = await res.json() as any;
        if (body.errors) {
            console.error(`[Data Connect Admin] GQL Errors for ${operationName}:`, JSON.stringify(body.errors));
            throw new Error(`GQL Error: ${body.errors[0]?.message || 'Unknown GraphQL error'}`);
        }
        return body;
    } catch (err: any) {
        console.error(`[Data Connect Admin] ${operationName} CRITICAL FAILURE:`, err.message);
        throw err;
    }
}

// --- Admin REST Implementation Functions ---

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
    return await executeGraphql('upsertSpirit', query, vars);
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
