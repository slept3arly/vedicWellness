# Vedic Wellness — Future Maintenance & Change Rules

**Audience:** any developer or AI agent modifying this repository without prior context.

Read [CURRENT_SYSTEM.md](./CURRENT_SYSTEM.md) first. Then read the section relevant to your task and inspect the actual implementation before changing anything.

---

## 0. Before changing anything

1. Read `docs/CURRENT_SYSTEM.md`.
2. Read the feature-specific documentation for the area you are touching.
3. Inspect the current implementation — **the code is the source of truth**, not old audit documents.
4. Determine whether the behavior you are about to change is intentional (many unusual-looking decisions are deliberate; see §7 "Do not reintroduce").
5. Change only what your task requires. Do not "fix" adjacent systems, do not refactor opportunistically, and do not treat historical audit docs as current architecture.

Labels used in this document:

- **HARD REQUIREMENT** — breaking this breaks correctness, security, or SEO that was explicitly designed.
- **CURRENT ARCHITECTURE** — an intentional decision; change only with explicit direction from the owner.
- **RECOMMENDED PRACTICE** — preference, not law.

---

## 1. SEO rules

- **HARD REQUIREMENT — Canonical behavior.** `/products` default = unfiltered listing canonicalized to `/products`; `?company=<slug>` = distinct self-canonical; search/sort variants stay `noindex, follow`. Blog pagination keeps self-canonicals. Article canonical overrides accept only the permanent origin (`https://vedic-wellness.vercel.app`). Do not fold company filters back into `/products`, and do not make search/sort variants indexable.
- **HARD REQUIREMENT — Public/private boundaries.** Product detail pages are intentionally login-gated, `noindex,nofollow`, robots-disallowed, and excluded from the sitemap. Auth/customer/admin segments are noindex. Do not "fix" these as if they were accidents.
- **HARD REQUIREMENT — Sitemap contents.** Only genuinely indexable public URLs belong in `sitemap.ts`. Do not add filtered/query variants, auth pages, or product details.
- **HARD REQUIREMENT — JSON-LD accuracy.** Structured data must describe exactly what is visible on the page (e.g., the blogs listing `blogPost` array must mirror the rendered posts). Never emit schema for content that isn't rendered.
- **CURRENT ARCHITECTURE — Internal linking.** Public pages interlink via nav/footer plus contextual links inside blog content and SEO expandable blocks. Keep anchor text descriptive; don't strip these links during redesigns.
- **RECOMMENDED PRACTICE —** when adding a public page: unique title/description/canonical/OG/Twitter + sitemap entry if it deserves indexing.

## 2. Blog rules

- **CURRENT ARCHITECTURE — One unified listing.** `/blogs` is a single chronological collection (newest → oldest, 15/page). Do NOT reintroduce a featured/latest split or a featured-posts offset (`3 + (page-1)*limit`); it caused missing/duplicated posts in both UI and JSON-LD.
- **HARD REQUIREMENT — Listing JSON-LD mirrors the visible page.** If you change what renders, update `blogPost` to match exactly.
- **HARD REQUIREMENT — Normal document flow on articles.** The article container must grow with content. Do NOT recreate the fixed-height inner scroll container (`overflow-y-auto h-[78vh]`) — it broke reading UX and TOC behavior.
- **CURRENT ARCHITECTURE — Real TOC anchors.** "On This Page" entries are `<a href="#slugified-h2">` links; heading IDs come from server-side slugify of H2 text. Preserve this; don't replace it with JS scroll management.
- **CURRENT ARCHITECTURE — Markdown image renderer.** Body images use a custom lazy-loaded plain `<img>` renderer (R2/unknown dimensions). Don't swap to `next/image` unless dimension data becomes available at authoring time.
- **RECOMMENDED PRACTICE —** follow `BLOG_AUTHORING_GUIDE.md` conventions for slugs, tags (they power Related Reading), and internal links.

## 3. Product rules

- **CURRENT ARCHITECTURE — Data-driven company filter.** The dropdown is built from `getActiveCompanies()`. "All Companies" means unfiltered `/products`. There is no hardcoded company list anywhere — keep it that way.
- **Do NOT reintroduce** segmented-pill/company-card selectors or decorative category pills (see §7).
- **HARD REQUIREMENT — Stock is informational only.** Never decrement, reserve, restore, or block orders on stock without an explicit business decision recorded in this repo. This was deliberately decided; the field exists for display.
- **CURRENT ARCHITECTURE — Company-filter SEO.** See §1 canonical rules; `?company=` listings are intentional index targets with their own canonicals.
- **CURRENT ARCHITECTURE — Sticky filter bar.** Positioning syncs to navbar hide/show through `.public-sticky-filter` CSS + the `--header-offset` variable set by `ScrollAwareHeader`. Both halves are required; removing either regresses positioning.

## 4. Order rules

- **HARD REQUIREMENT — CREATED first.** Orders are created `CREATED` with a 24h expiry window. Do not auto-confirm orders at creation; admin confirmation is the workflow.
- **HARD REQUIREMENT — No inventory semantics.** No stock decrement/reservation/locking/restoration without an explicit business decision. Do not re-add stock-based order blocking.
- **HARD REQUIREMENT — Authorization.** Customer order access/cancellation stays ownership-scoped (`where { id, userId }` / explicit `userId` checks). Admin transitions stay behind `secureAdminAction`.
- **CURRENT ARCHITECTURE — Expiry mechanism.** `expireOldOrders()` runs opportunistically on account/orders views and via the existing Vercel cron. Do not add new schedulers for it.
- **RECOMMENDED PRACTICE —** totals always computed server-side from DB prices; never trust client-sent amounts.

## 5. Authentication rules

- **CURRENT ARCHITECTURE —** email + password credentials auth (NextAuth v5, JWT sessions), Turnstile-gated signup, admin-managed roles.
- **Do NOT recreate OTP flows, verification-code emails, `/verify-required` routes, or `app/api/*otp*` endpoints.** They were removed intentionally after the auth model changed to email/password.
- **HARD REQUIREMENT —** every admin mutation keeps its `secureAdminAction` wrapper; every customer mutation keeps CSRF + ownership checks. Rate limiting fails closed by design (boot requires Redis env) — do not add bypasses.

## 6. Vercel (Hobby-oriented) considerations

- **RECOMMENDED PRACTICE —** minimize writes on GET renders; prefer tag-invalidated caches over aggressive revalidation windows; keep queries paginated/bounded; avoid new background infrastructure (extra crons, queues, long-running jobs) without evaluating the deployment plan.
- **CURRENT ARCHITECTURE —** one cron job (`vercel.json` → order expiry). Image optimization qualities are limited (`[50, 60, 75]`).

---

## 7. DO NOT REINTRODUCE

These were deliberately removed or rejected. If you find their absence surprising, it is intentional — read the rationale before "restoring" anything.

| Removed/rejected | Why | Current behavior |
|---|---|---|
| OTP authentication (`/verify-required`, verify/resend-OTP APIs, signup session codes) | Auth moved to simple email+password; OTP added friction and dead code paths | Credentials provider, JWT sessions; no OTP code exists |
| R2 download-url endpoint (501 stub) | Zero callers, no architectural purpose | Removed; uploads use `r2/upload-url` only |
| Featured/latest blog split | Caused posts to be missing from the listing grid and from listing JSON-LD; unnecessary IA complexity | Single chronological listing; JSON-LD mirrors the page exactly |
| Blog article inner scroll container | Nested scrollbar, broken deep-linking, awkward mobile UX | Normal document flow + real anchor TOC |
| Product company segmented-pill selector & decorative pills (products + blogs) | Multiple failed iterations; borders/logo visibility issues; wasted vertical space; purely decorative chips had no function | Data-driven company dropdown inside the search bar; blogs hero has heading → subtitle → content |
| Stock-based order blocking | Stock is informational per business decision; blocking created false failures | Orders validate quantity/published state only |
| Stock decrement/reservation/restoration | No real inventory system exists | Stock value never changes due to orders |
| Mock payment action ("mark paid") | Simulated payments in production-visible UI | Unpaid request flow: admin manually progresses CREATED → CONFIRMED → … |
| Automatic order confirmation at creation | Made cancellation/expiry/lifecycle dead code | Orders start CREATED (24h expiry) and progress via admin |

---

## 8. Optional / deferred work (NOT TODOs)

Nothing below is scheduled or required. Recorded so future agents understand why the code looks the way it does.

| Item | Class | Notes |
|---|---|---|
| ContactPage/LocalBusiness JSON-LD on `/contact` | optional | Nice-to-have structured data |
| Privacy/terms OG/Twitter metadata | deferred | Documented low-impact deferral |
| Sitemap chunking/index | dependent on scale | Relevant only near the 500-blog cap |
| Breadcrumb schema + visible breadcrumbs on articles | optional | SEO enhancement |
| Topic/tag archive pages | dependent on content strategy | Would create internal-linking surface; needs editorial commitment |
| Admin-code lint cleanup (~33 `no-explicit-any` errors) | optional | Quality gate; no runtime impact |
| Cookie attribute hardening (explicit NextAuth cookie config) | optional defense-in-depth | Defaults currently apply |
| Timing-safe cron secret comparison | optional defense-in-depth | Current compare is string equality |
| Cart-action rate limiting | optional defense-in-depth | CSRF + auth already mitigate |
| Customer-segment middleware matcher | optional defense-in-depth | Pages already enforce `requireUser()` server-side |
| `/orders` pagination UI + accurate stats beyond first 20 | deferred UX | Service supports paging already |
| Buy-now transaction wrapping | deferred robustness | Single create is row-atomic |
| Remove empty `components/admin/CategoryImagesField.tsx` | trivial cleanup | 0 bytes, zero importers |
| Hero GIF replacement (LCP) | planned separately | Belongs to the Home page phase |

---

## 9. Launch requirements (operational)

These are deployment/data checks, not code features:

1. **Production `NEXT_PUBLIC_SITE_URL`** must equal `https://vedic-wellness.vercel.app` in Vercel production env. The code fallback prevents a wrong origin if unset.
2. **Production marquee data** must not contain development placeholder text — managed through the admin marquee panel, not code.
