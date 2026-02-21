import { assertSameOriginAction } from "@/lib/security/csrf";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { rateLimitOrThrow } from "@/lib/security/rateLimit";

/**
 * Enforces:
 * - CSRF protection
 * - ADMIN role
 * - canonical admin DB lookup
 * - Rate limiting (per admin)
 */
export function secureAdminAction<
  T extends (...args: any[]) => Promise<any>
>(
  action: (admin: { id: string }, ...args: Parameters<T>) => Awaited<ReturnType<T>>
) {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    await assertSameOriginAction();

    const admin = await requireAdmin();

    // 🛡 Protect against abuse or compromised accounts
    await rateLimitOrThrow(
      `admin-action:${admin.id}`,
      {
        windowSeconds: 60,
        max: 100,
      }
    );

    return action(admin, ...args);
  };
}