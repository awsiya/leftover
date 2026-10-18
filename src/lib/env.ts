import { z } from "zod";

/**
 * Public client-side environment variable schema.
 * All public variables MUST be prefixed with NEXT_PUBLIC_.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
    .default("https://placeholder-project.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY cannot be empty")
    .default("placeholder-anon-key"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .optional(),
});

/**
 * Server-only environment variable schema.
 * These variables are NEVER exposed to the browser bundle.
 */
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY cannot be empty")
    .optional(),
  STRIPE_SECRET_KEY: z
    .string()
    .optional(),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .optional(),
  DATABASE_URL: z
    .string()
    .optional(),
  DIRECT_URL: z
    .string()
    .optional(),
  RESEND_API_KEY: z
    .string()
    .optional(),
  RESEND_FROM_EMAIL: z
    .string()
    .default("Leftover Tile Planner <leftover@4dev.in>"),
  ADMIN_EMAIL: z
    .string()
    .email()
    .optional()
    .default("admin@4dev.in"),
});

/**
 * Safe error formatter that identifies missing variables WITHOUT printing secret values.
 */
function formatEnvErrors(errors: z.ZodError): string {
  const missingKeys = errors.issues.map((issue) => {
    return `  - ${issue.path.join(".")}: ${issue.message}`;
  });
  return [
    "❌ Invalid or missing environment variables detected:",
    ...missingKeys,
    "",
    "💡 Please check your .env.local file. Refer to .env.example for required settings.",
    "   Do NOT commit live secret keys to version control.",
  ].join("\n");
}

function parsePublicEnv() {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  });

  if (!result.success) {
    const message = formatEnvErrors(result.error);
    console.error(message);
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid public environment configuration.");
    }
  }

  return result.success ? result.data : publicEnvSchema.parse({});
}

function parseServerEnv(): Partial<z.infer<typeof serverEnvSchema>> {
  // Only evaluate on server-side
  if (typeof window !== "undefined") {
    return {};
  }

  const result = serverEnvSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  });

  if (!result.success) {
    const message = formatEnvErrors(result.error);
    console.error(message);
  }

  return result.success ? result.data : {};
}

export const env = {
  ...parsePublicEnv(),
  ...parseServerEnv(),
} as const;

/**
 * Helper to ensure server-side caller only uses server secrets when configured.
 */
export function requireServerSecret(
  key: "SUPABASE_SERVICE_ROLE_KEY" | "STRIPE_SECRET_KEY" | "STRIPE_WEBHOOK_SECRET" | "DATABASE_URL" | "DIRECT_URL" | "RESEND_API_KEY"
): string {
  if (typeof window !== "undefined") {
    throw new Error(`CRITICAL SECURITY VIOLATION: Attempted to access server secret "${key}" in browser client.`);
  }

  const val = process.env[key];
  if (!val || val.trim() === "" || val.includes("placeholder")) {
    throw new Error(`Missing required server secret: ${key}. Please configure this in .env.local or your production host.`);
  }

  return val;
}
