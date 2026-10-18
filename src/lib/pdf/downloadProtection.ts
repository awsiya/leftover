import crypto from "node:crypto";
import { DownloadToken, DownloadTokenValidationResult } from "@/lib/types/planVersion";
import { TWENTY_PROJECT_CONCEPTS } from "@/lib/data/seededProjects";
import { assertProjectCanBeSold } from "@/lib/types/verification";

// In-memory token store for download access control
const tokenRegistry = new Map<string, DownloadToken>();

export interface CreateTokenParams {
  projectId: string;
  projectSlug: string;
  planVersion?: string;
  customerEmail?: string;
  expiresInSeconds?: number;
  maxAccessCount?: number;
  isAdminPreview?: boolean;
}

/**
 * Creates a cryptographically random, protected download token for a plan version.
 * Enforces the physical verification gate: unverified projects cannot have download
 * tokens issued unless flagged explicitly for admin audit preview.
 */
export function createPlanDownloadToken({
  projectId,
  projectSlug,
  planVersion = "v1.0.0",
  customerEmail = "customer@example.com",
  expiresInSeconds = 3600, // 1 hour default
  maxAccessCount = 10,
  isAdminPreview = false,
}: CreateTokenParams): DownloadToken {
  const project = TWENTY_PROJECT_CONCEPTS.find(
    (p) => p.id === projectId || p.slug === projectSlug
  );

  if (!project) {
    throw new Error(`Project not found: ${projectSlug || projectId}`);
  }

  // Enforce Phase 3 commerce safety guard: unverified projects cannot be sold or downloaded
  // unless under explicit admin preview authorization.
  if (!isAdminPreview) {
    assertProjectCanBeSold({
      id: project.id,
      slug: project.slug,
      title: project.translations.en.title,
      verification_status: project.verificationStatus,
    });
  }

  const tokenString = crypto.randomUUID();
  const now = Date.now();

  const tokenRecord: DownloadToken = {
    token: tokenString,
    projectId: project.id,
    projectSlug: project.slug,
    planVersion,
    customerEmail,
    expiresAt: now + expiresInSeconds * 1000,
    maxAccessCount,
    accessCount: 0,
    isRevoked: false,
    createdAt: now,
    lastAccessedAt: null,
    isAdminPreview,
  };

  tokenRegistry.set(tokenString, tokenRecord);
  return tokenRecord;
}

/**
 * Validates a download token against expiration, access count limits, and revocation.
 */
export function validateDownloadToken(token: string): DownloadTokenValidationResult {
  if (!token || typeof token !== "string") {
    return {
      isValid: false,
      error: "Missing or malformed download token.",
      statusCode: 400,
    };
  }

  const record = tokenRegistry.get(token);
  if (!record) {
    return {
      isValid: false,
      error: "Download authorization token not found or invalid.",
      statusCode: 404,
    };
  }

  if (record.isRevoked) {
    return {
      isValid: false,
      error: "Download token has been revoked.",
      statusCode: 403,
    };
  }

  if (Date.now() > record.expiresAt) {
    return {
      isValid: false,
      error: "Download token has expired. Please request a new access link.",
      statusCode: 410,
    };
  }

  if (record.accessCount >= record.maxAccessCount) {
    return {
      isValid: false,
      error: `Maximum download limit (${record.maxAccessCount} downloads) reached for this link.`,
      statusCode: 429,
    };
  }

  return {
    isValid: true,
    tokenRecord: record,
  };
}

/**
 * Records an access event for a validated token.
 */
export function recordTokenAccess(token: string): boolean {
  const record = tokenRegistry.get(token);
  if (!record) return false;

  record.accessCount += 1;
  record.lastAccessedAt = Date.now();
  tokenRegistry.set(token, record);
  return true;
}

/**
 * Revokes a download token immediately.
 */
export function revokeDownloadToken(token: string): boolean {
  const record = tokenRegistry.get(token);
  if (!record) return false;

  record.isRevoked = true;
  tokenRegistry.set(token, record);
  return true;
}

/**
 * Helper for testing/dev: clears token registry.
 */
export function clearTokenRegistry(): void {
  tokenRegistry.clear();
}
