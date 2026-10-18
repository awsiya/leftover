import { createClient } from "@supabase/supabase-js";
import { env, requireServerSecret } from "@/lib/env";

/**
 * Creates an elevated administrative Supabase client using the Service Role Key.
 *
 * CRITICAL SECURITY CONSTRAINTS:
 * 1. MUST NEVER BE CALLED ON THE CLIENT BROWSER.
 * 2. Bypasses Row Level Security (RLS).
 * 3. Use strictly for:
 *    - Stripe webhook fulfillment (inserting verified purchases).
 *    - Generating short-lived signed URLs for paid PDF downloads.
 *    - Internal administrative batch migrations.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY EXCEPTION: createAdminClient() was executed in a client environment. This is prohibited."
    );
  }

  const serviceRoleKey = requireServerSecret("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
