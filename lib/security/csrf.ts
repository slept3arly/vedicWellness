import "server-only";

import { headers } from "next/headers";

/**
 * CSRF protection via same-site Origin/Referer validation.
 * This is the recommended baseline for cookie-based auth apps.
 *
 * - Blocks cross-site POST/PUT/PATCH/DELETE for authenticated actions.
 * - Avoids token complexity unless you explicitly need cross-site form submits.
 */

export type CsrfCheckOptions = {
  /**
   * If true, allow requests without Origin/Referer.
   * Browsers usually send Origin for fetch/XHR POST.
   * Some edge cases (old clients) may omit it.
   */
  allowMissing?: boolean;
};

/**
 * Server Actions version (uses next/headers()).
 * Call at the top of every privileged server action.
 */
export async function assertSameOriginAction(
  opts: CsrfCheckOptions = {}
): Promise<void> {
  const h = await headers();

  const host = h.get("host") || "";
  const origin = h.get("origin");
  const referer = h.get("referer");

  // If both missing, decide policy
  if (!origin && !referer) {
    if (opts.allowMissing) return;
    throw new Error("CSRF blocked: missing origin/referer");
  }

  if (origin) {
    const o = safeURL(origin);
    if (!o || !isSameSite(o, host)) {
      throw new Error("CSRF blocked: origin mismatch");
    }
  } else if (referer) {
    const r = safeURL(referer);
    if (!r || !isSameSite(r, host)) {
      throw new Error("CSRF blocked: referer mismatch");
    }
  }
}

/**
 * API Route / Route Handler version (takes Request).
 */
export function assertSameOriginRequest(
  req: Request,
  opts: CsrfCheckOptions = {}
): void {
  const host = req.headers.get("host") || "";
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  if (!origin && !referer) {
    if (opts.allowMissing) return;
    throw new Error("CSRF blocked: missing origin/referer");
  }

  if (origin) {
    const o = safeURL(origin);
    if (!o || !isSameSite(o, host)) {
      throw new Error("CSRF blocked: origin mismatch");
    }
  } else if (referer) {
    const r = safeURL(referer);
    if (!r || !isSameSite(r, host)) {
      throw new Error("CSRF blocked: referer mismatch");
    }
  }
}

/** Helpers */

function safeURL(v: string): URL | null {
  try {
    return new URL(v);
  } catch {
    return null;
  }
}

function isSameSite(url: URL, host: string): boolean {
  // host may include port
  const reqHost = host.toLowerCase();
  const originHost = url.host.toLowerCase();

  return originHost === reqHost;
}
