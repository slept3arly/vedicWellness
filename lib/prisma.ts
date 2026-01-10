import { PrismaClient } from "@prisma/client";

if (!process.env.PRISMA_DATABASE_URL) {
  throw new Error("❌ PRISMA_DATABASE_URL missing. Check .env");
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    accelerateUrl: process.env.PRISMA_DATABASE_URL,
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
