import "server-only";
import { BrevoClient } from "@getbrevo/brevo";

let clientInstance: BrevoClient | null = null;

export function getBrevoClient() {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error("❌ Brevo Client Initialization Error: BREVO_API_KEY is not defined in environment variables.");
    throw new Error("Missing BREVO_API_KEY");
  }

  if (!clientInstance) {
    console.log("🔌 Initializing new BrevoClient instance...");
    try {
      clientInstance = new BrevoClient({
        apiKey,
      });
      console.log("✅ BrevoClient successfully initialized");
    } catch (err: any) {
      console.error("❌ Failed to instantiate BrevoClient:", err.message || err);
      throw err;
    }
  }

  return clientInstance;
}