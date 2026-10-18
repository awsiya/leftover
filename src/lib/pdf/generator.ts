import { PDFDocument, StandardFonts, rgb, PageSizes, PDFPage, PDFFont } from "pdf-lib";
import { PlanVersionSnapshot } from "@/lib/types/planVersion";
import { drawCuttingLayoutDiagram, drawCrossSectionDiagram } from "./diagramRenderer";

// Architectural Color Palette
const COLOR_CHARCOAL_950 = rgb(0.08, 0.08, 0.1);
const COLOR_CHARCOAL_900 = rgb(0.12, 0.12, 0.14);
const COLOR_CHARCOAL_700 = rgb(0.24, 0.24, 0.26);
const COLOR_CHARCOAL_500 = rgb(0.45, 0.45, 0.48);
const COLOR_TERRACOTTA_600 = rgb(0.77, 0.35, 0.22);
const COLOR_CERAMIC_50 = rgb(0.98, 0.97, 0.96);
const COLOR_CERAMIC_100 = rgb(0.96, 0.95, 0.93);
const COLOR_CERAMIC_200 = rgb(0.91, 0.89, 0.85);
const COLOR_CERAMIC_300 = rgb(0.82, 0.8, 0.75);
const COLOR_WHITE = rgb(1, 1, 1);
const COLOR_AMBER_800 = rgb(0.72, 0.42, 0.08);
const COLOR_AMBER_50 = rgb(0.99, 0.97, 0.92);
const COLOR_AMBER_300 = rgb(0.95, 0.82, 0.55);

export interface GeneratePdfOptions {
  watermarkText?: string;
  licenseId?: string;
  customerEmail?: string;
}

/**
 * Splits text into wrapped lines fitting within maxWidth.
 */
function wrapText(text: string, maxWidth: number, fontSize: number, font: PDFFont): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Draws running top header on secondary pages.
 */
function drawRunningHeader(
  page: PDFPage,
  snapshot: PlanVersionSnapshot,
  font: PDFFont,
  boldFont: PDFFont
) {
  const width = page.getWidth();
  const topY = page.getHeight() - 25;

  page.drawText("LEFTOVER TILE PROJECT PLANNER", {
    x: 40,
    y: topY,
    size: 7,
    font: boldFont,
    color: COLOR_TERRACOTTA_600,
  });

  page.drawText(`|  ${snapshot.title.toUpperCase()}  |  ${snapshot.versionLabel}`, {
    x: 185,
    y: topY,
    size: 7,
    font,
    color: COLOR_CHARCOAL_500,
  });

  page.drawLine({
    start: { x: 40, y: topY - 6 },
    end: { x: width - 40, y: topY - 6 },
    thickness: 0.5,
    color: COLOR_CERAMIC_300,
  });
}

/**
 * Draws running footer with page count, checksum, and watermark.
 */
function drawRunningFooter(
  page: PDFPage,
  pageNumber: number,
  totalPages: number,
  snapshot: PlanVersionSnapshot,
  font: PDFFont,
  options?: GeneratePdfOptions
) {
  const width = page.getWidth();
  const footerY = 25;

  page.drawLine({
    start: { x: 40, y: footerY + 12 },
    end: { x: width - 40, y: footerY + 12 },
    thickness: 0.5,
    color: COLOR_CERAMIC_300,
  });

  // Left: Checksum & Version
  const checksumShort = snapshot.checksum.substring(0, 16);
  page.drawText(
    `Official Architectural Plan  |  Ver: ${snapshot.versionLabel}  |  SHA: ${checksumShort}...`,
    {
      x: 40,
      y: footerY,
      size: 6.5,
      font,
      color: COLOR_CHARCOAL_500,
    }
  );

  // Center: License Watermark
  if (options?.customerEmail || options?.licenseId) {
    const lic = options.customerEmail
      ? `Licensed to: ${options.customerEmail}`
      : `Lic: ${options.licenseId}`;
    page.drawText(lic, {
      x: width / 2 - 60,
      y: footerY,
      size: 6.5,
      font,
      color: COLOR_CHARCOAL_500,
    });
  }

  // Right: Page Number
  const pageStr = `Page ${pageNumber} of ${totalPages}`;
  const pageStrWidth = font.widthOfTextAtSize(pageStr, 6.5);
  page.drawText(pageStr, {
    x: width - 40 - pageStrWidth,
    y: footerY,
    size: 6.5,
    font,
    color: COLOR_CHARCOAL_500,
  });
}

/**
 * Generates a complete, multi-page, publication-quality printable PDF project plan.
 */
export async function generateProjectPlanPdf(
  snapshot: PlanVersionSnapshot,
  options?: GeneratePdfOptions
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  // Document Metadata
  doc.setTitle(`Leftover Tile Plan — ${snapshot.title} (${snapshot.versionLabel})`);
  doc.setAuthor("Leftover Tile Project Planner Architecture Team");
  doc.setSubject(`Printable DIY Tile Plan: ${snapshot.title}`);
  doc.setKeywords([
    "tile plan",
    "DIY",
    "mosaic",
    "ceramic",
    "architectural guide",
    snapshot.categoryLabel,
  ]);
  doc.setProducer("Leftover Tile Project Planner PDF Engine");
  doc.setCreator("Leftover Tile Planner (https://leftovertileplanner.com)");
  doc.setCreationDate(new Date(snapshot.createdAt));
  doc.setModificationDate(new Date());

  // Embed Fonts
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await doc.embedFont(StandardFonts.HelveticaOblique);
  const courier = await doc.embedFont(StandardFonts.Courier);

  const totalPages = 3;

  // ==========================================================================
  // PAGE 1: COVER, VERIFIED SPECIFICATIONS & ARCHITECTURAL DIAGRAMS
  // ==========================================================================
  const page1 = doc.addPage(PageSizes.Letter); // 612 x 792 pt
  const p1Width = page1.getWidth();
  const p1Height = page1.getHeight();

  // Top Accent Brand Banner
  page1.drawRectangle({
    x: 0,
    y: p1Height - 8,
    width: p1Width,
    height: 8,
    color: COLOR_TERRACOTTA_600,
  });

  // Header Box
  page1.drawRectangle({
    x: 40,
    y: p1Height - 110,
    width: p1Width - 80,
    height: 90,
    color: COLOR_CHARCOAL_950,
  });

  // Brand Name
  page1.drawText("LEFTOVER TILE PROJECT PLANNER", {
    x: 55,
    y: p1Height - 42,
    size: 8,
    font: helveticaBold,
    color: COLOR_TERRACOTTA_600,
  });

  page1.drawText("ARCHITECTURAL DIY SPECIFICATION & BUILD GUIDE", {
    x: 55,
    y: p1Height - 54,
    size: 6.5,
    font: helvetica,
    color: COLOR_CERAMIC_200,
  });

  // Project Title
  page1.drawText(snapshot.title.toUpperCase(), {
    x: 55,
    y: p1Height - 78,
    size: 14,
    font: helveticaBold,
    color: COLOR_WHITE,
  });

  // Subtitle / Scope
  page1.drawText(snapshot.subtitle, {
    x: 55,
    y: p1Height - 94,
    size: 8,
    font: helveticaOblique,
    color: COLOR_CERAMIC_100,
  });

  // Badge Chips on right of Header
  const badgeRightX = p1Width - 165;
  page1.drawRectangle({
    x: badgeRightX,
    y: p1Height - 50,
    width: 110,
    height: 18,
    color: COLOR_CHARCOAL_700,
  });
  page1.drawText(`PLAN VER: ${snapshot.versionLabel}`, {
    x: badgeRightX + 10,
    y: p1Height - 43,
    size: 7.5,
    font: helveticaBold,
    color: COLOR_WHITE,
  });

  page1.drawRectangle({
    x: badgeRightX,
    y: p1Height - 74,
    width: 110,
    height: 18,
    color: COLOR_TERRACOTTA_600,
  });
  page1.drawText(
    `${snapshot.categoryLabel.toUpperCase()} | ${snapshot.difficulty.toUpperCase()}`,
    {
      x: badgeRightX + 8,
      y: p1Height - 67,
      size: 6.5,
      font: helveticaBold,
      color: COLOR_WHITE,
    }
  );

  page1.drawText(`EST. TIME: ${snapshot.estimatedTimeMinutes} MINUTES`, {
    x: badgeRightX + 12,
    y: p1Height - 92,
    size: 6.5,
    font: helveticaBold,
    color: COLOR_CERAMIC_200,
  });

  // Section 1: Verified Measurements & Geometry Table
  let cursorY = p1Height - 128;
  page1.drawText("1. VERIFIED MEASUREMENTS & GEOMETRIC REQUIREMENTS", {
    x: 40,
    y: cursorY,
    size: 9,
    font: helveticaBold,
    color: COLOR_CHARCOAL_900,
  });

  cursorY -= 8;
  page1.drawLine({
    start: { x: 40, y: cursorY },
    end: { x: p1Width - 40, y: cursorY },
    thickness: 1,
    color: COLOR_TERRACOTTA_600,
  });

  // Specifications Grid Table
  cursorY -= 15;
  const tableX = 40;
  const tableW = p1Width - 80;
  const colW = tableW / 3;
  const rowH = 28;

  const specsItems = [
    {
      label: "TARGET FINISHED FOOTPRINT",
      value: snapshot.measurements.dimensionsSummary,
      note: "Measured outer substrate border",
    },
    {
      label: "MIN. SURFACE AREA NEEDED",
      value: `${Math.round(snapshot.measurements.minAreaSqMm / 100)} cm² (${(
        snapshot.measurements.minAreaSqMm / 92903
      ).toFixed(2)} sq ft)`,
      note: "Net coverage before waste factor",
    },
    {
      label: "RECOMMENDED TILE PIECES",
      value: `${snapshot.measurements.minTileCount} to ${snapshot.measurements.recommendedTileCount} Pieces`,
      note: "Yield based on specified dimensions",
    },
    {
      label: "TILE THICKNESS RANGE",
      value: `${snapshot.measurements.minTileThicknessMm}mm – ${snapshot.measurements.maxTileThicknessMm}mm`,
      note: "Standard residential vitreous/porcelain",
    },
    {
      label: "GROUT JOINT SPACING",
      value: `${snapshot.measurements.groutJointWidthMm}mm (1/8\" nominal)`,
      note: "Sanded ceramic grout recommended",
    },
    {
      label: "WASTE & KERF MARGIN",
      value: `${Math.round(snapshot.measurements.wasteSafetyFactor * 100)}% Extra Allowance`,
      note: `Includes ${snapshot.cuttingGuidance.kerfAllowanceMm}mm blade kerf deduction`,
    },
  ];

  for (let i = 0; i < specsItems.length; i++) {
    const item = specsItems[i];
    const c = i % 3;
    const r = Math.floor(i / 3);
    const cellX = tableX + c * colW;
    const cellY = cursorY - r * (rowH + 6);

    page1.drawRectangle({
      x: cellX,
      y: cellY - rowH + 8,
      width: colW - 6,
      height: rowH,
      color: COLOR_CERAMIC_50,
      borderColor: COLOR_CERAMIC_200,
      borderWidth: 0.75,
    });

    page1.drawText(item.label, {
      x: cellX + 6,
      y: cellY - 4,
      size: 5.5,
      font: helveticaBold,
      color: COLOR_CHARCOAL_500,
    });

    page1.drawText(item.value, {
      x: cellX + 6,
      y: cellY - 14,
      size: 7.5,
      font: helveticaBold,
      color: COLOR_CHARCOAL_900,
    });

    page1.drawText(item.note, {
      x: cellX + 6,
      y: cellY - 21,
      size: 5.5,
      font: helvetica,
      color: COLOR_CHARCOAL_500,
    });
  }

  // Section 2: Architectural Schematics & Vector Diagrams
  cursorY -= 2 * (rowH + 6) + 16;
  page1.drawText("2. ARCHITECTURAL SCHEMATICS & CUTTING BLUEPRINT", {
    x: 40,
    y: cursorY,
    size: 9,
    font: helveticaBold,
    color: COLOR_CHARCOAL_900,
  });

  cursorY -= 8;
  page1.drawLine({
    start: { x: 40, y: cursorY },
    end: { x: p1Width - 40, y: cursorY },
    thickness: 1,
    color: COLOR_TERRACOTTA_600,
  });

  // Draw FIG 1.0 Cutting Layout Diagram (Top-down)
  cursorY -= 225;
  drawCuttingLayoutDiagram(
    page1,
    40,
    cursorY,
    tableW,
    215,
    snapshot,
    helvetica,
    helveticaBold
  );

  // Draw FIG 2.0 Structural Cross-Section Diagram
  cursorY -= 175;
  drawCrossSectionDiagram(
    page1,
    40,
    cursorY,
    tableW,
    165,
    snapshot,
    helvetica,
    helveticaBold
  );

  drawRunningFooter(page1, 1, totalPages, snapshot, helvetica, options);

  // ==========================================================================
  // PAGE 2: BILL OF MATERIALS, TOOLS CHECKLIST & CUTTING GUIDANCE
  // ==========================================================================
  const page2 = doc.addPage(PageSizes.Letter);
  const p2Width = page2.getWidth();
  const p2Height = page2.getHeight();

  drawRunningHeader(page2, snapshot, helvetica, helveticaBold);

  let p2Y = p2Height - 50;

  // Header: Materials & Tools
  page2.drawText("3. BILL OF MATERIALS & REQUIRED WORKSHOP TOOLS", {
    x: 40,
    y: p2Y,
    size: 9,
    font: helveticaBold,
    color: COLOR_CHARCOAL_900,
  });

  p2Y -= 8;
  page2.drawLine({
    start: { x: 40, y: p2Y },
    end: { x: p2Width - 40, y: p2Y },
    thickness: 1,
    color: COLOR_TERRACOTTA_600,
  });

  // Materials & Tools Columns
  p2Y -= 18;
  const halfColW = (p2Width - 95) / 2;

  // Left Column: Materials
  page2.drawText("MATERIALS LIST", {
    x: 40,
    y: p2Y,
    size: 7.5,
    font: helveticaBold,
    color: COLOR_TERRACOTTA_600,
  });

  let matY = p2Y - 14;
  for (const m of snapshot.materials) {
    page2.drawRectangle({
      x: 40,
      y: matY - 2,
      width: 8,
      height: 8,
      borderColor: COLOR_CHARCOAL_700,
      borderWidth: 0.75,
    });

    page2.drawText(m.name, {
      x: 54,
      y: matY,
      size: 7,
      font: helveticaBold,
      color: COLOR_CHARCOAL_900,
    });

    page2.drawText(`Qty: ${m.amount}`, {
      x: 40 + halfColW - 60,
      y: matY,
      size: 6.5,
      font: helveticaOblique,
      color: COLOR_CHARCOAL_500,
    });

    matY -= 15;
  }

  // Right Column: Tools
  page2.drawText("WORKSHOP TOOLS CHECKLIST", {
    x: 40 + halfColW + 15,
    y: p2Y,
    size: 7.5,
    font: helveticaBold,
    color: COLOR_TERRACOTTA_600,
  });

  let toolY = p2Y - 14;
  for (const t of snapshot.tools) {
    const toolX = 40 + halfColW + 15;
    page2.drawRectangle({
      x: toolX,
      y: toolY - 2,
      width: 8,
      height: 8,
      borderColor: COLOR_CHARCOAL_700,
      borderWidth: 0.75,
    });

    page2.drawText(t.name, {
      x: toolX + 14,
      y: toolY,
      size: 7,
      font: helveticaBold,
      color: COLOR_CHARCOAL_900,
    });

    if (t.isOptional) {
      page2.drawText("(Optional)", {
        x: toolX + halfColW - 45,
        y: toolY,
        size: 6,
        font: helveticaOblique,
        color: COLOR_CHARCOAL_500,
      });
    }

    toolY -= 15;
  }

  // Next Section: In-Depth Cutting Guidance
  p2Y = Math.min(matY, toolY) - 15;
  page2.drawText("4. COMPREHENSIVE CUTTING GUIDANCE & SAW KERF PROTOCOL", {
    x: 40,
    y: p2Y,
    size: 9,
    font: helveticaBold,
    color: COLOR_CHARCOAL_900,
  });

  p2Y -= 8;
  page2.drawLine({
    start: { x: 40, y: p2Y },
    end: { x: p2Width - 40, y: p2Y },
    thickness: 1,
    color: COLOR_TERRACOTTA_600,
  });

  // Primary Method Box
  p2Y -= 32;
  page2.drawRectangle({
    x: 40,
    y: p2Y,
    width: p2Width - 80,
    height: 26,
    color: COLOR_CERAMIC_100,
    borderColor: COLOR_CERAMIC_300,
    borderWidth: 0.75,
  });

  page2.drawText(
    `PRIMARY TOOL: ${snapshot.cuttingGuidance.primaryCutMethod.toUpperCase().replace(/_/g, " ")}`,
    {
      x: 50,
      y: p2Y + 15,
      size: 7.5,
      font: helveticaBold,
      color: COLOR_TERRACOTTA_600,
    }
  );

  page2.drawText(
    `Kerf Deduction: ${snapshot.cuttingGuidance.kerfAllowanceMm}mm  |  Straight Cuts: ${
      snapshot.cuttingGuidance.requiresStraightCuts ? "YES" : "NO"
    }  |  Curved Cuts: ${
      snapshot.cuttingGuidance.requiresCurvedCuts ? "YES" : "NO"
    }  |  Mosaic Shards: ${snapshot.cuttingGuidance.allowIrregularShards ? "ALLOWED" : "EXCLUDED"}`,
    {
      x: 50,
      y: p2Y + 6,
      size: 6.5,
      font: helvetica,
      color: COLOR_CHARCOAL_700,
    }
  );

  p2Y -= 16;
  for (let idx = 0; idx < snapshot.cuttingGuidance.cuttingGuidelines.length; idx++) {
    const guide = snapshot.cuttingGuidance.cuttingGuidelines[idx];
    const lines = wrapText(guide, p2Width - 110, 7, helvetica);

    page2.drawText(`${idx + 1}.`, {
      x: 45,
      y: p2Y,
      size: 7,
      font: helveticaBold,
      color: COLOR_TERRACOTTA_600,
    });

    for (let l = 0; l < lines.length; l++) {
      page2.drawText(lines[l], {
        x: 60,
        y: p2Y - l * 10,
        size: 7,
        font: helvetica,
        color: COLOR_CHARCOAL_900,
      });
    }

    p2Y -= lines.length * 10 + 6;
  }

  // Edge Dressing Technical Callout
  p2Y -= 8;
  page2.drawRectangle({
    x: 40,
    y: p2Y - 45,
    width: p2Width - 80,
    height: 48,
    color: COLOR_CERAMIC_50,
    borderColor: COLOR_CERAMIC_200,
    borderWidth: 0.75,
  });

  page2.drawText("TECHNICAL ADVISORY: DIAMOND HAND PAD EDGE HONING", {
    x: 52,
    y: p2Y - 14,
    size: 7,
    font: helveticaBold,
    color: COLOR_CHARCOAL_900,
  });

  const honingNote =
    "Factory tile edges have a smooth micro-bevel (arris). When leftover tiles are cut with a wet saw or scored and snapped, the newly cut edge is micro-serrated and razor-sharp. Run a 120-grit electroplated diamond hand pad along all cut edges at a 45-degree angle with 3 firm passes. This creates a safe 0.5mm arris that prevents finger lacerations and prevents grout cracking.";
  const honingLines = wrapText(honingNote, p2Width - 105, 6.5, helvetica);
  for (let l = 0; l < honingLines.length; l++) {
    page2.drawText(honingLines[l], {
      x: 52,
      y: p2Y - 24 - l * 9,
      size: 6.5,
      font: helvetica,
      color: COLOR_CHARCOAL_700,
    });
  }

  drawRunningFooter(page2, 2, totalPages, snapshot, helvetica, options);

  // ==========================================================================
  // PAGE 3: STEP-BY-STEP INSTRUCTIONS & CRITICAL SAFETY PROTOCOL
  // ==========================================================================
  const page3 = doc.addPage(PageSizes.Letter);
  const p3Width = page3.getWidth();
  const p3Height = page3.getHeight();

  drawRunningHeader(page3, snapshot, helvetica, helveticaBold);

  let p3Y = p3Height - 50;
  page3.drawText("5. NUMBERED STEP-BY-STEP ASSEMBLY INSTRUCTIONS", {
    x: 40,
    y: p3Y,
    size: 9,
    font: helveticaBold,
    color: COLOR_CHARCOAL_900,
  });

  p3Y -= 8;
  page3.drawLine({
    start: { x: 40, y: p3Y },
    end: { x: p3Width - 40, y: p3Y },
    thickness: 1,
    color: COLOR_TERRACOTTA_600,
  });

  p3Y -= 16;
  for (const step of snapshot.instructions) {
    // Step number badge
    page3.drawRectangle({
      x: 40,
      y: p3Y - 3,
      width: 18,
      height: 18,
      color: COLOR_CHARCOAL_900,
    });

    page3.drawText(`${step.stepNumber}`, {
      x: step.stepNumber >= 10 ? 44 : 47,
      y: p3Y + 3,
      size: 8,
      font: helveticaBold,
      color: COLOR_WHITE,
    });

    // Step Title
    page3.drawText(step.title.toUpperCase(), {
      x: 65,
      y: p3Y + 4,
      size: 7.5,
      font: helveticaBold,
      color: COLOR_CHARCOAL_900,
    });

    // Step Body Text
    p3Y -= 12;
    const bodyLines = wrapText(step.instruction, p3Width - 110, 7, helvetica);
    for (let l = 0; l < bodyLines.length; l++) {
      page3.drawText(bodyLines[l], {
        x: 65,
        y: p3Y - l * 9.5,
        size: 7,
        font: helvetica,
        color: COLOR_CHARCOAL_700,
      });
    }
    p3Y -= bodyLines.length * 9.5 + 4;

    // Safety tip or diagram callout if present
    if (step.safetyTip) {
      page3.drawRectangle({
        x: 65,
        y: p3Y - 10,
        width: p3Width - 110,
        height: 14,
        color: COLOR_AMBER_50,
        borderColor: COLOR_AMBER_300,
        borderWidth: 0.5,
      });

      page3.drawText(`SAFETY TIP: ${step.safetyTip}`, {
        x: 72,
        y: p3Y - 5,
        size: 6,
        font: helveticaBold,
        color: COLOR_AMBER_800,
      });

      p3Y -= 18;
    } else {
      p3Y -= 8;
    }
  }

  // Section 6: TCNA & OSHA Safety Protocol
  p3Y = Math.min(p3Y, 260); // Ensure safety box fits on page 3
  page3.drawText("6. CRITICAL SAFETY PROTOCOL & TCNA DUTY OF CARE", {
    x: 40,
    y: p3Y,
    size: 9,
    font: helveticaBold,
    color: COLOR_CHARCOAL_900,
  });

  p3Y -= 8;
  page3.drawLine({
    start: { x: 40, y: p3Y },
    end: { x: p3Width - 40, y: p3Y },
    thickness: 1,
    color: COLOR_TERRACOTTA_600,
  });

  // Safety Callout Box
  p3Y -= 105;
  page3.drawRectangle({
    x: 40,
    y: p3Y,
    width: p3Width - 80,
    height: 100,
    color: COLOR_AMBER_50,
    borderColor: COLOR_AMBER_800,
    borderWidth: 1.25,
  });

  page3.drawText("MANDATORY DIY SAFETY REQUIREMENTS (OSHA & TCNA STANDARDS)", {
    x: 52,
    y: p3Y + 84,
    size: 7.5,
    font: helveticaBold,
    color: COLOR_AMBER_800,
  });

  const safetyItems = [
    "RESPIRATORY PROTECTION (OSHA SILICA RULE): Vitreous tile, porcelain, and cement mortars contain respirable crystalline silica. Never dry-cut tiles with an angle grinder. Use continuous water-feed wet saws and wear an OSHA/NIOSH-rated N95 or P100 respirator during mortar mixing.",
    "EYE PROTECTION (ANSI Z87.1): Ceramic fragments fly unpredictably during nipping and snapping. High-impact wraparound safety glasses are strictly mandatory at all times.",
    "HAND PROTECTION (ANSI LEVEL 5): Fractured porcelain shards possess surgical razor edges. Always wear cut-resistant gloves during tile fracturing, nipping, and dry fitting.",
    "ADHESIVE CURE & VENTILATION: Provide continuous cross-ventilation during mastic or thinset application. Allow full 24-hour mortar cure before applying grout.",
  ];

  let itemY = p3Y + 70;
  for (const item of safetyItems) {
    const lines = wrapText(item, p3Width - 110, 6, helvetica);
    for (let l = 0; l < lines.length; l++) {
      page3.drawText(lines[l], {
        x: 52,
        y: itemY - l * 7.5,
        size: 6,
        font: l === 0 ? helveticaBold : helvetica,
        color: COLOR_CHARCOAL_900,
      });
    }
    itemY -= lines.length * 7.5 + 4;
  }

  // Official Plan Certification & Watermark Box
  p3Y -= 65;
  page3.drawRectangle({
    x: 40,
    y: p3Y,
    width: p3Width - 80,
    height: 55,
    color: COLOR_CERAMIC_100,
    borderColor: COLOR_CERAMIC_300,
    borderWidth: 0.75,
  });

  page3.drawText("OFFICIAL ARCHITECTURAL DIY PLAN — ISSUED COPY", {
    x: 52,
    y: p3Y + 42,
    size: 7.5,
    font: helveticaBold,
    color: COLOR_CHARCOAL_900,
  });

  page3.drawText(
    `Plan Version: ${snapshot.versionLabel}  |  Released: ${new Date(
      snapshot.createdAt
    ).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}  |  Price: $4.99 USD (499 cents)`,
    {
      x: 52,
      y: p3Y + 30,
      size: 6.5,
      font: helvetica,
      color: COLOR_CHARCOAL_700,
    }
  );

  page3.drawText(`SHA-256 Checksum: ${snapshot.checksum}`, {
    x: 52,
    y: p3Y + 18,
    size: 6,
    font: courier,
    color: COLOR_CHARCOAL_500,
  });

  const licenseNotice = options?.customerEmail
    ? `Licensed for personal non-commercial fabrication by: ${options.customerEmail}`
    : "Licensed for personal non-commercial fabrication. Redistribution prohibited.";
  page3.drawText(licenseNotice, {
    x: 52,
    y: p3Y + 8,
    size: 6,
    font: helveticaOblique,
    color: COLOR_CHARCOAL_500,
  });

  drawRunningFooter(page3, 3, totalPages, snapshot, helvetica, options);

  // Serialize and return binary PDF bytes
  return await doc.save();
}
