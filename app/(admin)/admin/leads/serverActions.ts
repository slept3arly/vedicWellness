"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { assertSameOriginAction } from "@/lib/security/csrf";

import {
  parseLeadId,
  parseLeadStatus,
  parseAssignLead,
} from "@/lib/validators/lead";

import {
  claimLeadService,
  unclaimLeadService,
  updateLeadStatusService,
  deleteLeadService,
  assignLeadService,
} from "@/lib/services/leadService";

export async function claimLead(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = parseLeadId(formData);

  await claimLeadService(id, admin.id);

  revalidatePath("/admin/leads");
}

export async function unclaimLead(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = parseLeadId(formData);

  await unclaimLeadService(id, admin.id);

  revalidatePath("/admin/leads");
}

export async function updateLeadStatus(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = parseLeadId(formData);
  const status = parseLeadStatus(formData);

  await updateLeadStatusService(id, status, admin.id);

  revalidatePath("/admin/leads");
}

export async function deleteLead(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();

  const id = parseLeadId(formData);

  await deleteLeadService(id, admin.id);

  revalidatePath("/admin/leads");
}

export async function assignLead(formData: FormData) {
  await assertSameOriginAction();
  await requireAdmin();

  const { leadId, toUserId } = parseAssignLead(formData);

  await assignLeadService(leadId, toUserId);

  revalidatePath("/admin/leads");
}
