import { auditLog, AuditEvent } from "@/lib/observability/audit";
import { getRequestContext } from "@/lib/utils/requestContext";

export async function auditWithContext(
  event: AuditEvent
) {
  const ctx = await getRequestContext();

  return auditLog({
    ...event,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });
}