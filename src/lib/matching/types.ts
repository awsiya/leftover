import { TileUnit, TileCondition, TileMaterialType } from "@/lib/types/tile";

export type MatchTier = 1 | 2 | 3 | 0;

export type MatchFeasibility =
  | "EXACT_FIT"
  | "TRIMMING_REQUIRED"
  | "MOSAIC_COMPATIBLE"
  | "INSUFFICIENT_AREA"
  | "INSUFFICIENT_QUANTITY"
  | "INCOMPATIBLE_DIMENSIONS"
  | "INCOMPATIBLE_CONDITION"
  | "INCOMPATIBLE_MATERIAL";

export interface NormalizedTile {
  lengthMm: number;
  widthMm: number;
  thicknessMm: number;
  quantity: number;
  unit: TileUnit;
  grossAreaSqMm: number;
  netUsableAreaSqMm: number;
  condition: TileCondition;
  materialType: TileMaterialType;
  wasteMultiplier: number;
}

export interface ProjectRequirementsSpec {
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  category: string;
  minAreaSqMm: number;
  targetAreaSqMm: number;
  minTileCount: number;
  recommendedTileCount: number;
  minTileLengthMm: number;
  maxTileLengthMm?: number;
  minTileWidthMm: number;
  maxTileWidthMm?: number;
  minTileThicknessMm?: number;
  maxTileThicknessMm?: number;
  allowedConditions: TileCondition[];
  allowedMaterials: TileMaterialType[];
  requiresStraightCuts: boolean;
  requiresCurvedCuts: boolean;
  isOutdoorRated: boolean;
  isWetAreaRated: boolean;
  allowIrregularShards: boolean;
  nominalPieceLengthMm?: number;
  nominalPieceWidthMm?: number;
  groutJointWidthMm: number;
  wasteSafetyFactor: number;
}

export interface MatchResult {
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  category: string;
  isFeasible: boolean;
  tier: MatchTier;
  feasibility: MatchFeasibility;
  score: number;
  coverageRatio: number;
  userNetAreaSqMm: number;
  requiredAreaSqMm: number;
  estimatedWastePercentage: number;
  estimatedCutsCount: number;
  explanation: string;
  passingChecks: string[];
  failingChecks: string[];
  warnings: string[];
}
