// lib/services/auditService.ts

import { getAdminAuditLogs } from "@/lib/db/audit";

export async function getAdminAuditLogsService(
  page = 1,
  limit = 25
) {
  const result = await getAdminAuditLogs(page, limit);

  return {
    logs: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}