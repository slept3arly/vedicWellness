import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getRecentAuditLogs(limit = 200) {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const userIds = [...new Set(logs.map(l => l.actorId))];

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true, name: true },
  });

  const userMap = Object.fromEntries(users.map(u => [u.id, u]));

  return { logs, userMap };
}
