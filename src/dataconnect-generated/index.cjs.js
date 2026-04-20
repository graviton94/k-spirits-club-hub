const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'main',
  service: 'k-spirits-club-hub',
  location: 'asia-northeast3'
};
exports.connectorConfig = connectorConfig;

const upsertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertUser', inputVars);
}
upsertUserRef.operationName = 'upsertUser';
exports.upsertUserRef = upsertUserRef;

exports.upsertUser = function upsertUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserRef(dcInstance, inputVars));
}
;

const upsertSpiritRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertSpirit', inputVars);
}
upsertSpiritRef.operationName = 'upsertSpirit';
exports.upsertSpiritRef = upsertSpiritRef;

exports.upsertSpirit = function upsertSpirit(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertSpiritRef(dcInstance, inputVars));
}
;

const upsertNewArrivalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertNewArrival', inputVars);
}
upsertNewArrivalRef.operationName = 'upsertNewArrival';
exports.upsertNewArrivalRef = upsertNewArrivalRef;

exports.upsertNewArrival = function upsertNewArrival(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertNewArrivalRef(dcInstance, inputVars));
}
;

const upsertReviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertReview', inputVars);
}
upsertReviewRef.operationName = 'upsertReview';
exports.upsertReviewRef = upsertReviewRef;

exports.upsertReview = function upsertReview(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertReviewRef(dcInstance, inputVars));
}
;

const updateReviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateReview', inputVars);
}
updateReviewRef.operationName = 'updateReview';
exports.updateReviewRef = updateReviewRef;

exports.updateReview = function updateReview(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateReviewRef(dcInstance, inputVars));
}
;

const upsertNewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertNews', inputVars);
}
upsertNewsRef.operationName = 'upsertNews';
exports.upsertNewsRef = upsertNewsRef;

exports.upsertNews = function upsertNews(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertNewsRef(dcInstance, inputVars));
}
;

const deleteNewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteNews', inputVars);
}
deleteNewsRef.operationName = 'deleteNews';
exports.deleteNewsRef = deleteNewsRef;

exports.deleteNews = function deleteNews(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteNewsRef(dcInstance, inputVars));
}
;

const upsertCabinetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertCabinet', inputVars);
}
upsertCabinetRef.operationName = 'upsertCabinet';
exports.upsertCabinetRef = upsertCabinetRef;

exports.upsertCabinet = function upsertCabinet(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertCabinetRef(dcInstance, inputVars));
}
;

const deleteCabinetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteCabinet', inputVars);
}
deleteCabinetRef.operationName = 'deleteCabinet';
exports.deleteCabinetRef = deleteCabinetRef;

exports.deleteCabinet = function deleteCabinet(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteCabinetRef(dcInstance, inputVars));
}
;

const upsertModificationRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertModificationRequest', inputVars);
}
upsertModificationRequestRef.operationName = 'upsertModificationRequest';
exports.upsertModificationRequestRef = upsertModificationRequestRef;

exports.upsertModificationRequest = function upsertModificationRequest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertModificationRequestRef(dcInstance, inputVars));
}
;

const upsertWorldCupResultRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertWorldCupResult', inputVars);
}
upsertWorldCupResultRef.operationName = 'upsertWorldCupResult';
exports.upsertWorldCupResultRef = upsertWorldCupResultRef;

exports.upsertWorldCupResult = function upsertWorldCupResult(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertWorldCupResultRef(dcInstance, inputVars));
}
;

const deleteSpiritRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteSpirit', inputVars);
}
deleteSpiritRef.operationName = 'deleteSpirit';
exports.deleteSpiritRef = deleteSpiritRef;

exports.deleteSpirit = function deleteSpirit(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteSpiritRef(dcInstance, inputVars));
}
;

const upsertAiDiscoveryLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertAiDiscoveryLog', inputVars);
}
upsertAiDiscoveryLogRef.operationName = 'upsertAiDiscoveryLog';
exports.upsertAiDiscoveryLogRef = upsertAiDiscoveryLogRef;

exports.upsertAiDiscoveryLog = function upsertAiDiscoveryLog(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertAiDiscoveryLogRef(dcInstance, inputVars));
}
;

const deleteReviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteReview', inputVars);
}
deleteReviewRef.operationName = 'deleteReview';
exports.deleteReviewRef = deleteReviewRef;

exports.deleteReview = function deleteReview(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteReviewRef(dcInstance, inputVars));
}
;

const listSpiritsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listSpirits', inputVars);
}
listSpiritsRef.operationName = 'listSpirits';
exports.listSpiritsRef = listSpiritsRef;

exports.listSpirits = function listSpirits(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listSpiritsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listTrendingSpiritsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listTrendingSpirits', inputVars);
}
listTrendingSpiritsRef.operationName = 'listTrendingSpirits';
exports.listTrendingSpiritsRef = listTrendingSpiritsRef;

exports.listTrendingSpirits = function listTrendingSpirits(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listTrendingSpiritsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listNewArrivalsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listNewArrivals', inputVars);
}
listNewArrivalsRef.operationName = 'listNewArrivals';
exports.listNewArrivalsRef = listNewArrivalsRef;

exports.listNewArrivals = function listNewArrivals(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listNewArrivalsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getSpiritRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getSpirit', inputVars);
}
getSpiritRef.operationName = 'getSpirit';
exports.getSpiritRef = getSpiritRef;

exports.getSpirit = function getSpirit(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getSpiritRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const adminListRawSpiritsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'adminListRawSpirits', inputVars);
}
adminListRawSpiritsRef.operationName = 'adminListRawSpirits';
exports.adminListRawSpiritsRef = adminListRawSpiritsRef;

exports.adminListRawSpirits = function adminListRawSpirits(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(adminListRawSpiritsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getUserProfile', inputVars);
}
getUserProfileRef.operationName = 'getUserProfile';
exports.getUserProfileRef = getUserProfileRef;

exports.getUserProfile = function getUserProfile(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserProfileRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listNewsArticlesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listNewsArticles', inputVars);
}
listNewsArticlesRef.operationName = 'listNewsArticles';
exports.listNewsArticlesRef = listNewsArticlesRef;

exports.listNewsArticles = function listNewsArticles(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listNewsArticlesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getNewsArticleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getNewsArticle', inputVars);
}
getNewsArticleRef.operationName = 'getNewsArticle';
exports.getNewsArticleRef = getNewsArticleRef;

exports.getNewsArticle = function getNewsArticle(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getNewsArticleRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const auditAllUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'auditAllUsers');
}
auditAllUsersRef.operationName = 'auditAllUsers';
exports.auditAllUsersRef = auditAllUsersRef;

exports.auditAllUsers = function auditAllUsers(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(auditAllUsersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const auditAllNewsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'auditAllNews');
}
auditAllNewsRef.operationName = 'auditAllNews';
exports.auditAllNewsRef = auditAllNewsRef;

exports.auditAllNews = function auditAllNews(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(auditAllNewsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const auditAllSpiritsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'auditAllSpirits');
}
auditAllSpiritsRef.operationName = 'auditAllSpirits';
exports.auditAllSpiritsRef = auditAllSpiritsRef;

exports.auditAllSpirits = function auditAllSpirits(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(auditAllSpiritsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const auditAllReviewsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'auditAllReviews');
}
auditAllReviewsRef.operationName = 'auditAllReviews';
exports.auditAllReviewsRef = auditAllReviewsRef;

exports.auditAllReviews = function auditAllReviews(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(auditAllReviewsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listSpiritReviewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listSpiritReviews', inputVars);
}
listSpiritReviewsRef.operationName = 'listSpiritReviews';
exports.listSpiritReviewsRef = listSpiritReviewsRef;

exports.listSpiritReviews = function listSpiritReviews(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listSpiritReviewsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getSpiritReviewsCountRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getSpiritReviewsCount');
}
getSpiritReviewsCountRef.operationName = 'getSpiritReviewsCount';
exports.getSpiritReviewsCountRef = getSpiritReviewsCountRef;

exports.getSpiritReviewsCount = function getSpiritReviewsCount(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getSpiritReviewsCountRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const findReviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'findReview', inputVars);
}
findReviewRef.operationName = 'findReview';
exports.findReviewRef = findReviewRef;

exports.findReview = function findReview(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(findReviewRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getReviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getReview', inputVars);
}
getReviewRef.operationName = 'getReview';
exports.getReviewRef = getReviewRef;

exports.getReview = function getReview(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getReviewRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listSpiritsForSitemapRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listSpiritsForSitemap');
}
listSpiritsForSitemapRef.operationName = 'listSpiritsForSitemap';
exports.listSpiritsForSitemapRef = listSpiritsForSitemapRef;

exports.listSpiritsForSitemap = function listSpiritsForSitemap(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listSpiritsForSitemapRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getWorldCupResultRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getWorldCupResult', inputVars);
}
getWorldCupResultRef.operationName = 'getWorldCupResult';
exports.getWorldCupResultRef = getWorldCupResultRef;

exports.getWorldCupResult = function getWorldCupResult(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getWorldCupResultRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listSpiritsForWorldCupRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listSpiritsForWorldCup', inputVars);
}
listSpiritsForWorldCupRef.operationName = 'listSpiritsForWorldCup';
exports.listSpiritsForWorldCupRef = listSpiritsForWorldCupRef;

exports.listSpiritsForWorldCup = function listSpiritsForWorldCup(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listSpiritsForWorldCupRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listAiDiscoveryLogsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listAiDiscoveryLogs', inputVars);
}
listAiDiscoveryLogsRef.operationName = 'listAiDiscoveryLogs';
exports.listAiDiscoveryLogsRef = listAiDiscoveryLogsRef;

exports.listAiDiscoveryLogs = function listAiDiscoveryLogs(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listAiDiscoveryLogsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listModificationRequestsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listModificationRequests');
}
listModificationRequestsRef.operationName = 'listModificationRequests';
exports.listModificationRequestsRef = listModificationRequestsRef;

exports.listModificationRequests = function listModificationRequests(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listModificationRequestsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listUserCabinetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listUserCabinet', inputVars);
}
listUserCabinetRef.operationName = 'listUserCabinet';
exports.listUserCabinetRef = listUserCabinetRef;

exports.listUserCabinet = function listUserCabinet(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listUserCabinetRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listUserReviewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listUserReviews', inputVars);
}
listUserReviewsRef.operationName = 'listUserReviews';
exports.listUserReviewsRef = listUserReviewsRef;

exports.listUserReviews = function listUserReviews(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listUserReviewsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;
