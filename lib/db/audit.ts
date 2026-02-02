import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getRecentAuditLogs(
  page = 1,
  limit = 50
) {
  const skip = (page - 1) * limit;

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    skip,
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
