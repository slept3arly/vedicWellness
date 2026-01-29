import "server-only";

import { redirect } from "next/navigation";
import { getSession } from "./getSession";
import { prisma } from "@/lib/db/prisma";
import type { Session } from "next-auth";

type AdminUser = {
  id: string;
  email: string;
  role: "ADMIN";
};

export async function requireAdmin(): Promise<AdminUser> {
  const session = await getSession();

  if (!session?.user?.email) redirect("/login?next=/admin");

  if (session.user.role !== "ADMIN") redirect("/");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) redirect("/login?next=/admin");

  return {
    id: dbUser.id,        // ✅ REAL PRISMA ID
    email: dbUser.email,
    role: "ADMIN",
  };
}
