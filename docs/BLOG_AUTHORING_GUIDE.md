# Blog Authoring & SEO Guide

Internal guide for admins writing and publishing blog posts in the Vedic Wellness admin panel (`/admin/blogs`).

This document describes the **actual implementation** — the admin form is a plain form (title/slug/meta/Markdown textarea) and the public page renders that Markdown directly. There is no rich-text editor, no drag-and-drop blocks, and no in-content image manager. Write accordingly.

---

## 1. How publishing works (verified behavior)

| Admin field | Notes |
|---|---|
| **Blog Title** (required) | Becomes the visible H1 on the article page and the default meta title. |
| **Slug** (required) | URL-safe identifier used in `/blogs/<slug>`. The form enforces lowercase letters, numbers and hyphens only (`[a-z0-9-]`). Use short, descriptive slugs, e.g. `ayurvedic-hair-oil-guide`. |
| **Author** | Shown on cards and the article header. Falls back to "Vedic Wellness Team" if empty. |
| **Category** | Shown above the article title. Single free-text value (e.g. `Ayurveda`). |
| **Tags** (comma separated) | Power the automatic **Related Reading** section — see §4. |
| **Featured Image** | Uploaded to R2 (`blogs` folder). Used on listing cards, the article hero, Open Graph/Twitter previews and JSON-LD. |
| **Short Description** | Card summary text; also the fallback meta description. |
| **Main Content** | Plain textarea. Written in **Markdown**, rendered on the public page (see §2). |
| **Meta Title / Meta Description** | Optional overrides for search results. |
| **Canonical URL** | Optional override. Only accepted if it points at `https://vedic-wellness.vercel.app`; anything else is ignored and the standard `/blogs/<slug>` canonical is used. Leave empty unless you know you need it. |

Publishing: new posts are created as published; `publishedAt` is set once, when first published, and drives the newest-first ordering on `/blogs`.

---

## 2. Writing the article body (Markdown)

The Main Content field accepts standard Markdown. What is actually rendered:

| You write | You get |
|---|---|
| `## Heading` | H2 section heading (with anchor, appears in TOC) |
| `### Heading` | H3 sub-heading (not in TOC) |
| `- item` | Bulleted list |
| `![alt](url)` | Lazy-loaded image with your alt text |
| `**bold**`, `*italic*` | Bold / italic |
| `[text](/products)` | Link |
| `---` | **Nothing** — horizontal rules are intentionally not rendered. Don't use them as section separators. |

Everything else (tables, code blocks, blockquotes, H4+) has no custom styling — avoid relying on it.

### Structure template

```markdown
One or two opening paragraphs that answer what the reader will learn.

## What Is Ayurvedic Hair Oil?

...

## Benefits of Ayurvedic Hair Care

### Reduces Hair Fall

...

### Supports Scalp Health

...

## How to Choose the Right Product

...a natural internal link here, e.g.
Explore our full range in [Ayurvedic products](/products).

## Conclusion

Short takeaway + a soft next step, e.g.
[Contact our team](/contact) for product guidance.
```

---

## 3. "On This Page" navigation (how the TOC works)

The article sidebar ("On this page") is generated automatically from the article body:

- **Only `##` (H2) headings are included.** `###` and deeper are not listed.
- Each `##` heading becomes an entry, in the order it appears.
- The anchor ID is generated from the heading text: lowercased, punctuation removed, spaces replaced with hyphens.
  - `## Benefits of Ayurvedic Wellness` → `#benefits-of-ayurvedic-wellness`
  - Punctuation such as `?`, `,`, `:` is stripped before generating the ID.
- Clicking a TOC entry scrolls the page to that heading; direct `#anchor` URLs also work.

Rules for admins:

1. **Use `##` for every major section.** No H2 sections → empty TOC.
2. **Never repeat the exact same heading text twice in one article.** IDs are derived from text, so duplicates produce colliding anchors and the TOC jumps to the wrong place.
3. Keep headings short enough to read in a sidebar (roughly under 60 characters).
4. Phrase headings as descriptions of the section's actual content, not keyword strings.

---

## 4. Internal linking

Internal links are one of the strongest SEO signals we control. Link where it genuinely helps the reader.

### Pages worth linking to

- `/products` — the Ayurvedic product range
- `/products/companies` — company/brand directory
- `/about` — company, certifications, franchise background
- `/contact` — enquiries, franchise contact
- Other blog articles — `/blogs/<slug>` (see §5)

### Good vs bad linking

Good — descriptive, relevant, naturally placed:

> A consistent routine matters more than any single product. Explore our complete [Ayurvedic product range](/products) to build yours.

Bad:

> To learn more, [click here](/products).
> Our best-selling best Ayurvedic hair oil for hair fall and dandruff treatment is available now.

Guidelines:

- Anchor text should describe the destination ("our Ayurvedic product range", "PCD pharma franchise details").
- 1–4 internal links per article is plenty. Do not stuff links into every paragraph.
- Link because the target genuinely extends the topic — never for its own sake.
- Vary destinations across articles; don't point every post at the same page repeatedly.

### Blog-to-blog linking

- When an article expands on a topic covered elsewhere, link to it inline with descriptive text:
  > Before choosing an oil, understand the basics in [What Is Ayurveda?](/blogs/what-is-ayurveda).
- The **Related Reading** section at the bottom of every article is generated automatically from shared **tags**, so use accurate, consistent tags (e.g. `hair-care`, `wellness`) — misspelled or unique one-off tags produce empty related sections.
- Never create artificial "link networks" of posts that exist only to link to each other or to a sales page.

---

## 5. SEO writing basics

- Write for the reader first; search engines reward useful, original content.
- One article = one clear topic. Split unrelated subjects into separate posts.
- Headings should describe the section honestly. Do not force keywords into every heading.
- Avoid keyword stuffing, repeated intro formulas, and thin filler paragraphs.
- Keep paragraphs short (2–4 sentences); use lists for genuinely list-like content.
- Fill in **Meta Title** (~50–60 chars) and **Meta Description** (~120–160 chars) when the auto-generated ones would be weak.
- Write meaningful **alt text** for every image (see §6).
- Facts matter: check claims, quantities and product names before publishing.

---

## 6. Images

Current capabilities (do not assume more):

- **Featured Image:** uploaded through the admin form (stored in R2). Required in practice — cards, hero, social previews and structured data all use it.
- **Images inside the body:** inserted as Markdown — `![descriptive alt text](https://…r2.dev/blogs/…)`. Upload files via the featured-image uploader first (or reuse already-uploaded R2 URLs), then reference the URL in the body. There is **no** in-text upload button, caption or figure support, and image titles are not rendered — put all meaning in the alt text.
- Body images load lazily and preserve their natural size; supply width/height attributes when possible to prevent layout shift.

Alt text guidance:

- Good: `Bottle of Vedic Wellness Ayurvedic hair oil on a wooden table`
- Bad: `image`, `img123.png`, a wall of keywords
- Decorative separators should not be images at all.

---

## 7. Publishing checklist

- [ ] Clear, honest article title (matches the content)
- [ ] Clean slug: lowercase, hyphenated, no dates or filler words
- [ ] Strong introduction that states what the reader will learn
- [ ] Logical `##` sections (each becomes a TOC entry); no duplicate headings
- [ ] 1–4 relevant internal links (`/products`, `/about`, `/contact`, related posts)
- [ ] Accurate tags so Related Reading works
- [ ] Featured image uploaded; body images have real alt text
- [ ] Meta title/description filled in or reviewed
- [ ] No keyword stuffing; content proofread
- [ ] Previewed on mobile after publish
- [ ] Published URL opened and checked (`/blogs/<slug>`)

---

## 8. Example skeleton

```markdown
Ayurvedic hair care works best as a routine, not a rescue plan.
This guide explains why hair oil matters and how to choose one.

## Why Hair Oil Matters in Ayurveda

Two short paragraphs on tradition and mechanism.

## Key Benefits

### Scalp Nourishment

...

### Stress Relief

...

## How to Choose the Right Oil

Explain ingredient/quality signals, then link naturally:
Browse the full range in our [Ayurvedic products](/products).

## Frequently Asked Questions

Answer two or three common questions briefly.

## Final Thoughts

Takeaway + next step:
Have questions about franchise availability?
[Contact our team](/contact).
```

Tags example: `hair-care, ayurveda, wellness` — reuse existing tags across posts so Related Reading stays populated.
