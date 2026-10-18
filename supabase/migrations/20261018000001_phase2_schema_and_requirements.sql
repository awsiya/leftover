-- ============================================================================
-- Leftover Tile Project Planner — Phase 2 Database Schema Migration
-- Migration: 20261018000001_phase2_schema_and_requirements.sql
-- Covers: Categories, Projects, Project Requirements, Localized Content,
--         Project Plan Versions, Tools, Materials, Articles, and RLS.
-- ============================================================================

-- 1. Create Enumerations
CREATE TYPE public.project_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.verification_status AS ENUM ('draft', 'reviewing', 'verified', 'archived');
CREATE TYPE public.tile_condition_type AS ENUM ('intact', 'mixed', 'broken_mosaic');
CREATE TYPE public.tile_material_enum AS ENUM ('ceramic', 'porcelain', 'terracotta', 'marble_natural_stone', 'glass');
CREATE TYPE public.payment_status_enum AS ENUM ('pending', 'completed', 'refunded', 'disputed');

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(128) UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
    difficulty public.project_difficulty NOT NULL DEFAULT 'beginner',
    estimated_time_minutes INT NOT NULL CHECK (estimated_time_minutes > 0),
    price_cents INT NOT NULL DEFAULT 499 CHECK (price_cents >= 0),
    verification_status public.verification_status NOT NULL DEFAULT 'draft',
    verified_at TIMESTAMPTZ,
    verified_by UUID,
    active_plan_version_id UUID,
    featured_image_url VARCHAR(512),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(verification_status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);

-- 4. Project Requirements Table (Deterministic Matching Specifications)
CREATE TABLE IF NOT EXISTS public.project_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL UNIQUE,
    min_area_sq_mm INT NOT NULL CHECK (min_area_sq_mm > 0),
    target_area_sq_mm INT NOT NULL CHECK (target_area_sq_mm >= min_area_sq_mm),
    min_tile_count INT NOT NULL CHECK (min_tile_count > 0),
    recommended_tile_count INT NOT NULL CHECK (recommended_tile_count >= min_tile_count),
    min_tile_length_mm NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (min_tile_length_mm >= 0),
    max_tile_length_mm NUMERIC(8,2),
    min_tile_width_mm NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (min_tile_width_mm >= 0),
    max_tile_width_mm NUMERIC(8,2),
    min_tile_thickness_mm NUMERIC(6,2) DEFAULT 3.0,
    max_tile_thickness_mm NUMERIC(6,2) DEFAULT 20.0,
    allowed_conditions VARCHAR(32)[] NOT NULL DEFAULT ARRAY['intact'],
    allowed_materials VARCHAR(64)[] NOT NULL DEFAULT ARRAY['ceramic', 'porcelain', 'terracotta'],
    requires_straight_cuts BOOLEAN NOT NULL DEFAULT FALSE,
    requires_curved_cuts BOOLEAN NOT NULL DEFAULT FALSE,
    is_outdoor_rated BOOLEAN NOT NULL DEFAULT FALSE,
    is_wet_area_rated BOOLEAN NOT NULL DEFAULT FALSE,
    allow_irregular_shards BOOLEAN NOT NULL DEFAULT FALSE,
    nominal_piece_length_mm NUMERIC(8,2),
    nominal_piece_width_mm NUMERIC(8,2),
    grout_joint_width_mm NUMERIC(4,2) NOT NULL DEFAULT 2.5,
    waste_safety_factor NUMERIC(4,2) NOT NULL DEFAULT 0.10,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_req_project ON public.project_requirements(project_id);
CREATE INDEX IF NOT EXISTS idx_req_area ON public.project_requirements(min_area_sq_mm);

-- 5. Project Plan Versions (Versioned Architectural PDF Storage & Integrity)
CREATE TABLE IF NOT EXISTS public.project_plan_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    version_number INT NOT NULL CHECK (version_number > 0),
    version_label VARCHAR(32) NOT NULL DEFAULT 'v1.0',
    storage_path VARCHAR(512) NOT NULL,
    file_size_bytes INT NOT NULL CHECK (file_size_bytes > 0),
    sha256_checksum VARCHAR(64) NOT NULL,
    page_count INT NOT NULL CHECK (page_count > 0),
    changelog TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (project_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_plan_versions_project ON public.project_plan_versions(project_id, is_active);

-- Circular foreign key reference for active plan version
ALTER TABLE public.projects
    DROP CONSTRAINT IF EXISTS fk_projects_active_version;
ALTER TABLE public.projects
    ADD CONSTRAINT fk_projects_active_version
    FOREIGN KEY (active_plan_version_id)
    REFERENCES public.project_plan_versions(id)
    ON DELETE SET NULL;

-- 6. Localized Project Content (Translations)
CREATE TABLE IF NOT EXISTS public.project_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    locale VARCHAR(8) NOT NULL CHECK (locale IN ('en', 'de', 'fr', 'es')),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500) NOT NULL,
    short_description TEXT NOT NULL,
    dimensions_summary VARCHAR(128) NOT NULL,
    overview_html TEXT NOT NULL,
    safety_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    instructions_summary JSONB NOT NULL DEFAULT '[]'::jsonb,
    meta_title VARCHAR(120) NOT NULL,
    meta_description VARCHAR(160) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (project_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_project_trans_locale ON public.project_translations(locale, project_id);

-- 7. Tools & Materials Specs
CREATE TABLE IF NOT EXISTS public.tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    is_optional BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.project_tools (
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (project_id, tool_id)
);

CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    unit VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.project_materials (
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE NOT NULL,
    quantity_estimate VARCHAR(64) NOT NULL,
    PRIMARY KEY (project_id, material_id)
);

-- 8. Articles & Localized Article Content
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(128) UNIQUE NOT NULL,
    author_name VARCHAR(128) NOT NULL DEFAULT 'Leftover Tile Editorial Team',
    reading_time_minutes INT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    featured_image_url VARCHAR(512),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.article_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
    locale VARCHAR(8) NOT NULL CHECK (locale IN ('en', 'de', 'fr', 'es')),
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    meta_title VARCHAR(120) NOT NULL,
    meta_description VARCHAR(160) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (article_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_article_trans_lookup ON public.article_translations(locale, article_id);

-- 9. Enable Row Level Security (RLS) on All Tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_plan_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_translations ENABLE ROW LEVEL SECURITY;

-- 10. Public RLS Read Policies (Verified Content Only)
CREATE POLICY "Public read verified projects"
    ON public.projects FOR SELECT
    USING (verification_status = 'verified');

CREATE POLICY "Public read requirements for verified projects"
    ON public.project_requirements FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = project_requirements.project_id
        AND projects.verification_status = 'verified'
    ));

CREATE POLICY "Public read active plan version metadata"
    ON public.project_plan_versions FOR SELECT
    USING (is_active = TRUE AND EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = project_plan_versions.project_id
        AND projects.verification_status = 'verified'
    ));

CREATE POLICY "Public read verified project translations"
    ON public.project_translations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = project_translations.project_id
        AND projects.verification_status = 'verified'
    ));

CREATE POLICY "Public read published articles"
    ON public.articles FOR SELECT
    USING (is_published = TRUE);

CREATE POLICY "Public read published article translations"
    ON public.article_translations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.articles
        WHERE articles.id = article_translations.article_id
        AND articles.is_published = TRUE
    ));
