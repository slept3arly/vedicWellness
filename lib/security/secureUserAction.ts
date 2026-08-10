import { assertSameOriginAction } from "@/lib/security/csrf";
import { requireUser, type AuthUser } from "@/lib/auth/requireUser";

/**
 * Enforces:
 * - CSRF protection
 * - Authenticated user
 * - Canonical DB user lookup
 */
export function secureUserAction<TArgs extends unknown[], TResult>(
  action: (user: AuthUser, ...args: TArgs) => Promise<TResult>
) {
  return async (...args: TArgs): Promise<TResult> => {
    // 🔒 CSRF protection (same as admin)
    await assertSameOriginAction();

    // 🔐 Authenticated user (VIEWER / SALES / ADMIN)
    const user = await requireUser();

    // ▶ Execute action with injected user
    return action(user, ...args);
  };
}
