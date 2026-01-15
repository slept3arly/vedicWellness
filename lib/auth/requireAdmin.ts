import { redirect } from "next/navigation";
import { getSession } from "./getSession";

export async function requireAdmin() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?next=/admin");
  }

  const role = (session.user as any).role;

  // ✅ RBAC gate
  if (!["ADMIN", "EDITOR"].includes(role)) redirect("/");

  return session;
}
