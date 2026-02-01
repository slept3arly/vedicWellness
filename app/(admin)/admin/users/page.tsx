import { getAdminUsers } from "@/lib/db/user";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  return <AdminUsersClient users={users} />;
}
