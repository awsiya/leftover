import Stripe from "stripe";

// Singleton instance cache
let stripeInstance: Stripe | null = null;

/**
 * Returns the server-side Stripe client initialized with STRIPE_SECRET_KEY.
 * Strictly prevents usage in browser client bundles.
 */
export function getStripeClient(): Stripe {
  if (typeof window !== "undefined") {
    throw new Error(
      "CRITICAL SECURITY VIOLATION: Attempted to access Stripe server client in browser environment."
    );
  }

  if (stripeInstance) {
    return stripeInstance;
  }

  const secretKey =
    process.env.STRIPE_SECRET_KEY ||
    (process.env.NODE_ENV === "test" ? "sk_test_mock_secret_key_12345" : undefined);

  if (!secretKey) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY environment variable. Please configure it in .env.local."
    );
  }

  stripeInstance = new Stripe(secretKey, {
    apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
    appInfo: {
      name: "Leftover Tile Project Planner",
      version: "0.1.0",
      url: "https://leftovertileplanner.com",
    },
    typescript: true,
  });

  return stripeInstance;
}
