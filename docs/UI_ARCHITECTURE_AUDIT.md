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
| 1 | `Hero` | client (266 lines) | none Framer; hero GIF via `MediaSlider` (CSS); `Button` motion tap |
| 2 | `Philosophy` | client (414 lines) | **heaviest**: image rail, mobile drag fan, maxHeight expand, modal |
| 3 | `MediaShowcase` (HOME_HERO) | server (fetches slides) → `MediaSlider` client | CSS translate rail |
| 4 | `TrustStrip` | client | CSS marquee (duplicated items) |
| 5 | `FranchiseBenefits` | client | whileInView stagger |
| 6 | `StatsFloating` | client | whileInView stagger |
| 7 | `MediaShowcase` (HOME_SECONDARY) | server → client | CSS |
| 8 | `Categories` | client | whileInView stagger of links |
| 9 | `Testimonials` | client | whileInView stagger |
| 10 | `MediaShowcase` (FESTIVAL_BANNER) | server → client | CSS |
| 11 | `TrustStrip` (repeat) | client | CSS |
| 12 | `HowItWorks` | client | whileInView stagger |
| 13 | `CTABanner` | client | whileInView |

Only `MediaShowcase` fetches live data (slides). Everything else (testimonials, stats, categories, philosophy copy) is **hard-coded client JSX**, so the homepage is server-rendered but every section hydrates as a client component. Trust logos/stats/categories/testimonials are static marketing data — they could be server components.

### 1.4 Products listing (`/products`)

- Server page: validates `page/query/sort/company`, enforces `effectiveCompany`, `notFound()` on invalid company/page, renders ItemList JSON-LD.
- `ProductsClient` (client, 300 lines) owns: company banner / "Browse Other Products" CTA, chip row, **sticky filter bar** (search + hidden sort select + submit), product grid, pagination.
- Filtering = `router.push` to a new URL (a full server round-trip). The grid is `motion.div` keyed `grid-${query}-${sort}-${page}` inside `AnimatePresence mode="wait"` — **the whole grid is removed and re-staggered on every filter/page change**.
- `anchorToFilter` uses `getBoundingClientRect()` + `window.scrollTo({behavior:"smooth"})` on a `requestAnimationFrame`.
- Product links use `prefetch={false}`.

### 1.5 Product detail (private, `/products/[slug]`)

- Server page: auth-gated by middleware; fetches product/related/cart; metadata + `noindex`.
- `SlugClient` (client, 224 lines): page-level `staggerFast` mount animation wrapping all sections; each section additionally runs its own whileInView stagger (ProductHero mount-animate, Specs/FAQ/Reviews/Related whileInView).
- Product sections — all client:
  - `ProductHero` (client): mount stagger.
  - `ProductCarousel` (client): CSS only.
  - `ProductDetailsAccordion` (client): whileInView + `AnimatePresence` height 0→auto (4 items).
  - `ProductFAQ` (client): whileInView + height accordion.
  - `ProductSpecification`, `ProductReviews`, `ProductRelated` (client): whileInView staggers.
  - `ProductPurchaseCard` (customer): qty stepper + `useTransition` cart/buy-now actions (additional mounted on this route).

### 1.6 Product/company browsing

`/products/companies` is a **server-only** page (no client file, no motion, no metadata). Lists active companies (excluding vedic-wellness) as `Card` links to `/products?company=<slug>`. Public — exempted from the product-detail login gate in `proxy.ts`.

### 1.7 About

- Server page emits FAQPage JSON-LD.
- `AboutClient` (client, 322 lines): chips (whileInView) + story/sections + FAQ accordion (5 items, `AnimatePresence` height 0→auto). Static copy in a client component.

### 1.8 Contact

- `ContactClient` (client, 380 lines): chips, enquiry card (Turnstile + form), quick-contact/office info columns (whileInView). Submission posts to `/api/contact`. Static copy + interactive form in one large client.

### 1.9 Blogs

- Listing: server page fetches featured (3) + paginated list via `getPublicBlogsService(page)`, emits Blog JSON-LD. `BlogsClient` (client, 243 lines): featured + latest grids, mount stagger keyed per page (`key=page`), re-staggers grid on page change.
- Detail: server page with `generateStaticParams`, BlogPosting JSON-LD, canonical-constrained metadata. `SlugClient` (client, 268 lines): article `Card`, `react-markdown` content with a **reading-position scroll progress treatment** (`contentRef` measurement), related blogs.

### 1.10 Other public routes

- `/privacy-policy`: `PrivacyClient` (client, 298 lines) — a single `motion.div` fade wrapping a **client-side 70vh scroll container** of static legal text.
- `/terms-conditions`: `TermsClient` (client, 218 lines) — same pattern, 85vh scroll container.
- `/site-map`: pure server page (no client).

### 1.11 Shared public UI components (usage counts from repo scan)

| Component | Importers | Notes |
|---|---|---|
| `PageHeader` | 49 | motion whileInView header (badge/h1/p) |
| `Card` | 39 | **motion** primitive with `layout` prop (see §5) |
| `SectionHeading` | 27 | text heading |
| `Button` | 15 | motion.button, `useFormStatus` auto-loading, spinner |
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

No admin file imports framer-motion directly. Motion reach is transitive: `PageHeader` (whileInView) on every page and `AdminButton → Button` (spring tap). CSS: `animate-spin` (Sync/Purge spinners), `animate-pulse` (badge dots), `animate-in fade-in slide-in-from-top-1` (Users inline role editor — the only `tailwindcss-animate` use), ribbon loader.

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
- Home sections each re-declare nearly identical whileInView stagger scaffolding vs. a shared `Section`/`Reveal` wrapper (`Section` exists but has 1 importer).

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
|---|---|
| Files importing framer-motion | 38 (36 render motion) |
| Static `motion.*` occurrences | ~240 source lines → effective runtime DOM in the hundreds (map() grids + `Card`/`Button` everywhere) |
| `whileInView` usages | 17 |
| `useScroll` / `useTransform` / `useSpring` / `useMotionValue` / `useInView` / `useAnimation` | **0** |
| `AnimatePresence` files | 7 (AboutClient, ProductDetailsAccordion, ProductsClient, Philosophy, ProductFAQ, PhilosophyFeatureModal, PromotionModal) |
| `layout` / `layoutId` | `layout` on every `Card`; `layout="position"` on Philosophy mobile fan; `layoutId` = 0 |
| Continuous `repeat: Infinity` FM loops | 0 (infinite loops are CSS-only: marquee, spinner, `animate-float` in tailwind config; `animate-marquee` in globals) |
| `drag` | Philosophy mobile fan + FanCarousel (dead) |

### 5.3 Trigger classification (representative)

- **`initial`/`animate` mount staggers**: LoginClient, SignupClient, AccountClient, CartClient, CheckoutClient, OrderStatusBanner (incl. `scaleX 0→1` accent bar), ProductHero, SlugClient (PDP mounts whole tree), BlogsClient grids (re-keyed per page), Privacy/Terms/Slug fade wraps.
- **`whileInView` (once:true)**: PageHeader (universal), ContactClient, AboutClient, Categories, CTABanner, FranchiseBenefits, StatsFloating, HowItWorks, Testimonials, Philosophy, ProductSpecification, ProductDetailsAccordion, ProductFAQ, ProductReviews, ProductRelated.
- **State-toggled + AnimatePresence height**: AboutClient FAQ, ProductDetailsAccordion, ProductFAQ (`height 0→auto`), Philosophy row-3 `maxHeight` + fan `animate` styles + modal; PromotionModal + PhilosophyFeatureModal (AnimatePresence enter/exit).
- **Hover/tap**: `Button` (tap scale), `Card` (hover y, `layout`), home image cards (hover scale).
- **Gesture**: Philosophy mobile fan (`drag="x"`); FanCarousel (dead).

### 5.4 Expense classification

| Usage | Continuous | Layout-affecting | Expensive? |
|---|---|---|---|
| Home section whileInView staggers (8 sections, ~60–70 elements) | No (once) | No | Moderate — many observers, `will-change` layers |
| `Card` `layout` prop (universal) | No | Yes (FLIP measuring) | **Yes — global multiplier** |
| Products grid `AnimatePresence mode="wait"` re-key per filter/page | No | No | **Yes — full teardown + N-card re-stagger per interaction** |
| PDP (SlugClient + 6 child sections) compound mount + whileInView | No | Yes (accordions) | Heaviest single route (~30+ motion elements) |
| Accordions (`height 0→auto`) | No | Yes (by design) | Moderate (reflow per open) |
| Philosophy fan + image rail | No | No (absolute/contain) | Moderate (images, drag) |
| Marquee / RouteLoader / spinner | **Yes (CSS)** | No | Cheap (CSS) |

All scroll-sensitive code uses `whileInView`. **No `useScroll`/`useTransform` scroll-linked animations exist**, so there is no scroll-listener performance risk from Framer Motion today.

---

## 6. Performance Risks

Ranked concrete findings. P0 = launch-impacting; P1 = meaningful; P2 = optimization/defer.

### P0

- None found. No hard launch-blocking UI performance defect is present today (no runaway scroll handlers, no unbounded loops, all `whileInView` gated `once:true`, no large client-fetched lists).

### P1

1. **Full framer-motion bundle on every route — no `LazyMotion`/`domAnimation`.** `app/Providers.tsx` (or each page) doesn't split motion features; 38 direct imports. Impact: wasted JS on every page incl. admin. Effort: low (wrap tree in `<LazyMotion features={domAnimation}>`).
2. **Marketing pages shipped as large client components hydrating static content.** `AboutClient` (322), `ContactClient` (380), `PrivacyClient` (298, own 70vh client scroll container), `TermsClient` (218), all home sections, testimonials/stats/categories/trust are hard-coded client JSX. Zero server-fetched data on most. Impact: needless hydration bytes on the highest-traffic pages. Effort: medium (convert to server components; keep only form/accordion islands client).
3. **`Card`'s `layout` prop on a universal primitive.** Every grid add/remove/reorder (products, related, reviews, blogs, cart/checkout cards) triggers Framer Motion box-measurement/FLIP. Impact: silent global overhead and odd animation on filter/list changes. Effort: low (remove `layout`; keep transform-only hover).
4. **Products grid re-animation on every interaction.** `AnimatePresence mode="wait"` + `key=grid-${query}-${sort}-${page}` tears down and re-staggers N cards on every filter/page click, while the page does a full server round-trip (`router.push`). Impact: visible delay/flash on the primary catalog interaction. Effort: low (drop exit; key on a stable value; animate opacity once).
5. **`MediaSlider` renders every slide's desktop AND mobile image up-front.** Non-active slides are hidden with CSS after request; GIF slides use raw `<img>` (no optimization, no lazy). Homepage hero is a GIF. Impact: extra bandwidth/image decode on marketing-pages-with-many-slides. Effort: medium (lazy-decode hidden slides, choose device image, request fewer).

### P2

6. **DB writes during GET renders.** `expireOldOrders()` on `/account` and `/orders` page views; `getOrCreateCart()` in the account page `Promise.all` creates a cart as a view side effect. Move to cron/action. Effort: low–medium.
7. **4 font families via `next/font` on every page** (`playfair`, `montserrat`, `lato`, `cormorant`). Subset swap increases CSS/HTML bytes. Effort: low.
8. **Homepage ~60–70 motion elements + `will-change: transform` on many cards.** Many composited layers; mitigated by `once:true`, but a shared `Reveal` wrapper could standardize and reduce. Effort: medium.
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
| 10 | Reveal/Section animation wrapper | 17 whileInView stingers re-declared per section | `Reveal`/`FadeInSection` built on shared `animations.ts` variants + `MotionConfig` reduced-motion + once | Consistent entrance, easier global animation policy | L |
| 11 | Blog/article metadata + JSON-LD | per-page duplication of `getBlogCanonicalUrl`/image/JSON-LD builders | shared `blogSeo` helpers | Canonical/JSON-LD consistency | L |
| 12 | `Button` wrapper family | CustomerButton vs AdminButton vs Button | one parameterized `Button` (variants incl. success/danger + size preset) | Collapse two thin wrappers | L |

Deliberately **not** recommended: merging "similar-looking" home section cards, blog cards, or product cards into one generic card — they share layout but differ in interactivity and would add a configuration surface without proportional benefit.

---

## 8. Recommended Animation Architecture

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
| **Horizontal swipe/scroll cards** | Existing MediaSlider (transition-transform rail) and dead FanCarousel (drag fan) cover this | Use CSS `scroll-snap` + `overflow-x auto` (zero JS, mobile-native, accessible, SEO content stays in DOM) for simple rails; reserve Framer Motion `drag` only for a custom gesture like the Philosophy fan. Keep images `next/image` with `sizes`; avoid mounting hidden slides (see P1-5). |
| **Click-to-expand information cards** | Existing approach = `AnimatePresence` + `height 0→auto` (About FAQ, ProductFAQ, ProductDetailsAccordion) | Keep framer-motion height for polish, but put the full text in the DOM (already true) so collapsed content is still in HTML/React for SEO. Consider `grid-template-rows 0fr→1fr` CSS as a lighter alternative; keep it an accordion so no layout cost when closed. |
| **Zig-zag image/text sections** | Fits `public/ui/Section` + grid; entrances via shared `Reveal` | Server-render copy/images; animate only with a shared `Reveal` (opacity/translate, `once:true`, reduced-motion aware). No `useScroll`/parallax needed — current code already avoids it. |
| **Scroll-triggered section reveals** | Already the dominant pattern (17 whileInView, all `once:true`) | Keep, but standardize: one `Reveal` wrapper, `viewport={{ once:true, amount:0.1 }}`, `MotionConfig reducedMotion="user"`, and never animate layout-affecting props on reveals. |

---

## 9. Final Architecture Summary

### UI Areas

| Area | Main Routes | Key Components | Client-heavy? | Motion-heavy? | Reuse issues |
|---|---|---|---|---|---|
| Public layout | all public | Navbar, MarqueeBanner, Footer, BottomNavbar, PromotionModal, Providers | Yes (fixed nav, providers, footer all client) | Low (CSS marquee; FM in modal) | Footer/nav hydration; 4 font families |
| Homepage | `/` | Hero, Philosophy, MediaShowcase, TrustStrip, FranchiseBenefits, StatsFloating, Categories, Testimonials, HowItWorks, CTABanner | **Yes (all sections client)** | **Yes (8 whileInView sections)** | Static content in client; duplicated section scaffolding |
| Products | `/products` | ProductsClient, PageHeader, Card | Yes | **Yes** (grid AnimatePresence re-key) | Client re-fetch via router.push; search/sort server round-trip |
| Product detail | `/products/[slug]` | SlugClient, ProductHero/Carousel/FAQ/Specs/Reviews/Related/PurchaseCard | Yes | **Yes** (~30+ elements) | Compound mount+whileInView; accordions |
| Company browsing | `/products/companies` | server page + Card | No | No | — |
| About/Contact | `/about`, `/contact` | AboutClient, ContactClient | Yes | Yes (whileInView, FAQ height) | Static copy in large clients; forms lack `useActionState` |
| Blogs | `/blogs`, `/blogs/[slug]` | BlogsClient, SlugClient (+react-markdown) | Yes | Medium (page-keyed staggers) | Position/metrics measured inline |
| Privacy/Terms | `/privacy-policy`, `/terms-conditions` | PrivacyClient, TermsClient | Yes (unnecessary) | Low | Static text wrapped in client scroll containers |
| Site map | `/site-map` | server page | No | No | — |
| Auth | `/login`, `/signup` | Login/SignupClient+Form | Yes | Low | Mirrored shell; form validation manual |
| Customer | `/account`, `/cart`, `/checkout`, `/orders` | AccountClient, CartClient, CheckoutClient, OrderDetailsClient | Yes (except orders list) | Medium | Status configs ×4; no confirmation screen; account page 6 reads |
| Admin | `/admin/*` | Admin*Client ×9, *Form pairs, AdminPagination, AdminSearchFilters | Yes | Low (transitive) | ~130–150 LOC dup ×8; forms 60–95% dup; dead AdminTabs sidebar |

### Performance

| Finding | Priority | Area | Impact | Effort |
|---|---|---|---|---|
| No LazyMotion — full FM bundle everywhere | P1 | global | JS bytes on all routes | L |
| Marketing pages as large client components | P1 | public marketing | Extra hydration | M |
| `Card` `layout` prop (universal FLIP) | P1 | public/customer | Interactions re-measure | L |
| Products grid `mode="wait"` re-key | P1 | `/products` | Visible stall per filter | L |
| MediaSlider loads all slide images (incl. raw GIF) | P1 | home/PDP media | Bandwidth/decode | M |
| DB writes on GET (`expireOldOrders`, cart create) | P2 | account/orders | Side effects per view | L–M |
| 4 font families | P2 | global | FOUT/bytes | L |
| ~60–70 homepage motion elements | P2 | `/` | Composited layers | M |
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
| Reveal wrapper | 17 whileInView copies | `Reveal` + `MotionConfig` | L |
| Blog SEO helpers | blog pages | shared buildMetadata/jsonLd | L |
| Button family | `Button`/`CustomerButton`/`AdminButton` | single parameterized `Button` | L |

### Animation

| Pattern | Current usage | Keep motion | Replace with CSS | Refactor |
|---|---|---|---|---|
| Entrance staggers | everywhere (initial/animate, whileInView once) | Keep | — | Centralize in `Reveal`; harmless with reduced-motion aware wrapper |
| Hover/tap | Button, Card, image cards | Keep (`whileTap`/hover) | hover could be CSS | Remove `layout` from Card |
| Accordion expand | FAQ ×3, row-3 expand | Keep | grid-rows alternative later | Ensure content in HTML; `initial={false}` |
| Modal enter/exit | PromotionModal, Feature modal | Keep | — | — |
| Marquee / trust strip / spinner / route loader | CSS keyframes | — | Already CSS | — |
| Grid re-key animation | ProductsClient | Remove | — | Drop `mode="wait"` exit; key on stable value |
| Page mount staggers | SlugClient (PDP), Account/Cart/Checkout | Keep (light) | — | One top-level stagger, not per-section whileInView too |

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
8. `Reveal` wrapper (17 whileInView copies).
9. `formatINR`/`formatDate` utils.
10. `RouteLoading` (3 duplicate loading.tsx).

### Top 10 animation / performance improvements

1. Add `<LazyMotion features={domAnimation}>` + `<MotionConfig reducedMotion="user">` in `app/Providers.tsx`.
2. Remove the `layout` prop from the universal `Card`.
3. Drop `AnimatePresence mode="wait"` grid teardown in `ProductsClient`.
4. Move static marketing pages (About, Contact, Privacy, Terms, home sections) from client to server, keeping only interactive islands.
5. Lazy-decode/select devices in `MediaSlider`; avoid raw `<img>` GIFs where possible.
6. Standardize all reveals on a shared `Reveal` with `once:true`.
7. Convert 3 duplicate `loading.tsx` to one shared component.
8. Remove dead motion components (AnimatedCard, FloatingIcon, CardIcon, FanCarousel) and unused animation exports.
9. Memoize account/admin reads (`unstable_cache`) and move `expireOldOrders` out of GET.
10. Consolidate the Button wrapper family (CustomerButton/AdminButton) to trim duplicated client code.

### Recommended implementation order

1. **JS/animation hygiene (affects every page):** LazyMotion + MotionConfig reduced-motion; remove `Card` `layout`; drop grid `mode="wait"`; remove dead animation files/exports.
2. **Marketing pages server-ification** (About, Contact, Privacy, Terms, home static sections) — biggest hydration win and enables the reusable primitives below.
3. **Consolidate customer UI:** status config, EmptyState, InfoCard, QtyStepper, RouteLoading, formatting utils, order-confirmation flow.
4. **Admin refactor:** `AdminListView`, form scaffold + new/edit dedup, empty states, upload `ImageField`, Logs Export fix, AdminTabs/companies reconciliation.

### What should NOT be changed

- **Architecture decisions working today:** the server-page/fetch → client-render boundary; server actions as the only mutation path; `secureUserAction`/`secureAdminAction` guards; the `unstable_cache`-based public services; the admin read/write split (reads never via server actions).
- **SEO/rendering invariants:** canonical origin config, `robots`/`sitemap` policy, JSON-LD, product-detail privacy (noindex + login gate), `/products/companies` public access. Content must stay server-rendered in HTML even when animated/collapsed.
- **Shared primitives already paying off:** `PageHeader`, `SectionHeading`, `Card`, `Button`, `AdminPagination`, `AdminSearchFilters`, `animations.ts` variant vocabulary.
- **CSS animation approach** for marquee, loaders, spinners, hover — do not port working CSS to Framer Motion.
- **Do not** move blog/article or marketing content behind client-side fetching, and do not introduce `useScroll`/parallax into the landing page without first clearing the reduced-motion + mobile concerns (§8).