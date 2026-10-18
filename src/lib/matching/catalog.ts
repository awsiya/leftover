import { ProjectRequirementsSpec } from "./types";
import { TWENTY_PROJECT_CONCEPTS } from "@/lib/data/seededProjects";

export const PROJECT_REQUIREMENTS_CATALOG: ProjectRequirementsSpec[] = TWENTY_PROJECT_CONCEPTS.map(
  (p) => ({
    projectId: p.id,
    projectSlug: p.slug,
    projectTitle: p.translations.en.title.replace(" [CONCEPT]", ""),
    category: p.categoryLabel,
    minAreaSqMm: p.requirements.minAreaSqMm,
    targetAreaSqMm: p.requirements.targetAreaSqMm,
    minTileCount: p.requirements.minTileCount,
    recommendedTileCount: p.requirements.recommendedTileCount,
    minTileLengthMm: p.requirements.minTileLengthMm,
    maxTileLengthMm: p.requirements.maxTileLengthMm,
    minTileWidthMm: p.requirements.minTileWidthMm,
    maxTileWidthMm: p.requirements.maxTileWidthMm,
    minTileThicknessMm: p.requirements.minTileThicknessMm,
    maxTileThicknessMm: p.requirements.maxTileThicknessMm,
    allowedConditions: p.requirements.allowedConditions,
    allowedMaterials: p.requirements.allowedMaterials,
    requiresStraightCuts: p.requirements.requiresStraightCuts,
    requiresCurvedCuts: p.requirements.requiresCurvedCuts,
    isOutdoorRated: p.requirements.isOutdoorRated,
    isWetAreaRated: p.requirements.isWetAreaRated,
    allowIrregularShards: p.requirements.allowIrregularShards,
    nominalPieceLengthMm: p.requirements.nominalPieceLengthMm,
    nominalPieceWidthMm: p.requirements.nominalPieceWidthMm,
    groutJointWidthMm: p.requirements.groutJointWidthMm,
    wasteSafetyFactor: p.requirements.wasteSafetyFactor,
  })
);
