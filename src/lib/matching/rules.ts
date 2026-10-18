import { NormalizedTile, ProjectRequirementsSpec, MatchFeasibility, MatchTier } from "./types";

export interface EvaluationDetails {
  isFeasible: boolean;
  tier: MatchTier;
  feasibility: MatchFeasibility;
  score: number;
  coverageRatio: number;
  estimatedCutsCount: number;
  explanation: string;
  passingChecks: string[];
  failingChecks: string[];
  warnings: string[];
}

/**
 * Checks whether user tile inventory satisfies all geometric and material requirements of a project.
 */
export function evaluateProjectMatch(
  tile: NormalizedTile,
  req: ProjectRequirementsSpec
): EvaluationDetails {
  const passingChecks: string[] = [];
  const failingChecks: string[] = [];
  const warnings: string[] = [];

  // Check if tile is an EXACT uncut match to the nominal project piece
  let isExactMatch = false;
  if (
    tile.condition === "intact" &&
    req.nominalPieceLengthMm &&
    req.nominalPieceWidthMm &&
    !req.requiresStraightCuts &&
    !req.requiresCurvedCuts
  ) {
    const diffLen = Math.abs(tile.lengthMm - req.nominalPieceLengthMm);
    const diffWid = Math.abs(tile.widthMm - req.nominalPieceWidthMm);
    const diffRotatedLen = Math.abs(tile.lengthMm - req.nominalPieceWidthMm);
    const diffRotatedWid = Math.abs(tile.widthMm - req.nominalPieceLengthMm);

    isExactMatch =
      (diffLen <= 3.5 && diffWid <= 3.5) ||
      (diffRotatedLen <= 3.5 && diffRotatedWid <= 3.5);
  }

  // If exact uncut fit, 100% of gross tile area is utilized (no kerf loss from saw cuts)
  const effectiveUsableArea = isExactMatch ? tile.grossAreaSqMm : tile.netUsableAreaSqMm;
  const coverageRatio = Math.round((effectiveUsableArea / req.minAreaSqMm) * 100) / 100;

  // 1. Check Condition Compatibility
  const isConditionAllowed =
    req.allowedConditions.includes(tile.condition) ||
    (tile.condition === "broken_mosaic" && req.allowIrregularShards);

  if (!isConditionAllowed) {
    failingChecks.push(
      `Project requires ${req.allowedConditions.join(" or ")} tiles, but your inventory is flagged as '${tile.condition}'.`
    );
    return {
      isFeasible: false,
      tier: 0,
      feasibility: "INCOMPATIBLE_CONDITION",
      score: 0,
      coverageRatio,
      estimatedCutsCount: 0,
      explanation: `Incompatible tile condition: This project requires intact tiles for structural stability and cannot be constructed with broken shards.`,
      passingChecks,
      failingChecks,
      warnings,
    };
  }
  passingChecks.push(`Condition '${tile.condition}' is supported.`);

  // 2. Outdoor Freeze-Thaw Check (prioritized for clear failure explanation)
  if (req.isOutdoorRated && tile.materialType === "ceramic") {
    failingChecks.push(
      `Outdoor projects require impervious porcelain or quarry stone. Standard ceramic tiles crack during freeze-thaw cycles.`
    );
    return {
      isFeasible: false,
      tier: 0,
      feasibility: "INCOMPATIBLE_MATERIAL",
      score: 0,
      coverageRatio,
      estimatedCutsCount: 0,
      explanation: `Outdoor frost risk: Standard glazed ceramic has a high water absorption rate (>7%) and will shatter in winter temperatures. Outdoor plans require porcelain.`,
      passingChecks,
      failingChecks,
      warnings,
    };
  }

  // 3. General Material Compatibility
  const isMaterialAllowed = req.allowedMaterials.includes(tile.materialType);
  if (!isMaterialAllowed) {
    failingChecks.push(
      `Material '${tile.materialType}' is not supported. Allowed materials: ${req.allowedMaterials.join(", ")}.`
    );
    return {
      isFeasible: false,
      tier: 0,
      feasibility: "INCOMPATIBLE_MATERIAL",
      score: 0,
      coverageRatio,
      estimatedCutsCount: 0,
      explanation: `Incompatible material: ${tile.materialType} tiles cannot be used for this project due to structural or chemical requirements.`,
      passingChecks,
      failingChecks,
      warnings,
    };
  }
  passingChecks.push(`Material '${tile.materialType}' is compatible.`);

  // 4. Dimensional Constraints Check
  // If project requires a minimum intact tile dimension (e.g. coasters requiring min 100mm x 100mm intact tiles)
  if (tile.condition === "intact") {
    const tileMinDim = Math.min(tile.lengthMm, tile.widthMm);
    const tileMaxDim = Math.max(tile.lengthMm, tile.widthMm);

    if (req.minTileLengthMm > 0 && tileMaxDim < req.minTileLengthMm) {
      failingChecks.push(
        `Tile dimension (${tileMaxDim}mm) is smaller than required minimum length (${req.minTileLengthMm}mm).`
      );
      return {
        isFeasible: false,
        tier: 0,
        feasibility: "INCOMPATIBLE_DIMENSIONS",
        score: 30,
        coverageRatio,
        estimatedCutsCount: 0,
        explanation: `Incompatible dimensions: Your tiles (${tile.lengthMm}×${tile.widthMm}mm) are smaller than the required piece size (${req.minTileLengthMm}mm). Intact pieces cannot be fabricated from smaller tiles.`,
        passingChecks,
        failingChecks,
        warnings,
      };
    }

    if (req.minTileWidthMm > 0 && tileMinDim < req.minTileWidthMm) {
      failingChecks.push(
        `Tile dimension (${tileMinDim}mm) is smaller than required minimum width (${req.minTileWidthMm}mm).`
      );
      return {
        isFeasible: false,
        tier: 0,
        feasibility: "INCOMPATIBLE_DIMENSIONS",
        score: 30,
        coverageRatio,
        estimatedCutsCount: 0,
        explanation: `Incompatible dimensions: Your tile width (${tileMinDim}mm) is too narrow for this project's intact piece requirement (${req.minTileWidthMm}mm).`,
        passingChecks,
        failingChecks,
        warnings,
      };
    }
  }

  // 5. Area Sufficiency Check
  if (effectiveUsableArea < req.minAreaSqMm) {
    const missingSqMm = req.minAreaSqMm - effectiveUsableArea;
    const missingSqFt = (missingSqMm / 92903.04).toFixed(2);
    failingChecks.push(
      `Insufficient surface area. Available net area: ${(effectiveUsableArea / 92903.04).toFixed(2)} sq ft; project requires at least ${(req.minAreaSqMm / 92903.04).toFixed(2)} sq ft (short by ${missingSqFt} sq ft).`
    );
    return {
      isFeasible: false,
      tier: 0,
      feasibility: "INSUFFICIENT_AREA",
      score: Math.min(45, Math.round(coverageRatio * 45)),
      coverageRatio,
      estimatedCutsCount: 0,
      explanation: `Insufficient area: You need approximately ${missingSqFt} sq ft more tile coverage to complete this project with safety waste deductions.`,
      passingChecks,
      failingChecks,
      warnings,
    };
  }
  passingChecks.push(
    `Net usable area ${(effectiveUsableArea / 92903.04).toFixed(2)} sq ft meets required ${(req.minAreaSqMm / 92903.04).toFixed(2)} sq ft (${Math.round(coverageRatio * 100)}% coverage).`
  );

  // 6. Tile Count Sufficiency Check (for intact requirements)
  if (tile.condition === "intact" && tile.quantity < req.minTileCount) {
    // If tiles are much larger than needed pieces, fewer tiles may still yield required pieces through cutting
    const singleTileArea = tile.grossAreaSqMm / tile.quantity;
    const nominalPieceArea =
      req.nominalPieceLengthMm && req.nominalPieceWidthMm
        ? req.nominalPieceLengthMm * req.nominalPieceWidthMm
        : req.minAreaSqMm / req.minTileCount;

    const yieldPerTile = Math.floor(singleTileArea / nominalPieceArea);
    const totalYield = yieldPerTile * tile.quantity;

    if (totalYield < req.minTileCount) {
      failingChecks.push(
        `Insufficient tile count. You have ${tile.quantity} tiles; project requires at least ${req.minTileCount} pieces.`
      );
      return {
        isFeasible: false,
        tier: 0,
        feasibility: "INSUFFICIENT_QUANTITY",
        score: Math.round((tile.quantity / req.minTileCount) * 50),
        coverageRatio,
        estimatedCutsCount: 0,
        explanation: `Insufficient piece count: You have ${tile.quantity} tiles, but this project requires at least ${req.minTileCount} pieces.`,
        passingChecks,
        failingChecks,
        warnings,
      };
    }
  }
  passingChecks.push(`Piece count is sufficient.`);

  // 7. Feasibility Tier & Cutting Assessment
  let tier: MatchTier = 2;
  let feasibility: MatchFeasibility = "TRIMMING_REQUIRED";
  let estimatedCuts = 0;
  let score = 75;

  if (isExactMatch) {
    tier = 1;
    feasibility = "EXACT_FIT";
    score = 98;
    estimatedCuts = 0;
  } else if (tile.condition === "broken_mosaic" || req.allowIrregularShards) {
    tier = 3;
    feasibility = "MOSAIC_COMPATIBLE";
    score = 80;
    estimatedCuts = Math.max(10, Math.round(tile.quantity * 2));
  } else {
    tier = 2;
    feasibility = "TRIMMING_REQUIRED";
    score = 85;
    estimatedCuts = Math.max(2, Math.round(req.minTileCount * 1.5));
  }

  // Bonus points for ideal coverage ratio (between 1.05 and 1.40 is optimal for DIY margin)
  if (coverageRatio >= 1.05 && coverageRatio <= 1.40) {
    score = Math.min(100, score + 5);
    passingChecks.push("Optimal 5–40% material buffer available for trial cuts.");
  } else if (coverageRatio > 2.0) {
    warnings.push("You have more than double the required tile area; surplus tile will remain.");
  }

  // Safety warnings
  if (req.isOutdoorRated) {
    warnings.push("Ensure outdoor thinset meets ANSI A118.15 for freeze-thaw stability.");
  }
  if (req.requiresStraightCuts) {
    warnings.push("Straight saw or snap cuts required. Wear safety goggles and N95 respirator.");
  }

  let explanation = "";
  if (tier === 1) {
    explanation = `Tier 1: Exact Fit. Your ${tile.lengthMm}×${tile.widthMm}mm tiles match the project module with zero cutting required.`;
  } else if (tier === 2) {
    explanation = `Tier 2: Modular Trimming Required. Straight score-and-snap cuts required (~${estimatedCuts} cuts). Usable coverage is ${Math.round(coverageRatio * 100)}% of project need.`;
  } else {
    explanation = `Tier 3: Mosaic / Shard Candidate. Ideal for your fractured or mixed tile batch. 25% mosaic fracture waste allowance applied.`;
  }

  return {
    isFeasible: true,
    tier,
    feasibility,
    score,
    coverageRatio,
    estimatedCutsCount: estimatedCuts,
    explanation,
    passingChecks,
    failingChecks,
    warnings,
  };
}
