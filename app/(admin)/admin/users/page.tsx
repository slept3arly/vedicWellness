import AdminUsersClient from "./AdminUsersClient";
import { getAdminUsers } from "@/lib/db/user";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { Role } from "@prisma/client";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; role?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;
  const role = Object.values(Role).includes(params.role as Role)
    ? (params.role as Role)
    : "";
  const searchQuery = [q, role].filter(Boolean).join(" ");

  const { data: users, total } = await getAdminUsers(
    page,
    ADMIN_PAGE_SIZE,
    searchQuery
  );

  return (
    <AdminUsersClient
      users={users}
      total={total}
      q={q}
      page={page}
      role={role}
    />
  );
}
