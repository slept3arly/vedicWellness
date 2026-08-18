import "server-only";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_COMPANY = "vedic-wellness";
const PUBLIC_DIR = path.join(process.cwd(), "public");
const LOGO_DIR = path.join(PUBLIC_DIR, "logos");

// Resolves the public URL of a company's logo asset, or null if no logo file
// exists yet. Logo availability only affects how the logo is rendered — it
// never filters companies out of the public selector.
export function getCompanyLogoUrl(slug: string): string | null {
  const candidates: string[] = [
    // Convention: public/logos/<slug>.svg / <slug>.png
    path.join(LOGO_DIR, `${slug}.svg`),
    path.join(LOGO_DIR, `${slug}.png`),
    // Root-level assets, e.g. public/innovia-drugs.svg
    path.join(PUBLIC_DIR, `${slug}.svg`),
    path.join(PUBLIC_DIR, `${slug}.png`),
  ];

  // Vedic Wellness' primary brand mark lives at public/logo.svg.
  if (slug === DEFAULT_COMPANY) {
    candidates.push(path.join(PUBLIC_DIR, "logo.svg"));
  }

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      const relative = path.relative(PUBLIC_DIR, file).split(path.sep).join("/");
      return `/${relative}`;
    }
  }

  return null;
}
