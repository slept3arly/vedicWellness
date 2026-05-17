import * as dotenv from "dotenv";
import path from "path";

// Load .env.local specifically since Next.js uses it
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Mock MARKETING_EMAIL_FROM to the verified sender email retrieved from Brevo Senders list
process.env.MARKETING_EMAIL_FROM = "vedicwellnessid@gmail.com";

import { getBrevoClient } from "../lib/email/marketing/client";
import { addSubscriberToBrevo } from "../lib/email/marketing/contacts";
import { sendMarketingEmail } from "../lib/email/marketing/send";
import { WelcomeEmail } from "../lib/email/marketing/templates/WelcomeEmail";

async function runTest() {
  console.log("=== Brevo Complete Integration & Send Test ===");
  console.log("- Using verified sender email:", process.env.MARKETING_EMAIL_FROM);

  const testEmail = "vinayaknautiyal38@gmail.com"; // Let's send to the actual dev email or a test email
  console.log("\nRecipient email:", testEmail);

  // 1. Initializing Brevo Client
  console.log("\n1. Initializing Brevo Client...");
  let client;
  try {
    client = getBrevoClient();
    console.log("✅ Client initialized successfully");
  } catch (err: any) {
    console.error("❌ Client initialization failed:", err.message);
    return;
  }

  // 2. Add subscriber
  console.log("\n2. Calling addSubscriberToBrevo...");
  const contactResult = await addSubscriberToBrevo(testEmail);
  console.log("Contact Result:", JSON.stringify(contactResult, null, 2));

  // 3. Send welcome email
  console.log("\n3. Calling sendMarketingEmail...");
  try {
    const emailResult = await sendMarketingEmail({
      to: testEmail,
      subject: "Welcome to Vedic Wellness (Integration Test)",
      html: WelcomeEmail(testEmail),
    });
    console.log("✅ Email sent successfully! Result:", JSON.stringify(emailResult, null, 2));
  } catch (err: any) {
    console.error("❌ Email sending failed. Error details:");
    console.error("- Message:", err.message);
    if (err.response) {
      console.error("- Response status:", err.response.status);
      console.error("- Response body:", JSON.stringify(err.response.data || err.response.body, null, 2));
    } else {
      console.error("- Error object:", err);
    }
  }
}

runTest().catch(console.error);
