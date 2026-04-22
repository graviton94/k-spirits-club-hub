import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

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

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertSpiritRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertSpiritVariables): MutationRef<UpsertSpiritData, UpsertSpiritVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertSpiritVariables): MutationRef<UpsertSpiritData, UpsertSpiritVariables>;
  operationName: string;
}
export const upsertSpiritRef: UpsertSpiritRef;

export function upsertSpirit(vars: UpsertSpiritVariables): MutationPromise<UpsertSpiritData, UpsertSpiritVariables>;
export function upsertSpirit(dc: DataConnect, vars: UpsertSpiritVariables): MutationPromise<UpsertSpiritData, UpsertSpiritVariables>;

interface UpsertNewArrivalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertNewArrivalVariables): MutationRef<UpsertNewArrivalData, UpsertNewArrivalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertNewArrivalVariables): MutationRef<UpsertNewArrivalData, UpsertNewArrivalVariables>;
  operationName: string;
}
export const upsertNewArrivalRef: UpsertNewArrivalRef;

export function upsertNewArrival(vars: UpsertNewArrivalVariables): MutationPromise<UpsertNewArrivalData, UpsertNewArrivalVariables>;
export function upsertNewArrival(dc: DataConnect, vars: UpsertNewArrivalVariables): MutationPromise<UpsertNewArrivalData, UpsertNewArrivalVariables>;

interface UpsertReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertReviewVariables): MutationRef<UpsertReviewData, UpsertReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertReviewVariables): MutationRef<UpsertReviewData, UpsertReviewVariables>;
  operationName: string;
}
export const upsertReviewRef: UpsertReviewRef;

export function upsertReview(vars: UpsertReviewVariables): MutationPromise<UpsertReviewData, UpsertReviewVariables>;
export function upsertReview(dc: DataConnect, vars: UpsertReviewVariables): MutationPromise<UpsertReviewData, UpsertReviewVariables>;

interface UpdateReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
  operationName: string;
}
export const updateReviewRef: UpdateReviewRef;

export function updateReview(vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;
export function updateReview(dc: DataConnect, vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;

interface UpsertNewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertNewsVariables): MutationRef<UpsertNewsData, UpsertNewsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertNewsVariables): MutationRef<UpsertNewsData, UpsertNewsVariables>;
  operationName: string;
}
export const upsertNewsRef: UpsertNewsRef;

export function upsertNews(vars: UpsertNewsVariables): MutationPromise<UpsertNewsData, UpsertNewsVariables>;
export function upsertNews(dc: DataConnect, vars: UpsertNewsVariables): MutationPromise<UpsertNewsData, UpsertNewsVariables>;

interface DeleteNewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteNewsVariables): MutationRef<DeleteNewsData, DeleteNewsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteNewsVariables): MutationRef<DeleteNewsData, DeleteNewsVariables>;
  operationName: string;
}
export const deleteNewsRef: DeleteNewsRef;

export function deleteNews(vars: DeleteNewsVariables): MutationPromise<DeleteNewsData, DeleteNewsVariables>;
export function deleteNews(dc: DataConnect, vars: DeleteNewsVariables): MutationPromise<DeleteNewsData, DeleteNewsVariables>;

interface UpsertCabinetRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCabinetVariables): MutationRef<UpsertCabinetData, UpsertCabinetVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertCabinetVariables): MutationRef<UpsertCabinetData, UpsertCabinetVariables>;
  operationName: string;
}
export const upsertCabinetRef: UpsertCabinetRef;

export function upsertCabinet(vars: UpsertCabinetVariables): MutationPromise<UpsertCabinetData, UpsertCabinetVariables>;
export function upsertCabinet(dc: DataConnect, vars: UpsertCabinetVariables): MutationPromise<UpsertCabinetData, UpsertCabinetVariables>;

interface DeleteCabinetRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCabinetVariables): MutationRef<DeleteCabinetData, DeleteCabinetVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCabinetVariables): MutationRef<DeleteCabinetData, DeleteCabinetVariables>;
  operationName: string;
}
export const deleteCabinetRef: DeleteCabinetRef;

export function deleteCabinet(vars: DeleteCabinetVariables): MutationPromise<DeleteCabinetData, DeleteCabinetVariables>;
export function deleteCabinet(dc: DataConnect, vars: DeleteCabinetVariables): MutationPromise<DeleteCabinetData, DeleteCabinetVariables>;

interface UpsertModificationRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertModificationRequestVariables): MutationRef<UpsertModificationRequestData, UpsertModificationRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertModificationRequestVariables): MutationRef<UpsertModificationRequestData, UpsertModificationRequestVariables>;
  operationName: string;
}
export const upsertModificationRequestRef: UpsertModificationRequestRef;

export function upsertModificationRequest(vars: UpsertModificationRequestVariables): MutationPromise<UpsertModificationRequestData, UpsertModificationRequestVariables>;
export function upsertModificationRequest(dc: DataConnect, vars: UpsertModificationRequestVariables): MutationPromise<UpsertModificationRequestData, UpsertModificationRequestVariables>;

interface UpsertWorldCupResultRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertWorldCupResultVariables): MutationRef<UpsertWorldCupResultData, UpsertWorldCupResultVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertWorldCupResultVariables): MutationRef<UpsertWorldCupResultData, UpsertWorldCupResultVariables>;
  operationName: string;
}
export const upsertWorldCupResultRef: UpsertWorldCupResultRef;

export function upsertWorldCupResult(vars: UpsertWorldCupResultVariables): MutationPromise<UpsertWorldCupResultData, UpsertWorldCupResultVariables>;
export function upsertWorldCupResult(dc: DataConnect, vars: UpsertWorldCupResultVariables): MutationPromise<UpsertWorldCupResultData, UpsertWorldCupResultVariables>;

interface DeleteSpiritRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSpiritVariables): MutationRef<DeleteSpiritData, DeleteSpiritVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSpiritVariables): MutationRef<DeleteSpiritData, DeleteSpiritVariables>;
  operationName: string;
}
export const deleteSpiritRef: DeleteSpiritRef;

export function deleteSpirit(vars: DeleteSpiritVariables): MutationPromise<DeleteSpiritData, DeleteSpiritVariables>;
export function deleteSpirit(dc: DataConnect, vars: DeleteSpiritVariables): MutationPromise<DeleteSpiritData, DeleteSpiritVariables>;

interface UpsertAiDiscoveryLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAiDiscoveryLogVariables): MutationRef<UpsertAiDiscoveryLogData, UpsertAiDiscoveryLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertAiDiscoveryLogVariables): MutationRef<UpsertAiDiscoveryLogData, UpsertAiDiscoveryLogVariables>;
  operationName: string;
}
export const upsertAiDiscoveryLogRef: UpsertAiDiscoveryLogRef;

export function upsertAiDiscoveryLog(vars: UpsertAiDiscoveryLogVariables): MutationPromise<UpsertAiDiscoveryLogData, UpsertAiDiscoveryLogVariables>;
export function upsertAiDiscoveryLog(dc: DataConnect, vars: UpsertAiDiscoveryLogVariables): MutationPromise<UpsertAiDiscoveryLogData, UpsertAiDiscoveryLogVariables>;

interface DeleteReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  operationName: string;
}
export const deleteReviewRef: DeleteReviewRef;

export function deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;
export function deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface ListSpiritsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListSpiritsVariables): QueryRef<ListSpiritsData, ListSpiritsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListSpiritsVariables): QueryRef<ListSpiritsData, ListSpiritsVariables>;
  operationName: string;
}
export const listSpiritsRef: ListSpiritsRef;

export function listSpirits(vars?: ListSpiritsVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritsData, ListSpiritsVariables>;
export function listSpirits(dc: DataConnect, vars?: ListSpiritsVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritsData, ListSpiritsVariables>;

interface SearchSpiritsPublicRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchSpiritsPublicVariables): QueryRef<SearchSpiritsPublicData, SearchSpiritsPublicVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: SearchSpiritsPublicVariables): QueryRef<SearchSpiritsPublicData, SearchSpiritsPublicVariables>;
  operationName: string;
}
export const searchSpiritsPublicRef: SearchSpiritsPublicRef;

export function searchSpiritsPublic(vars?: SearchSpiritsPublicVariables, options?: ExecuteQueryOptions): QueryPromise<SearchSpiritsPublicData, SearchSpiritsPublicVariables>;
export function searchSpiritsPublic(dc: DataConnect, vars?: SearchSpiritsPublicVariables, options?: ExecuteQueryOptions): QueryPromise<SearchSpiritsPublicData, SearchSpiritsPublicVariables>;

interface ListAllCategoriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllCategoriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllCategoriesData, undefined>;
  operationName: string;
}
export const listAllCategoriesRef: ListAllCategoriesRef;

export function listAllCategories(options?: ExecuteQueryOptions): QueryPromise<ListAllCategoriesData, undefined>;
export function listAllCategories(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllCategoriesData, undefined>;

interface ListAllSubcategoriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListAllSubcategoriesVariables): QueryRef<ListAllSubcategoriesData, ListAllSubcategoriesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListAllSubcategoriesVariables): QueryRef<ListAllSubcategoriesData, ListAllSubcategoriesVariables>;
  operationName: string;
}
export const listAllSubcategoriesRef: ListAllSubcategoriesRef;

export function listAllSubcategories(vars?: ListAllSubcategoriesVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllSubcategoriesData, ListAllSubcategoriesVariables>;
export function listAllSubcategories(dc: DataConnect, vars?: ListAllSubcategoriesVariables, options?: ExecuteQueryOptions): QueryPromise<ListAllSubcategoriesData, ListAllSubcategoriesVariables>;

interface ListTrendingSpiritsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListTrendingSpiritsVariables): QueryRef<ListTrendingSpiritsData, ListTrendingSpiritsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListTrendingSpiritsVariables): QueryRef<ListTrendingSpiritsData, ListTrendingSpiritsVariables>;
  operationName: string;
}
export const listTrendingSpiritsRef: ListTrendingSpiritsRef;

export function listTrendingSpirits(vars?: ListTrendingSpiritsVariables, options?: ExecuteQueryOptions): QueryPromise<ListTrendingSpiritsData, ListTrendingSpiritsVariables>;
export function listTrendingSpirits(dc: DataConnect, vars?: ListTrendingSpiritsVariables, options?: ExecuteQueryOptions): QueryPromise<ListTrendingSpiritsData, ListTrendingSpiritsVariables>;

interface ListNewArrivalsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListNewArrivalsVariables): QueryRef<ListNewArrivalsData, ListNewArrivalsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListNewArrivalsVariables): QueryRef<ListNewArrivalsData, ListNewArrivalsVariables>;
  operationName: string;
}
export const listNewArrivalsRef: ListNewArrivalsRef;

export function listNewArrivals(vars?: ListNewArrivalsVariables, options?: ExecuteQueryOptions): QueryPromise<ListNewArrivalsData, ListNewArrivalsVariables>;
export function listNewArrivals(dc: DataConnect, vars?: ListNewArrivalsVariables, options?: ExecuteQueryOptions): QueryPromise<ListNewArrivalsData, ListNewArrivalsVariables>;

interface GetSpiritRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSpiritVariables): QueryRef<GetSpiritData, GetSpiritVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSpiritVariables): QueryRef<GetSpiritData, GetSpiritVariables>;
  operationName: string;
}
export const getSpiritRef: GetSpiritRef;

export function getSpirit(vars: GetSpiritVariables, options?: ExecuteQueryOptions): QueryPromise<GetSpiritData, GetSpiritVariables>;
export function getSpirit(dc: DataConnect, vars: GetSpiritVariables, options?: ExecuteQueryOptions): QueryPromise<GetSpiritData, GetSpiritVariables>;

interface AdminListRawSpiritsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: AdminListRawSpiritsVariables): QueryRef<AdminListRawSpiritsData, AdminListRawSpiritsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: AdminListRawSpiritsVariables): QueryRef<AdminListRawSpiritsData, AdminListRawSpiritsVariables>;
  operationName: string;
}
export const adminListRawSpiritsRef: AdminListRawSpiritsRef;

export function adminListRawSpirits(vars?: AdminListRawSpiritsVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListRawSpiritsData, AdminListRawSpiritsVariables>;
export function adminListRawSpirits(dc: DataConnect, vars?: AdminListRawSpiritsVariables, options?: ExecuteQueryOptions): QueryPromise<AdminListRawSpiritsData, AdminListRawSpiritsVariables>;

interface GetUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
  operationName: string;
}
export const getUserProfileRef: GetUserProfileRef;

export function getUserProfile(vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;
export function getUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

interface ListNewsArticlesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListNewsArticlesVariables): QueryRef<ListNewsArticlesData, ListNewsArticlesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListNewsArticlesVariables): QueryRef<ListNewsArticlesData, ListNewsArticlesVariables>;
  operationName: string;
}
export const listNewsArticlesRef: ListNewsArticlesRef;

export function listNewsArticles(vars?: ListNewsArticlesVariables, options?: ExecuteQueryOptions): QueryPromise<ListNewsArticlesData, ListNewsArticlesVariables>;
export function listNewsArticles(dc: DataConnect, vars?: ListNewsArticlesVariables, options?: ExecuteQueryOptions): QueryPromise<ListNewsArticlesData, ListNewsArticlesVariables>;

interface GetNewsArticleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNewsArticleVariables): QueryRef<GetNewsArticleData, GetNewsArticleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetNewsArticleVariables): QueryRef<GetNewsArticleData, GetNewsArticleVariables>;
  operationName: string;
}
export const getNewsArticleRef: GetNewsArticleRef;

export function getNewsArticle(vars: GetNewsArticleVariables, options?: ExecuteQueryOptions): QueryPromise<GetNewsArticleData, GetNewsArticleVariables>;
export function getNewsArticle(dc: DataConnect, vars: GetNewsArticleVariables, options?: ExecuteQueryOptions): QueryPromise<GetNewsArticleData, GetNewsArticleVariables>;

interface AuditAllUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AuditAllUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AuditAllUsersData, undefined>;
  operationName: string;
}
export const auditAllUsersRef: AuditAllUsersRef;

export function auditAllUsers(options?: ExecuteQueryOptions): QueryPromise<AuditAllUsersData, undefined>;
export function auditAllUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AuditAllUsersData, undefined>;

interface AuditAllNewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AuditAllNewsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AuditAllNewsData, undefined>;
  operationName: string;
}
export const auditAllNewsRef: AuditAllNewsRef;

export function auditAllNews(options?: ExecuteQueryOptions): QueryPromise<AuditAllNewsData, undefined>;
export function auditAllNews(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AuditAllNewsData, undefined>;

interface AuditAllSpiritsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AuditAllSpiritsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AuditAllSpiritsData, undefined>;
  operationName: string;
}
export const auditAllSpiritsRef: AuditAllSpiritsRef;

export function auditAllSpirits(options?: ExecuteQueryOptions): QueryPromise<AuditAllSpiritsData, undefined>;
export function auditAllSpirits(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AuditAllSpiritsData, undefined>;

interface AuditAllReviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AuditAllReviewsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AuditAllReviewsData, undefined>;
  operationName: string;
}
export const auditAllReviewsRef: AuditAllReviewsRef;

export function auditAllReviews(options?: ExecuteQueryOptions): QueryPromise<AuditAllReviewsData, undefined>;
export function auditAllReviews(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AuditAllReviewsData, undefined>;

interface ListSpiritReviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListSpiritReviewsVariables): QueryRef<ListSpiritReviewsData, ListSpiritReviewsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListSpiritReviewsVariables): QueryRef<ListSpiritReviewsData, ListSpiritReviewsVariables>;
  operationName: string;
}
export const listSpiritReviewsRef: ListSpiritReviewsRef;

export function listSpiritReviews(vars?: ListSpiritReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritReviewsData, ListSpiritReviewsVariables>;
export function listSpiritReviews(dc: DataConnect, vars?: ListSpiritReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritReviewsData, ListSpiritReviewsVariables>;

interface GetSpiritReviewsCountRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetSpiritReviewsCountData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetSpiritReviewsCountData, undefined>;
  operationName: string;
}
export const getSpiritReviewsCountRef: GetSpiritReviewsCountRef;

export function getSpiritReviewsCount(options?: ExecuteQueryOptions): QueryPromise<GetSpiritReviewsCountData, undefined>;
export function getSpiritReviewsCount(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetSpiritReviewsCountData, undefined>;

interface FindReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: FindReviewVariables): QueryRef<FindReviewData, FindReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: FindReviewVariables): QueryRef<FindReviewData, FindReviewVariables>;
  operationName: string;
}
export const findReviewRef: FindReviewRef;

export function findReview(vars: FindReviewVariables, options?: ExecuteQueryOptions): QueryPromise<FindReviewData, FindReviewVariables>;
export function findReview(dc: DataConnect, vars: FindReviewVariables, options?: ExecuteQueryOptions): QueryPromise<FindReviewData, FindReviewVariables>;

interface GetReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
  operationName: string;
}
export const getReviewRef: GetReviewRef;

export function getReview(vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;
export function getReview(dc: DataConnect, vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;

interface ListSpiritsForSitemapRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSpiritsForSitemapData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListSpiritsForSitemapData, undefined>;
  operationName: string;
}
export const listSpiritsForSitemapRef: ListSpiritsForSitemapRef;

export function listSpiritsForSitemap(options?: ExecuteQueryOptions): QueryPromise<ListSpiritsForSitemapData, undefined>;
export function listSpiritsForSitemap(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListSpiritsForSitemapData, undefined>;

interface GetWorldCupResultRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorldCupResultVariables): QueryRef<GetWorldCupResultData, GetWorldCupResultVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetWorldCupResultVariables): QueryRef<GetWorldCupResultData, GetWorldCupResultVariables>;
  operationName: string;
}
export const getWorldCupResultRef: GetWorldCupResultRef;

export function getWorldCupResult(vars: GetWorldCupResultVariables, options?: ExecuteQueryOptions): QueryPromise<GetWorldCupResultData, GetWorldCupResultVariables>;
export function getWorldCupResult(dc: DataConnect, vars: GetWorldCupResultVariables, options?: ExecuteQueryOptions): QueryPromise<GetWorldCupResultData, GetWorldCupResultVariables>;

interface ListSpiritsForWorldCupRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListSpiritsForWorldCupVariables): QueryRef<ListSpiritsForWorldCupData, ListSpiritsForWorldCupVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListSpiritsForWorldCupVariables): QueryRef<ListSpiritsForWorldCupData, ListSpiritsForWorldCupVariables>;
  operationName: string;
}
export const listSpiritsForWorldCupRef: ListSpiritsForWorldCupRef;

export function listSpiritsForWorldCup(vars?: ListSpiritsForWorldCupVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritsForWorldCupData, ListSpiritsForWorldCupVariables>;
export function listSpiritsForWorldCup(dc: DataConnect, vars?: ListSpiritsForWorldCupVariables, options?: ExecuteQueryOptions): QueryPromise<ListSpiritsForWorldCupData, ListSpiritsForWorldCupVariables>;

interface ListAiDiscoveryLogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListAiDiscoveryLogsVariables): QueryRef<ListAiDiscoveryLogsData, ListAiDiscoveryLogsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListAiDiscoveryLogsVariables): QueryRef<ListAiDiscoveryLogsData, ListAiDiscoveryLogsVariables>;
  operationName: string;
}
export const listAiDiscoveryLogsRef: ListAiDiscoveryLogsRef;

export function listAiDiscoveryLogs(vars: ListAiDiscoveryLogsVariables, options?: ExecuteQueryOptions): QueryPromise<ListAiDiscoveryLogsData, ListAiDiscoveryLogsVariables>;
export function listAiDiscoveryLogs(dc: DataConnect, vars: ListAiDiscoveryLogsVariables, options?: ExecuteQueryOptions): QueryPromise<ListAiDiscoveryLogsData, ListAiDiscoveryLogsVariables>;

interface ListModificationRequestsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListModificationRequestsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListModificationRequestsData, undefined>;
  operationName: string;
}
export const listModificationRequestsRef: ListModificationRequestsRef;

export function listModificationRequests(options?: ExecuteQueryOptions): QueryPromise<ListModificationRequestsData, undefined>;
export function listModificationRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListModificationRequestsData, undefined>;

interface ListUserCabinetRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserCabinetVariables): QueryRef<ListUserCabinetData, ListUserCabinetVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListUserCabinetVariables): QueryRef<ListUserCabinetData, ListUserCabinetVariables>;
  operationName: string;
}
export const listUserCabinetRef: ListUserCabinetRef;

export function listUserCabinet(vars: ListUserCabinetVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserCabinetData, ListUserCabinetVariables>;
export function listUserCabinet(dc: DataConnect, vars: ListUserCabinetVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserCabinetData, ListUserCabinetVariables>;

interface ListUserReviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserReviewsVariables): QueryRef<ListUserReviewsData, ListUserReviewsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListUserReviewsVariables): QueryRef<ListUserReviewsData, ListUserReviewsVariables>;
  operationName: string;
}
export const listUserReviewsRef: ListUserReviewsRef;

export function listUserReviews(vars: ListUserReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserReviewsData, ListUserReviewsVariables>;
export function listUserReviews(dc: DataConnect, vars: ListUserReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserReviewsData, ListUserReviewsVariables>;

