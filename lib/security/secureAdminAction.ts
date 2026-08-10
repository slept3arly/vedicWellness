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
export function secureAdminAction<TArgs extends unknown[] = [FormData], TResult = void>(
  action: (admin: { id: string }, ...args: TArgs) => Promise<TResult>
): (...args: TArgs extends [] ? [formData?: FormData] : TArgs) => Promise<TResult> {
  return async (...args: TArgs extends [] ? [formData?: FormData] : TArgs): Promise<TResult> => {
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

    return action(admin, ...(args as TArgs));
  };
}
