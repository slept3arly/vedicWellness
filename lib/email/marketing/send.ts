import "server-only";
import { getBrevoClient } from "./client";

type SendMarketingEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
};

export async function sendMarketingEmail({
  to,
  subject,
  html,
}: SendMarketingEmailOptions) {
  const from = process.env.MARKETING_EMAIL_FROM;

  console.log("📨 [sendMarketingEmail] Attempting to send marketing email:");
  console.log(`- From (MARKETING_EMAIL_FROM): ${from || "MISSING"}`);
  console.log(`- To:`, to);
  console.log(`- Subject: "${subject}"`);
  console.log(`- HTML Content Length: ${html ? html.length : 0} characters`);

  if (!from) {
    console.error("❌ [sendMarketingEmail] Error: MARKETING_EMAIL_FROM environment variable is missing.");
    throw new Error("Missing MARKETING_EMAIL_FROM");
  }

  try {
    const client = getBrevoClient();
    const recipients = (Array.isArray(to) ? to : [to]).map(email => ({ email }));

    console.log("📨 [sendMarketingEmail] Dispatching request to Brevo API...");
    const response = await client.transactionalEmails.sendTransacEmail({
      sender: { name: "Vedic Wellness", email: from },
      to: recipients,
      subject,
      htmlContent: html,
    });

    console.log("✅ [sendMarketingEmail] Brevo API send successful. Response:", JSON.stringify(response, null, 2));
    return { success: true, data: response };
  } catch (error: any) {
    console.error("❌ [sendMarketingEmail] Brevo API request failed:");
    console.error(`- Error message: ${error.message}`);
    
    if (error.response) {
      console.error(`- HTTP Status: ${error.response.status}`);
      console.error("- Response Data:", JSON.stringify(error.response.data || error.response.body, null, 2));
    } else {
      console.error("- Error object:", error);
    }
    
    throw error;
  }
}