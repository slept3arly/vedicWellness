import "server-only";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

type Limit = {
  windowSeconds: number;
  max: number;
};

const redis = Redis.fromEnv();

// cache limiter instances in module scope
const limiterCache = new Map<string, Ratelimit>();

function getLimiter(limit: Limit) {
  const key = `${limit.max}/${limit.windowSeconds}`;
  const existing = limiterCache.get(key);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit.max, `${limit.windowSeconds} s`),
    analytics: true,
    prefix: "ratelimit",
  });

  limiterCache.set(key, limiter);
  return limiter;
}

export async function rateLimitOrThrow(identifier: string, limit: Limit) {
  const limiter = getLimiter(limit);
  const result = await limiter.limit(identifier);

  if (!result.success) {
    const err = new Error("RATE_LIMITED");
    (err as any).status = 429;
    (err as any).reset = result.reset;
    throw err;
  }

  return result;
}
