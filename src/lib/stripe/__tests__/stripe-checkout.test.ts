import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { TWENTY_PROJECT_CONCEPTS } from "@/lib/data/seededProjects";
import { updateProjectVerification } from "@/lib/actions/adminProjects";
import { createProjectCheckoutSession } from "../checkout";
import { getStripeClient } from "../client";
import {
  fulfillPurchaseOrder,
  markPurchaseFailed,
  processPurchaseRefund,
  getPurchaseBySessionId,
  getEntitlementByPurchaseId,
  clearOrderStore,
} from "../orderStore";
import { validateDownloadToken, clearTokenRegistry } from "@/lib/pdf/downloadProtection";
import { POST as checkoutRouteHandler } from "@/app/api/checkout/route";
import { POST as webhookRouteHandler } from "@/app/api/webhooks/stripe/route";

// Mock next/cache revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock environment variables for Stripe testing
process.env.STRIPE_SECRET_KEY = "sk_test_mock_secret_key_12345";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_mock_test_webhook_secret_67890";

describe("Phase 5: Stripe Checkout, Webhooks, Idempotency & Entitlement Protection", () => {
  beforeEach(() => {
    clearOrderStore();
    clearTokenRegistry();
  });

  // --------------------------------------------------------------------------
  // 1. Fixed Database Pricing & Verification Commerce Guard
  // --------------------------------------------------------------------------
  describe("Server-Side Checkout Session Creation", () => {
    it("CRITICAL RULE: Should strictly reject checkout for unverified project plans", async () => {
      // All seeded projects are initially draft or reviewing
      const draftProject = TWENTY_PROJECT_CONCEPTS[0];
      expect(draftProject.verificationStatus).not.toBe("verified");

      await expect(
        createProjectCheckoutSession({
          projectId: draftProject.id,
          customerEmail: "buyer@example.com",
        })
      ).rejects.toThrowError(/COMMERCE SECURITY VIOLATION/);
    });

    it("should allow checkout and enforce fixed 499 cents ($4.99 USD) once verified with physical evidence", async () => {
      // 1. Verify project with full 4-point physical evidence
      const verifyResult = await updateProjectVerification(
        "proj-001",
        "verified",
        {
          verifiedAt: new Date().toISOString(),
          verifiedBy: "Senior TCNA Master Craftsman",
          testBuildDate: "2026-10-18",
          prototypeDimensionsVerified: true,
          cutSafetyVerified: true,
          structuralStabilityVerified: true,
          materialAdhesionVerified: true,
          verificationNotes:
            "Workshop physical prototype built and tested. 1:1 dimensions verified, edges dressed, and 24hr mastic cure confirmed.",
        }
      );

      expect(verifyResult.success).toBe(true);
      expect(verifyResult.project?.verificationStatus).toBe("verified");

      // 2. Checkout session can now be initiated
      const sessionResult = await createProjectCheckoutSession({
        projectId: "proj-001",
        customerEmail: "verified-buyer@example.com",
      });

      expect(sessionResult.sessionId).toBeTruthy();
      expect(sessionResult.amountCents).toBe(499); // Strictly 499 cents ($4.99 USD)
      expect(sessionResult.projectSlug).toBe("mediterranean-mosaic-trivet");

      // Pending purchase record was created
      const pendingPurchase = getPurchaseBySessionId(sessionResult.sessionId);
      expect(pendingPurchase).toBeDefined();
      expect(pendingPurchase?.status).toBe("pending");
      expect(pendingPurchase?.amountCents).toBe(499);
      expect(pendingPurchase?.currency).toBe("usd");
    });

    it("should block API checkout requests for unverified projects with HTTP 403", async () => {
      // proj-002 is unverified
      const req = new NextRequest("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: "proj-002",
          customerEmail: "tamper@example.com",
        }),
      });

      const res = await checkoutRouteHandler(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toContain("COMMERCE SECURITY VIOLATION");
    });
  });

  // --------------------------------------------------------------------------
  // 2. Webhook Signature Verification
  // --------------------------------------------------------------------------
  describe("Cryptographic Webhook Signature Verification", () => {
    it("should reject webhook requests missing the stripe-signature header with HTTP 400", async () => {
      const req = new NextRequest("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "checkout.session.completed" }),
      });

      const res = await webhookRouteHandler(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Missing stripe-signature header");
    });

    it("should reject webhook requests with an invalid/forged signature with HTTP 400", async () => {
      const req = new NextRequest("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": "t=12345678,v1=fake_forged_signature_hash_00000",
        },
        body: JSON.stringify({ type: "checkout.session.completed" }),
      });

      const res = await webhookRouteHandler(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Webhook signature verification failed");
    });

    it("should process webhook requests with a cryptographically valid test signature", async () => {
      const stripe = getStripeClient();
      const payload = JSON.stringify({
        id: "evt_test_12345",
        object: "event",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_session_abc",
            payment_status: "paid",
            status: "complete",
            payment_intent: "pi_test_intent_xyz",
            customer_details: { email: "buyer@leftovertileplanner.com" },
          },
        },
      });

      const header = stripe.webhooks.generateTestHeaderString({
        payload,
        secret: process.env.STRIPE_WEBHOOK_SECRET!,
      });

      const req = new NextRequest("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": header,
        },
        body: payload,
      });

      const res = await webhookRouteHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.received).toBe(true);
      expect(data.event).toBe("checkout.session.completed");

      // Verify entitlement was granted
      const purchase = getPurchaseBySessionId("cs_test_session_abc");
      expect(purchase).toBeDefined();
      expect(purchase?.status).toBe("completed");
    });
  });

  // --------------------------------------------------------------------------
  // 3. Idempotent Fulfillment & Entitlement Records
  // --------------------------------------------------------------------------
  describe("Idempotent Fulfillment", () => {
    it("should fulfill purchase on first delivery and issue download token", () => {
      const sessionId = "cs_test_unique_id_101";

      const firstDelivery = fulfillPurchaseOrder({
        stripeSessionId: sessionId,
        stripePaymentIntentId: "pi_test_101",
        customerEmail: "customer@example.com",
      });

      expect(firstDelivery.alreadyProcessed).toBe(false);
      expect(firstDelivery.purchase.status).toBe("completed");
      expect(firstDelivery.entitlement).toBeDefined();
      expect(firstDelivery.entitlement?.downloadToken).toBeTruthy();

      // Download token is active in the download protection pipeline
      const tokenCheck = validateDownloadToken(firstDelivery.entitlement!.downloadToken);
      expect(tokenCheck.isValid).toBe(true);
    });

    it("should handle duplicate webhook delivery idempotently without duplicating tokens", () => {
      const sessionId = "cs_test_idempotent_session";

      // First webhook delivery
      const firstDelivery = fulfillPurchaseOrder({
        stripeSessionId: sessionId,
        stripePaymentIntentId: "pi_test_idem",
        customerEmail: "customer@example.com",
      });
      expect(firstDelivery.alreadyProcessed).toBe(false);
      const originalToken = firstDelivery.entitlement?.downloadToken;

      // Second identical webhook delivery (Stripe retry)
      const secondDelivery = fulfillPurchaseOrder({
        stripeSessionId: sessionId,
        stripePaymentIntentId: "pi_test_idem",
        customerEmail: "customer@example.com",
      });

      expect(secondDelivery.alreadyProcessed).toBe(true);
      expect(secondDelivery.purchase.status).toBe("completed");
      // Must preserve the identical entitlement and token, not mint a new one
      expect(secondDelivery.entitlement?.downloadToken).toBe(originalToken);
    });
  });

  // --------------------------------------------------------------------------
  // 4. Failed Payments, Refunds & Revocation Policy
  // --------------------------------------------------------------------------
  describe("Failed Payments & Refund Revocation", () => {
    it("should mark purchase as failed and not issue download tokens on payment failure", () => {
      const paymentIntentId = "pi_failed_test_999";

      const failedOrder = markPurchaseFailed({
        stripePaymentIntentId: paymentIntentId,
        reason: "Card was declined (insufficient funds)",
      });

      expect(failedOrder?.status).toBe("failed");
      expect(failedOrder?.failureReason).toContain("declined");

      // No entitlement was issued
      const entitlement = getEntitlementByPurchaseId(paymentIntentId);
      expect(entitlement).toBeNull();
    });

    it("should immediately revoke entitlement and download token upon charge.refunded", () => {
      const sessionId = "cs_test_refund_target";
      const paymentIntentId = "pi_test_refund_intent";

      // 1. Initial purchase completed
      const fulfilled = fulfillPurchaseOrder({
        stripeSessionId: sessionId,
        stripePaymentIntentId: paymentIntentId,
        customerEmail: "buyer-refund@example.com",
      });
      const downloadToken = fulfilled.entitlement!.downloadToken;

      // Token is valid prior to refund
      expect(validateDownloadToken(downloadToken).isValid).toBe(true);

      // 2. Refund event processed
      const refundResult = processPurchaseRefund({
        stripePaymentIntentId: paymentIntentId,
        reason: "customer_requested_refund",
      });

      expect(refundResult.success).toBe(true);
      expect(refundResult.purchase?.status).toBe("refunded");
      expect(refundResult.entitlement?.isRevoked).toBe(true);

      // 3. Download token is now strictly REVOKED (HTTP 403)
      const postRefundValidation = validateDownloadToken(downloadToken);
      expect(postRefundValidation.isValid).toBe(false);
      expect(postRefundValidation.statusCode).toBe(403);
      expect(postRefundValidation.error).toContain("revoked");
    });
  });
});
