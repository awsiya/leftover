# Leftover Tile Project Planner — Project Plan & Roadmap

## 1. Executive Summary & Product Vision

**Leftover Tile Project Planner** is a specialized, production-ready web application designed to help homeowners, DIY enthusiasts, and remodelers repurpose surplus ceramic, porcelain, and stone tiles. Millions of square feet of leftover renovation tiles end up in landfills or collect dust in garages. This platform transforms surplus inventory into functional, beautiful DIY projects—such as mosaic tables, trivets, garden planters, and vanity backsplashes.

The monetization model is built around high-utility, printable, and downloadable digital DIY project plans priced at a one-time purchase of **$4.99 USD** (499 cents). Each plan provides architectural-grade cut sheets, step-by-step assembly instructions, adhesive and grout formulas, safety guidelines, and printable 1:1 cutting templates.

---

## 2. Technology Stack & Key Decisions

| Layer | Technology | Decision Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router, React 19 / 18, TypeScript) | Server Components for SEO and speed; API routes for webhooks; robust ecosystem. |
| **Styling** | Tailwind CSS + custom Warm Ceramic Design System | Zero runtime CSS overhead, accessible contrast, warm earthy palette. |
| **Database & Auth** | Supabase (PostgreSQL 15+, Auth, Storage) | Relational integrity, native Row Level Security (RLS), private S3-compatible storage. |
| **Payments** | Stripe Checkout (Embedded/Hosted) + Webhooks | PCI-DSS compliance offloaded to Stripe; server-verified idempotent webhooks. |
| **PDF Generation** | @react-pdf/renderer or Headless Chromium / Puppeteer | Deterministic, vector-sharp printable guides with precise measurements. |
| **i18n** | Sub-path routing (`/en`, `/de`, `/fr`, `/es`) | Full SEO indexing across 4 global languages with canonical and hreflang tags. |
| **Validation** | Zod v3 | Server-side and client-side strict schema validation for env vars, inputs, and API payloads. |

---

## 3. Phased Implementation Roadmap

### Phase 1: Architecture, Foundation & Design System (Current Phase)
- **Goal**: Set up an enterprise-grade project foundation, design system, documentation, and core landing page.
- **Deliverables**:
  - Clean Next.js App Router project configured with TypeScript, Tailwind CSS, and ESLint.
  - Reusable layout primitives (`Header`, `Footer`, `Button`, `Card`, `Badge`, `Accordion`, `Input`).
  - Warm ceramic editorial design system (stone, terracotta, sand, charcoal, sage).
  - High-converting, trustworthy English landing page with:
    - Hero section with immediate tile-planner call-to-action.
    - Interactive quick-calculator preview teaser.
    - Curated sample project cards with difficulty, tile count, and time estimates.
    - "How It Works" 3-step transparent workflow.
    - Educational DIY value proposition & material upcycling principles.
    - Comprehensive FAQ section with accessible disclosure controls.
  - Initial placeholder routes for `/calculator`, `/projects`, `/articles`, and `/admin/login`.
  - Typed environment variable validator (`src/lib/env.ts`) and safe `.env.example`.
  - Supabase client utilities isolating public browser clients from server-only admin clients.
  - Complete architectural documentation in `docs/` and `README.md`.

### Phase 2: Deterministic Tile Matching Engine & Guided Calculator
- **Goal**: Build the multi-step calculator and mathematical project-matching logic.
- **Deliverables**:
  - Guided wizard for tile input: length, width, depth, unit (inches/cm/mm), quantity, condition (intact, partial cuts, broken shards), and material type.
  - Deterministic matching algorithm: calculates square footage, cut viability, intact tile requirements, and waste allowances without AI hallucinations.
  - Dynamic result ranking showing: "Exact Match", "Compatible with Trimming", and "Mosaic / Shard Candidate".

### Phase 3: Project Catalogue, Detail Previews & Stripe Payment Lifecycle
- **Goal**: Implement the 20 curated project plans and one-time $4.99 checkout flow.
- **Deliverables**:
  - Rich project catalogue with category filters (Kitchen, Garden, Furniture, Decor, Coasters/Trays).
  - Project preview pages with dimension estimates, required tools, bill of materials, and safety notices.
  - Stripe Checkout integration for $4.99 (499 cents) purchases.
  - Secure webhook endpoint with signature verification, idempotency checking, and purchase receipt storage.
  - Temporary signed download token generation.

### Phase 4: Secure Printable PDF Plan Engine & Storage Pipeline
- **Goal**: Deliver architectural-grade, print-ready PDF project plans.
- **Deliverables**:
  - PDF layout templates with cut diagrams, material checklists, grout ratios, and safety instructions.
  - Supabase Storage private bucket configuration with strict RLS.
  - Secure signed URL generator granting 5-minute time-limited download access after payment verification.
  - Automated PDF watermarking with customer purchase ID to discourage unauthorized distribution.

### Phase 5: Admin Panel, Localized Content & Content Management
- **Goal**: Enable administrative management of projects, translations, and plan files.
- **Deliverables**:
  - Secure admin login protected by Supabase Auth and admin role checks.
  - Project management CRUD: create, edit, verify, upload new PDF plan versions, and toggle active status.
  - Translation manager for English, German, French, and Spanish metadata.
  - Plan verification workflow preventing unverified plans from being sold.

### Phase 6: SEO Content Hub (15 In-Depth Articles) & Multilingual Expansion
- **Goal**: Drive organic search traffic with comprehensive, expert-level DIY guides.
- **Deliverables**:
  - 15 original, comprehensive DIY guides (1,600–1,800 words each) covering tile cutting, mosaic techniques, outdoor weatherproofing, adhesive chemistry, and upcycling ideas.
  - Multilingual routing (`/en`, `/de`, `/fr`, `/es`) with automated hreflang tags, canonical URLs, and localized slugs.
  - XML sitemap generation (`/sitemap.xml`) and dynamic `robots.txt`.
  - JSON-LD structured data (Schema.org `HowTo`, `Article`, `Product`).

### Phase 7: Production Hardening, Audit & Deployment
- **Goal**: Verify security, accessibility, and performance before public launch.
- **Deliverables**:
  - Security audit: penetration testing on webhook endpoints, RLS bypass attempts, secret leakage scans.
  - Performance audit: Lighthouse 95+ scores on mobile and desktop, Core Web Vitals optimization.
  - WCAG 2.1 AA accessibility audit: screen reader testing, focus rings, contrast verification.
  - Vercel production deployment and Supabase production connection.

---

## 4. Key Milestones & Verification Criteria

| Milestone | Target Status | Verification Method |
| :--- | :--- | :--- |
| **M1: App Foundation & Design** | Completed (Phase 1) | `npm run build`, `npm run lint`, responsive visual verification, zero console errors. |
| **M2: Matching Engine** | Planned (Phase 2) | Unit tests verifying mathematical cut calculations against edge-case inventories. |
| **M3: Payment & Security** | Planned (Phase 3) | Stripe CLI webhook test suite, idempotency tests, invalid signature rejection. |
| **M4: PDF Engine & Storage** | Planned (Phase 4) | Vector test of generated PDFs; verification that unauthenticated requests receive HTTP 403. |
| **M5: Admin & Multilingual** | Planned (Phase 5) | Role-based authorization tests, multilingual routing sanity checks. |
| **M6: SEO & Launch Readiness** | Planned (Phase 6–7) | Schema validation with Google Rich Results test; sitemap indexing check. |
