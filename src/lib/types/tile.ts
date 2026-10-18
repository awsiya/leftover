export type TileUnit = "inches" | "cm" | "mm";

export type TileCondition = "intact" | "mixed" | "broken_mosaic";

export type TileMaterialType =
  | "ceramic"
  | "porcelain"
  | "terracotta"
  | "marble_natural_stone"
  | "glass";

export interface TileInventoryInput {
  length: number;
  width: number;
  thicknessMm?: number;
  unit: TileUnit;
  quantity: number;
  condition: TileCondition;
  materialType: TileMaterialType;
  colorFamily?: string;
}

export interface NormalizedTileSpecs {
  lengthMm: number;
  widthMm: number;
  thicknessMm: number;
  quantity: number;
  grossAreaSqMm: number;
  netUsableAreaSqMm: number;
  condition: TileCondition;
  materialType: TileMaterialType;
}
