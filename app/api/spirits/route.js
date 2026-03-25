"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
exports.GET = GET;
var server_1 = require("next/server");
var firestore_rest_1 = require("@/lib/db/firestore-rest");
// Edge runtime for Cloudflare Pages compatibility
exports.runtime = 'edge';
/**
 * GET /api/spirits
 * Public API endpoint for fetching published spirits data
 *
 * Query Parameters:
 * - mode=index: Returns lightweight search index
 * - mode=full (default): Returns full spirits and search index
 * - q/searchTerm: Search term for server-side filtering
 * - category: Category filter
 * - subcategory: Subcategory filter
 * - country: Country filter
 */
function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var searchParams, mode, category, subcategory, country, searchTerm, spirits, filteredResults, lowerSearch_1, indexSizePreMap, searchIndex, indexSize, indexSizeKB, limitedSpirits, fullSize, fullSizeKB, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    searchParams = new URL(request.url).searchParams;
                    mode = searchParams.get('mode') || 'full';
                    category = searchParams.get('category') || undefined;
                    subcategory = searchParams.get('subcategory') || undefined;
                    country = searchParams.get('country') || undefined;
                    searchTerm = searchParams.get('searchTerm') || searchParams.get('q') || undefined;
                    console.log("[API] GET /api/spirits?mode=".concat(mode, "&q=").concat(searchTerm || '', " - Fetching spirits..."));
                    return [4 /*yield*/, firestore_rest_1.spiritsDb.getAll({
                            isPublished: true,
                            category: category,
                            subcategory: subcategory,
                            country: country
                        })];
                case 1:
                    spirits = _a.sent();
                    if (!spirits || spirits.length === 0) {
                        return [2 /*return*/, server_1.NextResponse.json({
                                publishedSpirits: [],
                                searchIndex: [],
                                count: 0,
                                timestamp: Date.now()
                            }, { status: 200 })];
                    }
                    filteredResults = spirits;
                    if (searchTerm) {
                        lowerSearch_1 = searchTerm.toLowerCase();
                        filteredResults = spirits.filter(function (s) {
                            var _a;
                            return (s.name && s.name.toLowerCase().includes(lowerSearch_1)) ||
                                (s.name_en && s.name_en.toLowerCase().includes(lowerSearch_1)) ||
                                (((_a = s.metadata) === null || _a === void 0 ? void 0 : _a.name_en) && s.metadata.name_en.toLowerCase().includes(lowerSearch_1)) ||
                                (s.distillery && s.distillery.toLowerCase().includes(lowerSearch_1)) ||
                                (s.category && s.category.toLowerCase().includes(lowerSearch_1));
                        });
                    }
                    indexSizePreMap = JSON.stringify(filteredResults.map(function (s) { return ({ i: s.id }); })).length;
                    console.log("[API] Preparing search index for ".concat(filteredResults.length, " items."));
                    searchIndex = filteredResults.map(function (s) { return ({
                        i: s.id,
                        n: s.name || '이름 없음',
                        en: s.name_en || null,
                        c: s.category || '기타',
                        sc: s.subcategory || null,
                        t: s.thumbnailUrl || s.imageUrl || null,
                        a: s.abv || 0,
                        d: s.distillery || null,
                        tn: s.tasting_note || null, // Strictly use root tasting_note
                    }); });
                    indexSize = JSON.stringify(searchIndex).length;
                    indexSizeKB = (indexSize / 1024).toFixed(2);
                    if (mode === 'index') {
                        console.log("[OPTIMIZATION] Index-only mode: ".concat(indexSizeKB, " KB for ").concat(searchIndex.length, " items (Source: ").concat(spirits.length, ")"));
                        return [2 /*return*/, server_1.NextResponse.json({
                                searchIndex: searchIndex,
                                count: searchIndex.length,
                                timestamp: Date.now()
                            }, {
                                status: 200,
                                headers: {
                                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                                }
                            })];
                    }
                    limitedSpirits = filteredResults.slice(0, 100);
                    fullSize = JSON.stringify(limitedSpirits).length;
                    fullSizeKB = (fullSize / 1024).toFixed(2);
                    console.log("[OPTIMIZATION] Full mode: Index=".concat(indexSizeKB, " KB, Full Data=").concat(fullSizeKB, " KB"));
                    return [2 /*return*/, server_1.NextResponse.json({
                            publishedSpirits: limitedSpirits,
                            searchIndex: searchIndex,
                            count: searchIndex.length,
                            timestamp: Date.now()
                        }, {
                            status: 200,
                            headers: {
                                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                            }
                        })];
                case 2:
                    error_1 = _a.sent();
                    console.error('[API] ❌ Error fetching spirits:', error_1);
                    return [2 /*return*/, server_1.NextResponse.json({
                            error: 'Failed to fetch spirits data',
                            publishedSpirits: [],
                            searchIndex: [],
                            count: 0,
                            timestamp: Date.now()
                        }, { status: 500 })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
