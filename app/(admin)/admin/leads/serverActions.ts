"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { assertSameOriginAction } from "@/lib/security/csrf";
import { auditLog } from "@/lib/observability/audit";

import { LeadStatus } from "@prisma/client";

async function getRequestContext() {
  const h = await headers();
  return {
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: h.get("user-agent") ?? null,
  };
}

/* =====================
   CLAIM LEAD
===================== */
export async function claimLead(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  await prisma.lead.update({
    where: { id },
    data: {
      ownerId: admin.id,
      status: LeadStatus.WARM, // modern flow
      claimedAt: new Date(),
    },
  });

  const ctx = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_UPDATE",
    entityType: "LEAD",
    entityId: id,
    ...ctx,
    metadata: { kind: "LEAD", action: "CLAIM" },
  });

  revalidatePath("/admin/leads");
}

/* =====================
   UNCLAIM LEAD
===================== */
export async function unclaimLead(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  await prisma.lead.update({
    where: { id },
    data: {
      ownerId: null,
      claimedAt: null,
      status: LeadStatus.NEW,
    },
  });

  const ctx = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_UPDATE",
    entityType: "LEAD",
    entityId: id,
    ...ctx,
    metadata: { kind: "LEAD", action: "UNCLAIM" },
  });

  revalidatePath("/admin/leads");
}

/* =====================
   UPDATE STATUS
===================== */
export async function updateLeadStatus(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as LeadStatus;

  await prisma.lead.update({
    where: { id },
    data: { status },
  });

  const ctx = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_UPDATE",
    entityType: "LEAD",
    entityId: id,
    ...ctx,
    metadata: { kind: "LEAD", status },
  });

  revalidatePath("/admin/leads");
}

/* =====================
   DELETE LEAD
===================== */
export async function deleteLead(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  const lead = await prisma.lead.findUnique({ where: { id } });
  await prisma.lead.delete({ where: { id } });

  const ctx = await getRequestContext();
  await auditLog({
    actorId: admin.id,
    action: "ADMIN_DELETE",
    entityType: "LEAD",
    entityId: id,
    ...ctx,
    metadata: {
      kind: "LEAD",
      email: lead?.email ?? null,
      name: lead?.name ?? null,
    },
  });

  revalidatePath("/admin/leads");
}

/* =====================
   ASSIGN / UNASSIGN
===================== */
export async function assignLead(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const leadId = String(formData.get("leadId") ?? "");
  const toUserId = String(formData.get("toUserId") ?? "");

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      ownerId: toUserId || null,
      status: toUserId ? LeadStatus.WARM : LeadStatus.NEW,
      claimedAt: toUserId ? new Date() : null,
    },
  });

  revalidatePath("/admin/leads");
}
