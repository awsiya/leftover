import crypto from "node:crypto";
import { sendAdminLoginOtpEmail, getAdminRecipients } from "@/lib/email/mailer";

interface StoredOtp {
  code: string;
  expiresAt: number;
  attempts: number;
  requestedEmail: string;
}

// In-memory OTP storage
let activeOtp: StoredOtp | null = null;

// Valid session tokens set
const validSessionTokens = new Set<string>();

const OTP_SECRET = process.env.OTP_SECRET || "antigravity-leftover-tile-secret-otp-signing-key";

/**
 * Generates and dispatches a 6-digit login OTP to ALL admin emails (piyakshi90@gmail.com and one2ai@aol.com).
 */
export async function issueAdminOtp(requestedEmail: string): Promise<{
  success: boolean;
  recipients: string[];
  error?: string;
}> {
  const recipients = getAdminRecipients();

  // Generate cryptographic 6-digit numeric OTP
  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  activeOtp = {
    code,
    expiresAt,
    attempts: 0,
    requestedEmail: requestedEmail || "piyakshi90@gmail.com",
  };

  console.log(`[Admin OTP] Generated code for admin channel. Dispatching to: ${recipients.join(", ")}`);

  // Send via Resend to all admin recipient emails
  const sendResult = await sendAdminLoginOtpEmail({
    otpCode: code,
    requestedEmail: activeOtp.requestedEmail,
    recipients,
  });

  if (!sendResult.success) {
    console.warn(`[Admin OTP Warning] Resend dispatch had an issue:`, sendResult.error);
  }

  return {
    success: true,
    recipients,
  };
}

/**
 * Verifies the entered 6-digit OTP code.
 */
export function verifyAdminOtp(inputCode: string): {
  success: boolean;
  token?: string;
  error?: string;
} {
  if (!activeOtp) {
    return {
      success: false,
      error: "No active OTP found. Please click 'Send Login Code' to receive a new code.",
    };
  }

  if (Date.now() > activeOtp.expiresAt) {
    activeOtp = null;
    return {
      success: false,
      error: "Your security code has expired. Please request a new one.",
    };
  }

  activeOtp.attempts += 1;
  if (activeOtp.attempts > 5) {
    activeOtp = null;
    return {
      success: false,
      error: "Too many failed attempts. For security, please request a fresh code.",
    };
  }

  const cleanInput = inputCode.trim();
  if (cleanInput !== activeOtp.code) {
    return {
      success: false,
      error: `Invalid verification code. ${5 - activeOtp.attempts} attempts remaining.`,
    };
  }

  // Code verified! Generate 24-hour authenticated admin session token
  activeOtp = null;
  const tokenId = crypto.randomUUID();
  const signature = crypto.createHmac("sha256", OTP_SECRET).update(tokenId).digest("hex");
  const sessionToken = `${tokenId}.${signature}`;

  validSessionTokens.add(sessionToken);
  return {
    success: true,
    token: sessionToken,
  };
}

/**
 * Validates whether an HTTP request contains a verified admin OTP session token.
 */
export function isValidOtpSessionToken(token: string | undefined): boolean {
  if (!token || !token.includes(".")) return false;
  const [tokenId, signature] = token.split(".");
  if (!tokenId || !signature) return false;

  const expectedSignature = crypto.createHmac("sha256", OTP_SECRET).update(tokenId).digest("hex");
  if (signature !== expectedSignature) return false;

  return validSessionTokens.has(token);
}
