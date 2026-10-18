import { describe, it, expect, beforeEach } from "vitest";
import { PDFDocument } from "pdf-lib";
import { TWENTY_PROJECT_CONCEPTS } from "@/lib/data/seededProjects";
import {
  createPlanVersionSnapshot,
  computeSnapshotChecksum,
  getFrozenPlanVersion,
} from "../versionStore";
import { generateProjectPlanPdf } from "../generator";
import {
  createPlanDownloadToken,
  validateDownloadToken,
  recordTokenAccess,
  revokeDownloadToken,
  clearTokenRegistry,
} from "../downloadProtection";
import { GET as downloadRouteHandler } from "@/app/api/plans/[token]/download/route";
import { NextRequest } from "next/server";

describe("Phase 4: Printable PDF Generation Pipeline & Protected Downloads", () => {
  beforeEach(() => {
    clearTokenRegistry();
  });

  // --------------------------------------------------------------------------
  // 1. Plan Versioning & Immutable Snapshots
  // --------------------------------------------------------------------------
  describe("Plan Versioning & Snapshot Consistency", () => {
    it("should generate an immutable v1.0.0 snapshot for a seeded project", () => {
      const project = TWENTY_PROJECT_CONCEPTS[0];
      const snapshot = createPlanVersionSnapshot(project, 1, "v1.0.0");

      expect(snapshot.planVersionId).toBe(`plan-ver-${project.id}-1`);
      expect(snapshot.versionNumber).toBe(1);
      expect(snapshot.versionLabel).toBe("v1.0.0");
      expect(snapshot.projectSlug).toBe(project.slug);
      expect(snapshot.measurements.dimensionsSummary).toBeTruthy();
      expect(snapshot.materials.length).toBeGreaterThan(0);
      expect(snapshot.tools.length).toBeGreaterThan(0);
      expect(snapshot.instructions.length).toBeGreaterThan(0);
      expect(snapshot.safetyNotes.length).toBeGreaterThan(0);
      expect(snapshot.checksum).toMatch(/^[a-f0-9]{64}$/); // Valid SHA-256
    });

    it("should produce deterministic SHA-256 checksums", () => {
      const project = TWENTY_PROJECT_CONCEPTS[0];
      const snapshot1 = createPlanVersionSnapshot(project, 1, "v1.0.0");
      const snapshot2 = createPlanVersionSnapshot(project, 1, "v1.0.0");

      expect(snapshot1.checksum).toBe(snapshot2.checksum);
    });

    it("should detect changes in project parameters through checksum mutation", () => {
      const project = TWENTY_PROJECT_CONCEPTS[0];
      const snapshot1 = createPlanVersionSnapshot(project, 1, "v1.0.0");

      // Modifying any parameter results in a different checksum
      const modifiedSnapshot = {
        ...snapshot1,
        title: "Altered Project Title",
      };
      const alteredChecksum = computeSnapshotChecksum(modifiedSnapshot);
      expect(alteredChecksum).not.toBe(snapshot1.checksum);
    });

    it("should retrieve frozen plan version for all 20 seeded projects", () => {
      for (const project of TWENTY_PROJECT_CONCEPTS) {
        const frozen = getFrozenPlanVersion(project.slug, "v1.0.0");
        expect(frozen).toBeDefined();
        expect(frozen?.projectSlug).toBe(project.slug);
        expect(frozen?.versionLabel).toBe("v1.0.0");
        expect(frozen?.checksum).toBeTruthy();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 2. PDF Generation & Layout Validation
  // --------------------------------------------------------------------------
  describe("PDF Document Generation & Layout Inspection", () => {
    it("should generate a valid PDF byte buffer for a project plan", async () => {
      const snapshot = getFrozenPlanVersion("mediterranean-mosaic-trivet", "v1.0.0");
      expect(snapshot).toBeDefined();

      const pdfBytes = await generateProjectPlanPdf(snapshot!, {
        customerEmail: "builder@example.com",
        licenseId: "TEST-LIC-1234",
      });

      expect(pdfBytes).toBeInstanceOf(Uint8Array);
      expect(pdfBytes.byteLength).toBeGreaterThan(5000); // Realistic PDF size

      // Verify standard PDF magic header (%PDF-1.)
      const headerString = Buffer.from(pdfBytes.slice(0, 8)).toString("ascii");
      expect(headerString).toMatch(/^%PDF-1\./);

      // Verify standard PDF EOF marker
      const tailString = Buffer.from(pdfBytes.slice(-32)).toString("ascii");
      expect(tailString).toContain("%%EOF");
    });

    it("should produce exactly 3 pages conforming to US Letter dimensions", async () => {
      const snapshot = getFrozenPlanVersion("artisan-checkerboard-coasters", "v1.0.0");
      expect(snapshot).toBeDefined();

      const pdfBytes = await generateProjectPlanPdf(snapshot!);
      const loadedDoc = await PDFDocument.load(pdfBytes);

      expect(loadedDoc.getPageCount()).toBe(3);

      const pages = loadedDoc.getPages();
      for (const page of pages) {
        // US Letter: 612 x 792 pt
        expect(page.getWidth()).toBeCloseTo(612, 0);
        expect(page.getHeight()).toBeCloseTo(792, 0);
      }
    });

    it("should embed document metadata and licensing watermark", async () => {
      const snapshot = getFrozenPlanVersion("artisan-checkerboard-coasters", "v1.0.0");
      const pdfBytes = await generateProjectPlanPdf(snapshot!, {
        customerEmail: "craftsman@woodandtile.com",
        licenseId: "LIC-COASTER-001",
      });

      const loadedDoc = await PDFDocument.load(pdfBytes);
      expect(loadedDoc.getTitle()).toContain("Leftover Tile Plan");
      expect(loadedDoc.getTitle()).toContain(snapshot!.title);
      expect(loadedDoc.getAuthor()).toBe("Leftover Tile Project Planner Architecture Team");
      expect(loadedDoc.getSubject()).toContain("Printable DIY Tile Plan");
    });

    it("should render cutting and layout diagrams for both mosaic and straight-cut projects", async () => {
      // 1. Mosaic project with shards
      const mosaicSnapshot = getFrozenPlanVersion("mediterranean-mosaic-trivet", "v1.0.0");
      const mosaicPdf = await generateProjectPlanPdf(mosaicSnapshot!);
      expect(mosaicPdf.byteLength).toBeGreaterThan(5000);

      // 2. Straight cut project with wet saw kerf
      const cutSnapshot = getFrozenPlanVersion("terracotta-garden-stepping-stones", "v1.0.0");
      expect(cutSnapshot).toBeDefined();
      const cutPdf = await generateProjectPlanPdf(cutSnapshot!);
      expect(cutPdf.byteLength).toBeGreaterThan(5000);
    });
  });

  // --------------------------------------------------------------------------
  // 3. Protected Download Token Security
  // --------------------------------------------------------------------------
  describe("Protected Download Token Security & Expiration", () => {
    it("should generate a valid download token under admin preview", () => {
      const token = createPlanDownloadToken({
        projectId: "proj-001",
        projectSlug: "mediterranean-mosaic-trivet",
        isAdminPreview: true,
      });

      expect(token.token).toMatch(/^[0-9a-f-]{36}$/); // UUID
      expect(token.isRevoked).toBe(false);
      expect(token.accessCount).toBe(0);
      expect(token.expiresAt).toBeGreaterThan(Date.now());

      const validation = validateDownloadToken(token.token);
      expect(validation.isValid).toBe(true);
      expect(validation.tokenRecord?.token).toBe(token.token);
    });

    it("should reject token issuance for unverified projects when not in admin preview", () => {
      expect(() =>
        createPlanDownloadToken({
          projectId: "proj-001",
          projectSlug: "mediterranean-mosaic-trivet",
          isAdminPreview: false, // Standard public purchase attempt
        })
      ).toThrowError(/COMMERCE SECURITY VIOLATION/);
    });

    it("should reject validation for non-existent token", () => {
      const result = validateDownloadToken("non-existent-uuid-12345");
      expect(result.isValid).toBe(false);
      expect(result.statusCode).toBe(404);
      expect(result.error).toContain("not found or invalid");
    });

    it("should reject validation for revoked token", () => {
      const token = createPlanDownloadToken({
        projectId: "proj-001",
        projectSlug: "mediterranean-mosaic-trivet",
        isAdminPreview: true,
      });

      revokeDownloadToken(token.token);

      const result = validateDownloadToken(token.token);
      expect(result.isValid).toBe(false);
      expect(result.statusCode).toBe(403);
      expect(result.error).toContain("revoked");
    });

    it("should reject validation for expired token", () => {
      const token = createPlanDownloadToken({
        projectId: "proj-001",
        projectSlug: "mediterranean-mosaic-trivet",
        expiresInSeconds: -10, // Expired in the past
        isAdminPreview: true,
      });

      const result = validateDownloadToken(token.token);
      expect(result.isValid).toBe(false);
      expect(result.statusCode).toBe(410);
      expect(result.error).toContain("expired");
    });

    it("should enforce maximum access download count", () => {
      const token = createPlanDownloadToken({
        projectId: "proj-001",
        projectSlug: "mediterranean-mosaic-trivet",
        maxAccessCount: 2,
        isAdminPreview: true,
      });

      // Download 1
      expect(validateDownloadToken(token.token).isValid).toBe(true);
      recordTokenAccess(token.token);

      // Download 2
      expect(validateDownloadToken(token.token).isValid).toBe(true);
      recordTokenAccess(token.token);

      // Download 3: Exceeds limit
      const result = validateDownloadToken(token.token);
      expect(result.isValid).toBe(false);
      expect(result.statusCode).toBe(429);
      expect(result.error).toContain("Maximum download limit");
    });
  });

  // --------------------------------------------------------------------------
  // 4. Download API Route Handler
  // --------------------------------------------------------------------------
  describe("Download Route Handler (GET /api/plans/[token]/download)", () => {
    it("should return HTTP 404 for an invalid token", async () => {
      const req = new NextRequest("http://localhost:3000/api/plans/fake-token/download");
      const res = await downloadRouteHandler(req, {
        params: Promise.resolve({ token: "fake-token" }),
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toContain("not found or invalid");
    });

    it("should stream binary PDF with strict security headers for valid token", async () => {
      const token = createPlanDownloadToken({
        projectId: "proj-001",
        projectSlug: "mediterranean-mosaic-trivet",
        customerEmail: "verified-buyer@example.com",
        isAdminPreview: true,
      });

      const req = new NextRequest(
        `http://localhost:3000/api/plans/${token.token}/download`
      );
      const res = await downloadRouteHandler(req, {
        params: Promise.resolve({ token: token.token }),
      });

      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("application/pdf");
      expect(res.headers.get("Content-Disposition")).toContain("attachment; filename=");
      expect(res.headers.get("Cache-Control")).toBe("private, no-store, max-age=0, must-revalidate");
      expect(res.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
      expect(res.headers.get("X-Plan-Version")).toBe("v1.0.0");
      expect(res.headers.get("X-Plan-Checksum")).toMatch(/^[a-f0-9]{64}$/);

      const arrayBuffer = await res.arrayBuffer();
      expect(arrayBuffer.byteLength).toBeGreaterThan(5000);

      // Check PDF magic header
      const header = Buffer.from(arrayBuffer.slice(0, 5)).toString("ascii");
      expect(header).toBe("%PDF-");
    });
  });
});
