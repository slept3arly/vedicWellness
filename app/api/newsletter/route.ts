import { prisma } from "@/lib/db/prisma";
import { addSubscriberToBrevo } from "@/lib/email/marketing/contacts";
import { secureMutation } from "@/lib/security/secureMutation";

export async function POST(req: Request) {
  try {
    await secureMutation(req, { limit: "newsletter" });
    const { email, source } = await req.json();

    if (!email) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    // Save locally first
    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: { optedIn: true },
      create: {
        email,
        source: source || "unknown",
      },
    });

    // Sync to Brevo (non-blocking ideal, but fine for now)
    await addSubscriberToBrevo(email);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return Response.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}