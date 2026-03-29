"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/* ICONS */
import {
  Search,
  X,
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  Flame,
  Save,
  Trash2,
  RefreshCw,
  Hash,
  MessageSquare,
} from "lucide-react";

/* COMPONENTS */
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminPagination from "@/components/admin/AdminPagination";
import PageHeader from "@/components/public/ui/PageHeader";

/* UTILS */
import { cn } from "@/lib/cn";
import { updateLeadStatus, deleteLead, assignLead } from "./serverActions";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

/* ------------------------------------------------------------------ */

export default function AdminLeadsClient({
  leads = [],
  salesUsers = [],
  page,
  total,
  q,
}: {
  leads: any[];
  salesUsers: any[];
  page: number;
  total: number;
  q: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [inputValue, setInputValue] = useState(q);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [claimFilter, setClaimFilter] = useState("__all");
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE);

  function setLoading(id: string, value: boolean) {
    setLoadingMap((prev) => ({ ...prev, [id]: value }));
  }

  const handleSync = () => startTransition(() => router.refresh());

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", p.toString());
    startTransition(() => router.push(`?${params.toString()}`));
  };

  const handleClear = () => {
    setInputValue("");
    setStatusFilter(null);
    setClaimFilter("__all");
    startTransition(() => router.push("?page=1"));
  };

  const filtered = useMemo(() => {
    return leads.filter((l: any) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (claimFilter === "unclaimed" && l.ownerId) return false;
      if (claimFilter !== "__all" && claimFilter !== "unclaimed" && l.ownerId !== claimFilter)
        return false;
      return true;
    });
  }, [leads, statusFilter, claimFilter]);

  const STATUSES = ["NEW", "HOT", "WARM", "CONVERTED", "LOST", "USELESS"];

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pb-12">

      {/* 1. GLOBAL HEADER SYSTEM */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-4">
        <PageHeader
          title="Leads Management"
          subtitle={`Track and manage customer inquiries (${total})`}
          align="left"
          className="max-w-none m-0 p-0"
        />
        <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <AdminPagination
              page={page}
              totalPages={totalPages}
              isPending={isPending}
              onPageChange={handlePageChange}
            />
            <AdminButton
              onClick={handleSync}
              disabled={isPending}
              icon={({ className }) => (
                <RefreshCw className={cn(className, isPending && "animate-spin")} />
              )}
            >
              Sync
            </AdminButton>
          </div>
        </div>
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800" />

      {/* 2. SEARCH & FILTER SYSTEM */}
      <AdminCard compact className="!p-3 border-dashed bg-neutral-50/50 dark:bg-neutral-900/50">
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`?q=${inputValue}&page=1`);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search leads by name or email..."
                className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {inputValue && (
                <X
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 cursor-pointer hover:text-red-500"
                  onClick={handleClear}
                />
              )}
            </div>
            <AdminButton type="submit" icon={Search}>
              Search
            </AdminButton>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-neutral-400 mr-1">Status:</span>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(statusFilter === s ? null : s)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-bold transition-all border",
                    statusFilter === s
                      ? "bg-black text-white border-black dark:bg-white dark:text-black"
                      : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-400"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 h-9">
              <User className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <select
                value={claimFilter}
                onChange={(e) => setClaimFilter(e.target.value)}
                className="bg-transparent text-xs font-bold outline-none cursor-pointer"
              >
                <option value="__all">ALL OWNERS</option>
                <option value="unclaimed">UNCLAIMED</option>
                {salesUsers.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.email.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* 3. GLOBAL GRID SYSTEM */}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", isPending && "opacity-50 pointer-events-none")}>
        {filtered.length === 0 ? (
          <div className="col-span-full">
            <AdminCard className="py-24 flex flex-col items-center justify-center text-center">
              <User className="h-10 w-10 text-neutral-300 mb-4" />
              <h3 className="text-lg font-bold">No leads found</h3>
              <p className="text-neutral-400 text-sm">Try adjusting your filters or clear the search.</p>
              <button onClick={handleClear} className="mt-4 text-xs underline text-neutral-500">Clear all filters</button>
            </AdminCard>
          </div>
        ) : (
          filtered.map((lead, idx) => {
            const displayIndex = (page - 1) * ADMIN_PAGE_SIZE + (idx + 1);

            return (
              <AdminCard
                key={lead.id}
                compact
                index={displayIndex}
                className="group flex flex-col gap-0 border-t-2 border-t-neutral-200 dark:border-t-neutral-700 hover:border-t-primary/60 transition-colors !p-0 overflow-hidden"
              >
                {/* ── TOP STRIP: badges + index ── */}
                <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
                  <div className="flex gap-1">
                    <AdminBadge status={lead.status} />
                    <AdminBadge status={lead.ownerId ? "ASSIGNED" : "UNCLAIMED"} />
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400">#{displayIndex}</span>
                </div>

                {/* ── IDENTITY BLOCK ── */}
                <div className="px-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="text-sm font-bold leading-tight text-neutral-900 dark:text-neutral-100 truncate">
                    {lead.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Mail className="h-2.5 w-2.5 shrink-0 text-neutral-400" />
                    <span className="text-[10px] text-neutral-500 truncate">{lead.email}</span>
                  </div>
                </div>

                {/* ── META GRID: 4 fields in 2×2 ── */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                  {/* Phone */}
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-2.5 w-2.5 shrink-0 text-neutral-400" />
                    <div>
                      <div className="text-[8px] uppercase tracking-wider text-neutral-400 font-semibold leading-none mb-0.5">Phone</div>
                      <div className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 leading-none">{lead.phone || "—"}</div>
                    </div>
                  </div>
                  {/* Received */}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-2.5 w-2.5 shrink-0 text-neutral-400" />
                    <div>
                      <div className="text-[8px] uppercase tracking-wider text-neutral-400 font-semibold leading-none mb-0.5">Received</div>
                      <div className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 leading-none">
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </div>
                    </div>
                  </div>
                  {/* City */}
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-2.5 w-2.5 shrink-0 text-neutral-400" />
                    <div>
                      <div className="text-[8px] uppercase tracking-wider text-neutral-400 font-semibold leading-none mb-0.5">Location</div>
                      <div className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 leading-none">{lead.city || "Remote"}</div>
                    </div>
                  </div>
                  {/* Owner */}
                  <div className="flex items-center gap-1.5">
                    <User className="h-2.5 w-2.5 shrink-0 text-neutral-400" />
                    <div>
                      <div className="text-[8px] uppercase tracking-wider text-neutral-400 font-semibold leading-none mb-0.5">Owner</div>
                      <div className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 leading-none truncate max-w-[80px]">
                        {lead.ownerId
                          ? (salesUsers.find((u: any) => u.id === lead.ownerId)?.email?.split("@")[0] || "Assigned")
                          : "Unclaimed"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── MESSAGE SNIPPET ── */}
                {lead.message && (
                  <div className="flex gap-1.5 px-3 py-1.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/30">
                    <MessageSquare className="h-2.5 w-2.5 shrink-0 text-neutral-400 mt-0.5" />
                    <p className="text-[10px] text-neutral-500 italic line-clamp-2 leading-relaxed">"{lead.message}"</p>
                  </div>
                )}

                {/* ── ACTIONS ── */}
                <div className="px-3 pt-2 pb-2.5 space-y-1.5">

                  {/* Row 1: Assign */}
                  <form
                    action={async (formData) => {
                      setLoading(lead.id, true);
                      await assignLead(formData);
                      setLoading(lead.id, false);
                    }}
                    className="flex gap-1.5"
                  >
                    <input type="hidden" name="leadId" value={lead.id} />
                    <select
                      name="toUserId"
                      defaultValue={lead.ownerId || ""}
                      className="flex-1 h-7 rounded-md px-2 text-[10px] font-bold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-primary/30"
                    >
                      <option value="">UNCLAIMED</option>
                      {salesUsers.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.email.split("@")[0].toUpperCase()}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={loadingMap[lead.id]}
                      className="h-7 px-2.5 rounded-md bg-primary text-white text-[10px] font-bold flex items-center gap-1 hover:bg-primary/90 disabled:opacity-50 transition-colors shrink-0"
                    >
                      <Save className="h-2.5 w-2.5" />
                      Assign
                    </button>
                  </form>

                  {/* Row 2: Status + Delete */}
                  <div className="flex gap-1.5">
                    {/* Status form */}
                    <form
                      action={async (formData) => {
                        setLoading(lead.id, true);
                        await updateLeadStatus(formData);
                        setLoading(lead.id, false);
                      }}
                      className="flex gap-1 flex-1"
                    >
                      <input type="hidden" name="id" value={lead.id} />
                      <select
                        name="status"
                        defaultValue={lead.status}
                        className="flex-1 h-7 rounded-md px-2 text-[10px] font-bold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-primary/30"
                      >
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <button
                        type="submit"
                        disabled={loadingMap[lead.id]}
                        title="Update status"
                        className="h-7 w-7 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex items-center justify-center hover:border-orange-400 hover:text-orange-500 disabled:opacity-50 transition-colors"
                      >
                        <Flame className="h-3 w-3" />
                      </button>
                    </form>

                    {/* Delete form */}
                    <form
                      action={deleteLead}
                      onSubmit={(e) => !confirm("Permanently delete this lead?") && e.preventDefault()}
                    >
                      <input type="hidden" name="id" value={lead.id} />
                      <button
                        type="submit"
                        className="h-7 px-2.5 rounded-md bg-red-500/10 text-red-500 border border-red-200 dark:border-red-900/50 text-[10px] font-bold flex items-center gap-1 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>

                {/* ── ID FOOTER ── */}
                <div className="flex items-center gap-1 px-3 py-1.5 bg-neutral-50/80 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800/80">
                  <Hash className="h-2 w-2 text-neutral-300" />
                  <span className="text-[8px] font-mono text-neutral-400 select-all">{lead.id.slice(-12)}</span>
                </div>
              </AdminCard>
            );
          })
        )}
      </div>
    </div>
  );
}