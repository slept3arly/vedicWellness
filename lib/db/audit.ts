import "server-only";
import { prisma } from "@/lib/db/prisma";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { normalizePagination } from "@/lib/db/pagination";

/* =========================================================
   ADMIN AUDIT LOGS (READ ONLY)
========================================================= */

export async function getAdminAuditLogs(
  page = 1,
  limit = ADMIN_PAGE_SIZE
) {
  const pagination = normalizePagination(page, limit, ADMIN_PAGE_SIZE);
  page = pagination.page;
  limit = pagination.limit;
  const skip = (page - 1) * limit;

  const [logs, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.auditLog.count(),
  ]);

  // ✅ Minimal join (no reshaping abuse)
  const userIds = [...new Set(logs.map((l) => l.actorId))];

  const users = userIds.length
    ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })
    : [];

  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  return {
    data: logs.map((log) => ({
      ...log,
      actor: userMap[log.actorId] ?? null,
    })),
    total,
    page,
    limit,
  };
}
