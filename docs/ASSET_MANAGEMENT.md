# Vedic Wellness — Asset Management

**Purpose:** Active guidance for managing repository assets — images, icons, favicons, and optimization priorities. Current as of 2026-08-31.

**Source of truth:** `docs/asset-inventory.json` for machine-readable inventory. This document provides human-readable guidance and priority action items.

---

## 🚨 P0 — Broken Image References (Must Fix Before Deploy)

The JPEG→WebP migration left broken references that must be repointed before deployment:

| Component | Broken Path | Issue |
|---|---|---|
| `components/public/home/Philosophy.tsx` | `"/hero/1.jpg"…"/hero/6.jpg"` | 6 broken cards below the fold |
| `components/public/home/Hero.tsx` | `"/hero/card-products.jpg"`, `"/hero/card-partners.jpg"` | 2 broken stat images, desktop, above the fold |

**Action:** Repoint these references to the surviving WebP files (or new assets) before deploying.

---

## 📦 Asset Inventory

Machine-readable inventory: [`docs/asset-inventory.json`](asset-inventory.json)

Contains 21 current asset entries with references, sizes, formats, and status. Key sections:

- **Public images** (`public/`) — 12 entries including logo, social icons, og.jpg, favicon.ico, apple-touch-icon.png, humans.txt
- **Hero images** (`public/hero/`) — 11 entries (10 WebP + 1 GIF), including duplicate pairs (`2↔3.webp`, `5↔6.webp`) and oversized files (`7.webp`, `8.webp`)
- **R2-backed media** — Product, blog, slide, and banner images served from Cloudflare R2 (database-driven, not in `public/`)

---

## 🔍 Format Analysis & Recommendations

### Hero Images

| Asset | Current | Recommended | Priority |
|---|---|---|---|
| `hero/1.gif` (703 KB, animated, 20 frames) | Raw `<img>` above the fold (mobile LCP candidate) | **Convert to animated WebP/MP4 + `next/image` with `priority`** | P1 |
| `hero/1.webp`…`8.webp` | Up to 6000×4000 source resolution for ~320 px slots | **Re-encode to 640×320 @2x** (≈100 KB each) | P1 |
| `hero/2.webp` = `hero/3.webp` (duplicate) | 111 KB each | **Consolidate to one file**; repoint Philosophy card 3 + journey step 3 | P1 |
| `hero/5.webp` = `hero/6.webp` (duplicate) | 125 KB each | **Consolidate to one file** | P1 |
| `og.jpg` (225 KB, 1688×1688) | JPEG, wrong dimensions for OG spec | **Re-export at 1200×630 WebP** (~80–120 KB) | P1 |

### Duplicate & Near-Duplicate Assets

| Group | Files | Action |
|---|---|---|
| A | `hero/2.webp` = `hero/3.webp` | **CONSOLIDATE** to one file |
| B | `hero/5.webp` = `hero/6.webp` | **CONSOLIDATE** to one file |
| C | `noise.png` = `v-cropped.svg` | **DELETE** both (unused, misnamed) |
| D | `v.svg`/`edic.svg`/`wellness.svg` | **KEEP only `logo.svg`**; archive/delete rest |
| E | `favicon-16…256.png` set | **Consolidate to `favicon.ico`** + one 32/48px png if needed |

### Unused Assets (remove to reduce deploy size)

| Asset | Confidence | Note |
|---|---|---|
| `promo1–4.jpg` | Likely unused | No code/DB references; legacy promo set |
| `next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg` | Confirmed unused | Create-Next-App defaults |
| `phone.svg` | Likely unused | No reference; contact UI uses lucide icons |
| `v.svg`, `v-cropped.svg`, `edic.svg`, `wellness.svg`, `noise.png` | Confirmed unused | Brand-mark variants; no references |
| `favicon-16…256.png` | Confirmed unused | No `metadata.icons`, `<link>`, or manifest references them |
| `hero/news according GIF.gif:Zone.Identifier` | Confirmed unused/junk | Windows ADS leftover committed to repo |

**Estimated savings:** ~4.01 MB → ~1.6 MB (~60% reduction) applying P0/P1 items. Additional ~1.5 MB removable via P2/P3 cleanup.

---

## 📦 `next/image` Audit

| Location | Current | Recommendation |
|---|---|---|
| `MediaSlider.tsx:101,119` — GIF slides via raw `<img>` | No lazy, no optimize, no sizes | **Convert GIF → animated WebP/MP4**, then render via `next/image` (`fill`, `sizes`, `priority={i===0}`) |
| `MediaSlider` non-GIF image branch | `next/image fill` ✓ | Add `loading="lazy"` + `decoding="async"` for non-first slides; avoid mounting hidden desktop+mobile duplicates |
| `AboutClient.tsx:317` journey | `next/image fill unoptimized` | Remove `unoptimized`; use static poster WebP |
| `Philosophy.tsx:156` | `next/image fill` ✓ but broken src (`/hero/1.jpg`…) | **Repoint to existing WebP files** (fix duplicates first) |
| `Hero.tsx:181` | `next/image fill` ✓ but broken src (`card-*.jpg`) | **Repoint to existing/new assets; add `priority`** (above the fold, LCP-adjacent) |
| Products/Blogs/Cart/Related/Admin images | `next/image fill` ✓ | Already correct. Add consistent `placeholder`/`sizes`. |
| Logo usages (`Navbar`, `Footer`) | `next/image` ✓ | Navbar has `priority` (good, LCP-adjacent). Fine |

**Rule:** No `<img>` should be retained except possibly the GIF slide path in `MediaSlider` (only if animation is converted to video). Everything else is convertible with benefit.

---

## ⚙️ Priority Action Plan (ordered by impact)

1. **P0** Repoint `Hero.tsx` `card-*.jpg` refs (broken, above the fold) — verify with site rendering at `/`
2. **P0** Repoint `Philosophy.tsx` `hero/1–6.jpg` refs (broken, below the fold) — verify surviving WebP files
3. **P1** Replace `hero/1.gif` with animated WebP/MP4 + `next/image` `priority` in `Hero.tsx` (mobile) and remove `unoptimized` in About `storyMedia`
4. **P1** Re-encode `hero/7.webp`, `hero/8.webp` (and ideally all journey WebP) to 640×320
5. **P1** Resolve duplicate pairs `2/3.webp` and `5/6.webp` (correctness + weight)
6. **P1** Re-export `og.jpg` at 1200×630 (WebP; keep JPEG fallback if social scrapers require)
7. **P2** Shrink `favicon.ico` (181 KB → ~20 KB); fix non-square `apple-touch-icon.png` (180×180)
8. **P2** Delete unused legacy assets (`promo1–4`, `next/vercel/globe/file/window`, `v*`, `edic`, `wellness`, `phone`, `favicon-16…256`, `noise.png`, Zone.Identifier)
9. **P2** MediaSlider: lazy-load non-first slides; avoid mounting desktop+mobile duplicates
10. **P2** Apply semantic rename + folder structure (`home/`, `about/`, `brand/`, `icons/`, `og/`, `favicon/`)
11. **P3** Delete dead image components (`FanCarousel`, `PhilosophyGallery`/`CardGallery`, `FeatureModal`); add `next/image` override for blog markdown images

---

## 📏 Dimension Recommendations (from actual UI slot sizes × 2 retina)

| Asset | Current | Recommended | Slot Basis |
|---|---|---|---|
| `hero/1.gif` | 450×334 | 780×585 static poster (4/3 @2x) | mobile hero ~390×293 @2x |
| `hero/1–8.webp` | up to 6000×4000 | **640×320** (2:1 @2x) | journey card ≈320×160 @2x |
| `hero/card-*.jpg` (when restored) | n/a | **480×512** (≈230×256 @2x) | stat card ≈230×256 @2x |
| `og.jpg` | 1688×1688 | **1200×630** | OG spec |
| `apple-touch-icon.png` | 165×231 | **180×180** | iOS spec |
| `favicon.ico` | 9-icon 181 KB | **16/32/48 single multi-size ≈20 KB** | browser |

Philosophy cards (aspect 3/4, ≈320×427 @2x = **640×854**) should use the same **640×320-era source set re-cropped** to 3/4 — do not ship 3456×5184 portraits.

---

## 🛠 Verification Checklist (post-implementation)

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
#   - GET /            → hero stat images render (no 404); mobile hero ≤ ~350 KB, non-GIF
#   - GET /about       → journey shows 6 distinct images at ~640×320
#   - GET /blogs/[slug], /products/[slug] → R2 images still optimize via next/image
#   - response of /og.jpg → 1200×630 (or /og/og-1200x630.webp)
#   - /favicon.ico     → ≤ ~30 KB; /apple-touch-icon.png → 180×180

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

## 📦 Related Documents

- [`docs/CURRENT_SYSTEM.md`](CURRENT_SYSTEM.md) — Current architecture (SEO, products, blogs, orders rules)
- [`docs/FUTURE_MAINTENANCE.md`](FUTURE_MAINTENANCE.md) — Maintenance rules, do-not-reintroduce list
- [`docs/BLOG_AUTHORING_GUIDE.md`](BLOG_AUTHORING_GUIDE.md) — Blog authoring form and Markdown guide
- [`docs/asset-inventory.json`](asset-inventory.json) — Machine-readable asset inventory