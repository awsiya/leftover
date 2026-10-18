import { PDFPage, PDFFont, rgb } from "pdf-lib";
import { PlanVersionSnapshot } from "@/lib/types/planVersion";

// Palette matching our architectural warm ceramic & charcoal design system
const COLOR_CHARCOAL_900 = rgb(0.12, 0.12, 0.14);
const COLOR_CHARCOAL_600 = rgb(0.35, 0.35, 0.38);
const COLOR_TERRACOTTA_600 = rgb(0.77, 0.35, 0.22);
const COLOR_TERRACOTTA_100 = rgb(0.97, 0.91, 0.88);
const COLOR_CERAMIC_100 = rgb(0.96, 0.95, 0.93);
const COLOR_CERAMIC_200 = rgb(0.91, 0.89, 0.85);
const COLOR_CERAMIC_300 = rgb(0.82, 0.8, 0.75);
const COLOR_WHITE = rgb(1, 1, 1);
const COLOR_SAGE_600 = rgb(0.31, 0.44, 0.38);

/**
 * Draws a clean dimensional arrow with text label between two points.
 */
function drawDimensionArrow(
  page: PDFPage,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  label: string,
  font: PDFFont,
  options?: { isVertical?: boolean; labelOffset?: number }
) {
  // Dimension line
  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness: 0.75,
    color: COLOR_CHARCOAL_600,
  });

  const arrowSize = 3;
  if (options?.isVertical) {
    // Top arrow
    page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x1 - arrowSize, y: y1 - arrowSize },
      thickness: 0.75,
      color: COLOR_CHARCOAL_600,
    });
    page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x1 + arrowSize, y: y1 - arrowSize },
      thickness: 0.75,
      color: COLOR_CHARCOAL_600,
    });
    // Bottom arrow
    page.drawLine({
      start: { x: x2, y: y2 },
      end: { x: x2 - arrowSize, y: y2 + arrowSize },
      thickness: 0.75,
      color: COLOR_CHARCOAL_600,
    });
    page.drawLine({
      start: { x: x2, y: y2 },
      end: { x: x2 + arrowSize, y: y2 + arrowSize },
      thickness: 0.75,
      color: COLOR_CHARCOAL_600,
    });

    const midY = (y1 + y2) / 2 - 3;
    page.drawText(label, {
      x: x1 + (options?.labelOffset || 4),
      y: midY,
      size: 7,
      font,
      color: COLOR_CHARCOAL_600,
    });
  } else {
    // Horizontal arrows
    // Left arrow
    page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x1 + arrowSize, y: y1 - arrowSize },
      thickness: 0.75,
      color: COLOR_CHARCOAL_600,
    });
    page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x1 + arrowSize, y: y1 + arrowSize },
      thickness: 0.75,
      color: COLOR_CHARCOAL_600,
    });
    // Right arrow
    page.drawLine({
      start: { x: x2, y: y2 },
      end: { x: x2 - arrowSize, y: y2 - arrowSize },
      thickness: 0.75,
      color: COLOR_CHARCOAL_600,
    });
    page.drawLine({
      start: { x: x2, y: y2 },
      end: { x: x2 - arrowSize, y: y2 + arrowSize },
      thickness: 0.75,
      color: COLOR_CHARCOAL_600,
    });

    const textWidth = font.widthOfTextAtSize(label, 7);
    const midX = (x1 + x2) / 2 - textWidth / 2;
    page.drawText(label, {
      x: midX,
      y: y1 + (options?.labelOffset || 4),
      size: 7,
      font,
      color: COLOR_CHARCOAL_600,
    });
  }
}

/**
 * Draws the Primary Cutting & Layout Diagram (Plan View).
 */
export function drawCuttingLayoutDiagram(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  snapshot: PlanVersionSnapshot,
  font: PDFFont,
  boldFont: PDFFont
) {
  // Diagram container box
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: COLOR_CERAMIC_100,
    borderColor: COLOR_CERAMIC_300,
    borderWidth: 1,
  });

  // Diagram Title Header
  page.drawRectangle({
    x,
    y: y + height - 20,
    width,
    height: 20,
    color: COLOR_CERAMIC_200,
  });

  page.drawText("FIG 1.0 — SCHEMATIC CUTTING & LAYOUT BLUEPRINT (TOP-DOWN)", {
    x: x + 8,
    y: y + height - 14,
    size: 7.5,
    font: boldFont,
    color: COLOR_CHARCOAL_900,
  });

  // Inner drawing area coordinates
  const drawAreaX = x + 35;
  const drawAreaY = y + 25;
  const drawWidth = width - 75;
  const drawHeight = height - 60;

  // Outer substrate frame
  page.drawRectangle({
    x: drawAreaX,
    y: drawAreaY,
    width: drawWidth,
    height: drawHeight,
    color: COLOR_WHITE,
    borderColor: COLOR_CHARCOAL_900,
    borderWidth: 1.5,
  });

  const requiresCuts = snapshot.cuttingGuidance.requiresStraightCuts;
  const isMosaic = snapshot.cuttingGuidance.allowIrregularShards;

  if (isMosaic) {
    // Draw decorative mosaic shard field representation
    page.drawText("[ MOSAIC SHARD INLAY FIELD — 15 TO 35mm SHARDS ]", {
      x: drawAreaX + 15,
      y: drawAreaY + drawHeight / 2 - 3,
      size: 7.5,
      font: boldFont,
      color: COLOR_TERRACOTTA_600,
    });

    // Sample mosaic shards
    const shardPoints = [
      { x: drawAreaX + 20, y: drawAreaY + 15, w: 22, h: 18 },
      { x: drawAreaX + 46, y: drawAreaY + 12, w: 26, h: 22 },
      { x: drawAreaX + 76, y: drawAreaY + 16, w: 20, h: 16 },
      { x: drawAreaX + 100, y: drawAreaY + 14, w: 28, h: 20 },
      { x: drawAreaX + 22, y: drawAreaY + 40, w: 30, h: 22 },
      { x: drawAreaX + 58, y: drawAreaY + 38, w: 24, h: 24 },
      { x: drawAreaX + 86, y: drawAreaY + 42, w: 32, h: 18 },
    ];

    for (const s of shardPoints) {
      if (s.x + s.w < drawAreaX + drawWidth && s.y + s.h < drawAreaY + drawHeight) {
        page.drawRectangle({
          x: s.x,
          y: s.y,
          width: s.w,
          height: s.h,
          color: COLOR_TERRACOTTA_100,
          borderColor: COLOR_TERRACOTTA_600,
          borderWidth: 0.75,
        });
      }
    }
  } else {
    // Modular or Cut Tile Grid (e.g. 2x2, 3x2, or 4x4)
    const cols = 3;
    const rows = 2;
    const cellW = (drawWidth - 6) / cols;
    const cellH = (drawHeight - 6) / rows;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const cellX = drawAreaX + 3 + c * cellW;
        const cellY = drawAreaY + 3 + r * cellH;

        page.drawRectangle({
          x: cellX,
          y: cellY,
          width: cellW - 2,
          height: cellH - 2,
          color: (c + r) % 2 === 0 ? COLOR_CERAMIC_100 : COLOR_WHITE,
          borderColor: COLOR_CHARCOAL_600,
          borderWidth: 0.75,
        });

        // Label on tile module
        page.drawText(`T${c + r * cols + 1}`, {
          x: cellX + cellW / 2 - 6,
          y: cellY + cellH / 2 - 3,
          size: 7,
          font,
          color: COLOR_CHARCOAL_600,
        });
      }
    }

    if (requiresCuts) {
      // Draw cut line indicator with kerf deduction
      const cutLineX = drawAreaX + drawWidth * 0.65;
      page.drawLine({
        start: { x: cutLineX, y: drawAreaY },
        end: { x: cutLineX, y: drawAreaY + drawHeight },
        thickness: 1.25,
        color: COLOR_TERRACOTTA_600,
      });

      page.drawText("CUT LINE (2.4mm KERF)", {
        x: cutLineX - 25,
        y: drawAreaY + drawHeight - 14,
        size: 6.5,
        font: boldFont,
        color: COLOR_TERRACOTTA_600,
      });
    }
  }

  // Dimension Arrows
  // Width dimension on top
  drawDimensionArrow(
    page,
    drawAreaX,
    drawAreaY + drawHeight + 8,
    drawAreaX + drawWidth,
    drawAreaY + drawHeight + 8,
    snapshot.measurements.dimensionsSummary,
    font
  );

  // Height dimension on left
  drawDimensionArrow(
    page,
    drawAreaX - 8,
    drawAreaY + drawHeight,
    drawAreaX - 8,
    drawAreaY,
    `${snapshot.measurements.groutJointWidthMm}mm joint`,
    font,
    { isVertical: true, labelOffset: -38 }
  );

  // Legend / Callout Footer inside diagram
  const legendY = y + 8;
  page.drawText(
    `Note: Standard ${snapshot.measurements.groutJointWidthMm}mm perimeter clearance. Kerf allowance: ${snapshot.cuttingGuidance.kerfAllowanceMm}mm.`,
    {
      x: x + 10,
      y: legendY,
      size: 6.5,
      font,
      color: COLOR_CHARCOAL_600,
    }
  );
}

/**
 * Draws the Structural Layered Cross-Section Diagram.
 */
export function drawCrossSectionDiagram(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  snapshot: PlanVersionSnapshot,
  font: PDFFont,
  boldFont: PDFFont
) {
  // Container
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: COLOR_CERAMIC_100,
    borderColor: COLOR_CERAMIC_300,
    borderWidth: 1,
  });

  // Header
  page.drawRectangle({
    x,
    y: y + height - 20,
    width,
    height: 20,
    color: COLOR_CERAMIC_200,
  });

  page.drawText("FIG 2.0 — STRUCTURAL BONDING & SUBSTRATE CROSS-SECTION", {
    x: x + 8,
    y: y + height - 14,
    size: 7.5,
    font: boldFont,
    color: COLOR_CHARCOAL_900,
  });

  // Drawing area
  const startX = x + 25;
  const startY = y + 25;
  const blockW = width - 110;

  // Layer 1 (Bottom): Substrate Base (Wood / Cement board)
  page.drawRectangle({
    x: startX,
    y: startY,
    width: blockW,
    height: 18,
    color: COLOR_CERAMIC_300,
    borderColor: COLOR_CHARCOAL_900,
    borderWidth: 1,
  });

  // Layer 2 (Middle): Adhesive Mortar Bed (Thinset)
  page.drawRectangle({
    x: startX,
    y: startY + 18,
    width: blockW,
    height: 8,
    color: COLOR_CERAMIC_200,
    borderColor: COLOR_CHARCOAL_600,
    borderWidth: 0.75,
  });

  // Layer 3 (Top): Tile Body + Grout Joint
  const tile1W = blockW * 0.46;
  const jointW = 6;
  const tile2W = blockW * 0.46;

  // Tile 1
  page.drawRectangle({
    x: startX,
    y: startY + 26,
    width: tile1W,
    height: 14,
    color: COLOR_WHITE,
    borderColor: COLOR_CHARCOAL_900,
    borderWidth: 1,
  });

  // Grout Joint
  page.drawRectangle({
    x: startX + tile1W,
    y: startY + 26,
    width: jointW,
    height: 14,
    color: COLOR_SAGE_600,
    borderColor: COLOR_CHARCOAL_900,
    borderWidth: 0.5,
  });

  // Tile 2
  page.drawRectangle({
    x: startX + tile1W + jointW,
    y: startY + 26,
    width: tile2W,
    height: 14,
    color: COLOR_WHITE,
    borderColor: COLOR_CHARCOAL_900,
    borderWidth: 1,
  });

  // Layer Annotations & Callouts
  const calloutX = startX + blockW + 12;

  // Annotation 1: Tile Body
  page.drawText(
    `1. Tile Layer (${snapshot.measurements.minTileThicknessMm}–${snapshot.measurements.maxTileThicknessMm}mm)`,
    {
      x: calloutX,
      y: startY + 30,
      size: 6.5,
      font: boldFont,
      color: COLOR_CHARCOAL_900,
    }
  );

  // Annotation 2: Mortar Bed
  page.drawText("2. Thinset Mortar Bed (3mm combed)", {
    x: calloutX,
    y: startY + 19,
    size: 6.5,
    font,
    color: COLOR_CHARCOAL_900,
  });

  // Annotation 3: Substrate
  page.drawText("3. Substrate (Plywood/Cement Board)", {
    x: calloutX,
    y: startY + 6,
    size: 6.5,
    font,
    color: COLOR_CHARCOAL_900,
  });

  // Grout callout pointing to the joint
  page.drawText(`^ Grout Joint (${snapshot.measurements.groutJointWidthMm}mm)`, {
    x: startX + tile1W - 15,
    y: startY + 44,
    size: 6.5,
    font: boldFont,
    color: COLOR_SAGE_600,
  });
}
