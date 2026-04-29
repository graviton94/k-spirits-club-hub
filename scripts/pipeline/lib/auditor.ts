/**
 * auditor.ts — Stage 1: Completeness & readiness check
 * Determines which spirits are ready for AI enrichment vs need manual review.
 */

export type AuditStatus = 'READY' | 'SKIP_ALREADY_ENRICHED' | 'SKIP_MISSING_REQUIRED';

export interface AuditResult {
    status: AuditStatus;
    reason?: string;
}

/** Minimum viable fields required before a spirit can be upserted. */
const REQUIRED_FIELDS: Array<keyof RawSpiritInput> = ['id', 'name', 'category', 'imageUrl'];

export interface RawSpiritInput {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    isReviewed?: boolean;
    status?: string;
    [key: string]: unknown;
}

export function auditSpirit(spirit: RawSpiritInput): AuditResult {
    // 1. Required field completeness
    for (const field of REQUIRED_FIELDS) {
        const val = spirit[field];
        if (val === undefined || val === null || val === '') {
            return { status: 'SKIP_MISSING_REQUIRED', reason: `Missing required field: ${field}` };
        }
    }

    // 2. Already enriched + published — skip unless explicitly requested
    if (spirit.isReviewed === true && spirit.status === 'ENRICHED') {
        return { status: 'SKIP_ALREADY_ENRICHED', reason: 'Already enriched (isReviewed=true, status=ENRICHED)' };
    }

    return { status: 'READY' };
}

export function partitionByAudit(spirits: RawSpiritInput[]): {
    ready: RawSpiritInput[];
    skipped: Array<{ spirit: RawSpiritInput; reason: string }>;
} {
    const ready: RawSpiritInput[] = [];
    const skipped: Array<{ spirit: RawSpiritInput; reason: string }> = [];

    for (const spirit of spirits) {
        const result = auditSpirit(spirit);
        if (result.status === 'READY') {
            ready.push(spirit);
        } else {
            skipped.push({ spirit, reason: result.reason ?? result.status });
        }
    }

    return { ready, skipped };
}
