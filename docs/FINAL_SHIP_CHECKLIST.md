# VedicWellness Final Ship Checklist

Audit scope: current repository state, with feature-freeze changes treated as intentional. This audit does not propose new product features or architecture changes.

## MUST FIX

| Priority | Issue | Impact | Effort | Feasibility | Recommendation |
| --- | --- | --- | --- | --- | --- |
| P0 | Lead submission persists to `Lead` but does not dispatch the promised lead notification email (`lib/services/contactService.ts:81`, `lib/db/lead.ts:30`). | Franchise/contact inquiries can be silently missed. | S | High | Restore the existing notification dispatch and verify delivery in production. |
| P0 | Turnstile verification logs the secret, submitted token, and verification response (`lib/security/turnstile.ts:6-7,36`). Signup also logs request-processing details and database results (`lib/services/signupService.ts:32-104`). | Secrets, CAPTCHA tokens, and operational/PII data can enter production logs. | XS | High | Remove sensitive debug logging; retain only safe, structured failure telemetry. |
| P0 | Server-side order creation does not validate buy-now quantity, product publication, or stock (`app/(customer)/checkout/serverActions.ts:10-15`, `lib/services/public/orderService.ts:193-240`). Cart checkout also prices every cart item without an availability check (`lib/services/public/orderService.ts:126-180`). | A crafted request can create orders with invalid quantities or unavailable/unpublished products. | S | High | Enforce positive bounded quantity and current published/stock checks in the order service, including the cart path. |
| P0 | The customer payment action is explicitly a production-visible simulation (`app/(customer)/orders/[id]/OrderDetailsClient.tsx:54-101`, `mockPaymentAcion.ts`). | Customers can mark an order paid without a real payment; this is not a production-ready paid checkout. | Decision/S | High | Before launch, either confirm the business launch is intentionally an unpaid order-request flow and remove payment claims, or provide the already-approved payment integration path. Do not launch this as paid commerce while it remains “Dev Only”. |

## SHOULD FIX

| Priority | Issue | Impact | Effort | Feasibility | Recommendation |
| --- | --- | --- | --- | --- | --- |
| P1 | `npm run lint` fails with 124 errors (152 problems total), including production components and React rule violations. | CI/deployment quality gate may fail; known defects remain harder to detect. | M | High | Make lint pass, prioritizing errors in auth, checkout, admin actions, and public pages. |
| P1 | Cron authentication fails open when `CRON_SECRET` is unset (`app/api/cron/expire-orders/route.ts:11-16`). | Anyone who finds the endpoint can trigger order expiry; missing configuration is not detected. | XS | High | Require the secret in production and reject requests when it is absent or mismatched. |
| P1 | Homepage uses large legacy JPG/GIF assets, including approximately 3.8 MB, 2.9 MB, and 2.4 MB files; the hero GIF is loaded with raw `<img>` (`components/public/home/Hero.tsx:41-47`, `components/public/ui/MediaSlider.tsx:100-123`). | Slower mobile LCP and unnecessary bandwidth on the highest-traffic page. | S | High | Replace the hero assets with the existing compressed variants or appropriately compressed WebP/AVIF assets, then recheck mobile LCP. |
| P1 | Deactivated companies are filtered from catalog queries but not from direct product detail lookup (`lib/db/product.ts:getPublicProductBySlugDB`). | A product belonging to an inactive company can remain reachable by direct URL. | XS | High | Apply the same active-company constraint to public detail and metadata lookups. |

## SAFE TO DEFER

| Priority | Issue | Impact | Effort | Feasibility | Recommendation |
| --- | --- | --- | --- | --- | --- |
| P2 | `app/api/r2/download-url/route.ts` returns 501 but has no repository caller. | No current customer/admin journey depends on it. | XS | High | Leave it alone unless it becomes linked or documented as live functionality. |
| P2 | OTP/email-verification references remain in `README.md`, `TECH_STACK.md`, and `docs/FINAL_PRODUCT_READINESS.md`. | Operator/documentation confusion only; no runtime impact. | XS | High | Update or archive after the launch-critical work. |

Unused imports, minor warnings, animation polish, broad TypeScript `unknown` cleanup, major rewrites, caching redesigns, payment architecture migrations, and visual redesigns are safe to leave alone unless they block the deployment gate.

### Cleanup

**REMOVE BEFORE LAUNCH:** the sensitive debug logging identified in P0. It creates real security risk.

**SAFE TO LEAVE:** the unused 501 download route, non-critical lint warnings, stale non-runtime documentation, and other dead code that is not exposed or confusing to operators.

## FINAL QA

Run against the production deployment or a production-equivalent environment with real configured services:

### Customer journey

1. Open the home page logged out on desktop and a narrow mobile viewport; confirm navigation, hero, images, footer, and no console/runtime errors.
2. Browse `/products`, search, sort, switch company, open a product detail, and confirm the displayed company is correct.
3. Complete signup with a valid production Turnstile challenge; confirm the account is created once and the user is sent to login.
4. Log in with valid credentials; confirm an invalid password is rejected and rate limiting behaves safely.
5. Add an in-stock product to cart, change quantity, remove it, and confirm totals after refresh.
6. Attempt checkout without an address, add/set a default address in Account, then place a cart order.
7. Repeat checkout with Buy Now; test quantity 1, quantity 20, quantity 0, negative quantity, an unpublished product, and an out-of-stock product. Invalid cases must not create orders.
8. Open the created order, verify only the owning user can view/cancel/pay it, verify expiry behavior, and confirm the agreed payment/order semantics.
9. Verify Account shows the order and totals; open the order detail; sign out; confirm protected pages redirect to login.

### Admin journey

1. Log in as an admin and confirm `/admin` is inaccessible to a non-admin account.
2. Open Dashboard, Products, create/edit/publish a product, assign it to a company, and confirm the public catalog/detail reflect the change.
3. Deactivate a company and confirm its products are absent from active catalog listings and direct product URLs.
4. Open Companies, Orders, and Leads; verify pagination/search/filter/detail actions and that customer data is visible only to authorized staff.
5. Submit the contact form as a visitor and confirm the lead is stored, sanitized, visible in Admin Leads, and the notification arrives at the configured recipient.
6. Upload an allowed image as admin; confirm a non-admin cannot obtain an upload URL and invalid type/size requests fail.

## PRODUCTION CHECK

- Confirm production values exist for `DATABASE_URL`, `PRISMA_DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, Upstash Redis, R2, `CRON_SECRET`, and the configured lead-email provider/recipient variables.
- Confirm no secret file is tracked or included in the deployment artifact; rotate unknown credential that has appeared in logs or repository history.
- Run `prisma migrate deploy` against the production database and verify the companies migration is applied.
- Verify database connectivity, indexes, backups/restore responsibility, and the cron schedule for order expiry.
- Verify the lead notification sender domain, recipient, reply-to behavior, bounce handling, and one real delivery.
- Verify Turnstile site/secret keys match the production hostname and reject invalid or reused tokens.
- Run `npm run typecheck`, `npm run lint`, and `npm run build` in a network-enabled clean checkout; do not treat a local build that cannot fetch Google Fonts as a passing production build.
- Confirm Vercel environment scope (Preview/Production), runtime logs, Sentry configuration if used, HTTPS, and the final canonical site URL.

## DEFINITION OF DONE

- All P0 findings are closed and manually verified.
- P1 findings are closed, or the launch owner has explicitly accepted the remaining risk.
- Typecheck, lint, and production build pass from a clean checkout.
- Database migration, email/lead notification, CAPTCHA, Redis, R2, cron, and auth are verified with production configuration.
- Customer and admin journeys above pass on desktop and mobile, including invalid checkout cases.
- No production logs contain secrets, CAPTCHA tokens, passwords, or unnecessary customer data.
- The payment/order semantics are explicitly approved and match what customers see.
