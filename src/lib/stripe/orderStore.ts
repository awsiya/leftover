import crypto from "node:crypto";
import {
  createPlanDownloadToken,
  revokeDownloadToken,
} from "@/lib/pdf/downloadProtection";

export type PurchaseStatus = "pending" | "completed" | "refunded" | "failed";

export interface PurchaseOrder {
  id: string;
  projectId: string;
  projectSlug: string;
  planVersion: string;
  customerEmail: string;
  amountCents: number; // 499
  currency: string; // 'usd'
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  status: PurchaseStatus;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntitlementRecord {
  id: string;
  purchaseId: string;
  customerEmail: string;
  projectId: string;
  projectSlug: string;
  planVersion: string;
  downloadToken: string;
  isRevoked: boolean;
  revokedReason?: string;
  maxDownloads: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

// In-memory repositories (in production backed by Supabase PostgreSQL tables `purchases` & `download_tokens`)
const purchasesStore = new Map<string, PurchaseOrder>(); // keyed by id and stripeSessionId
const entitlementsStore = new Map<string, EntitlementRecord>(); // keyed by id, purchaseId, and downloadToken

/**
 * Creates an initial pending purchase record when a Stripe Checkout Session is initiated.
 */
export function createPendingPurchase(params: {
  projectId: string;
  projectSlug: string;
  planVersion?: string;
  customerEmail?: string;
  stripeSessionId: string;
  amountCents?: number;
  currency?: string;
}): PurchaseOrder {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const purchase: PurchaseOrder = {
    id,
    projectId: params.projectId,
    projectSlug: params.projectSlug,
    planVersion: params.planVersion || "v1.0.0",
    customerEmail: params.customerEmail || "",
    amountCents: params.amountCents || 499,
    currency: params.currency || "usd",
    stripeSessionId: params.stripeSessionId,
    stripePaymentIntentId: null,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  purchasesStore.set(id, purchase);
  purchasesStore.set(params.stripeSessionId, purchase);
  return purchase;
}

/**
 * Fulfills a purchase order upon receiving a verified Stripe webhook (checkout.session.completed).
 * IDEMPOTENT: If the order has already been fulfilled, returns the existing record without duplicating tokens.
 */
export function fulfillPurchaseOrder(params: {
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
  customerEmail?: string | null;
  projectId?: string;
  projectSlug?: string;
  planVersion?: string;
}): {
  alreadyProcessed: boolean;
  purchase: PurchaseOrder;
  entitlement?: EntitlementRecord;
} {
  let purchase = purchasesStore.get(params.stripeSessionId);

  if (!purchase) {
    // If not found in memory (e.g. server restart), create and record completed purchase using metadata
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    purchase = {
      id,
      projectId: params.projectId || "proj-001",
      projectSlug: params.projectSlug || "mediterranean-mosaic-trivet",
      planVersion: params.planVersion || "v1.0.0",
      customerEmail: params.customerEmail || "customer@example.com",
      amountCents: 499,
      currency: "usd",
      stripeSessionId: params.stripeSessionId,
      stripePaymentIntentId: params.stripePaymentIntentId || null,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    purchasesStore.set(id, purchase);
    purchasesStore.set(params.stripeSessionId, purchase);
  } else {
    if (params.projectId && (purchase.projectId === "unknown" || !purchase.projectId)) {
      purchase.projectId = params.projectId;
    }
    if (params.projectSlug && (purchase.projectSlug === "unknown" || !purchase.projectSlug)) {
      purchase.projectSlug = params.projectSlug;
    }
  }

  // Idempotency Check: if already completed, do NOT issue duplicate tokens
  if (purchase.status === "completed") {
    const existingEntitlement = getEntitlementByPurchaseId(purchase.id);
    return {
      alreadyProcessed: true,
      purchase,
      entitlement: existingEntitlement || undefined,
    };
  }

  const now = new Date().toISOString();
  purchase.status = "completed";
  purchase.stripePaymentIntentId = params.stripePaymentIntentId || purchase.stripePaymentIntentId;
  if (params.customerEmail) {
    purchase.customerEmail = params.customerEmail;
  }
  purchase.updatedAt = now;

  // Issue protected PDF download token
  const downloadToken = createPlanDownloadToken({
    projectId: purchase.projectId,
    projectSlug: purchase.projectSlug,
    planVersion: purchase.planVersion,
    customerEmail: purchase.customerEmail || "verified-buyer@example.com",
    expiresInSeconds: 30 * 24 * 3600, // 30-day customer entitlement window
    maxAccessCount: 10,
    isAdminPreview: true, // Authorized post-payment fulfillment
  });

  const entitlementId = crypto.randomUUID();
  const entitlement: EntitlementRecord = {
    id: entitlementId,
    purchaseId: purchase.id,
    customerEmail: purchase.customerEmail,
    projectId: purchase.projectId,
    projectSlug: purchase.projectSlug,
    planVersion: purchase.planVersion,
    downloadToken: downloadToken.token,
    isRevoked: false,
    maxDownloads: 10,
    downloadCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  entitlementsStore.set(entitlementId, entitlement);
  entitlementsStore.set(purchase.id, entitlement);
  entitlementsStore.set(downloadToken.token, entitlement);

  return {
    alreadyProcessed: false,
    purchase,
    entitlement,
  };
}

/**
 * Marks a purchase order as failed (e.g. payment_intent.payment_failed).
 */
export function markPurchaseFailed(params: {
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  reason?: string;
}): PurchaseOrder {
  let purchase: PurchaseOrder | undefined;

  if (params.stripeSessionId) {
    purchase = purchasesStore.get(params.stripeSessionId);
  }

  if (!purchase && params.stripePaymentIntentId) {
    purchase = purchasesStore.get(params.stripePaymentIntentId);
    if (!purchase) {
      for (const p of purchasesStore.values()) {
        if (p.stripePaymentIntentId === params.stripePaymentIntentId) {
          purchase = p;
          break;
        }
      }
    }
  }

  const now = new Date().toISOString();

  if (!purchase) {
    const id = crypto.randomUUID();
    purchase = {
      id,
      projectId: "unknown",
      projectSlug: "unknown",
      planVersion: "v1.0.0",
      customerEmail: "",
      amountCents: 499,
      currency: "usd",
      stripeSessionId: params.stripeSessionId || id,
      stripePaymentIntentId: params.stripePaymentIntentId || null,
      status: "failed",
      failureReason: params.reason || "Payment declined or failed",
      createdAt: now,
      updatedAt: now,
    };
    purchasesStore.set(id, purchase);
    if (params.stripeSessionId) purchasesStore.set(params.stripeSessionId, purchase);
    if (params.stripePaymentIntentId) purchasesStore.set(params.stripePaymentIntentId, purchase);
    return purchase;
  }

  purchase.status = "failed";
  purchase.failureReason = params.reason || "Payment declined or failed";
  purchase.updatedAt = now;
  return purchase;
}

/**
 * Processes a refund or chargeback dispute: marks purchase refunded and REVOKES download access.
 */
export function processPurchaseRefund(params: {
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  reason?: string;
}): { success: boolean; purchase?: PurchaseOrder; entitlement?: EntitlementRecord } {
  let purchase: PurchaseOrder | undefined;

  if (params.stripePaymentIntentId) {
    for (const p of purchasesStore.values()) {
      if (p.stripePaymentIntentId === params.stripePaymentIntentId) {
        purchase = p;
        break;
      }
    }
  }

  if (!purchase && params.stripeSessionId) {
    purchase = purchasesStore.get(params.stripeSessionId);
  }

  if (!purchase) {
    return { success: false };
  }

  const now = new Date().toISOString();
  purchase.status = "refunded";
  purchase.updatedAt = now;

  // Revoke entitlement and download token
  const entitlement = getEntitlementByPurchaseId(purchase.id);
  if (entitlement) {
    entitlement.isRevoked = true;
    entitlement.revokedReason = params.reason || "charge_refunded";
    entitlement.updatedAt = now;

    // Invalidate the download token in the download protection pipeline
    revokeDownloadToken(entitlement.downloadToken);
  }

  return {
    success: true,
    purchase,
    entitlement: entitlement || undefined,
  };
}

/**
 * Retrieves a purchase by Stripe Checkout Session ID.
 */
export function getPurchaseBySessionId(sessionId: string): PurchaseOrder | null {
  return purchasesStore.get(sessionId) || null;
}

/**
 * Retrieves an entitlement by purchase ID.
 */
export function getEntitlementByPurchaseId(purchaseId: string): EntitlementRecord | null {
  return entitlementsStore.get(purchaseId) || null;
}

/**
 * Retrieves an entitlement by download token.
 */
export function getEntitlementByDownloadToken(token: string): EntitlementRecord | null {
  return entitlementsStore.get(token) || null;
}

/**
 * Clears stores for test suites.
 */
export function clearOrderStore(): void {
  purchasesStore.clear();
  entitlementsStore.clear();
}
