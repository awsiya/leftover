import { describe, it, expect, vi } from "vitest";
import { TWENTY_PROJECT_CONCEPTS, SeededProject } from "@/lib/data/seededProjects";
import {
  validateProjectVerification,
  assertProjectCanBeSold,
  VerificationEvidenceInput,
} from "@/lib/types/verification";
import {
  getAdminProjects,
  getAdminProjectById,
  updateProjectVerification,
  saveAdminProject,
} from "@/lib/actions/adminProjects";

// Mock next/cache revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Phase 3: Admin, Seeds & Verification Commerce Guards", () => {
  // --------------------------------------------------------------------------
  // 1. Seeded Projects Catalog Integrity
  // --------------------------------------------------------------------------
  describe("Seeded Catalog Integrity", () => {
    it("should provide exactly 20 distinct project concepts", () => {
      expect(TWENTY_PROJECT_CONCEPTS).toHaveLength(20);
      const uniqueIds = new Set(TWENTY_PROJECT_CONCEPTS.map((p) => p.id));
      const uniqueSlugs = new Set(TWENTY_PROJECT_CONCEPTS.map((p) => p.slug));
      expect(uniqueIds.size).toBe(20);
      expect(uniqueSlugs.size).toBe(20);
    });

    it("should distribute 20 projects across all 5 valid categories", () => {
      const validCategories = [
        "kitchen-dining",
        "garden-outdoor",
        "home-decor",
        "furniture-upgrades",
        "functional-crafts",
      ];

      for (const project of TWENTY_PROJECT_CONCEPTS) {
        expect(validCategories).toContain(project.categorySlug);
      }

      for (const cat of validCategories) {
        const catProjects = TWENTY_PROJECT_CONCEPTS.filter((p) => p.categorySlug === cat);
        expect(catProjects.length).toBeGreaterThanOrEqual(2);
      }
    });

    it("CRITICAL RULE: Zero seeded projects should be marked 'verified' initially", () => {
      const verifiedProjects = TWENTY_PROJECT_CONCEPTS.filter(
        (p) => p.verificationStatus === "verified"
      );
      expect(verifiedProjects).toHaveLength(0);

      // Verify that all projects are either draft or reviewing with explanatory notes
      for (const project of TWENTY_PROJECT_CONCEPTS) {
        expect(["draft", "reviewing"]).toContain(project.verificationStatus);
        expect(project.verificationNotes).toBeDefined();
        expect(project.verificationNotes.length).toBeGreaterThanOrEqual(10);
      }
    });

    it("should enforce fixed price of 499 cents ($4.99 USD) on all 20 projects", () => {
      for (const project of TWENTY_PROJECT_CONCEPTS) {
        expect(project.priceCents).toBe(499);
      }
    });

    it("should include complete 4-language localization on all projects", () => {
      for (const project of TWENTY_PROJECT_CONCEPTS) {
        expect(project.translations.en.title).toBeTruthy();
        expect(project.translations.de.title).toBeTruthy();
        expect(project.translations.fr.title).toBeTruthy();
        expect(project.translations.es.title).toBeTruthy();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 2. Physical Verification Validation Schema & Rules
  // --------------------------------------------------------------------------
  describe("validateProjectVerification", () => {
    it("should allow transitioning to draft or reviewing without physical evidence", () => {
      const resDraft = validateProjectVerification("draft", null);
      expect(resDraft.allowed).toBe(true);
      expect(resDraft.errors).toHaveLength(0);

      const resReview = validateProjectVerification("reviewing", undefined);
      expect(resReview.allowed).toBe(true);
      expect(resReview.errors).toHaveLength(0);
    });

    it("should reject transitioning to 'verified' if no evidence payload is provided", () => {
      const result = validateProjectVerification("verified", null);
      expect(result.allowed).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("cannot be marked as 'verified' without documented physical");
    });

    it("should reject 'verified' if any of the 4 mandatory physical inspection checks are false", () => {
      const incompleteEvidence: VerificationEvidenceInput = {
        verifiedAt: new Date().toISOString(),
        verifiedBy: "Senior TCNA Inspector",
        testBuildDate: "2026-10-18",
        prototypeDimensionsVerified: true,
        cutSafetyVerified: false, // Edge safety NOT verified!
        structuralStabilityVerified: true,
        materialAdhesionVerified: true,
        verificationNotes: "Built prototype in workshop. Dimensions and mortar cure are fine.",
      };

      const result = validateProjectVerification("verified", incompleteEvidence);
      expect(result.allowed).toBe(false);
      expect(result.errors.some((e) => e.includes("cutSafetyVerified"))).toBe(true);
    });

    it("should reject 'verified' if verification notes are shorter than 20 characters", () => {
      const shortNotesEvidence: VerificationEvidenceInput = {
        verifiedAt: new Date().toISOString(),
        verifiedBy: "Inspector",
        testBuildDate: "2026-10-18",
        prototypeDimensionsVerified: true,
        cutSafetyVerified: true,
        structuralStabilityVerified: true,
        materialAdhesionVerified: true,
        verificationNotes: "Too short", // < 20 chars
      };

      const result = validateProjectVerification("verified", shortNotesEvidence);
      expect(result.allowed).toBe(false);
      expect(result.errors.some((e) => e.includes("at least 20 characters"))).toBe(true);
    });

    it("should accept 'verified' when all 4 checks, verifier name, date, and detailed notes are present", () => {
      const completeEvidence: VerificationEvidenceInput = {
        verifiedAt: new Date().toISOString(),
        verifiedBy: "Elena Rostova (Master Tile Craftsman)",
        testBuildDate: "2026-10-17",
        prototypeDimensionsVerified: true,
        cutSafetyVerified: true,
        structuralStabilityVerified: true,
        materialAdhesionVerified: true,
        verificationNotes:
          "Full 1:1 prototype constructed. Tile saw kerf verified at 2.4mm. Substrate loaded to 25kg without deflection. Thinset fully bonded after 24hr cure.",
        evidencePhotoUrl: "https://example.com/evidence-photos/proj-001.jpg",
      };

      const result = validateProjectVerification("verified", completeEvidence);
      expect(result.allowed).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  // --------------------------------------------------------------------------
  // 3. Commerce Safety Guard (assertProjectCanBeSold)
  // --------------------------------------------------------------------------
  describe("Commerce Safety Guard (assertProjectCanBeSold)", () => {
    it("CRITICAL RULE: Should throw security exception when attempting to sell an unverified project", () => {
      const draftProject = {
        id: "proj-001",
        slug: "mediterranean-mosaic-trivet",
        title: "Mediterranean Mosaic Trivet",
        verification_status: "draft" as const,
      };

      expect(() => assertProjectCanBeSold(draftProject)).toThrowError(
        /COMMERCE SECURITY VIOLATION/
      );

      const reviewingProject = {
        id: "proj-002",
        slug: "moroccan-terracotta-plant-pot",
        title: "Moroccan Terracotta Plant Pot",
        verification_status: "reviewing" as const,
      };

      expect(() => assertProjectCanBeSold(reviewingProject)).toThrowError(
        /COMMERCE SECURITY VIOLATION/
      );
    });

    it("should permit sale only when verification_status is explicitly 'verified'", () => {
      const verifiedProject = {
        id: "proj-003",
        slug: "artisan-checkerboard-coasters",
        title: "Artisan Checkerboard Coasters",
        verification_status: "verified" as const,
      };

      expect(() => assertProjectCanBeSold(verifiedProject)).not.toThrow();
    });
  });

  // --------------------------------------------------------------------------
  // 4. Admin Server Actions & Mutation Safeguards
  // --------------------------------------------------------------------------
  describe("Admin Server Actions", () => {
    it("should filter projects by status and category", async () => {
      const all = await getAdminProjects();
      expect(all.length).toBe(20);

      const kitchenOnly = await getAdminProjects({ category: "kitchen-dining" });
      expect(kitchenOnly.length).toBe(4);
      expect(kitchenOnly.every((p) => p.categorySlug === "kitchen-dining")).toBe(true);

      const searchMatch = await getAdminProjects({ search: "trivet" });
      expect(searchMatch.length).toBeGreaterThan(0);
    });

    it("should retrieve a project by id or slug", async () => {
      const byId = await getAdminProjectById("proj-001");
      expect(byId).toBeDefined();
      expect(byId?.id).toBe("proj-001");

      const bySlug = await getAdminProjectById("artisan-checkerboard-coasters");
      expect(bySlug).toBeDefined();
      expect(bySlug?.id).toBe("proj-004");
    });

    it("should enforce physical checklist when calling updateProjectVerification", async () => {
      // Attempting to set to verified without evidence
      const failure = await updateProjectVerification("proj-001", "verified", null);
      expect(failure.success).toBe(false);
      expect(failure.errors).toBeDefined();
      expect(failure.errors?.[0]).toContain("without documented physical test build evidence");

      // Now supply valid physical build evidence
      const success = await updateProjectVerification("proj-001", "verified", {
        verifiedAt: new Date().toISOString(),
        verifiedBy: "Lead Workshop Inspector",
        testBuildDate: "2026-10-18",
        prototypeDimensionsVerified: true,
        cutSafetyVerified: true,
        structuralStabilityVerified: true,
        materialAdhesionVerified: true,
        verificationNotes: "Workshop test completed. Dimensions and bonding strength confirmed under test load.",
      });

      expect(success.success).toBe(true);
      expect(success.project?.verificationStatus).toBe("verified");
      expect(success.project?.verifiedBy).toBe("Lead Workshop Inspector");
    });

    it("should reject saveAdminProject if price is modified away from 499 cents", async () => {
      const projectToTamper: SeededProject = {
        ...TWENTY_PROJECT_CONCEPTS[0],
        priceCents: 999, // Tampered price
      };

      const result = await saveAdminProject(projectToTamper);
      expect(result.success).toBe(false);
      expect(result.errors?.[0]).toContain("Price must be fixed at 499 cents");
    });

    it("should block unauthenticated or unauthorized callers from admin operations", async () => {
      process.env.MOCK_UNAUTHENTICATED = "true";
      try {
        await expect(getAdminProjects()).rejects.toThrow(/Unauthenticated/);
      } finally {
        delete process.env.MOCK_UNAUTHENTICATED;
      }
    });
  });
});
