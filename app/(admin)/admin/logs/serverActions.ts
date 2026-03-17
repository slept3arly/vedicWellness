"use server";

import { getAdminAuditLogsService } from "@/lib/services/auditService";

export async function getAdminLogsAction(
  page = 1,
  limit = 25
) {
  return getAdminAuditLogsService(page, limit);
}