import { TileUnit } from "@/lib/types/tile";

export const MM_PER_INCH = 25.4;
export const MM_PER_CM = 10.0;
export const SQ_MM_PER_SQ_INCH = 645.16;
export const SQ_MM_PER_SQ_FT = 92903.04;
export const SQ_MM_PER_SQ_CM = 100.0;

/**
 * Converts a linear dimension to millimeters.
 * Throws an error if value is negative or not finite.
 */
export function toMillimeters(value: number, unit: TileUnit): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid linear dimension: ${value}. Must be a non-negative finite number.`);
  }

  switch (unit) {
    case "inches":
      return Math.round(value * MM_PER_INCH * 100) / 100;
    case "cm":
      return Math.round(value * MM_PER_CM * 100) / 100;
    case "mm":
      return Math.round(value * 100) / 100;
    default: {
      const _exhaustiveCheck: never = unit;
      throw new Error(`Unsupported unit: ${_exhaustiveCheck}`);
    }
  }
}

/**
 * Converts a linear dimension in millimeters to the target unit.
 */
export function fromMillimeters(valueMm: number, targetUnit: TileUnit): number {
  if (!Number.isFinite(valueMm) || valueMm < 0) {
    throw new Error(`Invalid millimeter dimension: ${valueMm}`);
  }

  switch (targetUnit) {
    case "inches":
      return Math.round((valueMm / MM_PER_INCH) * 100) / 100;
    case "cm":
      return Math.round((valueMm / MM_PER_CM) * 100) / 100;
    case "mm":
      return Math.round(valueMm * 100) / 100;
    default:
      throw new Error(`Unsupported target unit: ${targetUnit}`);
  }
}

/**
 * Calculates surface area in square millimeters from length and width in a specified unit.
 */
export function calculateAreaSqMm(length: number, width: number, unit: TileUnit): number {
  const lengthMm = toMillimeters(length, unit);
  const widthMm = toMillimeters(width, unit);
  return Math.round(lengthMm * widthMm);
}

/**
 * Converts square millimeters to square feet with 2 decimal places.
 */
export function sqMmToSqFeet(sqMm: number): number {
  return Math.round((sqMm / SQ_MM_PER_SQ_FT) * 100) / 100;
}

/**
 * Converts square millimeters to square centimeters with 2 decimal places.
 */
export function sqMmToSqCm(sqMm: number): number {
  return Math.round((sqMm / SQ_MM_PER_SQ_CM) * 100) / 100;
}
