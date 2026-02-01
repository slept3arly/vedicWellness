import { getAdminLeads, getSalesUsers } from "@/lib/db/lead";
import LeadsClient from "./AdminLeadsClient";
import { Prisma } from "@prisma/client";

type LeadWithOwner = Prisma.LeadGetPayload<{
  include: { owner: true };
}>;

export default async function Page() {
  const [leads, salesUsers] = await Promise.all([
    getAdminLeads(),
    getSalesUsers(),
  ]);

  return (
    <LeadsClient
      leads={leads as LeadWithOwner[]}
      salesUsers={salesUsers}
    />
  );
}
