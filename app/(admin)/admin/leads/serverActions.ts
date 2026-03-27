"use server";

import { revalidateTag } from "next/cache";

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
} from "@/lib/services/admin/leadService";

/* =========================================================
   CLAIM
========================================================= */

export const claimLead = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseLeadId(formData);

    await claimLeadService(id, admin.id);

    revalidateTag("leads", "max");
  }
);

/* =========================================================
   UNCLAIM
========================================================= */

export const unclaimLead = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseLeadId(formData);

    await unclaimLeadService(id, admin.id);

    revalidateTag("leads", "max");
  }
);

/* =========================================================
   STATUS UPDATE
========================================================= */

export const updateLeadStatus = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseLeadId(formData);
    const status = parseLeadStatus(formData);

    await updateLeadStatusService(id, status, admin.id);

    revalidateTag("leads", "max");
  }
);

/* =========================================================
   ASSIGN
========================================================= */

export const assignLead = secureAdminAction(
  async (admin, formData: FormData) => {
    const { leadId, toUserId } = parseAssignLead(formData);

    await assignLeadService(leadId, toUserId, admin.id);

    revalidateTag("leads", "max");
  }
);

/* =========================================================
   DELETE
========================================================= */

export const deleteLead = secureAdminAction(
  async (admin, formData: FormData) => {
    const id = parseLeadId(formData);

    await deleteLeadService(id, admin.id);

    revalidateTag("leads", "max");
  }
);