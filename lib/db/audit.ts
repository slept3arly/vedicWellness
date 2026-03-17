import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getAdminAuditLogs(
  page = 1,
  limit = 25
) {
  const skip = (page - 1) * limit;

  const [logs, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.auditLog.count(),
  ]);

  // ✅ safer userIds extraction
  const userIds = [
    ...new Set(logs.map((l) => l.actorId).filter(Boolean)),
  ];

  let userMap: Record<string, { id: string; name: string | null; email: string }> = {};

  if (userIds.length > 0) {
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  }

  return {
    data: logs.map((log) => ({
      ...log,
      actor: userMap[log.actorId] || null,
    })),
    total,
    page,
    limit,
  };
}