import "dotenv/config";

import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

console.log("✅ Loaded env PRISMA_DATABASE_URL =", process.env.PRISMA_DATABASE_URL?.slice(0, 30));
console.log("✅ Loaded env ADMIN_EMAIL =", process.env.ADMIN_EMAIL);

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!email || !plainPassword) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: { email, password: hashedPassword },
  });

  console.log("✅ Admin user created/updated:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
