import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AdminListRawSpiritsData {
  spirits: ({
    id: string;
    name: string;
    nameEn?: string | null;
    category: string;
    categoryEn?: string | null;
    isPublished?: boolean | null;
    status?: string | null;
    updatedAt: TimestampString;
    imageUrl: string;
    thumbnailUrl?: string | null;
    abv?: number | null;
    distillery?: string | null;
    region?: string | null;
    subcategory?: string | null;
  } & Spirit_Key)[];
}

export interface AdminListRawSpiritsVariables {
  limit?: number | null;
  offset?: number | null;
  category?: string | null;
  distillery?: string | null;
  isPublished?: boolean | null;
  search?: string | null;
}

export interface AiDiscoveryLog_Key {
  id: string;
  __typename?: 'AiDiscoveryLog_Key';
}

export interface AuditAllNewsData {
  newsArticles: ({
    id: string;
    title: string;
    translations?: unknown | null;
  } & NewsArticle_Key)[];
}

export interface AuditAllReviewsData {
  spiritReviews: ({
    id: UUIDString;
    spirit: {
      id: string;
      name: string;
    } & Spirit_Key;
      user: {
        id: string;
        nickname?: string | null;
      } & User_Key;
  } & SpiritReview_Key)[];
}

export interface AuditAllSpiritsData {
  spirits: ({
    id: string;
  } & Spirit_Key)[];
}

export interface AuditAllUsersData {
  users: ({
    id: string;
    nickname?: string | null;
    role?: string | null;
    isFirstLogin?: boolean | null;
  } & User_Key)[];
}

export interface DeleteCabinetData {
  userCabinet_delete?: UserCabinet_Key | null;
}

export interface DeleteCabinetVariables {
  userId: string;
  spiritId: string;
}

export interface DeleteNewsData {
  newsArticle_delete?: NewsArticle_Key | null;
}

export interface DeleteNewsVariables {
  id: string;
}

export interface DeleteReviewData {
  spiritReview_delete?: SpiritReview_Key | null;
}

export interface DeleteReviewVariables {
  id: UUIDString;
}

export interface DeleteSpiritData {
  spirit_delete?: Spirit_Key | null;
}

export interface DeleteSpiritVariables {
  id: string;
}

export interface FindReviewData {
  spiritReviews: ({
    id: UUIDString;
    likedBy?: string[] | null;
    likes?: number | null;
  } & SpiritReview_Key)[];
}

export interface FindReviewVariables {
  userId: string;
  spiritId: string;
}

export interface GetNewsArticleData {
  newsArticle?: {
    id: string;
    title: string;
    content: string;
    imageUrl?: string | null;
    category?: string | null;
    source?: string | null;
    link?: string | null;
    date?: string | null;
    translations?: unknown | null;
    newsTags?: unknown | null;
    createdAt?: TimestampString | null;
  } & NewsArticle_Key;
}

export interface GetNewsArticleVariables {
  id: string;
}

export interface GetReviewData {
  spiritReview?: {
    id: UUIDString;
    likedBy?: string[] | null;
    likes?: number | null;
  } & SpiritReview_Key;
}

export interface GetReviewVariables {
  id: UUIDString;
}

export interface GetSpiritData {
  spirit?: {
    id: string;
    name: string;
    nameEn?: string | null;
    category: string;
    categoryEn?: string | null;
    mainCategory?: string | null;
    subcategory?: string | null;
    distillery?: string | null;
    bottler?: string | null;
    abv?: number | null;
    volume?: number | null;
    country?: string | null;
    region?: string | null;
    imageUrl: string;
    thumbnailUrl?: string | null;
    descriptionKo?: string | null;
    descriptionEn?: string | null;
    pairingGuideKo?: string | null;
    pairingGuideEn?: string | null;
    noseTags?: string[] | null;
    palateTags?: string[] | null;
    finishTags?: string[] | null;
    tastingNote?: string | null;
    status?: string | null;
    isPublished?: boolean | null;
    isReviewed?: boolean | null;
    rating?: number | null;
    reviewCount?: number | null;
    metadata?: unknown | null;
    reviews: ({
      id: UUIDString;
      rating: number;
      content: string;
      nose?: string | null;
      palate?: string | null;
      finish?: string | null;
      likedBy?: string[] | null;
      imageUrls?: string[] | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
      user: {
        nickname?: string | null;
        profileImage?: string | null;
        role?: string | null;
      };
    } & SpiritReview_Key)[];
  } & Spirit_Key;
}

export interface GetSpiritReviewsCountData {
  spiritReviews: ({
    id: UUIDString;
  } & SpiritReview_Key)[];
}

export interface GetSpiritVariables {
  id: string;
}

export interface GetUserProfileData {
  user?: {
    id: string;
    nickname?: string | null;
    profileImage?: string | null;
    role?: string | null;
    themePreference?: string | null;
    isFirstLogin?: boolean | null;
    reviewsWritten?: number | null;
    heartsReceived?: number | null;
    tasteProfile?: unknown | null;
  } & User_Key;
}

export interface GetUserProfileVariables {
  id: string;
}

export interface GetWorldCupResultData {
  worldCupResult?: {
    id: UUIDString;
    winner: {
      id: string;
      name: string;
      nameEn?: string | null;
      imageUrl: string;
      thumbnailUrl?: string | null;
      category: string;
      categoryEn?: string | null;
      subcategory?: string | null;
      distillery?: string | null;
      abv?: number | null;
      country?: string | null;
      region?: string | null;
      noseTags?: string[] | null;
      palateTags?: string[] | null;
      finishTags?: string[] | null;
    } & Spirit_Key;
      category: string;
      subcategory?: string | null;
      initialRound?: number | null;
      timestamp?: TimestampString | null;
  } & WorldCupResult_Key;
}

export interface GetWorldCupResultVariables {
  id: UUIDString;
}

export interface ListAiDiscoveryLogsData {
  aiDiscoveryLogs: ({
    id: string;
    userId?: string | null;
    analysis?: string | null;
    recommendations?: unknown | null;
    messageHistory?: unknown | null;
    createdAt?: TimestampString | null;
  } & AiDiscoveryLog_Key)[];
}

export interface ListAiDiscoveryLogsVariables {
  limit: number;
}

export interface ListAllCategoriesData {
  spirits: ({
    category: string;
    categoryEn?: string | null;
  })[];
}

export interface ListAllSubcategoriesData {
  spirits: ({
    subcategory?: string | null;
  })[];
}

export interface ListAllSubcategoriesVariables {
  category?: string | null;
}

export interface ListModificationRequestsData {
  modificationRequests: ({
    id: string;
    spiritId: string;
    spiritName?: string | null;
    userId?: string | null;
    title: string;
    content: string;
    status?: string | null;
    createdAt?: TimestampString | null;
  } & ModificationRequest_Key)[];
}

export interface ListNewArrivalsData {
  spirits: ({
    id: string;
    name: string;
    nameEn?: string | null;
    imageUrl: string;
    thumbnailUrl?: string | null;
    category: string;
    categoryEn?: string | null;
    country?: string | null;
    abv?: number | null;
    distillery?: string | null;
    descriptionKo?: string | null;
    descriptionEn?: string | null;
    updatedAt: TimestampString;
    createdAt: TimestampString;
  } & Spirit_Key)[];
}

export interface ListNewArrivalsVariables {
  limit?: number | null;
}

export interface ListNewsArticlesData {
  newsArticles: ({
    id: string;
    title: string;
    content: string;
    imageUrl?: string | null;
    category?: string | null;
    source?: string | null;
    link?: string | null;
    date?: string | null;
    translations?: unknown | null;
    newsTags?: unknown | null;
    createdAt?: TimestampString | null;
  } & NewsArticle_Key)[];
}

export interface ListNewsArticlesVariables {
  limit?: number | null;
  offset?: number | null;
}

export interface ListSpiritReviewsData {
  spiritReviews: ({
    id: UUIDString;
    rating: number;
    title?: string | null;
    content: string;
    imageUrls?: string[] | null;
    createdAt: TimestampString;
    spirit: {
      id: string;
      name: string;
      imageUrl: string;
    } & Spirit_Key;
      user: {
        id: string;
        nickname?: string | null;
        profileImage?: string | null;
      } & User_Key;
  } & SpiritReview_Key)[];
}

export interface ListSpiritReviewsVariables {
  limit?: number | null;
  offset?: number | null;
}

export interface ListSpiritsData {
  spirits: ({
    id: string;
    name: string;
    nameEn?: string | null;
    category: string;
    categoryEn?: string | null;
    imageUrl: string;
    thumbnailUrl?: string | null;
    isPublished?: boolean | null;
    abv?: number | null;
    distillery?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
  } & Spirit_Key)[];
}

export interface ListSpiritsForSitemapData {
  spirits: ({
    id: string;
    name: string;
    category: string;
    categoryEn?: string | null;
    imageUrl: string;
    thumbnailUrl?: string | null;
    descriptionKo?: string | null;
    descriptionEn?: string | null;
    pairingGuideKo?: string | null;
    pairingGuideEn?: string | null;
    tastingNote?: string | null;
    noseTags?: string[] | null;
    palateTags?: string[] | null;
    finishTags?: string[] | null;
    updatedAt: TimestampString;
  } & Spirit_Key)[];
}

export interface ListSpiritsForWorldCupData {
  spirits: ({
    id: string;
    name: string;
    nameEn?: string | null;
    imageUrl: string;
    thumbnailUrl?: string | null;
    category: string;
    categoryEn?: string | null;
    subcategory?: string | null;
    distillery?: string | null;
    abv?: number | null;
    country?: string | null;
    region?: string | null;
    noseTags?: string[] | null;
    palateTags?: string[] | null;
    finishTags?: string[] | null;
    createdAt: TimestampString;
  } & Spirit_Key)[];
}

export interface ListSpiritsForWorldCupVariables {
  category?: string | null;
  subcategories?: string[] | null;
}

export interface ListSpiritsVariables {
  category?: string | null;
  subcategory?: string | null;
  country?: string | null;
}

export interface ListTrendingSpiritsData {
  spirits: ({
    id: string;
    name: string;
    nameEn?: string | null;
    category: string;
    categoryEn?: string | null;
    imageUrl: string;
    thumbnailUrl?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
    distillery?: string | null;
    abv?: number | null;
  } & Spirit_Key)[];
}

export interface ListTrendingSpiritsVariables {
  limit?: number | null;
}

export interface ListUserCabinetData {
  userCabinets: ({
    spiritId: string;
    isFavorite?: boolean | null;
    notes?: string | null;
    rating?: number | null;
    spirit: {
      id: string;
      name: string;
      category: string;
      imageUrl: string;
      thumbnailUrl?: string | null;
      abv?: number | null;
      distillery?: string | null;
    } & Spirit_Key;
  })[];
}

export interface ListUserCabinetVariables {
  userId: string;
}

export interface ListUserReviewsData {
  spiritReviews: ({
    id: UUIDString;
    spiritId: string;
    rating: number;
    content: string;
    nose?: string | null;
    palate?: string | null;
    finish?: string | null;
    createdAt: TimestampString;
  } & SpiritReview_Key)[];
}

export interface ListUserReviewsVariables {
  userId: string;
}

export interface ModificationRequest_Key {
  id: string;
  __typename?: 'ModificationRequest_Key';
}

export interface NewArrival_Key {
  id: string;
  __typename?: 'NewArrival_Key';
}

export interface NewsArticle_Key {
  id: string;
  __typename?: 'NewsArticle_Key';
}

export interface SearchSpiritsPublicData {
  spirits: ({
    id: string;
    name: string;
    nameEn?: string | null;
    category: string;
    categoryEn?: string | null;
    subcategory?: string | null;
    imageUrl: string;
    thumbnailUrl?: string | null;
    abv?: number | null;
    distillery?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
    metadata?: unknown | null;
  } & Spirit_Key)[];
}

export interface SearchSpiritsPublicVariables {
  search?: string | null;
  category?: string | null;
  subcategory?: string | null;
  limit?: number | null;
  offset?: number | null;
}

export interface SpiritReview_Key {
  id: UUIDString;
  __typename?: 'SpiritReview_Key';
}

export interface Spirit_Key {
  id: string;
  __typename?: 'Spirit_Key';
}

export interface UpdateReviewData {
  spiritReview_update?: SpiritReview_Key | null;
}

export interface UpdateReviewVariables {
  id: UUIDString;
  likes?: number | null;
  likedBy?: string[] | null;
}

export interface UpsertAiDiscoveryLogData {
  aiDiscoveryLog_upsert: AiDiscoveryLog_Key;
}

export interface UpsertAiDiscoveryLogVariables {
  id: string;
  userId?: string | null;
  analysis?: string | null;
  recommendations?: unknown | null;
  messageHistory?: unknown | null;
}

export interface UpsertCabinetData {
  userCabinet_upsert: UserCabinet_Key;
}

export interface UpsertCabinetVariables {
  userId: string;
  spiritId: string;
  addedAt?: TimestampString | null;
  notes?: string | null;
  rating?: number | null;
  isFavorite?: boolean | null;
}

export interface UpsertModificationRequestData {
  modificationRequest_upsert: ModificationRequest_Key;
}

export interface UpsertModificationRequestVariables {
  id: string;
  spiritId: string;
  spiritName?: string | null;
  userId?: string | null;
  title: string;
  content: string;
  status?: string | null;
  createdAt?: TimestampString | null;
}

export interface UpsertNewArrivalData {
  newArrival_upsert: NewArrival_Key;
}

export interface UpsertNewArrivalVariables {
  id: string;
  spiritId: string;
  displayOrder?: number | null;
  tags?: string[] | null;
}

export interface UpsertNewsData {
  newsArticle_upsert: NewsArticle_Key;
}

export interface UpsertNewsVariables {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  category?: string | null;
  source?: string | null;
  link?: string | null;
  date?: string | null;
  translations?: unknown | null;
  tags?: unknown | null;
}

export interface UpsertReviewData {
  spiritReview_upsert: SpiritReview_Key;
}

export interface UpsertReviewVariables {
  id: UUIDString;
  spiritId: string;
  userId: string;
  rating: number;
  title?: string | null;
  content: string;
  nose?: string | null;
  palate?: string | null;
  finish?: string | null;
  likes?: number | null;
  likedBy?: string[] | null;
  isPublished?: boolean | null;
  imageUrls?: string[] | null;
  createdAt?: TimestampString | null;
  updatedAt?: TimestampString | null;
}

export interface UpsertSpiritData {
  spirit_upsert: Spirit_Key;
}

export interface UpsertSpiritVariables {
  id: string;
  name: string;
  nameEn?: string | null;
  category: string;
  categoryEn?: string | null;
  mainCategory?: string | null;
  subcategory?: string | null;
  distillery?: string | null;
  bottler?: string | null;
  abv?: number | null;
  volume?: number | null;
  country?: string | null;
  region?: string | null;
  imageUrl: string;
  thumbnailUrl?: string | null;
  descriptionKo?: string | null;
  descriptionEn?: string | null;
  pairingGuideKo?: string | null;
  pairingGuideEn?: string | null;
  noseTags?: string[] | null;
  palateTags?: string[] | null;
  finishTags?: string[] | null;
  tastingNote?: string | null;
  status?: string | null;
  isPublished?: boolean | null;
  isReviewed?: boolean | null;
  reviewedBy?: string | null;
  reviewedAt?: TimestampString | null;
  rating?: number | null;
  reviewCount?: number | null;
  importer?: string | null;
  rawCategory?: string | null;
  metadata?: unknown | null;
  updatedAt?: TimestampString | null;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  id: string;
  email?: string | null;
  nickname?: string | null;
  profileImage?: string | null;
  role?: string | null;
  themePreference?: string | null;
  isFirstLogin?: boolean | null;
  reviewsWritten?: number | null;
  heartsReceived?: number | null;
  tasteProfile?: unknown | null;
}

export interface UpsertWorldCupResultData {
  worldCupResult_upsert: WorldCupResult_Key;
}

export interface UpsertWorldCupResultVariables {
  id: UUIDString;
  winnerId?: string | null;
  category: string;
  subcategory?: string | null;
  initialRound?: number | null;
  timestamp?: TimestampString | null;
}

export interface UserCabinet_Key {
  userId: string;
  spiritId: string;
  __typename?: 'UserCabinet_Key';
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

export interface WorldCupResult_Key {
  id: UUIDString;
  __typename?: 'WorldCupResult_Key';
}

/** Generated Node Admin SDK operation action function for the 'UpsertUser' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUserData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertUser(vars: UpsertUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertSpirit' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertSpirit(dc: DataConnect, vars: UpsertSpiritVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertSpiritData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertSpirit' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertSpirit(vars: UpsertSpiritVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertSpiritData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertNewArrival' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertNewArrival(dc: DataConnect, vars: UpsertNewArrivalVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertNewArrivalData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertNewArrival' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertNewArrival(vars: UpsertNewArrivalVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertNewArrivalData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertReview' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertReview(dc: DataConnect, vars: UpsertReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertReviewData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertReview' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertReview(vars: UpsertReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertReviewData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateReview' Mutation. Allow users to execute without passing in DataConnect. */
export function updateReview(dc: DataConnect, vars: UpdateReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateReviewData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateReview' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateReview(vars: UpdateReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateReviewData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertNews' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertNews(dc: DataConnect, vars: UpsertNewsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertNewsData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertNews' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertNews(vars: UpsertNewsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertNewsData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteNews' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteNews(dc: DataConnect, vars: DeleteNewsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteNewsData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteNews' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteNews(vars: DeleteNewsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteNewsData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertCabinet' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertCabinet(dc: DataConnect, vars: UpsertCabinetVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCabinetData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertCabinet' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertCabinet(vars: UpsertCabinetVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCabinetData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteCabinet' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteCabinet(dc: DataConnect, vars: DeleteCabinetVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCabinetData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteCabinet' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteCabinet(vars: DeleteCabinetVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCabinetData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertModificationRequest' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertModificationRequest(dc: DataConnect, vars: UpsertModificationRequestVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertModificationRequestData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertModificationRequest' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertModificationRequest(vars: UpsertModificationRequestVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertModificationRequestData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertWorldCupResult' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertWorldCupResult(dc: DataConnect, vars: UpsertWorldCupResultVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertWorldCupResultData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertWorldCupResult' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertWorldCupResult(vars: UpsertWorldCupResultVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertWorldCupResultData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteSpirit' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteSpirit(dc: DataConnect, vars: DeleteSpiritVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteSpiritData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteSpirit' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteSpirit(vars: DeleteSpiritVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteSpiritData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertAiDiscoveryLog' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertAiDiscoveryLog(dc: DataConnect, vars: UpsertAiDiscoveryLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertAiDiscoveryLogData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertAiDiscoveryLog' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertAiDiscoveryLog(vars: UpsertAiDiscoveryLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertAiDiscoveryLogData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteReview' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteReview(dc: DataConnect, vars: DeleteReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteReviewData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteReview' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteReview(vars: DeleteReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteReviewData>>;

/** Generated Node Admin SDK operation action function for the 'ListSpirits' Query. Allow users to execute without passing in DataConnect. */
export function listSpirits(dc: DataConnect, vars?: ListSpiritsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListSpiritsData>>;
/** Generated Node Admin SDK operation action function for the 'ListSpirits' Query. Allow users to pass in custom DataConnect instances. */
export function listSpirits(vars?: ListSpiritsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListSpiritsData>>;

/** Generated Node Admin SDK operation action function for the 'SearchSpiritsPublic' Query. Allow users to execute without passing in DataConnect. */
export function searchSpiritsPublic(dc: DataConnect, vars?: SearchSpiritsPublicVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SearchSpiritsPublicData>>;
/** Generated Node Admin SDK operation action function for the 'SearchSpiritsPublic' Query. Allow users to pass in custom DataConnect instances. */
export function searchSpiritsPublic(vars?: SearchSpiritsPublicVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SearchSpiritsPublicData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllCategories' Query. Allow users to execute without passing in DataConnect. */
export function listAllCategories(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllCategoriesData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllCategories' Query. Allow users to pass in custom DataConnect instances. */
export function listAllCategories(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllCategoriesData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllSubcategories' Query. Allow users to execute without passing in DataConnect. */
export function listAllSubcategories(dc: DataConnect, vars?: ListAllSubcategoriesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllSubcategoriesData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllSubcategories' Query. Allow users to pass in custom DataConnect instances. */
export function listAllSubcategories(vars?: ListAllSubcategoriesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllSubcategoriesData>>;

/** Generated Node Admin SDK operation action function for the 'ListTrendingSpirits' Query. Allow users to execute without passing in DataConnect. */
export function listTrendingSpirits(dc: DataConnect, vars?: ListTrendingSpiritsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTrendingSpiritsData>>;
/** Generated Node Admin SDK operation action function for the 'ListTrendingSpirits' Query. Allow users to pass in custom DataConnect instances. */
export function listTrendingSpirits(vars?: ListTrendingSpiritsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTrendingSpiritsData>>;

/** Generated Node Admin SDK operation action function for the 'ListNewArrivals' Query. Allow users to execute without passing in DataConnect. */
export function listNewArrivals(dc: DataConnect, vars?: ListNewArrivalsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListNewArrivalsData>>;
/** Generated Node Admin SDK operation action function for the 'ListNewArrivals' Query. Allow users to pass in custom DataConnect instances. */
export function listNewArrivals(vars?: ListNewArrivalsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListNewArrivalsData>>;

/** Generated Node Admin SDK operation action function for the 'GetSpirit' Query. Allow users to execute without passing in DataConnect. */
export function getSpirit(dc: DataConnect, vars: GetSpiritVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetSpiritData>>;
/** Generated Node Admin SDK operation action function for the 'GetSpirit' Query. Allow users to pass in custom DataConnect instances. */
export function getSpirit(vars: GetSpiritVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetSpiritData>>;

/** Generated Node Admin SDK operation action function for the 'AdminListRawSpirits' Query. Allow users to execute without passing in DataConnect. */
export function adminListRawSpirits(dc: DataConnect, vars?: AdminListRawSpiritsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AdminListRawSpiritsData>>;
/** Generated Node Admin SDK operation action function for the 'AdminListRawSpirits' Query. Allow users to pass in custom DataConnect instances. */
export function adminListRawSpirits(vars?: AdminListRawSpiritsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AdminListRawSpiritsData>>;

/** Generated Node Admin SDK operation action function for the 'GetUserProfile' Query. Allow users to execute without passing in DataConnect. */
export function getUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserProfileData>>;
/** Generated Node Admin SDK operation action function for the 'GetUserProfile' Query. Allow users to pass in custom DataConnect instances. */
export function getUserProfile(vars: GetUserProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserProfileData>>;

/** Generated Node Admin SDK operation action function for the 'ListNewsArticles' Query. Allow users to execute without passing in DataConnect. */
export function listNewsArticles(dc: DataConnect, vars?: ListNewsArticlesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListNewsArticlesData>>;
/** Generated Node Admin SDK operation action function for the 'ListNewsArticles' Query. Allow users to pass in custom DataConnect instances. */
export function listNewsArticles(vars?: ListNewsArticlesVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListNewsArticlesData>>;

/** Generated Node Admin SDK operation action function for the 'GetNewsArticle' Query. Allow users to execute without passing in DataConnect. */
export function getNewsArticle(dc: DataConnect, vars: GetNewsArticleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetNewsArticleData>>;
/** Generated Node Admin SDK operation action function for the 'GetNewsArticle' Query. Allow users to pass in custom DataConnect instances. */
export function getNewsArticle(vars: GetNewsArticleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetNewsArticleData>>;

/** Generated Node Admin SDK operation action function for the 'AuditAllUsers' Query. Allow users to execute without passing in DataConnect. */
export function auditAllUsers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<AuditAllUsersData>>;
/** Generated Node Admin SDK operation action function for the 'AuditAllUsers' Query. Allow users to pass in custom DataConnect instances. */
export function auditAllUsers(options?: OperationOptions): Promise<ExecuteOperationResponse<AuditAllUsersData>>;

/** Generated Node Admin SDK operation action function for the 'AuditAllNews' Query. Allow users to execute without passing in DataConnect. */
export function auditAllNews(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<AuditAllNewsData>>;
/** Generated Node Admin SDK operation action function for the 'AuditAllNews' Query. Allow users to pass in custom DataConnect instances. */
export function auditAllNews(options?: OperationOptions): Promise<ExecuteOperationResponse<AuditAllNewsData>>;

/** Generated Node Admin SDK operation action function for the 'AuditAllSpirits' Query. Allow users to execute without passing in DataConnect. */
export function auditAllSpirits(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<AuditAllSpiritsData>>;
/** Generated Node Admin SDK operation action function for the 'AuditAllSpirits' Query. Allow users to pass in custom DataConnect instances. */
export function auditAllSpirits(options?: OperationOptions): Promise<ExecuteOperationResponse<AuditAllSpiritsData>>;

/** Generated Node Admin SDK operation action function for the 'AuditAllReviews' Query. Allow users to execute without passing in DataConnect. */
export function auditAllReviews(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<AuditAllReviewsData>>;
/** Generated Node Admin SDK operation action function for the 'AuditAllReviews' Query. Allow users to pass in custom DataConnect instances. */
export function auditAllReviews(options?: OperationOptions): Promise<ExecuteOperationResponse<AuditAllReviewsData>>;

/** Generated Node Admin SDK operation action function for the 'ListSpiritReviews' Query. Allow users to execute without passing in DataConnect. */
export function listSpiritReviews(dc: DataConnect, vars?: ListSpiritReviewsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListSpiritReviewsData>>;
/** Generated Node Admin SDK operation action function for the 'ListSpiritReviews' Query. Allow users to pass in custom DataConnect instances. */
export function listSpiritReviews(vars?: ListSpiritReviewsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListSpiritReviewsData>>;

/** Generated Node Admin SDK operation action function for the 'GetSpiritReviewsCount' Query. Allow users to execute without passing in DataConnect. */
export function getSpiritReviewsCount(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetSpiritReviewsCountData>>;
/** Generated Node Admin SDK operation action function for the 'GetSpiritReviewsCount' Query. Allow users to pass in custom DataConnect instances. */
export function getSpiritReviewsCount(options?: OperationOptions): Promise<ExecuteOperationResponse<GetSpiritReviewsCountData>>;

/** Generated Node Admin SDK operation action function for the 'FindReview' Query. Allow users to execute without passing in DataConnect. */
export function findReview(dc: DataConnect, vars: FindReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<FindReviewData>>;
/** Generated Node Admin SDK operation action function for the 'FindReview' Query. Allow users to pass in custom DataConnect instances. */
export function findReview(vars: FindReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<FindReviewData>>;

/** Generated Node Admin SDK operation action function for the 'GetReview' Query. Allow users to execute without passing in DataConnect. */
export function getReview(dc: DataConnect, vars: GetReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetReviewData>>;
/** Generated Node Admin SDK operation action function for the 'GetReview' Query. Allow users to pass in custom DataConnect instances. */
export function getReview(vars: GetReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetReviewData>>;

/** Generated Node Admin SDK operation action function for the 'ListSpiritsForSitemap' Query. Allow users to execute without passing in DataConnect. */
export function listSpiritsForSitemap(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListSpiritsForSitemapData>>;
/** Generated Node Admin SDK operation action function for the 'ListSpiritsForSitemap' Query. Allow users to pass in custom DataConnect instances. */
export function listSpiritsForSitemap(options?: OperationOptions): Promise<ExecuteOperationResponse<ListSpiritsForSitemapData>>;

/** Generated Node Admin SDK operation action function for the 'GetWorldCupResult' Query. Allow users to execute without passing in DataConnect. */
export function getWorldCupResult(dc: DataConnect, vars: GetWorldCupResultVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetWorldCupResultData>>;
/** Generated Node Admin SDK operation action function for the 'GetWorldCupResult' Query. Allow users to pass in custom DataConnect instances. */
export function getWorldCupResult(vars: GetWorldCupResultVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetWorldCupResultData>>;

/** Generated Node Admin SDK operation action function for the 'ListSpiritsForWorldCup' Query. Allow users to execute without passing in DataConnect. */
export function listSpiritsForWorldCup(dc: DataConnect, vars?: ListSpiritsForWorldCupVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListSpiritsForWorldCupData>>;
/** Generated Node Admin SDK operation action function for the 'ListSpiritsForWorldCup' Query. Allow users to pass in custom DataConnect instances. */
export function listSpiritsForWorldCup(vars?: ListSpiritsForWorldCupVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListSpiritsForWorldCupData>>;

/** Generated Node Admin SDK operation action function for the 'ListAiDiscoveryLogs' Query. Allow users to execute without passing in DataConnect. */
export function listAiDiscoveryLogs(dc: DataConnect, vars: ListAiDiscoveryLogsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAiDiscoveryLogsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAiDiscoveryLogs' Query. Allow users to pass in custom DataConnect instances. */
export function listAiDiscoveryLogs(vars: ListAiDiscoveryLogsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAiDiscoveryLogsData>>;

/** Generated Node Admin SDK operation action function for the 'ListModificationRequests' Query. Allow users to execute without passing in DataConnect. */
export function listModificationRequests(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListModificationRequestsData>>;
/** Generated Node Admin SDK operation action function for the 'ListModificationRequests' Query. Allow users to pass in custom DataConnect instances. */
export function listModificationRequests(options?: OperationOptions): Promise<ExecuteOperationResponse<ListModificationRequestsData>>;

/** Generated Node Admin SDK operation action function for the 'ListUserCabinet' Query. Allow users to execute without passing in DataConnect. */
export function listUserCabinet(dc: DataConnect, vars: ListUserCabinetVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUserCabinetData>>;
/** Generated Node Admin SDK operation action function for the 'ListUserCabinet' Query. Allow users to pass in custom DataConnect instances. */
export function listUserCabinet(vars: ListUserCabinetVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUserCabinetData>>;

/** Generated Node Admin SDK operation action function for the 'ListUserReviews' Query. Allow users to execute without passing in DataConnect. */
export function listUserReviews(dc: DataConnect, vars: ListUserReviewsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUserReviewsData>>;
/** Generated Node Admin SDK operation action function for the 'ListUserReviews' Query. Allow users to pass in custom DataConnect instances. */
export function listUserReviews(vars: ListUserReviewsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUserReviewsData>>;

