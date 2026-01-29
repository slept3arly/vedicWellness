import { prisma } from "@/lib/db/prisma";
import LeadsClient from "./LeadsClient";
import { Prisma } from "@prisma/client";

type LeadWithOwner = Prisma.LeadGetPayload<{
  include: { owner: true };
}>;

export default async function Page() {
  const leads = await prisma.lead.findMany({
    include: { owner: true },
    orderBy: { createdAt: "desc" },
  });

  return <LeadsClient leads={leads as LeadWithOwner[]} />;
}
