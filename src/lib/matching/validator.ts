import { z } from "zod";
import { TileInventoryInput } from "@/lib/types/tile";
import { NormalizedTile } from "./types";
import { toMillimeters, calculateAreaSqMm } from "./converter";

export const tileInputSchema = z
  .object({
    length: z
      .number({ invalid_type_error: "Tile length must be a valid number" })
      .positive("Tile length must be greater than zero"),
    width: z
      .number({ invalid_type_error: "Tile width must be a valid number" })
      .positive("Tile width must be greater than zero"),
    thicknessMm: z
      .number()
      .positive("Tile thickness must be greater than zero")
      .max(50, "Tile thickness cannot exceed 50mm")
      .optional()
      .default(8.0),
    unit: z.enum(["inches", "cm", "mm"], {
      errorMap: () => ({ message: "Unit must be 'inches', 'cm', or 'mm'" }),
    }),
    quantity: z
      .number({ invalid_type_error: "Tile quantity must be a number" })
      .int("Quantity must be a whole integer")
      .positive("Tile quantity must be at least 1")
      .max(100000, "Quantity cannot exceed 100,000 tiles"),
    condition: z.enum(["intact", "mixed", "broken_mosaic"], {
      errorMap: () => ({ message: "Condition must be 'intact', 'mixed', or 'broken_mosaic'" }),
    }),
    materialType: z.enum(
      ["ceramic", "porcelain", "terracotta", "marble_natural_stone", "glass"],
      {
        errorMap: () => ({
          message: "Material must be ceramic, porcelain, terracotta, marble_natural_stone, or glass",
        }),
      }
    ),
    colorFamily: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const maxAllowed = data.unit === "inches" ? 120 : data.unit === "cm" ? 300 : 3000;
    const unitLabel = data.unit === "inches" ? "120 inches (10 ft)" : data.unit === "cm" ? "300 cm (3 m)" : "3000 mm (3 m)";

    if (data.length > maxAllowed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["length"],
        message: `Tile length exceeds maximum supported size for ${data.unit} (${unitLabel})`,
      });
    }

    if (data.width > maxAllowed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["width"],
        message: `Tile width exceeds maximum supported size for ${data.unit} (${unitLabel})`,
      });
    }
  });

/**
 * Validates untrusted user input using the Zod schema.
 */
export function validateTileInput(input: unknown): {
  success: boolean;
  data?: TileInventoryInput;
  errors?: string[];
} {
  const result = tileInputSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
    };
  }
  return {
    success: true,
    data: result.data as TileInventoryInput,
  };
}

/**
 * Normalizes validated input into millimeters and computes gross and net usable area.
 */
export function normalizeTileInventory(input: TileInventoryInput): NormalizedTile {
  const lengthMm = toMillimeters(input.length, input.unit);
  const widthMm = toMillimeters(input.width, input.unit);
  const singleTileAreaSqMm = calculateAreaSqMm(input.length, input.width, input.unit);
  const grossAreaSqMm = singleTileAreaSqMm * input.quantity;

  // Waste allowance based on condition:
  // Intact: 10% kerf loss for straight cuts (0.90 multiplier)
  // Mixed: 15% kerf and trim waste (0.85 multiplier)
  // Broken/Mosaic: 25% fracture and irregular spacing waste (0.75 multiplier)
  let wasteMultiplier = 0.90;
  if (input.condition === "broken_mosaic") {
    wasteMultiplier = 0.75;
  } else if (input.condition === "mixed") {
    wasteMultiplier = 0.85;
  }

  const netUsableAreaSqMm = Math.round(grossAreaSqMm * wasteMultiplier);

  return {
    lengthMm,
    widthMm,
    thicknessMm: input.thicknessMm || 8.0,
    quantity: input.quantity,
    unit: input.unit,
    grossAreaSqMm,
    netUsableAreaSqMm,
    condition: input.condition,
    materialType: input.materialType,
    wasteMultiplier,
  };
}
