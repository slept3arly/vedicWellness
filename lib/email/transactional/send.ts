import { resend } from "./client";

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  react: React.ReactNode;
};

export async function sendTransactionalEmail({
  to,
  subject,
  react,
}: SendEmailOptions) {
  if (!process.env.EMAIL_FROM) {
    throw new Error("Missing EMAIL_FROM env variable");
  }

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      react,
    });

    return data;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}