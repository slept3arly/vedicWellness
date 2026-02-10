import "server-only";

import { redirect } from "next/navigation";
import { getSession } from "./getSession";
import { prisma } from "@/lib/db/prisma";
import type { Role } from "@prisma/client";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

export async function requireUser(): Promise<AuthUser> {
  const session = await getSession();

  // Not logged in → go to login
  if (!session?.user?.email) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  // Session exists but DB user missing (rare, but possible)
  if (!dbUser) {
    redirect("/login");
  }

  return {
    id: dbUser.id,     // ✅ canonical Prisma ID
    email: dbUser.email,
    role: dbUser.role,
  };
}
