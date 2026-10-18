import { NextRequest, NextResponse } from "next/server";
import { validateDownloadToken, recordTokenAccess } from "@/lib/pdf/downloadProtection";
import { getFrozenPlanVersion } from "@/lib/pdf/versionStore";
import { generateProjectPlanPdf } from "@/lib/pdf/generator";

interface RouteParams {
  params: Promise<{
    token: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  const { token } = await params;

  // 1. Validate the download authorization token
  const validation = validateDownloadToken(token);
  if (!validation.isValid || !validation.tokenRecord) {
    return NextResponse.json(
      {
        error: validation.error || "Unauthorized download request.",
      },
      {
        status: validation.statusCode || 403,
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      }
    );
  }

  const { tokenRecord } = validation;

  // 2. Fetch the immutable frozen plan snapshot
  const snapshot = getFrozenPlanVersion(
    tokenRecord.projectSlug,
    tokenRecord.planVersion
  );

  if (!snapshot) {
    return NextResponse.json(
      { error: "Plan version snapshot not found." },
      { status: 404 }
    );
  }

  // 3. Increment download access counter
  recordTokenAccess(token);

  // 4. Generate the architectural PDF plan
  const pdfBytes = await generateProjectPlanPdf(snapshot, {
    customerEmail: tokenRecord.customerEmail,
    licenseId: tokenRecord.token.substring(0, 8),
  });

  const filename = `Leftover-Tile-Plan-${snapshot.projectSlug}-${snapshot.versionLabel}.pdf`;

  // 5. Stream binary PDF with strict security headers
  return new Response(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pdfBytes.byteLength.toString(),
      "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Plan-Version": snapshot.versionLabel,
      "X-Plan-Checksum": snapshot.checksum,
    },
  });
}
