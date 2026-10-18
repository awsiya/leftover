import { describe, it, expect } from "vitest";
import { matchTileInventory } from "../engine";
import { toMillimeters, fromMillimeters } from "../converter";
import { validateTileInput, normalizeTileInventory } from "../validator";
import { TileInventoryInput } from "@/lib/types/tile";

describe("Deterministic Tile Matching Engine", () => {
  // --------------------------------------------------------------------------
  // 1. Exact Matches
  // --------------------------------------------------------------------------
  describe("Exact Matches", () => {
    it("should match 4x4 inch intact tiles to Artisan Coasters as Tier 1 Exact Fit", () => {
      const input: TileInventoryInput = {
        length: 4,
        width: 4,
        unit: "inches",
        quantity: 4,
        condition: "intact",
        materialType: "ceramic",
      };

      const result = matchTileInventory(input);

      expect(result.feasibleCount).toBeGreaterThan(0);
      const coasterMatch = result.results.find(
        (r) => r.projectSlug === "artisan-checkerboard-coasters"
      );

      expect(coasterMatch).toBeDefined();
      expect(coasterMatch?.isFeasible).toBe(true);
      expect(coasterMatch?.tier).toBe(1);
      expect(coasterMatch?.feasibility).toBe("EXACT_FIT");
      expect(coasterMatch?.estimatedCutsCount).toBe(0);
      expect(coasterMatch?.score).toBeGreaterThanOrEqual(95);
      expect(coasterMatch?.explanation).toContain("Tier 1: Exact Fit");
    });
  });

  // --------------------------------------------------------------------------
  // 2. Insufficient Quantities & Area
  // --------------------------------------------------------------------------
  describe("Insufficient Quantities & Area", () => {
    it("should reject projects when available quantity is below minimum piece requirement", () => {
      const input: TileInventoryInput = {
        length: 4,
        width: 4,
        unit: "inches",
        quantity: 1, // Only 1 tile, but coaster requires 4
        condition: "intact",
        materialType: "ceramic",
      };

      const result = matchTileInventory(input);
      const coasterMatch = result.results.find(
        (r) => r.projectSlug === "artisan-checkerboard-coasters"
      );

      expect(coasterMatch).toBeDefined();
      expect(coasterMatch?.isFeasible).toBe(false);
      expect(["INSUFFICIENT_AREA", "INSUFFICIENT_QUANTITY"]).toContain(coasterMatch?.feasibility);
      expect(coasterMatch?.tier).toBe(0);
      expect(coasterMatch?.score).toBeLessThanOrEqual(50);
      expect(coasterMatch?.failingChecks.length).toBeGreaterThan(0);
    });

    it("should reject when surface area is insufficient despite multiple small tiles", () => {
      const input: TileInventoryInput = {
        length: 1,
        width: 1,
        unit: "inches",
        quantity: 10, // 10 sq inches gross area, net ~9 sq in = ~5800 mm2
        condition: "intact",
        materialType: "ceramic",
      };

      const result = matchTileInventory(input);
      // All catalog projects require at least 41,000 sq mm
      expect(result.feasibleCount).toBe(0);
      expect(result.results.every((r) => !r.isFeasible)).toBe(true);
      expect(result.infeasibleCount).toBe(result.results.length);
    });
  });

  // --------------------------------------------------------------------------
  // 3. Incompatible Dimensions
  // --------------------------------------------------------------------------
  describe("Incompatible Dimensions", () => {
    it("should reject intact projects when tile is smaller than minimum required piece dimension", () => {
      // 50 tiles of 2"x2" = 200 sq inches gross area (sufficient area for coasters),
      // but each tile is 50.8mm, which is smaller than the 100mm intact piece requirement
      const input: TileInventoryInput = {
        length: 2,
        width: 2,
        unit: "inches",
        quantity: 50,
        condition: "intact",
        materialType: "ceramic",
      };

      const result = matchTileInventory(input);
      const coasterMatch = result.results.find(
        (r) => r.projectSlug === "artisan-checkerboard-coasters"
      );

      expect(coasterMatch).toBeDefined();
      expect(coasterMatch?.isFeasible).toBe(false);
      expect(coasterMatch?.feasibility).toBe("INCOMPATIBLE_DIMENSIONS");
      expect(coasterMatch?.explanation).toContain("Incompatible dimensions");
    });
  });

  // --------------------------------------------------------------------------
  // 4. Mixed Units & Conversion Rigor
  // --------------------------------------------------------------------------
  describe("Mixed Units & Conversion Rigor", () => {
    it("should produce identical metric normalization across inches, cm, and mm", () => {
      const imperial = toMillimeters(4, "inches"); // 4 * 25.4 = 101.6 mm
      const metricCm = toMillimeters(10.16, "cm"); // 10.16 * 10 = 101.6 mm
      const metricMm = toMillimeters(101.6, "mm"); // 101.6 mm

      expect(imperial).toBe(101.6);
      expect(metricCm).toBe(101.6);
      expect(metricMm).toBe(101.6);
    });

    it("should correctly convert millimeters back to target units", () => {
      expect(fromMillimeters(25.4, "inches")).toBe(1);
      expect(fromMillimeters(100, "cm")).toBe(10);
      expect(fromMillimeters(50.5, "mm")).toBe(50.5);
    });

    it("should match 10.16 cm tiles identically to 4-inch tiles", () => {
      const metricInput: TileInventoryInput = {
        length: 10.16,
        width: 10.16,
        unit: "cm",
        quantity: 4,
        condition: "intact",
        materialType: "ceramic",
      };

      const result = matchTileInventory(metricInput);
      const coasterMatch = result.results.find(
        (r) => r.projectSlug === "artisan-checkerboard-coasters"
      );

      expect(coasterMatch?.isFeasible).toBe(true);
      expect(coasterMatch?.tier).toBe(1);
      expect(coasterMatch?.feasibility).toBe("EXACT_FIT");
    });
  });

  // --------------------------------------------------------------------------
  // 5. Broken Tiles & Mosaic Deductions
  // --------------------------------------------------------------------------
  describe("Broken Tiles & Mosaic Condition", () => {
    it("should apply 25% waste multiplier to broken tiles and match mosaic trivet", () => {
      const input: TileInventoryInput = {
        length: 6,
        width: 6,
        unit: "inches",
        quantity: 4,
        condition: "broken_mosaic",
        materialType: "ceramic",
      };

      const normalized = normalizeTileInventory(input);
      // Gross area: 4 * (152.4 * 152.4) = ~92,903 mm2 (1 sq ft)
      // Net usable: 92,903 * 0.75 = ~69,677 mm2
      expect(normalized.wasteMultiplier).toBe(0.75);
      expect(normalized.netUsableAreaSqMm).toBeLessThan(normalized.grossAreaSqMm);

      const result = matchTileInventory(input);
      const trivetMatch = result.results.find(
        (r) => r.projectSlug === "mediterranean-mosaic-trivet"
      );

      expect(trivetMatch?.isFeasible).toBe(true);
      expect(trivetMatch?.tier).toBe(3);
      expect(trivetMatch?.feasibility).toBe("MOSAIC_COMPATIBLE");
    });

    it("should reject broken tiles for projects that require intact units", () => {
      const input: TileInventoryInput = {
        length: 4,
        width: 4,
        unit: "inches",
        quantity: 20,
        condition: "broken_mosaic",
        materialType: "ceramic",
      };

      const result = matchTileInventory(input);
      const coasterMatch = result.results.find(
        (r) => r.projectSlug === "artisan-checkerboard-coasters"
      );

      expect(coasterMatch?.isFeasible).toBe(false);
      expect(coasterMatch?.feasibility).toBe("INCOMPATIBLE_CONDITION");
      expect(coasterMatch?.explanation).toContain("Incompatible tile condition");
    });
  });

  // --------------------------------------------------------------------------
  // 6. Zero, Negative & Invalid Inputs
  // --------------------------------------------------------------------------
  describe("Zero, Negative & Invalid Inputs", () => {
    it("should reject zero or negative lengths", () => {
      const zeroLength = {
        length: 0,
        width: 4,
        unit: "inches",
        quantity: 5,
        condition: "intact",
        materialType: "ceramic",
      };
      const validZero = validateTileInput(zeroLength);
      expect(validZero.success).toBe(false);
      expect(validZero.errors?.some((e) => e.includes("greater than zero"))).toBe(true);

      const negLength = { ...zeroLength, length: -3 };
      const validNeg = validateTileInput(negLength);
      expect(validNeg.success).toBe(false);
    });

    it("should reject zero or negative quantities", () => {
      const zeroQty = {
        length: 4,
        width: 4,
        unit: "inches",
        quantity: 0,
        condition: "intact",
        materialType: "ceramic",
      };
      const validQty = validateTileInput(zeroQty);
      expect(validQty.success).toBe(false);
      expect(validQty.errors?.some((e) => e.includes("at least 1"))).toBe(true);
    });

    it("should reject non-integer quantities", () => {
      const floatQty = {
        length: 4,
        width: 4,
        unit: "inches",
        quantity: 3.5,
        condition: "intact",
        materialType: "ceramic",
      };
      const valid = validateTileInput(floatQty);
      expect(valid.success).toBe(false);
      expect(valid.errors?.some((e) => e.includes("whole integer"))).toBe(true);
    });

    it("should reject unsupported units or conditions", () => {
      const invalidUnit = {
        length: 4,
        width: 4,
        unit: "yards",
        quantity: 5,
        condition: "intact",
        materialType: "ceramic",
      };
      expect(validateTileInput(invalidUnit).success).toBe(false);

      const invalidCondition = {
        ...invalidUnit,
        unit: "inches",
        condition: "powdered",
      };
      expect(validateTileInput(invalidCondition).success).toBe(false);
    });

    it("should throw a clear error when matchTileInventory is called with invalid input", () => {
      expect(() => matchTileInventory({ length: -1 })).toThrow(
        /Tile input validation failed/
      );
    });
  });

  // --------------------------------------------------------------------------
  // 7. Material & Environmental Safety
  // --------------------------------------------------------------------------
  describe("Material & Outdoor Freeze-Thaw Safety", () => {
    it("should reject standard ceramic tile for outdoor freeze-thaw projects", () => {
      const input: TileInventoryInput = {
        length: 12,
        width: 12,
        unit: "inches",
        quantity: 10,
        condition: "intact",
        materialType: "ceramic", // Standard ceramic wall/interior tile
      };

      const result = matchTileInventory(input);
      const outdoorStone = result.results.find(
        (r) => r.projectSlug === "terracotta-garden-stepping-stones"
      );

      expect(outdoorStone).toBeDefined();
      expect(outdoorStone?.isFeasible).toBe(false);
      expect(outdoorStone?.feasibility).toBe("INCOMPATIBLE_MATERIAL");
      expect(outdoorStone?.explanation).toContain("Outdoor frost risk");
    });

    it("should accept porcelain tile for outdoor projects", () => {
      const input: TileInventoryInput = {
        length: 12,
        width: 12,
        unit: "inches",
        quantity: 10,
        condition: "intact",
        materialType: "porcelain", // Impervious porcelain < 0.5% water absorption
      };

      const result = matchTileInventory(input);
      const outdoorStone = result.results.find(
        (r) => r.projectSlug === "terracotta-garden-stepping-stones"
      );

      expect(outdoorStone?.isFeasible).toBe(true);
      expect(outdoorStone?.passingChecks.some((c) => c.includes("porcelain"))).toBe(true);
    });
  });
});
