# VedicWellness Final Product Readiness

> **STATUS: LARGELY SUPERSEDED — HISTORICAL DOCUMENT.** This readiness plan was written before several deliberate architecture decisions and cleanup passes. Do not execute it as-is. Current architecture: [CURRENT_SYSTEM.md](./CURRENT_SYSTEM.md). Current rules: [FUTURE_MAINTENANCE.md](./FUTURE_MAINTENANCE.md).

> **Historical note:** This document was the primary ship readiness guide prior to the 2026 cleanup passes. Many ship blockers (OTP / verify-required, mock payment, heavy images) have since been addressed or explicitly deferred per FUTURE_MAINTENANCE.md rules. The item-by-item reconciliations below are annotated as resolved or obsolete; do not act on outdated items without verifying against current code.

---
>
> **Item-by-item reconciliation against current code:**
>
> - **OTP / `/verify-required` (Ship Blocker 1, Phases 1 & 4, §10)** — OBSOLETE. OTP verification was removed entirely; auth is email + password (credentials provider, JWT sessions). `proxy.ts` no longer references a verify flow, and no OTP code exists anywhere. Do not recreate.
> - **`.env` committed to git (Ship Blocker 2)** — operational item; verify the repo/rotation state out-of-band if ever relevant.
> - **Resend sender domain (Ship Blocker 3)** — Resend is still used, but only for admin notifications (new lead/order alerts), not customer-facing OTPs. Sender-domain configuration remains an operational check.
> - **Production Turnstile keys (Ship Blocker 4)** — still an OPERATIONAL launch requirement; code fails closed when the secret is missing.
> - **Heavy homepage images (Must Fix 1, Performance table)** — PARTIALLY RESOLVED: hero slides now reference `.webp`; the hero `.gif` remains. This is scoped to the planned Home page phase.
> - **Sensitive debug logging (Must Fix 2, Ship Checklist P0)** — RESOLVED: Turnstile logs only missing-config errors (fails closed); signup logs one safe failure message.
> - **`AnimatedCard`/`Card` setState-in-effect (Must Fix 3)** — cosmetic; deferred.
> - **Empty `CategoryImagesField.tsx` (Must Fix 4, §7)** — STILL PRESENT (0 bytes, zero importers). Trivial cleanup candidate, intentionally left for a code-owning pass.
> - **Mock payment action (§7 Deferred)** — RESOLVED BY REMOVAL: no payment simulation exists; orders are an unpaid request flow (CREATED → CONFIRMED → SHIPPED → DELIVERED by admin). Payment-gateway integration remains deferred.
> - **Order lifecycle statements anywhere in this document** — OUTDATED: orders are created `CREATED` (not confirmed/paid) with a 24h expiry window; stock is informational and never blocks or changes with orders.
> - **`/sales` dashboard deferral (§7)** — unchanged; role check retained in `proxy.ts`, no routes.

## 1. Executive Summary

The **VedicWellness** codebase is in a strong, functional state. Core features—including NextAuth credential authentication, OTP verification, product catalog browsing, cart & checkout, order creation, lead submission, and admin management—are fully implemented. The project successfully builds (`npm run build`) and passes TypeScript type checking (`npm run typecheck`).

However, shipping this week requires addressing **4 critical Ship Blockers** (such as a missing route referenced in authentication middleware and committed production secrets), performing targeted **Frontend & Performance polish** (e.g., serving existing `.webp` images rather than multi-megabyte `.jpg` files), and explicitly **freezing product scope** (deferring live payment gateway integration in favor of the working order flow).

With focused execution following this ship plan, **VedicWellness is on track to be 100% production-ready within 2–3 days.**

---

## 2. Ship Blockers

| # | Problem / Feature | Current State | What is Missing / Broken | Files Involved | Impact & Risk | Effort | Feasibility | Recommended Action |
|---|-------------------|---------------|--------------------------|----------------|---------------|--------|-------------|--------------------|
| 1 | **Missing `/verify-required` Route** | `proxy.ts` (middleware) redirects unverified users accessing `/products/[slug]` to `/verify-required`. | Route does not exist, resulting in a **404 page** for unverified users trying to view products. | `proxy.ts`, `app/(auth)/verify-required/page.tsx` | High: Breaks user onboarding flow. | **XS** | High | Create `/verify-required` page with a simple card directing users to check their email for OTP. |
| 2 | **Secrets Committed to Version Control** | `.env` file containing live DB credentials, NextAuth secrets, Brevo API key, Resend key, and R2 credentials is tracked in git. | `.env` was committed before `.gitignore` rules applied. | `.env`, `.gitignore` | High: Production credential leak risk. | **XS** | High | Untrack `.env` (`git rm --cached .env`), rotate compromised keys, and add a clean `.env.example`. |
| 3 | **Unverified Resend Sender Domain** | Transactional emails use `EMAIL_FROM="onboarding@resend.dev"`. | Resend limits `onboarding@resend.dev` to test recipients only; production emails to real customers will bounce. | `.env`, `lib/email/transactional/send.ts` | High: Customers will not receive OTPs or order confirmations. | **S** | High | Configure verified domain in Resend dashboard and update `EMAIL_FROM` (e.g. `noreply@vedicwellness.com`). |
| 4 | **Production Turnstile Configuration** | Turnstile relies on dummy/test keys in `.env`. | Production domain challenges will fail or bypass verification if test keys are left in production. | `.env`, `lib/security/turnstile.ts` | Medium: Bot protection fails in live environment. | **XS** | High | Provision production site & secret keys in Cloudflare dashboard and update environment variables. |

---

## 3. Must Fix Before Launch

| # | Feature / Problem | Current State | What is Missing / Broken | Files Involved | Impact & Risk | Effort | Feasibility | Recommended Action |
|---|-------------------|---------------|--------------------------|----------------|---------------|--------|-------------|--------------------|
| 1 | **Heavy Image Assets on Homepage** | `Hero.tsx` and `Philosophy.tsx` reference raw `.jpg` images (up to 3.8MB each) and a 2.3MB `.gif`. | Pre-converted `.webp` assets exist in `public/hero/` but are not referenced in code. | `components/public/home/Hero.tsx`, `components/public/home/Philosophy.tsx` | High: Homepage loads ~15MB of images, severely degrading LCP & mobile speed. | **XS** | High | Update image source paths to point to existing `.webp` files (`1.webp`, `card-products.webp`, etc.). |
| 2 | **Sensitive Debug Console Logging** | API routes and auth services log sensitive inputs (`REQUEST BODY`, `TURNSTILE SECRET`, `OTP GENERATED`). | Logs dump data to standard output in serverless execution environments. | `app/api/signup/route.ts`, `lib/security/turnstile.ts`, `lib/services/signupService.ts` | Medium: Data exposure in log management tools. | **XS** | High | Remove debug `console.log` statements in production routes. |
| 3 | **Hydration State Warnings in UI Cards** | `AnimatedCard.tsx` and `Card.tsx` trigger synchronous `setState` in `useEffect` during media query checks. | React linter flags `set-state-in-effect`, causing minor hydration re-renders. | `components/public/ui/AnimatedCard.tsx`, `components/public/ui/Card.tsx` | Low: Extra render pass on client mount. | **XS** | High | Refactor media query check to initialize state lazily or defer state update. |
| 4 | **Dead Artifact Cleanup** | `components/admin/CategoryImagesField.tsx` exists as a 0-byte file. | Empty file cluttering admin component directory. | `components/admin/CategoryImagesField.tsx` | Low: Code cleanliness. | **XS** | High | Delete `CategoryImagesField.tsx`. |

---

## 4. Frontend Completion

### Desktop & Mobile UX Audit

- **Navigation & Mobile Drawer**: Mobile menu (`Navbar.tsx`) and floating social bar (`BottomNavbar.tsx`) work smoothly with proper z-index isolation and scroll locks.
- **Cart & Checkout Flow**: Checkout page correctly validates default shipping address and displays empty state with prompt to add an address in account settings.
- **Forms & Interactivity**: Contact form, Signup form, and Admin forms include Turnstile captcha, input validation, and toast notifications via Sonner.
- **Loading & Empty States**: Loading skeletons exist for main route groups (`(admin)/loading.tsx`, `(customer)/loading.tsx`, `(public)/loading.tsx`).
- **Typography & Dark Mode**: Consistent tailwind color tokens and font definitions (`Inter`, `Outfit`) applied across pages.

---

## 5. Performance

| Optimization | Current State | Proposed Fix | Impact | Effort |
|--------------|---------------|--------------|--------|--------|
| **Homepage Image Optimization** | Serving multi-megabyte `.jpg` files (`4.jpg` is 3.8MB). | Swap image paths to existing optimized `.webp` versions (`4.webp` is 2.0MB, `3.webp` is 85KB). | ~60% reduction in initial payload weight. | **XS** |
| **`<img>` to `<Image />` Conversion** | `MediaSlider.tsx` uses standard HTML `<img>` tags. | Replace with Next.js `Image` component for automatic responsive resizing. | Improved LCP score on mobile devices. | **XS** |
| **ISR Revalidation** | Product catalog revalidates every 6 hours (`21600`s), Homepage every 24 hours. | Keep existing ISR settings intact—they match read-heavy requirements. | High cache hit ratio on Vercel Edge. | **None** |

---

## 6. Security & Reliability

- **RBAC Enforcement**: `proxy.ts` (middleware) strictly restricts `/admin/*` routes to users with `ADMIN` role.
- **Rate Limiting**: Upstash Redis rate limiting is configured for login, signup, and contact endpoints.
- **Input Sanitization**: Contact and lead ingestion pipeline uses HTML/text sanitization (`sanitizeText`) and MX record validation.
- **Environment Isolation**: `.env` needs to be untracked from git history to preserve credential integrity before deployment.

---

## 7. Deferred / Remove

| Feature | Current State | Reason for Deferral / Removal | Action |
|---------|---------------|-------------------------------|--------|
| **Live Payment Gateway (Razorpay/Stripe)** | Order payment status uses direct `mockMarkPaidAction`. | Scope freeze rule: Live PG integration is complex and unnecessary for initial product launch. | **DEFER**: Retain current order payment flow. |
| **Unimplemented `/sales` Dashboard** | `proxy.ts` mentions `/sales` role matching, but no `/sales` route exists. | Admin dashboard handles order and lead management directly. | **DEFER**: Retain role check in proxy without adding new routes. |
| **Empty Category Images Component** | `CategoryImagesField.tsx` is an empty 0-byte file. | Dead file. | **REMOVE**: Delete file. |

---

## 8. Quick Wins

1. **Create `/verify-required` page** (15 mins) – Eliminates 404 error during unverified user navigation.
2. **Swap Hero JPGs for WEBP** (15 mins) – Instant LCP & performance boost.
3. **Delete `CategoryImagesField.tsx`** (5 mins) – Removes dead file.
4. **Clean debug `console.log` statements** (15 mins) – Secures log outputs.
5. **Create `.env.example` & untrack `.env`** (10 mins) – Secures codebase for deployment.

---

## 9. Ranked Implementation Plan

| Priority | Task | Impact | Effort | Feasibility | Dependencies |
|:--------:|------|:------:|:------:|:-----------:|--------------|
| **1** | Create `app/(auth)/verify-required/page.tsx` | High | XS | High | None |
| **2** | Remove `.env` from git index & add `.env.example` | High | XS | High | None |
| **3** | Replace raw JPG/GIF paths in `Hero.tsx` & `Philosophy.tsx` with WEBP | High | XS | High | None |
| **4** | Clean debug `console.log` from `signup/route.ts` & `turnstile.ts` | Medium | XS | High | None |
| **5** | Configure production `EMAIL_FROM` domain in Resend & `.env` | High | S | High | Resend Dashboard |
| **6** | Replace `<img>` tags in `MediaSlider.tsx` with `<Image />` | Medium | XS | High | None |
| **7** | Fix `setState` in `useEffect` in `AnimatedCard.tsx` & `Card.tsx` | Low | XS | High | None |
| **8** | Delete empty `components/admin/CategoryImagesField.tsx` | Low | XS | High | None |
| **9** | Final build & deployment verification (`npm run build`) | High | S | High | Tasks 1–8 |

---

## 10. Definition of Done

- [ ] All routes resolve without 404 or runtime errors (including unverified user redirect).
- [ ] `npm run build` succeeds cleanly with zero errors.
- [ ] `npm run typecheck` passes with zero TypeScript errors.
- [ ] `.env` is removed from git repository; `.env.example` is committed.
- [ ] Homepage hero & philosophy images load optimized `.webp` assets.
- [ ] Transactional emails & OTPs originate from a verified domain.
- [ ] Production Turnstile keys are configured and functional.
- [ ] Production deployment on Vercel is live and verified.

---

## 11. Estimated Ship Path

```
[Phase 1 — Stabilize] ──> [Phase 2 — Complete] ──> [Phase 3 — Polish] ──> [Phase 4 — Verify] ──> [Phase 5 — Deploy]
      (Day 1)                  (Day 1-2)               (Day 2)              (Day 3)             (Day 3)
```

### Phase 1 — Stabilize
- Add `/verify-required` page.
- Untrack `.env` from git and create `.env.example`.
- Remove debug `console.log` statements.

### Phase 2 — Complete
- Update `EMAIL_FROM` with verified domain in Resend.
- Configure production Cloudflare Turnstile keys.

### Phase 3 — Polish
- Update homepage image references to `.webp` format.
- Replace `<img>` tags with Next.js `<Image />` in `MediaSlider.tsx`.
- Remove dead `CategoryImagesField.tsx` file.

### Phase 4 — Production Verification
- Run full build check (`npm run build`).
- Validate end-to-end user flows (signup → OTP → login → product view → checkout → order created).

### Phase 5 — Deploy
- Push clean main branch to GitHub / Vercel.
- Configure production environment variables in Vercel.
