import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'main',
  service: 'k-spirits-club-hub',
  location: 'asia-northeast3'
};
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

