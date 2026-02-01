import { z } from "zod";
import { LeadStatus } from "@prisma/client";

export const LeadIdSchema = z.string().min(1);

export const LeadStatusSchema = z.nativeEnum(LeadStatus);

export function parseLeadId(formData: FormData, key = "id") {
  return LeadIdSchema.parse(String(formData.get(key) ?? "").trim());
}

export function parseLeadStatus(formData: FormData) {
  return LeadStatusSchema.parse(
    String(formData.get("status") ?? "").trim()
  );
}

export function parseAssignLead(formData: FormData) {
  return {
    leadId: LeadIdSchema.parse(String(formData.get("leadId") ?? "")),
    toUserId: String(formData.get("toUserId") ?? "").trim() || null,
  };
}
