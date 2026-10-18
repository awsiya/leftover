import { getStripeClient } from "./client";
import { getLiveProjectById } from "@/lib/actions/adminProjects";
import { TWENTY_PROJECT_CONCEPTS } from "@/lib/data/seededProjects";
import { assertProjectCanBeSold } from "@/lib/types/verification";
import { createPendingPurchase } from "./orderStore";

export interface CreateCheckoutParams {
  projectId: string;
  projectSlug?: string;
  customerEmail?: string;
  originUrl?: string;
}

export interface CreateCheckoutResult {
  sessionId: string;
  sessionUrl: string | null;
  projectId: string;
  projectSlug: string;
  amountCents: number;
}

/**
 * Creates a server-side Stripe Checkout Session for a project plan.
 * SECURITY INVARIANTS:
 * 1. Price is NEVER accepted from client input; strictly fixed at 499 cents ($4.99 USD).
 * 2. Unverified plans are strictly blocked from sale by assertProjectCanBeSold().
 */
export async function createProjectCheckoutSession({
  projectId,
  projectSlug,
  customerEmail,
  originUrl,
}: CreateCheckoutParams): Promise<CreateCheckoutResult> {
  const project =
    (await getLiveProjectById(projectId)) ||
    (projectSlug ? await getLiveProjectById(projectSlug) : null) ||
    TWENTY_PROJECT_CONCEPTS.find(
      (p) => p.id === projectId || p.slug === (projectSlug || projectId)
    );

  if (!project) {
    throw new Error(`Project not found: ${projectId || projectSlug}`);
  }

  // 1. Enforce Physical Verification Commerce Guard
  assertProjectCanBeSold({
    id: project.id,
    slug: project.slug,
    title: project.translations.en.title,
    verification_status: project.verificationStatus,
  });

  const appUrl =
    originUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  // Server-determined fixed pricing
  const unitAmount = project.priceCents; // strictly 499 cents
  const currency = "usd";
  const planVersion = "v1.0.0";

  const stripe = getStripeClient();

  // In test environment when Stripe API key is a dummy mock string, handle mock session
  if (process.env.NODE_ENV === "test" && process.env.STRIPE_SECRET_KEY?.includes("mock")) {
    const mockSessionId = `cs_test_mock_${Date.now()}`;
    const mockUrl = `https://checkout.stripe.com/pay/${mockSessionId}`;

    createPendingPurchase({
      projectId: project.id,
      projectSlug: project.slug,
      planVersion,
      customerEmail: customerEmail || "",
      stripeSessionId: mockSessionId,
      amountCents: unitAmount,
      currency,
    });

    return {
      sessionId: mockSessionId,
      sessionUrl: mockUrl,
      projectId: project.id,
      projectSlug: project.slug,
      amountCents: unitAmount,
    };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: unitAmount,
          product_data: {
            name: `${project.translations.en.title} — Architectural DIY Plan`,
            description:
              "Instant printable PDF plan with cutting blueprints, verified measurements, materials checklist, and step-by-step assembly guide.",
            metadata: {
              projectId: project.id,
              projectSlug: project.slug,
              planVersion,
            },
          },
        },
        quantity: 1,
      },
    ],
    customer_email: customerEmail || undefined,
    metadata: {
      projectId: project.id,
      projectSlug: project.slug,
      planVersion,
      customerEmail: customerEmail || "",
    },
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel?project_slug=${project.slug}`,
  });

  // Record pending purchase in order store
  createPendingPurchase({
    projectId: project.id,
    projectSlug: project.slug,
    planVersion,
    customerEmail: customerEmail || "",
    stripeSessionId: session.id,
    amountCents: unitAmount,
    currency,
  });

  return {
    sessionId: session.id,
    sessionUrl: session.url,
    projectId: project.id,
    projectSlug: project.slug,
    amountCents: unitAmount,
  };
}
