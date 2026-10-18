import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createProjectCheckoutSession } from "@/lib/stripe/checkout";

const checkoutRequestSchema = z.object({
  projectId: z.string().min(1, "Project ID or slug is required"),
  customerEmail: z.string().email("Valid email is required").optional().or(z.literal("")),
});

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const json = await request.json();
    const parsed = checkoutRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid checkout request parameters.",
          details: parsed.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { projectId, customerEmail } = parsed.data;
    const origin = request.headers.get("origin") || undefined;

    const result = await createProjectCheckoutSession({
      projectId,
      customerEmail: customerEmail || undefined,
      originUrl: origin,
    });

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      sessionUrl: result.sessionUrl,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to initiate checkout session.";
    const isSecurityViolation = message.includes("COMMERCE SECURITY VIOLATION");

    return NextResponse.json(
      {
        error: message,
      },
      { status: isSecurityViolation ? 403 : 500 }
    );
  }
}
