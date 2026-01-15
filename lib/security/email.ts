import "server-only";
import { resolveMx } from "node:dns/promises";

/**
 * Returns true if domain can receive mail (has MX records)
 */
export async function hasMxRecord(domain: string) {
  try {
    const records = await resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch {
    return false;
  }
}
