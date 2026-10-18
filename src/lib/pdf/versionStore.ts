import crypto from "node:crypto";
import { SeededProject, TWENTY_PROJECT_CONCEPTS } from "@/lib/data/seededProjects";
import {
  PlanVersionSnapshot,
  PlanMeasurementSpecs,
  PlanCuttingGuidance,
  PlanDiagramSpec,
} from "@/lib/types/planVersion";

/**
 * Derives appropriate cutting guidance based on project requirements.
 */
function deriveCuttingGuidance(req: SeededProject["requirements"]): PlanCuttingGuidance {
  let primaryCutMethod: PlanCuttingGuidance["primaryCutMethod"] = "no_cuts_required";
  const guidelines: string[] = [];

  if (req.requiresStraightCuts && req.requiresCurvedCuts) {
    primaryCutMethod = "wet_tile_saw";
    guidelines.push(
      "Use a continuous-rim diamond blade wet saw for all straight cuts. Water flow suppresses crystalline silica dust."
    );
    guidelines.push(
      "Execute curved cuts using radial plunge relief cuts with a wet saw, finishing with tungsten-carbide nippers."
    );
  } else if (req.requiresStraightCuts) {
    primaryCutMethod = "score_and_snap";
    guidelines.push(
      "Standard straight cuts may be performed with a score-and-snap manual tile cutter for ceramic wall tiles."
    );
    guidelines.push(
      "For dense porcelain (water absorption < 0.5%), a diamond wet tile saw is mandatory to prevent jagged edge fracture."
    );
  } else if (req.allowIrregularShards) {
    primaryCutMethod = "tile_nippers";
    guidelines.push(
      "Score or tap tiles inside a heavy canvas wrap using a dead-blow mallet to produce controlled 15–35mm mosaic shards."
    );
    guidelines.push(
      "Refine perimeter fitting using compound-leverage tile nippers to shape geometric edges."
    );
  } else {
    guidelines.push(
      "Full intact tile modular layout. No cutting required when tiles match the specified nominal module dimensions."
    );
  }

  // Kerf loss and edge dressing
  const kerfMm = req.requiresStraightCuts ? 2.4 : 0;
  if (kerfMm > 0) {
    guidelines.push(
      `Factor a standard 2.4mm (3/32") diamond blade saw kerf deduction for every cut line.`
    );
  }
  guidelines.push(
    "Dress all cut edges with a 120-grit diamond electroplated hand sanding pad to eliminate razor-sharp burrs."
  );

  return {
    requiresStraightCuts: req.requiresStraightCuts,
    requiresCurvedCuts: req.requiresCurvedCuts,
    allowIrregularShards: req.allowIrregularShards,
    kerfAllowanceMm: kerfMm,
    primaryCutMethod,
    cuttingGuidelines: guidelines,
  };
}

/**
 * Derives architectural diagram specifications for the plan.
 */
function deriveDiagramSpecs(project: SeededProject): PlanDiagramSpec[] {
  const req = project.requirements;
  const diagrams: PlanDiagramSpec[] = [];

  // 1. Layout Diagram
  diagrams.push({
    diagramType: "cutting_layout",
    title: "Primary Layout & Cutting Geometry (Plan View)",
    description: `Schematic plan view indicating tile placement, ${req.groutJointWidthMm}mm perimeter grout clearance, and cut kerf line allowances.`,
    callouts: [
      `Overall Substrate Footprint: ${project.translations.en.dimensionsSummary}`,
      `Grout Joint Spacing: ${req.groutJointWidthMm}mm uniform joints`,
      req.requiresStraightCuts ? "Straight saw cut boundaries" : "Modular intact tile arrangement",
    ],
  });

  // 2. Cross-Section Diagram
  diagrams.push({
    diagramType: "cross_section",
    title: "Structural Cross-Section & Bonding Substrate",
    description: "Layered schematic illustrating substrate, mortar bed thickness, tile, and joint depth.",
    callouts: [
      "Substrate (Plywood / Cement Board / Ceramic Base)",
      "Adhesive Bed (3/16\" or 1/4\" notched trowel thinset)",
      `Tile Layer (${req.minTileThicknessMm}–${req.maxTileThicknessMm}mm thickness)`,
      `Cured Grout Joint (${req.groutJointWidthMm}mm sanded grout)`,
    ],
  });

  return diagrams;
}

/**
 * Computes deterministic SHA-256 checksum from the snapshot content.
 */
export function computeSnapshotChecksum(
  data: Omit<PlanVersionSnapshot, "checksum">
): string {
  const serialized = JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHash("sha256").update(serialized).digest("hex");
}

/**
 * Creates an immutable PlanVersionSnapshot from a project record.
 */
export function createPlanVersionSnapshot(
  project: SeededProject,
  versionNumber = 1,
  versionLabel = "v1.0.0"
): PlanVersionSnapshot {
  const req = project.requirements;

  const measurements: PlanMeasurementSpecs = {
    minAreaSqMm: req.minAreaSqMm,
    targetAreaSqMm: req.targetAreaSqMm,
    minTileCount: req.minTileCount,
    recommendedTileCount: req.recommendedTileCount,
    minTileLengthMm: req.minTileLengthMm,
    maxTileLengthMm: req.maxTileLengthMm,
    minTileWidthMm: req.minTileWidthMm,
    maxTileWidthMm: req.maxTileWidthMm,
    minTileThicknessMm: req.minTileThicknessMm,
    maxTileThicknessMm: req.maxTileThicknessMm,
    groutJointWidthMm: req.groutJointWidthMm,
    wasteSafetyFactor: req.wasteSafetyFactor,
    dimensionsSummary: project.translations.en.dimensionsSummary,
  };

  const cuttingGuidance = deriveCuttingGuidance(req);
  const diagrams = deriveDiagramSpecs(project);

  const baseSnapshot: Omit<PlanVersionSnapshot, "checksum"> = {
    planVersionId: `plan-ver-${project.id}-${versionNumber}`,
    projectId: project.id,
    projectSlug: project.slug,
    versionNumber,
    versionLabel,
    createdAt: "2026-10-18T00:00:00.000Z",
    title: project.translations.en.title.replace(" [CONCEPT]", ""),
    subtitle: project.translations.en.subtitle,
    categoryLabel: project.categoryLabel,
    difficulty: project.difficulty,
    estimatedTimeMinutes: project.estimatedTimeMinutes,
    allowedMaterials: [...req.allowedMaterials],
    allowedConditions: [...req.allowedConditions],
    measurements,
    cuttingGuidance,
    materials: project.materials.map((m) => ({ name: m.name, amount: m.amount })),
    tools: project.tools.map((t) => ({ name: t.name, isOptional: t.isOptional })),
    instructions: project.instructions.map((i) => ({
      stepNumber: i.stepNumber,
      title: i.title,
      instruction: i.instruction,
      diagramDescription: i.diagramDescription,
      safetyTip: i.safetyTip,
    })),
    safetyNotes: [...project.safetyNotes],
    diagrams,
  };

  const checksum = computeSnapshotChecksum(baseSnapshot);

  return {
    ...baseSnapshot,
    checksum,
  };
}

// Frozen version cache: maps `${projectSlug}:${versionLabel}` -> PlanVersionSnapshot
const frozenVersionRegistry = new Map<string, PlanVersionSnapshot>();

// Initialize registry with all 20 seeded projects at v1.0.0
for (const project of TWENTY_PROJECT_CONCEPTS) {
  const snapshot = createPlanVersionSnapshot(project, 1, "v1.0.0");
  const key = `${project.slug}:v1.0.0`;
  frozenVersionRegistry.set(key, snapshot);
}

/**
 * Retrieves a frozen plan version snapshot by project slug and version label.
 * Guarantees that downloaded plans match the exact version sold.
 */
export function getFrozenPlanVersion(
  projectSlug: string,
  versionLabel = "v1.0.0"
): PlanVersionSnapshot | null {
  const key = `${projectSlug}:${versionLabel}`;
  const found = frozenVersionRegistry.get(key);
  if (found) return found;

  // Fallback: look up in project concepts and generate
  const project = TWENTY_PROJECT_CONCEPTS.find((p) => p.slug === projectSlug);
  if (!project) return null;

  const created = createPlanVersionSnapshot(project, 1, versionLabel);
  frozenVersionRegistry.set(key, created);
  return created;
}

/**
 * Lists all registered frozen version snapshots for a project.
 */
export function getAllFrozenPlanVersions(projectSlug: string): PlanVersionSnapshot[] {
  const versions: PlanVersionSnapshot[] = [];
  for (const [key, snapshot] of frozenVersionRegistry.entries()) {
    if (key.startsWith(`${projectSlug}:`)) {
      versions.push(snapshot);
    }
  }
  return versions;
}
