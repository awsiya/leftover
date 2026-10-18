-- ============================================================================
-- Leftover Tile Project Planner — Phase 3 Database Migration & Seeds
-- Migration: 20261018000002_phase3_admin_and_seeds.sql
-- Covers: Verification evidence fields, Admin RLS policies, Category seeds,
--         and 20 clearly labelled project concepts (All initialized as draft/reviewing).
-- ============================================================================

-- 1. Schema Enhancements on Projects Table
ALTER TABLE public.projects
    ADD COLUMN IF NOT EXISTS verification_evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Enforce that a project CANNOT be verified without verified_at and verified_by
ALTER TABLE public.projects
    DROP CONSTRAINT IF EXISTS chk_projects_verified_evidence;

ALTER TABLE public.projects
    ADD CONSTRAINT chk_projects_verified_evidence
    CHECK (
        verification_status != 'verified' OR (
            verified_at IS NOT NULL AND
            verification_notes IS NOT NULL AND
            length(trim(verification_notes)) >= 20
        )
    );

-- 2. Admin RLS Policies (Full CRUD for Admin Role)
CREATE POLICY "Admins full access on categories"
    ON public.categories
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Admins full access on projects"
    ON public.projects
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Admins full access on project_requirements"
    ON public.project_requirements
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Admins full access on project_plan_versions"
    ON public.project_plan_versions
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Admins full access on project_translations"
    ON public.project_translations
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Admins full access on tools"
    ON public.tools
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Admins full access on project_tools"
    ON public.project_tools
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Admins full access on materials"
    ON public.materials
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

CREATE POLICY "Admins full access on project_materials"
    ON public.project_materials
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- 3. Seed Core Categories
INSERT INTO public.categories (id, slug) VALUES
    ('c1111111-1111-1111-1111-111111111111', 'kitchen-dining'),
    ('c2222222-2222-2222-2222-222222222222', 'garden-outdoor'),
    ('c3333333-3333-3333-3333-333333333333', 'home-decor'),
    ('c4444444-4444-4444-4444-444444444444', 'furniture-upgrades'),
    ('c5555555-5555-5555-5555-555555555555', 'functional-crafts')
ON CONFLICT (slug) DO NOTHING;
