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

    // Skip the wrapper itself
    if (full.endsWith("secureAdminAction.ts")) continue;
    if (full.endsWith("secureMutation.ts")) continue;

    const content = fs.readFileSync(full, "utf8");

    // 🔐 Enforce secureAdminAction for server actions
    if (content.includes(`"use server"`)) {
      if (!content.includes("secureAdminAction(")) {
        BAD.push(`Missing secureAdminAction → ${full}`);
      }
    }

    // 🔒 Enforce secureMutation for API POST routes
    if (
      full.includes(`${path.sep}app${path.sep}api${path.sep}`) &&
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
