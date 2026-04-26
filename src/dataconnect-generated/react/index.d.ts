import { UpsertUserData, UpsertUserVariables, UpsertSpiritData, UpsertSpiritVariables, UpsertNewArrivalData, UpsertNewArrivalVariables, UpsertReviewData, UpsertReviewVariables, UpdateReviewLikesCountData, UpdateReviewLikesCountVariables, UpsertReviewLikeData, UpsertReviewLikeVariables, DeleteReviewLikeData, DeleteReviewLikeVariables, UpsertReviewCommentData, UpsertReviewCommentVariables, DeleteReviewCommentData, DeleteReviewCommentVariables, UpsertNewsData, UpsertNewsVariables, DeleteNewsData, DeleteNewsVariables, UpsertCabinetData, UpsertCabinetVariables, DeleteCabinetData, DeleteCabinetVariables, UpsertModificationRequestData, UpsertModificationRequestVariables, UpsertWorldCupResultData, UpsertWorldCupResultVariables, DeleteSpiritData, DeleteSpiritVariables, UpsertAiDiscoveryLogData, UpsertAiDiscoveryLogVariables, DeleteReviewData, DeleteReviewVariables, ListSpiritsData, ListSpiritsVariables, SearchSpiritsPublicData, SearchSpiritsPublicVariables, ListAllCategoriesData, ListAllSubcategoriesData, ListAllSubcategoriesVariables, ListTrendingSpiritsData, ListTrendingSpiritsVariables, ListNewArrivalsData, ListNewArrivalsVariables, GetSpiritData, GetSpiritVariables, AdminListRawSpiritsData, AdminListRawSpiritsVariables, GetUserProfileData, GetUserProfileVariables, ListNewsArticlesData, ListNewsArticlesVariables, GetNewsArticleData, GetNewsArticleVariables, AuditAllUsersData, AuditAllNewsData, AuditAllSpiritsData, AuditAllReviewsData, ListSpiritReviewsData, ListSpiritReviewsVariables, GetSpiritReviewsCountData, FindReviewData, FindReviewVariables, GetReviewDetailData, GetReviewDetailVariables, ListReviewCommentsData, ListReviewCommentsVariables, ListSpiritsForSitemapData, GetWorldCupResultData, GetWorldCupResultVariables, ListSpiritsForWorldCupData, ListSpiritsForWorldCupVariables, ListAllSpiritsForWorldCupData, ListSpiritsByCategoryForWorldCupData, ListSpiritsByCategoryForWorldCupVariables, ListAiDiscoveryLogsData, ListAiDiscoveryLogsVariables, ListModificationRequestsData, ListUserCabinetData, ListUserCabinetVariables, ListUserReviewsData, ListUserReviewsVariables, GetReviewLikeData, GetReviewLikeVariables, ListReviewLikesData, ListReviewLikesVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useUpsertUser(options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
export function useUpsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;

export function useUpsertSpirit(options?: useDataConnectMutationOptions<UpsertSpiritData, FirebaseError, UpsertSpiritVariables>): UseDataConnectMutationResult<UpsertSpiritData, UpsertSpiritVariables>;
export function useUpsertSpirit(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertSpiritData, FirebaseError, UpsertSpiritVariables>): UseDataConnectMutationResult<UpsertSpiritData, UpsertSpiritVariables>;

export function useUpsertNewArrival(options?: useDataConnectMutationOptions<UpsertNewArrivalData, FirebaseError, UpsertNewArrivalVariables>): UseDataConnectMutationResult<UpsertNewArrivalData, UpsertNewArrivalVariables>;
export function useUpsertNewArrival(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertNewArrivalData, FirebaseError, UpsertNewArrivalVariables>): UseDataConnectMutationResult<UpsertNewArrivalData, UpsertNewArrivalVariables>;

export function useUpsertReview(options?: useDataConnectMutationOptions<UpsertReviewData, FirebaseError, UpsertReviewVariables>): UseDataConnectMutationResult<UpsertReviewData, UpsertReviewVariables>;
export function useUpsertReview(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertReviewData, FirebaseError, UpsertReviewVariables>): UseDataConnectMutationResult<UpsertReviewData, UpsertReviewVariables>;

export function useUpdateReviewLikesCount(options?: useDataConnectMutationOptions<UpdateReviewLikesCountData, FirebaseError, UpdateReviewLikesCountVariables>): UseDataConnectMutationResult<UpdateReviewLikesCountData, UpdateReviewLikesCountVariables>;
export function useUpdateReviewLikesCount(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateReviewLikesCountData, FirebaseError, UpdateReviewLikesCountVariables>): UseDataConnectMutationResult<UpdateReviewLikesCountData, UpdateReviewLikesCountVariables>;

export function useUpsertReviewLike(options?: useDataConnectMutationOptions<UpsertReviewLikeData, FirebaseError, UpsertReviewLikeVariables>): UseDataConnectMutationResult<UpsertReviewLikeData, UpsertReviewLikeVariables>;
export function useUpsertReviewLike(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertReviewLikeData, FirebaseError, UpsertReviewLikeVariables>): UseDataConnectMutationResult<UpsertReviewLikeData, UpsertReviewLikeVariables>;

export function useDeleteReviewLike(options?: useDataConnectMutationOptions<DeleteReviewLikeData, FirebaseError, DeleteReviewLikeVariables>): UseDataConnectMutationResult<DeleteReviewLikeData, DeleteReviewLikeVariables>;
export function useDeleteReviewLike(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteReviewLikeData, FirebaseError, DeleteReviewLikeVariables>): UseDataConnectMutationResult<DeleteReviewLikeData, DeleteReviewLikeVariables>;

export function useUpsertReviewComment(options?: useDataConnectMutationOptions<UpsertReviewCommentData, FirebaseError, UpsertReviewCommentVariables>): UseDataConnectMutationResult<UpsertReviewCommentData, UpsertReviewCommentVariables>;
export function useUpsertReviewComment(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertReviewCommentData, FirebaseError, UpsertReviewCommentVariables>): UseDataConnectMutationResult<UpsertReviewCommentData, UpsertReviewCommentVariables>;

export function useDeleteReviewComment(options?: useDataConnectMutationOptions<DeleteReviewCommentData, FirebaseError, DeleteReviewCommentVariables>): UseDataConnectMutationResult<DeleteReviewCommentData, DeleteReviewCommentVariables>;
export function useDeleteReviewComment(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteReviewCommentData, FirebaseError, DeleteReviewCommentVariables>): UseDataConnectMutationResult<DeleteReviewCommentData, DeleteReviewCommentVariables>;

export function useUpsertNews(options?: useDataConnectMutationOptions<UpsertNewsData, FirebaseError, UpsertNewsVariables>): UseDataConnectMutationResult<UpsertNewsData, UpsertNewsVariables>;
export function useUpsertNews(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertNewsData, FirebaseError, UpsertNewsVariables>): UseDataConnectMutationResult<UpsertNewsData, UpsertNewsVariables>;

export function useDeleteNews(options?: useDataConnectMutationOptions<DeleteNewsData, FirebaseError, DeleteNewsVariables>): UseDataConnectMutationResult<DeleteNewsData, DeleteNewsVariables>;
export function useDeleteNews(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteNewsData, FirebaseError, DeleteNewsVariables>): UseDataConnectMutationResult<DeleteNewsData, DeleteNewsVariables>;

export function useUpsertCabinet(options?: useDataConnectMutationOptions<UpsertCabinetData, FirebaseError, UpsertCabinetVariables>): UseDataConnectMutationResult<UpsertCabinetData, UpsertCabinetVariables>;
export function useUpsertCabinet(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCabinetData, FirebaseError, UpsertCabinetVariables>): UseDataConnectMutationResult<UpsertCabinetData, UpsertCabinetVariables>;

export function useDeleteCabinet(options?: useDataConnectMutationOptions<DeleteCabinetData, FirebaseError, DeleteCabinetVariables>): UseDataConnectMutationResult<DeleteCabinetData, DeleteCabinetVariables>;
export function useDeleteCabinet(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCabinetData, FirebaseError, DeleteCabinetVariables>): UseDataConnectMutationResult<DeleteCabinetData, DeleteCabinetVariables>;

export function useUpsertModificationRequest(options?: useDataConnectMutationOptions<UpsertModificationRequestData, FirebaseError, UpsertModificationRequestVariables>): UseDataConnectMutationResult<UpsertModificationRequestData, UpsertModificationRequestVariables>;
export function useUpsertModificationRequest(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertModificationRequestData, FirebaseError, UpsertModificationRequestVariables>): UseDataConnectMutationResult<UpsertModificationRequestData, UpsertModificationRequestVariables>;

export function useUpsertWorldCupResult(options?: useDataConnectMutationOptions<UpsertWorldCupResultData, FirebaseError, UpsertWorldCupResultVariables>): UseDataConnectMutationResult<UpsertWorldCupResultData, UpsertWorldCupResultVariables>;
export function useUpsertWorldCupResult(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertWorldCupResultData, FirebaseError, UpsertWorldCupResultVariables>): UseDataConnectMutationResult<UpsertWorldCupResultData, UpsertWorldCupResultVariables>;

export function useDeleteSpirit(options?: useDataConnectMutationOptions<DeleteSpiritData, FirebaseError, DeleteSpiritVariables>): UseDataConnectMutationResult<DeleteSpiritData, DeleteSpiritVariables>;
export function useDeleteSpirit(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSpiritData, FirebaseError, DeleteSpiritVariables>): UseDataConnectMutationResult<DeleteSpiritData, DeleteSpiritVariables>;

export function useUpsertAiDiscoveryLog(options?: useDataConnectMutationOptions<UpsertAiDiscoveryLogData, FirebaseError, UpsertAiDiscoveryLogVariables>): UseDataConnectMutationResult<UpsertAiDiscoveryLogData, UpsertAiDiscoveryLogVariables>;
export function useUpsertAiDiscoveryLog(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertAiDiscoveryLogData, FirebaseError, UpsertAiDiscoveryLogVariables>): UseDataConnectMutationResult<UpsertAiDiscoveryLogData, UpsertAiDiscoveryLogVariables>;

export function useDeleteReview(options?: useDataConnectMutationOptions<DeleteReviewData, FirebaseError, DeleteReviewVariables>): UseDataConnectMutationResult<DeleteReviewData, DeleteReviewVariables>;
export function useDeleteReview(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteReviewData, FirebaseError, DeleteReviewVariables>): UseDataConnectMutationResult<DeleteReviewData, DeleteReviewVariables>;

export function useListSpirits(vars?: ListSpiritsVariables, options?: useDataConnectQueryOptions<ListSpiritsData>): UseDataConnectQueryResult<ListSpiritsData, ListSpiritsVariables>;
export function useListSpirits(dc: DataConnect, vars?: ListSpiritsVariables, options?: useDataConnectQueryOptions<ListSpiritsData>): UseDataConnectQueryResult<ListSpiritsData, ListSpiritsVariables>;

export function useSearchSpiritsPublic(vars?: SearchSpiritsPublicVariables, options?: useDataConnectQueryOptions<SearchSpiritsPublicData>): UseDataConnectQueryResult<SearchSpiritsPublicData, SearchSpiritsPublicVariables>;
export function useSearchSpiritsPublic(dc: DataConnect, vars?: SearchSpiritsPublicVariables, options?: useDataConnectQueryOptions<SearchSpiritsPublicData>): UseDataConnectQueryResult<SearchSpiritsPublicData, SearchSpiritsPublicVariables>;

export function useListAllCategories(options?: useDataConnectQueryOptions<ListAllCategoriesData>): UseDataConnectQueryResult<ListAllCategoriesData, undefined>;
export function useListAllCategories(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllCategoriesData>): UseDataConnectQueryResult<ListAllCategoriesData, undefined>;

export function useListAllSubcategories(vars?: ListAllSubcategoriesVariables, options?: useDataConnectQueryOptions<ListAllSubcategoriesData>): UseDataConnectQueryResult<ListAllSubcategoriesData, ListAllSubcategoriesVariables>;
export function useListAllSubcategories(dc: DataConnect, vars?: ListAllSubcategoriesVariables, options?: useDataConnectQueryOptions<ListAllSubcategoriesData>): UseDataConnectQueryResult<ListAllSubcategoriesData, ListAllSubcategoriesVariables>;

export function useListTrendingSpirits(vars?: ListTrendingSpiritsVariables, options?: useDataConnectQueryOptions<ListTrendingSpiritsData>): UseDataConnectQueryResult<ListTrendingSpiritsData, ListTrendingSpiritsVariables>;
export function useListTrendingSpirits(dc: DataConnect, vars?: ListTrendingSpiritsVariables, options?: useDataConnectQueryOptions<ListTrendingSpiritsData>): UseDataConnectQueryResult<ListTrendingSpiritsData, ListTrendingSpiritsVariables>;

export function useListNewArrivals(vars?: ListNewArrivalsVariables, options?: useDataConnectQueryOptions<ListNewArrivalsData>): UseDataConnectQueryResult<ListNewArrivalsData, ListNewArrivalsVariables>;
export function useListNewArrivals(dc: DataConnect, vars?: ListNewArrivalsVariables, options?: useDataConnectQueryOptions<ListNewArrivalsData>): UseDataConnectQueryResult<ListNewArrivalsData, ListNewArrivalsVariables>;

export function useGetSpirit(vars: GetSpiritVariables, options?: useDataConnectQueryOptions<GetSpiritData>): UseDataConnectQueryResult<GetSpiritData, GetSpiritVariables>;
export function useGetSpirit(dc: DataConnect, vars: GetSpiritVariables, options?: useDataConnectQueryOptions<GetSpiritData>): UseDataConnectQueryResult<GetSpiritData, GetSpiritVariables>;

export function useAdminListRawSpirits(vars?: AdminListRawSpiritsVariables, options?: useDataConnectQueryOptions<AdminListRawSpiritsData>): UseDataConnectQueryResult<AdminListRawSpiritsData, AdminListRawSpiritsVariables>;
export function useAdminListRawSpirits(dc: DataConnect, vars?: AdminListRawSpiritsVariables, options?: useDataConnectQueryOptions<AdminListRawSpiritsData>): UseDataConnectQueryResult<AdminListRawSpiritsData, AdminListRawSpiritsVariables>;

export function useGetUserProfile(vars: GetUserProfileVariables, options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, GetUserProfileVariables>;
export function useGetUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: useDataConnectQueryOptions<GetUserProfileData>): UseDataConnectQueryResult<GetUserProfileData, GetUserProfileVariables>;

export function useListNewsArticles(vars?: ListNewsArticlesVariables, options?: useDataConnectQueryOptions<ListNewsArticlesData>): UseDataConnectQueryResult<ListNewsArticlesData, ListNewsArticlesVariables>;
export function useListNewsArticles(dc: DataConnect, vars?: ListNewsArticlesVariables, options?: useDataConnectQueryOptions<ListNewsArticlesData>): UseDataConnectQueryResult<ListNewsArticlesData, ListNewsArticlesVariables>;

export function useGetNewsArticle(vars: GetNewsArticleVariables, options?: useDataConnectQueryOptions<GetNewsArticleData>): UseDataConnectQueryResult<GetNewsArticleData, GetNewsArticleVariables>;
export function useGetNewsArticle(dc: DataConnect, vars: GetNewsArticleVariables, options?: useDataConnectQueryOptions<GetNewsArticleData>): UseDataConnectQueryResult<GetNewsArticleData, GetNewsArticleVariables>;

export function useAuditAllUsers(options?: useDataConnectQueryOptions<AuditAllUsersData>): UseDataConnectQueryResult<AuditAllUsersData, undefined>;
export function useAuditAllUsers(dc: DataConnect, options?: useDataConnectQueryOptions<AuditAllUsersData>): UseDataConnectQueryResult<AuditAllUsersData, undefined>;

export function useAuditAllNews(options?: useDataConnectQueryOptions<AuditAllNewsData>): UseDataConnectQueryResult<AuditAllNewsData, undefined>;
export function useAuditAllNews(dc: DataConnect, options?: useDataConnectQueryOptions<AuditAllNewsData>): UseDataConnectQueryResult<AuditAllNewsData, undefined>;

export function useAuditAllSpirits(options?: useDataConnectQueryOptions<AuditAllSpiritsData>): UseDataConnectQueryResult<AuditAllSpiritsData, undefined>;
export function useAuditAllSpirits(dc: DataConnect, options?: useDataConnectQueryOptions<AuditAllSpiritsData>): UseDataConnectQueryResult<AuditAllSpiritsData, undefined>;

export function useAuditAllReviews(options?: useDataConnectQueryOptions<AuditAllReviewsData>): UseDataConnectQueryResult<AuditAllReviewsData, undefined>;
export function useAuditAllReviews(dc: DataConnect, options?: useDataConnectQueryOptions<AuditAllReviewsData>): UseDataConnectQueryResult<AuditAllReviewsData, undefined>;

export function useListSpiritReviews(vars?: ListSpiritReviewsVariables, options?: useDataConnectQueryOptions<ListSpiritReviewsData>): UseDataConnectQueryResult<ListSpiritReviewsData, ListSpiritReviewsVariables>;
export function useListSpiritReviews(dc: DataConnect, vars?: ListSpiritReviewsVariables, options?: useDataConnectQueryOptions<ListSpiritReviewsData>): UseDataConnectQueryResult<ListSpiritReviewsData, ListSpiritReviewsVariables>;

export function useGetSpiritReviewsCount(options?: useDataConnectQueryOptions<GetSpiritReviewsCountData>): UseDataConnectQueryResult<GetSpiritReviewsCountData, undefined>;
export function useGetSpiritReviewsCount(dc: DataConnect, options?: useDataConnectQueryOptions<GetSpiritReviewsCountData>): UseDataConnectQueryResult<GetSpiritReviewsCountData, undefined>;

export function useFindReview(vars: FindReviewVariables, options?: useDataConnectQueryOptions<FindReviewData>): UseDataConnectQueryResult<FindReviewData, FindReviewVariables>;
export function useFindReview(dc: DataConnect, vars: FindReviewVariables, options?: useDataConnectQueryOptions<FindReviewData>): UseDataConnectQueryResult<FindReviewData, FindReviewVariables>;

export function useGetReviewDetail(vars: GetReviewDetailVariables, options?: useDataConnectQueryOptions<GetReviewDetailData>): UseDataConnectQueryResult<GetReviewDetailData, GetReviewDetailVariables>;
export function useGetReviewDetail(dc: DataConnect, vars: GetReviewDetailVariables, options?: useDataConnectQueryOptions<GetReviewDetailData>): UseDataConnectQueryResult<GetReviewDetailData, GetReviewDetailVariables>;

export function useListReviewComments(vars: ListReviewCommentsVariables, options?: useDataConnectQueryOptions<ListReviewCommentsData>): UseDataConnectQueryResult<ListReviewCommentsData, ListReviewCommentsVariables>;
export function useListReviewComments(dc: DataConnect, vars: ListReviewCommentsVariables, options?: useDataConnectQueryOptions<ListReviewCommentsData>): UseDataConnectQueryResult<ListReviewCommentsData, ListReviewCommentsVariables>;

export function useListSpiritsForSitemap(options?: useDataConnectQueryOptions<ListSpiritsForSitemapData>): UseDataConnectQueryResult<ListSpiritsForSitemapData, undefined>;
export function useListSpiritsForSitemap(dc: DataConnect, options?: useDataConnectQueryOptions<ListSpiritsForSitemapData>): UseDataConnectQueryResult<ListSpiritsForSitemapData, undefined>;

export function useGetWorldCupResult(vars: GetWorldCupResultVariables, options?: useDataConnectQueryOptions<GetWorldCupResultData>): UseDataConnectQueryResult<GetWorldCupResultData, GetWorldCupResultVariables>;
export function useGetWorldCupResult(dc: DataConnect, vars: GetWorldCupResultVariables, options?: useDataConnectQueryOptions<GetWorldCupResultData>): UseDataConnectQueryResult<GetWorldCupResultData, GetWorldCupResultVariables>;

export function useListSpiritsForWorldCup(vars?: ListSpiritsForWorldCupVariables, options?: useDataConnectQueryOptions<ListSpiritsForWorldCupData>): UseDataConnectQueryResult<ListSpiritsForWorldCupData, ListSpiritsForWorldCupVariables>;
export function useListSpiritsForWorldCup(dc: DataConnect, vars?: ListSpiritsForWorldCupVariables, options?: useDataConnectQueryOptions<ListSpiritsForWorldCupData>): UseDataConnectQueryResult<ListSpiritsForWorldCupData, ListSpiritsForWorldCupVariables>;

export function useListAllSpiritsForWorldCup(options?: useDataConnectQueryOptions<ListAllSpiritsForWorldCupData>): UseDataConnectQueryResult<ListAllSpiritsForWorldCupData, undefined>;
export function useListAllSpiritsForWorldCup(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllSpiritsForWorldCupData>): UseDataConnectQueryResult<ListAllSpiritsForWorldCupData, undefined>;

export function useListSpiritsByCategoryForWorldCup(vars?: ListSpiritsByCategoryForWorldCupVariables, options?: useDataConnectQueryOptions<ListSpiritsByCategoryForWorldCupData>): UseDataConnectQueryResult<ListSpiritsByCategoryForWorldCupData, ListSpiritsByCategoryForWorldCupVariables>;
export function useListSpiritsByCategoryForWorldCup(dc: DataConnect, vars?: ListSpiritsByCategoryForWorldCupVariables, options?: useDataConnectQueryOptions<ListSpiritsByCategoryForWorldCupData>): UseDataConnectQueryResult<ListSpiritsByCategoryForWorldCupData, ListSpiritsByCategoryForWorldCupVariables>;

export function useListAiDiscoveryLogs(vars: ListAiDiscoveryLogsVariables, options?: useDataConnectQueryOptions<ListAiDiscoveryLogsData>): UseDataConnectQueryResult<ListAiDiscoveryLogsData, ListAiDiscoveryLogsVariables>;
export function useListAiDiscoveryLogs(dc: DataConnect, vars: ListAiDiscoveryLogsVariables, options?: useDataConnectQueryOptions<ListAiDiscoveryLogsData>): UseDataConnectQueryResult<ListAiDiscoveryLogsData, ListAiDiscoveryLogsVariables>;

export function useListModificationRequests(options?: useDataConnectQueryOptions<ListModificationRequestsData>): UseDataConnectQueryResult<ListModificationRequestsData, undefined>;
export function useListModificationRequests(dc: DataConnect, options?: useDataConnectQueryOptions<ListModificationRequestsData>): UseDataConnectQueryResult<ListModificationRequestsData, undefined>;

export function useListUserCabinet(vars: ListUserCabinetVariables, options?: useDataConnectQueryOptions<ListUserCabinetData>): UseDataConnectQueryResult<ListUserCabinetData, ListUserCabinetVariables>;
export function useListUserCabinet(dc: DataConnect, vars: ListUserCabinetVariables, options?: useDataConnectQueryOptions<ListUserCabinetData>): UseDataConnectQueryResult<ListUserCabinetData, ListUserCabinetVariables>;

export function useListUserReviews(vars: ListUserReviewsVariables, options?: useDataConnectQueryOptions<ListUserReviewsData>): UseDataConnectQueryResult<ListUserReviewsData, ListUserReviewsVariables>;
export function useListUserReviews(dc: DataConnect, vars: ListUserReviewsVariables, options?: useDataConnectQueryOptions<ListUserReviewsData>): UseDataConnectQueryResult<ListUserReviewsData, ListUserReviewsVariables>;

export function useGetReviewLike(vars: GetReviewLikeVariables, options?: useDataConnectQueryOptions<GetReviewLikeData>): UseDataConnectQueryResult<GetReviewLikeData, GetReviewLikeVariables>;
export function useGetReviewLike(dc: DataConnect, vars: GetReviewLikeVariables, options?: useDataConnectQueryOptions<GetReviewLikeData>): UseDataConnectQueryResult<GetReviewLikeData, GetReviewLikeVariables>;

export function useListReviewLikes(vars: ListReviewLikesVariables, options?: useDataConnectQueryOptions<ListReviewLikesData>): UseDataConnectQueryResult<ListReviewLikesData, ListReviewLikesVariables>;
export function useListReviewLikes(dc: DataConnect, vars: ListReviewLikesVariables, options?: useDataConnectQueryOptions<ListReviewLikesData>): UseDataConnectQueryResult<ListReviewLikesData, ListReviewLikesVariables>;
