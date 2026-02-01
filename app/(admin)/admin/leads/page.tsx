import { prisma } from "@/lib/db/prisma";
import LeadsClient from "./AdminLeadsClient";
import { Prisma } from "@prisma/client";

type LeadWithOwner = Prisma.LeadGetPayload<{
  include: { owner: true };
}>;

export default async function Page() {
  const leads = await prisma.lead.findMany({
    include: { owner: true },
    orderBy: { createdAt: "desc" },
  });

  const salesUsers = await prisma.user.findMany({
    where: { role: "SALES" },
    select: {
      id: true,
      email: true,
      name: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <LeadsClient
      leads={leads as LeadWithOwner[]}
      salesUsers={salesUsers}
    />
  );
}
