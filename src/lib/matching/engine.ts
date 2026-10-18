import { MatchResult, NormalizedTile, ProjectRequirementsSpec } from "./types";
import { validateTileInput, normalizeTileInventory } from "./validator";
import { evaluateProjectMatch } from "./rules";
import { PROJECT_REQUIREMENTS_CATALOG } from "./catalog";

export interface MatchingEngineOutput {
  normalizedTile: NormalizedTile;
  results: MatchResult[];
  feasibleCount: number;
  infeasibleCount: number;
  topRecommendation: MatchResult | null;
}

/**
 * Deterministic Tile Matching Engine.
 *
 * Takes untrusted user inventory input, validates dimensions and condition,
 * normalizes to standard metric units, applies kerf/mosaic waste allowances,
 * and deterministically ranks project plans with explainable rationale.
 */
export function matchTileInventory(
  rawInput: unknown,
  customCatalog?: ProjectRequirementsSpec[]
): MatchingEngineOutput {
  // 1. Validate Input
  const validation = validateTileInput(rawInput);
  if (!validation.success || !validation.data) {
    throw new Error(
      `Tile input validation failed:\n${(validation.errors || []).join("\n")}`
    );
  }

  // 2. Normalize Tile
  const normalizedTile = normalizeTileInventory(validation.data);

  // 3. Catalog Selection
  const catalog = customCatalog || PROJECT_REQUIREMENTS_CATALOG;

  // 4. Evaluate Every Project
  const results: MatchResult[] = catalog.map((projectReq) => {
    const evalDetails = evaluateProjectMatch(normalizedTile, projectReq);

    const estimatedWastePercentage = Math.round(
      (1 - normalizedTile.wasteMultiplier) * 100
    );

    return {
      projectId: projectReq.projectId,
      projectSlug: projectReq.projectSlug,
      projectTitle: projectReq.projectTitle,
      category: projectReq.category,
      isFeasible: evalDetails.isFeasible,
      tier: evalDetails.tier,
      feasibility: evalDetails.feasibility,
      score: evalDetails.score,
      coverageRatio: evalDetails.coverageRatio,
      userNetAreaSqMm: normalizedTile.netUsableAreaSqMm,
      requiredAreaSqMm: projectReq.minAreaSqMm,
      estimatedWastePercentage,
      estimatedCutsCount: evalDetails.estimatedCutsCount,
      explanation: evalDetails.explanation,
      passingChecks: evalDetails.passingChecks,
      failingChecks: evalDetails.failingChecks,
      warnings: evalDetails.warnings,
    };
  });

  // 5. Deterministic Ranking
  // Sort order:
  // 1. Feasible (true before false)
  // 2. Tier (1 > 2 > 3 > 0)
  // 3. Score (descending)
  // 4. Coverage ratio closest to ideal (1.15 to 1.30)
  // 5. Alphabetical by slug for stable determinism
  results.sort((a, b) => {
    if (a.isFeasible !== b.isFeasible) {
      return a.isFeasible ? -1 : 1;
    }
    if (a.tier !== b.tier) {
      // tier 1 > tier 2 > tier 3 > tier 0
      const tierRankA = a.tier === 0 ? 99 : a.tier;
      const tierRankB = b.tier === 0 ? 99 : b.tier;
      if (tierRankA !== tierRankB) {
        return tierRankA - tierRankB;
      }
    }
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Stable tie-breaker
    return a.projectSlug.localeCompare(b.projectSlug);
  });

  const feasibleCount = results.filter((r) => r.isFeasible).length;
  const infeasibleCount = results.length - feasibleCount;
  const topRecommendation = feasibleCount > 0 ? results[0] : null;

  return {
    normalizedTile,
    results,
    feasibleCount,
    infeasibleCount,
    topRecommendation,
  };
}
