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

  // ⭐ IMPORTANT CHANGE:
  const dbUser = await prisma.user.findFirst({
    where: {
      email: session.user.email,
      deletedAt: null, // 🚫 block deleted users
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  // If user deleted or missing → force logout
  if (!dbUser) {
    redirect("/login");
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
  };
}
