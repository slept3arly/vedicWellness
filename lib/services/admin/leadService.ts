import { LeadStatus } from "@prisma/client";
import {
  updateLead,
  deleteLeadDB,
  getLeadById,
} from "@/lib/db/lead";
import { auditWithContext } from "@/lib/observability/auditWithContext";

/* =========================================================
   CLAIM / UNCLAIM
========================================================= */

export async function claimLeadService(
  id: string,
  adminId: string
) {
  await updateLead(id, {
    owner: {
      connect: { id: adminId },
    },
    status: LeadStatus.WARM,
    claimedAt: new Date(),
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "LEAD",
    entityId: id,
    metadata: {
      kind: "LEAD",
      action: "CLAIM",
    },
  });
}

export async function unclaimLeadService(
  id: string,
  adminId: string
) {
  await updateLead(id, {
    owner: {
      disconnect: true,
    },
    claimedAt: null,
    status: LeadStatus.NEW,
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "LEAD",
    entityId: id,
    metadata: {
      kind: "LEAD",
      action: "UNCLAIM",
    },
  });
}

/* =========================================================
   STATUS UPDATE
========================================================= */

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
    metadata: {
      kind: "LEAD",
      status,
    },
  });
}

/* =========================================================
   ASSIGN
========================================================= */

export async function assignLeadService(
  leadId: string,
  toUserId: string | null,
  adminId: string
) {
  await updateLead(leadId, {
    owner: toUserId
      ? { connect: { id: toUserId } }
      : { disconnect: true },
    status: toUserId ? LeadStatus.WARM : LeadStatus.NEW,
    claimedAt: toUserId ? new Date() : null,
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "LEAD",
    entityId: leadId,
    metadata: {
      kind: "LEAD",
      action: "ASSIGN",
      toUserId,
    },
  });
}

/* =========================================================
   DELETE
========================================================= */

export async function deleteLeadService(
  id: string,
  adminId: string
) {
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