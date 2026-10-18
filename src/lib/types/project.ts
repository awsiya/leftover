import { TileCondition, TileMaterialType } from "./tile";

export type ProjectDifficulty = "beginner" | "intermediate" | "advanced";

export type ProjectCategorySlug =
  | "home-decor"
  | "garden-outdoor"
  | "furniture-upgrades"
  | "kitchen-dining"
  | "functional-crafts";

export interface ProjectTool {
  name: string;
  isOptional?: boolean;
}

export interface ProjectMaterial {
  name: string;
  amount: string;
}

export interface ProjectPlanSummary {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategorySlug;
  categoryLabel: string;
  difficulty: ProjectDifficulty;
  estimatedTime: string;
  minTilesRequired: number;
  tileCompatibility: "intact_only" | "cuts_required" | "broken_mosaic" | "any";
  supportedConditions: TileCondition[];
  allowedMaterials: TileMaterialType[];
  isOutdoorSafe: boolean;
  isWetAreaSafe: boolean;
  priceCents: number;
  dimensionsSummary: string;
  shortDescription: string;
  imageUrl: string;
  tools: ProjectTool[];
  materials: ProjectMaterial[];
  featured?: boolean;
}
