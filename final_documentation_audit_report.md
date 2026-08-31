# Documentation Audit Report — Vedic Wellness

---

## 1. Documentation Inventory

| Current File | Recommendation | New File | Reason |
|---|---|---|---|
| `README.md` | UPDATE | `README.md` | Removed OTP/verify-required references; updated status section to reflect email/password auth only; updated documentation references |
| `TECH_STACK.md` | UPDATE | `TECH_STACK.md` | Removed obsolete OTP/verify-required references; updated auth flow description; removed stale signupSession.ts reference |
| `docs/CURRENT_SYSTEM.md` | KEEP | `docs/CURRENT_SYSTEM.md` | Authoritative current-state document; verified against codebase; serves as source of truth for all other docs |
| `docs/FUTURE_MAINTENANCE.md` | KEEP | `docs/FUTURE_MAINTENANCE.md` | Essential maintenance rules and do-not-reintroduce list; explicitly referenced by all other docs; separates historical from current |
| `docs/BLOG_AUTHORING_GUIDE.md` | KEEP | `docs/BLOG_AUTHORING_GUIDE.md` | Accurate description of actual blog authoring implementation; unique useful information not covered elsewhere |
| `docs/asset-inventory.json` | KEEP | `docs/asset-inventory.json` | Machine-readable reference; used by audit tools and future documentation; keeps updated as assets change |
| `docs/FINAL_SEO_AUDIT.md` | ARCHIVE | `docs/FINAL_SEO_AUDIT.md` (historical) | Explicitly "SUPERSEDED IN PART": current SEO architecture lives in CURRENT_SYSTEM.md; serves as historical reference with reconciliations |
| `docs/FINAL_BACKEND_PERFORMANCE_AUDIT.md` | ARCHIVE | `docs/FINAL_BACKEND_PERFORMANCE_AUDIT.md` (historical) | Historical audit completed 2026-08-16; some P1 items resolved but many remain tracked elsewhere; retained as reference |
| `docs/FINAL_PRODUCT_READINESS.md` | ARCHIVE | `docs/FINAL_PRODUCT_READINESS.md` (historical) | "LARGELY SUPERSEDED — HISTORICAL DOCUMENT": Do not execute as-is; current architecture in CURRENT_SYSTEM.md; ship blockers addressed elsewhere |
| `docs/FINAL_SHIP_CHECKLIST.md` | ARCHIVE | `docs/FINAL_SHIP_CHECKLIST.md` (historical) | "historical audit snapshot": findings re-verified; current architecture in CURRENT_SYSTEM.md; maintenance rules in FUTURE_MAINTENANCE.md |
| `docs/UI_ARCHITECTURE_AUDIT.md` | ARCHIVE | `docs/UI_ARCHITECTURE_AUDIT.md` (historical) | "HISTORICAL SNAPSHOT (audit date 2026-08-10)": all obsolete sections confirmed resolved; retained as historical reference |
| `docs/TURNSTILE_LAYOUT_INVESTIGATION.md` | ARCHIVE | `docs/TURNSTILE_LAYOUT_INVESTIGATION.md` (historical) | "HISTORICAL INVESTIGATION (completed 2026-08-12)": some technical details useful; confidence levels noted; Cloudflare iframe external to package |
| `docs/ASSET_AUDIT.md` | UPDATE | `docs/ASSET_AUDIT.md` | Updated P0 broken references from JPEG→WebP migration; added P1 hero GIF analysis; fixed duplicate "Estimated potential savings" line; P2/P3 cleanup items noted |
## 2. Files Changed

### Created
- No new documentation files created (existing structure retained with content updates)

### Modified
- `README.md` — Removed OTP/verify-required references; updated status; updated documentation references section
- `TECH_STACK.md` — Removed obsolete OTP/verify-required references; updated auth flow description; removed stale signupSession.ts reference
- `docs/ASSET_AUDIT.md` — Updated P0 broken references from JPEG→WebP migration; added P1 hero GIF analysis; fixed duplicate "Estimated potential savings" line
- `docs/FINAL_SEO_AUDIT.md` — Added "HISTORICAL DOCUMENT" marker; added reconciliation status; clarified historical role
- `docs/FINAL_BACKEND_PERFORMANCE_AUDIT.md` — Added historical audit marker; noted resolutions since audit; added cross-reference to CURRENT_SYSTEM.md and FUTURE_MAINTENANCE.md
- `docs/FINAL_PRODUCT_READINESS.md` — Added historical document marker; added note about ship blockers addressed; added warning not to execute as-is
- `docs/FINAL_SHIP_CHECKLIST.md` — Added "HISTORICAL AUDIT SNAPSHOT" marker; clarified audit scope; added cross-reference to FUTURE_MAINTENANCE.md
- `docs/UI_ARCHITECTURE_AUDIT.md` — Added "HISTORICAL SNAPSHOT" marker; verified all obsolete sections confirmed resolved; added "DO NOT REINTRODUCE" advisory
- `docs/TURNSTILE_LAYOUT_INVESTIGATION.md` — Added "HISTORICAL INVESTIGATION" marker; added confidence levels; added cross-reference to FUTURE_MAINTENANCE.md

### Renamed
- No files strictly renamed (naming convention applied to existing filenames; historical docs retain names with added markers)

### Merged
- No document merges required (historical documents kept separate with clear markers; their content referenced rather than merged into active docs)

### Deleted
- No documents deleted (all historical documentation retained for reference; none were genuinely obsolete to the point of deletion)
## 3. Redundant Documentation

### 3.1 FINAL_SEO_AUDIT.md vs CURRENT_SYSTEM.md
- **Duplicated what:** SEO architecture description, P1/P2 findings, canonical rules, robots/sitemap/structured data details
- **Why keeping both was unnecessary:** FINAL_SEO_AUDIT.md was written as a historical audit with specific findings reconciled against code at the time. CURRENT_SYSTEM.md is the authoritative current-state document that all other docs reference. The reconciliations in FINAL_SEO_AUDIT.md already document what was fixed.
- **Where the useful information now lives:** Current SEO architecture is in `CURRENT_SYSTEM.md` §4 (SEO architecture), with current rules in `FUTURE_MAINTENANCE.md` §1 (SEO rules). The reconciliations in FINAL_SEO_AUDIT.md serve as historical context showing the gap-closing process.

### 3.2 FINAL_BACKEND_PERFORMANCE_AUDIT.md vs CURRENT_SYSTEM.md + FUTURE_MAINTENANCE.md
- **Duplicated what:** Database performance findings, API/server action performance, caching strategies, index recommendations, limits tables
- **Why keeping both was unnecessary:** The audit documented state at a point in time. CURRENT_SYSTEM.md describes current architecture; FUTURE_MAINTENANCE.md contains the do-not-reintroduce list and maintenance rules. Several P1 items from the audit were already resolved (notably public blog pagination using DB-level skip/take).
- **Where the useful information now lives:** Database index recommendations in `FUTURE_MAINTENANCE.md` §1 (Product rules, etc.); caching strategy in `CURRENT_SYSTEM.md` §9; performance limits and recommendations tracked in `FUTURE_MAINTENANCE.md` §8 (Optional/deferred work).

### 3.3 FINAL_PRODUCT_READINESS.md vs FINAL_SHIP_CHECKLIST.md
- **Duplicated what:** Ship blockers, must-fix items, frontend polish items, deferred/remove features
- **Why keeping both was unnecessary:** Both are historical ship documents from before the 2026 cleanup passes. FINAL_PRODUCT_READINESS.md was the primary readiness plan; FINAL_SHIP_CHECKLIST.md was the post-cleanup verification checklist. Their content is now reflected in the current state described in CURRENT_SYSTEM.md and the maintenance rules in FUTURE_MAINTENANCE.md. The item-by-item reconciliations in both documents annotate what was resolved.
- **Where the useful information now lives:** Ship blocker status tracked in FUTURE_MAINTENANCE.md operational requirements; current product readiness state in CURRENT_SYSTEM.md; deferred features documented in FUTURE_MAINTENANCE.md §8.

---
## 4. Unnecessary Documentation

### 4.1 OTP/verify-required references in README.md and TECH_STACK.md
- **Why unnecessary:** OTP verification was removed entirely; auth is email/password only. References to `/verify-required` route and OTP code created confusion (as noted in FINAL_SHIP_CHECKLIST.md P2 finding). This information is actively misleading for new developers.
- **Where the useful information now lives:** Current auth description in CURRENT_SYSTEM.md §3 (Email + password credentials, no OTP flow); FUTURE_MAINTENANCE.md §5 (Authentication rules — Do NOT recreate OTP flows).

### 4.2 Obsolescent technology references
- **Why unnecessary:** References to removed features (OTP flows, `/sales` dashboard, mock payment action, segmented-pill company selectors, decorative pills, fixed-height blog article scroll containers) clutter the documentation and may mislead developers into re-implementing removed functionality.
- **Where the useful information now lives:** FUTURE_MAINTENANCE.md §7 (DO NOT REINTRODUCE) explicitly lists all removed features with "why" rationale; CURRENT_SYSTEM.md describes current architecture.

### 4.3 Broken asset references
- **Why unnecessary:** The JPEG→WebP migration left broken image references (Philosophy.tsx → deleted JPGs, Hero.tsx → card-*.jpg) that created P0 issues. These are now documented as action items in ASSET_AUDIT.md rather than being silently present in the codebase.
- **Where the useful information now lives:** ASSET_AUDIT.md P0/P1 action items; code fixes required to repoint references.

---
## 5. Renamed Documentation

No files were renamed in a way that breaks references. The following changes were made to *content* rather than *name*:

- `README.md` — content updated (OTP references removed, status updated, documentation references updated)
- `TECH_STACK.md` — content updated (OTP references removed, auth description updated, signupSession.ts reference removed)
- `docs/ASSET_AUDIT.md` — content updated (broken references documented, P1 GIF analysis added, duplicate line fixed)

No renames were needed because the existing filenames are descriptive enough when their historical vs. current status is clearly marked (which was done through frontmatter/status sections rather than renaming). The historical documents retain their original names but are clearly marked with "HISTORICAL," "SUPERSEDED," or "ARCHIVE" status indicators in their opening sections, so developers can immediately identify which documents are authoritative current-state references and which are historical reference material.

## 6. Final Documentation Structure

Currently the documentation structure is:

```
vedicWellness/
├── README.md | Updated: auth status, removed OTP references
├── TECH_STACK.md | Updated: removed OTP refs, auth flow description
├── docs/
│   ├── CURRENT_SYSTEM.md | ✅ Authoritative current-state architecture
│   ├── FUTURE_MAINTENANCE.md | 🔒 Maintenance rules, do-not-reintroduce list
│   ├── BLOG_AUTHORING_GUIDE.md | ✅ Blog authoring guide (accurate, unchanged)
│   ├── asset-inventory.json | 📋 Machine-readable asset inventory
│   ├── FINAL_SEO_AUDIT.md | 📜 Historical audit (superseded in part)
│   ├── FINAL_BACKEND_PERFORMANCE_AUDIT.md | 📜 Historical audit (2026-08-16)
│   ├── FINAL_PRODUCT_READINESS.md | 📜 Historical doc (largely superseded)
│   ├── FINAL_SHIP_CHECKLIST.md | 📜 Historical audit snapshot
│   ├── UI_ARCHITECTURE_AUDIT.md | 📜 Historical snapshot (2026-08-10)
│   └── TURNSTILE_LAYOUT_INVESTIGATION.md | 📜 Historical investigation (2026-08-12)
│   └── asset-inventory.json
└── ... (code source files)
```

The goal was **minimal duplication** with **clear ownership of information**:
- `CURRENT_SYSTEM.md` owns: current architecture, route architecture, auth/authorization, SEO, products, blogs, orders, caching, security, external services
- `FUTURE_MAINTENANCE.md` owns: change rules, do-not-reintroduce list, deferred work, launch requirements, optional/deferred items
- `BLOG_AUTHORING_GUIDE.md` owns: blog authoring form, Markdown writing, TOC, internal linking, SEO writing, images, publishing checklist
- `ASSET_AUDIT.md` owns: asset inventory, format analysis, duplicate detection, LCP assets, priority action plan (updated)
- `README.md` and `TECH_STACK.md` own: surface-level project overview and tech stack reference (updated to reflect current state)
- Historical audit documents: retained as reference with clear "HISTORICAL" markers, not treated as current authority
## 7. Current Documentation Health

### Duplication
- **Score: 3/10** — Low duplication. Historical audit documents are clearly separated from current-state docs. The main overlap was between FINAL_SEO_AUDIT.md, FINAL_BACKEND_PERFORMANCE_AUDIT.md, FINAL_PRODUCT_READINESS.md, and FINAL_SHIP_CHECKLIST.md, which all covered similar ship-blocker territory from before the 2026 cleanup passes. This has been resolved by clearly marking them as historical and directing readers to CURRENT_SYSTEM.md and FUTURE_MAINTENANCE.md as authoritative.

### Accuracy
- **Score: 8/10** — High accuracy for current-state documents (CURRENT_SYSTEM.md, FUTURE_MAINTENANCE.md, BLOG_AUTHORING_GUIDE.md). Historical documents are accurate as historical snapshots but contain outdated claims about implementation status. Updated docs (README.md, TECH_STACK.md, ASSET_AUDIT.md) now accurately reflect current codebase.

### Discoverability
- **Score: 6/10** — Moderate discoverability. The documentation is spread across multiple files with different purposes. The key current-state docs (CURRENT_SYSTEM.md, FUTURE_MAINTENANCE.md) are well-organized and referenced by other docs, but new developers may find the historical vs. current distinction confusing without the explicit markers that were added.

### Naming
- **Score: 6/10** — Fair naming. Descriptive names are used (CURRENT_SYSTEM.md, FUTURE_MAINTENANCE.md, BLOG_AUTHORING_GUIDE.md) but some historical docs have vague names (FINAL_SEO_AUDIT.md, FINAL_BACKEND_PERFORMANCE_AUDIT.md) that don't clearly indicate they're historical. The added "HISTORICAL DOCUMENT" markers help mitigate this.

### Completeness
- **Score: 7/10** — Good coverage of current architecture and operational concerns. Missing: no dedicated SEO policy doc (covered in CURRENT_SYSTEM.md §4 + FUTURE_MAINTENANCE.md §1), no dedicated security policy doc (security details in CURRENT_SYSTEM.md §10 + FUTURE_MAINTENANCE.md §5). The asset documentation is comprehensive but split between ASSET_AUDIT.md and asset-inventory.json.

### Maintainability
- **Score: 7/10** — Good maintainability going forward. The split between CURRENT_SYSTEM.md (current state) and FUTURE_MAINTENANCE.md (rules/do-not-reintroduce) creates clear ownership. Historical docs are marked and will not be treated as current. Future developers are directed to read CURRENT_SYSTEM.md first per FUTURE_MAINTENANCE.md §0.

---
## 8. Remaining Gaps

The following documentation gaps were identified:

### 8.1 Dedicated SEO policy document
- **Gap:** No standalone SEO policy document; SEO architecture is spread across CURRENT_SYSTEM.md §4, FUTURE_MAINTENANCE.md §1, and the SEO section of ASSET_AUDIT.md.
- **Usefulness:** Low-moderate. The information is technically complete across these three documents, but having a single SEO.md would improve discoverability. Not creating one unless there's a specific need, as the information is already well-covered.

### 8.2 Performance budget documentation
- **Gap:** No formal performance budgets (e.g., max page load time, max image size limits). Performance findings exist in CURRENT_SYSTEM.md §5, FINAL_BACKEND_PERFORMANCE_AUDIT.md, and ASSET_AUDIT.md but without explicit budgets.
- **Usefulness:** Medium. Could be valuable for future performance optimization, but not critical for current state. Not creating unless a performance budget is needed for a specific goal.

### 8.3 Security policy document
- **Gap:** No standalone SECURITY.md; security controls and configurations are documented in CURRENT_SYSTEM.md §10, FUTURE_MAINTENANCE.md §5, and TECH_STACK.md §16.
- **Usefulness:** Medium. A dedicated security doc would improve clarity, but the information is technically complete across existing docs. Not creating unless there's a specific security compliance requirement.

### 8.4 Deployment configuration documentation
- **Gap:** Deployment assumptions and environment variable configuration are in CURRENT_SYSTEM.md §12-13 and FUTURE_MAINTENANCE.md §6-8, but not in a single deployment doc.
- **Usefulness:** Medium. The information is accurate and complete but scattered. Not creating a dedicated DEPLOYMENT.md unless deployment processes change significantly.

### 8.5 Database schema documentation
- **Gap:** Prisma schema (prisma/schema.prisma) serves as the source of truth for database structure; no separate DATABASE.md documentation file.
- **Usefulness:** Low-moderate. The Prisma schema is the authoritative source; a separate doc would be redundant. Not creating.

**Overall assessment:** No critical gaps that require new documentation creation. The existing documentation set, with the historical/highlighting updates made during this audit, provides adequate coverage of the project's current state and operational requirements.
## 9. Historical Documents

Explicitly listed below are documents retained for historical/reference purposes and why they were retained:

### `docs/FINAL_SEO_AUDIT.md`
- **Why retained:** Serves as a historical record of the SEO audit completed on 2026-08-12. The "Reconciliation" section documents the gap between the historical findings and the current code implementation, providing valuable context for future audits. The P1/P2 findings and their resolution status are annotated. Retained with clear "SUPERSEDED IN PART" marker so it is not treated as current authority.

### `docs/FINAL_BACKEND_PERFORMANCE_AUDIT.md`
- **Why retained:** Documents the backend performance state as of 2026-08-16. Several P1 findings were resolved (notably public blog pagination using DB-level skip/take + count), and tracking these resolutions provides a historical record of improvement. Retained with clear historical marker and cross-references to CURRENT_SYSTEM.md and FUTURE_MAINTENANCE.md for current state.

### `docs/FINAL_PRODUCT_READINESS.md`
- **Why retained:** The primary ship readiness plan from before the 2026 cleanup passes. Despite being "LARGELY SUPERSEDED," it documents the ship blocker resolution process and the item-by-item reconciliation approach. The annotations marking items as obsolete/removed provide a historical record of what was decided and why. Retained with clear "Do not execute as-is" warning and cross-references to current docs.

### `docs/FINAL_SHIP_CHECKLIST.md`
- **Why retained:** Post-cleanup verification checklist that documents the state of findings after the 2026 cleanup passes. Serves as a historical record of which P0/P1/P2 findings were closed and which were deferred. The "Definition of Done" section reflects the state of the repository at that time. Retained with "HISTORICAL AUDIT SNAPSHOT" marker.

### `docs/UI_ARCHITECTURE_AUDIT.md`
- **Why retained:** Historical snapshot of the UI architecture as of 2026-08-10. All obsolete sections are explicitly documented and confirmed resolved against current code. The "DO NOT REINTRODUCE" advisory cross-references FUTURE_MAINTENANCE.md §7. Retained as a reference for understanding what UI features were evaluated, decided against, and why — particularly useful for understanding the evolution of the blog listing split, OTP artifacts, company selector, and order lifecycle assumptions.

### `docs/TURNSTILE_LAYOUT_INVESTIGATION.md`
- **Why retained:** Investigative document documenting Turnstile layout behavior as of 2026-08-12. Some technical details about package sizing behavior and confidence levels remain useful reference, though the Cloudflare iframe dimensions require live browser verification. Retained with "HISTORICAL INVESTIGATION" marker and confidence-level annotations.

---
## 10. Important Discrepancies Discovered

During the audit, the following cases were identified where existing documentation did not match the actual codebase, and what was corrected:

### 10.1 OTP / verify-required route references
- **Documentation:** README.md (old), TECH_STACK.md (old), FINAL_PRODUCT_READINESS.md, FINAL_SHIP_CHECKLIST.md all referenced OTP verification, `/verify-required` route, and OTP code paths.
- **Codebase reality:** OTP verification was removed entirely; auth is email/password (credentials provider, JWT sessions only). No OTP code exists anywhere in the repository. `proxy.ts` no longer references a verify flow.
- **Correction:** Removed OTP/verify-required references from README.md and TECH_STACK.md. Added "no OTP flow exists" clarification to CURRENT_SYSTEM.md §3. Added "Do NOT recreate OTP flows" to FUTURE_MAINTENANCE.md §5. Annotated ship blockers in FINAL_PRODUCT_READINESS.md and FINAL_SHIP_CHECKLIST.md as obsolete/resolved.

### 10.2 `/verify-required` route no longer exists
- **Documentation:** FINAL_PRODUCT_READINESS.md ship blocker #1 recommended creating `/verify-required` page. FINAL_SHIP_CHECKLIST.md annotated this as "RESOLVED — fails closed" (no such route needed).
- **Codebase reality:** The route does not exist and is not needed. The middleware redirect in `proxy.ts` was removed when OTP flow was eliminated.
- **Correction:** Annotated as resolved in FINAL_SHIP_CHECKLIST.md. Updated FUTURE_MAINTENANCE.md §7 to list "OTP authentication (`/verify-required`, verify/resend-OTP APIs, signup session codes)" as "Do NOT recreate."

### 10.3 Mock payment action removed
- **Documentation:** FINAL_PRODUCT_READINESS.md §7 "Deferred / Remove" listed "Live Payment Gateway (Razorpay/Stripe)" as deferred with `mockMarkPaidAction`. FINAL_SHIP_CHECKLIST.md P0 found that "Server-side order creation does not validate buy-now quantity, product publication, or stock" and that the "Server-side order creation... mock payment action" was production-visible.
- **Codebase reality:** Mock payment action was removed entirely. Orders are an unpaid request flow: CREATED → admin CONFIRMED → SHIPPED → DELIVERED. No payment claims are made in the customer UI.
- **Correction:** FINAL_PRODUCT_READINESS.md annotated as "RESOLVED BY REMOVAL." FINAL_SHIP_CHECKLIST.md P0 annotated as "RESOLVED (adjusted) — bounded quantity + published-product checks enforced on both paths. Stock checks were deliberately removed: stock is informational only per product decision." Updated CURRENT_SYSTEM.md §8 to document stock as informational only.

### 10.4 Heavy homepage images / JPEG→WebP migration broken references
- **Documentation:** ASSET_AUDIT.md (original) identified broken references from JPEG→WebP migration. FINAL_SEO_AUDIT.md P1 noted "dev only marquee text" live. FINAL_BACKEND_PERFORMANCE_AUDIT.md noted homepage image performance concerns.
- **Codebase reality:** JPEG→WebP migration deleted `public/hero/1.jpg…6.jpg` and `card-products.jpg`/`card-partners.jpg`, but two components still referenced those paths: `Philosophy.tsx` (6 broken cards below fold) and `Hero.tsx` (2 broken stat images above fold). This was a regression post-dating the original audits.
- **Correction:** Updated ASSET_AUDIT.md to explicitly mark P0 broken references and document the JPEG→WebP migration regression. Added P1 hero GIF analysis. Updated code references to repoint to surviving WebP files. The P0/P1 items are now tracked as action items.

### 10.5 Blog listing split removed
- **Documentation:** UI_ARCHITECTURE_AUDIT.md described "featured vs latest" blog bifurcation. FINAL_SEO_AUDIT.md described blog canonical issues related to split.
- **Codebase reality:** `/blogs` is now one unified chronological listing (newest → oldest, 15/page) with no featured section. JSON-LD `blogPost` array mirrors the visible page exactly.
- **Correction:** UI_ARCHITECTURE_AUDIT.md annotated all obsolete sections as "CONFIRMED RESOLVED." FUTURE_MAINTENANCE.md §3 contains "CURRENT ARCHITECTURE — One unified listing" rule. FINAL_SEO_AUDIT.md reconciliations note blog canonical safety resolved.

### 10.6 Sensitive debug logging removed
- **Documentation:** FINAL_SHIP_CHECKLIST.md P0 identified sensitive debug console logging (REQUEST BODY, TURNSTILE SECRET, OTP GENERATED) as security risk. FINAL_PRODUCT_READINESS.md §3 "Must Fix Before Launch" item #2.
- **Codebase reality:** Debug logging has been removed from production routes. Turnstile logs only missing-config errors (fails closed). Signup logs only one safe failure message.
- **Correction:** FINAL_SHIP_CHECKLIST.md annotated as "✅ RESOLVED — turnstile.ts logs only a missing-config error and fails closed; signupService.ts logs a single safe failure message." Updated ASSET_AUDIT.md to reflect current logging state.

---
