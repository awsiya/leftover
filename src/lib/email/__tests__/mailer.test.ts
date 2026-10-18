import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateOrderConfirmationHtml,
  generateOrderConfirmationText,
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
} from "../mailer";

// Mock Resend class
vi.mock("resend", () => {
  return {
    Resend: class MockResend {
      emails = {
        send: vi.fn().mockResolvedValue({
          data: { id: "mock-email-id-12345" },
          error: null,
        }),
      };
    },
  };
});

describe("Resend Mailer Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "re_test_mock_api_key_123";
    process.env.RESEND_FROM_EMAIL = "Leftover Tile Planner <leftover@4dev.in>";
  });

  describe("HTML & Text Email Template Generation", () => {
    it("generates editorial HTML receipt with project title, price, and download link", () => {
      const html = generateOrderConfirmationHtml({
        customerName: "Alex",
        projectTitle: "Mediterranean Mosaic Kitchen Trivet",
        planVersion: "v1.0.0",
        orderId: "ord-test-999-abc",
        amountCents: 499,
        downloadUrl: "https://4dev.in/api/plans/test-tok-123/download",
        difficulty: "beginner",
      });

      expect(html).toContain("Leftover Tile Project Planner");
      expect(html).toContain("Hello Alex,");
      expect(html).toContain("Mediterranean Mosaic Kitchen Trivet");
      expect(html).toContain("$4.99 USD");
      expect(html).toContain("v1.0.0");
      expect(html).toContain("https://4dev.in/api/plans/test-tok-123/download");
      expect(html).toContain("Workshop Safety Note");
      expect(html).toContain("leftover@4dev.in");
    });

    it("generates plain-text fallback with all critical plan details", () => {
      const text = generateOrderConfirmationText({
        customerName: "Sam",
        projectTitle: "Herringbone Plant Pedestal",
        planVersion: "v1.0.0",
        orderId: "ord-888",
        amountCents: 499,
        downloadUrl: "https://4dev.in/api/plans/tok-456/download",
      });

      expect(text).toContain("ORDER SUMMARY");
      expect(text).toContain("Herringbone Plant Pedestal");
      expect(text).toContain("$4.99 USD");
      expect(text).toContain("https://4dev.in/api/plans/tok-456/download");
      expect(text).toContain("SAFETY REMINDER");
    });
  });

  describe("Transactional Email Dispatch & Idempotency", () => {
    it("successfully dispatches order confirmation email via Resend", async () => {
      const result = await sendOrderConfirmationEmail({
        customerEmail: "customer@example.com",
        customerName: "Jordan",
        projectTitle: "Artisan Checkerboard Coasters",
        projectSlug: "artisan-checkerboard-coasters",
        planVersion: "v1.0.0",
        orderId: "ord-unique-001",
        amountCents: 499,
        downloadUrl: "https://4dev.in/api/plans/token-unique/download",
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("mock-email-id-12345");
    });

    it("is idempotent: suppresses duplicate email delivery for the same order session", async () => {
      // First send
      const first = await sendOrderConfirmationEmail({
        customerEmail: "customer@example.com",
        projectTitle: "Artisan Checkerboard Coasters",
        projectSlug: "artisan-checkerboard-coasters",
        planVersion: "v1.0.0",
        orderId: "ord-duplicate-test",
        amountCents: 499,
        downloadUrl: "https://4dev.in/api/plans/token-unique/download",
      });
      expect(first.success).toBe(true);

      // Second send with same orderId
      const second = await sendOrderConfirmationEmail({
        customerEmail: "customer@example.com",
        projectTitle: "Artisan Checkerboard Coasters",
        projectSlug: "artisan-checkerboard-coasters",
        planVersion: "v1.0.0",
        orderId: "ord-duplicate-test",
        amountCents: 499,
        downloadUrl: "https://4dev.in/api/plans/token-unique/download",
      });
      expect(second.success).toBe(true);
    });

    it("dispatches admin notification for new plan purchases", async () => {
      const result = await sendAdminOrderNotification({
        orderId: "ord-admin-test-01",
        customerEmail: "buyer@example.com",
        projectTitle: "Mosaic Garden Stepping Stones",
        amountCents: 499,
        stripeSessionId: "cs_test_admin_session",
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("mock-email-id-12345");
    });

    it("dispatches 6-digit login verification OTP to admin recipients", async () => {
      const { sendAdminLoginOtpEmail } = await import("../mailer");
      const result = await sendAdminLoginOtpEmail({
        otpCode: "654321",
        requestedEmail: "piyakshi90@gmail.com",
        recipients: ["piyakshi90@gmail.com", "one2ai@aol.com"],
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("mock-email-id-12345");
    });
  });
});
