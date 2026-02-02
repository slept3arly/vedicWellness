// app/admin/users/page.tsx
import AdminUsersClient from "./AdminUsersClient";
import { getAdminUsers } from "@/lib/db/user";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  // 1. Await searchParams for Next.js 15 compatibility
  const params = await searchParams;
  const q = params.q || "";
  const page = Number(params.page) || 1;

  // 2. Fetch users based on the URL params
  const users = await getAdminUsers(page, 20, q);

  return (
    <AdminUsersClient
      // 3. The key forces a clean UI refresh when params change
      users={users}
      q={q}
      page={page}
    />
  );
}