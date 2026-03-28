import AdminLeadsClient from "./AdminLeadsClient";
import { getAdminLeads, getAdminSalesUsers } from "@/lib/db/lead";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;

  const [{ data: leads, total }, salesUsers] = await Promise.all([
    getAdminLeads(page, ADMIN_PAGE_SIZE, q),
    getAdminSalesUsers(),
  ]);

  return (
    <AdminLeadsClient
      leads={leads}
      total={total}
      salesUsers={salesUsers}
      page={page}
      q={q}
    />
  );
}