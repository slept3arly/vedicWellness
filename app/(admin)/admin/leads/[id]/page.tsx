import { getAdminLeadById, getAdminSalesUsers } from "@/lib/db/lead";
import AdminLeadDetailClient from "./AdminLeadDetailClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    throw new Error("Invalid lead id");
  }

  const [lead, salesUsers] = await Promise.all([
    getAdminLeadById(id),
    getAdminSalesUsers(),
  ]);

  if (!lead) {
    throw new Error("Lead not found");
  }

  return <AdminLeadDetailClient lead={lead} salesUsers={salesUsers} />;
}
