import "server-only";

import { redirect } from "next/navigation";
import { getSession } from "./getSession";
import type { Session } from "next-auth";

type AdminUser = NonNullable<Session["user"]> & {
  id: string;
  role: "ADMIN";
};

export async function requireAdmin(): Promise<AdminUser> {
  const session = await getSession();

  if (!session?.user) redirect("/login?next=/admin");

  const user = session.user;

  if (!user.id) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/");

  return user as AdminUser;
}
