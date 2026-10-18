import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  Layers,
} from "lucide-react";
import { getPurchaseBySessionId, getEntitlementByPurchaseId } from "@/lib/stripe/orderStore";
import { TWENTY_PROJECT_CONCEPTS } from "@/lib/data/seededProjects";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <Card className="bg-white border-ceramic-300 p-8 text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-amber-600 mx-auto" />
          <CardTitle className="font-serif text-xl">Missing Session Identifier</CardTitle>
          <CardDescription className="text-xs text-charcoal-600">
            No valid checkout session identifier was detected. If you completed a purchase,
            please check your email for your confirmation receipt.
          </CardDescription>
          <div className="pt-2">
            <Link href="/projects">
              <Button variant="secondary" size="sm">Browse Project Catalogue</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Server-side verification check: DO NOT TRUST BROWSER REDIRECT AS PROOF
  let purchase = getPurchaseBySessionId(session_id);

  // If purchase is not in memory or pending, verify directly with Stripe API (handles cold starts & serverless lambdas)
  if (
    (!purchase || purchase.status === "pending") &&
    process.env.STRIPE_SECRET_KEY &&
    !process.env.STRIPE_SECRET_KEY.includes("placeholder")
  ) {
    try {
      const { getStripeClient } = await import("@/lib/stripe/client");
      const { fulfillPurchaseOrder } = await import("@/lib/stripe/orderStore");
      const stripe = getStripeClient();
      const session = await stripe.checkout.sessions.retrieve(session_id);

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
        purchase = fulfillment.purchase;
      }
    } catch {
      // Continue to pending screen if Stripe lookup is not available
    }
  }

  // Case 1: Webhook hasn't processed or session is unknown
  if (!purchase || purchase.status === "pending") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <Card className="bg-white border-amber-300 p-8 text-center space-y-4 shadow-subtle">
          <Clock className="h-10 w-10 text-amber-600 mx-auto animate-pulse" />
          <Badge variant="outline" size="sm" className="bg-amber-50 text-amber-800 border-amber-300 mx-auto">
            Payment Processing
          </Badge>
          <CardTitle className="font-serif text-2xl font-bold text-charcoal-900">
            Awaiting Server-Side Payment Confirmation
          </CardTitle>
          <CardDescription className="text-xs text-charcoal-600 max-w-md mx-auto leading-relaxed">
            Our server is waiting for cryptographic webhook confirmation from Stripe.
            To protect your purchase, download tokens are issued only after verified payment.
            This typically takes 2–5 seconds.
          </CardDescription>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={`/checkout/success?session_id=${session_id}`}>
              <Button variant="primary" size="sm" className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Refresh & Check Status</span>
              </Button>
            </Link>
            <Link href="/calculator">
              <Button variant="outline" size="sm">Return to Tile Calculator</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Case 2: Purchase was refunded
  if (purchase.status === "refunded") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <Card className="bg-white border-ceramic-300 p-8 text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-charcoal-500 mx-auto" />
          <Badge variant="outline" size="sm" className="bg-ceramic-100 text-charcoal-700 mx-auto">
            Purchase Refunded
          </Badge>
          <CardTitle className="font-serif text-xl">Order Has Been Refunded</CardTitle>
          <CardDescription className="text-xs text-charcoal-600">
            This order was refunded. In accordance with digital plan policy, access to this
            download token has been revoked.
          </CardDescription>
          <div className="pt-2">
            <Link href="/projects">
              <Button variant="secondary" size="sm">Return to Projects</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Case 3: Purchase Failed
  if (purchase.status === "failed") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <Card className="bg-white border-red-300 p-8 text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-red-600 mx-auto" />
          <CardTitle className="font-serif text-xl text-red-900">Payment Failed</CardTitle>
          <CardDescription className="text-xs text-charcoal-600">
            The payment method could not be processed. No funds were collected.
          </CardDescription>
          <div className="pt-2">
            <Link href="/calculator">
              <Button variant="secondary" size="sm">Try Again</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Case 4: Successfully Completed & Verified via Webhook
  const entitlement = getEntitlementByPurchaseId(purchase.id);
  const project = TWENTY_PROJECT_CONCEPTS.find(
    (p) => p.id === purchase.projectId || p.slug === purchase.projectSlug
  );

  const downloadUrl = entitlement
    ? `/api/plans/${entitlement.downloadToken}/download`
    : "#";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 space-y-6">
      {/* Top Confirmation Card */}
      <Card className="bg-white border-emerald-300 p-8 shadow-subtle text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>

        <Badge variant="outline" size="sm" className="bg-emerald-50 text-emerald-800 border-emerald-300 mx-auto">
          Verified Stripe Payment Confirmed
        </Badge>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
          Thank You! Your Plan Is Ready
        </h1>

        <p className="text-xs text-charcoal-600 max-w-md mx-auto leading-relaxed">
          Your one-time payment of <strong>$4.99 USD</strong> has been securely confirmed via
          cryptographic Stripe webhook verification. Your private printable PDF plan is unlocked.
        </p>

        {/* Download Action Area */}
        <div className="pt-4 pb-2">
          {entitlement ? (
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-2 px-6 py-3 rounded-editorial bg-terracotta-600 hover:bg-terracotta-700 text-white font-medium text-sm transition-colors shadow-subtle"
            >
              <Download className="h-4 w-4" />
              <span>Download Printable PDF Plan (v1.0.0)</span>
            </a>
          ) : (
            <p className="text-xs text-amber-700">Generating entitlement token...</p>
          )}
        </div>

        <p className="text-[11px] text-charcoal-500">
          Downloads Remaining: {entitlement ? entitlement.maxDownloads - entitlement.downloadCount : 10} of 10 • Valid for 30 days
        </p>
      </Card>

      {/* Plan Details & Security Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-white border-ceramic-300 p-5 space-y-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-charcoal-900">
            <Layers className="h-4 w-4 text-terracotta-600" />
            <span>Purchased Plan Specifications</span>
          </CardTitle>
          <div className="text-xs space-y-1.5 text-charcoal-700">
            <p><strong>Project:</strong> {project ? project.translations.en.title : purchase.projectSlug}</p>
            <p><strong>Plan Version:</strong> {purchase.planVersion}</p>
            <p><strong>Format:</strong> 3-Page Architectural US Letter / A4</p>
            <p><strong>Customer Receipt:</strong> {purchase.customerEmail}</p>
            <p className="font-mono text-[10px] text-charcoal-500 pt-1">
              Order ID: {purchase.id.substring(0, 16)}...
            </p>
          </div>
        </Card>

        <Card className="bg-white border-ceramic-300 p-5 space-y-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-charcoal-900">
            <ShieldCheck className="h-4 w-4 text-sage-600" />
            <span>Digital Protection & Duty of Care</span>
          </CardTitle>
          <div className="text-xs space-y-1.5 text-charcoal-700 leading-relaxed">
            <p>
              Your plan includes vector cutting blueprints, verified measurements, materials checklist,
              and OSHA / TCNA crystalline silica safety protocols.
            </p>
            <p className="text-[11px] text-charcoal-500 pt-1">
              Protected by server-side signed download tokens. Direct file URLs are never exposed.
            </p>
          </div>
        </Card>
      </div>

      {/* Navigation Return */}
      <div className="flex items-center justify-between text-xs pt-2">
        <Link
          href="/calculator"
          className="text-charcoal-600 hover:text-terracotta-600 transition-colors flex items-center gap-1"
        >
          <span>Calculate another leftover tile batch</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/projects"
          className="text-charcoal-600 hover:text-terracotta-600 transition-colors"
        >
          View all 20 DIY projects
        </Link>
      </div>
    </div>
  );
}
