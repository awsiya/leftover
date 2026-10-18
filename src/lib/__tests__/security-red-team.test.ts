import { describe, it, expect, beforeEach } from "vitest";
import { fulfillPurchaseOrder, clearOrderStore } from "@/lib/stripe/orderStore";
import { validateTileInput } from "@/lib/matching/validator";
import {
  createPlanDownloadToken,
  validateDownloadToken,
  revokeDownloadToken,
  recordTokenAccess,
  clearTokenRegistry,
} from "@/lib/pdf/downloadProtection";
import { assertProjectCanBeSold } from "@/lib/types/verification";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("Red-Team Security & Integrity Verification Suite", () => {
  beforeEach(() => {
    clearOrderStore();
    clearTokenRegistry();
  });

  // --------------------------------------------------------------------------
  // 1. Order Store Server Restart & Metadata Resilience
  // --------------------------------------------------------------------------
  describe("Order Store & Metadata Integrity (Server Restart Resilience)", () => {
    it("should honor Stripe metadata instead of hardcoded fallback when serverless instance restarts", () => {
      // Simulate incoming webhook on a cold container where purchasesStore is empty
      const result = fulfillPurchaseOrder({
        stripeSessionId: "cs_test_cold_start_session_999",
        stripePaymentIntentId: "pi_test_cold_start_999",
        customerEmail: "architect@example.com",
        projectId: "proj-008",
        projectSlug: "outdoor-mosaic-fire-pit",
        planVersion: "v1.2.0",
      });

      expect(result.alreadyProcessed).toBe(false);
      expect(result.purchase.projectId).toBe("proj-008");
      expect(result.purchase.projectSlug).toBe("outdoor-mosaic-fire-pit");
      expect(result.purchase.planVersion).toBe("v1.2.0");
      expect(result.purchase.customerEmail).toBe("architect@example.com");

      // Verify entitlement matches the purchased project, NOT default proj-001
      expect(result.entitlement?.projectId).toBe("proj-008");
      expect(result.entitlement?.projectSlug).toBe("outdoor-mosaic-fire-pit");
      expect(result.entitlement?.planVersion).toBe("v1.2.0");
    });

    it("should strictly maintain idempotency across duplicate webhook delivery", () => {
      const first = fulfillPurchaseOrder({
        stripeSessionId: "cs_test_duplicate_delivery",
        customerEmail: "buyer@example.com",
        projectId: "proj-002",
        projectSlug: "geometric-herringbone-plant-pedestal",
      });

      expect(first.alreadyProcessed).toBe(false);
      const token1 = first.entitlement?.downloadToken;

      // Re-delivery of identical webhook
      const second = fulfillPurchaseOrder({
        stripeSessionId: "cs_test_duplicate_delivery",
        customerEmail: "buyer@example.com",
        projectId: "proj-002",
        projectSlug: "geometric-herringbone-plant-pedestal",
      });

      expect(second.alreadyProcessed).toBe(true);
      expect(second.entitlement?.downloadToken).toBe(token1);
    });
  });

  // --------------------------------------------------------------------------
  // 2. Input Validation Bounds & Anti-Tampering
  // --------------------------------------------------------------------------
  describe("Input Validation & Extreme Dimension Constraints", () => {
    it("should reject astronomical dimensions (e.g. 150 inches = 12.5 ft)", () => {
      const result = validateTileInput({
        length: 150,
        width: 12,
        unit: "inches",
        quantity: 5,
        condition: "intact",
        materialType: "ceramic",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.some((e) => e.includes("exceeds maximum supported size"))).toBe(true);
    });

    it("should accept realistic large architectural slabs within 120 inches", () => {
      const result = validateTileInput({
        length: 48,
        width: 24,
        unit: "inches",
        quantity: 10,
        condition: "intact",
        materialType: "porcelain",
      });

      expect(result.success).toBe(true);
      expect(result.data?.length).toBe(48);
    });

    it("should reject negative dimensions, non-integers for quantity, and invalid materials", () => {
      const negativeLength = validateTileInput({
        length: -10,
        width: 10,
        unit: "cm",
        quantity: 5,
        condition: "intact",
        materialType: "ceramic",
      });
      expect(negativeLength.success).toBe(false);

      const nonIntQuantity = validateTileInput({
        length: 10,
        width: 10,
        unit: "cm",
        quantity: 5.5,
        condition: "intact",
        materialType: "ceramic",
      });
      expect(nonIntQuantity.success).toBe(false);

      const invalidMaterial = validateTileInput({
        length: 10,
        width: 10,
        unit: "cm",
        quantity: 5,
        condition: "intact",
        materialType: "unobtanium",
      });
      expect(invalidMaterial.success).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // 3. Commerce Safety & Physical Verification Guard
  // --------------------------------------------------------------------------
  describe("Commerce Safety Guard & Verification Integrity", () => {
    it("should throw COMMERCE SECURITY VIOLATION when attempting to sell unverified plans", () => {
      expect(() => {
        assertProjectCanBeSold({
          id: "proj-001",
          slug: "mediterranean-mosaic-trivet",
          title: "Mediterranean Mosaic Kitchen Trivet",
          verification_status: "reviewing",
        });
      }).toThrow(/COMMERCE SECURITY VIOLATION/);

      expect(() => {
        assertProjectCanBeSold({
          id: "proj-002",
          slug: "draft-project",
          title: "Draft Concept",
          verification_status: "draft",
        });
      }).toThrow(/COMMERCE SECURITY VIOLATION/);
    });

    it("should allow sale only when status is strictly 'verified'", () => {
      expect(() => {
        assertProjectCanBeSold({
          id: "proj-001",
          slug: "mediterranean-mosaic-trivet",
          title: "Mediterranean Mosaic Kitchen Trivet",
          verification_status: "verified",
        });
      }).not.toThrow();
    });
  });

  // --------------------------------------------------------------------------
  // 4. PDF Access Security & Token Revocation
  // --------------------------------------------------------------------------
  describe("PDF Token Security, Expiry & Immediate Revocation", () => {
    it("should generate cryptographically strong UUID tokens and respect max download limits", () => {
      const token = createPlanDownloadToken({
        projectId: "proj-001",
        projectSlug: "mediterranean-mosaic-trivet",
        customerEmail: "buyer@example.com",
        maxAccessCount: 2,
        isAdminPreview: true,
      });

      // Token format check (UUID v4)
      expect(token.token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      // Access 1: valid
      expect(validateDownloadToken(token.token).isValid).toBe(true);
      recordTokenAccess(token.token);

      // Access 2: valid
      expect(validateDownloadToken(token.token).isValid).toBe(true);
      recordTokenAccess(token.token);

      // Access 3: exceeded maxAccessCount
      const thirdCheck = validateDownloadToken(token.token);
      expect(thirdCheck.isValid).toBe(false);
      expect(thirdCheck.statusCode).toBe(429);
    });

    it("should immediately block access (HTTP 403) upon token revocation (refunds/chargebacks)", () => {
      const token = createPlanDownloadToken({
        projectId: "proj-001",
        projectSlug: "mediterranean-mosaic-trivet",
        customerEmail: "refunded@example.com",
        isAdminPreview: true,
      });

      expect(validateDownloadToken(token.token).isValid).toBe(true);

      // Trigger revocation
      revokeDownloadToken(token.token);

      const revokedCheck = validateDownloadToken(token.token);
      expect(revokedCheck.isValid).toBe(false);
      expect(revokedCheck.statusCode).toBe(403);
      expect(revokedCheck.error).toContain("revoked");
    });
  });

  // --------------------------------------------------------------------------
  // 5. Search Engine Crawl Security & Robots Disallow
  // --------------------------------------------------------------------------
  describe("Crawler Security & Indexing Boundaries", () => {
    it("should strictly disallow admin, api, and checkout paths in robots.txt", () => {
      const config = robots();
      const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;

      expect(rules.disallow).toContain("/admin");
      expect(rules.disallow).toContain("/admin/");
      expect(rules.disallow).toContain("/api/");
      expect(rules.disallow).toContain("/checkout/");
    });

    it("should ensure sitemap only indexes public canonical pages and alternate languages", () => {
      const entries = sitemap();
      for (const entry of entries) {
        expect(entry.url).not.toContain("/admin");
        expect(entry.url).not.toContain("/api");
        expect(entry.url).not.toContain("/checkout");
      }
    });
  });
});
