import { getRecentAuditLogs } from "@/lib/db/audit";
import AdminCard from "../../../../components/admin/AdminCard";
import {
  Trash2,
  Pencil,
  Eye,
  PlusCircle,
  User,
  Clock,
  Globe,
  FileText,
  Hash,
  Layers,
} from "lucide-react";

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
  return action.replace("ADMIN_", "").replaceAll("_", " ").toLowerCase();
}

function actionIcon(action: string) {
  if (action.includes("DELETE")) return Trash2;
  if (action.includes("UPDATE")) return Pencil;
  if (action.includes("PUBLISH")) return Eye;
  if (action.includes("CREATE")) return PlusCircle;
  return FileText;
}

export default async function AdminLogsPage() {
  const { logs, userMap } = await getRecentAuditLogs(200);

  return (
    <div className="max-w-5xl mx-auto space-y-5 px-4">
      <h1 className="text-2xl font-bold">Activity Log</h1>

      {logs.map(l => {
        const actor = userMap[l.actorId];
        const Icon = actionIcon(l.action);

        return (
          <AdminCard key={l.id} className="space-y-4">

            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-neutral-600 mt-1" />
                <div>
                  <div className="font-semibold capitalize">
                    {humanAction(l.action)} {l.entityType.toLowerCase()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                    <Layers className="h-4 w-4" />
                    {l.entityType}
                    {l.entityId && (
                      <>
                        <Hash className="h-4 w-4 ml-2" />
                        <span className="break-all">{l.entityId}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-sm text-neutral-500">
                <Clock className="h-4 w-4" />
                {formatDate(l.createdAt)}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <User className="h-4 w-4" />
              {actor?.email ?? "Unknown user"}
              {actor?.name && (
                <span className="text-neutral-500">({actor.name})</span>
              )}
            </div>

            {l.ip && (
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Globe className="h-4 w-4" />
                {l.ip}
              </div>
            )}

            {l.metadata && Object.keys(l.metadata as any).length > 0 && (
              <details className="pt-2">
                <summary className="cursor-pointer text-sm text-neutral-600 hover:underline">
                  View technical details
                </summary>
                <pre className="mt-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-3 text-xs overflow-x-auto">
{JSON.stringify(l.metadata, null, 2)}
                </pre>
              </details>
            )}
          </AdminCard>
        );
      })}
    </div>
  );
}
