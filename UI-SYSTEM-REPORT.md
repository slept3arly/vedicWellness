# PROJECT UI SYSTEM REPORT

This document describes the UI design system so another AI can generate new code that stays consistent with the codebase.

---

## 1. Styling Architecture

- **Primary:** **Tailwind CSS** with design tokens defined as **CSS custom properties** in `app/globals.css`. Tailwind is configured to consume those variables where applicable.
- **Utility merge:** Use **`cn()`** from `@/lib/cn` (clsx + tailwind-merge) for conditional and overridable class names. **Always use `cn(...)` when composing className in components.**
- **No CSS Modules or Styled Components.** Global styles live in `app/globals.css`; component-level styling is Tailwind-only.
- **Dark mode:** Implemented via a **`.dark` class** on `<html>` (see `components/public/layout/ThemeToggle.tsx`). Tailwind is set to `darkMode: 'selector'` in `tailwind.config.js`. Components support dark mode with `dark:` variants; semantic colors use CSS variables that switch in `.dark`.

**Convention:** Prefer **CSS variables** for brand/semantic colors (e.g. `bg-[var(--bg-surface)]`, `text-[var(--text-muted)]`) so they respect light/dark. Use Tailwind utilities for layout, spacing, and one-off values.

---

## 2. Color System

**Defined in:** `app/globals.css` (`:root` and `.dark`).

| Token | Light | Dark | Usage |
|-------|--------|------|--------|
| `--brand-primary` | `#026536` | (same) | Primary green; CTAs, links, focus rings |
| `--brand-accent` | `#589d32` | (same) | Accent green; route loader, highlights |
| `--bg-main` | `#ffffff` | `#0a0d0b` | Page background |
| `--bg-surface` | `#f6f8f6` | `#121614` | Cards, inputs, elevated surfaces |
| `--text-main` | `#121212` | `#eef2ef` | Body text |
| `--text-muted` | `#5f6b63` | `#9aa5a0` | Secondary text |
| `--border-soft` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` | Borders |
| `--shadow-soft` | defined in globals | defined in globals | Default card/surface shadow |
| `--shadow-hover` | defined in globals | defined in globals | Hover elevation |

**Tailwind mapping** (`tailwind.config.js`):  
`brand.primary`, `brand.accent`, `surface`, `main`, `muted` map to the same variables. Short aliases `v` (accent) and `w` (primary) exist but are rarely used.

**How to reference colors:**
- Prefer **CSS variables**: `bg-[var(--bg-surface)]`, `text-[var(--text-muted)]`, `border-[var(--border-soft)]`.
- Or Tailwind: `bg-surface`, `text-muted`, `bg-brand-primary`, `bg-brand-accent`.
- For **hardcoded brand green** in components (e.g. Button variants), the codebase uses `#039751` (primary), `#027d44` (hover), `#84eb4b` (dark primary), `#0a1a07` (dark text on primary). Use these only when the component needs fixed light/dark behavior without variables.
- **Focus rings:** `focus-visible:ring-[#84eb4b]/60` or `focus:ring-[var(--brand-primary)]` (or `/25` for soft ring).

**Dark/light:** Toggled by adding/removing the `dark` class on `document.documentElement` (see `ThemeToggle.tsx`). All semantic colors should work in both modes via the variables above.

---

## 3. Typography System

**Font loading:** `app/fonts.ts` — Next.js `next/font/google` with `variable` for CSS vars.

| Role | Font | CSS Variable | Weights |
|------|------|--------------|---------|
| Display | Playfair Display | `--font-display` | 400, 700 |
| Heading | Montserrat | `--font-heading` | 500, 600, 700 |
| Body | Lato | `--font-body` | 400, 700 |
| Accent | Cormorant Garamond | `--font-accent` | 400, 500, 600 |

**Applied in root layout:** `app/layout.tsx` — font variables are added to `<html>`; `<body>` has `className="font-body ..."`. So **body copy is Lato by default.**

**Tailwind** (`tailwind.config.js`):  
`font-display`, `font-heading`, `font-body`, `font-accent` map to the variables above.

**Base styles** (`globals.css`):  
- `p`: `@apply font-body leading-relaxed`  
- `h3`: `@apply font-heading text-xl font-semibold`

**Usage in components:**
- **Page titles / hero:** `font-display` + large size (e.g. `text-4xl sm:text-5xl lg:text-6xl`) + `tracking-tight` (see `PageHeader.tsx`).
- **Section titles:** `font-heading` + `text-2xl md:text-3xl` + `font-semibold` (see `SectionHeading.tsx`).
- **Body:** `font-body` + `leading-relaxed` (or leave default from body).
- **Eyebrows / decorative:** `font-accent` + `text-sm italic` (see `SectionHeading`).
- **Muted text:** Use `text-[var(--text-muted)]` or the `.text-muted` class from globals.

---

## 4. Spacing & Layout

- **Spacing scale:** Default Tailwind scale (4px base: `1` = 4px, `2` = 8px, `3` = 12px, `4` = 16px, `5` = 20px, `6` = 24px, etc.). No custom spacing in theme.
- **Container:** **`max-w-7xl mx-auto`** is the standard content width. Sections use **`px-4`** on small screens and **`md:px-6`** or **`px-6`** on larger (see `Section.tsx`, `Philosophy.tsx`, `Footer.tsx`, `CTABanner.tsx`).
- **Section vertical rhythm:** Common pattern `py-14 md:py-20` or `py-16 md:py-20`; inner spacing `space-y-6 md:space-y-10` (see root layout `main`).
- **Card padding:** Cards use **`p-6`** by default (`Card.tsx`). Override with `className` (e.g. `!p-0`, `px-4 py-3`) when needed.
- **Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, `gap-3` / `gap-4` / `gap-6` are typical. No custom grid in Tailwind config.
- **Main content offset:** `main` has `pt-[7.5rem] pb-28 md:pb-0` to clear fixed header and bottom nav.

**Helpers:**
- **Section wrapper:** `Section` in `components/public/ui/Section.tsx` — `max-w-7xl mx-auto px-6 py-8 md:py-12`. Use for consistent section layout, or replicate the same classes on `<section>`.

---

## 5. Animation & Motion

- **Library:** **Framer Motion** (`framer-motion`). Used for entrance animations, hover, and layout transitions.
- **Shared variants/transitions:** **`app/animations.ts`**. New components should import from here instead of defining ad hoc values.

**Entrance:**
- `fadeIn`, `fadeUpSoft`, `scaleIn`, `reveal`, `fadeUp` — opacity/y/scale reveal.
- `staggerFast` (0.08s stagger), `staggerSlow` (0.14s) — parent variants for staggered children.
- Typical usage: `variants={staggerFast}` on container, `variants={fadeUp}` or `variants={reveal}` on children; `initial="hidden"` `whileInView="show"` with `viewport={{ once: true }}`.

**Interaction:**
- `cardInteraction`: `y: -6` on hover with `fastSpring`.
- `zLiftIcon`, `cardIconGlow`, `pressHold` — icon/card hover states.
- **Springs:** `softSpring`, `fastSpring`, `zLiftSpring` — use for consistent motion (e.g. Button uses `stiffness: 500, damping: 30` for tap; Card uses `stiffness: 240, damping: 22` for hover).

**CSS animations** (`globals.css`):
- **Marquee:** `@keyframes marquee` + `.marquee-track`, `.marquee-mask`.
- **Loader:** `.ribbon-loader`, `spin`, `pulse`.
- **Float:** `@keyframes float`, `.animate-float` (6s ease-in-out).
- **Route loader:** `@keyframes route-loader`, `.animate-route-loader` (1s ease-in-out).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables marquee and ribbon spinner.

**Tailwind keyframes:** `marquee` and `float` are also in `tailwind.config.js` for use as `animate-marquee`, `animate-float`.

**Rule:** Use `app/animations.ts` for Framer Motion; use existing CSS classes or Tailwind `animate-*` for simple CSS animations. Respect reduced motion where applicable.

---

## 6. UI Primitives

All live under **`components/public/ui/`**. Import from `@/components/public/ui/<Name>`.

| Component | Path | Purpose |
|-----------|------|--------|
| **Button** | `Button.tsx` | Primary actions. Variants: `primary` (default), `secondary`, `ghost`. Props: `isLoading`, `autoLoading` (form pending), `iconOnly`, plus standard button props. Uses Framer Motion for `whileTap` and shows a spinner when loading. Use `cn()` for `className` override. |
| **Input** | `Input.tsx` | Text input with surface styling, 14px radius, focus ring from brand. Use for forms; extend with standard input props. |
| **Card** | `Card.tsx` | Elevated surface: `--bg-surface`, `--border-soft`, `rounded-[var(--radius)]`, hover shadow and subtle glow. Uses `motion.div` with hover lift on desktop. Default `p-6`; override with `className`. |
| **Badge** | `Badge.tsx` | Small pill. `tone`: `"brand"` \| `"neutral"`. Brand uses primary tint; neutral uses surface/muted. |
| **Chip** | `Chip.tsx` | Pill-style tag with surface bg and border. Use for filters/tags. |
| **CardIcon** | `CardIcon.tsx` | Wraps an icon with hover glow (Framer Motion `cardIconGlow` from `@/app/animations`). Use inside cards for icon treatment. |
| **PageHeader** | `PageHeader.tsx` | Hero-style block: optional badge, large `font-display` title, optional subtitle. Uses `staggerFast` + `reveal`. Props: `badge`, `title`, `subtitle`, `align`, `className`. |
| **SectionHeading** | `SectionHeading.tsx` | Section title block: optional eyebrow (`font-accent`), `font-heading` title, optional subtitle. Props: `eyebrow`, `title`, `subtitle`, `align`, `className`. |
| **Section** | `Section.tsx` | Wrapper: `max-w-7xl mx-auto px-6 py-8 md:py-12`. Use for full-width sections with consistent padding. |
| **MediaSlider** | `MediaSlider.tsx` | Image carousel with arrows, dots, touch/keyboard, auto-play. Props: `slides` (id, imageDesktopUrl, imageMobileUrl), `interval`. |
| **FloatingIcon** | `FloatingIcon.tsx` | Decorative animated icon (Pill, Layers, Users, Truck). Niche; use only where this pattern exists. |

**Admin-only:**  
- **AdminCard** in `components/admin/AdminCard.tsx` — neutral borders and bg (white/dark: neutral-900), `rounded-2xl`, `p-6`. Use only in admin UI.

**Modals / overlay:**  
- No shared Modal component. Modals are built with `createPortal(..., document.body)`, fixed inset overlay, `z-[9999]`, backdrop (e.g. `bg-black/60 backdrop-blur-lg`), and content often wrapped in **Card** (e.g. `OtpVerificationModal.tsx`).

**How new components should use primitives:**  
- Use **Button** for all CTAs; **Input** for text fields; **Card** for content blocks and modal content; **Badge**/ **Chip** for labels/tags; **PageHeader** / **SectionHeading** for headings; **Section** for section layout. Compose with `cn()` and pass `className` for overrides.

---

## 7. Design Tokens (Summary)

**Colors:** See §2. All in `app/globals.css` as `--brand-*`, `--bg-*`, `--text-*`, `--border-soft`, `--shadow-soft`, `--shadow-hover`.

**Radius:**  
- **`--radius`** = `14px` (used for cards, inputs, surfaces).  
- Tailwind: `rounded-brand` = `var(--radius)`.  
- Components often use `rounded-[14px]` or `rounded-[var(--radius)]`; some use `rounded-md`, `rounded-full` for buttons/pills.

**Shadows:**  
- `--shadow-soft`, `--shadow-hover` in globals.  
- Card hover in `Card.tsx`: custom `shadow-[0_20px_50px_...]` for brand tint.  
- Prefer `shadow-[var(--shadow-soft)]` / `var(--shadow-hover)` when possible.

**Durations / easing:**  
- No global duration tokens in CSS. Framer Motion uses `app/animations.ts` (e.g. 0.08s / 0.14s stagger, spring configs).  
- Tailwind: `duration-150`, `duration-300`, `duration-700` are common; `transition-colors duration-150` on buttons.

**Z-index:**  
- No single token file. Conventions observed: **`z-40`** (navbar/header), **`z-50`** (modals, bottom nav, overlays), **`z-[9999]`** (full-screen overlays: route loader, OTP modal), **`-z-50`** (background). Use these layers for consistency.

**Breakpoints:**  
- Default Tailwind: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px. No overrides in `tailwind.config.js`. Use `md:` and `lg:` for layout and visibility (e.g. desktop-only hover).

---

## 8. Folder Structure (UI-Relevant)

```
app/
  globals.css           # Design tokens, base styles, surfaces, keyframes, utilities
  fonts.ts              # Font definitions (Next.js font loader)
  layout.tsx            # Root layout: fonts on <html>, font-body on <body>, main structure
  animations.ts         # Framer Motion variants and transitions (entrance, hover, springs)
  Providers.tsx         # App-wide providers

components/
  public/
    ui/                 # Reusable UI primitives (Button, Input, Card, Badge, Chip, etc.)
    layout/             # Navbar, Footer, BottomNavbar, MarqueeBanner, ThemeToggle, GlobalBackground
    home/               # Home page sections (Philosophy, Categories, CTABanner, etc.)
    product/            # Product-specific (ProductHero, ProductFAQ, MediaSlider usage, etc.)
    feedback/           # RouteLoader, RibbonLoader, OtpVerificationModal
  admin/                # Admin-only components (AdminCard, AdminBadge, form fields)
  customer/             # Customer account/orders/cart components

lib/
  cn.ts                 # cn() for merging Tailwind classes
```

**Where to add new UI:**  
- **Global tokens / base styles:** `app/globals.css`.  
- **New primitives:** `components/public/ui/`.  
- **Page/section-specific:** Under the relevant area (`public/home`, `public/product`, etc.) or `components/public/` for shared public pieces.  
- **Motion:** Add shared variants/transitions in `app/animations.ts` and import in components.

---

## 9. Rules for Generating New UI

1. **Use `cn()` from `@/lib/cn`** for every `className` that combines base + props/conditional classes.
2. **Colors:** Prefer **CSS variables** for semantic colors: `bg-[var(--bg-surface)]`, `text-[var(--text-muted)]`, `border-[var(--border-soft)]`, `focus:ring-[var(--brand-primary)]`. Support dark mode via these variables (no extra work if you use them).
3. **Typography:** Use **`font-body`** for body, **`font-heading`** for section titles, **`font-display`** for hero/large titles, **`font-accent`** for eyebrows/decorative. Keep sizes and weights consistent with `PageHeader` and `SectionHeading`.
4. **Layout:** Use **`max-w-7xl mx-auto px-4 md:px-6`** (or `Section`) for content width; use **`py-14 md:py-20`**-style vertical rhythm for sections.
5. **Components:** Import and use **Button**, **Input**, **Card**, **Badge**, **SectionHeading**, **PageHeader**, **Section** from `@/components/public/ui/*` instead of reimplementing. Extend with `className` where needed.
6. **Motion:** Import variants/transitions from **`@/app/animations`** (e.g. `fadeUp`, `staggerFast`, `reveal`, `softSpring`). Use `initial` / `whileInView` / `viewport={{ once: true }}` for scroll-triggered entrance; use shared springs for hover/tap.
7. **Radius:** Use **`rounded-[var(--radius)]`** or **`rounded-[14px]`** for cards and inputs; **`rounded-full`** for pills/badges; **`rounded-md`** for buttons.
8. **Focus:** Always style focus for interactive elements: e.g. `focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]` or the Button-style focus ring.
9. **Z-index:** Use **`z-40`** for sticky header, **`z-50`** for floating UI (e.g. bottom nav), **`z-[9999]`** for full-screen overlays (modals, loaders). Background: **`-z-50`**.
10. **Accessibility:** Use semantic HTML, `aria-*` where needed (e.g. modals, carousels), and keep **reduced-motion** in mind (existing CSS already disables some animations in `prefers-reduced-motion`).
11. **Toasts:** The app uses **Sonner** with custom `toastOptions` in root layout (border, surface bg, shadow from design tokens). Keep toasts consistent with that styling.
12. **Admin UI:** Use **AdminCard** and neutral palette (`neutral-200` / `neutral-800`, etc.) in `components/admin/`; do not mix public brand tokens into admin-only screens unless intentional.

---

*End of UI System Report. Use this document when generating new UI so it matches the existing design system.*
