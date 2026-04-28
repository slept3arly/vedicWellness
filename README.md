# Vedic Wellness — Production-Ready E-Commerce Platform

## Overview

Vedic Wellness is a full-stack e-commerce and CMS platform built using Next.js (App Router), designed to handle real-world product workflows, authentication, and admin operations within a single scalable architecture.

The system separates UI, business logic, and data access layers to maintain clean boundaries and support concurrent serverless execution.

---

## Core Capabilities

### Public Platform

- SEO-optimized product catalog and blog system
- Server-rendered pages with caching for fast load times
- Contact and newsletter ingestion with validation + rate limiting

### Customer System

- Authentication with email/password + OTP verification
- Persistent cart and checkout workflows
- Order creation with transactional consistency

### Admin CMS

- Product, blog, and lead management interfaces
- Role-based access control (RBAC)
- Audit logging for admin actions
- File uploads via Cloudflare R2

---

## Architecture

Layered monolithic design:

UI (Next.js Pages + Components)  
→ Server Actions / API Routes  
→ Service Layer (Business Logic)  
→ PostgreSQL (Prisma) + External Services  

Key design rule:

> No direct database access from UI — all interactions go through services.

---

## System Design Highlights

- **Serverless-first architecture** optimized for Vercel deployment
- **ISR + caching strategy** for read-heavy pages (products, blogs)
- **Transactional order processing** using Prisma
- **Redis-backed rate limiting + OTP/session handling**
- **External integrations** (R2, email, verification) handled via service layer
- **Separation of concerns** across routes, services, and database access

---

## Performance Characteristics

- Read-heavy traffic scales efficiently via caching and static generation
- Write-heavy flows (checkout, admin updates) are database-bound
- Concurrency supported through stateless serverless handlers
- Latency influenced by:
  - Database queries (PostgreSQL)
  - External calls (email, verification, storage)
  - Transactional write paths (orders, logs)

---

## Scalability Profile

- Handles low → moderate production traffic reliably
- Optimized for:
  - Cached public reads
  - Concurrent user sessions
- Bottlenecks emerge under:
  - High write throughput
  - Complex search/filter queries
  - Audit logging overhead

---

## Tech Stack

### Frontend

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS + Framer Motion

### Backend / Infra

- PostgreSQL (Prisma ORM)
- NextAuth (Auth.js)
- Upstash Redis (rate limiting, OTP)
- Cloudflare R2 (file storage)
- Resend (email)
- Sentry (monitoring)

---

## Environment Variables

- DATABASE_URL
- NEXTAUTH_SECRET
- UPSTASH_REDIS_REST_URL
- R2 credentials
- RESEND_API_KEY

(See `lib/env.ts`)

---

## Documentation

- ARCHITECTURE.md
- CODEBASE_GUIDE.md
- FLOWS.md

---

## Status

Production-ready system with:

- Authentication & RBAC
- End-to-end e-commerce workflow
- Admin CMS
- Security controls (CSRF, rate limiting, validation)

---

## Notes

This project emphasizes **system design, request handling, and scalable architecture** over UI complexity.