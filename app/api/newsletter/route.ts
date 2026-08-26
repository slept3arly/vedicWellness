import { prisma } from "@/lib/db/prisma";
import { addSubscriberToBrevo } from "@/lib/email/marketing/contacts";
import { secureMutation } from "@/lib/security/secureMutation";
import { newsletterSchema } from "@/lib/validators/newsletter";

export async function POST(req: Request) {
  try {
    await secureMutation(req, { limit: "newsletter" });

    const parsed = newsletterSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return Response.json({ error: "A valid email is required" }, { status: 400 });
    }

    const { email, source } = parsed.data;

    // Save locally first
    await prisma.subscriber.upsert({
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