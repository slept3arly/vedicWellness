export function buildCspHeader({ isDev }: { isDev?: boolean } = {}) {
  const scriptSrc = `'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https:`;

  return [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    `img-src 'self' https: data: blob:`,
    `font-src 'self' https: data:`,

    // ✅ THIS FIXES INVISIBLE UI
    `style-src 'self' 'unsafe-inline' https: blob: data:`,

    `script-src ${scriptSrc}`,
    `script-src-elem ${scriptSrc}`,
    `connect-src 'self' https: wss:`,
    `media-src 'self' https: blob:`,

    `upgrade-insecure-requests`,
  ].join("; ");
}
