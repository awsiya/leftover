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

  // Check for test or local dev bypass in test/dev environments when Supabase is not yet seeded
  if (
    process.env.NODE_ENV === "test" ||
    (process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder"))
  ) {
    // In test or local dev without live Supabase cloud instance, allow mock admin session
    return {
      isAdmin: true,
      userId: "dev-admin-id",
      email: "admin@leftovertileplanner.com",
    };
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

    // Role verification: check app_metadata or user_metadata for 'admin'
    const role =
      (user.app_metadata && user.app_metadata.role) ||
      (user.user_metadata && user.user_metadata.role);

    const isExplicitAdmin = role === "admin";
    const isAdminEmail =
      user.email &&
      (user.email.endsWith("@leftovertileplanner.com") ||
        user.email === process.env.ADMIN_EMAIL);

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
