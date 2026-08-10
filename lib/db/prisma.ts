import "server-only";
import "@/lib/env";

import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const createPrismaClient = () => {
  return new PrismaClient({
    log: ["error"],
  }).$extends(withAccelerate());
};

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

declare global {
   
  var prisma: ExtendedPrismaClient | undefined;
}

export const prisma =
  global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}