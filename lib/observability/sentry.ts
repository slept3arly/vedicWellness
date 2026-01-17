import "server-only";

import * as Sentry from "@sentry/nextjs";

let initialized = false;

export function initSentry() {
  if (initialized) return;

  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

  // If no DSN, no-op (useful for dev / staging)
  if (!dsn) {
    initialized = true;
    return;
  }

  initialized = true;

  // In Next.js Sentry is typically initialized via sentry.*.config files,
  // but this wrapper helps you use Sentry safely from anywhere.
  // If you're already using those config files, this is still fine.
}

export function captureError(err: unknown, extras?: Record<string, unknown>) {
  try {
    Sentry.captureException(err, { extra: extras });
  } catch {
    // never crash app because Sentry failed
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
