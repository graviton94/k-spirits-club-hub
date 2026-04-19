import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




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
    tags?: string[] | null;
    createdAt?: TimestampString | null;
  } & NewsArticle_Key;
}

export interface GetNewsArticleVariables {
  id: string;
}

export interface GetSpiritData {
  spirit?: {
    id: string;
    name: string;
    nameEn?: string | null;
    category: string;
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
    email?: string | null;
    profileImage?: string | null;
    role?: string | null;
    themePreference?: string | null;
    isFirstLogin?: boolean | null;
    reviewsWritten?: number | null;
    heartsReceived?: number | null;
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

export interface ListNewArrivalsData {
  spirits: ({
    id: string;
    name: string;
    nameEn?: string | null;
    imageUrl: string;
    category: string;
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
    tags?: string[] | null;
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
    imageUrl: string;
    isPublished?: boolean | null;
    rating?: number | null;
    reviewCount?: number | null;
  } & Spirit_Key)[];
}

export interface ListSpiritsForSitemapData {
  spirits: ({
    id: string;
    name: string;
    category: string;
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
}

export interface ModificationRequest_Key {
  id: string;
  __typename?: 'ModificationRequest_Key';
}

export interface NewsArticle_Key {
  id: string;
  __typename?: 'NewsArticle_Key';
}

export interface SpiritReview_Key {
  id: UUIDString;
  __typename?: 'SpiritReview_Key';
}

export interface Spirit_Key {
  id: string;
  __typename?: 'Spirit_Key';
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
  tags?: string[] | null;
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
  rating?: number | null;
  reviewCount?: number | null;
  metadata?: unknown | null;
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
}

export interface UpsertWorldCupResultData {
  worldCupResult_upsert: WorldCupResult_Key;
}

export interface UpsertWorldCupResultVariables {
  id: UUIDString;
  winnerId: string;
  category: string;
  subcategory?: string | null;
  initialRound: number;
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

