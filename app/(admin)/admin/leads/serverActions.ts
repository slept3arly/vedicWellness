"use server";

import { revalidatePath } from "next/cache";

import { secureAdminAction } from "@/lib/security/secureAdminAction";

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
  getAdminLeadsService
} from "@/lib/services/leadService";

export const claimLead = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseLeadId(formData);

    await claimLeadService(id, admin.id);

    revalidatePath("/admin/leads");
  }
);

export const unclaimLead = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseLeadId(formData);

    await unclaimLeadService(id, admin.id);

    revalidatePath("/admin/leads");
  }
);

export const updateLeadStatus = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseLeadId(formData);
    const status = parseLeadStatus(formData);

    await updateLeadStatusService(id, status, admin.id);

    revalidatePath("/admin/leads");
  }
);

export const deleteLead = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseLeadId(formData);

    await deleteLeadService(id, admin.id);

    revalidatePath("/admin/leads");
  }
);

export const assignLead = secureAdminAction(
  async (_admin, formData: FormData) => {
    const { leadId, toUserId } = parseAssignLead(formData);

    await assignLeadService(leadId, toUserId);

    revalidatePath("/admin/leads");
  }
);

export async function getAdminLeadsAction(
  page = 1,
  limit = 25,
  q = ""
) {
  return getAdminLeadsService(page, limit, q);
}