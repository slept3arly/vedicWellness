import { PrismaClient } from "@prisma/client";
import "server-only";

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL missing. Check .env");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
