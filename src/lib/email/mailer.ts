import { Resend } from "resend";
import { env } from "@/lib/env";

/**
 * Interface for order confirmation email parameters.
 */
export interface OrderConfirmationEmailParams {
  customerEmail: string;
  customerName?: string;
  projectTitle: string;
  projectSlug: string;
  planVersion: string;
  orderId: string;
  amountCents: number;
  downloadUrl: string;
  difficulty?: string;
  locale?: string;
}

/**
 * Interface for admin notification email parameters.
 */
export interface AdminNotificationParams {
  orderId: string;
  customerEmail: string;
  projectTitle: string;
  amountCents: number;
  stripeSessionId: string;
}

// In-memory idempotency cache to prevent sending duplicate emails for the same order session
const sentEmailSessions = new Set<string>();

/**
 * Get configured Resend client instance.
 * Returns null if no API key is configured.
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY || env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("placeholder")) {
    return null;
  }
  return new Resend(apiKey);
}

/**
 * Generates editorial, brand-consistent HTML for order confirmation email.
 * Ceramic & terracotta color palette matching the web application design system.
 */
export function generateOrderConfirmationHtml(params: {
  customerName?: string;
  projectTitle: string;
  planVersion: string;
  orderId: string;
  amountCents: number;
  downloadUrl: string;
  difficulty?: string;
}): string {
  const formattedAmount = (params.amountCents / 100).toFixed(2);
  const greeting = params.customerName ? `Hello ${params.customerName},` : "Hello,";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Leftover Tile Project Plan</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f7f6f2;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #2b2927;
      line-height: 1.6;
    }
    .wrapper {
      max-width: 620px;
      margin: 32px auto;
      background-color: #ffffff;
      border: 1px solid #e7e2d7;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(43, 41, 39, 0.05);
    }
    .header {
      background-color: #2b2927;
      padding: 28px 32px;
      text-align: left;
    }
    .brand-title {
      color: #ffffff;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0;
    }
    .brand-subtitle {
      color: #c98860;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 4px;
      margin-bottom: 0;
    }
    .content {
      padding: 36px 32px;
    }
    .badge {
      display: inline-block;
      background-color: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 4px 8px;
      margin-bottom: 16px;
    }
    .headline {
      font-size: 24px;
      font-weight: 700;
      color: #2b2927;
      line-height: 1.3;
      margin: 0 0 16px 0;
    }
    .receipt-box {
      background-color: #faf8f5;
      border: 1px solid #ede8de;
      border-radius: 6px;
      padding: 20px;
      margin: 24px 0;
    }
    .receipt-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .receipt-table td {
      padding: 6px 0;
      vertical-align: top;
    }
    .receipt-label {
      color: #7a7369;
      width: 40%;
    }
    .receipt-val {
      color: #2b2927;
      font-weight: 600;
      text-align: right;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0 24px 0;
    }
    .btn {
      display: inline-block;
      background-color: #b85d38;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      padding: 14px 28px;
      border-radius: 6px;
      letter-spacing: -0.01em;
    }
    .features-list {
      background-color: #ffffff;
      border-left: 3px solid #b85d38;
      padding: 12px 16px;
      margin: 20px 0;
      font-size: 13px;
      color: #555048;
    }
    .features-list ul {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }
    .features-list li {
      margin-bottom: 4px;
    }
    .safety-notice {
      background-color: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 6px;
      padding: 14px 18px;
      margin-top: 24px;
      font-size: 12px;
      color: #92400e;
    }
    .footer {
      background-color: #f7f6f2;
      border-top: 1px solid #e7e2d7;
      padding: 24px 32px;
      font-size: 11px;
      color: #7a7369;
      text-align: center;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="brand-title">Leftover Tile Project Planner</div>
      <div class="brand-subtitle">Architectural Workshop Plans &bull; 4dev.in</div>
    </div>

    <div class="content">
      <div class="badge">Payment Verified &bull; Stripe Checkout</div>
      <h1 class="headline">Thank You for Your Order</h1>

      <p>${greeting}</p>
      <p>Your one-time purchase of <strong>$${formattedAmount} USD</strong> has been confirmed. Your private printable architectural plan is now unlocked and available for immediate download.</p>

      <div class="receipt-box">
        <table class="receipt-table">
          <tr>
            <td class="receipt-label">Project:</td>
            <td class="receipt-val">${escapeHtml(params.projectTitle)}</td>
          </tr>
          <tr>
            <td class="receipt-label">Plan Version:</td>
            <td class="receipt-val">${escapeHtml(params.planVersion)}</td>
          </tr>
          ${params.difficulty ? `<tr><td class="receipt-label">Skill Level:</td><td class="receipt-val" style="text-transform: capitalize;">${escapeHtml(params.difficulty)}</td></tr>` : ""}
          <tr>
            <td class="receipt-label">Order ID:</td>
            <td class="receipt-val" style="font-family: monospace; font-size: 12px;">${escapeHtml(params.orderId.slice(0, 18))}...</td>
          </tr>
          <tr>
            <td class="receipt-label">Amount Paid:</td>
            <td class="receipt-val">$${formattedAmount} USD</td>
          </tr>
          <tr>
            <td class="receipt-label">Entitlement Validity:</td>
            <td class="receipt-val">30 Days (Up to 10 Downloads)</td>
          </tr>
        </table>
      </div>

      <div class="btn-container">
        <a href="${escapeHtml(params.downloadUrl)}" class="btn" target="_blank" rel="noopener noreferrer">
          Download Printable PDF Plan
        </a>
      </div>

      <div class="features-list">
        <strong>What is included in your 3-page architectural plan:</strong>
        <ul>
          <li>High-precision cutting diagrams and tile layout geometry</li>
          <li>Exact materials checklist (grout, mortar, substrate, adhesive)</li>
          <li>Required workshop tools list with safety ratings</li>
          <li>Numbered, step-by-step assembly instructions</li>
          <li>Permanent personal-use workshop license</li>
        </ul>
      </div>

      <div class="safety-notice">
        <strong>Workshop Safety Note:</strong> Always wear ANSI Z87.1 certified eye protection and an N95/FFP2 dust mask when scoring, nipping, or angle-grinding ceramic or porcelain tiles. Work in a well-ventilated space.
      </div>
    </div>

    <div class="footer">
      <p>Leftover Tile Project Planner &bull; Sent from leftover@4dev.in</p>
      <p>Need support or have workshop questions? Contact our team at <a href="mailto:leftover@4dev.in" style="color: #b85d38; text-decoration: none;">leftover@4dev.in</a>.</p>
      <p>&copy; 2026 Leftover Tile Project Planner. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generates plain-text fallback for email clients without HTML support.
 */
export function generateOrderConfirmationText(params: {
  customerName?: string;
  projectTitle: string;
  planVersion: string;
  orderId: string;
  amountCents: number;
  downloadUrl: string;
}): string {
  const formattedAmount = (params.amountCents / 100).toFixed(2);
  const greeting = params.customerName ? `Hello ${params.customerName},` : "Hello,";

  return `LEFTOVER TILE PROJECT PLANNER — ORDER CONFIRMATION
==================================================

${greeting}

Thank you for your order! Your one-time purchase of $${formattedAmount} USD has been confirmed.

ORDER SUMMARY
-------------
Project:       ${params.projectTitle}
Plan Version:  ${params.planVersion}
Order ID:      ${params.orderId}
Amount Paid:   $${formattedAmount} USD
Entitlement:   30 Days Validity (Up to 10 Downloads)

DOWNLOAD YOUR PLAN
------------------
Access your 3-page architectural printable PDF directly using this secure link:
${params.downloadUrl}

INCLUDED IN YOUR PLAN:
- High-precision cutting diagrams & tile layout geometry
- Complete materials & mortar checklist
- Required workshop tools list
- Step-by-step numbered assembly guidance
- Personal workshop use license

SAFETY REMINDER:
Always wear ANSI-approved eye protection and a dust mask when scoring or nipping ceramic tiles.

Questions? Reach us at leftover@4dev.in.
Leftover Tile Project Planner &bull; leftover@4dev.in
`;
}

/**
 * Sends customer order confirmation email with verified download link.
 * Safe & idempotent: will not resend for the same orderId session within process lifetime.
 */
export async function sendOrderConfirmationEmail(
  params: OrderConfirmationEmailParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Idempotency check
  if (sentEmailSessions.has(params.orderId)) {
    console.log(`[Resend Mailer] Email already dispatched for order: ${params.orderId}`);
    return { success: true };
  }

  const resend = getResendClient();
  if (!resend) {
    console.warn(
      `[Resend Mailer] RESEND_API_KEY is not configured. Email to ${params.customerEmail} skipped.`
    );
    return { success: false, error: "RESEND_API_KEY_NOT_CONFIGURED" };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || env.RESEND_FROM_EMAIL || "Leftover Tile Planner <leftover@4dev.in>";
  const subject = `Your Leftover Tile Project Plan: ${params.projectTitle}`;

  try {
    const html = generateOrderConfirmationHtml({
      customerName: params.customerName,
      projectTitle: params.projectTitle,
      planVersion: params.planVersion,
      orderId: params.orderId,
      amountCents: params.amountCents,
      downloadUrl: params.downloadUrl,
      difficulty: params.difficulty,
    });

    const text = generateOrderConfirmationText({
      customerName: params.customerName,
      projectTitle: params.projectTitle,
      planVersion: params.planVersion,
      orderId: params.orderId,
      amountCents: params.amountCents,
      downloadUrl: params.downloadUrl,
    });

    const response = await resend.emails.send({
      from: fromEmail,
      to: params.customerEmail,
      subject,
      html,
      text,
    });

    if (response.error) {
      console.error(`[Resend Mailer Error]`, response.error);
      return { success: false, error: response.error.message };
    }

    sentEmailSessions.add(params.orderId);
    console.log(
      `[Resend Mailer] Successfully sent order confirmation to ${params.customerEmail} (ID: ${response.data?.id})`
    );

    return { success: true, messageId: response.data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to dispatch email";
    console.error(`[Resend Mailer Exception]`, message);
    return { success: false, error: message };
  }
}

/**
 * Sends admin notification email about a newly fulfilled plan order.
 */
export async function sendAdminOrderNotification(
  params: AdminNotificationParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resend = getResendClient();
  if (!resend) return { success: false, error: "RESEND_API_KEY_NOT_CONFIGURED" };

  const adminEmail = process.env.ADMIN_EMAIL || env.ADMIN_EMAIL || "admin@4dev.in";
  const fromEmail = process.env.RESEND_FROM_EMAIL || env.RESEND_FROM_EMAIL || "Leftover Tile Planner <leftover@4dev.in>";
  const formattedAmount = (params.amountCents / 100).toFixed(2);

  try {
    const response = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `[New Sale $${formattedAmount}] ${params.projectTitle}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
          <h3 style="color: #166534; margin-top: 0;">New Leftover Tile Plan Purchase Confirmed</h3>
          <p><strong>Project:</strong> ${escapeHtml(params.projectTitle)}</p>
          <p><strong>Customer Email:</strong> ${escapeHtml(params.customerEmail)}</p>
          <p><strong>Amount:</strong> $${formattedAmount} USD</p>
          <p><strong>Order ID:</strong> ${escapeHtml(params.orderId)}</p>
          <p><strong>Stripe Session:</strong> ${escapeHtml(params.stripeSessionId)}</p>
        </div>
      `,
      text: `New Plan Purchase Confirmed\nProject: ${params.projectTitle}\nCustomer: ${params.customerEmail}\nAmount: $${formattedAmount} USD\nOrder: ${params.orderId}`,
    });

    return { success: !response.error, messageId: response.data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Admin notification failed";
    console.warn(`[Resend Admin Notification Warning]`, message);
    return { success: false, error: message };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
