// app/admin/users/page.tsx
import AdminUsersClient from "./AdminUsersClient";
import { getAdminUsers } from "@/lib/db/user";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const page = Number(params.page) || 1;
  const limit = 12; // Matches the client-side index multiplier

  // Fetch users + total count
  const { data: users, total } = await getAdminUsers(page, limit, q);

  return (
    <AdminUsersClient
      users={users}
      total={total}
      q={q}
      page={page}
    />
  );
}