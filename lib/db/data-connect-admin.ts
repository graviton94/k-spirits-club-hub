// lib/db/data-connect-admin.ts
import { getGoogleAccessToken } from '@/lib/auth/google-auth';

/**
 * LITE VERSION for Cloudflare Workers.
 * Replaces 'firebase-admin/data-connect' with standard REST calls.
 * This saves ~15MB of bundle size caused by firebase-admin dependencies.
 */

const LOCATION = 'asia-northeast3';
const SERVICE_ID = 'k-spirits-club-hub';

async function executeGraphql(operationName: string, query: string, variables: any = {}) {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const accessToken = await getGoogleAccessToken();
    const url = `https://dataconnect.googleapis.com/v1/projects/${projectId}/locations/${LOCATION}/services/${SERVICE_ID}:executeGraphql`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Goog-Cloud-Resource-Prefix': `projects/${projectId}/locations/${LOCATION}/services/${SERVICE_ID}`
        } as any,
        body: JSON.stringify({
            operationName,
            query,
            variables
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error(`[Data Connect Admin] ❌ REST Error (${res.status}):`, errorText);
        throw new Error(`Data Connect Admin Error (${res.status}): ${errorText}`);
    }

    const body = await res.json() as any;
    if (body.errors) {
        console.error(`[Data Connect Admin] ❌ GQL Error:`, JSON.stringify(body.errors));
        throw new Error(`Data Connect GQL Error: ${JSON.stringify(body.errors)}`);
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
    return data.userCabinets;
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
    return data.spiritReviews;
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
    return data.user;
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
    return data.spirits;
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
