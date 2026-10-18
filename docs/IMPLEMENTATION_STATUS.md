# Leftover Tile Project Planner — Implementation Status

## 1. Project Phase Tracker

| Phase | Description | Status | Completion Target |
| :--- | :--- | :---: | :--- |
| **Phase 1** | **Architecture, Foundation & Design System** | **COMPLETED** | Initial foundation milestone |
| **Phase 2** | **Deterministic Matching Engine & Schema Design** | **COMPLETED** | Core algorithmic engine milestone |
| **Phase 3** | **Admin Auth, 20 Seeded Projects, CRUD & Verification Commerce Guards** | **COMPLETED** | Content catalog & safety gating milestone |
| **Phase 4** | **Printable PDF Pipeline, Versioned Snapshots, Vector Diagrams & Protected Downloads** | **COMPLETED** | Document generation & asset protection milestone |
| **Phase 5** | **Stripe Checkout, Webhook Verification, Idempotent Fulfillment & Entitlement Revocation** | **COMPLETED** | Payment lifecycle & commerce security milestone |
| **Phase 6** | **Multilingual Routing (EN/DE/FR/ES), 15 Original SEO Articles, Localization & Dynamic Sitemaps** | **COMPLETED** | Content discovery, editorial authority & global SEO milestone |
| **Phase 7** | Production Hardening, Audit & Vercel Deployment | Queued | Final release |

---

## 2. Phase 2 Deliverables Checklist

### Supabase Database & Migrations
- [x] Schema migration created (`supabase/migrations/20261018000001_phase2_schema_and_requirements.sql`).
- [x] TypeScript database definitions updated (`src/lib/types/database.ts`).
- [x] Database documentation updated (`docs/DATABASE_DESIGN.md`).

### Deterministic Matching Engine
- [x] Precision unit converter (`src/lib/matching/converter.ts`).
- [x] Input validation & normalization (`src/lib/matching/validator.ts`).
- [x] Feasibility and rule evaluation engine (`src/lib/matching/rules.ts`).
- [x] Engine coordinator (`src/lib/matching/engine.ts`).
- [x] Project requirements catalog (`src/lib/matching/catalog.ts`).
- [x] Interactive UI Integration (`src/components/calculator/TileMatchingWizard.tsx`).

---

## 3. Phase 3 Deliverables Checklist

### Secure Admin Access & Authorization
- [x] Server-side authorization check (`src/lib/auth/admin.ts`).
- [x] Protected layout (`src/app/admin/layout.tsx`).
- [x] Admin login portal (`src/app/admin/login/page.tsx`).
- [x] Supabase Migration for Admin & Verification Constraints (`supabase/migrations/20261018000002_phase3_admin_and_seeds.sql`).

### 20 Curated Project Concepts Seeded
- [x] Seed data file (`src/lib/data/seededProjects.ts`):
  - 20 authentic project concepts across 5 categories.
  - Zero projects marked 'verified' without evidence.
  - Fixed pricing constraint: All plans fixed at 499 cents ($4.99 USD).
  - Multilingual translations for English, German, French, and Spanish metadata.
  - SQL seed migration created (`supabase/migrations/20261018000003_seed_20_projects.sql`).

### Admin Project CRUD & Physical Verification Screens
- [x] Admin dashboard (`src/app/admin/page.tsx`).
- [x] Project editor and audit form (`src/components/admin/ProjectEditorForm.tsx`).
- [x] Project edit route (`src/app/admin/projects/[id]/page.tsx`).

### Commerce Safety Guard & Server Actions
- [x] Commerce safety guard (`src/lib/types/verification.ts`).
- [x] Server actions (`src/lib/actions/adminProjects.ts`).

---

## 4. Phase 4 Deliverables Checklist

### Immutable Plan Versioning & Snapshot Registry
- [x] Versioned snapshot data types (`src/lib/types/planVersion.ts`).
- [x] Version snapshot engine & frozen registry (`src/lib/pdf/versionStore.ts`):
  - Cryptographic SHA-256 checksum generation guaranteeing tamper detection.
  - Frozen `v1.0.0` snapshots for all 20 projects.

### Vector Architectural Diagram Rendering
- [x] Dedicated vector diagram engine (`src/lib/pdf/diagramRenderer.ts`):
  - `drawCuttingLayoutDiagram`: Top-down cutting blueprint with saw kerf and dimension callouts.
  - `drawCrossSectionDiagram`: Structural cross-section with substrate, mortar bed, tile, and grout joint callouts.

### Publication-Quality Printable PDF Generator
- [x] High-resolution printable PDF generator (`src/lib/pdf/generator.ts`):
  - 3-page US Letter / A4 architectural formatting using `pdf-lib`.
  - Measurements table, materials & tools checklists, numbered steps, TCNA/OSHA safety protocols, anti-tamper seal.

### Protected Download Security & API Pipeline
- [x] Token management pipeline (`src/lib/pdf/downloadProtection.ts`).
- [x] Protected download API endpoint (`src/app/api/plans/[token]/download/route.ts`).
- [x] Admin preview integration (`src/lib/actions/planDownloadActions.ts`).
- [x] Admin UI Integration (`src/components/admin/ProjectEditorForm.tsx`).

---

## 5. Phase 5 Deliverables Checklist

### Stripe Client & Server-Side Checkout Sessions
- [x] Official Stripe SDK integration (`src/lib/stripe/client.ts`):
  - Server-only singleton blocking browser runtime usage.
  - Test mode support with fallback configuration.
- [x] Server-side checkout session creation (`src/lib/stripe/checkout.ts`, `src/app/api/checkout/route.ts`):
  - **Fixed Pricing Invariant**: Prices strictly determined server-side from database / live project store (499 cents / $4.99 USD). Client-supplied prices are strictly ignored.
  - **Physical Verification Commerce Guard**: `assertProjectCanBeSold()` strictly prevents creating checkout sessions for unverified (`draft`/`reviewing`) plans, throwing a security exception.

### Cryptographic Webhook Verification & Idempotent Fulfillment
- [x] Webhook route handler (`src/app/api/webhooks/stripe/route.ts`):
  - Cryptographic signature check via `stripe.webhooks.constructEvent()` against raw request body and `STRIPE_WEBHOOK_SECRET`.
  - Rejects unsigned or forged payloads with `HTTP 400 Bad Request`.
  - Handles `checkout.session.completed`, `payment_intent.payment_failed`, `charge.refunded`, and `charge.dispute.created`.
- [x] Idempotent order & entitlement registry (`src/lib/stripe/orderStore.ts`):
  - `fulfillPurchaseOrder()`: Issues 30-day download token and entitlement on `checkout.session.completed`.
  - Safe duplicate delivery handling: Re-delivery of identical webhook events returns `alreadyProcessed: true` and preserves original tokens without duplication.
  - `markPurchaseFailed()`: Records failed payment attempts without issuing download tokens.

### Customer Checkout Success, Cancellation & Revocation Policy
- [x] Customer checkout success page (`src/app/checkout/success/page.tsx`):
  - **Zero Trust in Browser Redirects**: Queries server-side order store by `session_id`; never serves plans based on URL parameters alone.
  - Awaiting confirmation state: Guides customers while background webhooks complete.
  - Confirmed state: Displays verified badge, project details, order ID, and authorized download button.
  - Handles refunded orders by notifying user that entitlement was revoked.
- [x] Customer checkout cancellation page (`src/app/checkout/cancel/page.tsx`):
  - Informs customer that no charge was made, providing return paths to project details, calculator, or catalog.
- [x] Refund & chargeback dispute revocation policy:
  - `processPurchaseRefund()` immediately marks entitlement `isRevoked: true` and invalidates the download token via `revokeDownloadToken()`.
  - Subsequent download requests with revoked tokens fail with `HTTP 403 Forbidden`.

---

## 6. Phase 6 Deliverables Checklist

### Multilingual Internationalization (i18n) Framework
- [x] Core i18n configuration (`src/lib/i18n/config.ts`):
  - Supported locales: English (`en`), German (`de`), French (`fr`), and Spanish (`es`).
  - Default locale: `en` (clean URL routing without prefix, e.g. `/projects`).
  - **Editorial Transparency Disclosures (`LOCALE_DISCLOSURES`)**: Clear disclaimer on German, French, and Spanish pages clarifying translation origins and affirming TCNA/ANSI standards, strictly complying with the instruction: *"Do not invent translations or claim native editorial review has happened."*
- [x] Localized Navigation (`src/lib/i18n/navigation.ts`):
  - Comprehensive translations for headers, footers, brand taglines, and call-to-actions across all 4 locales.
- [x] SEO Metadata & Hreflang Engine (`src/lib/i18n/metadata.ts`):
  - `normalizePath()` and `buildLocalizedPath()` ensuring clean canonical paths.
  - `buildCanonicalAndHreflang()` generating exact Google SEO-compliant canonical URLs, language alternate links (`en`, `de`, `fr`, `es`), and `x-default` targeting default English paths.
  - `createLocalizedMetadata()` providing complete OpenGraph and Twitter cards per locale.
- [x] Interactive UI Components:
  - Accessible `LanguageSwitcher` (`src/components/layout/LanguageSwitcher.tsx`) in both Header and Footer.
  - Persistent `EditorialDisclosureBanner` (`src/components/layout/EditorialDisclosureBanner.tsx`) prominently displayed on non-English routes.

### 15 Original Technical SEO English Articles (1,600–1,800 Words Each)
- [x] Strict word-count compliance verified programmatically ($1,600 \le \text{wordCount} \le 1,800$):
  1. `art-01`: Safe Tile Cutting at Home: OSHA Silica Dust Suppression (1,797 words)
  2. `art-02`: Ceramic vs. Porcelain vs. Terracotta: Water Absorption & Porosity (1,743 words)
  3. `art-03`: Mastering Mosaic Fractures: Trencadís Scoring & Shard Layouts (1,707 words)
  4. `art-04`: Adhesive Chemistry: Polymer-Modified Thinset vs. Type 1 Mastic (1,630 words)
  5. `art-05`: Grout Selection & Compressive Strength: Sanded, Unsanded, & Epoxy (1,726 words)
  6. `art-06`: How to Seal Porous Tile & Grout: Penetrating vs. Topical Chemistry (1,643 words)
  7. `art-07`: Continuous Rim Diamond Blades: Kerf Allowance & Thermal Dressing (1,639 words)
  8. `art-08`: Outdoor Tile Projects: Freeze-Thaw Durability & Thermal Expansion (1,691 words)
  9. `art-09`: Substrate Preparation: Cement Backer Board vs. Exterior Plywood (1,613 words)
  10. `art-10`: Drilling Precision Holes in Vitrified Porcelain Without Fractures (1,606 words)
  11. `art-11`: Salvaging & Restoring Vintage Architectural Tiles (1,612 words)
  12. `art-12`: Heat-Shielding Kitchen Trivets: Mortar Thermal Conductivity (1,707 words)
  13. `art-13`: Waterproofing Membranes for Planters: Hydrostatic Pressure Control (1,666 words)
  14. `art-14`: Calculating Tile Waste, Cutting Kerf, and Shard Area Yields (1,614 words)
  15. `art-15`: Designing Architectural Mosaic Borders: Symmetry & Grout Harmony (1,619 words)
- [x] Article Management & Query Store (`src/lib/articles/articleStore.ts`):
  - Bi-directional slug resolution (canonical English and localized German/French/Spanish slugs).
  - Cross-linking engine retrieving related projects (`SEEDED_PROJECTS`) and related guides.

### Localized Route Tree & Prerendering
- [x] Multi-locale directory structure (`src/app/[locale]/`):
  - `src/app/[locale]/layout.tsx`: Parameter validation (`isValidLocale()`) and `EditorialDisclosureBanner`.
  - `src/app/[locale]/page.tsx`: Localized home page with localized JSON-LD schemas.
  - `src/app/[locale]/calculator/page.tsx`: Localized tile inventory matching wizard.
  - `src/app/[locale]/projects/page.tsx`: Localized projects catalogue.
  - `src/app/[locale]/projects/[slug]/page.tsx`: Localized project detail and plan view with active $4.99 checkout button.
  - `src/app/[locale]/articles/page.tsx`: Localized guides hub.
  - `src/app/[locale]/articles/[slug]/page.tsx`: Localized guide reader with table of contents, reading time, and cross-links.

### Dynamic XML Sitemap & Robots Configuration
- [x] Dynamic Sitemap Generator (`src/app/sitemap.ts`):
  - 156 total indexed URLs (4 static hubs + 20 project plans + 15 articles across all 4 locales).
  - Accurate `lastModified`, `changeFrequency`, `priority`, and complete `alternates.languages` dictionaries.
- [x] Robots Configuration (`src/app/robots.ts`):
  - Global crawler permissions allowing public editorial and product pages.
  - Strict disallow directives for `/admin/`, `/api/`, and `/checkout/`.

---

## 7. Email Integration & Direct Supabase PostgreSQL Setup

### Resend Transactional Email Service
- [x] Configured Resend API Key (environment variable `RESEND_API_KEY`).
- [x] Configured verified sender domain: `Leftover Tile Planner <leftover@4dev.in>`.
- [x] Transactional Mailer Service (`src/lib/email/mailer.ts`):
  - Responsive, editorial HTML order confirmation template with terracotta/ceramic palette.
  - Plain-text fallback for maximum client compatibility.
  - In-process idempotency guard to prevent duplicate email dispatch for identical order sessions.
  - Integrated into Stripe webhook fulfillment (`src/app/api/webhooks/stripe/route.ts`) and direct checkout success fallback (`src/app/checkout/success/page.tsx`).
  - Admin notification email dispatch to `admin@4dev.in`.
- [x] Live email verification executed: Email ID `01a15020-6728-7707-ab98-dc121f3fb026` delivered successfully via Resend API.

### Live Supabase PostgreSQL Table Management
- [x] Direct connection configured via `.env.local` poolers:
  - `DATABASE_URL` (Port 6543, transaction-mode pooler with PgBouncer)
  - `DIRECT_URL` (Port 5432, session-mode pooler for DDL & migrations)
- [x] Automated Idempotent Migration Runner (`scripts/migrate.js` & `npm run db:migrate`).
- [x] Executed all 4 migrations on remote Supabase PostgreSQL (`aws-0-ap-northeast-1.pooler.supabase.com`):
  1. `20261018000001_phase2_schema_and_requirements.sql` (Enums, core tables, RLS)
  2. `20261018000002_phase3_admin_and_seeds.sql` (Verification constraints, admin policies, category seeds)
  3. `20261018000003_seed_20_projects.sql` (20 curated project concepts seeded across 5 categories)
  4. `20261018000004_purchases_tokens_and_security.sql` (Purchases, download tokens, RLS hardening)
- [x] Verified 13 public tables, Row Level Security, and physical verification constraints on live database.
- [x] Database query & synchronization module (`src/lib/db/postgres.ts`) persisting verified purchases and download tokens.

---

## 8. Test Execution Log

| Date / Timestamp | Test / Check | Command Executed | Result | Details |
| :--- | :--- | :--- | :---: | :--- |
| Phase 1 | Workspace & Toolchain | `Get-ChildItem`, `node -v` | Pass | Clean directory, Node v24.21.0, Git initialized. |
| Phase 1 | App Foundation Checks | `npm run typecheck`, `npm run lint` | Pass | 0 errors, 0 warnings. |
| Phase 1 | Initial Production Build | `npm run build` | Pass | All 9 routes compiled and prerendered. |
| 2026-10-18 | Vitest Matching Suite | `npm test` (`vitest run`) | Pass | 16/16 unit tests passed. |
| 2026-10-18 | Vitest Admin Suite | `npm test` (`vitest run`) | Pass | 17/17 unit tests passed. |
| 2026-10-18 | Vitest PDF Pipeline Suite | `npm test` (`vitest run`) | Pass | 16/16 unit tests passed. |
| 2026-10-18 | Vitest Stripe Checkout Suite | `npm test` (`vitest run`) | Pass | 10/10 unit tests passed. |
| 2026-10-18 | Vitest i18n & Articles Suite | `npm test` (`vitest run`) | Pass | 27/27 unit tests passed. |
| 2026-10-18 | Vitest Security Red-Team Suite | `npm test` (`vitest run`) | Pass | 11/11 unit tests passed. |
| 2026-10-18 | Vitest Resend Mailer Suite | `npm test` (`vitest run`) | Pass | 5/5 unit tests passed. |
| 2026-10-18 | Full Test Suite (7 Files) | `npm test` (`vitest run`) | Pass | **102/102 unit tests passed** in 1.20s. |
| 2026-10-18 | TypeScript Typecheck | `npm run typecheck` | Pass | `tsc --noEmit` exited with code 0. Zero errors. |
| 2026-10-18 | ESLint Code Check | `npm run lint` | Pass | `next lint` exited with code 0. Zero warnings, zero errors. |
| 2026-10-18 | Next.js Production Build | `npm run build` | Pass | **172/172 static and dynamic pages generated successfully**. |
| 2026-10-18 | Remote Database Migrations | `npm run db:migrate` | Pass | All 4 migrations applied, 13 public tables verified. |
| 2026-10-18 | Live Resend API Verification | `node scripts/test_send_email.js` | Pass | Email delivered with ID `01a15020-6728-7707-ab98-dc121f3fb026`. |

---

## 9. Unresolved Issues & External Service Readiness

- **External Service Production Deployment Verification**:
  - **Resend**: Production API key and domain (`leftover@4dev.in`) are active and verified.
  - **Supabase**: Remote PostgreSQL connection strings (`DATABASE_URL`, `DIRECT_URL`) are active and all 13 tables are migrated and verified on AWS Tokyo (`aws-0-ap-northeast-1`).
  - **Stripe**: Live webhook signing secret (`STRIPE_WEBHOOK_SECRET`) and live secret key (`STRIPE_SECRET_KEY`) can be switched from test keys whenever production payments are desired.
- **Red-Team Confirmed Defects**: All 6 identified vulnerabilities (RT-01 through RT-06) remain fully resolved and covered by automated regression tests.

---

## 10. Next Steps for Phase 7 (Awaiting User Direction)

1. Conduct end-to-end performance and accessibility auditing (Lighthouse / Core Web Vitals).
2. Configure Stripe production webhook signing (`whsec_...`) and live keys when ready.
3. Prepare Vercel deployment configuration, security headers, and edge caching policies.
