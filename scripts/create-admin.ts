import "dotenv/config";

import bcrypt from "bcryptjs";
import { prisma } from "../lib/db/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL!.toLowerCase().trim();
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!email || !plainPassword) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  await prisma.user.upsert({
  where: { email },
  update: {
    password: hashedPassword,
    role: "ADMIN",
    verified: true,
  },
  create: {
    email,
    password: hashedPassword,
    role: "ADMIN",
    verified: true,
  },
});


  console.log("✅ Admin user created/updated:", email);
}

main()
  .catch((e) => {
    console.error("❌ Admin seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
