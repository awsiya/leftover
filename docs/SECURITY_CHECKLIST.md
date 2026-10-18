# Leftover Tile Project Planner — Security & Compliance Checklist

## 1. Environment Secrets & Variable Isolation

| Variable Name | Exposure Scope | Verification Rule |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Public (Client & Server) | Must be a valid HTTPS URL (or localhost in development). |
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Client & Server) | Valid Supabase project URL (`https://<id>.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (Client & Server) | Safe for browser distribution. Restricted by PostgreSQL RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Strictly Private (Server-Only)** | **CRITICAL**: Never prefixed with `NEXT_PUBLIC_`. Never imported in Client Components. Blocked by build-time lint checks. |
| `STRIPE_SECRET_KEY` | **Strictly Private (Server-Only)** | Server-only. Used for creating Checkout Sessions and querying payment states. |
| `STRIPE_WEBHOOK_SECRET` | **Strictly Private (Server-Only)** | Used solely in `/api/webhooks/stripe` to verify cryptographic signatures (`whsec_...`). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public (Client & Server) | Standard Stripe public key (`pk_live_...` or `pk_test_...`). |

---

## 2. Row Level Security (RLS) Invariants

- [x] **Default Deny**: Every PostgreSQL table in `public` schema has `ENABLE ROW LEVEL SECURITY;` applied during migration.
- [x] **No Unverified Plan Leakage**: Anonymous and authenticated users cannot query rows from `projects` where `verification_status != 'verified'`.
- [x] **No Direct Client Purchase Injection**: `purchases` table only allows inserts from `auth.role() = 'service_role'`. Attackers cannot falsify purchase receipts directly from browser clients.
- [x] **Download Token Safeguards**: `download_tokens` cannot be browsed or listed by public queries. Verified tokens are accessed by single UUID lookup with strict expiration timestamps (`expires_at > NOW()`).

---

## 3. Stripe Payment Security & Anti-Fraud

- [x] **Cryptographic Webhook Signature Check**:
  - Raw body buffer is captured and verified against `stripe-signature` header using `stripe.webhooks.constructEvent(buf, sig, secret)`.
  - Unsigned or invalid requests immediately terminate with `HTTP 400 Bad Request`.
- [x] **Idempotency Guarantee**:
  - Every incoming `checkout.session.completed` event is keyed by `stripe_session_id`.
  - If `stripe_session_id` already exists in `purchases`, the webhook returns `HTTP 200` without duplicating tokens or billing records.
- [x] **Price Tampering Prevention**:
  - Project plans are fixed at 499 cents ($4.99 USD).
  - Price is looked up server-side from the verified database record, never accepted from user-submitted form parameters.

---

## 4. PDF Storage & Asset Protection

- [x] **Private Storage Bucket**:
  - The `project-plans` bucket in Supabase Storage has `public: false`.
  - Anonymous HTTP GET requests to raw file URLs receive `HTTP 403 Forbidden`.
- [x] **Short-Lived Signed URLs**:
  - Valid purchase download requests generate URLs that expire strictly within **300 seconds (5 minutes)**.
  - Maximum download count per token is capped at 10 to prevent link sharing on forums or social media.

---

## 5. Input Validation & Injection Hardening

- [x] **Server-Side Zod Schemas**:
  - All incoming dimensions (length, width, thickness, quantity) are validated against strict Zod numerical schemas.
  - Reject negative numbers, NaN, astronomical dimensions (> 3000mm), and non-whitelisted unit strings.
- [x] **Safe SQL Querying**:
  - Supabase client uses parameterized queries exclusively. No raw string interpolation into SQL queries.
- [x] **Content Security & XSS**:
  - All rendered editorial content is sanitized.
  - Modern Next.js React JSX auto-escapes output by default.

---

## 6. Physical DIY Safety Disclaimers & Duty of Care

Working with ceramic, porcelain, and stone tiles presents physical hazards (silica dust, razor-sharp shards, flying porcelain fragments, chemical grouts). The application enforces strict safety notices:

- [x] **Crystalline Silica Warning**: Every cutting instruction must emphasize wearing an OSHA/NIOSH-rated N95 or P100 respirator and using wet-cutting methods to suppress airborne silica dust.
- [x] **Eye & Hand Protection**: Clear warnings to wear ANSI Z87.1 safety glasses and heavy-duty cut-resistant gloves when scoring, snapping, or nipping tiles.
- [x] **Substrate & Load Safety**: Clear weight and deflection guidelines so users do not build heavy tile tables on unstable furniture frames.
- [x] **No Unsupported AI Claims**: All structural specifications are derived from standard tile industry guidelines (TCNA / ANSI standards).
