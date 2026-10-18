import { NextRequest, NextResponse } from "next/server";
import { verifyAdminOtp } from "@/lib/auth/otpStore";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const code = body?.code;

    if (!code || typeof code !== "string" || code.trim().length !== 6) {
      return NextResponse.json(
        { error: "Please provide a valid 6-digit numeric security code." },
        { status: 400 }
      );
    }

    const result = verifyAdminOtp(code);
    if (!result.success || !result.token) {
      return NextResponse.json(
        { error: result.error || "Invalid or expired security code." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
    });

    // Set secure HTTP-Only admin session cookie
    response.cookies.set("admin_otp_session", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal verification error";
    console.error("[OTP Verify Route Error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
