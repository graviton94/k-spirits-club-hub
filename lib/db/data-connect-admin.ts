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
                isWishlist
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
                    noseTags
                    palateTags
                    finishTags
                    tastingNote
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
    search?: string;
    limit?: number;
    offset?: number;
}) => {
    // When no search term is provided, fetch all published spirits (broad listing for AI context)
    if (!vars.search) {
        const query = `
            query listSpiritsPublic($limit: Int, $offset: Int) {
                spirits(
                    limit: $limit,
                    offset: $offset,
                    where: { isPublished: { eq: true } }
                ) {
                    id
                    name
                    nameEn
                    category
                    categoryEn
                    mainCategory
                    subcategory
                    imageUrl
                    thumbnailUrl
                    abv
                    volume
                    distillery
                    bottler
                    country
                    region
                    tastingNote
                }
            }
        `;
        const { data } = await executeGraphql('listSpiritsPublic', query, { limit: vars.limit, offset: vars.offset });
        return data?.spirits || [];
    }

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
                categoryEn
                mainCategory
                subcategory
                imageUrl
                thumbnailUrl
                abv
                volume
                distillery
                bottler
                country
                region
                tastingNote
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
    // Build WHERE conditions dynamically to avoid null-filter mismatches
    const andConditions: string[] = [];
    const variables: Record<string, any> = {
        limit: vars.limit,
        offset: vars.offset
    };

    if (vars.category !== undefined) {
        andConditions.push('{ category: { eq: $category } }');
        variables.category = vars.category;
    }
    if (vars.isPublished !== undefined) {
        andConditions.push('{ isPublished: { eq: $isPublished } }');
        variables.isPublished = vars.isPublished;
    }
    if (vars.search) {
        andConditions.push('{ _or: [{ name: { contains: $search } }, { nameEn: { contains: $search } }] }');
        variables.search = vars.search;
    }

    const whereClause = andConditions.length > 0
        ? `, where: { _and: [${andConditions.join(', ')}] }`
        : '';

    const paramDeclarations = [
        '$limit: Int', '$offset: Int',
        vars.category !== undefined ? '$category: String' : null,
        vars.isPublished !== undefined ? '$isPublished: Boolean' : null,
        vars.search ? '$search: String' : null,
    ].filter(Boolean).join(', ');

    const query = `
        query adminListRawSpirits(${paramDeclarations}) {
            spirits(
                limit: $limit,
                offset: $offset${whereClause},
                orderBy: [{ updatedAt: DESC }]
            ) {
                id
                name
                nameEn
                category
                subcategory
                distillery
                abv
                imageUrl
                thumbnailUrl
                isPublished
                isReviewed
                status
                updatedAt
            }
        }
    `;
    const { data } = await executeGraphql('adminListRawSpirits', query, variables);
    return data?.spirits || [];
};

export const dbAdminUpsertSpirit = async (vars: any) => {
    const query = `
        mutation upsertSpirit(
            $id: String!, 
            $name: String!, 
            $category: String!,
            $nameEn: String,
            $categoryEn: String,
            $mainCategory: String,
            $subcategory: String,
            $distillery: String,
            $bottler: String,
            $abv: Float,
            $volume: Int,
            $country: String,
            $region: String,
            $imageUrl: String!, 
            $thumbnailUrl: String, 
            $descriptionKo: String,
            $descriptionEn: String,
            $pairingGuideKo: String,
            $pairingGuideEn: String,
            $isPublished: Boolean,
            $noseTags: [String!],
            $palateTags: [String!],
            $finishTags: [String!],
            $tastingNote: String,
            $status: String,
            $isReviewed: Boolean,
            $reviewedBy: String,
            $reviewedAt: Timestamp,
            $importer: String,
            $rawCategory: String,
            $metadata: Any,
            $updatedAt: Timestamp
        ) {
            spirit_upsert(data: {
                id: $id,
                name: $name,
                category: $category,
                nameEn: $nameEn,
                categoryEn: $categoryEn,
                mainCategory: $mainCategory,
                subcategory: $subcategory,
                distillery: $distillery,
                bottler: $bottler,
                abv: $abv,
                volume: $volume,
                country: $country,
                region: $region,
                imageUrl: $imageUrl,
                thumbnailUrl: $thumbnailUrl,
                descriptionKo: $descriptionKo,
                descriptionEn: $descriptionEn,
                pairingGuideKo: $pairingGuideKo,
                pairingGuideEn: $pairingGuideEn,
                isPublished: $isPublished,
                noseTags: $noseTags,
                palateTags: $palateTags,
                finishTags: $finishTags,
                tastingNote: $tastingNote,
                status: $status,
                isReviewed: $isReviewed,
                reviewedBy: $reviewedBy,
                reviewedAt: $reviewedAt,
                importer: $importer,
                rawCategory: $rawCategory,
                metadata: $metadata,
                updatedAt: $updatedAt
            }) {
                id
            }
        }
    `;
    // Clean variables to only include those in the mutation signature
    const allowed = [
        'id', 'name', 'category', 'nameEn', 'categoryEn', 'mainCategory', 'subcategory',
        'distillery', 'bottler', 'abv', 'volume', 'country', 'region', 'imageUrl', 
        'thumbnailUrl', 'descriptionKo', 'descriptionEn', 'pairingGuideKo', 'pairingGuideEn',
        'isPublished', 'noseTags', 'palateTags', 'finishTags', 'tastingNote',
        'status', 'isReviewed', 'reviewedBy', 'reviewedAt',
        'importer', 'rawCategory', 'metadata', 'updatedAt'
    ];
    const filtered: any = { updatedAt: new Date().toISOString() };
    allowed.forEach(key => { if (key in vars) filtered[key] = vars[key]; });
    
    return await executeGraphql('upsertSpirit', query, filtered);
};

export const dbAdminUpsertNewArrival = async (vars: {
    id: string;
    spiritId: string;
    displayOrder?: number;
    tags?: string[];
}) => {
    const query = `
        mutation upsertNewArrival($id: String!, $spiritId: String!, $displayOrder: Int, $tags: [String!]) {
            newArrival_upsert(data: {
                id: $id,
                spiritId: $spiritId,
                displayOrder: $displayOrder,
                tags: $tags
            }) {
                id
            }
        }
    `;
    return await executeGraphql('upsertNewArrival', query, vars);
};

export const dbAdminUpsertAiDiscoveryLog = async (vars: {
    id: string;
    userId?: string | null;
    analysis?: string;
    recommendations?: any;
    messageHistory?: any;
}) => {
    const query = `
        mutation upsertAiDiscoveryLog($id: String!, $userId: String, $analysis: String, $recommendations: Any, $messageHistory: Any) {
            aiDiscoveryLog_upsert(data: {
                id: $id,
                userId: $userId,
                analysis: $analysis,
                recommendations: $recommendations,
                messageHistory: $messageHistory
            }) {
                id
            }
        }
    `;
    return await executeGraphql('upsertAiDiscoveryLog', query, vars);
};

export const dbAdminListAiDiscoveryLogs = async (limit: number) => {
    const query = `
        query listAiDiscoveryLogs($limit: Int!) {
            aiDiscoveryLogs(limit: $limit, orderBy: [{ createdAt: DESC }]) {
                id
                userId
                analysis
                recommendations
                messageHistory
                createdAt
            }
        }
    `;
    const { data } = await executeGraphql('listAiDiscoveryLogs', query, { limit });
    return data?.aiDiscoveryLogs || [];
};

export const dbAdminListNewArrivals = async (limit: number) => {
    const query = `
        query listNewArrivalsFromCuration($limit: Int) {
            newArrivals(
                limit: $limit,
                orderBy: [{ displayOrder: DESC }, { createdAt: DESC }]
            ) {
                id
                spirit {
                    id
                    name
                    nameEn
                    category
                    categoryEn
                    imageUrl
                    thumbnailUrl
                    country
                    abv
                    distillery
                    descriptionKo
                    descriptionEn
                    isPublished
                    createdAt
                    updatedAt
                }
            }
        }
    `;
    const { data } = await executeGraphql('listNewArrivalsFromCuration', query, { limit });
    const rows = data?.newArrivals || [];
    return rows
        .map((row: any) => row.spirit)
        .filter((spirit: any) => spirit && spirit.isPublished);
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
                tags: $tags
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

export const dbAdminGetSpirit = async (id: string) => {
    const query = `
        query getSpirit($id: String!) {
            spirit(id: $id) {
                id
                name
                nameEn
                category
                categoryEn
                mainCategory
                subcategory
                distillery
                bottler
                abv
                volume
                country
                region
                imageUrl
                thumbnailUrl
                descriptionKo
                descriptionEn
                pairingGuideKo
                pairingGuideEn
                noseTags
                palateTags
                finishTags
                tastingNote
                status
                isPublished
                isReviewed
                rating
                reviewCount
                metadata
            }
        }
    `;
    const { data } = await executeGraphql('getSpirit', query, { id });
    return data?.spirit || null;
};

export const dbAdminListSpirits = async (vars: { category?: string; subcategory?: string; country?: string } = {}) => {
    const andConditions: string[] = ['{ isPublished: { eq: true } }'];
    const variables: Record<string, any> = {};
    const paramDeclarations: string[] = [];

    if (vars.category) {
        andConditions.push('{ category: { eq: $category } }');
        variables.category = vars.category;
        paramDeclarations.push('$category: String');
    }
    if (vars.subcategory) {
        andConditions.push('{ subcategory: { eq: $subcategory } }');
        variables.subcategory = vars.subcategory;
        paramDeclarations.push('$subcategory: String');
    }
    if (vars.country) {
        andConditions.push('{ country: { eq: $country } }');
        variables.country = vars.country;
        paramDeclarations.push('$country: String');
    }

    const whereClause = `where: { _and: [${andConditions.join(', ')}] }`;
    const params = paramDeclarations.length > 0 ? `(${paramDeclarations.join(', ')})` : '';

    const query = `
        query listSpirits${params} {
            spirits(${whereClause}) {
                id
                name
                nameEn
                category
                categoryEn
                imageUrl
                thumbnailUrl
                isPublished
                abv
                distillery
                rating
                reviewCount
            }
        }
    `;
    const { data } = await executeGraphql('listSpirits', query, variables);
    return data?.spirits || [];
};

export const dbAdminGetWorldCupResult = async (id: string) => {
    const query = `
        query getWorldCupResult($id: UUID!) {
            worldCupResult(id: $id) {
                id
                winner {
                    id
                    name
                    nameEn
                    imageUrl
                    thumbnailUrl
                    category
                    categoryEn
                    subcategory
                    distillery
                    abv
                    country
                    region
                    noseTags
                    palateTags
                    finishTags
                }
                category
                subcategory
                initialRound
                timestamp
            }
        }
    `;
    const { data } = await executeGraphql('getWorldCupResult', query, { id });
    return data?.worldCupResult || null;
};

export const dbAdminListSpiritReviews = async (limit: number, offset: number) => {
    const query = `
        query listSpiritReviews($limit: Int, $offset: Int) {
            spiritReviews(
                where: { isPublished: { eq: true } },
                limit: $limit,
                offset: $offset,
                orderBy: [{ createdAt: DESC }]
            ) {
                id
                rating
                title
                content
                nose
                palate
                finish
                imageUrls
                createdAt
                spirit {
                    id
                    name
                    nameEn
                    imageUrl
                    distillery
                }
                user {
                    id
                    nickname
                    profileImage
                }
            }
        }
    `;
    const { data } = await executeGraphql('listSpiritReviews', query, { limit, offset });
    return data?.spiritReviews || [];
};

export const dbAdminListNewsArticles = async (limit: number, offset: number) => {
    const query = `
        query listNewsArticles($limit: Int, $offset: Int) {
            newsArticles(limit: $limit, offset: $offset, orderBy: [{ date: DESC }, { createdAt: DESC }]) {
                id
                title
                content
                imageUrl
                category
                source
                link
                date
                translations
                tags
                createdAt
            }
        }
    `;
    const { data } = await executeGraphql('listNewsArticles', query, { limit, offset });
    return data?.newsArticles || [];
};

export const dbAdminGetNewsCount = async () => {
    const query = `
        query auditAllNews {
            newsArticles {
                id
            }
        }
    `;
    const { data } = await executeGraphql('auditAllNews', query);
    return (data?.newsArticles || []).length;
};

export const dbAdminGetReviewDetail = async (id: string) => {
    const query = `
        query getReviewDetail($id: UUID!) {
            spiritReview(id: $id) {
                id
                rating
                title
                content
                nose
                palate
                finish
                likes
                imageUrls
                createdAt
                spirit {
                    id
                    name
                    nameEn
                    imageUrl
                    category
                    distillery
                    abv
                }
                user {
                    id
                    nickname
                    profileImage
                }
            }
        }
    `;
    const { data } = await executeGraphql('getReviewDetail', query, { id });
    return data?.spiritReview || null;
};

export const dbAdminUpsertCabinet = async (vars: {
    userId: string;
    spiritId: string;
    addedAt?: string;
    notes?: string;
    rating?: number;
    isFavorite?: boolean;
    isWishlist?: boolean;
}) => {
    const query = `
        mutation upsertCabinet($userId: String!, $spiritId: String!, $addedAt: Timestamp, $notes: String, $rating: Int, $isFavorite: Boolean, $isWishlist: Boolean) {
            userCabinet_upsert(data: {
                userId: $userId,
                spiritId: $spiritId,
                addedAt: $addedAt,
                notes: $notes,
                rating: $rating,
                isFavorite: $isFavorite,
                isWishlist: $isWishlist
            })
        }
    `;
    const allowed = ['userId', 'spiritId', 'addedAt', 'notes', 'rating', 'isFavorite', 'isWishlist'];
    const filtered: any = {};
    allowed.forEach(key => { if (key in vars) filtered[key] = (vars as any)[key]; });
    return await executeGraphql('upsertCabinet', query, filtered);
};

export const dbAdminDeleteCabinet = async (vars: { userId: string; spiritId: string }) => {
    const query = `
        mutation deleteCabinet($userId: String!, $spiritId: String!) {
            userCabinet_delete(key: { userId: $userId, spiritId: $spiritId }) {
                userId
            }
        }
    `;
    return await executeGraphql('deleteCabinet', query, vars);
};

export const dbAdminFindReview = async (vars: { userId: string; spiritId: string }) => {
    const query = `
        query findReview($userId: String!, $spiritId: String!) {
            spiritReviews(where: { userId: { eq: $userId }, spiritId: { eq: $spiritId } }) {
                id
                likes
            }
        }
    `;
    const { data } = await executeGraphql('findReview', query, vars);
    return data?.spiritReviews?.[0] || null;
};

export const dbAdminUpsertReview = async (vars: {
    id: string;
    spiritId: string;
    userId: string;
    rating: number;
    title?: string;
    content: string;
    nose?: string;
    palate?: string;
    finish?: string;
    likes?: number;
    isPublished?: boolean;
    imageUrls?: string[];
    createdAt?: string;
    updatedAt?: string;
}) => {
    const query = `
        mutation upsertReview(
            $id: UUID!,
            $spiritId: String!,
            $userId: String!,
            $rating: Int!,
            $title: String,
            $content: String!,
            $nose: String,
            $palate: String,
            $finish: String,
            $likes: Int,
            $isPublished: Boolean,
            $imageUrls: [String!],
            $createdAt: Timestamp,
            $updatedAt: Timestamp
        ) {
            spiritReview_upsert(data: {
                id: $id,
                spiritId: $spiritId,
                userId: $userId,
                rating: $rating,
                title: $title,
                content: $content,
                nose: $nose,
                palate: $palate,
                finish: $finish,
                likes: $likes,
                isPublished: $isPublished,
                imageUrls: $imageUrls,
                createdAt: $createdAt,
                updatedAt: $updatedAt
            }) {
                id
            }
        }
    `;
    return await executeGraphql('upsertReview', query, vars);
};

export const dbAdminIncrementUserReviews = async (userId: string) => {
    const profile = await dbAdminGetUserProfile(userId);
    if (!profile) return;
    const query = `
        mutation upsertUser($id: String!, $reviewsWritten: Int) {
            user_upsert(data: {
                id: $id,
                reviewsWritten: $reviewsWritten
            })
        }
    `;
    return await executeGraphql('upsertUser', query, {
        id: userId,
        reviewsWritten: (profile.reviewsWritten || 0) + 1
    });
};

export const dbAdminUpsertReviewLike = async (vars: { userId: string; reviewId: string }) => {
    const query = `
        mutation upsertReviewLike($userId: String!, $reviewId: UUID!) {
            reviewLike_upsert(data: { userId: $userId, reviewId: $reviewId })
        }
    `;
    return await executeGraphql('upsertReviewLike', query, vars);
};

export const dbAdminDeleteReviewLike = async (vars: { userId: string; reviewId: string }) => {
    const query = `
        mutation deleteReviewLike($userId: String!, $reviewId: UUID!) {
            reviewLike_delete(key: { userId: $userId, reviewId: $reviewId }) {
                userId
            }
        }
    `;
    return await executeGraphql('deleteReviewLike', query, vars);
};

export const dbAdminUpdateReviewLikesCount = async (vars: { id: string; likes: number }) => {
    const query = `
        mutation updateReviewLikesCount($id: UUID!, $likes: Int!) {
            spiritReview_update(key: { id: $id }, data: { likes: $likes }) {
                id
            }
        }
    `;
    return await executeGraphql('updateReviewLikesCount', query, vars);
};

export const dbAdminUpsertReviewComment = async (vars: { id: string; reviewId: string; userId: string; content: string; updatedAt?: string }) => {
    const query = `
        mutation upsertReviewComment($id: UUID!, $reviewId: UUID!, $userId: String!, $content: String!, $updatedAt: Timestamp) {
            reviewComment_upsert(data: { id: $id, reviewId: $reviewId, userId: $userId, content: $content, updatedAt: $updatedAt })
        }
    `;
    return await executeGraphql('upsertReviewComment', query, vars);
};

export const dbAdminDeleteReviewComment = async (id: string) => {
    const query = `
        mutation deleteReviewComment($id: UUID!) {
            reviewComment_delete(key: { id: $id }) {
                id
            }
        }
    `;
    return await executeGraphql('deleteReviewComment', query, { id });
};

export const dbAdminListAllCategories = async () => {
    const query = `
        query listAllCategories {
            spirits(where: { isPublished: { eq: true } }) {
                category
                categoryEn
            }
        }
    `;
    const { data } = await executeGraphql('listAllCategories', query);
    const unique = new Map<string, string | null | undefined>();
    (data?.spirits || []).forEach((s: { category: string; categoryEn?: string | null }) => {
        if (s.category && !unique.has(s.category)) {
            unique.set(s.category, s.categoryEn);
        }
    });
    return Array.from(unique.entries()).map(([ko, en]) => ({ ko, en }));
};

export const dbAdminListAllSubcategories = async (category?: string) => {
    const whereClause = category
        ? `where: { _and: [{ isPublished: { eq: true } }, { category: { eq: $category } }] }`
        : `where: { isPublished: { eq: true } }`;
    const paramDecl = category ? '($category: String)' : '';
    const query = `
        query listAllSubcategories${paramDecl} {
            spirits(${whereClause}) {
                subcategory
            }
        }
    `;
    const { data } = await executeGraphql('listAllSubcategories', query, category ? { category } : {});
    const unique = new Set<string>(
        (data?.spirits || []).map((s: { subcategory?: string | null }) => s.subcategory).filter(Boolean)
    );
    return Array.from(unique) as string[];
};
