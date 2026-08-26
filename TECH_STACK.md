# Vedic Wellness - Technical Stack & Architectural Reference

Welcome to the **Vedic Wellness** technical stack reference document. This file serves as an implementation guide and reference for developers working on the codebase.

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [UI Patterns](#4-ui-patterns)
5. [Styling Patterns](#5-styling-patterns)
6. [State Management](#6-state-management)
7. [Data Fetching](#7-data-fetching)
8. [Authentication](#8-authentication)
9. [Database](#9-database)
10. [Validation](#10-validation)
11. [Forms](#11-forms)
12. [API Conventions](#12-api-conventions)
13. [Error Handling](#13-error-handling)
14. [Performance Patterns](#14-performance-patterns)
15. [Environment Variables](#15-environment-variables)
16. [Third-Party Integrations](#16-third-party-integrations)
17. [Coding Conventions](#17-coding-conventions)
18. [Reusable Patterns](#18-reusable-patterns)
19. [Developer Guidelines](#19-developer-guidelines)

---

## 1. Project Overview

**Vedic Wellness** (a division of Innovia Drugs) is a full-stack e-commerce and Content Management System (CMS) built with Next.js (App Router). It is designed to handle real-world product workflows, authentication, order workflows, and admin operations within a clean, layered monolithic architecture. 

A primary architectural rule of the codebase is:
> **No direct database access from UI components.** All interactions must route through the Service Layer.

---

## 2. Tech Stack

### Next.js
* **Purpose**: Application framework.
* **Used for**: App Router, React Server Components (RSC), Route Handlers, Metadata API, caching, and Server Actions.
* **Evidence**:
  * [app/layout.tsx](file:///c:/Development/vedicWellness/app/layout.tsx) (Root layout with server-side fetch)
  * [app/api/contact/route.ts](file:///c:/Development/vedicWellness/app/api/contact/route.ts) (Route Handler)
  * [app/(admin)/admin/blogs/serverActions.ts](file:///c:/Development/vedicWellness/app/%28admin%29/admin/blogs/serverActions.ts) (Server Actions)

### React
* **Purpose**: Frontend UI library.
* **Used for**: Client Components (`"use client"`), hooks, context-based state management, and Server Actions integration (`useFormStatus`).
* **Evidence**:
  * [components/ui/Button.tsx](file:///c:/Development/vedicWellness/components/ui/Button.tsx) (Interactive client-side button using React Hooks)
  * [app/Providers.tsx](file:///c:/Development/vedicWellness/app/Providers.tsx) (Context Providers wrapper)

### TypeScript
* **Purpose**: Static type safety.
* **Used for**: Type checking, compile-time validation, and path aliasing.
* **Configuration**:
  * Strict mode is **enabled** (`"strict": true`).
  * Important Aliases: `@/*` maps to `./*` for absolute imports from the root.
  * Compiler options: Target is `ES2017`, module is `esnext`, module resolution is `bundler`, and JSX is set to `react-jsx`.
* **Evidence**:
  * [tsconfig.json](file:///c:/Development/vedicWellness/tsconfig.json)

### Tailwind CSS
* **Purpose**: Utility-first CSS styling.
* **Used for**: Responsive UI layout, theme utility styling, dark mode configuration, and custom keyframes.
* **Configuration**:
  * Mode: Dark mode is configured using the `'selector'` strategy (`.dark`).
  * Theme extend mappings map colors directly to CSS Design Tokens.
* **Evidence**:
  * [tailwind.config.js](file:///c:/Development/vedicWellness/tailwind.config.js)
  * [app/globals.css](file:///c:/Development/vedicWellness/app/globals.css)

### Prisma
* **Purpose**: Object-Relational Mapping (ORM).
* **Used for**: Database schema declarations, migrations, and executing type-safe queries.
* **Evidence**:
  * [prisma/schema.prisma](file:///c:/Development/vedicWellness/prisma/schema.prisma)
  * [lib/db/prisma.ts](file:///c:/Development/vedicWellness/lib/db/prisma.ts) (Instantiates Prisma Client, extended with `@prisma/extension-accelerate`)

### NextAuth (Auth.js v5 Beta)
* **Purpose**: User Authentication and Authorization.
* **Used for**: Session handling, Credentials provider validation (email/password), and Route Guard checks.
* **Evidence**:
  * [auth.ts](file:///c:/Development/vedicWellness/auth.ts) (Credentials provider, JWT callback database synchronization)
  * [auth-edge.ts](file:///c:/Development/vedicWellness/auth-edge.ts) (Edge-compatible NextAuth configurations)
  * [proxy.ts](file:///c:/Development/vedicWellness/proxy.ts) (Edge Middleware routing and gating)

### Upstash Redis & `@upstash/ratelimit`
* **Purpose**: Key-value data store and Rate Limiter.
* **Used for**: Sliding window rate limits (signup, contact, newsletter, order creation, admin actions). Fails closed: the app refuses to boot without Redis credentials.
* **Evidence**:
  * [lib/redis.ts](file:///c:/Development/vedicWellness/lib/redis.ts) (Client instantiation)
  * [lib/security/rateLimit.ts](file:///c:/Development/vedicWellness/lib/security/rateLimit.ts) (Rate limit sliding window wrapper)

### Resend & React Email
* **Purpose**: Transactional email sending.
* **Used for**: Admin notifications (e.g. new lead / new order alerts).
* **Evidence**:
  * [lib/email/transactional/client.ts](file:///c:/Development/vedicWellness/lib/email/transactional/client.ts) (Resend client)
  * [lib/email/transactional/send.ts](file:///c:/Development/vedicWellness/lib/email/transactional/send.ts) (Transactional send handler)

### Brevo
* **Purpose**: Email Marketing and Newsletter management.
* **Used for**: Capturing newsletter subscribers and marketing contacts.
* **Evidence**:
  * [lib/email/marketing/client.ts](file:///c:/Development/vedicWellness/lib/email/marketing/client.ts) (BrevoClient configuration)

### Cloudflare R2 (via `@aws-sdk/client-s3`)
* **Purpose**: Object Storage.
* **Used for**: Hosting public image assets (blogs, products) uploaded via the Admin CMS.
* **Evidence**:
  * [lib/storage/r2/client.ts](file:///c:/Development/vedicWellness/lib/storage/r2/client.ts) (S3-compatible R2 Client configuration)

### Sentry
* **Purpose**: Performance and error monitoring.
* **Evidence**:
  * [sentry.client.config.ts](file:///c:/Development/vedicWellness/sentry.client.config.ts)

---

## 3. Architecture

Vedic Wellness follows a **layered monolithic design** with clear separation of concerns:

```
UI (Server Components & Pages)
  ↓
Server Actions / API Handlers (Request parsing, security checks)
  ↓
Service Layer (Business Logic - e.g. calculations, validation, external client calling)
  ↓
Data Access Layer (Database DAL - e.g., prisma queries, custom filters)
```

### Folder Structure
* **`app/`**: Next.js routing endpoints divided into Route Groups:
  * `(public)/`: Guest-facing pages (Home, Blogs, Category pages).
  * `(auth)/`: Authentication screens (Login, Signup — email/password, no OTP flow).
  * `(customer)/`: Authenticated customer pages (Cart, Checkout, Orders).
  * `(admin)/`: Authorized administrator portal (Dashboard, Banners, Blogs, Leads, Products, Slides, Users).
  * `api/`: Route Handlers for API endpoints.
* **`components/`**: Reusable React components:
  * `ui/`: Design-system elements (Button, Card, SectionHeading).
  * `public/`, `admin/`, `customer/`: Feature-scoped layouts and modules.
* **`lib/`**: Business logic, storage, validators, utilities:
  * `auth/`: Authentication helper overrides and state validations.
  * `db/`: Data Access Layer (DAL) files grouping domain queries.
  * `email/`: Templating and providers config.
  * `security/`: CSRF, rate limit, turnstile, and sanitize middleware.
  * `services/`: Core Business services.
  * `validators/`: Zod parsing schemes.

### Boundaries and Routing
* **Server/Client Boundaries**: UI layouts and major pages are server-rendered. High interactivity (e.g. upload components, mobile menu handlers, sliders) is isolated in client components (`"use client"`).
* **Data Fetching Patterns**: RSC fetch data directly via DAL services, leveraging Next.js caching. Mutations are processed via Server Actions, which check permission boundaries using security wrappers.

---

## 4. UI Patterns

### Shared Primitives
Shared UI primitives reside in [components/ui](file:///c:/Development/vedicWellness/components/ui):
* `Button.tsx`: Utilizes `framer-motion` for spring-based tap feedback, and interacts with `useFormStatus` to handle loading states automatically.
* `Card.tsx`, `Chip.tsx`: Standard semantic content blocks.
* `MediaSlider.tsx`: An interactive image slider component.

### Design System and Animations
* **Layouts**: Main elements are structured using standard CSS grid and flex. Global backgrounds and route progress bars wrap the application layout.
* **Modals & Dialogs**: Promotional modals are driven by database configurations.
* **Toasts**: Handled globally via **Sonner**. Toast animations are configured to preserve Sonner's timing while utilizing custom styling tokens from CSS classes.
* **Animations**: Powered by `framer-motion` for micro-interactions (e.g., tap scale) and custom CSS keyframes (`marquee`, `float`) for background banners.

---

## 5. Styling Patterns

* **CSS Variables (Design Tokens)**: Configured in [app/globals.css](file:///c:/Development/vedicWellness/app/globals.css). Hex color variables map to parameters:
  * `--brand-primary`: `#026536` (deep green)
  * `--brand-accent`: `#589d32` (lime green)
  * `--bg-main`: Page background (re-evaluated in `.dark`)
  * `--border-soft`, `--shadow-soft`: Component outlines and shadows.
* **Tailwind Theme Extents**: Maps tailwind utility aliases directly to variables:
  * `brand-primary` / `brand-accent` / `v` / `w` / `surface` / `main` / `muted`.
  * `rounded-brand` matches `--radius`.
* **Dark Mode**: Relies on Next-Themes injecting `.dark` selector classes. Light/dark variants are mapped directly via tailwind utilities or CSS variable swaps.
* **Class Merger Helper**: A custom helper in [lib/cn.ts](file:///c:/Development/vedicWellness/lib/cn.ts) combines class names cleanly:
  ```typescript
  import { clsx, type ClassValue } from "clsx";
  import { twMerge } from "tailwind-merge";
  
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```

---

## 6. State Management

This application chooses a lean, serverless-optimized state footprint:
* **Local State**: Managed via React's `useState` for visual controls (toggles, sliders).
* **Context**: Custom menus and modal triggers leverage React contexts (e.g. `MenuProvider` in [components/MenuContext.tsx](file:///c:/Development/vedicWellness/components/MenuContext.tsx)).
* **Server State**: Next.js App Router caching mechanisms and tags replace the need for TanStack Query.
* **Zustand / Redux**: **Not used** in this codebase.
* **Authentication State**: Distributed via `SessionProvider` (NextAuth).
* **Session Cache**: Stored in Upstash Redis during registration flows (e.g., [lib/auth/signupSession.ts](file:///c:/Development/vedicWellness/lib/auth/signupSession.ts)).

---

## 7. Data Fetching

* **Read Operations (Server Components)**: Performed by calling DAL service handlers directly in React Server Components.
* **Write Operations (Mutations)**: Handled using Next.js Server Actions (e.g. `createBlog`, `updateBlog`) or route handlers.
* **Caching & Revalidation**: Employs tag-based invalidation via `revalidateTag(TAG)` and path invalidation via `revalidatePath(path)`.
* **GraphQL / tRPC**: **Not used** in this codebase.

---

## 8. Authentication

### Auth.js Configuration
Defined in [auth.ts](file:///c:/Development/vedicWellness/auth.ts) and [auth-edge.ts](file:///c:/Development/vedicWellness/auth-edge.ts):
* **Provider**: Credentials provider validating email and hashed password using `bcryptjs`.
* **Flow**:
  1. Login triggers rate-limiting checks (by email and IP address).
  2. Users are validated in the DB (checking `deletedAt` and verification status).
  3. If successful, JWT holds role permissions and user credentials.
  4. Stale tokens trigger a JWT database check if they are older than 15 minutes.
* **Middleware Guard**: Route-based gating is handled in [proxy.ts](file:///c:/Development/vedicWellness/proxy.ts):
  * `/admin/:path*` is restricted to users with the `ADMIN` role.
  * `/sales/:path*` allows both `ADMIN` and `SALES` roles.
  * `/products/:slug*` requires a verified logged-in user session.

---

## 9. Database

* **ORM**: Prisma Client extended with `@prisma/extension-accelerate`.
* **Schema location**: [prisma/schema.prisma](file:///c:/Development/vedicWellness/prisma/schema.prisma)
* **Relations**: Includes relational data models for `User` to `Address`, `Order`, `Cart`, and `Lead`. E-commerce components model `Product` references mapping to `Variants`, `Specifications`, `FAQ`, and `Reviews`.
* **Split Repositories (DAL)**: Database calls are separated into dedicated query-builder files under `lib/db/`:
  * [lib/db/lead.ts](file:///c:/Development/vedicWellness/lib/db/lead.ts)
  * [lib/db/product.ts](file:///c:/Development/vedicWellness/lib/db/product.ts)
  * [lib/db/blog.ts](file:///c:/Development/vedicWellness/lib/db/blog.ts)

---

## 10. Validation

All validation occurs through **Zod schemas** situated in `lib/validators/`:
* Schemas exist for core forms: Address, Auth, Banner, Blog, Cart, Contact, Lead, Marquee, Product, and User.
* Schemas are validated on both the client (for UX feedback) and on the server (for security).
* Validation parsing handles data type conversion (e.g. parsing checkbox values into boolean fields, parsing tags from strings into arrays).

---

## 11. Forms

* **Standard Submission Flow**: Bypasses heavy forms libraries in favor of native HTML form submits wrapper validations.
* **Validation Flow**:
  1. Form input values compile into `FormData`.
  2. Server action interceptors trigger Zod parsing helpers (e.g. `parseBlogForm` in `lib/validators/blog.ts`).
  3. Form parsing handles type normalization (e.g. `published: formData.get("published") === "on"`).
  4. If parsing fails, standard Zod errors throw or trigger validation messages.

---

## 12. API Conventions

* **Endpoint Organization**: Located in `app/api/`. Route handlers process requests using standard HTTP verbs (POST, GET, etc.).
* **Request Validation & Security**: Route handlers are protected by `secureMutation` wrappers:
  * **CSRF check**: Asserts Origin/Referer matching.
  * **Rate Limits**: IP-based rate limiting via Upstash.
* **Response Format**: Returns standard JSON status messages (e.g., `{ ok: true }` or `{ ok: false, error: msg }`).

---

## 13. Error Handling

* **Global Error Gating**:
  * [app/error.tsx](file:///c:/Development/vedicWellness/app/error.tsx) (Boundary for application crashes)
  * [app/global-error.tsx](file:///c:/Development/vedicWellness/app/global-error.tsx) (Fallback boundary at the root level)
* **Try/Catch Patterns**: Wrapped inside Route Handlers and Server Actions, returning error structures to the frontend client.
* **Logging & Monitoring**: Monitored in production using Sentry (`@sentry/nextjs`).

---

## 14. Performance Patterns

* **ISR / Caching**: Dynamic routes for products/blogs utilize tag-based cache revalidation.
* **Image Optimization**: Custom S3 image optimization is configured in `next.config.ts` using remote patterns, restricting qualities (50, 60, 75).
* **Hydration Warnings**: Managed on root HTML tags via `suppressHydrationWarning` (important for Next-Themes stylesheet initialization).
* **Bundle Analysis**: `@next/bundle-analyzer` is wrapped inside `next.config.ts` to inspect compiled chunks (`npm run analyze`).

---

## 15. Environment Variables

Configured and validated in [lib/env.ts](file:///c:/Development/vedicWellness/lib/env.ts):

| Variable Name | Scope | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | Global | Runtime environment mode |
| `DATABASE_URL` | Prisma / DB | Main direct connection to the PostgreSQL database |
| `PRISMA_DATABASE_URL` | Prisma / DB | Primary serverless connection pool (Prisma Accelerate) |
| `NEXTAUTH_SECRET` | NextAuth | Cryptographic signing secret for JWTs |
| `NEXTAUTH_URL` | NextAuth | URL of the website home path |
| `AUTH_SECRET` / `AUTH_URL` | NextAuth | Fallback credentials (Auth.js) |
| `TURNSTILE_SECRET_KEY` | Turnstile | Private token validation key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile | Public Client key widget selector |
| `UPSTASH_REDIS_REST_URL` | Redis | Endpoint connection string |
| `UPSTASH_REDIS_REST_TOKEN` | Redis | Upstash authorization token |
| `R2_BUCKET_NAME` | Storage | R2 Cloud storage bucket name |
| `R2_PUBLIC_URL` | Storage | Public URL to serve files from |
| `R2_ACCESS_KEY_ID` | Storage | Public Access key credential |
| `R2_SECRET_ACCESS_KEY` | Storage | Cryptographic private Access Key |
| `R2_ACCOUNT_ID` | Storage | Cloudflare account identifier |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeds | Fallback seed credentials |
| `NEXT_PUBLIC_SITE_URL` | Global | Public domain URL identifier |
| `SENTRY_DSN` | Monitoring | Error reporting URL endpoint |

---

## 16. Third-Party Integrations

* **Resend**: Transactional emails (admin notifications for leads/orders). Used in [lib/email/transactional/send.ts](file:///c:/Development/vedicWellness/lib/email/transactional/send.ts).
* **Brevo**: Newsletter signup contact management. Used in [lib/email/marketing/client.ts](file:///c:/Development/vedicWellness/lib/email/marketing/client.ts).
* **Cloudflare Turnstile**: Bot protection for forms (signup, contact). Verified in [lib/security/turnstile.ts](file:///c:/Development/vedicWellness/lib/security/turnstile.ts).
* **Cloudflare R2**: Admin asset uploads. Used in [lib/storage/r2/client.ts](file:///c:/Development/vedicWellness/lib/storage/r2/client.ts).
* **Vercel Speed Insights**: User performance tracking. Imported in layout.
* **Upstash**: Global Rate Limiters. Used in [lib/security/rateLimit.ts](file:///c:/Development/vedicWellness/lib/security/rateLimit.ts).

---

## 17. Coding Conventions

* **Imports**: Use the absolute path mapping prefix `@/` (e.g. `import { cn } from "@/lib/cn"`).
* **Server-Only Declarations**: Ensure data models, services, and secure scripts use the `"server-only"` directive at the top of the file to prevent bundling into client code.
* **Action Gating**: Server actions must be protected by security wrapper calls (e.g. `secureAdminAction` or `secureMutation`).
* **File Conventions**:
  * PascalCase for React UI component names (`Button.tsx`, `Navbar.tsx`).
  * camelCase for helpers and service files (`blogService.ts`, `rateLimit.ts`).

---

## 18. Reusable Patterns

### API Security Pattern
Enforce CSRF protection and rate limits inside Route Handlers:
```typescript
import { secureMutation } from "@/lib/security/secureMutation";

export async function POST(req: Request) {
  await secureMutation(req, { limit: "contact" });
  // Process mutation...
}
```

### Server Action Authentication Pattern
Wrap mutations using helper wrapper callbacks (e.g. `secureAdminAction`):
```typescript
import { secureAdminAction } from "@/lib/security/secureAdminAction";

export const createFeature = secureAdminAction(
  async (admin, formData: FormData) => {
    // Process input secure with admin credentials
  }
);
```

### Data Access Layer (DAL) Separation
Keep SQL/Prisma operations decoupled from UI components:
```typescript
// Good (DAL File)
export async function getProducts() {
  return prisma.product.findMany({ ... });
}

// RSC Page
import { getProducts } from "@/lib/db/product";
export default async function Page() {
  const products = await getProducts();
  return <ProductList items={products} />;
}
```

---

## 19. Developer Guidelines

### 1. Adding New Features
* Declare database models in `prisma/schema.prisma`. Run `npm run db:migrate` to update database structures.
* Create Zod validation schemas in `lib/validators/`.
* Write query resolvers inside database DAL handlers (`lib/db/`).
* Implement business flow rules inside services (`lib/services/`).
* Build user endpoints inside Route groups (`app/`).

### 2. Code Location Rules
* **No Direct DB Access in UI**: Never import the prisma client inside pages or component files. Use `lib/db/` or `lib/services/`.
* **Secure Inputs**: All user-submitted mutations must run validation parsers (e.g. `zod`) and CSRF guards.
* **Isolate Client Code**: Keep the base page structure as a Server Component. Nest complex client logic (e.g. forms, toggles, motion) inside leaf nodes marked `"use client"`.
