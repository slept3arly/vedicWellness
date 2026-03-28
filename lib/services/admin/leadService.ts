import { LeadStatus } from "@prisma/client";
import {
  updateLead,
  deleteLeadDB,
  getLeadById,
} from "@/lib/db/lead";
import { auditWithContext } from "@/lib/observability/auditWithContext";

/* =========================================================
   CLAIM
========================================================= */

export async function claimLeadService(
  id: string,
  adminId: string
) {
  const before = await getLeadById(id);
  if (!before) return;

  await updateLead(id, {
    owner: { connect: { id: adminId } },
    status: LeadStatus.WARM,
    claimedAt: new Date(),
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "LEAD",
    entityId: id,
    entityLabel: `Lead: ${before.email}`,
    metadata: {
      type: "UPDATE",
      changes: [
        {
          field: "ownerId",
          from: before.ownerId,
          to: adminId,
        },
        {
          field: "status",
          from: before.status,
          to: LeadStatus.WARM,
        },
      ],
    },
  });
}

/* =========================================================
   UNCLAIM
========================================================= */

export async function unclaimLeadService(
  id: string,
  adminId: string
) {
  const before = await getLeadById(id);
  if (!before) return;

  await updateLead(id, {
    owner: { disconnect: true },
    claimedAt: null,
    status: LeadStatus.NEW,
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "LEAD",
    entityId: id,
    entityLabel: `Lead: ${before.email}`,
    metadata: {
      type: "UPDATE",
      changes: [
        {
          field: "ownerId",
          from: before.ownerId,
          to: null,
        },
        {
          field: "status",
          from: before.status,
          to: LeadStatus.NEW,
        },
      ],
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
  const before = await getLeadById(id);
  if (!before) return;

  await updateLead(id, { status });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "LEAD",
    entityId: id,
    entityLabel: `Lead: ${before.email}`,
    metadata: {
      type: "UPDATE",
      changes: [
        {
          field: "status",
          from: before.status,
          to: status,
        },
      ],
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
  const before = await getLeadById(leadId);
  if (!before) return;

  const nextStatus = toUserId ? LeadStatus.WARM : LeadStatus.NEW;

  await updateLead(leadId, {
    owner: toUserId
      ? { connect: { id: toUserId } }
      : { disconnect: true },
    status: nextStatus,
    claimedAt: toUserId ? new Date() : null,
  });

  await auditWithContext({
    actorId: adminId,
    action: "ADMIN_UPDATE",
    entityType: "LEAD",
    entityId: leadId,
    entityLabel: `Lead: ${before.email}`,
    metadata: {
      type: "UPDATE",
      changes: [
        {
          field: "ownerId",
          from: before.ownerId,
          to: toUserId,
        },
        {
          field: "status",
          from: before.status,
          to: nextStatus,
        },
      ],
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
    entityLabel: `Lead: ${lead?.email ?? "Unknown"}`,
    metadata: {
      type: "DELETE",
      snapshot: {
        email: lead?.email ?? null,
        name: lead?.name ?? null,
        status: lead?.status ?? null,
      },
    },
  });
}