-- ============================================================================
-- Leftover Tile Project Planner — Phase 7 Hardening Migration
-- Migration: 20261018000004_purchases_tokens_and_security.sql
-- Covers: Purchases table, Download tokens table, Row Level Security,
--         and Admin policies for articles & article_translations.
-- ============================================================================

-- 1. Purchases Table (Commerce Orders & Entitlements)
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id VARCHAR(64) NOT NULL,
    project_slug VARCHAR(128) NOT NULL,
    plan_version VARCHAR(32) NOT NULL DEFAULT 'v1.0.0',
    customer_email VARCHAR(255) NOT NULL,
    amount_cents INT NOT NULL DEFAULT 499 CHECK (amount_cents > 0),
    currency VARCHAR(16) NOT NULL DEFAULT 'usd',
    stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded', 'failed', 'disputed')),
    customer_country VARCHAR(8),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON public.purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_purchases_customer_email ON public.purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(status);

-- 2. Download Tokens Table (Protected Plan PDF Access Control)
CREATE TABLE IF NOT EXISTS public.download_tokens (
    token VARCHAR(64) PRIMARY KEY,
    purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE,
    project_id VARCHAR(64) NOT NULL,
    project_slug VARCHAR(128) NOT NULL,
    plan_version VARCHAR(32) NOT NULL DEFAULT 'v1.0.0',
    customer_email VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    access_count INT NOT NULL DEFAULT 0 CHECK (access_count >= 0),
    max_access_count INT NOT NULL DEFAULT 10 CHECK (max_access_count > 0),
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_reason VARCHAR(255),
    last_accessed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_download_tokens_purchase ON public.download_tokens(purchase_id);
CREATE INDEX IF NOT EXISTS idx_download_tokens_expiry ON public.download_tokens(expires_at, is_revoked);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_tokens ENABLE ROW LEVEL SECURITY;

-- 4. Purchases RLS Policies
-- Service Role has unrestricted CRUD for server-side webhook processing
DROP POLICY IF EXISTS "Service role full access on purchases" ON public.purchases;
CREATE POLICY "Service role full access on purchases"
    ON public.purchases
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Admins with verified app_metadata role have full read/write
DROP POLICY IF EXISTS "Admins full access on purchases" ON public.purchases;
CREATE POLICY "Admins full access on purchases"
    ON public.purchases
    FOR ALL
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR
        auth.role() = 'service_role'
    )
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR
        auth.role() = 'service_role'
    );

-- Customers can only read their own purchase history
DROP POLICY IF EXISTS "Customers view own purchases" ON public.purchases;
CREATE POLICY "Customers view own purchases"
    ON public.purchases
    FOR SELECT
    USING (
        auth.jwt() ->> 'email' = customer_email
    );

-- 5. Download Tokens RLS Policies
-- Service Role has unrestricted CRUD for token issuance & validation
DROP POLICY IF EXISTS "Service role full access on download_tokens" ON public.download_tokens;
CREATE POLICY "Service role full access on download_tokens"
    ON public.download_tokens
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Admins can view and manage tokens
DROP POLICY IF EXISTS "Admins full access on download_tokens" ON public.download_tokens;
CREATE POLICY "Admins full access on download_tokens"
    ON public.download_tokens
    FOR ALL
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR
        auth.role() = 'service_role'
    )
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR
        auth.role() = 'service_role'
    );

-- Direct client read/write on download_tokens is blocked by default

-- 6. Admin CRUD Policies for Articles and Article Translations (Addressing Phase 3 Defect)
DROP POLICY IF EXISTS "Admins full access on articles" ON public.articles;
CREATE POLICY "Admins full access on articles"
    ON public.articles
    FOR ALL
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR
        (auth.jwt() ->> 'role' = 'admin') OR
        auth.role() = 'service_role'
    )
    WITH CHECK (
        (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR
        (auth.jwt() ->> 'role' = 'admin') OR
        auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Admins full access on article_translations" ON public.article_translations;
CREATE POLICY "Admins full access on article_translations"
    ON public.article_translations
    FOR ALL
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin') OR
        (auth.jwt() ->> 'role' = 'admin') OR
        auth.role() = 'service_role'
    );
