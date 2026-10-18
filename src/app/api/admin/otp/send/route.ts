import { NextRequest, NextResponse } from "next/server";
import { issueAdminOtp } from "@/lib/auth/otpStore";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    let email = "piyakshi90@gmail.com";
    try {
      const body = await request.json();
      if (body && typeof body.email === "string" && body.email.includes("@")) {
        email = body.email.trim().toLowerCase();
      }
    } catch {
      // Body may be empty, proceed with default admin email
    }

    const result = await issueAdminOtp(email);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to generate security code." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to: ${result.recipients.join(" and ")}`,
      recipients: result.recipients,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error generating OTP";
    console.error("[OTP Send Route Error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
