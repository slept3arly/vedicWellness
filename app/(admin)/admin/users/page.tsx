import AdminUsersClient from "./AdminUsersClient";
import { getAdminUsers } from "@/lib/db/user";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;

  const { data: users, total } = await getAdminUsers(
    page,
    ADMIN_PAGE_SIZE,
    q
  );

  return (
    <AdminUsersClient
      users={users}
      total={total}
      q={q}
      page={page}
    />
  );
}