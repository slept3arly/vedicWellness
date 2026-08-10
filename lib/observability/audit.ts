import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/observability/logger";
import { captureError } from "@/lib/observability/sentry";

/* =========================================================
   TYPES
========================================================= */

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
  | "BANNER"
  | "SLIDE"
  | "ORDER"
  | "OTHER";

/* =========================================================
   STRUCTURED METADATA
========================================================= */

export type AuditMetadata = {
  type?: "CREATE" | "UPDATE" | "DELETE";

  changes?: {
    field: string;
    from: unknown;
    to: unknown;
  }[];

  snapshot?: Record<string, unknown>;

  context?: string;
};

/* =========================================================
   EVENT
========================================================= */

export type AuditEvent = {
  actorId: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string | null;
  entityLabel?: string;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: AuditMetadata;
};

/* =========================================================
   CORE LOGGER
========================================================= */

export async function auditLog(event: AuditEvent) {
  try {
    const label =
      event.entityLabel ??
      (event.metadata?.snapshot
        ? (event.metadata.snapshot as any).name ??
        (event.metadata.snapshot as any).title ??
        (event.metadata.snapshot as any).email ??
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
        metadata: (event.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });

    /* =====================================================
       AUTO PRUNE (KEEP ONLY LATEST 50)
    ===================================================== */

    const total = await prisma.auditLog.count();

    if (total > 50) {
      const excess = total - 50;

      const oldLogs = await prisma.auditLog.findMany({
        orderBy: { createdAt: "asc" },
        take: excess,
        select: { id: true },
      });

      await prisma.auditLog.deleteMany({
        where: {
          id: { in: oldLogs.map((l) => l.id) },
        },
      });
    }

    /* =====================================================
       LOG
    ===================================================== */

    logger.info(
      "audit_log",
      { scope: "audit", userId: event.actorId },
      {
        action: event.action,
        entityType: event.entityType,
        entityId: event.entityId ?? null,
      }
    );
  } catch (err) {
    logger.error(
      "audit_log_failed",
      { scope: "audit", userId: event.actorId },
      {
        error: String(err),
      }
    );

    captureError(err, { auditEvent: event });
  }
}
