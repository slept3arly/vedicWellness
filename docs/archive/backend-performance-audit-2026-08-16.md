# VedicWellness — Final Backend Performance Audit

> **STATUS: HISTORICAL AUDIT — Completed 2026-08-16.** This audit documented the backend state at that time. Current architecture and performance rules live in [CURRENT_SYSTEM.md](./CURRENT_SYSTEM.md) and [FUTURE_MAINTENANCE.md](./FUTURE_MAINTENANCE.md). This document serves as a historical reference; some P1 items were resolved (e.g., public blog pagination), but the remaining recommendations should be tracked separately or are addressed in the current system docs.

> **Notable resolutions since audit:**
> - ✅ Public blog pagination now uses DB-level skip/take + count (P1 resolved)
> - ⚠️ Many P1/P2 recommendations remain open or partially addressed — refer to CURRENT_SYSTEM.md and FUTURE_MAINTENANCE.md for current state.

---

- Public blog pagination is performed in memory after loading every published blog row.
- Public and admin page numbers are not capped, allowing arbitrarily deep `OFFSET` work and high-cardinality cache keys.
- Search strings have no maximum length or token count, while product and admin searches generate multiple `contains` predicates.
- The admin company page loads all companies and separately aggregates all product counts.
- Leads, audit logs, and users use frequent sorted/filtering patterns without matching composite indexes.
- User order history and some public content responses are unbounded by row count.

Existing positive controls include bounded product listing pages, paginated admin tables, narrow selects in most list queries, a 20-item product quantity rule, a 15-distinct-item cart limit, server-side upload byte limits, and tag-based caching for public content.

No code, schema, caching, or configuration changes were made as part of this audit.

## Database Performance

### P0

None identified.

### P1

| Area | Finding | Impact | Effort | Recommendation |
|---|---|---|---|---|
| Public blogs | ~~`getPublicBlogsDB()` loads every published blog, then `/blogs` slices the array in application memory for pagination.~~ | ~~Database rows and serialized server data grow linearly with blog count on every cache miss; memory and response preparation are unbounded.~~ | Medium | ✅ RESOLVED since audit — `getPublicBlogsDB()` now uses DB-level `skip`/`take` + `count` inside a `$transaction`, with a bounded page size (15). |
| Admin companies | `getAllCompanies()` loads every company and runs a grouped product-count query over the entire Product table. | The admin page has no pagination and repeats a potentially large aggregation whenever rendered. | Medium | Keep the page bounded or use a denormalized/maintained count only if the company list becomes material; at minimum select only fields rendered. |
| Lead sorting/filtering | Admin leads filter and sort by `createdAt` and optionally `status`, but `Lead` has no indexes. | Common admin list scans/sorts become increasingly expensive as leads accumulate. | Low | Add indexes matching actual access patterns, beginning with `createdAt` and evaluating `[status, createdAt]` for status-filtered lists. |
| Audit log sorting | Admin logs order by `createdAt`, but `AuditLog` has no `createdAt` index. | Log pages require increasingly expensive sorting and counting. | Low | Add an index on `createdAt`. |
| User admin list | Admin users filter `deletedAt: null` and order by `createdAt`, but there is no matching index. | User list scans/sorts grow with account count. | Low | Add `[deletedAt, createdAt]`. |
| User order history | `getUserOrders()` returns all orders for a user with all order items and has no pagination. | A prolific user can produce a large response and expensive serialization; history is currently unbounded. | Medium | Add a bounded history page or cursor while preserving the existing order detail route. |

### P2

| Area | Finding | Impact | Effort | Recommendation |
|---|---|---|---|---|
| Sitemap | The sitemap page loads all published blogs without a database limit. | Low-frequency page can become a large response as content grows. | Low | Bound or paginate sitemap content, or generate a dedicated sitemap route with explicit limits. |
| Product detail | Public detail uses `include` for the full company, variants, specifications, FAQs, and reviews. | A product with unusually large related collections produces a large query result and client payload. | Medium | Replace full relation includes with explicit fields and per-relation bounds if those collections grow materially. |
| Company lists | Public and product-form company lists are unbounded. Companies are expected to remain small, so impact is currently low. | Large future company counts would enlarge every product-list request and form payload. | Low | Add a small explicit select and a cap/pagination if company count becomes more than a modest lookup list. |
| Admin order list | The list intentionally includes up to two items per order, which is bounded, but still executes a total count for every page. | Count cost grows with order volume, especially for broad searches. | Low | Retain count while tables are small; consider approximate/deferred counts only after measurement. |

## API / Server Actions

### P0

None identified.

### P1

| Area | Finding | Impact | Effort | Recommendation |
|---|---|---|---|---|
| Public pagination | Product and blog pages accept any positive integer page. Admin pages similarly pass raw `page` values into `skip`. | Very deep offsets can force the database to walk and discard many rows; product cache keys also become unbounded. | Low | Clamp page to a sensible maximum or reject pages beyond the computed last page; enforce a hard limit in the data layer as well. |
| Search | Product search accepts an unbounded query and creates multiple case-insensitive `contains` predicates. Generic admin search also expands every token across configured fields. | Long input can produce large SQL predicates and likely sequential scans; arbitrary query/page combinations create many cache entries. | Low/Medium | Enforce a maximum query length and token count before query construction. Keep result page size bounded. |
| Public blog response | The public blog service returns the complete published list to the page before slicing. | Large response/data transfer between database, server, cache, and React props. | Medium | Make the service page-aware and return only the requested rows plus pagination metadata. |
| Product detail response | Product relation arrays have no application-level cardinality limit. | A single product can produce a large server-to-client payload if reviews/FAQs/specifications grow. | Low/Medium | Select only fields required by `SlugClient` and bound user-generated/repeatable relations. |

### P2

| Area | Finding | Impact | Effort | Recommendation |
|---|---|---|---|---|
| Cart operations | Add/update/remove generally perform a cart read, a write, and a fresh cart read. This is predictable (roughly 2–3 queries) and not an N+1 pattern. | Extra round trip per mutation, but cart size is capped at 15 items. | Low | Leave unchanged unless tracing shows cart mutations are a hot path; then return the write result or consolidate reads carefully. |
| Checkout cart load | Cart checkout loads full Product scalar records with `product: true`, although only availability, stock, name, and price are used. | More columns, including array descriptions/media, are read than necessary for checkout. | Low | Replace with an explicit select when checkout query volume justifies the small refactor. |
| Order item creation | Cart checkout creates order items one at a time inside a transaction. | Up to 15 insert operations per checkout instead of one bulk insert. | Low | Consider `createMany` inside the existing transaction, preserving the current transaction boundary and semantics. |
| Admin filter options | Blog author options use a distinct query over all matching blogs. | Small currently, but grows with content volume. | Low | Keep while the author set is small; cache or maintain options only after measurement. |

## Limits

### Current Limits

| Resource | Current Limit | Where Enforced | Recommendation |
|---|---:|---|---|
| Product page size | 10 | `lib/services/productService.ts` | Keep; add a hard maximum for page number and query length. |
| Admin page size | 15 | `lib/constants.ts`, admin pages | Keep; clamp page numbers in the data layer. Some service defaults are 20/25, but current admin pages pass 15. |
| Public blog page size | 15 nominally | `lib/constants.ts`, but all rows are fetched first | Make the database query use the 15-row page size. |
| Search length | No maximum | Product page and generic admin search | Add a modest maximum, e.g. 100 characters and a small token count, after confirming UI needs. |
| Cart distinct items | 15 | `lib/services/cartService.ts` | Keep. |
| Cart quantity per product | 20 | `lib/validators/cart.ts`, `lib/services/cartService.ts` | Keep. |
| Order quantity per product | 20 | Checkout schema and `lib/services/public/orderService.ts` | Preserve exactly. |
| Order items | No separate order-level limit; cart implies at most 15, buy-now is one | Cart service and checkout flow | Document/enforce the invariant at the order boundary if future order paths are added. |
| Upload size | Products 2 MB; blogs 4 MB; banners 6 MB; categories 2 MB | `app/api/r2/upload-url/route.ts` | Keep server limits. Product client guidance is lower/inconsistent; align messaging later if needed. |
| Upload URL generation | 20 per 60 seconds | `lib/security/limits.ts` and `secureMutation` | Keep. Multiple uploads are sequential client requests. |
| Lead submissions | 5 per 60 seconds | `lib/security/limits.ts` | Keep. Contact message is capped at 2,000 characters. |
| Order submissions | 10 per 60 seconds per user | `lib/security/limits.ts`, checkout action | Keep. Existing maximum of 3 active unpaid orders also applies to cart checkout. |
| Login attempts | 30 per IP and 8 per email per 600 seconds | `lib/security/limits.ts` and auth flow | Keep. |
| User order history | No row limit | `lib/services/public/orderService.ts` | Add pagination before high-volume users can accumulate large histories. |
| Blog list response | No row limit | `lib/db/blog.ts` and public blogs page | Highest priority response-size gap; paginate in SQL. |

### Recommended Changes

1. Make all list data layers clamp page size and page number; do not rely only on page components.
2. Add a maximum query length/token count before building `contains` search predicates.
3. Convert public blog pagination from in-memory slicing to database pagination.
4. Add indexes for lead/audit/user admin sorting and filtering.
5. Add bounded user order history.
6. Select only checkout product fields used by the order calculation.

## Caching

### Safe Opportunities

- Public product listings are read-heavy and already cached with product/global invalidation tags. Keep this approach, but cap page/query inputs first so cache cardinality is bounded.
- Public product details are suitable for tag-invalidated caching because product changes invalidate product tags. The current 24-hour page revalidation and explicit tags are appropriate for catalog data.
- Public banners, marquee items, slides, and blogs already use tagged caching. These are safe candidates because they are public and admin mutations revalidate their tags.
- Public/static informational pages already use ISR-style revalidation and are suitable for the current approach.

### Do Not Cache

- Carts and cart mutations.
- Orders, order creation, payment/order status, and order notifications.
- Account data, addresses, and user order history.
- Admin lists, admin detail pages, authorization-sensitive responses, and lead/customer data.

The main caching concern is not that public data is uncached; it is that uncapped page and search parameters can create unnecessary cache-key/cardinality growth.

## Indexes

### Existing

- `Product.slug` and `Product.sku` are unique.
- Product has indexes on `published`, `(published, tag)`, `(published, medicineForm)`, `(published, createdAt)`, and `(companyId, published)`.
- `Company.slug` is unique and `Company.active` is indexed.
- `Order` has `(userId, createdAt)`, `status`, and `(userId, status)`.
- `OrderItem.orderId` is indexed; `(cartId, productId)` is unique and both CartItem foreign-key columns are indexed.
- `Address` has `userId` and `(userId, isDefault)` indexes.
- `Blog` has `(published, publishedAt)` and `category` indexes.
- `AuditLog` has actor, entity, and action-oriented indexes, but not the admin list sort key.

### Recommended

These recommendations correspond to observed query patterns, not fields merely because they exist:

1. `Lead(createdAt)` for the default admin ordering.
2. `Lead(status, createdAt)` if status-filtered lead pages are common; validate with query plans before adding both.
3. `AuditLog(createdAt)` for admin log pagination.
4. `User(deletedAt, createdAt)` for the active-user admin list.

The existing product/company/order indexes cover the principal catalog and customer order access patterns. Product substring search is not solved by the current ordinary name index; first bound inputs and measure usage before considering database-specific search indexes.

## Implementation Order

1. Bound page numbers, search length, and token count at the shared data/query boundary.
2. Move public blog pagination and count into SQL; bound sitemap content separately.
3. Add and deploy the lead, audit, and user indexes after checking `EXPLAIN` plans.
4. Bound user order history.
5. Reduce checkout product selection and consider bulk order-item insertion.
6. Reassess public cache cardinality and product-detail payload sizes with production metrics.

## Definition of Done

- Every public/admin list has a database-enforced maximum page size and a bounded page input.
- Public blogs no longer load the full table to paginate in memory.
- Search inputs have bounded length/token count and remain paginated.
- User order history has an explicit response bound.
- Query plans confirm indexes for lead, audit-log, and active-user admin lists.
- Catalog caching remains tag-invalidated and has bounded key cardinality.
- Cart/order semantics remain unchanged, including maximum quantity 20 per product.
- No caching is introduced for user-specific or authorization-sensitive data.
