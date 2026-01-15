import { redirect } from "next/navigation";
import { getSession } from "./getSession";

export async function requireAdmin() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?next=/admin");
  }

  // Temporary check until roles are implemented
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  return session;
}
