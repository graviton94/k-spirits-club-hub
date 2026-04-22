import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'main',
  service: 'k-spirits-club-hub',
  location: 'asia-northeast3'
};
export const listSpiritsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listSpirits', inputVars);
}
listSpiritsRef.operationName = 'listSpirits';

export function listSpirits(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listSpiritsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const searchSpiritsPublicRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'searchSpiritsPublic', inputVars);
}
searchSpiritsPublicRef.operationName = 'searchSpiritsPublic';

export function searchSpiritsPublic(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(searchSpiritsPublicRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listAllCategoriesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listAllCategories');
}
listAllCategoriesRef.operationName = 'listAllCategories';

export function listAllCategories(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllCategoriesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listAllSubcategoriesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listAllSubcategories', inputVars);
}
listAllSubcategoriesRef.operationName = 'listAllSubcategories';

export function listAllSubcategories(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listAllSubcategoriesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listTrendingSpiritsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listTrendingSpirits', inputVars);
}
listTrendingSpiritsRef.operationName = 'listTrendingSpirits';

export function listTrendingSpirits(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listTrendingSpiritsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listNewArrivalsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listNewArrivals', inputVars);
}
listNewArrivalsRef.operationName = 'listNewArrivals';

export function listNewArrivals(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listNewArrivalsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getSpiritRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getSpirit', inputVars);
}
getSpiritRef.operationName = 'getSpirit';

export function getSpirit(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getSpiritRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const adminListRawSpiritsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'adminListRawSpirits', inputVars);
}
adminListRawSpiritsRef.operationName = 'adminListRawSpirits';

export function adminListRawSpirits(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(adminListRawSpiritsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getUserProfile', inputVars);
}
getUserProfileRef.operationName = 'getUserProfile';

export function getUserProfile(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserProfileRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listNewsArticlesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listNewsArticles', inputVars);
}
listNewsArticlesRef.operationName = 'listNewsArticles';

export function listNewsArticles(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listNewsArticlesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getNewsArticleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getNewsArticle', inputVars);
}
getNewsArticleRef.operationName = 'getNewsArticle';

export function getNewsArticle(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getNewsArticleRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const auditAllUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'auditAllUsers');
}
auditAllUsersRef.operationName = 'auditAllUsers';

export function auditAllUsers(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(auditAllUsersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const auditAllNewsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'auditAllNews');
}
auditAllNewsRef.operationName = 'auditAllNews';

export function auditAllNews(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(auditAllNewsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const auditAllSpiritsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'auditAllSpirits');
}
auditAllSpiritsRef.operationName = 'auditAllSpirits';

export function auditAllSpirits(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(auditAllSpiritsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const auditAllReviewsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'auditAllReviews');
}
auditAllReviewsRef.operationName = 'auditAllReviews';

export function auditAllReviews(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(auditAllReviewsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listSpiritReviewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listSpiritReviews', inputVars);
}
listSpiritReviewsRef.operationName = 'listSpiritReviews';

export function listSpiritReviews(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listSpiritReviewsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getSpiritReviewsCountRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getSpiritReviewsCount');
}
getSpiritReviewsCountRef.operationName = 'getSpiritReviewsCount';

export function getSpiritReviewsCount(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getSpiritReviewsCountRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const findReviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'findReview', inputVars);
}
findReviewRef.operationName = 'findReview';

export function findReview(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(findReviewRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getReviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getReview', inputVars);
}
getReviewRef.operationName = 'getReview';

export function getReview(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getReviewRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listSpiritsForSitemapRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listSpiritsForSitemap');
}
listSpiritsForSitemapRef.operationName = 'listSpiritsForSitemap';

export function listSpiritsForSitemap(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listSpiritsForSitemapRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getWorldCupResultRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getWorldCupResult', inputVars);
}
getWorldCupResultRef.operationName = 'getWorldCupResult';

export function getWorldCupResult(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getWorldCupResultRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listSpiritsForWorldCupRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listSpiritsForWorldCup', inputVars);
}
listSpiritsForWorldCupRef.operationName = 'listSpiritsForWorldCup';

export function listSpiritsForWorldCup(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listSpiritsForWorldCupRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listAiDiscoveryLogsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listAiDiscoveryLogs', inputVars);
}
listAiDiscoveryLogsRef.operationName = 'listAiDiscoveryLogs';

export function listAiDiscoveryLogs(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listAiDiscoveryLogsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listModificationRequestsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listModificationRequests');
}
listModificationRequestsRef.operationName = 'listModificationRequests';

export function listModificationRequests(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listModificationRequestsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listUserCabinetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listUserCabinet', inputVars);
}
listUserCabinetRef.operationName = 'listUserCabinet';

export function listUserCabinet(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listUserCabinetRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listUserReviewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listUserReviews', inputVars);
}
listUserReviewsRef.operationName = 'listUserReviews';

export function listUserReviews(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listUserReviewsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const upsertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertUser', inputVars);
}
upsertUserRef.operationName = 'upsertUser';

export function upsertUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserRef(dcInstance, inputVars));
}

export const upsertSpiritRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertSpirit', inputVars);
}
upsertSpiritRef.operationName = 'upsertSpirit';

export function upsertSpirit(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertSpiritRef(dcInstance, inputVars));
}

export const upsertNewArrivalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertNewArrival', inputVars);
}
upsertNewArrivalRef.operationName = 'upsertNewArrival';

export function upsertNewArrival(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertNewArrivalRef(dcInstance, inputVars));
}

export const upsertReviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertReview', inputVars);
}
upsertReviewRef.operationName = 'upsertReview';

export function upsertReview(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertReviewRef(dcInstance, inputVars));
}

export const updateReviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateReview', inputVars);
}
updateReviewRef.operationName = 'updateReview';

export function updateReview(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateReviewRef(dcInstance, inputVars));
}

export const upsertNewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertNews', inputVars);
}
upsertNewsRef.operationName = 'upsertNews';

export function upsertNews(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertNewsRef(dcInstance, inputVars));
}

export const deleteNewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteNews', inputVars);
}
deleteNewsRef.operationName = 'deleteNews';

export function deleteNews(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteNewsRef(dcInstance, inputVars));
}

export const upsertCabinetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertCabinet', inputVars);
}
upsertCabinetRef.operationName = 'upsertCabinet';

export function upsertCabinet(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertCabinetRef(dcInstance, inputVars));
}

export const deleteCabinetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteCabinet', inputVars);
}
deleteCabinetRef.operationName = 'deleteCabinet';

export function deleteCabinet(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteCabinetRef(dcInstance, inputVars));
}

export const upsertModificationRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertModificationRequest', inputVars);
}
upsertModificationRequestRef.operationName = 'upsertModificationRequest';

export function upsertModificationRequest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertModificationRequestRef(dcInstance, inputVars));
}

export const upsertWorldCupResultRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertWorldCupResult', inputVars);
}
upsertWorldCupResultRef.operationName = 'upsertWorldCupResult';

export function upsertWorldCupResult(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertWorldCupResultRef(dcInstance, inputVars));
}

export const deleteSpiritRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteSpirit', inputVars);
}
deleteSpiritRef.operationName = 'deleteSpirit';

export function deleteSpirit(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSpiritRef(dcInstance, inputVars));
}

export const upsertAiDiscoveryLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertAiDiscoveryLog', inputVars);
}
upsertAiDiscoveryLogRef.operationName = 'upsertAiDiscoveryLog';

export function upsertAiDiscoveryLog(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertAiDiscoveryLogRef(dcInstance, inputVars));
}

export const deleteReviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteReview', inputVars);
}
deleteReviewRef.operationName = 'deleteReview';

export function deleteReview(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteReviewRef(dcInstance, inputVars));
}

