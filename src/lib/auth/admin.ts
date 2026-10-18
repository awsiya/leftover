import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface AdminAuthResult {
  isAdmin: boolean;
  userId: string | null;
  email: string | null;
  error?: string;
}

/**
 * Server-side authorization check for administrative operations.
 * Validates that the active session has an authenticated user with 'admin' role.
 */
export async function verifyAdminSession(): Promise<AdminAuthResult> {
  // Allow explicit mock override in test suites
  if (process.env.MOCK_UNAUTHENTICATED === "true") {
    return {
      isAdmin: false,
      userId: null,
      email: null,
      error: "Unauthenticated: No active session found.",
    };
  }

  // Check for test or local dev mock in non-production environments when Supabase is not configured
  if (process.env.NODE_ENV !== "production") {
    if (
      process.env.NODE_ENV === "test" ||
      (process.env.NODE_ENV === "development" &&
        process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder"))
    ) {
      return {
        isAdmin: true,
        userId: "dev-admin-id",
        email: "admin@leftovertileplanner.com",
      };
    }
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        isAdmin: false,
        userId: null,
        email: null,
        error: "Unauthenticated: No active session found.",
      };
    }

    // Strict Role verification: check app_metadata ONLY for 'admin'
    // CRITICAL SECURITY FIX: user_metadata is user-writable via client SDK and MUST NOT be trusted.
    const role = user.app_metadata && user.app_metadata.role;
    const isExplicitAdmin = role === "admin";

    // Strict admin email verification against explicit server environment variable
    const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const isAdminEmail = Boolean(
      configuredAdminEmail &&
        user.email &&
        user.email.trim().toLowerCase() === configuredAdminEmail
    );

    if (!isExplicitAdmin && !isAdminEmail) {
      return {
        isAdmin: false,
        userId: user.id,
        email: user.email || null,
        error: "Forbidden: User does not possess administrative privileges.",
      };
    }

    return {
      isAdmin: true,
      userId: user.id,
      email: user.email || null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication verification failed";
    return {
      isAdmin: false,
      userId: null,
      email: null,
      error: message,
    };
  }
}

/**
 * Asserts admin privileges or throws an Error.
 * Use inside Server Actions and Route Handlers.
 */
export async function requireAdmin(): Promise<{ userId: string; email: string }> {
  const result = await verifyAdminSession();
  if (!result.isAdmin || !result.userId) {
    throw new Error(result.error || "Administrative authorization required.");
  }
  return {
    userId: result.userId,
    email: result.email || "",
  };
}
