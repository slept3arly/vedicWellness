# Vedic Wellness — Asset Audit

> **STATUS: SUPERSEDED IN PART.** This audit was completed on 2026-08-16. The current, authoritative guidance for asset management lives in [`ASSET_MANAGEMENT.md`](ASSET_MANAGEMENT.md). This document serves as a historical reference with reconciliations showing what was fixed. For current asset management guidance, refer to `ASSET_MANAGEMENT.md`.

> **Reconciliation status:** P0 broken image references have been documented as action items. The JPEG→WebP migration left references that must be repointed before deploy (see ASSET_MANAGEMENT.md → P0 section). P1/P2 recommendations are partially addressed; refer to ASSET_MANAGEMENT.md for the current priority action plan.

---

## Historical Note

This audit documented the asset state as of 2026-08-16. Several P1 findings have been tracked and addressed in `ASSET_MANAGEMENT.md`. The machine-readable inventory is preserved in [`docs/asset-inventory.json`](asset-inventory.json).

> **Notable resolutions since audit:**
> - P0 broken references from JPEG→WebP migration documented and prioritized
> - Duplicate image pairs (`2↔3.webp`, `5↔6.webp`) identified for consolidation
> - Oversized hero WebP files (`7.webp`, `8.webp`) flagged for re-encoding to 640×320
> - `og.jpg` dimension mismatch flagged for re-export at 1200×630
> - Unused legacy assets identified for potential removal

> **This document is retained as a historical reference only.** All actionable items have been captured in `ASSET_MANAGEMENT.md`. Do not act on outdated items without verifying against current code and `ASSET_MANAGEMENT.md`.

---

## P0 — Broken Image References (Documentation Only)

> **P0 — Broken references from JPEG→WebP migration.** A conversion pass deleted
> `public/hero/1.jpg…6.jpg` and `public/hero/card-products.jpg` / `card-partners.jpg` from the
> working tree, but two shipped components still reference those exact paths:
>
> - `components/public/home/Philosophy.tsx` → `"/hero/1.jpg"…"/hero/6.jpg"` (6 broken cards below the fold)
> - `components/public/home/Hero.tsx` → `"/hero/card-products.jpg"`, `"/hero/card-partners.jpg"` (2 broken stat images, desktop, above the fold)
>
> These are **P0 broken references** that must be repointed to the surviving WebP files (or new assets)
> before deploy. The conversion also produced **duplicate pairs** (`hero/2.webp === hero/3.webp`,
> `hero/5.webp === hero/6.webp`) — two of the six original photos were collapsed into duplicates, so
> the About "journey" section currently repeats images.

---

## P1 — Hero Animated GIF & Oversized Assets

> **P1 — Hero animated GIF.** `hero/1.gif` (703 KB, 20 frames) is the mobile LCP candidate. The
> surviving WebP files are efficient in bytes but oversized in pixel dimensions (up to 6000×4000)
> for ~320 px card slots.
>
> **P1 — Oversized WebP files.** `hero/7.webp` (510 KB) and `hero/8.webp` (825 KB) exceed the
> recommended 640×320 display size. Re-encoding to 640×320 @2x would reduce them to ~100 KB each.

---

## P2/P3 — Cleanup Items (Historical Record)

> ~20 of the 39 images are **unreferenced legacy/Create-Next-App assets** (promo1-4.jpg ≈ 1.05 MB,
> favicon-16…256.png, `next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg`, `phone.svg`,
> `v.svg`, `v-cropped.svg`/`noise.png`, `edic.svg`, `wellness.svg`). `favicon.ico` (181 KB) and a
> non-square `apple-touch-icon.png` (165×231) are convention-served but suboptimal.
>
> The `hero/news according GIF.gif:Zone.Identifier` file is Windows ADS junk committed to the repo.

> **Estimated potential savings:** ~4.01 MB → ~1.6 MB (**≈ 60%**) if the P0/P1 items are applied.
> Additional ~1.5 MB can be removed by deleting unused legacy assets (P2/P3 cleanup).

---

## Related Documents

- [`ASSET_MANAGEMENT.md`](ASSET_MANAGEMENT.md) — Current asset management guidance, priority action plan, and format analysis
- [`docs/asset-inventory.json`](asset-inventory.json) — Machine-readable asset inventory
- [`docs/archive/`](archive/) — Historical audits and investigations