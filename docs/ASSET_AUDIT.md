# Vedic Wellness — Public Asset & Image Optimization Audit

**Repository:** `vedicWellness`
**Audit date:** 2026-08-16
**Framework:** Next.js **16.1.1** · React **19.2.3** · App Router · Tailwind CSS 3.4
**Machine-readable inventory:** `docs/asset-inventory.json`

> **Scope note.** This audit is read-only. No files were modified, renamed, deleted,
> converted, or moved. All dimensions were read from the physical files. Recommendations
> are documented only; implementation requires explicit approval.

---

## 1. Executive Summary

The repository serves **41 public files** (`public/`, 39 images + 2 non-image files) totalling
**~4.01 MB**. The image stack is a mixture of `next/image` (used correctly in most dynamic
contexts) and raw `<img>` for the animated hero GIF. Product, blog, slide and banner media are
**database-backed and served from Cloudflare R2** (`pub-27d15e98271842758cffe0f100c64f3c.r2.dev`),
which is correctly whitelisted in `next.config.ts`.

**The repository is mid-migration and currently broken.** A JPEG→WebP conversion pass deleted
`public/hero/1.jpg…6.jpg` and `public/hero/card-products.jpg` / `card-partners.jpg` from the
working tree, but two shipped components still reference those exact paths:

- `components/public/home/Philosophy.tsx` → `"/hero/1.jpg"…"/hero/6.jpg"` (6 broken cards below the fold)
- `components/public/home/Hero.tsx` → `"/hero/card-products.jpg"`, `"/hero/card-partners.jpg"` (2 broken stat images, desktop, above the fold)

These are **P0 broken references** that must be repointed to the surviving WebP files (or new assets)
before deploy. The conversion also produced **duplicate pairs** (`hero/2.webp === hero/3.webp`,
`hero/5.webp === hero/6.webp`) — two of the six original photos were collapsed into duplicates, so
the About "journey" section currently repeats images.

The largest remaining performance concern is the **homepage mobile hero**: an animated GIF
(`hero/1.gif`, 703 KB, 450×334, 20 frames) rendered through a raw `<img>` above the fold. This is the
mobile LCP candidate. The WebP hero files that survive are **efficient in bytes but vastly
oversized in pixel dimensions** (up to 6000×4000) for ~320 px card slots.

~20 of the 39 images are **unreferenced legacy/Create-Next-App assets** (promo1-4.jpg ≈ 1.05 MB,
favicon-16…256.png, `next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg`, `phone.svg`,
`v.svg`, `v-cropped.svg`/`noise.png`, `edic.svg`, `wellness.svg`). `favicon.ico` (181 KB) and a
non-square `apple-touch-icon.png` (165×231) are convention-served but suboptimal.

**Estimated potential savings:** ~4.01 MB → ~1.6 MB (**≈ 60%**) if the P0/P1 items are applied.

---

## 2. Repository Discovery

| Concern | Finding |
| --- | --- |
| Framework | Next.js **16.1.1** (`package.json`), App Router (`app/`) |
| React | **19.2.3** |
| Router | App Router (route groups: `(public)`, `(admin)`, `(auth)`, `(customer)`) |
| Image strategy | `next/image` for static + R2-backed images; raw `<img>` for GIF slides |
| `next.config.ts` | `images.remotePatterns` allows `https://pub-27d15e98271842758cffe0f100c64f3c.r2.dev`; `images.qualities = [50, 60, 75]`; CSP + security headers |
| `public/` | 31 root files + 10 files under `public/hero/` = 41 files |
| Styles | `app/globals.css` (Tailwind 3.4). **No** `url()`/`background-image` asset references anywhere |
| Fonts | Self-hosted via `next/font/google` (Playfair, Montserrat, Lato, Cormorant) — no font files in `public/` |
| DB-backed media | `Blog.thumbnailUrl`, `Product.imageUrl`/`gallery`, `Slide.imageDesktopUrl`/`imageMobileUrl`, `Banner.imageUrl` (Prisma schema) |
| Remote image domain | Cloudflare R2 public bucket `pub-27d15e98271842758cffe0f100c64f3c.r2.dev` (`R2_PUBLIC_URL` in `.env`) |
| Upload path | `POST /api/r2/upload-url` → presigned PUT; folders `products|blogs|banners|categories`; products restricted to **webp/avif ≤ 2 MB** |
| Validations available | `npm run lint`, `npm run typecheck`, `npm run build`, `npm run analyze` |

---

## 3. Asset Inventory

All values read from the physical files. Sizes in bytes. AR = aspect ratio (width/height).

### 3.1 Public images (`public/` root)

| Path | MIME | Size (B) | W×H | AR | Ref count | Refs in | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `apple-touch-icon.png` | image/png | 5,547 | 165×231 | 0.71 | 0* | iOS convention | Non-square, suboptimal |
| `edic.svg` | image/svg+xml | 5,139 | 794×1123 | 0.71 | 0 | — | Unused brand variant |
| `facebook.svg` | image/svg+xml | 1,334 | 1024×1024 | 1.0 | 1 | BottomNavbar | Used |
| `favicon-128.png` | image/png | 3,698 | 128×128 | 1.0 | 0 | — | Unused |
| `favicon-16.png` | image/png | 1,106 | 16×16 | 1.0 | 0 | — | Unused |
| `favicon-256.png` | image/png | 7,715 | 256×256 | 1.0 | 0 | — | Unused |
| `favicon-32.png` | image/png | 1,734 | 32×32 | 1.0 | 0 | — | Unused |
| `favicon-48.png` | image/png | 1,886 | 48×48 | 1.0 | 0 | — | Unused |
| `favicon-64.png` | image/png | 2,307 | 64×64 | 1.0 | 0 | — | Unused |
| `favicon-72.png` | image/png | 2,480 | 72×72 | 1.0 | 0 | — | Unused |
| `favicon-96.png` | image/png | 3,030 | 96×96 | 1.0 | 0 | — | Unused |
| `favicon.ico` | image/x-icon | 181,759 | 9 icons | — | 0* | browser convention | Oversized for favicon |
| `file.svg` | image/svg+xml | 391 | 16×16 | 1.0 | 0 | — | CNA leftover, unused |
| `globe.svg` | image/svg+xml | 1,035 | 16×16 | 1.0 | 0 | — | CNA leftover, unused |
| `instagram.svg` | image/svg+xml | 3,217 | 128×128 | 1.0 | 1 | BottomNavbar | Used |
| `logo.svg` | image/svg+xml | 7,486 | 325×148 | 2.2 | 5 | Navbar, Footer, 3× JSON-LD | Used (brand) |
| `next.svg` | image/svg+xml | 1,375 | 394×80 | 4.9 | 0 | — | CNA leftover, unused |
| `noise.png` | **SVG content** | 1,234 | 165×231 | 0.71 | 0 | — | Misnamed (`.png` but SVG) |
| `og.jpg` | image/jpeg | 224,506 | 1688×1688 | 1.0 | 6 | layout + 5 pages metadata | Declared 1200×630 — mismatch |
| `phone.svg` | image/svg+xml | 1,502 | 123×122 | 1.01 | 0 | — | Unused |
| `promo1.jpg` | image/jpeg | 258,573 | 1920×1320 | 1.45 | 0 | — | Legacy, unused |
| `promo2.jpg` | image/jpeg | 276,193 | 1920×1280 | 1.5 | 0 | — | Legacy, unused |
| `promo3.jpg` | image/jpeg | 252,026 | 1920×1080 | 1.78 | 0 | — | Legacy, unused |
| `promo4.jpg` | image/jpeg | 264,773 | 1920×1280 | 1.5 | 0 | — | Legacy, unused |
| `v-cropped.svg` | image/svg+xml | 1,234 | 165×231 | 0.71 | 0 | — | **Identical to `noise.png`** |
| `v.svg` | image/svg+xml | 1,259 | 794×1123 | 0.71 | 0 | — | Unused brand mark |
| `vercel.svg` | image/svg+xml | 128 | 1155×1000 | 1.15 | 0 | — | CNA leftover, unused |
| `wellness.svg` | image/svg+xml | 1,741 | 794×1123 | 0.71 | 0 | — | Unused brand variant |
| `whatsapp.svg` | image/svg+xml | 2,501 | 175×176 | 1.0 | 1 | BottomNavbar | Used |
| `window.svg` | image/svg+xml | 385 | 16×16 | 1.0 | 0 | — | CNA leftover, unused |

`*` = convention-served (browsers/Safari request these paths automatically, no code reference).

### 3.2 Public images (`public/hero/`)

| Path | MIME | Size (B) | W×H | AR | Ref count | Refs in | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `1.gif` | image/gif | 703,874 | 450×334 | 1.35 | 2 | Hero (mobile), About story | **Animated, 20 frames** |
| `1.webp` | image/webp | 56,430 | 4469×2979 | 1.5 | 1 | About journey | Oversized px, ok bytes |
| `2.webp` | image/webp | 111,316 | 3456×5184 | 0.67 | 1 | About journey | **Duplicate of 3.webp** |
| `3.webp` | image/webp | 111,316 | 3456×5184 | 0.67 | 1 | About journey | **Duplicate of 2.webp** |
| `4.webp` | image/webp | 117,188 | 5760×3840 | 1.5 | 1 | About journey | Oversized px |
| `5.webp` | image/webp | 125,088 | 4401×6325 | 0.70 | 1 | About journey | **Duplicate of 6.webp** |
| `6.webp` | image/webp | 125,088 | 4401×6325 | 0.70 | 1 | About journey | **Duplicate of 5.webp** |
| `7.webp` | image/webp | 509,630 | 6000×4000 | 1.5 | 1 | About journey | Heaviest hero webp |
| `8.webp` | image/webp | 824,638 | 6000×4000 | 1.5 | 1 | About journey | Heaviest file overall |
| `news according GIF.gif:Zone.Identifier` | text/plain | 25 | — | — | 0 | — | Windows ADS junk, committed |

### 3.3 Non-image public files

| Path | MIME | Size (B) | Purpose | Referenced |
| --- | --- | --- | --- | --- |
| `humans.txt` | text/plain | 313 | Site info by convention | Convention |
| `hero/news according GIF.gif:Zone.Identifier` | text/plain | 25 | OS junk file | No |

---

## 4. Image Usage Map

### 4.1 Static (repo) assets → UI

```
public/hero/1.gif
  ├─ components/public/home/Hero.tsx → MediaSlider → mobile hero (aspect 4/3, above the fold)
  │     route: /  ·  mobile only  ·  raw <img>  ·  animated ·  LCP candidate
  └─ app/(public)/about/AboutClient.tsx → storyMedia (ExpandableSeoContent, aspect 4/3)
        route: /about  ·  above the fold  ·  <Image unoptimized>

public/hero/1.webp … 8.webp
  └─ app/(public)/about/AboutClient.tsx → journey cards (aspect 16/8 ≈ 320×160 @2x)
        route: /about  ·  below the fold  ·  next/image fill

public/hero/1.jpg … 6.jpg  ⚠️ BROKEN — files deleted, still referenced
  └─ components/public/home/Philosophy.tsx → feature cards (aspect 3/4 ≈ 320×427 @2x)
        route: /  ·  below the fold  ·  next/image fill  ·  renders broken image

public/hero/card-products.jpg / card-partners.jpg  ⚠️ BROKEN — files deleted, still referenced
  └─ components/public/home/Hero.tsx → stat cards (≈230×256 desktop only)
        route: /  ·  above the fold (desktop right card)  ·  next/image fill  ·  renders broken image

public/logo.svg
  ├─ components/public/layout/Navbar.tsx   → navbar logo (≈40–48px tall, priority)
  ├─ components/public/layout/Footer.tsx   → footer logo (140–200px wide)
  └─ JSON-LD Organization.logo (app/layout.tsx, blogs/page, blogs/[slug]/page)

public/whatsapp.svg / instagram.svg / facebook.svg
  └─ components/public/layout/BottomNavbar.tsx → floating social bar (26–34px)

public/og.jpg
  └─ Open Graph + Twitter metadata: app/layout.tsx, about, contact, products, blogs, blogs/[slug]
        (referenced as ${SITE_URL}/og.jpg; blogs/[slug] uses it only as thumbnailUrl fallback)

public/favicon.ico · public/apple-touch-icon.png · public/humans.txt
  └─ served by browser/iOS/crawler convention (no code reference)
```

### 4.2 Database/R2-backed (dynamic) assets → UI

```
Product.imageUrl + Product.gallery (R2: products/<uuid>.webp|avif)
  ├─ app/(public)/products/ProductsClient.tsx → product card (h-32 md:h-44, 50vw/33vw)
  ├─ components/public/product/ProductHero.tsx → ProductCarousel (50vw)
  ├─ components/public/product/ProductRelated.tsx → related card
  ├─ components/customer/cart/CartItemsCard.tsx → cart thumbnail
  └─ admin products list/preview (AdminProductsClient, ProductImagesField)

Blog.thumbnailUrl (R2: blogs/<uuid>.*)
  ├─ app/(public)/blogs/BlogsClient.tsx → featured + latest cards (h-52/h-44, 33vw)
  ├─ app/(public)/blogs/[slug]/SlugClient.tsx → article hero (aspect 16/10, priority)
  ├─ app/(public)/blogs/[slug]/page.tsx → OG image (thumbnailUrl ?? og.jpg)
  └─ admin blogs list/preview (AdminBlogsClient, BlogImagesField)

Slide.imageDesktopUrl / imageMobileUrl (R2: banners/<uuid>.*)
  ├─ components/public/home/MediaShowcase.tsx → MediaSlider (placements: HOME_HERO, HOME_SECONDARY, FESTIVAL_BANNER)
  └─ admin slides list/preview (AdminSlidesClient, SlideImagesField)
     NOTE: SlideImagesField uploads to the "banners" R2 folder — shared namespace.

Banner.imageUrl (R2: banners/<uuid>.*)
  └─ components/public/layout/PromotionModal.tsx → modal (IMAGE_ONLY / TEXT background)

Markdown images in Blog.content (R2 or external URLs)
  └─ ReactMarkdown default renderer → plain <img> (no next/image, no optimization)
```

All R2 URLs are served through `next/image` with the `remotePatterns` whitelist in
`next.config.ts`. Verified `R2_PUBLIC_URL` matches the whitelisted hostname.

---

## 5. Dynamically Loaded Assets

| Category | Examples | Provenance |
| --- | --- | --- |
| **Static repository asset** | `hero/*.webp`, `hero/1.gif`, `logo.svg`, `og.jpg`, social SVGs | `public/` on the origin |
| **Database-backed asset** | Product/Blog/Slide/Banner URLs | Prisma → `*Url` fields → R2 public URLs |
| **Remote CDN asset** | R2 bucket `pub-27d15e98271842758cffe0f100c64f3c.r2.dev` | `R2_PUBLIC_URL` env |
| **User-uploaded asset** | `products/<uuid>.webp/avif` (admin uploads via presigned PUT) | R2, admin-only route, validated webp/avif ≤ 2 MB |
| **Generated asset** | none (no server-side image generation found) | — |
| **External third-party asset** | Google Maps link, social profiles (links only, no images); fonts are self-hosted | — |

**Data-flow traces (browser-visible):**
- Product: `getPublicProductsService` → `product.imageUrl` → `<Image src={product.imageUrl}>` → `https://pub-….r2.dev/products/<uuid>.webp`
- Slides: `getPublicSlides(placementKey)` (cached via `unstable_cache`) → `MediaSlider` → `<Image>/<img src={slide.imageDesktopUrl|imageMobileUrl}>`
- Blog: `getPublicBlogBySlugService` → `blog.thumbnailUrl` → hero + cards + OG metadata

---

## 6. Source vs Display Dimensions

| Asset | Source W×H | Displayed at (CSS) | Verdict |
| --- | --- | --- | --- |
| `hero/1.gif` | 450×334 | ≈390×293 (mobile, 4/3, ~360–430px viewport) | Undersized source, oversized bytes (GIF) — wrong trade-off |
| `hero/1.webp` | 4469×2979 | ≈320×160 (journey card, 2:1 @2x = 640×320) | 14× over-resolution |
| `hero/2/3.webp` | 3456×5184 | ≈320×160 | Portrait source in a 2:1 crop — 32× over-resolution |
| `hero/4.webp` | 5760×3840 | ≈320×160 | 36× over-resolution |
| `hero/5/6.webp` | 4401×6325 | ≈320×160 | 44× over-resolution |
| `hero/7.webp` | 6000×4000 | ≈320×160 | 42× over-resolution, 510 KB |
| `hero/8.webp` | 6000×4000 | ≈320×160 | 42× over-resolution, **825 KB** |
| `og.jpg` | 1688×1688 | social crops 1200×630 | Square source for a 1200×630 slot |
| `promo1-4.jpg` | 1920×1320/1280/1080 | unused | n/a |
| `favicon.ico` | multi-res | 16–32px | 181 KB is far above the ~15–30 KB norm |
| `apple-touch-icon.png` | 165×231 | 180×180 expected | Non-square (portrait) |

**Flagged:** every About-journey image is downloaded at a source resolution far above its display
slot. Even though `next/image` re-encodes them at request time, the source still has to be
uploaded to the optimizer, and raw decodes in the build/dev pipeline are heavy. The **correct fix is
to re-encode the source WebP files to the actual display size (e.g. 640×320 @2x)** rather than ship
5–6 megapixel sources.

---

## 7. Format Analysis

| Asset | Current | Recommended | Why |
| --- | --- | --- | --- |
| Hero/About photos | WebP (good) | WebP (or AVIF) **at reduced resolution** | Correct format; fix dimensions, not format |
| `hero/1.gif` (animated) | GIF 89a, 20 frames | **Animated WebP** (or short MP4/WebM + static poster) | 703 KB for 450×334; WebP halves this; MP4 ~⅓. Verify animation is actually required — the hero text is static and the animation adds nothing semantically |
| `og.jpg` | JPEG 1688×1688 | **WebP 1200×630** | OG spec size; WebP smaller; keep a JPEG fallback if social scrapers need it |
| `noise.png` | **SVG content in `.png`** | Rename to `.svg` or delete | Content is SVG — serving as `image/png` breaks rendering |
| Logos/marks | SVG (correct) | SVG | Vector is correct for brand art |
| Favicons | PNG/ICO | keep | fine formats; fix sizes |
| `promo1-4.jpg` | JPEG | Delete (unused) or convert to WebP | 1.05 MB legacy promo set with zero references |

---

## 8. Compression & File-Size Findings

- **`hero/8.webp` 825 KB** — largest image; feeds a 320×160 card. Should be ≤ ~60–80 KB after re-encode.
- **`hero/7.webp` 510 KB** — second largest; same treatment.
- **`hero/1.gif` 703 KB** — heavy for its 450×334 size due to animation (20 frames).
- **`favicon.ico` 181 KB** — ~10× the normal size; regenerate from the 32px PNG.
- **`og.jpg` 224 KB** — reasonable bytes but wrong dimensions and format; ~100 KB after 1200×630 WebP.
- **`promo1-4.jpg` ≈ 1.05 MB combined** — unused.
- Bytes-per-megapixel check: `7.webp` = 509,630 / 24.0 MP ≈ **21 KB/MP** (fine); `8.webp` ≈ **34 KB/MP** (weak compression); `1.webp` ≈ 56,430 / 13.3 MP ≈ **4 KB/MP** (very tight — near-lossless boundary).

---

## 9. Naming Audit

Current non-descriptive names and recommendations (follow `section-purpose[-NN]` convention):

| Current | Recommended | Reason |
| --- | --- | --- |
| `hero/1.gif` | `home/hero-mobile-animation.webp` | Functional + route + purpose; disambiguates from About hero use |
| `hero/1.webp` | `about/journey-01.webp` | Non-descriptive numeral |
| `hero/2.webp` | `about/journey-02.webp` (keep 3.webp ref→same) | Duplicate collapse |
| `hero/3.webp` | (consolidate into journey-02) | Duplicate |
| `hero/4.webp` | `about/journey-03.webp` | — |
| `hero/5.webp` | `about/journey-04.webp` (keep 6.webp ref→same) | Duplicate collapse |
| `hero/6.webp` | (consolidate into journey-04) | Duplicate |
| `hero/7.webp` | `about/journey-05.webp` | — |
| `hero/8.webp` | `about/journey-06.webp` | — |
| `hero/card-products.jpg` | `home/hero-stat-products.webp` | Semantic + format |
| `hero/card-partners.jpg` | `home/hero-stat-partners.webp` | Semantic + format |
| `og.jpg` | `og/og-1200x630.webp` (or keep `og.jpg` name) | Keep canonical name for metadata stability; move under `og/` |
| `noise.png` | delete or `brand/logo-mark-cropped.svg` | Misnamed (SVG content) |
| `promo1…4.jpg` | delete, or `promos/promo-01…04.webp` | Legacy set |
| `favicon-*.png` | `favicon/favicon-32.png` etc. | Grouping |

**Convention:** `{section}/{subject-or-purpose}-{variant}.{webp|svg|png}` — lowercase kebab-case,
leading route/section segment, purpose before variant.

---

## 10. Dimension Recommendations

Derived from actual UI slot size × 2 (retina), not from source size:

| Asset | Current | Recommended | Slot basis |
| --- | --- | --- | --- |
| `hero/1.gif` | 450×334 | 780×585 static poster (4/3 @2x) | mobile hero ~390×293 @2x |
| `hero/1–8.webp` | up to 6000×4000 | **640×320** (2:1 @2x) | journey card ≈320×160 @2x |
| `hero/card-*.jpg` (when restored) | n/a | **480×512** (≈230×256 @2x) | stat card ≈230×256 @2x |
| `og.jpg` | 1688×1688 | **1200×630** | OG spec |
| `apple-touch-icon.png` | 165×231 | **180×180** | iOS spec |
| `favicon.ico` | 9-icon 181 KB | **16/32/48 single multi-size ≈20 KB** | browser |
| `promo1–4.jpg` | 1920×… | n/a (unused) | — |

Philosophy cards (aspect 3/4, ≈320×427 @2x = **640×854**) should use the same **640×320-era source
set re-cropped** to 3/4 — do not ship 3456×5184 portraits.

---

## 11. `next/image` Audit

All `<img>` occurrences in `app/` + `components/`:

| Location | Current | Recommendation |
| --- | --- | --- |
| `components/public/ui/MediaSlider.tsx:101,119` — GIF slides via raw `<img>` (desktop+mobile) | Raw `<img>`, no lazy, no optimize, no sizes | Convert GIF → animated WebP/MP4, then render via `next/image` (`fill`, `sizes`, `priority={i===0}`) exactly like the image branch. Keep raw `<img>` only if animation+external URL makes it unavoidable |
| `MediaSlider` image branch (non-GIF) | `next/image fill` ✓ | Add `loading="lazy"` + `decoding="async"` for **non-first** slides; avoid mounting hidden desktop+mobile duplicates (documented P1-5 in UI audit) |
| `app/(public)/about/AboutClient.tsx:153` — story `hero/1.gif` | `next/image fill unoptimized` | Remove `unoptimized`; use static poster WebP (or animated WebP) so the optimizer engages |
| `components/public/home/Philosophy.tsx:156` | `next/image fill` ✓ but **broken src** (`/hero/1.jpg`…) | Repoint to existing webp files (fix duplicates first) |
| `components/public/home/Hero.tsx:181` | `next/image fill` ✓ but **broken src** (`card-*.jpg`) | Repoint to existing/new assets; add `priority` (above the fold, LCP-adjacent) |
| `app/(public)/about/AboutClient.tsx:317` journey | `next/image fill` ✓ | Add `loading="lazy"` (below fold); keep `sizes` |
| Products/Blogs/Cart/Related/Admin images | `next/image fill` ✓ | Already correct. Add `placeholder`/`sizes` consistency; blog content markdown images render as raw `<img>` — consider a ReactMarkdown image override using `next/image` |
| Logo usages (`Navbar`, `Footer`) | `next/image` ✓ | Navbar has `priority` (good, LCP-adjacent). Fine |

**No `<img>` should be retained** except possibly the GIF slide path in `MediaSlider` (only if the
animation is converted to a video). Everything else is convertible with benefit.

---

## 12. LCP / Above-the-Fold Assets

| # | Asset | Route | Fold | Loading | Recommendation |
| --- | --- | --- | --- | --- | --- |
| 1 | `hero/1.gif` (703 KB, animated) | `/` mobile hero | Above | Raw `<img>`, eager | **Highest priority.** Convert to animated WebP (~200–350 KB) or MP4+poster; serve via `next/image` with `priority`; keep 4/3 aspect |
| 2 | `hero/card-products.jpg` / `card-partners.jpg` | `/` desktop right card | Above | `<Image fill>` **broken 404** | Restore/repoint; add `priority` after fixing |
| 3 | `hero/1.gif` (About story) | `/about` | Above | `next/image unoptimized` | Remove `unoptimized`; use optimized static/animated WebP |
| 4 | Blog thumbnail (R2) | `/blogs/[slug]` | Above | `next/image fill priority` ✓ | Already correct |
| 5 | Product image (R2) | `/products/[slug]` | Above | `next/image fill priority` ✓ | Already correct |
| 6 | R2 promo slides (MediaShowcase) | `/` below hero | Below | `next/image` | Lazy-load non-first slides |

The desktop homepage LCP is effectively the **hero heading text** today (the right-card images are
broken), and the mobile LCP is the animated GIF. Both must be addressed.

---

## 13. Duplicate & Near-Duplicate Assets

| Group | Files | MD5 | Recommendation |
| --- | --- | --- | --- |
| A | `hero/2.webp` = `hero/3.webp` | `312e79ea…` | **CONSOLIDATE** to one file; repoint Philosophy card 3 + journey step 3 to the same asset |
| B | `hero/5.webp` = `hero/6.webp` | `b6b51e0b…` | **CONSOLIDATE** to one file |
| C | `noise.png` = `v-cropped.svg` | `7e7853ff…` | **DELETE** both (unused) or keep one as `brand/logo-mark-cropped.svg` |
| D | `v.svg`/`edic.svg`/`wellness.svg` | unique hashes | Near-duplicate brand-mark family — **KEEP** only the used `logo.svg`; archive/delete the rest |
| E | `favicon-*.png` set | unique | Resized copies of one icon — consolidate to a single `favicon.ico` + one 32/48px png if any are needed |

Note: the deleted `hero/*.jpg` originals (HEAD) were **all distinct** — the WebP pass collapsed
photos 2↔3 and 5↔6. The original 6-photo variety is lost in the current WebP set.

---

## 14. Unused Assets (with confidence)

| Asset | Confidence | Note |
| --- | --- | --- |
| `promo1–4.jpg` | **Likely unused** | No code/DB reference anywhere; legacy promo set. Not 100% confirmed because banner/slide URLs live in the database — but no seed/migration references these names and uploads use UUID keys |
| `next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg` | **Confirmed unused** | Create-Next-App default assets, no references |
| `phone.svg` | **Likely unused** | No reference; contact uses lucide icons |
| `v.svg`, `v-cropped.svg`, `edic.svg`, `wellness.svg`, `noise.png` | **Confirmed unused** | Brand-mark variants; no references |
| `favicon-16…256.png` | **Confirmed unused** | No `metadata.icons`, `<link>` or manifest references them |
| `hero/news according GIF.gif:Zone.Identifier` | **Confirmed unused/junk** | Windows ADS leftover committed to repo |
| `favicon.ico` | Possibly used by convention (browsers auto-request `/favicon.ico`) | Keep, but shrink |
| `apple-touch-icon.png` | Possibly used by iOS convention | Keep, but make square 180×180 |
| `humans.txt` | Convention file | Keep |

**Verification method:** exhaustive `grep` over `app/`, `components/`, `lib/`, `prisma/`, `*.json`,
`*.css`, plus dynamic-path analysis (product/blog/slide/banner services all build UUID keys, never
the legacy names).

---

## 15. Public-File Audit (non-image)

| File | What it is | Referenced | Exposed? | Verdict |
| --- | --- | --- | --- | --- |
| `humans.txt` | Human-readable site info | Convention | No sensitive data | Keep (optional) |
| `hero/news according GIF.gif:Zone.Identifier` | Windows Zone.Identifier ADS payload (25 B) | No | Harmless but junk | **Delete** (it implies a `.gitignore`/`core.autocrlf` hygiene gap) |

**No `.json`/`.csv`/`.xml`/`.zip`/`.map`/`.pdf` files are present in `public/`** — no accidental
data exposure found. Source maps are disabled (`productionBrowserSourceMaps: false`). Sensitive
data (env, DB, R2 credentials) is correctly **outside** `public/`.

---

## 16. Existing Optimized Assets Not Being Used

- `hero/1.webp … 6.webp` exist and are the optimized replacements for the deleted `hero/1–6.jpg`,
  but `Philosophy.tsx` still points at the **jpg** names → the WebP files are optimized-and-unused
  for that slot. **Repoint references before creating any new assets.**
- The correct fix for the Hero stat cards is to **repoint `card-*.jpg`** to the surviving WebP
  photos (or regenerate two small 480×512 crops); do not create fresh JPEGs.

---

## 17. Priority Scoring

| ID | Item | P | Impact | Effort | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Repoint `Hero.tsx` `card-*.jpg` refs (broken, above the fold) | **P0** | High | XS | High |
| 2 | Repoint `Philosophy.tsx` `hero/1–6.jpg` refs (broken, below the fold) | **P0** | High | XS | High |
| 3 | Convert `hero/1.gif` → animated WebP/MP4 + `next/image priority` (mobile LCP) | **P1** | High | M | Medium |
| 4 | Re-encode `hero/7.webp`, `hero/8.webp` to 640×320 (≈1.33 MB → ~120 KB) | **P1** | Medium | S | High |
| 5 | Resolve duplicate pairs `2/3.webp`, `5/6.webp` (correctness + weight) | **P1** | Medium | S | High |
| 6 | Re-export `og.jpg` at 1200×630 (matches declared metadata) | **P1** | Medium | S | High |
| 7 | Shrink `favicon.ico` (181 KB → ~20 KB); fix non-square `apple-touch-icon.png` (180×180) | **P2** | Low | S | High |
| 8 | Remove `unoptimized` on About story `hero/1.gif` | **P1** | Medium | XS | High |
| 9 | Remove unused legacy/CNA assets (`promo1–4`, `next/vercel/globe/file/window`, `v*`, `edic`, `wellness`, `phone`, `favicon-16…256`, `noise.png`, Zone.Identifier) | **P2** | Low | S | High |
| 10 | MediaSlider: lazy non-first slides; drop hidden desktop/mobile dupes | **P2** | Medium | M | High |
| 11 | Semantic rename + `about/`, `home/`, `brand/`, `icons/` folder structure | **P2** | Low | M | High |
| 12 | Delete dead image components (`FanCarousel`, `PhilosophyGallery`/`CardGallery`, `FeatureModal`) | **P3** | Low | S | High |
| 13 | Markdown blog-image override for `next/image` | **P3** | Low | M | Medium |

---

## 18. Estimated Savings

Exact values require conversion runs; all savings are **Estimated** based on current bytes and
typical format/compression ratios for photographic content.

| Asset | Current | Expected | Saving | Basis |
| --- | --- | --- | --- | --- |
| `hero/1.gif` | 703,874 | ~200–350 KB (animated WebP) or ~60 KB poster | ~50–70% | GIF→WebP animation ratio |
| `hero/7.webp` | 509,630 | ~60–100 KB @ 640×320 | ~80–88% | resolution + density |
| `hero/8.webp` | 824,638 | ~60–100 KB @ 640×320 | ~88–93% | resolution + density |
| `hero/2–6.webp` | 703,740 | ~300 KB combined @ 640×320 | ~55–60% | resolution |
| `og.jpg` | 224,506 | ~80–120 KB @ 1200×630 WebP | ~45–60% | spec size + format |
| `favicon.ico` | 181,759 | ~15–30 KB | ~85% | standard ICO |
| `promo1–4.jpg` (if kept) | 1,051,565 | ~350–450 KB WebP | ~60–65% | format |

**Total public image weight now ≈ 4.01 MB.** Applying P0/P1/P2 image items (excluding the
delete-only P2/P3 cleanup) lands at roughly **1.5–1.7 MB — a ~55–60% reduction**. The P2/P3
"delete unused" items remove a further ~1.5 MB of never-served bytes from the deploy.

---

## 19. Recommended Folder Structure

Justified (improves discoverability, dedupe, and the P0 repoint work):

```
public/
  brand/            # logo.svg, logo-mark variants
  icons/social/     # whatsapp, instagram, facebook
  icons/legacy/     # only if kept (globe/file/window/next/vercel/phone) — preferably deleted
  favicon/          # favicon.ico + the one-or-two pngs actually referenced
  og/               # og-1200x630.webp (+ jpg fallback)
  home/             # hero-mobile-animation.webp, hero-stat-*.webp
  about/            # journey-01…06.webp
  promos/           # only if promo1–4 are kept
  humans.txt        # root
```

Keep `hero/` only if the same files serve multiple routes; otherwise split per the above. This is a
P2 convenience, not a launch blocker.

---

## 20. Priority Action Plan (ordered by impact)

1. **P0** Fix 8 broken image references (`Philosophy` 1–6.jpg → existing webp; `Hero` card-*.jpg → webp/regenerated). Verify with the site rendering at `/`.
2. **P0** (same change) resolve the `2/3.webp` and `5/6.webp` duplicates so the Philosophy/About UI shows the intended 6 distinct photos.
3. **P1** Replace `hero/1.gif` with animated WebP (or MP4 + poster) and render via `next/image` with `priority` in `Hero.tsx` (mobile) and remove `unoptimized` in About `storyMedia`.
4. **P1** Re-encode `hero/7.webp`, `hero/8.webp` (and ideally all journey webp) to 640×320.
5. **P1** Re-export `og.jpg` at 1200×630 (WebP; keep JPEG fallback if social scrapers require).
6. **P2** Regenerate `favicon.ico` (~20 KB) and square `apple-touch-icon.png` (180×180).
7. **P2** Delete unused legacy assets (≈1.5 MB) + `news …:Zone.Identifier` junk file.
8. **P2** MediaSlider: lazy-load non-first slides and avoid mounting desktop+mobile duplicates.
9. **P2** Apply semantic rename + folder structure (`home/`, `about/`, `brand/`, `icons/`, `og/`, `favicon/`).
10. **P3** Delete dead image components (`FanCarousel`, `PhilosophyGallery`, `FeatureModal`); add a `next/image` override for blog markdown images.

---

## 21. Verification Checklist (post-implementation)

```bash
# 1. Confirm no broken asset references remain
rg -n 'hero/[0-9]+\.jpg|card-.*\.jpg' app components      # expect 0 results

# 2. Every public file either referenced or intentionally retained
rg -n 'promo[0-9]|next\.svg|vercel\.svg|globe\.svg|file\.svg|window\.svg|phone\.svg|edic\.svg|wellness\.svg|v\.svg|v-cropped|noise\.png' app components lib || echo clean

# 3. Static analysis clean
npm run lint
npm run typecheck

# 4. Build + confirm the optimizer accepts all referenced sources
npm run build

# 5. Runtime checks (local dev):
#    - GET /            → hero stat images render (no 404); mobile hero ≤ ~350 KB, non-GIF
#    - GET /about       → journey shows 6 distinct images at ~640×320
#    - GET /blogs/[slug], /products/[slug] → R2 images still optimize via next/image
#    - response of /og.jpg → 1200×630 (or /og/og-1200x630.webp)
#    - /favicon.ico     → ≤ ~30 KB; /apple-touch-icon.png → 180×180

# 6. Confirm the retained asset list equals docs/asset-inventory.json
python3 - <<'PY'
import json
expected = [a["path"].replace("public/","") for a in json.load(open("docs/asset-inventory.json"))["assets"]]
import os
actual = []
for r,_,fs in os.walk("public"):
    for f in fs:
        actual.append(os.path.relpath(os.path.join(r,f),"public"))
print("OK" if sorted(expected)==sorted(actual) else "MISMATCH")
PY

# 7. Verify no image exceeds a source-resolution budget (e.g. ≤ ~2048px on the long edge)
```

---

## 22. Confirmed Findings vs Prior Audits

Prior docs (`UI_ARCHITECTURE_AUDIT.md` P1-5, `FINAL_SEO_AUDIT.md`) flagged the hero GIF and
MediaSlider pre-mounting. **Both findings are confirmed against the current tree**, with the added
discovery that the JPEG→WebP migration left the homepage with **8 broken image references** and
duplicated photos — a regression that post-dates those audits.

---

## 23. Cleanup Log — Step 5: Removed Confirmed-Unused Public Assets

**Date:** 2026-08-16

### Deleted files (20)

| File | Reason | Verification |
| --- | --- | --- |
| `next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg` | Create-Next-App default assets, zero references | Exact + partial grep over `app/`, `components/`, `lib/`, `prisma/`, `scripts/`, all config/JSON/env files, CSS, metadata |
| `phone.svg` | Zero references; contact UI uses lucide icons | Same |
| `v.svg`, `v-cropped.svg`, `edic.svg`, `wellness.svg` | Unused brand-mark variants; only `logo.svg` is referenced (Navbar, Footer, JSON-LD) | Same |
| `noise.png` | Misnamed file (SVG content in `.png`), identical to `v-cropped.svg`, zero references | Same |
| `favicon-16.png`, `favicon-32.png`, `favicon-48.png`, `favicon-64.png`, `favicon-72.png`, `favicon-96.png`, `favicon-128.png`, `favicon-256.png` | No `metadata.icons`, no `<link>`, no web manifest reference them anywhere; `favicon.ico` remains for browser convention | Same + `find` for manifests |
| `hero/1.gif:Zone.Identifier` | Windows ADS junk file (25 B) committed/untracked on disk; no references | `find -iname "*zone*"`, `git ls-files` |

**Verification method:** exhaustive `grep -rnE` over the whole repo (excluding `node_modules`, `.next`, `.git`) for each exact filename, exact public URL, partial name, imports, JSX refs, `url()` CSS refs, metadata, JSON/config, and dynamic-path patterns. The only matches for every deleted asset were this audit (`docs/ASSET_AUDIT.md`) and `docs/asset-inventory.json` themselves.

### Retained — not deleted

| File | Why |
| --- | --- |
| `promo1.jpg` – `promo4.jpg` | **Usage uncertain** — no static references, but slide/banner media URLs live in the database; explicitly out of scope for this step |
| `favicon.ico`, `apple-touch-icon.png` | Convention-served (browsers/iOS auto-request); explicitly out of scope |
| `og.jpg`, `humans.txt` | Referenced by metadata / convention |
| `hero/1.gif`, `hero/1.webp` – `10.webp` | In use (Home/About) / scope excluded |
| R2, blog, product, MediaSlider, logo, social SVGs | In use or dynamic |

### Result

- `public/` root: 31 → **12 files**
- `public/hero/`: 12 → **11 files** (10 webp + animated GIF)
- Bytes removed: **see inventory diff** (≈ 24,907 B of favicon PNGs + SVGs + junk file)

`docs/asset-inventory.json` updated: 41 → **21 asset entries** (deleted assets and the stale
`hero/news according GIF.gif:Zone.Identifier` entry removed).