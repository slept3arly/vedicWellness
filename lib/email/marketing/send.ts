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

  if (!from) {
    throw new Error("Missing MARKETING_EMAIL_FROM");
  }

  const client = getBrevoClient();

  await client.transactionalEmails.sendTransacEmail({
    sender: { name: "Vedic Wellness", email: from },
    to: (Array.isArray(to) ? to : [to]).map(email => ({ email })),
    subject,
    htmlContent: html,
  });

  return { success: true };
}