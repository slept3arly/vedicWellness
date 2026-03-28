"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import AdminCard from "../../../../components/admin/AdminCard";
import PageHeader from "@/components/public/ui/PageHeader";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */

function formatDate(d: string | Date) {
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

/* =========================================================
   METADATA RENDERING
========================================================= */

function renderMetadata(meta: any) {
  if (!meta) return null;

  /* UPDATE → show diff */
  if (meta.type === "UPDATE" && Array.isArray(meta.changes)) {
    return (
      <div className="space-y-1 text-xs">
        {meta.changes.map((c: any, i: number) => (
          <div key={i} className="flex gap-2">
            <span className="font-medium text-neutral-500">{c.field}:</span>
            <span className="text-red-500 line-through">
              {String(c.from ?? "—")}
            </span>
            <span>→</span>
            <span className="text-green-600">
              {String(c.to ?? "—")}
            </span>
          </div>
        ))}
      </div>
    );
  }

  /* CREATE / DELETE → snapshot */
  if (meta.snapshot) {
    return (
      <div className="text-xs text-neutral-600 dark:text-neutral-300">
        {Object.entries(meta.snapshot).map(([k, v]) => (
          <div key={k}>
            <span className="font-medium">{k}:</span>{" "}
            {String(v ?? "—")}
          </div>
        ))}
      </div>
    );
  }

  /* fallback */
  return (
    <pre className="text-xs bg-neutral-100 dark:bg-neutral-800 p-2 rounded">
      {JSON.stringify(meta, null, 2)}
    </pre>
  );
}

/* ------------------------------------------------------------------ */

export default function AdminLogsClient({
  logs = [],
  total,
  page,
}: {
  logs: any[];
  total: number;
  page: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const LIMIT = ADMIN_PAGE_SIZE;
  const totalPages = Math.ceil(total / LIMIT);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    startTransition(() => {
      router.push(`?page=${newPage}`);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      <PageHeader
        title="Activity Log"
        subtitle="Recent admin actions"
      />

      <div className="flex justify-between items-center text-xs text-neutral-400 px-1">
        <span>
          Showing {logs.length} of {total} events
        </span>
        <span>Page {page} of {totalPages || 1}</span>
      </div>

      <div className={`space-y-3 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
        {logs.length === 0 ? (
          <AdminCard className="py-16 flex flex-col items-center gap-2">
            <FileText className="h-8 w-8 text-neutral-300" />
            <p className="font-semibold text-neutral-500">No activity yet</p>
          </AdminCard>
        ) : (
          logs.map((l, index) => {
            const Icon = actionIcon(l.action);
            const actorEmail = l.actor?.email || "System";

            return (
              <AdminCard key={l.id} className="flex flex-col gap-4">

                {/* Header */}
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-neutral-500" />
                  <h3 className="font-semibold capitalize">
                    {humanAction(l.action)}{" "}
                    <span className="text-neutral-500">
                      {l.entityLabel || l.entityType}
                    </span>
                  </h3>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">

                  <Meta label="Actor">
                    <User className="h-3.5 w-3.5" />
                    {actorEmail}
                  </Meta>

                  <Meta label="Time">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(l.createdAt)}
                  </Meta>

                  {l.entityId && (
                    <Meta label="ID">
                      <Hash className="h-3.5 w-3.5" />
                      {l.entityId}
                    </Meta>
                  )}

                  {l.ip && (
                    <Meta label="IP">
                      <Globe className="h-3.5 w-3.5" />
                      {l.ip}
                    </Meta>
                  )}
                </div>

                {/* Metadata */}
                {l.metadata && (
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                    {renderMetadata(l.metadata)}
                  </div>
                )}

              </AdminCard>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 pt-4 pb-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || isPending}
          >
            <ChevronLeft />
          </button>

          <span>{page} / {totalPages}</span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || isPending}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Meta({ label, children }: any) {
  return (
    <div>
      <div className="text-xs text-neutral-400">{label}</div>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}