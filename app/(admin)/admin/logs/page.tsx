import { prisma } from "@/lib/db/prisma";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function humanAction(action: string) {
  return action
    .replace("ADMIN_", "")
    .toLowerCase()
    .replace("_", " ");
}

function actionColor(a: string) {
  if (a.includes("DELETE")) return "text-red-400 bg-red-500/10";
  if (a.includes("PUBLISH")) return "text-green-400 bg-green-500/10";
  if (a.includes("UPDATE")) return "text-blue-400 bg-blue-500/10";
  return "text-yellow-400 bg-yellow-500/10";
}

export default async function AdminLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // soft fetch user emails (safe)
  const userIds = [...new Set(logs.map(l => l.actorId))];

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true, name: true },
  });

  const userMap = Object.fromEntries(
    users.map(u => [u.id, u])
  );

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Admin Logs</h1>
        <p className="text-sm text-muted-foreground">
          Audit trail of system activity
        </p>
      </div>

      <div className="space-y-3">
        {logs.map(l => {
          const actor = userMap[l.actorId];

          return (
            <div
              key={l.id}
              className="rounded-2xl border border-border/40 p-4 bg-background/40"
            >
              <div className="flex justify-between gap-2 flex-wrap">

                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${actionColor(
                      l.action
                    )}`}
                  >
                    {humanAction(l.action)}
                  </span>

                  <span className="font-medium">
                    {l.entityType}
                  </span>

                  {l.entityId && (
                    <span className="text-muted-foreground">
                      ({l.entityId.slice(0, 8)}…)
                    </span>
                  )}
                </div>

                <span className="text-xs text-muted-foreground">
                  {formatDate(l.createdAt)}
                </span>
              </div>

              <div className="mt-2 text-sm">
                👤 {actor?.email ?? "Unknown user"}
                {actor?.name && (
                  <span className="text-muted-foreground">
                    {" "}({actor.name})
                  </span>
                )}
              </div>

              {l.ip && (
                <div className="text-xs text-muted-foreground mt-1">
                  🌐 {l.ip}
                </div>
              )}

              {l.metadata && Object.keys(l.metadata as any).length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-primary">
                    View details
                  </summary>

                  <pre className="mt-2 rounded-xl bg-muted p-3 text-xs">
{JSON.stringify(l.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
