import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe/client";
import {
  fulfillPurchaseOrder,
  markPurchaseFailed,
  processPurchaseRefund,
} from "@/lib/stripe/orderStore";
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/email/mailer";
import { syncPurchaseToDatabase } from "@/lib/db/postgres";
import { TWENTY_PROJECT_CONCEPTS } from "@/lib/data/seededProjects";

export async function POST(request: NextRequest): Promise<Response> {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured on the server.");
    return NextResponse.json(
      { error: "Stripe webhook configuration error." },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid webhook signature";
    console.warn(`[Stripe Webhook Warning] Signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === "paid" || session.status === "complete") {
          const fulfillment = fulfillPurchaseOrder({
            stripeSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
            customerEmail: session.customer_details?.email || session.customer_email || null,
            projectId: session.metadata?.projectId,
            projectSlug: session.metadata?.projectSlug,
            planVersion: session.metadata?.planVersion,
          });

          if (fulfillment.alreadyProcessed) {
            console.log(
              `[Stripe Webhook] Idempotent duplicate handled for session: ${session.id}`
            );
          } else {
            console.log(
              `[Stripe Webhook] Order successfully fulfilled for session: ${session.id}`
            );

            // Persist order & download token to live Supabase PostgreSQL
            await syncPurchaseToDatabase({
              purchaseId: fulfillment.purchase.id,
              projectId: fulfillment.purchase.projectId,
              projectSlug: fulfillment.purchase.projectSlug,
              planVersion: fulfillment.purchase.planVersion,
              customerEmail: fulfillment.purchase.customerEmail,
              amountCents: fulfillment.purchase.amountCents,
              currency: fulfillment.purchase.currency,
              stripeSessionId: fulfillment.purchase.stripeSessionId,
              stripePaymentIntentId: fulfillment.purchase.stripePaymentIntentId,
              status: fulfillment.purchase.status,
              downloadToken: fulfillment.entitlement?.downloadToken,
            });

            // Dispatch customer confirmation email via Resend
            const matchedProject = TWENTY_PROJECT_CONCEPTS.find(
              (p) =>
                p.id === fulfillment.purchase.projectId ||
                p.slug === fulfillment.purchase.projectSlug
            );
            const projectTitle = matchedProject
              ? matchedProject.translations.en.title
              : fulfillment.purchase.projectSlug;

            const baseUrl =
              process.env.NEXT_PUBLIC_APP_URL || "https://4dev.in";
            const downloadUrl = fulfillment.entitlement
              ? `${baseUrl}/api/plans/${fulfillment.entitlement.downloadToken}/download`
              : `${baseUrl}/checkout/success?session_id=${session.id}`;

            if (fulfillment.purchase.customerEmail) {
              await sendOrderConfirmationEmail({
                customerEmail: fulfillment.purchase.customerEmail,
                customerName: session.customer_details?.name || undefined,
                projectTitle,
                projectSlug: fulfillment.purchase.projectSlug,
                planVersion: fulfillment.purchase.planVersion,
                orderId: fulfillment.purchase.id,
                amountCents: fulfillment.purchase.amountCents,
                downloadUrl,
                difficulty: matchedProject?.difficulty,
              });
            }

            // Dispatch admin notification
            await sendAdminOrderNotification({
              orderId: fulfillment.purchase.id,
              customerEmail: fulfillment.purchase.customerEmail,
              projectTitle,
              amountCents: fulfillment.purchase.amountCents,
              stripeSessionId: session.id,
            });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        markPurchaseFailed({
          stripePaymentIntentId: intent.id,
          reason: intent.last_payment_error?.message || "Payment intent processing failed.",
        });
        console.log(`[Stripe Webhook] Payment failed for intent: ${intent.id}`);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === "string" ? charge.payment_intent : undefined;

        const refundResult = processPurchaseRefund({
          stripePaymentIntentId: paymentIntentId,
          reason: charge.refunds?.data[0]?.reason || "customer_refund",
        });

        if (refundResult.success) {
          console.log(
            `[Stripe Webhook] Plan download access REVOKED following refund for intent: ${paymentIntentId}`
          );
        }
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        const paymentIntentId =
          typeof dispute.payment_intent === "string" ? dispute.payment_intent : undefined;

        processPurchaseRefund({
          stripePaymentIntentId: paymentIntentId,
          reason: `chargeback_dispute_${dispute.reason}`,
        });
        console.log(
          `[Stripe Webhook] Plan access suspended due to dispute for intent: ${paymentIntentId}`
        );
        break;
      }

      default:
        // Silently acknowledge unhandled events
        break;
    }

    return NextResponse.json({ received: true, event: event.type }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error processing webhook event";
    console.error(`[Stripe Webhook Error] Processing error: ${message}`);
    return NextResponse.json(
      { error: "Webhook event processing error." },
      { status: 500 }
    );
  }
}
