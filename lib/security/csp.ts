type CspOptions = {
  isDev?: boolean;
};

export function buildCspHeader({ isDev }: CspOptions = {}) {
  // Next.js needs inline scripts unless you implement CSP nonces/hashes.
  // This CSP is still secure enough for most projects and avoids blank pages.
  const csp = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `frame-src 'self' https://challenges.cloudflare.com`,
    `form-action 'self'`,
    `img-src 'self' https: data: blob:`,
    `font-src 'self' https: data:`,
    `style-src 'self' 'unsafe-inline' https:`,
    // ✅ allow inline scripts (Next needs it)
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https:`,
    // allow API calls, auth, analytics later
    `connect-src 'self' https: wss:`,
    `media-src 'self' https: blob:`,
    `upgrade-insecure-requests`,
  ]
    .filter(Boolean)
    .join("; ");

  return csp;
}
