import "server-only";
import * as Sentry from "@sentry/nextjs";

/**
 * Sentry is initialized by:
 * - sentry.server.config.ts
 * - sentry.client.config.ts
 * - sentry.edge.config.ts
 *
 * This file only provides safe helper wrappers.
 */

export function captureError(err: unknown, extras?: Record<string, unknown>) {
  try {
    Sentry.captureException(err, { extra: extras });
  } catch {
    // never crash because Sentry failed
  }
}

export function captureMessage(message: string, extras?: Record<string, unknown>) {
  try {
    Sentry.captureMessage(message, { extra: extras });
  } catch {
    // no-op
  }
}

export function setSentryUser(user?: { id?: string; email?: string }) {
  try {
    if (!user) {
      Sentry.setUser(null);
      return;
    }
    Sentry.setUser({
      id: user.id,
      email: user.email,
    });
  } catch {
    // no-op
  }
}
