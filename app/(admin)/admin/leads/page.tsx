// app/admin/leads/page.tsx
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

  // Fetch data concurrently for better performance
  const [leads, salesUsers] = await Promise.all([
    getAdminLeads(page, 25, q),
    getSalesUsers(),
  ]);

  return (
    <AdminLeadsClient
      //key={`${q}-${page}`} // 🔑 Critical: Forces re-mount when search changes
      leads={leads}
      salesUsers={salesUsers}
      page={page}
      q={q}
    />
  );
}