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
