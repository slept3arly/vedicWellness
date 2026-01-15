import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db/prisma";

async function main() {
  const email = process.env.EDITOR_EMAIL!.toLowerCase().trim();
  const plainPassword = process.env.EDITOR_PASSWORD?.trim();

  if (!email || !plainPassword) {
    throw new Error("Missing EDITOR_EMAIL or EDITOR_PASSWORD in .env");
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "EDITOR",
    },
    create: {
      email,
      password: hashedPassword,
      role: "EDITOR",
    },
  });

  console.log("✅ Editor user created/updated:", email);
}

main()
  .catch((e) => {
    console.error("❌ Editor seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
