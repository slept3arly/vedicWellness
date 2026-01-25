type CspOptions = {
  isDev?: boolean;
};

export function buildCspHeader({ isDev }: CspOptions = {}) {
  const scriptSrc = `'self' https://challenges.cloudflare.com https:${
    isDev ? " 'unsafe-eval'" : ""
  }`;

  const csp = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,

    // ✅ Cloudflare Turnstile iframe
    `frame-src 'self' https://challenges.cloudflare.com`,

    `form-action 'self'`,
    `img-src 'self' https: data: blob:`,
    `font-src 'self' https: data:`,
    `style-src 'self' 'unsafe-inline' https: blob: data:`,

    // ✅ scripts (Turnstile allowed)
    `script-src ${scriptSrc}`,
    `script-src-elem ${scriptSrc}`,
    `script-src-attr 'none'`,

    `connect-src 'self' https: wss:`,
    `media-src 'self' https: blob:`,

    `upgrade-insecure-requests`,
  ]
    .filter(Boolean)
    .join("; ");

  return csp;
}
