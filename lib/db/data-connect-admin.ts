import 'server-only';

import '@/lib/firebase-admin';
import { getDataConnect, DataConnect } from 'firebase-admin/data-connect';
import {
	upsertSpirit,
	deleteSpirit,
	upsertNews,
	upsertUser,
	upsertReview,
	updateReview,
	deleteReview,
	adminListRawSpirits,
	upsertCabinet,
	deleteCabinet,
	listUserCabinet,
	listUserReviews,
	getUserProfile,
	searchSpiritsPublic,
} from '@/src/dataconnect-admin-generated';

let adminDC: DataConnect | null = null;

function getAdminDC(): DataConnect {
	if (!adminDC) {
		adminDC = getDataConnect({
			serviceId: 'k-spirits-club-hub',
			location: 'asia-northeast3',
			connector: 'main',
		});
	}
	return adminDC;
}

function filterAllowedFields(data: Record<string, unknown>, allowedKeys: string[]) {
	const filtered: Record<string, unknown> = {};
	allowedKeys.forEach((key) => {
		if (key in data) filtered[key] = data[key];
	});
	return filtered;
}

export async function dbAdminUpsertSpirit(vars: Record<string, unknown>) {
	const normalized = {
		...vars,
		imageUrl: typeof vars.imageUrl === 'string' ? vars.imageUrl.replace(/^http:\/\//i, 'https://') : vars.imageUrl,
		thumbnailUrl: typeof vars.thumbnailUrl === 'string' ? vars.thumbnailUrl.replace(/^http:\/\//i, 'https://') : vars.thumbnailUrl,
	};
	const allowed = [
		'id', 'name', 'nameEn', 'category', 'categoryEn', 'mainCategory', 'subcategory',
		'distillery', 'bottler', 'abv', 'volume', 'country', 'region', 'imageUrl', 'thumbnailUrl',
		'descriptionKo', 'descriptionEn', 'pairingGuideKo', 'pairingGuideEn',
		'noseTags', 'palateTags', 'finishTags', 'tastingNote', 'status',
		'isPublished', 'isReviewed', 'reviewedBy', 'reviewedAt', 'rating', 'reviewCount',
		'importer', 'rawCategory', 'metadata', 'updatedAt'
	];
	return upsertSpirit(getAdminDC(), filterAllowedFields(normalized, allowed) as any);
}

export async function dbAdminDeleteSpirit(id: string) {
	return deleteSpirit(getAdminDC(), { id });
}

export async function dbAdminUpsertNews(vars: Record<string, unknown>) {
	const normalized = {
		...vars,
		link: typeof vars.link === 'string' ? vars.link.replace(/^http:\/\//i, 'https://') : vars.link,
	};
	const allowed = ['id', 'title', 'content', 'imageUrl', 'category', 'source', 'link', 'date', 'translations', 'tags'];
	return upsertNews(getAdminDC(), filterAllowedFields(normalized, allowed) as any);
}

export async function dbAdminGetUserProfile(id: string) {
	const { data } = await getUserProfile(getAdminDC(), { id });
	return data.user;
}

export async function dbAdminUpsertUser(vars: Record<string, unknown>) {
	const allowed = [
		'id', 'email', 'nickname', 'profileImage', 'role', 'themePreference',
		'isFirstLogin', 'reviewsWritten', 'heartsReceived', 'tasteProfile'
	];
	return upsertUser(getAdminDC(), filterAllowedFields(vars, allowed) as any);
}

export async function dbAdminSearchSpiritsPublic(vars: {
	search?: string;
	category?: string;
	subcategory?: string;
	limit?: number;
	offset?: number;
}) {
	const { data } = await searchSpiritsPublic(getAdminDC(), vars);
	return data.spirits;
}

export async function dbAdminUpsertReview(vars: Record<string, unknown>) {
	const allowed = ['id', 'spiritId', 'userId', 'rating', 'title', 'content', 'nose', 'palate', 'finish', 'likes', 'likedBy', 'isPublished', 'imageUrls', 'createdAt', 'updatedAt'];
	return upsertReview(getAdminDC(), filterAllowedFields(vars, allowed) as any);
}

export async function dbAdminUpdateReview(vars: Record<string, unknown>) {
	const allowed = ['id', 'likes', 'likedBy'];
	return updateReview(getAdminDC(), filterAllowedFields(vars, allowed) as any);
}

export async function dbAdminDeleteReview(id: string) {
	return deleteReview(getAdminDC(), { id });
}

export async function dbAdminListRawSpirits(vars: {
	limit?: number;
	offset?: number;
	category?: string;
	distillery?: string;
	isPublished?: boolean;
	search?: string;
}) {
	const { data } = await adminListRawSpirits(getAdminDC(), vars);
	return data.spirits;
}

export async function dbAdminUpsertCabinet(vars: Record<string, unknown>) {
	return upsertCabinet(getAdminDC(), vars as any);
}

export async function dbAdminDeleteCabinet(vars: { userId: string; spiritId: string }) {
	return deleteCabinet(getAdminDC(), vars);
}

export async function dbAdminListUserCabinet(userId: string) {
	const { data } = await listUserCabinet(getAdminDC(), { userId });
	return data.userCabinets;
}

export async function dbAdminListUserReviews(userId: string) {
	const { data } = await listUserReviews(getAdminDC(), { userId });
	return data.spiritReviews;
}
