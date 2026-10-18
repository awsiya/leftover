-- ============================================================================
-- Leftover Tile Project Planner — Phase 3 Seed Migration
-- Migration: 20261018000003_seed_20_projects.sql
-- Seeds: 20 clearly labelled project concepts across 5 categories.
-- Invariant: All concepts seeded as 'draft' or 'reviewing'. NONE as 'verified'.
-- ============================================================================

-- Map category slugs to fixed UUIDs
-- kitchen-dining:     c1111111-1111-1111-1111-111111111111
-- garden-outdoor:     c2222222-2222-2222-2222-222222222222
-- home-decor:         c3333333-3333-3333-3333-333333333333
-- furniture-upgrades: c4444444-4444-4444-4444-444444444444
-- functional-crafts:  c5555555-5555-5555-5555-555555555555

-- Seed Project 1: Mediterranean Mosaic Trivet
INSERT INTO public.projects (id, slug, category_id, difficulty, estimated_time_minutes, price_cents, verification_status, verification_notes, featured_image_url)
VALUES (
    'a0000001-0000-0000-0000-000000000001',
    'mediterranean-mosaic-trivet',
    'c1111111-1111-1111-1111-111111111111',
    'beginner',
    120,
    499,
    'reviewing',
    'CONCEPT - Prototype dimensions calculated. Physical heat-tolerance test with boiling kettle pending in workshop.',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
) ON CONFLICT (slug) DO UPDATE SET verification_status = 'reviewing';

INSERT INTO public.project_requirements (
    project_id, min_area_sq_mm, target_area_sq_mm, min_tile_count, recommended_tile_count,
    min_tile_length_mm, min_tile_width_mm, allowed_conditions, allowed_materials,
    requires_straight_cuts, requires_curved_cuts, is_outdoor_rated, is_wet_area_rated,
    allow_irregular_shards, grout_joint_width_mm, waste_safety_factor
) VALUES (
    'a0000001-0000-0000-0000-000000000001',
    41209, 45000, 2, 4, 0, 0,
    ARRAY['intact', 'mixed', 'broken_mosaic'], ARRAY['ceramic', 'porcelain', 'terracotta'],
    FALSE, FALSE, FALSE, TRUE, TRUE, 3.0, 0.25
) ON CONFLICT (project_id) DO NOTHING;

INSERT INTO public.project_translations (project_id, locale, title, subtitle, short_description, dimensions_summary, overview_html, meta_title, meta_description)
VALUES
    ('a0000001-0000-0000-0000-000000000001', 'en', 'Mediterranean Mosaic Kitchen Trivet [CONCEPT]', 'Heat-resistant dining trivet made from ceramic fragments and cork backing', 'Transform 2–4 cracked or surplus kitchen tiles into an artisanal, heat-shielding table trivet with cork underlayment.', '8" × 8" (20cm × 20cm)', '<p>A high-utility dining accessory utilizing shattered wall tile pieces.</p>', 'Mediterranean Mosaic Trivet DIY Plan | Leftover Tile Planner', 'Build a heatproof kitchen trivet using leftover ceramic tiles and cork.'),
    ('a0000001-0000-0000-0000-000000000001', 'de', 'Mediterraner Mosaik-Topfuntersetzer [KONZEPT]', 'Hitzebeständiger Untersetzer aus Fliesenbruch und Kork', 'Verwandeln Sie 2–4 übrig gebliebene Fliesen in einen hitzebeständigen Topfuntersetzer.', '20cm × 20cm', '<p>Praktisches Küchenzubehör aus bunten Fliesenresten.</p>', 'Mosaik-Topfuntersetzer DIY Bauplan', 'Hitzefester Untersetzer aus Restfliesen mit Korkunterlage.'),
    ('a0000001-0000-0000-0000-000000000001', 'fr', 'Dessous de Plat Mosaïque Méditerranéen [CONCEPT]', 'Dessous de plat résistant à la chaleur en céramique recyclée', 'Réutilisez vos chutes de carrelage en un dessous de plat esthétique et isolant.', '20cm × 20cm', '<p>Accessoire de cuisine élégant et thermique.</p>', 'Plan Dessous de Plat en Carrelage', 'Fabriquez un dessous de plat isolant en morceaux de céramique.'),
    ('a0000001-0000-0000-0000-000000000001', 'es', 'Salvamanteles Mosaico Mediterráneo [CONCEPTO]', 'Salvamanteles resistente al calor hecho con fragmentos de azulejo', 'Transforma azulejos sobrantes en un salvamanteles artesanal con base de corcho.', '20cm × 20cm', '<p>Accesorio culinario térmico fabricado con restos de alicatado.</p>', 'Plano DIY Salvamanteles de Azulejos', 'Salvamanteles térmico con restos de cerámica y base aislante.')
ON CONFLICT (project_id, locale) DO NOTHING;

-- Seed Project 2: Herringbone Plant Pedestal
INSERT INTO public.projects (id, slug, category_id, difficulty, estimated_time_minutes, price_cents, verification_status, verification_notes, featured_image_url)
VALUES (
    'a0000002-0000-0000-0000-000000000002',
    'geometric-herringbone-plant-pedestal',
    'c4444444-4444-4444-4444-444444444444',
    'intermediate',
    210,
    499,
    'draft',
    'CONCEPT - 45-degree angle cut sheet designed. Physical assembly with thinset pending workshop build.',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80'
) ON CONFLICT (slug) DO UPDATE SET verification_status = 'draft';

INSERT INTO public.project_requirements (
    project_id, min_area_sq_mm, target_area_sq_mm, min_tile_count, recommended_tile_count,
    min_tile_length_mm, min_tile_width_mm, allowed_conditions, allowed_materials,
    requires_straight_cuts, requires_curved_cuts, is_outdoor_rated, is_wet_area_rated,
    allow_irregular_shards, nominal_piece_length_mm, nominal_piece_width_mm, grout_joint_width_mm, waste_safety_factor
) VALUES (
    'a0000002-0000-0000-0000-000000000002',
    120000, 140000, 8, 12, 75, 50,
    ARRAY['intact'], ARRAY['ceramic', 'porcelain'],
    TRUE, FALSE, FALSE, FALSE, FALSE, 152.4, 76.2, 2.0, 0.10
) ON CONFLICT (project_id) DO NOTHING;

-- Seed Project 3: Weatherproof Stepping Stone
INSERT INTO public.projects (id, slug, category_id, difficulty, estimated_time_minutes, price_cents, verification_status, verification_notes, featured_image_url)
VALUES (
    'a0000003-0000-0000-0000-000000000003',
    'terracotta-garden-stepping-stones',
    'c2222222-2222-2222-2222-222222222222',
    'beginner',
    150,
    499,
    'reviewing',
    'CONCEPT - Silicone casting mold test completed. Freeze-thaw weather exposure verification cycle ongoing.',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
) ON CONFLICT (slug) DO UPDATE SET verification_status = 'reviewing';

INSERT INTO public.project_requirements (
    project_id, min_area_sq_mm, target_area_sq_mm, min_tile_count, recommended_tile_count,
    min_tile_length_mm, min_tile_width_mm, allowed_conditions, allowed_materials,
    requires_straight_cuts, requires_curved_cuts, is_outdoor_rated, is_wet_area_rated,
    allow_irregular_shards, grout_joint_width_mm, waste_safety_factor
) VALUES (
    'a0000003-0000-0000-0000-000000000003',
    73000, 85000, 5, 8, 0, 0,
    ARRAY['intact', 'mixed', 'broken_mosaic'], ARRAY['porcelain', 'terracotta', 'marble_natural_stone'],
    FALSE, FALSE, TRUE, TRUE, TRUE, 4.0, 0.25
) ON CONFLICT (project_id) DO NOTHING;

-- Seed Project 4: Artisan Checkerboard Coasters (4-Pack)
INSERT INTO public.projects (id, slug, category_id, difficulty, estimated_time_minutes, price_cents, verification_status, verification_notes, featured_image_url)
VALUES (
    'a0000004-0000-0000-0000-000000000004',
    'artisan-checkerboard-coasters',
    'c3333333-3333-3333-3333-333333333333',
    'beginner',
    90,
    499,
    'reviewing',
    'CONCEPT - Felt edge bonding test conducted. Abrasion resistance and condensation test documented.',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
) ON CONFLICT (slug) DO UPDATE SET verification_status = 'reviewing';

INSERT INTO public.project_requirements (
    project_id, min_area_sq_mm, target_area_sq_mm, min_tile_count, recommended_tile_count,
    min_tile_length_mm, min_tile_width_mm, allowed_conditions, allowed_materials,
    requires_straight_cuts, requires_curved_cuts, is_outdoor_rated, is_wet_area_rated,
    allow_irregular_shards, nominal_piece_length_mm, nominal_piece_width_mm, grout_joint_width_mm, waste_safety_factor
) VALUES (
    'a0000004-0000-0000-0000-000000000004',
    37000, 45000, 4, 4, 100, 100,
    ARRAY['intact'], ARRAY['ceramic', 'porcelain', 'marble_natural_stone'],
    FALSE, FALSE, FALSE, TRUE, FALSE, 101.6, 101.6, 0, 0.05
) ON CONFLICT (project_id) DO NOTHING;

-- Seed Projects 5 through 20 (All strictly in 'draft' or 'reviewing')
INSERT INTO public.projects (id, slug, category_id, difficulty, estimated_time_minutes, price_cents, verification_status, verification_notes, featured_image_url)
VALUES
    ('a0000005-0000-0000-0000-000000000005', 'mosaic-serving-tray', 'c1111111-1111-1111-1111-111111111111', 'intermediate', 180, 499, 'draft', 'CONCEPT - Hardwood rim deflection formula drafted. Physical load testing with 5kg weight pending in workshop.', 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80'),
    ('a0000006-0000-0000-0000-000000000006', 'framed-mosaic-wall-mirror', 'c3333333-3333-3333-3333-333333333333', 'advanced', 300, 499, 'draft', 'CONCEPT - Weight and mirror glass adhesive safety specs calculated. Full mounting test pending in workshop.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'),
    ('a0000007-0000-0000-0000-000000000007', 'bistro-table-tile-refresh', 'c4444444-4444-4444-4444-444444444444', 'advanced', 360, 499, 'draft', 'CONCEPT - Circular substrate edge sealing specifications drafted. Physical outdoor weather test pending.', 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=800&q=80'),
    ('a0000008-0000-0000-0000-000000000008', 'geometric-mosaic-wall-clock', 'c3333333-3333-3333-3333-333333333333', 'intermediate', 180, 499, 'draft', 'CONCEPT - Quartz movement arbor clearance specs calculated. Physical clock movement run test pending.', 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80'),
    ('a0000009-0000-0000-0000-000000000009', 'botanical-ceramic-herb-markers', 'c2222222-2222-2222-2222-222222222222', 'beginner', 75, 499, 'draft', 'CONCEPT - Waterproof marker durability test ongoing. Soil immersion test pending.', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'),
    ('a0000010-0000-0000-0000-000000000010', 'waterproof-bathroom-soap-dish', 'c5555555-5555-5555-5555-555555555555', 'beginner', 60, 499, 'draft', 'CONCEPT - Gravity drainage bevel angle calculated. Long-term soap scum resistance test pending.', 'https://images.unsplash.com/photo-1608248597359-5f72cf93b952?auto=format&fit=crop&w=800&q=80'),
    ('a0000011-0000-0000-0000-000000000011', 'mosaic-birdbath-basin', 'c2222222-2222-2222-2222-222222222222', 'advanced', 240, 499, 'draft', 'CONCEPT - Submerged water permeability calculations completed. 30-day submersion cure test pending.', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'),
    ('a0000012-0000-0000-0000-000000000012', 'cast-iron-handled-cheese-board', 'c1111111-1111-1111-1111-111111111111', 'intermediate', 120, 499, 'draft', 'CONCEPT - Food-safe epoxy sealant specifications drafted. Contact toxicity test pending.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80'),
    ('a0000013-0000-0000-0000-000000000013', 'terracotta-window-herb-planter', 'c2222222-2222-2222-2222-222222222222', 'intermediate', 180, 499, 'draft', 'CONCEPT - Drainage hole spacing calculated. Thermal expansion test pending.', 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=800&q=80'),
    ('a0000014-0000-0000-0000-000000000014', 'entryway-floating-key-hook-plaque', 'c3333333-3333-3333-3333-333333333333', 'beginner', 75, 499, 'draft', 'CONCEPT - Brass hook mounting load test drafted. Wall anchor pull test pending.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'),
    ('a0000015-0000-0000-0000-000000000015', 'heavy-ceramic-geometric-bookends', 'c5555555-5555-5555-5555-555555555555', 'intermediate', 150, 499, 'draft', 'CONCEPT - Center of gravity and book weight tipping calculations completed. Physical bookshelf load test pending.', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'),
    ('a0000016-0000-0000-0000-000000000016', 'minimalist-cube-candle-holders', 'c3333333-3333-3333-3333-333333333333', 'beginner', 90, 499, 'draft', 'CONCEPT - Flame heat transmission tests drafted. 4-hour tea light heat soak test pending in workshop.', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'),
    ('a0000017-0000-0000-0000-000000000017', 'mosaic-garden-stepping-log-pavers', 'c2222222-2222-2222-2222-222222222222', 'intermediate', 180, 499, 'draft', 'CONCEPT - Hexagonal mold casting specifications drafted. Ground load test pending.', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'),
    ('a0000018-0000-0000-0000-000000000018', 'rustic-wooden-bench-tile-inlay', 'c4444444-4444-4444-4444-444444444444', 'advanced', 240, 499, 'draft', 'CONCEPT - Bench seat deflection under dynamic human weight (150kg) calculated. Physical flex test pending.', 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80'),
    ('a0000019-0000-0000-0000-000000000019', 'heatproof-teapot-stand', 'c1111111-1111-1111-1111-111111111111', 'beginner', 75, 499, 'reviewing', 'CONCEPT - Hexagonal cut geometry verified. 100°C kettle base thermal contact test ongoing.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80'),
    ('a0000020-0000-0000-0000-000000000020', 'accent-tile-photo-frame', 'c3333333-3333-3333-3333-333333333333', 'beginner', 90, 499, 'draft', 'CONCEPT - Glass frame rebate clearance calculated. Physical frame assembly test pending.', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (slug) DO NOTHING;
