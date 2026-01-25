type CspOptions = {
  isDev?: boolean;
};

export function buildCspHeader({ isDev }: CspOptions = {}) {
  const scriptSrc = [
    `'self'`,
    `https:`,
    `https://challenges.cloudflare.com`,
    `'unsafe-inline'`,              // 🔥 REQUIRED for Next.js
    isDev ? `'unsafe-eval'` : ``,
  ]
    .filter(Boolean)
    .join(" ");

  const csp = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,

    `frame-src https://challenges.cloudflare.com`,

    `form-action 'self'`,
    `img-src 'self' https: data: blob:`,
    `font-src 'self' https: data:`,
    `style-src 'self' 'unsafe-inline' https: blob: data:`,

    // ✅ FIXED
    `script-src ${scriptSrc}`,
    `script-src-elem ${scriptSrc}`,
    `script-src-attr 'none'`,

    `connect-src 'self' https: wss:`,
    `media-src 'self' https: blob:`,

    `upgrade-insecure-requests`,
  ].join("; ");

  return csp;
}
