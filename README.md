# Vedic Wellness — E-Commerce & CMS Platform

## Overview

Vedic Wellness is a full-stack e-commerce platform built with Next.js, combining:

* A public marketing website
* A customer shopping experience (cart, checkout, orders)
* An admin dashboard for content and product management

It is designed as a **monolithic App Router application** with a clear separation between UI, business logic, and data layers.

---

## Features

### Public

* Product catalog with detailed pages
* Blog system
* SEO-optimized marketing pages
* Contact and newsletter flows

### Customer

* Authentication (email/password + OTP verification)
* Persistent shopping cart
* Checkout and order management
* Account management

### Admin

* Product CRUD (with image uploads via R2)
* Blog and content management
* Lead management (CRM-style)
* Order tracking
* Audit logging

---

## Tech Stack

### Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* Framer Motion

### Backend / Infrastructure

* PostgreSQL (via Prisma)
* NextAuth (Auth.js)
* Upstash Redis (rate limiting, OTP sessions)
* Cloudflare R2 (file storage)
* Resend (email)
* Sentry (monitoring)

---

## Architecture Summary

This project follows a **layered monolithic architecture**:

```
UI (Pages + Components)
        ↓
Server Actions / API Routes
        ↓
Services (Business Logic)
        ↓
Database & External Services
```

Key principle:

> UI never talks directly to the database — everything goes through services.

---

## Getting Started

```bash
npm install
npm run dev
```

### Required Environment Variables

* DATABASE_URL
* NEXTAUTH_SECRET
* UPSTASH_REDIS_REST_URL
* R2 credentials
* RESEND_API_KEY

(See `lib/env.ts` for full schema)

---

## Documentation

* Architecture → `ARCHITECTURE.md`
* Codebase Guide → `CODEBASE_GUIDE.md`
* Flows → `FLOWS.md`

---

## Status

Project is production-ready with:

* Authentication
* E-commerce flow
* Admin CMS
* Security (CSRF, rate limiting, role-based access)

---

## Author

Built as part of a full-stack web development project.
