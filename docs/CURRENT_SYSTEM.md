# Vedic Wellness — Current System

**Read this document first.** It describes the production architecture as it exists today. For change rules and deliberately removed features, see [FUTURE_MAINTENANCE.md](./FUTURE_MAINTENANCE.md). Older audit documents (`FINAL_SEO_AUDIT`, `UI_ARCHITECTURE_AUDIT`, `FINAL_PRODUCT_READINESS`, `FINAL_SHIP_CHECKLIST`) are historical snapshots — their reconciliation notes explain what changed.

---

## 1. Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v3 (`darkMode: 'selector'`), CSS design tokens in `app/globals.css` |
| Data | Prisma 6 (+ Accelerate) over PostgreSQL |
| Auth | NextAuth v5 (credentials provider, JWT sessions) |
| Email | Resend (transactional/admin notifications), Brevo (newsletter contacts) |
| Bot protection | Cloudflare Turnstile (signup, contact) |
| Rate limiting | Upstash Redis + `@upstash/ratelimit` (**fails closed** — app refuses to boot without Redis env) |
| Files | Cloudflare R2 (presigned uploads, admin only) |
| Hosting | Vercel (Hobby-oriented architecture; one cron job declared in `vercel.json`) |

---

## 2. Route architecture

| Group | Routes | Access | Indexable |
|---|---|---|---|
| Public `(public)/` | `/`, `/about`, `/contact`, `/products`, `/products/[slug]`, `/products/companies`, `/blogs`, `/blogs/[slug]`, `/site-map`, `/privacy-policy`, `/terms-conditions` | Open | See §4 |
| Auth `(auth)/` | `/login`, `/signup` | Open | **noindex, nofollow** |
| Customer `(customer)/` | `/account`, `/cart`, `/checkout`, `/orders`, `/orders/[id]` | `requireUser()` per page (server-side session + fresh DB lookup incl. soft-delete check) | **noindex, nofollow** via group layout |
| Admin `(admin)/admin/*` | dashboard, products (+new/edit), blogs (+new/edit), banners (+new/edit), slides (+new/edit), marquee (+new/edit), companies, leads (+detail), orders (+detail), users (+new/edit), logs, login | `proxy.ts` ADMIN gate **and** `requireAdmin()` inside every server action | **noindex, nofollow** |
| API `/api/*` | `auth/[...nextauth]`, `contact`, `signup`, `newsletter`, `cron/expire-orders`, `r2/upload-url` | see §8 | n/a |

Middleware (`proxy.ts`) gates only `/admin/*`, `/sales/*`, and product detail paths (`/products/<slug>`, excluding `/products/companies`). Customer pages are protected by per-page `requireUser()`.

---

## 3. Authentication / authorization

- Email + password credentials auth. bcrypt cost 12 on signup. **No OTP flow exists.**
- JWT sessions (maxAge 24h); the JWT callback re-validates the user against the DB every 15 minutes and invalidates soft-deleted accounts.
- Roles: `ADMIN`, `SALES`, `VIEWER`. Accounts are admin-managed or self-signup (new signups get `VIEWER`). There is no public role escalation.
- Ownership: customer queries always filter by session user id (orders use composite `where { id, userId }`); address/cart mutations are owner-scoped.
- Admin authorization is enforced twice: middleware redirect **and** `secureAdminAction` (CSRF same-origin check + fresh `requireAdmin()` DB lookup + per-admin rate limit) inside each server action.
- CSRF: all mutations run through `assertSameOriginAction` / `assertSameOriginRequest` (Origin header, Referer fallback).
- Turnstile verification is a real server-side `siteverify` call and fails closed when the secret is missing.

---

## 4. SEO architecture

- **Global metadata** (`app/layout.tsx`): `metadataBase` from `NEXT_PUBLIC_SITE_URL` (fallback `https://vedic-wellness.vercel.app`), title template `%s | Vedic Wellness`, default OG/Twitter, Organization + WebSite JSON-LD.
- **Per-page metadata**: every indexable page has unique title/description/self-canonical plus OG/Twitter. Exceptions: privacy/terms intentionally inherit global social tags (documented deferral); `/products/companies` has no local metadata by design; `/site-map` has basic page metadata only.
- **Canonical rules**
  - `/products` → canonical `/products`. Default view is unfiltered across all active companies.
  - `/products?company=<slug>` → distinct self-canonical (genuinely different content).
  - Search/sort variants → `noindex, follow`, canonical to the nearest listing.
  - `/blogs?page=N` → self-referencing canonical per page.
  - Blog articles → `/blogs/<slug>`; admin-supplied canonical override accepted **only** for the permanent origin.
- **robots.ts**: allows `/` and `/products/companies`; disallows `/products/*` (product details are private). Includes sitemap pointer.
- **Sitemap** (`app/sitemap.ts`): 7 static URLs + published blog slugs (cap 500, cached 24h, tag-invalidated). Excludes auth/customer/admin/API/product-detail URLs.
- **Structured data**: Organization + WebSite (global); AboutPage + FAQPage on About (mirrors visible FAQ verbatim); Blog + BlogPosting on listing (maps exactly the posts shown on that page); BlogPosting per article (author/publisher/dates); ItemList on products.
- **Index strategy**: indexable = home, about, contact, products listing, blogs + articles, site-map, legal pages. Everything else noindex. Product details intentionally private (login-gated, noindex, robots-disallowed, not in sitemap).

---

## 5. Public pages (current roles)

| Page | Role |
|---|---|
| `/` | Marketing home (hero slides, philosophy, product highlights). Home content work planned separately. |
| `/about` | Company/franchise story, growth timeline, FAQ (accordion content is server-rendered and crawlable even when collapsed), two expandable SEO content blocks. |
| `/contact` | Contact channels (phone/WhatsApp/map/email), lead form (Turnstile + Zod + MX validation + sanitization), server-rendered expandable SEO content. |
| `/products` | Unified catalog across active companies: hero heading → search/filter bar (search input, company dropdown, sort, submit) → grid → pagination → expandable SEO content. The sticky filter bar follows the hide/show navbar via a synced transform (`--header-offset`). |
| `/products/[slug]` | Private catalog detail (login-gated). Stock shown as informational data only. |
| `/products/companies` | Public company directory (cards linking into filtered listings). Intentionally not an index target. |
| `/blogs` | Single unified chronological listing (newest → oldest, 15/page). No featured/latest split. |
| `/blogs/[slug]` | Markdown article in normal document flow; desktop-only sticky "On This Page" TOC built from H2 anchors; related reading driven by shared tags. |

---

## 6. Products

- **Companies** are the catalog partition. Public queries always require `published: true` and `company.active: true` — including detail and metadata lookups.
- **Company filtering** is data-driven from `getActiveCompanies()`; the dropdown lives inside the products search/filter bar. "All Companies" = unfiltered default. Selecting a company navigates to `/products?company=<slug>` (server-rendered).
- **Listing**: server-rendered, paginated (10/page), cached per page/query/sort/companySlug via tag-based `unstable_cache`.
- **Details**: login-gated via middleware; noindex; not in sitemap.
- **Stock is informational.** The product `stock` field is display data. Orders never decrement, reserve, or restore stock, and stock never blocks an order.

---

## 7. Blogs

- **Listing**: one unified collection on `/blogs`, ordered `publishedAt desc`, 15/page. There is deliberately no featured/latest split.
- **Pagination**: continuous across all published posts; each page has a self-canonical URL.
- **Article structure**: Markdown content rendered by `react-markdown` with custom renderers for H2/H3/lists/images. `##` headings become sections with anchor IDs and appear in "On This Page"; `###` renders but is not listed. Horizontal rules are intentionally not rendered.
- **TOC**: generated server-side from H2 text (slugified IDs). TOC entries are real `<a href="#anchor">` links; direct `#anchor` URLs work. Headings carry `scroll-mt-32` to clear the fixed header.
- **Images**: body images render as plain `<img loading="lazy" decoding="async">` (URLs/alt preserved; author-supplied dimensions passed through). Featured images use `next/image`. R2 is the image host and is whitelisted in `next.config`.
- **Authoring**: see [BLOG_AUTHORING_GUIDE.md](./BLOG_AUTHORING_GUIDE.md) — it documents the real admin form (plain Markdown textarea, slug pattern `[a-z0-9-]`, tags power Related Reading).

---

## 8. Orders

Lifecycle (statuses from `prisma/schema.prisma`; payment statuses are unused):

```
CREATED ──(admin confirms)──> CONFIRMED ──> SHIPPED ──> DELIVERED
   │
   ├──(customer cancels, before confirmation)──> CANCELLED
   └──(expiresAt passes)───────────────────────> EXPIRED
```

- Creation sets `status: "CREATED"` and `expiresAt = now + 24h` (`CREATED_ORDER_TTL_HOURS` in `lib/services/public/orderService.ts`).
- Customer cancellation is allowed only while `CREATED`; ownership is enforced in-query.
- Expiry runs through `expireOldOrders()` — invoked opportunistically on `/account`//`orders` views and daily via Vercel Cron (`vercel.json`, Bearer `CRON_SECRET`, fails closed).
- Admin transitions use the admin order-detail status control (all statuses except `PAID`/`PAYMENT_FAILED`).
- Totals are computed server-side from DB prices; carts store only productId+quantity.
- **Stock is NOT modified anywhere in the order flow**, and stock does not block orders.
- A customer may hold at most 3 concurrent non-expired CREATED orders.
- Rate limit: order creation 10/min/user. Cart mutations: CSRF + Zod + ownership checks.

---

## 9. Caching / performance strategy

- All public reads go through `unstable_cache` keyed by query parameters, invalidated by tags (`PRODUCTS`, `BLOGS`, `GLOBAL`, `ORDERS`, per-slug tags). Writes call `revalidateTag`.
- ISR revalidation windows: home/about/contact/legal 24h; products/blogs/articles/site-map/companies 6h; sitemap 24h.
- Listing queries batch fetches in `$transaction` with explicit `select`, bounded pagination, and count queries.
- Blog articles are statically generated (`generateStaticParams`) with 6h revalidation.
- Customer/admin pages are fully dynamic (session-dependent) and uncached.
- Known accepted trade-offs (documented, not bugs): `expireOldOrders()` runs on account/orders views; account performs ~7–8 queries/render; buy-now insert is a single create (row-atomic) rather than wrapped in a transaction.

---

## 10. Security summary

- Rate limits (per IP or user, Upstash sliding window): signup 5/min (+ per-email), contact 5/min, newsletter 5/min, r2 upload-url 20/min, order creation 10/min/user, admin actions 100/min/admin.
- Validation: Zod schemas for every public mutation; contact adds honeypot + MX check + text sanitization.
- Uploads: admin-only; folder/MIME/extension whitelists; size caps; UUID storage keys; presigned PUT (60s).
- Secrets live only in environment variables; nothing is hardcoded. Logging was audited to be free of secrets/PII.
- Cron endpoint requires `Authorization: Bearer $CRON_SECRET` and fails closed if unset.

---

## 11. External services

| Service | Role |
|---|---|
| Neon PostgreSQL | Primary database (via Prisma + Accelerate) |
| Upstash Redis | Rate limiting only. No session/OTP storage. App fails closed without it. |
| Cloudflare R2 | Product/blog/banner/slide image uploads (admin-only presigned flow) |
| Resend | Transactional admin notifications (new lead, new order) |
| Brevo | Newsletter subscriber sync (`optedIn` upsert + contact add) |
| Cloudflare Turnstile | Bot protection on signup and contact form |

---

## 12. Operational launch requirements (not code)

These are deployment/data checks owned outside the codebase:

1. `NEXT_PUBLIC_SITE_URL=https://vedic-wellness.vercel.app` must be set in Vercel production env (code fallback prevents a wrong origin if absent).
2. Production marquee data must not contain development placeholder text — managed via the admin marquee panel.

---

## 13. Related documents

- [FUTURE_MAINTENANCE.md](./FUTURE_MAINTENANCE.md) — change rules, do-not-reintroduce list, deferred work
- [BLOG_AUTHORING_GUIDE.md](./BLOG_AUTHORING_GUIDE.md) — how to write/publish blog posts
- Historical audits (context only): `FINAL_SEO_AUDIT.md`, `UI_ARCHITECTURE_AUDIT.md`, `FINAL_PRODUCT_READINESS.md`, `FINAL_SHIP_CHECKLIST.md`, `ASSET_AUDIT.md`
