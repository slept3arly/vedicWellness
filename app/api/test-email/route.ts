import { sendTransactionalEmail } from "@/lib/email";
import { TestEmail } from "@/lib/email/transactional/templates/TestEmail";

export async function GET() {
  await sendTransactionalEmail({
    to: "vinayaknautiyal38@gmail.com",
    subject: "Test Email",
    react: TestEmail(),
  });

  return Response.json({ success: true });
}