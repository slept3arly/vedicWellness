import { assertSameOriginAction } from "@/lib/security/csrf";
import { requireUser, type AuthUser } from "@/lib/auth/requireUser";

/**
 * Enforces:
 * - CSRF protection
 * - Authenticated user
 * - Canonical DB user lookup
 */
export function secureUserAction<
  T extends (...args: any[]) => Promise<any>
>(
  action: (user: AuthUser, ...args: Parameters<T>) => Awaited<ReturnType<T>>
) {
  return async (
    ...args: Parameters<T>
  ): Promise<Awaited<ReturnType<T>>> => {
    // 🔒 CSRF protection (same as admin)
    await assertSameOriginAction();

    // 🔐 Authenticated user (VIEWER / SALES / ADMIN)
    const user = await requireUser();

    // ▶ Execute action with injected user
    return action(user, ...args);
  };
}
