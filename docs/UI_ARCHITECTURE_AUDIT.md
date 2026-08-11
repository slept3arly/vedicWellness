# VedicWellness — UI Architecture & Performance Audit

Audit date: 2026-08-10. Read-only audit of the current repository. No code was modified.

Stack: Next.js 16.1.1 (App Router), React 19.2.3, framer-motion `^12.24.10` (classic package — `motion/react` is **not** installed), next-auth 5 beta, next-themes, lucide-react, react-markdown, Tailwind CSS v3 (`darkMode: 'selector'`), Prisma 6 + Accelerate, Cloudflare R2 (presigned uploads), sonner toasts, Vercel.

---

## 1. Public UI

### 1.1 Route / page structure

| Route | Server shell | Client layer | Path |
|---|---|---|---|
| `/` | `app/(public)/page.tsx` | home sections (all client) | `components/public/home/*` |
| `/products` | `products/page.tsx` (fetch + filter) | `ProductsClient.tsx` | — |
| `/products/[slug]` | `products/[slug]/page.tsx`, `[slug]/layout.tsx` (passthrough) | `SlugClient.tsx` + product components | — |
| `/products/companies` | `companies/page.tsx` (server-only, no client) | — | — |
| `/about` | `about/page.tsx` (FAQ JSON-LD) | `AboutClient.tsx` | — |
| `/contact` | `contact/page.tsx` | `ContactClient.tsx` | — |
| `/blogs` | `blogs/page.tsx` (featured + paginated fetch, Blog JSON-LD) | `BlogsClient.tsx` | — |
| `/blogs/[slug]` | `blogs/[slug]/page.tsx` (static params, BlogPosting JSON-LD) | `SlugClient.tsx` (react-markdown) | — |
| `/privacy-policy` | `privacy-policy/page.tsx` | `PrivacyClient.tsx` | `app/(public)/privacy-policy/` |
| `/terms-conditions` | `terms-conditions/page.tsx` | `TermsClient.tsx` | `app/(public)/terms-conditions/` |
| `/site-map` | `site-map/page.tsx` (server-only) | — | — |

All route data is fetched server-side; client layers receive serializable props. No page performs client-side data fetching (`fetch`/SWR/React Query are not used for page data).

### 1.2 Layout system

`app/layout.tsx` is a **server component**:

- Fetches `[getActiveBannerCached(), auth()]` in parallel on every request.
- Loads 4 Google font families via `next/font` (`playfair`, `montserrat`, `lato`, `cormorant`) exposed as CSS variables — 4 families on every page.
- Defines `metadataBase`, global Organization/WebSite JSON-LD (`beforeInteractive`), `<main className="pt-[7.5rem] pb-28 md:pb-0">` (top padding compensates for the fixed navbar + marquee).
- `Providers` (client): `SessionProvider` (refetchOnWindowFocus:false) → `ThemeProvider` (system default) → `MenuProvider`.
- Fixed top layer (`z-40`): `Navbar` (client, memoized) + `MarqueeBanner` (server, CSS marquee).
- `PromotionModal` (client, once-per-session, `AnimatePresence`), `RouteLoader` (CSS bar), `Toaster`.
- `DeferredFooter.tsx` is a re-export of `Footer.tsx` (client, memoized). The "deferred" buffering is a naming convention only — it is still rendered inline in the root tree.
- `BottomNavbarClient.tsx` (`next/dynamic`, SSR-off) wraps the mobile `BottomNavbar` (client, memoized, CSS motion classes + `prefers-reduced-motion` media query).

### 1.3 Homepage composition

`app/(public)/page.tsx` (server component, 24h revalidate) composes only static/section components. The entire fold below the hero is a stack of **client** sections:

| Order | Section | Client? | Animation |
|---|---|---|---|
| 1 | `Hero` | client (266 lines) | none Framer; hero GIF via `MediaSlider` (CSS) |
| 2 | `Philosophy` | client (414 lines) | native horizontal scroll rail (Step 6; drag fan removed) + row-3 expand + modal |
| 3 | `MediaShowcase` (HOME_HERO) | server (fetches slides) → `MediaSlider` client | CSS translate rail |
| 4 | `TrustStrip` | client | CSS marquee (duplicated items) |
| 5 | `FranchiseBenefits` | client | none (stagger removed) |
| 6 | `StatsFloating` | client | none (stagger removed) |
| 7 | `MediaShowcase` (HOME_SECONDARY) | server → client | CSS |
| 8 | `Categories` | client | none (stagger removed) |
| 9 | `Testimonials` | client | none (stagger removed) |
| 10 | `MediaShowcase` (FESTIVAL_BANNER) | server → client | CSS |
| 11 | `TrustStrip` (repeat) | client | CSS |
| 12 | `HowItWorks` | client | none (stagger removed) |
| 13 | `CTABanner` | client | none (stagger removed) |

Only `MediaShowcase` fetches live data (slides). Everything else (testimonials, stats, categories, philosophy copy) is **hard-coded client JSX**, so the homepage is server-rendered but every section hydrates as a client component. Trust logos/stats/categories/testimonials are static marketing data — they could be server components.

### 1.4 Products listing (`/products`)

- Server page: validates `page/query/sort/company`, enforces `effectiveCompany`, `notFound()` on invalid company/page, renders ItemList JSON-LD.
- `ProductsClient` (client, 300 lines) owns: company banner / "Browse Other Products" CTA, chip row, **sticky filter bar** (search + hidden sort select + submit), product grid, pagination.
- Filtering = `router.push` to a new URL (a full server round-trip). The grid is a plain `div` (grid `animate`/stagger removed) — no re-animation on filter/page change.
- `anchorToFilter` uses `getBoundingClientRect()` + `window.scrollTo({behavior:"smooth"})` on a `requestAnimationFrame`.
- Product links use `prefetch={false}`.

### 1.5 Product detail (private, `/products/[slug]`)

- Server page: auth-gated by middleware; fetches product/related/cart; metadata + `noindex`.
- `SlugClient` (client, 224 lines): page sections with no entrance animation (page-level stagger + section whileInView staggers removed).
- Product sections — all client:
  - `ProductHero` (client): no motion (mount stagger removed).
  - `ProductCarousel` (client): CSS only.
  - `ProductDetailsAccordion` (client): `AnimatePresence` height 0→auto (4 items); scroll reveal removed.
  - `ProductFAQ` (client): height accordion; scroll reveal removed.
  - `ProductSpecification`, `ProductReviews`, `ProductRelated` (client): no motion (whileInView staggers removed).
  - `ProductPurchaseCard` (customer): qty stepper + `useTransition` cart/buy-now actions (additional mounted on this route).

### 1.6 Product/company browsing

`/products/companies` is a **server-only** page (no client file, no motion, no metadata). Lists active companies (excluding vedic-wellness) as `Card` links to `/products?company=<slug>`. Public — exempted from the product-detail login gate in `proxy.ts`.

### 1.7 About

- Server page emits FAQPage JSON-LD.
- `AboutClient` (client, 322 lines): chips + story/sections + FAQ accordion (5 items, `AnimatePresence` height 0→auto); scroll-reveal staggers removed. Static copy in a client component.

### 1.8 Contact

- `ContactClient` (client, 380 lines): chips, enquiry card (Turnstile + form), quick-contact/office info columns; whileInView staggers removed. Submission posts to `/api/contact`. Static copy + interactive form in one large client.

### 1.9 Blogs

- Listing: server page fetches featured (3) + paginated list via `getPublicBlogsService(page)`, emits Blog JSON-LD. `BlogsClient` (client, 243 lines): featured + latest grids, no motion (mount stagger keyed per page removed).
- Detail: server page with `generateStaticParams`, BlogPosting JSON-LD, canonical-constrained metadata. `SlugClient` (client, 268 lines): article `Card`, `react-markdown` content with a **reading-position scroll progress treatment** (`contentRef` measurement), related blogs.

### 1.10 Other public routes

- `/privacy-policy`: `PrivacyClient` (client, 298 lines) — a plain `div` wrapping a **client-side 70vh scroll container** of static legal text (fade wrap removed).
- `/terms-conditions`: `TermsClient` (client, 218 lines) — same pattern, 85vh scroll container.
- `/site-map`: pure server page (no client).

### 1.11 Shared public UI components (usage counts from repo scan)

| Component | Importers | Notes |
|---|---|---|
| `PageHeader` | 49 | static header (badge/h1/p) — motion removed |
| `Card` | 39 | plain `div` primitive (motion `layout`/hover removed) |
| `SectionHeading` | 27 | text heading |
| `Button` | 15 | plain `button`, `useFormStatus` auto-loading, spinner; tap scale via CSS `active:` |
| `Chip` | 8 | pill |
| `Section` | 1 | minimal wrapper |
| `MediaSlider` | 2 | Hero + MediaShowcase |
| `Input` | 0 | **unused** |
| `Badge` / `CardIcon` / `AnimatedCard` / `FloatingIcon` / `FanCarousel` | 0 | see §4 dead code |

---

## 2. Customer UI

### 2.1 Auth (login / signup)

Identical mirrored architecture — server shell (metadata + `noindex`) → thin client page wrapper (chips + card, motion fade) → `Suspense`-wrapped form:

- **Login**: `LoginForm` (client) uses `next-auth/react` `signIn` (no server action), plain refs + `useState`, toasts, `setTimeout` redirect. `loading.tsx` = CSS `ribbon-loader`.
- **Signup**: `SignupForm` (client) POSTs to `/api/signup` route handler, Cloudflare Turnstile token gates submit, manual name/email/password validation.
- No `useActionState`, no react-hook-form in either.
- `loading.tsx` is byte-identical across login, signup, and the customer group (3 duplicates).

### 2.2 Account (`/account`)

Consistent server→client pattern:

- Server page: `requireUser()`, **`expireOldOrders()` DB write on every GET**, `Promise.all` of 6 reads (addresses, orders, order count, total spent, last order, `getOrCreateCart` — creating a cart as a side effect of viewing).
- `AccountClient` (client, 119 lines): mounts page-level stagger, composes profile card, 2 stat cards, pending orders card, last-order banner, address list, activity chart, recent orders.
- `AddressList` (client): controlled/uncontrolled open state, direct server-action calls, 5-address cap, empty state.
- `AddressFormModal` (client): `createPortal` to body, hydration-safe `mounted` gate + body scroll lock, plain-state validated form. **No animation** on open/close.
- `AccountActivityChart` (client but hook-free): hand-rolled 14-day CSS stacked bar chart (no chart lib, static bars).
- Server actions: `add/update/delete/setDefaultAddress` via `secureUserAction` + zod + `revalidatePath("/account")`.

### 2.3 Cart (`/cart`)

- Server page fetches cart; `CartClient` (client) is pure layout: empty → `<EmptyCart />` (server comp, renders own `<main>`); else heading + items card + sticky summary.
- `CartItemsCard` (client): per-row `useTransition` ×2 (qty + remove), server actions → toast → `router.refresh()` (no `revalidatePath` — relies on client refresh). Qty clamp 1–20 (header copy still says max 15).
- `CartSummaryCard` (client): totals; `showCheckoutButton` prop reused by checkout (`false` = spacer). Reuse win.
- Empty state duplicated in `EmptyCart`, `orders/page.tsx`, `RecentOrdersCard`, `PendingOrdersCard`, `LastOrderBanner`, `AddressList` — 6 separate empty-state implementations.

### 2.4 Checkout (`/checkout`)

- Server page: `requireUser()`; **two modes** — buy-now (`buyNow=true`) synthesizes a single-item cart from `getBuyNowProduct`, else `getCartForCheckout` + `getDefaultAddress`; redirects for empty cart.
- `CheckoutClient` (client, 283 lines): single `useTransition` Place Order → `createOrderAction` → toast → `router.push('/orders/<id>')`. Address card is hard-coded inline (does not reuse `AddressList`). Right rail reuses `CartSummaryCard showCheckoutButton={false}`.
- **There is no dedicated order-confirmation screen.** Confirmation is the `/orders/[id]` page (`OrderStatusBanner` + `OrderTimelineCard`) reached by redirect.
- Server action: `createOrderAction` = `secureUserAction` + rate limit + `createOrderSchema` + admin email notification + `revalidateTag`.

### 2.5 Orders

- List (`/orders`): **fully server-rendered** — the only customer screen with no client wrapper. Inline status-map pill list, stats strip, empty state. CSS only.
- Detail (`/orders/[id]`): server `notFound`-style redirect; `OrderDetailsClient` (client) = cancel (native `confirm()`, server action, `router.refresh()`), status banner, 4 info cards.
- Order components: `OrderStatusBanner` (client — **most animated customer component**: scaleIn + accent bar `scaleX 0→1` + staggered fades), `OrderTimelineCard` (server, CSS pulse), `OrderItemsCard` / `OrderShippingCard` / `OrderMetaCard` (server, presentational).

### 2.6 Cross-cutting

- Server actions all wrapped by `secureUserAction` (CSRF + session + DB-lookup).
- `CustomerButton` (client) — thin wrapper of public `Button` (adds sizing, `ignoreFormStatus`), used in 6 files. Structurally parallel to `AdminButton` (see §4).
- Status/pill logic duplicated in 4 places (orders list, `RecentOrdersCard`, `OrderStatusBanner`, `OrderTimelineCard`) with subtle label drift (e.g., CONFIRMED called "Received" vs "Confirmed").
- `pendingCount` filter `["CREATED","CONFIRMED"].includes(...)` repeated in 3 files.
- INR/date `Intl` formatting re-declared inline in ≥5 files.
- Qty stepper (1–20 clamp) duplicated between `CartItemsCard` and `ProductPurchaseCard`.

---

## 3. Admin UI

### 3.1 Layout & navigation

- `app/(admin)/admin/layout.tsx` (server): `requireAdmin()` gate, side element rendered as `<AdminTabs />` with **no props → renders `null`**. The admin "sidebar" is effectively dead code (see §4). Navigation is the dashboard tile grid.
- `admin/page.tsx` (server): static dashboard of 10 link tiles + System Tools card with `PurgeCacheButton`. No live stats/charts.
- `admin/loading.tsx` (client): CSS ribbon loader.
- 404/empty handling is inconsistent across areas (`notFound()`, thrown `Error`, inline `<div>Not found</div>`).

### 3.2 List clients — the dominant admin pattern

All 9 list screens (Products, Orders, Leads, Blogs, Banners, Slides, Marquee, Users, Logs) share one near-identical **card-grid** pattern (no tables anywhere):

1. `PageHeader` + right column (`AdminPagination` + Sync `AdminButton` + optional "New X" Link)
2. Search block: `AdminCard` + search input + `AdminSearchFilters` (per-area options; date fields for orders/leads)
3. Result grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` + `isPending` dim
4. Tile: `AdminCard` + `AdminBadge` + meta + Edit Link + toggle/delete `<form>` with native `confirm()`, ID footer

The state/effect boilerplate (`isPending`, `inputValue`, `filters`, `navigateTo` URLSearchParams builder, prop-sync effects, `handlePageChange`, `handleClear`) is copy-pasted **~130–150 LOC per client × 8 files**. `AdminPagination` (9 files) and `AdminSearchFilters` (8 files) are the two genuinely shared pieces. Empty states exist in products/blogs/banners/slides/users but are **missing in orders, leads, marquee, logs**. `AdminLogsClient` has a decorative Export button with no `onClick`.

### 3.3 Detail clients & forms

- Detail screens (Orders, Leads) host **uncontrolled `<form action={serverAction}>`** + `<select>` status controls; pending state comes free from `Button`'s `useFormStatus`. No client state.
- Form pairs (`new/*` vs `edit/*`) duplicate the same scaffold (`F` label primitive, `Sec` AdminCard section, shared class strings, `useTransition` + `FormData` + toast + `NEXT_REDIRECT` guard). Measured overlap: Product ~70–75%, Banner ~85%, Blog ~85%, Marquee ~95%, User ~70%, Slide ~60%. `ProductEditForm` (414 lines) and `ProductNewForm` (281) also duplicate the full field set.
- No `useActionState`; validation is native HTML + server-side zod; controlled state marshalled into the server action via **hidden inputs** (`imageUrl`, `galleryText`, `variantsJson`, `thumbnailUrl`, `imageDesktopUrl/ImageMobileUrl`).
- `SlideNewForm`/`SlidesEditForm` use a different, rougher style (raw `.input`/`.admin-btn` classes) vs the polished forms — two styling dialects in the same module.
- `companies/page.tsx` is server-only: inline create/rename/toggle uncontrolled forms with `?status=` flash messages (no client, no toast, no `useTransition`).

### 3.4 Uploads — 4 competing implementations

- `R2Upload` (generic) — used **only** in Banner forms.
- `ProductImagesField` (validate webp/avif ≤512 KB, cover + gallery, reorder).
- `BlogImagesField` (single thumbnail, **no** client validation).
- `SlideImagesField` (desktop/mobile, uploads to the **`banners`** R2 folder — shared namespace).
- `CategoryImagesField.tsx` is a 0-byte dead file.

All presigned flows: POST `/api/r2/upload-url` → PUT → public URL.

### 3.5 Client/server boundary

Consistent everywhere: server `page.tsx` owns all reads (direct `@/lib/db/*` calls — reads never go through server actions, per an explicit comment in `products/serverActions.ts`); `"use server"` actions wrapped by `secureAdminAction` own all writes; client components own filtering/state and submit via `<form action>` or intercepted `onSubmit` + `useTransition`.

### 3.6 Animations in admin

No admin file imports framer-motion directly. Motion reach is transitive via `AdminButton → Button` (plain `button` since Step 5; `PageHeader` no longer uses motion). CSS: `animate-spin` (Sync/Purge spinners), `animate-pulse` (badge dots), `animate-in fade-in slide-in-from-top-1` (Users inline role editor — the only `tailwindcss-animate` use), ribbon loader.

---

## 4. Component Architecture

### 4.1 Shared components (existing wins)

- `public/ui/Button` — the universal button (15 importers incl. admin/customer wrappers). `useFormStatus` auto-pending + spinner + motion tap.
- `public/ui/Card` + `PageHeader` + `SectionHeading` — most-used primitives.
- `admin/AdminPagination` (9), `admin/AdminSearchFilters` (8), `admin/AdminBadge`, `admin/AdminCard`.
- `MenuContext`, `AppProviders`, shared `animations.ts` — cross-cutting infra.

### 4.2 Duplicated components / patterns

1. **Admin list-client boilerplate** — ~130–150 copied LOC in 8 of 9 `Admin*Client` files.
2. **Admin form scaffold** — `F`/`Sec`/class strings + submit wrapper copied into 8 forms; new/edit pairs ~70–95% identical.
3. **Order status config/pill logic** — 4 copies with label drift.
4. **Empty states** — 6+ custom implementations (customer) + 4 missing (admin).
5. **`loading.tsx` ribbon loader** — 3 byte-identical copies.
6. **INR / date formatting** — inline in ≥5 files.
7. **Qty stepper** — 2 copies (cart row, ProductPurchaseCard).
8. **Trust/guarantee chips** — overlapping copy in login/signup/empty-cart/cart-summary.
9. **Card-with-header/body envelope** — `Card className="p-0"` + border-b header + icon + rows repeated across CartItemsCard, CartSummaryCard, CheckoutClient, OrderItemsCard, OrderMetaCard, OrderShippingCard, OrderTimelineCard.

### 4.3 Overly large components

- `Philosophy.tsx` 414, `ContactClient.tsx` 380, `AboutClient.tsx` 322, `PrivacyClient.tsx` 298, `ProductsClient.tsx` 300, `AdminProductsClient.tsx` 363, `AdminBlogsClient.tsx` 363, `AdminUsersClient.tsx` 348, `AdminBannersClient.tsx` 314, `AdminSlidesClient.tsx` 308, `BlogsClient.tsx` 243, `Hero.tsx` 266, `Navbar.tsx` 255, `PromotionModal.tsx` 257, `CheckoutClient.tsx` 283, `BlogSlugClient.tsx` 268.

### 4.4 Components doing too many things

- `ProductsClient` — company banner + clarifying chips + sticky search/sort bar + animated grid + pagination + smooth-scroll anchoring in one component.
- `Hero` — hero copy/read-more + stat card + feature list + certification badges + CTAs.
- `Navbar` — navigation links + logo + auth-aware buttons + mobile fullscreen menu + scroll lock.
- `ContactClient` — awareness chips + enquiry form + contact info columns.
- `AboutClient` — brand story + features + FAQ accordion.
- `Card` — data container + hover lift + layout animation (mixed display and motion responsibilities).

### 4.5 Tightly coupled

- `CartSummaryCard` reuse hooks on a `showCheckoutButton` boolean (reasonable but layout-sensitive).
- `CartClient` early-returns `EmptyCart`, which renders its own `<main>` — component owns page shell.
- `CheckoutClient` hard-codes its address card instead of reusing the `AddressList`/`AddressFormModal` machinery.
- `ProductsClient` bakes the "Browse Other Products" link logic inline.
- Home sections previously re-declared nearly identical whileInView stagger scaffolding vs. a shared `Section`/`Reveal` wrapper (`Section` exists but has 1 importer). **Moot since Step 5** — all public whileInView staggers were removed.

### 4.6 Unnecessary abstractions / dead code

- **Dead code (0 importers):** `AnimatedCard`, `FloatingIcon`, `CardIcon`, `FanCarousel`, `public/ui/Input`, and the 0-byte `CategoryImagesField`.
- **Shim indirection:** `CardGallery` re-exports `PhilosophyGallery`; `FeatureModal` re-exports `PhilosophyFeatureModal` — extra modules for no behavior.
- **Redundant wrappers:** `AdminActionButton` (adds only an icon prop to `AdminButton`); `CustomerButton` vs `AdminButton` are two parallel wrappers over the same `Button` (variant vocab + sizing could be one parameterized wrapper).
- **Dead navigation:** `AdminTabs` (renders `null` with no props) is used as the admin "sidebar" in `admin/layout.tsx`.
- **Unused global animation exports:** `pressHold`, `zLiftIcon`, `zLiftSpring`, `cardInteraction`, `cardIconGlow` have no verified consumers (dead API surface).

---

## 5. Framer Motion Audit

### 5.1 Package & loading

- `framer-motion` classic bundle imported directly in **38 files**. `LazyMotion`/`domAnimation` code-splitting: **0 usages**. `app/Providers.tsx` does **not** wrap anything in `MotionConfig` or `LazyMotion`. The full library ships on essentially every route (public, customer, blog pages, and transitively admin via `Button`/`PageHeader`).
- `useReducedMotion` / `MotionConfig reducedMotion` / `prefers-reduced-motion` handling inside Framer Motion: **0 usages** (the only reduced-motion handling is a CSS media query in `globals.css` for marquee/route-loader/float and in `BottomNavbar`).

### 5.2 Usage inventory

| Metric | Count |
|---|---|---|
| Files importing framer-motion | 18 (was 38) — public active: 6 (accordions, modals, Philosophy carousel/modal); rest are auth/customer routes + dead code |
| Static `motion.*` occurrences | ~240 → ~90 source lines (only kept functional motion: accordions, modals, Philosophy expand/modal) |
| `whileInView` usages | 17 → **0** |
| `useScroll` / `useTransform` / `useSpring` / `useMotionValue` / `useInView` / `useAnimation` | **0** |
| `AnimatePresence` files | 7 → 5 (AboutClient, ProductDetailsAccordion, ProductFAQ, Philosophy, PhilosophyFeatureModal, PromotionModal) |
| `layout` / `layoutId` | `layout` on `Card` removed; `layout="position"` on Philosophy mobile fan removed (Step 6); `layoutId` = 0 |
| Continuous `repeat: Infinity` FM loops | 0 (infinite loops are CSS-only: marquee, spinner, `animate-float` in tailwind config; `animate-marquee` in globals) |
| `drag` | **0 shipped** (Philosophy fan removed in Step 6; only dead, unimported `FanCarousel` remains) |

### 5.3 Trigger classification (representative, post-cleanup)

- **`initial`/`animate` mount staggers** (out of public scope — auth/customer only): LoginClient, SignupClient, AccountClient, CartClient, CheckoutClient, OrderStatusBanner (incl. `scaleX 0→1` accent bar).
- **`whileInView` (once:true)**: **0 remaining** — all public scroll-reveal staggers removed (was: PageHeader, ContactClient, AboutClient, Categories, CTABanner, FranchiseBenefits, StatsFloating, HowItWorks, Testimonials, Philosophy, ProductSpecification, ProductDetailsAccordion, ProductFAQ, ProductReviews, ProductRelated).
- **State-toggled + AnimatePresence height**: AboutClient FAQ, ProductDetailsAccordion, ProductFAQ (`height 0→auto`), Philosophy row-3 `maxHeight` expand + modal; PromotionModal + PhilosophyFeatureModal (AnimatePresence enter/exit).
- **Hover/tap**: home image cards (CSS `group-hover` scale), Button tap (CSS `active:scale-[0.97]`). Framer `whileHover`/`whileTap` removed from `Card`/`Button`/home cards.
- **Gesture**: **none shipped** — Philosophy mobile fan (`drag="x"`) removed in Step 6; `FanCarousel` (dead).

### 5.4 Expense classification

| Usage | Continuous | Layout-affecting | Expensive? |
|---|---|---|---|
| Home section whileInView staggers | — | — | Removed (Step 5) |
| `Card` `layout` prop | — | — | Removed (Step 5) |
| Products grid `AnimatePresence mode="wait"` re-key per filter/page | — | — | Removed (Step 5) |
| PDP (SlugClient + 6 child sections) compound mount + whileInView | — | — | Removed (Step 5) |
| Accordions (`height 0→auto`) | No | Yes (by design) | Moderate (reflow per open) |
| Philosophy image rail | No | No | Light (native scroll-snap, no motion) |
| Marquee / RouteLoader / spinner | **Yes (CSS)** | No | Cheap (CSS) |

No scroll-triggered motion remains in the public app. **All scroll-sensitive Framer code was removed (Step 5); the remaining Framer usage is state-driven only** (accordions, modals, carousel), so there is no scroll-listener / IntersectionObserver cost from Framer Motion today.

### 5.5 Implementation notes — global Motion infrastructure (2026-08-11)

**Step 1 — `LazyMotion` + `MotionConfig` in `app/Providers.tsx`:**

- Wrapped the existing provider tree in `<LazyMotion>` and `<MotionConfig reducedMotion="user">` (Framer Motion `^12.24.10`, classic `framer-motion` package).
- `MotionConfig` sits outermost, then `LazyMotion`, then the unchanged `SessionProvider → ThemeProvider → MenuProvider` order. No provider behavior or ordering changed.
- Purpose: global reduced-motion policy (`prefers-reduced-motion` → transform/opacity only) with zero per-component work, plus the single split point the audit recommends (§8.1.3). Existing CSS `prefers-reduced-motion` rules in `globals.css`/`BottomNavbar` are untouched and coexist.
- At Step 1, `motion.*` imports were intentionally left unchanged (38 files preload the full `featureBundle` at module scope).

**Step 2 — migrated all runtime `motion.*` usage to the LazyMotion-compatible `m` API:**

- **Files migrated: 36** (every application file importing `motion` as a runtime value; `app/animations.ts` and `components/customer/CustomerButton.tsx` import only types and were left unchanged; `app/Providers.tsx` already on `LazyMotion`).
- **Old pattern:** `import { motion, … } from "framer-motion"` + `motion.div`/`motion.header`/`motion.p`/`motion.button`/`motion.h1`/`motion.a`/`motion.span` (240 component tokens; classic `motion` preloads the full feature bundle at module scope).
- **New pattern:** `import { m, … } from "framer-motion"` + `m.div`/`m.header`/… (`m` components are created with no preloaded features; features now load only via `LazyMotion`). `AnimatePresence`, `Variants`/`Transition`/`MotionProps` (types), and `MotionConfig` untouched.
- **Features required: `domMax`** (not `domAnimation`). `domAnimation` covers animation, `exit`/`AnimatePresence`, `whileInView`, hover, tap, focus — but **not** `drag` or `layout`. `Card` (`layout`) and `Philosophy` (`drag="x"` + `layout="position"`) require those, so `app/Providers.tsx` now passes `<LazyMotion features={domMax}>`. `domMax` (= `domAnimation` + `drag` + `layout`) is the minimum package-exported feature bundle preserving all behavior; there is no granular `layout`-only/`drag`-only export. A future downgrade to `domAnimation` is a one-line change once `Card`'s `layout` and any drag/layout use are removed.
- **Full feature bundle still loaded: yes, by design.** `domMax` == the same feature set the classic `motion` proxy preloaded (animations + gestureAnimations + drag + layout), so there is **no net JS reduction yet**. What changed: no application file imports the classic `motion` proxy anymore, and feature loading is now centralized in `LazyMotion`. Evidence: built client chunks contain the drag/layout markers (`dragConstraints`, `onDragStart`, `ProjectionNode`, `layoutId`) in a single module set with no duplicate copy, and zero `import { motion }` remains in `app`/`components`. The `domAnimation` byte win is blocked by `Card`'s `layout` + Philosophy's `drag` and is deferred to the Card step.
- **Verification:** `npm run typecheck` passes; targeted `eslint` on all migrated files reports only pre-existing findings (unrelated to this change); one `next build` succeeds with no errors/warnings.

**Step 3 — removed `layout` from the universal `Card`:**

- Removed the bare `layout` prop from `components/public/ui/Card.tsx` (audit P1-3; the item line and its FLIP box-measurement cost). Card retains appearance, `whileHover` lift (transform-only), spring `transition`, `willChange: "transform"`, className/appearance, children, and its `forwardRef` props/API unchanged. No replacement animation was added.
- **Providers NOT switched to `domAnimation` — `domMax` retained.** After removal, verification shows `Philosophy.tsx:247-252` still uses `layout="position"` and `drag="x"` (with `dragConstraints`/`dragElastic`/`onDragStart`/`onDragEnd`), both features outside `domAnimation`. Downgrading would silently disable the retained Philosophy fan gesture, so the gate ("only if no remaining usage requires layout/drag") is not met. `domAnimation` becomes viable only once Philosophy's drag/layout is handled.
- Other layout/drag: dead, unimported `FanCarousel.tsx` (`drag`) and `AnimatedCard.tsx` (no motion `layout`); `contain: "layout paint"` instances are CSS, not motion props. No Card caller depends on the removed `layout` behavior (grid re-keying in products/blogs runs entrance staggers only).
- **Verification:** `npm run typecheck` passes; targeted `eslint` on `Card.tsx` + `app/Providers.tsx` passes clean; `next build` compiled successfully (42/42 static pages, exit 0).

**Step 4 — removed the Products grid teardown/re-stagger:**

- `app/(public)/products/ProductsClient.tsx`: removed `AnimatePresence mode="wait"`, the changing `key={grid-${query}-${sort}-${page}}`, and `exit="hidden"` from the grid (audit P1-4). The `AnimatePresence` import was removed.
- **Retained:** one-time mount entrance — grid `m.div` keeps `variants={staggerSlow} initial="hidden" animate="show"`, cards keep `key={p.id}` + `variants={fadeUpSoft}`, empty-state keeps its opacity fade-in. On search/sort/company/page navigation the grid element is now stable, so React reconciles children in place: no full unmount, no exit animation, no N-card re-stagger. New/changed cards fade up individually; persisting cards stay static. No layout animation, no scroll-linked animation.
- **Behavior unchanged:** search, sorting, company filtering, pagination, URL construction (`buildHref`/`handleFilter`/`handleGlobalClear`), `anchorToFilter` smooth-scroll, server fetching, `totalCount`/page UI, SEO metadata, and ItemList JSON-LD (server-side, untouched).
- **Verification:** `npm run typecheck` passes; `eslint` on `ProductsClient.tsx` clean; `next build` compiled successfully (42/42 static pages, exit 0).

### 5.6 Benchmark — bundle before/after Steps 1–5 (2026-08-11)

Measured from `next build` output (turbopack) on identical source via `git stash` A/B, by summing `du -sb .next/static/chunks`.

| Metric | Before (pre-cleanup) | After (Steps 1–5) | Δ |
|---|---|---|---|
| Total client JS in `.next/static/chunks` | 2,115,849 B | **1,929,594 B** | **−186,255 B (−8.8%)** |
| Classic `motion` proxy per-route bundles (baseline: two 173,984 B chunks containing `motion.dev`/`whileInView`) | present | **absent** (single shared `domAnimation` chunk) | removed |
| Shared framer-motion chunk (via `Providers` LazyMotion) | — | 127,544 B `domMax` → `domAnimation` (Step 6), one copy, all routes | +1 shared chunk |
| Next/React runtime chunk | 227,520 B | 227,520 B (identical) | 0 |

Interpretation:

- The cleanup **reduced** total client JS by ~186 KB (−8.8%). The pre-cleanup build shipped per-route copies of the classic motion bundle (the two 173,984 B chunks); the post-cleanup build consolidates motion into a single `LazyMotion` chunk in `Providers` (now `domAnimation` after Step 6). **No bundle-size regression from Steps 1–6.**
- The framer-motion footprint was dominated by the `domMax` feature bundle in `Providers` (shared across all routes). With the Philosophy fan removed (Step 6), the app no longer needs drag/layout, so `LazyMotion` was downgraded to `domAnimation` (drag feature module dropped from the bundle; total JS 1,878,558 → 1,875,632 B).
- Consequence for reported performance complaints (Philosophy scroll lag, `/products` navigation, `/admin` load): none of these are attributable to the animation cleanup — the bundle is smaller and no scroll observers remain. The realistic causes are pre-existing and separate (see §6 P1-2 marketing-client hydration, P1-5 MediaSlider/GIF/images, P2-9/10 uncached reads, plus dynamic `/products` `searchParams` + uncached `getActiveCompanies()` on every render and admin `requireAdmin()` auth+DB round trip per render).


- **Files cleaned (public):** `ProductsClient`, `ProductHero`, `ProductSpecification`, `ProductReviews`, `ProductRelated`, `ContactClient`, `AboutClient`, `PrivacyClient`, `TermsClient`, `BlogsClient`, blog `SlugClient`, product `SlugClient`, `PageHeader`, `Philosophy` (decorative wrappers only), `FranchiseBenefits`, `StatsFloating`, `Categories`, `Testimonials`, `HowItWorks`, `CTABanner`.
- **Shared primitives de-motioned:** `Card` → plain `forwardRef` `div` (hover lift + spring transition removed; CSS `group-hover` shadow/glow kept). `Button` → plain `button` (spring tap removed; CSS `active:scale-[0.97]` kept). Both drop `MotionProps` from their prop types; no caller passed motion props (verified by grep).
- **Retained (functional motion only):** accordions (`AboutClient` FAQ, `ProductDetailsAccordion`, `ProductFAQ` — `AnimatePresence` height 0→auto), modals (`PhilosophyFeatureModal`, `PromotionModal`), and `Philosophy`'s mobile drag-fan, row-3 `maxHeight` expand, and card `whileHover`. `Categories` `<a>` converted to `next/link` `Link` (lint fix). Minor pre-existing lint fixed en route (`icon: any` → `LucideIcon` in AboutClient; unused `err` in ContactClient).
- **Result:** framer-motion importers 38 → 18 repo-wide (public active: 6 — AboutClient, Philosophy, PhilosophyFeatureModal, PromotionModal, ProductDetailsAccordion, ProductFAQ; the rest are auth/customer routes or dead, unimported files `AnimatedCard`/`CardIcon`/`FanCarousel`/`FloatingIcon`). No scroll observers remain in the public app; remaining Framer usage is state-driven only.
- **Verification:** `npm run typecheck` passes; targeted `eslint` on every changed file is clean; `next build` compiled successfully (42/42 static pages, exit 0). (Builds intermittently hit a `next/font`/turbopack fetch race for `fonts.gstatic.com` in this environment — unrelated to these changes; retry succeeds.)

**Step 6 — replaced Philosophy fan/carousel with a native horizontal scroll rail; downgraded `domMax` → `domAnimation` (2026-08-11):**

- **Fan/carousel removed.** `Philosophy.tsx` dropped the Framer Motion mobile drag-fan (`drag="x"` + `layout="position"` + `dragConstraints`/`dragElastic`/`onDragStart`/`onDragEnd`) and the separate desktop whileHover rail. Both are replaced by a single native horizontal scroll rail for **all** breakpoints: `overflow-x-auto` + `snap-x snap-mandatory` + `snap-start` cards, `carousel-scrollbar` (existing CSS scrollbar styling, visible track + thumb), no Framer Motion, no JS scrolling. Card widths `w-[265px] sm:w-[290px] lg:w-[320px]` (narrower than the mobile container, so a sliver of the next card is visible). Card content (image, gradient, icon, title, summary) and click-to-open modal behavior are unchanged.
- **Result:** the last shipped drag/layout usage is gone. `Philosophy.tsx` now uses framer-motion only for the row-3 `maxHeight` expand and the modal `AnimatePresence` enter/exit — both supported by `domAnimation`. Remaining repo drag/layout: only dead, unimported `FanCarousel.tsx`.
- **Providers safely changed.** `app/Providers.tsx`: `<LazyMotion features={domMax}>` → `<LazyMotion features={domAnimation}>` (framer-motion 12.26.2: `domAnimation` = `animations` + `gestureAnimations`; `domMax` adds `drag` + `layout`). Verified no shipped component requires drag/layout (only dead `FanCarousel` references them), so `domAnimation` is sufficient. The drag feature module dropped out of the built chunks; the residual `ProjectionNode`/`layoutId` strings in one shared chunk are framer-motion's base visual-element/projection code (present under both `domMax` and `domAnimation`), not the drag/layout feature bundles.
- **Verification:** `npm run typecheck` passes; `eslint` on `Philosophy.tsx` + `app/Providers.tsx` clean; `next build` compiled successfully (42/42 static pages, exit 0). Total client JS in `.next/static/chunks`: 1,878,558 B → 1,875,632 B after the downgrade.

**Step 7 — scroll-aware navbar + marquee (2026-08-11):**

- **Behavior:** on scroll-down past a threshold the fixed navbar translates up out of the viewport and the marquee translates up into the top of the viewport; both stay fixed there while scrolling continues. On scroll-up (or near the top of the page) both return to their original positions. No DOM duplication, no layout shift — the content's existing `pt-[7.5rem]` is unchanged.
- **Implementation:** new client `ScrollAwareHeader` (`components/public/layout/ScrollAwareHeader.tsx`) replaces the plain `fixed top-0` wrapper in `app/layout.tsx`. It toggles a `data-hidden` attribute on itself and exposes `--header-offset` (the marquee's `offsetTop`, measured once on mount + on resize). A CSS rule in `globals.css` applies `translateY(calc(var(--header-offset) * -1))` to the navbar/marquee (class hooks `public-navbar`/`public-marquee`) only when `data-hidden="true"`, so only those two leaf elements move and the mobile fullscreen menu (viewport-`fixed`) is unaffected. Marquee is a server component with optional content; when no marquee exists in the DOM the scroll-hide is disabled, keeping the navbar permanently visible.
- **Performance:** one passive `scroll` listener; no `requestAnimationFrame`, no polling, no Framer Motion (`useScroll`/`useTransform` avoided). Direction + delta are tracked in refs; React state changes at most once per direction flip (not per scroll event). Movement is GPU-friendly `transform: translateY` with a 300 ms ease-out CSS transition. One-time `offsetTop` read on mount/resize only (no per-frame measurement).
- **Reduced motion:** the existing `prefers-reduced-motion` block in `globals.css` now also disables the header transition (`transition: none`), so reduced-motion users keep the functional hide/show behavior without the animated slide. Coexists with `MotionConfig reducedMotion="user"`.
- **Verification:** `npm run typecheck` passes; targeted `eslint` on changed files clean; `next build` compiled successfully.

---

## 6. Performance Risks

Ranked concrete findings. P0 = launch-impacting; P1 = meaningful; P2 = optimization/defer.

### P0

- None found. No hard launch-blocking UI performance defect is present today (no runaway scroll handlers, no unbounded loops, all `whileInView` gated `once:true`, no large client-fetched lists).

### P1

1. **Full framer-motion bundle on every route — no code-split win yet.** `LazyMotion features={domMax}` in `app/Providers.tsx` == the same feature set the classic `motion` proxy preloaded, so there is **no net JS reduction** (Steps 1–2). **Resolved in Step 5** to the extent possible: public motion is now state-driven only (accordions/modals/carousel), so a downgrade to `domAnimation` is now a one-line change (verify no drag/layout remains in shipped public code; dead `FanCarousel`/`AnimatedCard` still reference drag/layout but are unimported). **Done in Step 6:** `LazyMotion` is now `domAnimation` — no shipped component uses drag/layout anymore (dead `FanCarousel` is unimported).
2. **Marketing pages shipped as large client components hydrating static content.** `AboutClient` (322), `ContactClient` (380), `PrivacyClient` (298, own 70vh client scroll container), `TermsClient` (218), all home sections, testimonials/stats/categories/trust are hard-coded client JSX. Zero server-fetched data on most. Impact: needless hydration bytes on the highest-traffic pages. Effort: medium (convert to server components; keep only form/accordion islands client).
3. **`Card`'s `layout` prop on a universal primitive.** Resolved (Step 3): `layout` removed from `Card`.
4. **Products grid re-animation on every interaction.** Resolved (Steps 4–5): `AnimatePresence mode="wait"` + re-key stagger and the mount stagger removed; grid is a stable `div`.
5. **`MediaSlider` renders every slide's desktop AND mobile image up-front.** Non-active slides are hidden with CSS after request; GIF slides use raw `<img>` (no optimization, no lazy). Homepage hero is a GIF. Impact: extra bandwidth/image decode on marketing-pages-with-many-slides. Effort: medium (lazy-decode hidden slides, choose device image, request fewer).

### P2

6. **DB writes during GET renders.** `expireOldOrders()` on `/account` and `/orders` page views; `getOrCreateCart()` in the account page `Promise.all` creates a cart as a view side effect. Move to cron/action. Effort: low–medium.
7. **4 font families via `next/font` on every page** (`playfair`, `montserrat`, `lato`, `cormorant`). Subset swap increases CSS/HTML bytes. Effort: low.
8. **Homepage composited layers from motion.** Resolved (Step 5): all public `whileInView` staggers + `will-change` layers removed; home sections render statically. Remaining Framer usage on home is `Philosophy`'s row-3 expand/modal (state-driven; the fan/rail is CSS-only since Step 6).
9. **Duplicate/uncached account reads** — 6 Prisma queries per `/account` render, order list runs another 2; none memoized with `unstable_cache` (in contrast to public services). Effort: medium.
10. **Admin list clients**: each server render re-queries the same DB queries that also back client refresh cycles; no `unstable_cache`; combined with ~150 LOC of duplicated client logic. Effort: medium.
11. **Marquee + TrustStrip duplicate text nodes** for CSS scroll fill (necessary for seamless loop; text is light). Keep — noted only.
12. **`CartItemsCard`/checkout `router.refresh()` after each action** repaints the whole RSC subtree (not just changed row). Accceptable at current scale; a targeted server-action revalidate would tighten it. Effort: low.

---

## 7. Reusability Opportunities

Highest-value only. "Effort" = L low / M medium / H high.

| # | Pattern | Current locations / duplication | Recommended abstraction | Benefit | Effort |
|---|---|---|---|---|---|
| 1 | Admin list screen | ~130–150 LOC copied × 8 `Admin*Client` files (state, effects, navigateTo, header, search bar, grid, pagination, empty state) | `AdminListView` (props: fetch`/`data`, columns/renderers, filter options, empty-state) | ~1k LOC removed, consistent UX, single search/filter/pagination behavior | M |
| 2 | Admin form scaffold | `F`/`Sec`/class strings + `useTransition`+`FormData`+toast+NEXT_REDIRECT wrapper copied into 8 forms; new/edit pairs 60–95% duplicate | `FormShell`, `FormSection`, `FormField`, `SubmitBar`; per-entity field config reusable by new/edit | Consistent form UX, kills new/edit drift | M |
| 3 | Order status config | 4 copies (list, RecentOrdersCard, OrderStatusBanner, OrderTimelineCard) with label drift | Single `orderStatusConfig` (label, badge, icon, color, step) | One source of truth | L |
| 4 | INR/date formatting | inline `Intl` in ≥5 files | `formatINR`, `formatDate` utils | Consistency | L |
| 5 | Card-with-header/body envelope | repeated in 7+ customer card files | `InfoCard` (`title`, `icon`, `children`, `action`) | Removes repeated shell markup | L |
| 6 | Empty states | 6+ custom + 4 missing (admin) | `EmptyState` component (icon, title, CTA) | Consistency + fills admin gaps | L |
| 7 | Route loading pill | 3 byte-identical `loading.tsx` | shared `RouteLoading` | Dedup | L |
| 8 | Qty stepper | CartItemsCard + ProductPurchaseCard (same 1–20 clamp) | `QtyStepper` | Dedup, single clamp rule | L |
| 9 | Image upload field | 4 divergent implementations (R2Upload, ProductImagesField, BlogImagesField, SlideImagesField; 0-byte CategoryImagesField) | one `ImageField` (validation rules per folder) | One upload UX + one R2 namespace policy | M |
| 10 | Reveal/Section animation wrapper | 17 whileInView stingers re-declared per section (**moot — all public staggers removed in Step 5**) | `Reveal`/`FadeInSection` built on shared `animations.ts` variants + `MotionConfig` reduced-motion + once | Consistent entrance, easier global animation policy | L |
| 11 | Blog/article metadata + JSON-LD | per-page duplication of `getBlogCanonicalUrl`/image/JSON-LD builders | shared `blogSeo` helpers | Canonical/JSON-LD consistency | L |
| 12 | `Button` wrapper family | CustomerButton vs AdminButton vs Button | one parameterized `Button` (variants incl. success/danger + size preset) | Collapse two thin wrappers | L |

Deliberately **not** recommended: merging "similar-looking" home section cards, blog cards, or product cards into one generic card — they share layout but differ in interactivity and would add a configuration surface without proportional benefit.

---

## 8. Recommended Animation Architecture

> **Status: mostly implemented by Steps 1–6 (2026-08-11).** Step 1 added `LazyMotion` + `MotionConfig reducedMotion="user"` (policy #3); Steps 3–5 removed `Card` `layout`, the Products grid `mode="wait"` re-key, and **all** public whileInView/entrance staggers; Step 6 replaced the Philosophy drag/layout fan with a native scroll rail and downgraded `LazyMotion` `domMax` → `domAnimation` (policy #2 now reduces to *accordion height + modal enter/exit only*, with no drag/layout anywhere in shipped code). Sections below retain the original forward-looking analysis for context.

Based only on the current implementation. Not implemented — a forward policy.

### 8.1 Core policy (fits the existing architecture)

1. **CSS first.** Simple transitions, hovers, marquees, spinners, loaders already run in CSS (marquee keyframes, `Button` spin, ribbon loader). Keep this and extend it — not Framer Motion.
2. **Keep `framer-motion` only for** entrance staggers, accordion height, and modal enter/exit — the cases where springs/exit transitions add real value.
3. **One global split point:** wrap the app in `<LazyMotion features={domAnimation}>` inside `app/Providers.tsx` so motion code only loads when used, and set `<MotionConfig reducedMotion="user">` for automatic `prefers-reduced-motion` compliance (zero per-component work). Respect the existing `globals.css` reduced-motion block.
4. **Centralize reveals:** the shared `animations.ts` variants are already good; route all whileInView entrances through one `Reveal` wrapper (`viewport={{ once: true }}`) instead of per-section copies.
5. **Drop layout animation on `Card`** (remove `layout` prop); keep transform/opacity only.
6. **Seo-safe rule:** all CMS content (product names/descriptions, blog body, FAQ answers) must remain server-rendered in the RSC/HTML output and only be visually clipped/animated — never hidden behind a client fetch. This is already the case today (accordions render children; only visibility animates) and must stay true for the patterns below.

### 8.2 Evaluation of the four candidate UI patterns (against existing architecture)

| Pattern | Fit | Recommended implementation (NOT implemented) |
|---|---|---|
| **Horizontal swipe/scroll cards** | MediaSlider (transition-transform rail); the Philosophy drag fan was replaced by a native scroll rail (Step 6) | Use CSS `scroll-snap` + `overflow-x auto` (zero JS, mobile-native, accessible, SEO content stays in DOM) for simple rails — now the pattern used by Philosophy. Keep images `next/image` with `sizes`; avoid mounting hidden slides (see P1-5). |
| **Click-to-expand information cards** | Existing approach = `AnimatePresence` + `height 0→auto` (About FAQ, ProductFAQ, ProductDetailsAccordion) | Keep framer-motion height for polish, but put the full text in the DOM (already true) so collapsed content is still in HTML/React for SEO. Consider `grid-template-rows 0fr→1fr` CSS as a lighter alternative; keep it an accordion so no layout cost when closed. |
| **Zig-zag image/text sections** | Fits `public/ui/Section` + grid; entrances via shared `Reveal` | Server-render copy/images; animate only with a shared `Reveal` (opacity/translate, `once:true`, reduced-motion aware). No `useScroll`/parallax needed — current code already avoids it. |
| **Scroll-triggered section reveals** | Already the dominant pattern (17 whileInView, all `once:true`) | Keep, but standardize: one `Reveal` wrapper, `viewport={{ once:true, amount:0.1 }}`, `MotionConfig reducedMotion="user"`, and never animate layout-affecting props on reveals. |

---

## 9. Final Architecture Summary

### UI Areas

| Area | Main Routes | Key Components | Client-heavy? | Motion-heavy? | Reuse issues |
|---|---|---|---|---|---|
| Public layout | all public | Navbar, MarqueeBanner, Footer, BottomNavbar, PromotionModal, Providers | Yes (fixed nav, providers, footer all client) | Low (CSS marquee; FM in modal) | Footer/nav hydration; 4 font families |
| Homepage | `/` | Hero, Philosophy, MediaShowcase, TrustStrip, FranchiseBenefits, StatsFloating, Categories, Testimonials, HowItWorks, CTABanner | **Yes (all sections client)** | Low (Philosophy row-3 expand/modal only after Step 6) | Static content in client; duplicated section scaffolding |
| Products | `/products` | ProductsClient, PageHeader, Card | Yes | No (grid re-key/mount stagger removed) | Client re-fetch via router.push; search/sort server round-trip |
| Product detail | `/products/[slug]` | SlugClient, ProductHero/Carousel/FAQ/Specs/Reviews/Related/PurchaseCard | Yes | Low after Step 5 (accordions only) | Accordions; otherwise static sections |
| Company browsing | `/products/companies` | server page + Card | No | No | — |
| About/Contact | `/about`, `/contact` | AboutClient, ContactClient | Yes | Low after Step 5 (FAQ accordion only) | Static copy in large clients; forms lack `useActionState` |
| Blogs | `/blogs`, `/blogs/[slug]` | BlogsClient, SlugClient (+react-markdown) | Yes | Low after Step 5 (no page-keyed staggers) | Position/metrics measured inline |
| Privacy/Terms | `/privacy-policy`, `/terms-conditions` | PrivacyClient, TermsClient | Yes (unnecessary) | Low | Static text wrapped in client scroll containers |
| Site map | `/site-map` | server page | No | No | — |
| Auth | `/login`, `/signup` | Login/SignupClient+Form | Yes | Low | Mirrored shell; form validation manual |
| Customer | `/account`, `/cart`, `/checkout`, `/orders` | AccountClient, CartClient, CheckoutClient, OrderDetailsClient | Yes (except orders list) | Medium | Status configs ×4; no confirmation screen; account page 6 reads |
| Admin | `/admin/*` | Admin*Client ×9, *Form pairs, AdminPagination, AdminSearchFilters | Yes | Low (transitive) | ~130–150 LOC dup ×8; forms 60–95% dup; dead AdminTabs sidebar |

### Performance

| Finding | Priority | Area | Impact | Effort |
|---|---|---|---|---|
| Full FM bundle via `LazyMotion domMax` — **Resolved (Step 6): now `domAnimation`, no shipped drag/layout** | P1 | global | JS bytes on all routes | L |
| Marketing pages as large client components | P1 | public marketing | Extra hydration | M |
| `Card` `layout` prop (universal FLIP) | P1 | public/customer | Interactions re-measure — **Resolved (Step 3)** | L |
| Products grid `mode="wait"` re-key | P1 | `/products` | Visible stall per filter — **Resolved (Steps 4–5)** | L |
| MediaSlider loads all slide images (incl. raw GIF) | P1 | home/PDP media | Bandwidth/decode | M |
| DB writes on GET (`expireOldOrders`, cart create) | P2 | account/orders | Side effects per view | L–M |
| 4 font families | P2 | global | FOUT/bytes | L |
| Homepage motion composited layers | P2 | `/` | — **Resolved (Step 5)** | M |
| Uncached account/admin reads | P2 | account/admin | Server time | M |
| `router.refresh()` after actions | P2 | customer | Broad repaint | L |

### Reusability

| Pattern | Current locations | Recommendation | Effort |
|---|---|---|---|
| Admin list screen | 9 `Admin*Client` | `AdminListView` | M |
| Admin form scaffold | 8 forms; new/edit pairs | `FormShell`/`FormSection`/`FormField` | M |
| Order status config | 4 files | shared `orderStatusConfig` | L |
| INR/date format | ≥5 files | utils | L |
| Card-header/body shell | 7+ customer cards | `InfoCard` | L |
| Empty states | 6+ custom, 4 missing | `EmptyState` | L |
| Route loading pill | 3 `loading.tsx` | shared `RouteLoading` | L |
| Qty stepper | 2 places | `QtyStepper` | L |
| Image upload | 4 implementations | one `ImageField` | M |
| Reveal wrapper | 17 whileInView copies (**moot — removed in Step 5**) | `Reveal` + `MotionConfig` | L |
| Blog SEO helpers | blog pages | shared buildMetadata/jsonLd | L |
| Button family | `Button`/`CustomerButton`/`AdminButton` | single parameterized `Button` | L |

### Animation

| Pattern | Current usage | Keep motion | Replace with CSS | Refactor |
|---|---|---|---|---|
| Entrance staggers | **removed repo-wide from public UI (Step 5)**; auth/customer still use initial/animate | Keep in auth/customer | — | — |
| Hover/tap | Button, Card, image cards | — | Done (Steps 5): Card/Button/PageHeader plain; CSS `active:scale-[0.97]` + `group-hover` | — |
| Accordion expand | FAQ ×3, row-3 expand | Keep | grid-rows alternative later | Ensure content in HTML; `initial={false}` |
| Modal enter/exit | PromotionModal, Feature modal | Keep | — | — |
| Marquee / trust strip / spinner / route loader | CSS keyframes | — | Already CSS | — |
| Grid re-key animation | ProductsClient — **removed (Steps 4–5)** | — | — | — |
| Page mount staggers | SlugClient (PDP) — **removed (Step 5)**; Account/Cart/Checkout remain | Keep (light) | — | — |

---

## 10. Final Recommendation

### Top 10 UI issues worth fixing

1. Admin sidebar renders nothing (`AdminTabs` with no props) — navigation relies on the dashboard grid.
2. No dedicated order-confirmation screen (post-purchase lands on `/orders/[id]`).
3. Missing admin empty states (orders, leads, marquee, logs) + inconsistent 404/error handling (notFound vs thrown Error vs inline div).
4. Order status labels/pill logic in 4 places with drift (CONFIRMED = "Received" vs "Confirmed").
5. Account page performs DB writes on GET (`expireOldOrders`, `getOrCreateCart`).
6. `AdminLogsClient` Export button is decorative (no handler).
7. Slides upload to the `banners` R2 folder; BlogImagesField lacks client validation; 4 competing upload UIs + a 0-byte file.
8. Checkout address editing hard-coded instead of reusing AddressList/AddressFormModal; no animation on the modal.
9. `ProductNewForm` has no Variants editor (variants only after create) while `ProductEditForm` does — inconsistent authoring.
10. Cart header copy "max 15" vs stepper clamp 20.

### Top 10 reusable components/patterns worth consolidating

1. `AdminListView` (list boilerplate ×8).
2. `FormShell` + `FormSection`/`FormField` (form scaffold ×8, new/edit pairs).
3. `orderStatusConfig` (status maps ×4).
4. `EmptyState` (6+ custom + 4 missing).
5. `InfoCard` (card-with-header shell ×7).
6. `QtyStepper` (2 copies).
7. `ImageField` (4 upload implementations).
8. `Reveal` wrapper (17 whileInView copies — **moot, removed in Step 5**).
9. `formatINR`/`formatDate` utils.
10. `RouteLoading` (3 duplicate loading.tsx).

### Top 10 animation / performance improvements

> ✅ = done in Steps 1–5. Remaining items are unstarted.

1. ✅ Add `<LazyMotion features={domAnimation}>` + `<MotionConfig reducedMotion="user">` in `app/Providers.tsx` (done: `domMax` → `domAnimation` in Step 6 after removing the Philosophy fan).
2. ✅ Remove the `layout` prop from the universal `Card`.
3. ✅ Drop `AnimatePresence mode="wait"` grid teardown in `ProductsClient`.
4. Move static marketing pages (About, Contact, Privacy, Terms, home sections) from client to server, keeping only interactive islands.
5. Lazy-decode/select devices in `MediaSlider`; avoid raw `<img>` GIFs where possible.
6. ✅ Remove all public whileInView/entrance staggers (was "standardize reveals"; superseded by removal).
7. Convert 3 duplicate `loading.tsx` to one shared component.
8. Remove dead motion components (AnimatedCard, FloatingIcon, CardIcon, FanCarousel) and unused animation exports.
9. Memoize account/admin reads (`unstable_cache`) and move `expireOldOrders` out of GET.
10. Consolidate the Button wrapper family (CustomerButton/AdminButton) to trim duplicated client code.

### Recommended implementation order

1. **JS/animation hygiene (affects every page):** ✅ LazyMotion + MotionConfig reduced-motion; ✅ remove `Card` `layout`; ✅ drop grid `mode="wait"`; ✅ removed public whileInView/entrance staggers; ✅ Philosophy fan/carousel → native scroll rail; ✅ downgrade `LazyMotion` `domMax` → `domAnimation` (Steps 1–6). Remaining: remove dead animation files/exports.
2. **Marketing pages server-ification** (About, Contact, Privacy, Terms, home static sections) — biggest hydration win and enables the reusable primitives below.
3. **Consolidate customer UI:** status config, EmptyState, InfoCard, QtyStepper, RouteLoading, formatting utils, order-confirmation flow.
4. **Admin refactor:** `AdminListView`, form scaffold + new/edit dedup, empty states, upload `ImageField`, Logs Export fix, AdminTabs/companies reconciliation.

### What should NOT be changed

- **Architecture decisions working today:** the server-page/fetch → client-render boundary; server actions as the only mutation path; `secureUserAction`/`secureAdminAction` guards; the `unstable_cache`-based public services; the admin read/write split (reads never via server actions).
- **SEO/rendering invariants:** canonical origin config, `robots`/`sitemap` policy, JSON-LD, product-detail privacy (noindex + login gate), `/products/companies` public access. Content must stay server-rendered in HTML even when animated/collapsed.
- **Shared primitives already paying off:** `PageHeader`, `SectionHeading`, `Card`, `Button`, `AdminPagination`, `AdminSearchFilters`, `animations.ts` variant vocabulary.
- **CSS animation approach** for marquee, loaders, spinners, hover — do not port working CSS to Framer Motion.
- **Do not** move blog/article or marketing content behind client-side fetching, and do not introduce `useScroll`/parallax into the landing page without first clearing the reduced-motion + mobile concerns (§8).