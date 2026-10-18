# Leftover Tile Project Planner

A production-oriented web application designed to help homeowners, remodelers, and artisans reuse surplus ceramic, porcelain, and stone tiles by matching their inventory to practical DIY projects and selling printable, architectural-grade project plans for a one-time payment of **$4.99 USD**.

---

## 1. Key Features

- **Deterministic Tile-Matching Engine**: Strict geometric and structural calculations determining usable surface area, kerf loss from saw cuts, and substrate viability without AI guesswork.
- **20 Curated DIY Project Plans**: High-utility projects including Mediterranean kitchen trivets, outdoor stepping stones, Nordic serving trays, and herringbone plant pedestals.
- **One-Time $4.99 Plan Purchases**: Frictionless, single-plan checkout via Stripe; zero recurring subscriptions.
- **Secure PDF Delivery Pipeline**: High-resolution printable plans stored in private Supabase Storage buckets, delivered only via 5-minute signed URLs after server-verified Stripe webhooks.
- **Warm Ceramic Design System**: Artisanal editorial aesthetic inspired by terracotta, sandstone, alabaster, and charcoal with accessible contrast and responsive layouts.
- **Global Localization**: Multi-locale architecture supporting English, German, French, and Spanish with localized slugs, canonical links, and hreflang tags.
- **15 In-Depth SEO DIY Guides**: Authoritative, peer-reviewed articles covering silica dust suppression, OSHA safety standards, mastic vs. thinset chemistry, and mosaic fracture methods.

---

## 2. Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom warm ceramic color tokens
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL 15+, Row Level Security, S3-compatible private buckets)
- **Payments**: [Stripe](https://stripe.com/) Checkout + Server-side cryptographic webhook verification
- **Validation**: [Zod v3](https://zod.dev/) for server-side input & environment variable sanitization
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 3. Getting Started & Local Setup

### 3.1 Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+` or `v11+`
- Git

### 3.2 Installation
```bash
# Clone the repository
git clone <repository-url>
cd TileProject

# Install project dependencies
npm install
```

### 3.3 Environment Configuration
Copy the template environment file to `.env.local`:
```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:

| Variable Name | Required Scope | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Public | Base URL of the app (default: `http://localhost:3000`). |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project API URL (`https://<id>.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous public client key. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Private (Server-Only)** | Elevated service-role key for webhook fulfillment and signed URLs. **Never expose to client.** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public | Stripe publishable key (`pk_test_...`). |
| `STRIPE_SECRET_KEY` | **Private (Server-Only)** | Stripe secret API key (`sk_test_...`). |
| `STRIPE_WEBHOOK_SECRET` | **Private (Server-Only)** | Stripe signing secret for webhook verification (`whsec_...`). |

---

## 4. Development Commands

```bash
# Start local development server on http://localhost:3000
npm run dev

# Run TypeScript typechecker without emitting files
npm run typecheck

# Run Next.js and ESLint code checks
npm run lint

# Create production build
npm run build

# Start production server
npm run start
```

---

## 5. Security & Architectural Invariants

1. **Zero Secret Leakage**: Private keys (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) are never prefixed with `NEXT_PUBLIC_` and are blocked from client bundles.
2. **PostgreSQL Row Level Security (RLS)**: Every public table in Supabase enforces RLS policies. Unverified plans and unpurchased files cannot be queried.
3. **Webhook Verification**: Payment fulfillment relies solely on cryptographically verified Stripe webhooks; client-side return URLs are never trusted as proof of payment.
4. **Idempotent Transactions**: All Stripe checkout events are keyed by unique `stripe_session_id` to prevent duplicate order generation.
5. **Private PDF Storage**: Project plans are stored in private buckets and delivered only via 300-second (5-minute) signed download URLs.

---

## 6. Architecture Documentation Index

For detailed architectural and engineering specifications, refer to the `docs/` folder:

- [`docs/PROJECT_PLAN.md`](docs/PROJECT_PLAN.md) — 7-phase implementation roadmap and product milestones.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System topology, component boundaries, matching engine design, and payment lifecycle.
- [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md) — Supabase PostgreSQL schema, relational tables, RLS policies, and storage rules.
- [`docs/SECURITY_CHECKLIST.md`](docs/SECURITY_CHECKLIST.md) — Security audit guidelines, anti-fraud controls, and DIY safety disclaimers.
- [`docs/IMPLEMENTATION_STATUS.md`](docs/IMPLEMENTATION_STATUS.md) — Live progress tracker, test logs, and next steps.

---

## 7. License & Credits

All architectural plans and editorial guides &copy; Leftover Tile Project Planner. All rights reserved.
