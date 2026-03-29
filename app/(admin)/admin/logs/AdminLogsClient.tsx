"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

/* COMPONENTS */
import AdminCard from "@/components/admin/AdminCard";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminButton from "@/components/admin/AdminButton";
import PageHeader from "@/components/public/ui/PageHeader";

/* CONSTANTS & UTILS */
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { 
  User, Clock, Globe, Hash, RefreshCw, 
  FileText, Trash2, Pencil, PlusCircle, Download 
} from "lucide-react";
import { cn } from "@/lib/cn";

function formatDate(d: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit", month: "short", year: "numeric", 
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(d));
}

// Map database actions to the NEW specialized Audit Log tags
function getActionTheme(action: string): { icon: any; status: any } {
  if (action.includes("DELETE")) return { icon: Trash2, status: "DELETED" };
  if (action.includes("UPDATE")) return { icon: Pencil, status: "UPDATED" };
  if (action.includes("CREATE")) return { icon: PlusCircle, status: "CREATED" };
  return { icon: FileText, status: "VIEWER" };
}

export default function AdminLogsClient({ 
  logs = [], total, page 
}: { 
  logs: any[]; total: number; page: number; 
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE);

  const handleSync = () => startTransition(() => router.refresh());
  const handlePageChange = (p: number) => startTransition(() => router.push(`?page=${p}`));

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-6 pb-12">
      
      {/* 1. HEADER + ACTION BAR SYSTEM */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-4">
        
        {/* LEFT ALIGNED HEADER (Strict Requirement) */}
        <PageHeader 
          title="Activity Log" 
          subtitle="System-wide audit trail" 
          align="left" 
          className="max-w-none m-0 p-0"
        />

        {/* RIGHT ALIGNED ACTIONS */}
        <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
          
          {/* TOP ROW: Pagination + Sync */}
          <div className="flex items-center gap-2">
            <AdminPagination 
              page={page} totalPages={totalPages} 
              isPending={isPending} onPageChange={handlePageChange} 
            />
            
            <AdminButton 
              onClick={handleSync} 
              disabled={isPending}
              icon={() => (
                <RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />
              )}
            >
              Sync
            </AdminButton>
          </div>

          {/* SECOND ROW: Primary Action Button */}
          <AdminButton 
            variant="primary" 
            icon={Download} 
            className="w-full sm:min-w-[215px]" 
          >
            Export Logs
          </AdminButton>
        </div>
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800" />

      {/* 2. GLOBAL GRID SYSTEM (3-2-1) */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isPending ? "opacity-50" : ""}`}>
        {logs.map((l, idx) => {
          const theme = getActionTheme(l.action);
          const displayIndex = (page - 1) * ADMIN_PAGE_SIZE + (idx + 1);

          return (
            <AdminCard 
              key={l.id} 
              compact 
              index={displayIndex}
              className="group border-t-4 border-t-neutral-200 dark:border-t-neutral-700 hover:border-t-primary/50 transition-colors"
            >
              {/* Card Header: Action Type + Specialized Badge */}
              <div className="flex justify-between items-start pr-8">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                    <theme.icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-tight">
                    {l.action.replace("ADMIN_", "").replace("_", " ")}
                  </span>
                </div>
                <AdminBadge status={theme.status} />
              </div>

              {/* Target Entity Box */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">Target</span>
                <p className="text-sm font-bold truncate text-neutral-700 dark:text-neutral-200">
                  {l.entityLabel || l.entityId}
                </p>
              </div>

              {/* Actor & Timestamp Details */}
              <div className="grid grid-cols-2 gap-4 py-1">
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Actor</span>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold truncate">
                    <User className="h-3 w-3 text-neutral-400" /> 
                    {l.actor?.email?.split('@')[0] || "System"}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Time</span>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold truncate">
                    <Clock className="h-3 w-3 text-neutral-400" /> 
                    {formatDate(l.createdAt)}
                  </div>
                </div>
              </div>

              {/* Card Footer: System IDs & IP */}
              <div className="flex justify-between items-center text-[9px] text-neutral-400 font-mono pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-1.5">
                  <Hash className="h-2.5 w-2.5" /> 
                  <span className="select-all opacity-70 hover:opacity-100">{l.id.slice(-8)}</span>
                </div>
                {l.ip && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-2.5 w-2.5" /> 
                    <span>{l.ip}</span>
                  </div>
                )}
              </div>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}