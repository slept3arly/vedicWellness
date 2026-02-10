import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  "dist",
  "build",
]);

const BAD: string[] = [];

function isAdminFile(fullPath: string) {
  return (
    fullPath.includes(`${path.sep}app${path.sep}(admin)${path.sep}`) ||
    fullPath.includes(`${path.sep}app${path.sep}admin${path.sep}`)
  );
}

function isApiRoute(fullPath: string) {
  return fullPath.includes(`${path.sep}app${path.sep}api${path.sep}`);
}

function walk(dir: string) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      if (IGNORE_DIRS.has(file)) continue;
      walk(full);
      continue;
    }

    if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;

    // Skip the security wrappers themselves
    if (
      full.endsWith("secureAdminAction.ts") ||
      full.endsWith("secureUserAction.ts") ||
      full.endsWith("secureMutation.ts")
    ) {
      continue;
    }

    const content = fs.readFileSync(full, "utf8");

    /* =========================================================
       SERVER ACTIONS
       ========================================================= */

    if (content.includes(`"use server"`)) {
      if (isAdminFile(full)) {
        if (!content.includes("secureAdminAction(")) {
          BAD.push(`Missing secureAdminAction → ${full}`);
        }
      } else {
        if (!content.includes("secureUserAction(")) {
          BAD.push(`Missing secureUserAction → ${full}`);
        }
      }
    }

    /* =========================================================
       API ROUTES
       ========================================================= */

    if (
      isApiRoute(full) &&
      content.includes("export async function POST")
    ) {
      if (!content.includes("secureMutation(")) {
        BAD.push(`Missing secureMutation → ${full}`);
      }
    }
  }
}

walk(ROOT);

if (BAD.length) {
  console.error("\n🚨 SECURITY CHECK FAILED:\n");
  for (const b of BAD) console.error(" -", b);
  console.error("\nFix before merging.\n");
  process.exit(1);
}

console.log("✅ Security check passed");
