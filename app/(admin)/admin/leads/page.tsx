import AdminLeadsClient from "./AdminLeadsClient";
import { getAdminLeads, getSalesUsers } from "@/lib/db/lead";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;

  const [{ data, total }, salesUsers] = await Promise.all([
    getAdminLeads(page, 25, q),
    getSalesUsers(),
  ]);

  const leads = data; // ✅ important

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