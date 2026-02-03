"use server";

import { assertSameOriginAction } from "@/lib/security/csrf";
import { requireAdmin } from "@/lib/auth/requireAdmin";

/**
 * Enforces:
 * - CSRF protection
 * - ADMIN role
 * - canonical admin DB lookup
 */
export function secureAdminAction<
  T extends (...args: any[]) => Promise<any>
>(
  action: (admin: { id: string }, ...args: Parameters<T>) => ReturnType<T>
) {
  return async (...args: Parameters<T>) => {
    await assertSameOriginAction();

    const admin = await requireAdmin();

    return action(admin, ...args);
  };
}
