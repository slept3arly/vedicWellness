import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  const email = process.argv[2]?.toLowerCase().trim();
  const plainPassword = process.argv[3];

  if (!email || !plainPassword) {
    throw new Error(
      "Usage: npm run create-admin -- email@example.com password123"
    );
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

  console.log(`✅ Admin created/updated: ${email}`);
}

main()
  .catch((e) => {
    console.error("❌ Admin seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });