import "server-only";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),

  DATABASE_URL: z.string().min(1),

  // NextAuth / Auth.js
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().min(1),

  // some deployments also use AUTH_* (Auth.js)
  AUTH_SECRET: z.string().optional(),
  AUTH_URL: z.string().optional(),

  // Turnstile
  TURNSTILE_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),

  // Upstash rate limit
  UPSTASH_REDIS_REST_URL: z.string().min(1),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // R2
  R2_BUCKET_NAME: z.string().min(1),
  R2_PUBLIC_URL: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_ACCOUNT_ID: z.string().min(1),

  // optional
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().optional(),

  NEXT_PUBLIC_SITE_URL: z.string().optional(),
  VERCEL_OIDC_TOKEN: z.string().optional(),
  PRISMA_DATABASE_URL: z.string().optional(),

  // Sentry optional for local
  SENTRY_DSN: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
