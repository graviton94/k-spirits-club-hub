const { validateAdminArgs } = require('firebase-admin/data-connect');

const connectorConfig = {
  connector: 'main',
  serviceId: 'k-spirits-club-hub',
  location: 'asia-northeast3'
};
exports.connectorConfig = connectorConfig;

function upsertUser(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('upsertUser', inputVars, inputOpts);
}
exports.upsertUser = upsertUser;

function upsertSpirit(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('upsertSpirit', inputVars, inputOpts);
}
exports.upsertSpirit = upsertSpirit;

function upsertNewArrival(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('upsertNewArrival', inputVars, inputOpts);
}
exports.upsertNewArrival = upsertNewArrival;

function upsertReview(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('upsertReview', inputVars, inputOpts);
}
exports.upsertReview = upsertReview;

function updateReview(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('updateReview', inputVars, inputOpts);
}
exports.updateReview = updateReview;

function upsertNews(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('upsertNews', inputVars, inputOpts);
}
exports.upsertNews = upsertNews;

function deleteNews(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('deleteNews', inputVars, inputOpts);
}
exports.deleteNews = deleteNews;

function upsertCabinet(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('upsertCabinet', inputVars, inputOpts);
}
exports.upsertCabinet = upsertCabinet;

function deleteCabinet(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('deleteCabinet', inputVars, inputOpts);
}
exports.deleteCabinet = deleteCabinet;

function upsertModificationRequest(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('upsertModificationRequest', inputVars, inputOpts);
}
exports.upsertModificationRequest = upsertModificationRequest;

function upsertWorldCupResult(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('upsertWorldCupResult', inputVars, inputOpts);
}
exports.upsertWorldCupResult = upsertWorldCupResult;

function deleteSpirit(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('deleteSpirit', inputVars, inputOpts);
}
exports.deleteSpirit = deleteSpirit;

function upsertAiDiscoveryLog(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('upsertAiDiscoveryLog', inputVars, inputOpts);
}
exports.upsertAiDiscoveryLog = upsertAiDiscoveryLog;

function deleteReview(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('deleteReview', inputVars, inputOpts);
}
exports.deleteReview = deleteReview;

function listSpirits(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, false);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listSpirits', inputVars, inputOpts);
}
exports.listSpirits = listSpirits;

function searchSpiritsPublic(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, false);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('searchSpiritsPublic', inputVars, inputOpts);
}
exports.searchSpiritsPublic = searchSpiritsPublic;

function listAllCategories(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listAllCategories', undefined, inputOpts);
}
exports.listAllCategories = listAllCategories;

function listAllSubcategories(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, false);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listAllSubcategories', inputVars, inputOpts);
}
exports.listAllSubcategories = listAllSubcategories;

function listTrendingSpirits(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, false);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listTrendingSpirits', inputVars, inputOpts);
}
exports.listTrendingSpirits = listTrendingSpirits;

function listNewArrivals(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, false);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listNewArrivals', inputVars, inputOpts);
}
exports.listNewArrivals = listNewArrivals;

function getSpirit(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('getSpirit', inputVars, inputOpts);
}
exports.getSpirit = getSpirit;

function adminListRawSpirits(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, false);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('adminListRawSpirits', inputVars, inputOpts);
}
exports.adminListRawSpirits = adminListRawSpirits;

function getUserProfile(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('getUserProfile', inputVars, inputOpts);
}
exports.getUserProfile = getUserProfile;

function listNewsArticles(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, false);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listNewsArticles', inputVars, inputOpts);
}
exports.listNewsArticles = listNewsArticles;

function getNewsArticle(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('getNewsArticle', inputVars, inputOpts);
}
exports.getNewsArticle = getNewsArticle;

function auditAllUsers(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('auditAllUsers', undefined, inputOpts);
}
exports.auditAllUsers = auditAllUsers;

function auditAllNews(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('auditAllNews', undefined, inputOpts);
}
exports.auditAllNews = auditAllNews;

function auditAllSpirits(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('auditAllSpirits', undefined, inputOpts);
}
exports.auditAllSpirits = auditAllSpirits;

function auditAllReviews(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('auditAllReviews', undefined, inputOpts);
}
exports.auditAllReviews = auditAllReviews;

function listSpiritReviews(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, false);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listSpiritReviews', inputVars, inputOpts);
}
exports.listSpiritReviews = listSpiritReviews;

function getSpiritReviewsCount(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('getSpiritReviewsCount', undefined, inputOpts);
}
exports.getSpiritReviewsCount = getSpiritReviewsCount;

function findReview(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('findReview', inputVars, inputOpts);
}
exports.findReview = findReview;

function getReview(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('getReview', inputVars, inputOpts);
}
exports.getReview = getReview;

function listSpiritsForSitemap(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listSpiritsForSitemap', undefined, inputOpts);
}
exports.listSpiritsForSitemap = listSpiritsForSitemap;

function getWorldCupResult(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('getWorldCupResult', inputVars, inputOpts);
}
exports.getWorldCupResult = getWorldCupResult;

function listSpiritsForWorldCup(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, false);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listSpiritsForWorldCup', inputVars, inputOpts);
}
exports.listSpiritsForWorldCup = listSpiritsForWorldCup;

function listAllSpiritsForWorldCup(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listAllSpiritsForWorldCup', undefined, inputOpts);
}
exports.listAllSpiritsForWorldCup = listAllSpiritsForWorldCup;

function listSpiritsByCategoryForWorldCup(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, false);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listSpiritsByCategoryForWorldCup', inputVars, inputOpts);
}
exports.listSpiritsByCategoryForWorldCup = listSpiritsByCategoryForWorldCup;

function listAiDiscoveryLogs(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listAiDiscoveryLogs', inputVars, inputOpts);
}
exports.listAiDiscoveryLogs = listAiDiscoveryLogs;

function listModificationRequests(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listModificationRequests', undefined, inputOpts);
}
exports.listModificationRequests = listModificationRequests;

function listUserCabinet(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listUserCabinet', inputVars, inputOpts);
}
exports.listUserCabinet = listUserCabinet;

function listUserReviews(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('listUserReviews', inputVars, inputOpts);
}
exports.listUserReviews = listUserReviews;

