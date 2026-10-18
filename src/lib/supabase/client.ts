import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * Creates a browser-safe Supabase client using public credentials.
 * This client respects PostgreSQL Row Level Security (RLS).
 * It NEVER has access to the service role key.
 */
export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
