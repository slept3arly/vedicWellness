"use client";

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

/* ------------------------------------------------------------------ */

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
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

/* ------------------------------------------------------------------ */

export default function AdminLogsClient({
  logs,
  userMap,
}: {
  logs: any[];
  userMap: Record<string, any>;
}) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <p className="text-sm text-neutral-500">Recent admin actions</p>
      </div>

      {/* ── Log List ── */}
      <div className="space-y-3">
        {logs.length === 0 ? (
          <AdminCard className="py-16 flex flex-col items-center gap-2">
            <FileText className="h-8 w-8 text-neutral-300" />
            <p className="font-medium text-neutral-500">No activity yet</p>
          </AdminCard>
        ) : (
          logs.map((l, index) => {
            const actor = userMap[l.actorId];
            const Icon = actionIcon(l.action);

            return (
              <AdminCard
                key={l.id}
                className="flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
              >
                {/* ── Left: index + icon ── */}
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 shrink-0">
                  <span className="text-xs text-neutral-400 tabular-nums w-5 text-center">
                    {index + 1}
                  </span>
                  <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 shrink-0">
                    <Icon className="h-5 w-5 text-neutral-500" />
                  </div>
                </div>

                {/* ── Middle: action + meta ── */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <h2 className="font-semibold text-base leading-snug capitalize">
                      {humanAction(l.action)} {l.entityType.toLowerCase()}
                    </h2>
                    {actor && (
                      <p className="text-xs text-neutral-500 mt-0.5">
                        by {actor.email}{actor.name ? ` (${actor.name})` : ""}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
                    <Meta label="Entity">
                      <Layers className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{l.entityType}</span>
                    </Meta>

                    {l.entityId && (
                      <Meta label="ID">
                        <Hash className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate font-mono text-xs">{l.entityId}</span>
                      </Meta>
                    )}

                    <Meta label="Actor">
                      <User className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{actor?.email ?? "Unknown"}</span>
                    </Meta>

                    <Meta label="Time">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{formatDate(l.createdAt)}</span>
                    </Meta>

                    {l.ip && (
                      <Meta label="IP">
                        <Globe className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate font-mono text-xs">{l.ip}</span>
                      </Meta>
                    )}
                  </div>

                  {l.metadata && Object.keys(l.metadata).length > 0 && (
                    <details className="pt-1">
                      <summary className="cursor-pointer text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                        View technical details
                      </summary>
                      <pre className="mt-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3 text-xs overflow-x-auto">
{JSON.stringify(l.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>

              </AdminCard>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium mb-0.5">
        {label}
      </div>
      <div className="flex items-center gap-1 text-sm text-neutral-800 dark:text-neutral-100 min-w-0">
        {children}
      </div>
    </div>
  );
}