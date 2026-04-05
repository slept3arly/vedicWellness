import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

type AdminUser = {
  id: string;
  email: string;
  role: "ADMIN";
};

export async function requireAdmin(): Promise<AdminUser> {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login?next=/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  // ⭐ IMPORTANT CHANGE:
  const dbUser = await prisma.user.findFirst({
    where: {
      email: session.user.email,
      role: "ADMIN",
      deletedAt: null, // 🚫 block deleted admins
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  // If admin deleted → force logout
  if (!dbUser) {
    redirect("/login?next=/admin");
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    role: "ADMIN",
  };
}
