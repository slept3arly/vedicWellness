import { assertSameOriginRequest } from "@/lib/security/csrf";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";
import { limits } from "@/lib/security/limits";
import { getClientIpFromRequest } from "@/lib/security/ip";

type LimitKey = keyof typeof limits;

type Options = {
  /**
   * Which rate limit bucket to use from limits.ts
   * Default: must be provided
   */
  limit: LimitKey;

  /**
   * Optional custom rate key prefix
   * Example: contact, signup, r2-upload-url
   */
  keyPrefix?: string;

  /**
   * Disable rate limiting (rare)
   */
  disableRateLimit?: boolean;
};

export async function secureMutation(
  req: Request,
  options: Options
) {
  // 🔒 CSRF always enforced
  assertSameOriginRequest(req);

  if (!options.disableRateLimit) {
    const ip = getClientIpFromRequest(req);

    const prefix = options.keyPrefix ?? options.limit;
    const key = `${prefix}:${ip}`;

    await rateLimitOrThrow(key, limits[options.limit]);
  }
}
