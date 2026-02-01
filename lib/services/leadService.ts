import {
  updateLead,
  deleteLeadDB,
  getLeadById,
} from "@/lib/db/lead";

import { LeadStatus } from "@prisma/client";
import { auditWithContext } from "@/lib/observability/auditWithContext";

export async function claimLeadService(id: string, adminId: string) {
  await updateLead(id, {
    ownerId: adminId,
    status: LeadStatus.WARM,
    claimedAt: new Date(),
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "LEAD",
    entityId: id,
    metadata: { kind: "LEAD", action: "CLAIM" },
  });
}

export async function unclaimLeadService(id: string, adminId: string) {
  await updateLead(id, {
    ownerId: null,
    claimedAt: null,
    status: LeadStatus.NEW,
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "LEAD",
    entityId: id,
    metadata: { kind: "LEAD", action: "UNCLAIM" },
  });
}

export async function updateLeadStatusService(
  id: string,
  status: LeadStatus,
  adminId: string
) {
  await updateLead(id, { status });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "LEAD",
    entityId: id,
    metadata: { kind: "LEAD", status },
  });
}

export async function deleteLeadService(id: string, adminId: string) {
  const lead = await getLeadById(id);

  await deleteLeadDB(id);

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_DELETE",
    entityType: "LEAD",
    entityId: id,
    metadata: {
      kind: "LEAD",
      email: lead?.email ?? null,
      name: lead?.name ?? null,
    },
  });
}

export async function assignLeadService(
  leadId: string,
  toUserId: string | null
) {
  await updateLead(leadId, {
    ownerId: toUserId,
    status: toUserId ? LeadStatus.WARM : LeadStatus.NEW,
    claimedAt: toUserId ? new Date() : null,
  });
}
