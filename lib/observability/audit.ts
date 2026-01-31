import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/observability/logger";
import { captureError } from "@/lib/observability/sentry";

export type AuditAction =
  | "ADMIN_CREATE"
  | "ADMIN_UPDATE"
  | "ADMIN_DELETE"
  | "ADMIN_PUBLISH"
  | "ADMIN_UNPUBLISH"
  | "ROLE_CHANGE"
  | "SETTINGS_UPDATE"
  | "LOGIN"
  | "LOGOUT";

export type AuditEntityType =
  | "BLOG"
  | "PRODUCTS"
  | "PAGE"
  | "USER"
  | "SETTINGS"
  | "LEAD"
  | "MARQUEE"
  | "OTHER";

export type AuditEvent = {
  actorId: string; // required
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string | null;
  entityLabel?: string;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Prisma.InputJsonValue;
};

export async function auditLog(event: AuditEvent) {
  console.log("AUDIT EVENT:", event); // 👈 add this
  try {const label =
  event.entityLabel ??
  (typeof event.metadata === "object" && event.metadata !== null
    ? (event.metadata as any).name ??
      (event.metadata as any).title ??
      (event.metadata as any).email ??
      null
    : null);

await prisma.auditLog.create({
  data: {
    actorId: event.actorId,
    action: event.action,
    entityType: event.entityType,
    entityId: event.entityId ?? null,
    entityLabel: label,
    ip: event.ip ?? null,
    userAgent: event.userAgent ?? null,
    metadata: event.metadata ?? {},
  },
});


    logger.info("audit_log", { scope: "audit", userId: event.actorId }, {
      action: event.action,
      entityType: event.entityType,
      entityId: event.entityId ?? null,
    });
  } catch (err) {
    // audit logging should never block the app
    logger.error("audit_log_failed", { scope: "audit", userId: event.actorId }, {
      error: String(err),
    });
    captureError(err, { auditEvent: event });
  }
}
