import "server-only";
import { BrevoClient } from "@getbrevo/brevo";

let clientInstance: BrevoClient | null = null;

export function getBrevoClient() {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error("Missing BREVO_API_KEY");
  }

  if (!clientInstance) {
    clientInstance = new BrevoClient({
      apiKey,
    });
  }

  return clientInstance;
}