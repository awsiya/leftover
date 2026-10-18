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
- [x] **Refund & Dispute Download Revocation**:
  - Webhooks handling `charge.refunded` or `charge.dispute.created` immediately mark entitlements as revoked (`isRevoked: true`).
  - Download tokens are instantly invalidated via `revokeDownloadToken()`; subsequent download requests are rejected with `HTTP 403 Forbidden`.
- [x] **Zero Trust in Browser Redirects**:
  - The checkout success redirect (`/checkout/success?session_id=...`) is never treated as proof of payment.
  - Download entitlements are unlocked only after cryptographic Stripe webhook event confirmation.

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

---

## 7. Project Physical Verification & Commerce Gating

- [x] **Strict Physical Verification Gate**:
  - In accordance with TCNA duty-of-care, projects cannot be marked `verified` without verifiable physical prototype test build evidence.
  - Requires all 4 physical inspection checklist items:
    1. 1:1 prototype dimensions physically measured and verified.
    2. Cutting safety and edge smoothness verified (no razor edges or dangerous splinters).
    3. Structural load capacity and substrate deflection verified.
    4. Adhesive bonding and grout cure verified.
  - Must include test build date, verifier name/credentials, and notes $\ge 20$ characters.
- [x] **Commerce Safety Guard (`assertProjectCanBeSold`)**:
  - Programmatic guard strictly preventing checkout or purchase generation for projects in `draft`, `reviewing`, or `archived` status.
  - Throws `COMMERCE SECURITY VIOLATION` error if unverified plan purchase is attempted.
- [x] **Database Constraints**:
  - `chk_projects_verified_evidence` ensures PostgreSQL rejects any update setting `verification_status = 'verified'` if `verified_at` or `verified_by` are NULL.
- [x] **Admin Role & Server-Side Authorization**:
  - `/admin` routes and server actions (`getAdminProjects`, `updateProjectVerification`, `saveAdminProject`, `deleteAdminProject`) enforce server-side authentication (`verifyAdminSession` / `requireAdmin`).
  - Unauthorized callers receive immediate HTTP 307 redirect to `/admin/login` or exception rejection.

---

## 8. Critical Red-Team Audit & Remediation Log (Phase 7 Security Hardening)

| Finding ID | Severity | Category | Flaw Description & Impact | Reproduction & Evidence | Remediation Implemented | Verification |
| :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **RT-01** | **CRITICAL** | Authorization / UX | **Infinite Redirect Loop on `/admin/login`**: `AdminLayout` at `src/app/admin/layout.tsx` wrapped all child routes including login. When an unauthenticated user visited `/admin/login`, `verifyAdminSession()` failed and triggered `redirect('/admin/login')`, producing `ERR_TOO_MANY_REDIRECTS`. | An unauthenticated browser request to `/admin/login` was trapped in an infinite 307 loop. | Reorganized admin architecture using Next.js route groups (`src/app/admin/(dashboard)/layout.tsx`). The public login route (`/admin/login`) sits outside the protected dashboard layout. | Fixed. `/admin/login` renders statically (`○ (Static)`), while `/admin` enforces dynamic server-side authorization. |
| **RT-02** | **CRITICAL** | Authentication / Escalation | **Supabase User Metadata Privilege Escalation**: `verifyAdminSession()` evaluated `user.user_metadata?.role === 'admin'`. In Supabase, `user_metadata` is user-writable via client SDK (`supabase.auth.updateUser()`). Any user could grant themselves admin rights. | An authenticated user calling `supabase.auth.updateUser({ data: { role: 'admin' } })` gained full admin access. | Removed `user_metadata` evaluation. Admin verification strictly checks server-controlled `user.app_metadata?.role === 'admin'` or exact match with server environment variable `ADMIN_EMAIL`. Disabled mock dev sessions in production. | Fixed. Verified in test suite `src/lib/__tests__/security-red-team.test.ts`. |
| **RT-03** | **HIGH** | Commerce / Webhooks | **Serverless Cold-Start Fallback to Hardcoded Project `proj-001`**: `fulfillPurchaseOrder()` fell back to hardcoded `proj-001` (Mediterranean Mosaic Trivet) if memory cache was empty (server restart or cold lambda). Webhook route failed to pass `session.metadata`. | If server restarted after checkout creation, any project purchased was fulfilled as `proj-001`. | Updated `fulfillPurchaseOrder()` to accept `projectId`, `projectSlug`, and `planVersion` from `session.metadata`. In `src/app/api/webhooks/stripe/route.ts`, passed metadata attributes into fulfillment. | Fixed. Verified in unit tests. |
| **RT-04** | **HIGH** | Reliability / Payment | **Success Page Stuck on Pending during Serverless Cold Starts**: If customer landed on `/checkout/success?session_id=...` on a new container instance, in-memory purchase was null, leaving customer indefinitely waiting. | Accessing success page after container restart displayed perpetual "Awaiting Confirmation". | Hardened `/checkout/success/page.tsx` to directly query Stripe API (`stripe.checkout.sessions.retrieve(session_id)`) if in-memory order is absent. If paid, order is fulfilled on the spot. | Fixed. Cryptographic verification preserved without relying on client redirect parameters. |
| **RT-05** | **HIGH** | Database / Schema | **Missing PostgreSQL Tables & Policies for Purchases & Tokens**: Database types declared `purchases` and `download_tokens`, but no migration created them or applied RLS policies. Admin write policies for articles were also missing. | Deploying migrations to a live Supabase database lacked commerce tables, breaking RLS. | Created migration `20261018000004_purchases_tokens_and_security.sql` creating both tables, indexes, foreign keys, service-role write RLS, user select RLS, and admin article policies. | Fixed. Migration added to `supabase/migrations/`. |
| **RT-06** | **MEDIUM** | Input Validation | **Unbounded Input Dimensions for Imperial Units**: `tileInputSchema` allowed up to 3,000 inches (250 feet / 76.2 meters) because max was unit-agnostic. | Entering `length: 2500, unit: 'inches'` produced astronomical area calculations. | Added `superRefine` enforcing unit-specific maximums (120 inches for imperial, 300 cm for metric, 3000 mm). | Fixed. Unit test asserts rejection of 150 inches. |
