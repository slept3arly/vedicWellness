import AdminLeadsClient from "./AdminLeadsClient";
import { getAdminLeads } from "@/lib/db/lead";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;

  const { data: leads, total } = await getAdminLeads(page, ADMIN_PAGE_SIZE, q);

  return (
    <AdminLeadsClient
      leads={leads}
      total={total}
      page={page}
      q={q}
    />
  );
}
