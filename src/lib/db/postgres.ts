import { Pool, QueryResult, QueryResultRow } from "pg";

let pool: Pool | null = null;

/**
 * Returns a singleton pg.Pool connected to Supabase PostgreSQL.
 * Uses DATABASE_URL (Port 6543 PgBouncer) or DIRECT_URL (Port 5432).
 */
export function getDbPool(): Pool | null {
  if (pool) return pool;

  const connectionString =
    process.env.DATABASE_URL ||
    process.env.DIRECT_URL ||
    (typeof process !== "undefined" && process.env ? process.env.DATABASE_URL : undefined);

  if (!connectionString || connectionString.includes("[YOUR-PASSWORD]") || connectionString.includes("placeholder")) {
    return null;
  }

  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on("error", (err) => {
    console.error("[PostgreSQL Pool Error]", err.message);
  });

  return pool;
}

/**
 * Executes a parameterized SQL query against the Supabase database.
 */
export async function dbQuery<R extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<R> | null> {
  const p = getDbPool();
  if (!p) return null;

  try {
    return await p.query<R>(text, params);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown db query error";
    console.warn(`[Supabase PostgreSQL Query Warning]`, message);
    return null;
  }
}

/**
 * Persists a verified purchase and its associated download token to the live Supabase database.
 */
export async function syncPurchaseToDatabase(params: {
  purchaseId: string;
  projectId: string;
  projectSlug: string;
  planVersion: string;
  customerEmail: string;
  amountCents: number;
  currency: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
  status: string;
  downloadToken?: string;
  expiresAt?: string;
}): Promise<boolean> {
  const p = getDbPool();
  if (!p) return false;

  const client = await p.connect();
  try {
    await client.query("BEGIN;");

    // 1. Insert or update purchase record
    await client.query(
      `
      INSERT INTO public.purchases (
        id, project_id, project_slug, plan_version, customer_email,
        amount_cents, currency, stripe_session_id, stripe_payment_intent_id,
        status, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (stripe_session_id) DO UPDATE SET
        status = EXCLUDED.status,
        stripe_payment_intent_id = EXCLUDED.stripe_payment_intent_id,
        updated_at = NOW();
      `,
      [
        params.purchaseId,
        params.projectId,
        params.projectSlug,
        params.planVersion,
        params.customerEmail,
        params.amountCents,
        params.currency,
        params.stripeSessionId,
        params.stripePaymentIntentId || null,
        params.status,
      ]
    );

    // 2. Insert download token if provided
    if (params.downloadToken) {
      const expiresAt = params.expiresAt || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
      await client.query(
        `
        INSERT INTO public.download_tokens (
          token, purchase_id, project_id, project_slug,
          plan_version, customer_email, expires_at, max_access_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (token) DO NOTHING;
        `,
        [
          params.downloadToken,
          params.purchaseId,
          params.projectId,
          params.projectSlug,
          params.planVersion,
          params.customerEmail,
          expiresAt,
          10,
        ]
      );
    }

    await client.query("COMMIT;");
    console.log(`[Supabase PostgreSQL] Persisted purchase ${params.purchaseId} to remote database.`);
    return true;
  } catch (err: unknown) {
    await client.query("ROLLBACK;");
    const message = err instanceof Error ? err.message : "Database sync failed";
    console.warn(`[Supabase PostgreSQL Sync Warning]`, message);
    return false;
  } finally {
    client.release();
  }
}
