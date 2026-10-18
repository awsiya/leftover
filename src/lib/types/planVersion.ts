import { ProjectDifficulty } from "@/lib/types/project";
import { TileCondition, TileMaterialType } from "@/lib/types/tile";

export interface PlanMeasurementSpecs {
  minAreaSqMm: number;
  targetAreaSqMm: number;
  minTileCount: number;
  recommendedTileCount: number;
  minTileLengthMm: number;
  maxTileLengthMm?: number;
  minTileWidthMm: number;
  maxTileWidthMm?: number;
  minTileThicknessMm: number;
  maxTileThicknessMm: number;
  groutJointWidthMm: number;
  wasteSafetyFactor: number;
  dimensionsSummary: string;
}

export interface PlanCuttingGuidance {
  requiresStraightCuts: boolean;
  requiresCurvedCuts: boolean;
  allowIrregularShards: boolean;
  kerfAllowanceMm: number;
  primaryCutMethod: "wet_tile_saw" | "score_and_snap" | "tile_nippers" | "no_cuts_required";
  cuttingGuidelines: string[];
}

export interface PlanMaterialItem {
  name: string;
  amount: string;
}

export interface PlanToolItem {
  name: string;
  isOptional?: boolean;
}

export interface PlanInstructionStep {
  stepNumber: number;
  title: string;
  instruction: string;
  diagramDescription?: string;
  safetyTip?: string;
}

export interface PlanDiagramSpec {
  diagramType: "cutting_layout" | "grid_layout" | "cross_section";
  title: string;
  description: string;
  callouts: string[];
}

/**
 * Immutable snapshot of a project plan version.
 * Ensures purchased plans remain consistent with the exact version sold,
 * even if future admin edits alter live project records.
 */
export interface PlanVersionSnapshot {
  planVersionId: string;
  projectId: string;
  projectSlug: string;
  versionNumber: number;
  versionLabel: string; // e.g. 'v1.0.0'
  checksum: string; // SHA-256 hash of the snapshot payload
  createdAt: string; // ISO timestamp
  title: string;
  subtitle: string;
  categoryLabel: string;
  difficulty: ProjectDifficulty;
  estimatedTimeMinutes: number;
  allowedMaterials: TileMaterialType[];
  allowedConditions: TileCondition[];
  measurements: PlanMeasurementSpecs;
  cuttingGuidance: PlanCuttingGuidance;
  materials: PlanMaterialItem[];
  tools: PlanToolItem[];
  instructions: PlanInstructionStep[];
  safetyNotes: string[];
  diagrams: PlanDiagramSpec[];
}

/**
 * Protected access token for secure, time-limited PDF plan downloads.
 */
export interface DownloadToken {
  token: string;
  projectId: string;
  projectSlug: string;
  planVersion: string;
  customerEmail: string;
  expiresAt: number; // Unix timestamp in milliseconds
  maxAccessCount: number;
  accessCount: number;
  isRevoked: boolean;
  createdAt: number;
  lastAccessedAt: number | null;
  isAdminPreview?: boolean;
}

export interface DownloadTokenValidationResult {
  isValid: boolean;
  error?: string;
  statusCode?: number;
  tokenRecord?: DownloadToken;
}
