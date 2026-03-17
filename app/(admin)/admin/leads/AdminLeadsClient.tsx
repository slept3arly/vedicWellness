"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import AdminCard from "../../../../components/admin/AdminCard";
import AdminActionButton from "../../../../components/admin/AdminActionButton";
import AdminBadge from "../../../../components/admin/AdminBadge";
import PageHeader from "@/components/public/ui/PageHeader";
import { updateLeadStatus, deleteLead, assignLead } from "./serverActions";

/* ------------------------------------------------------------------ */

function formatDate(d?: string | Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

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

  const LIMIT = 25;
  const totalPages = Math.ceil(total / LIMIT);

  function updateParams(newParams: Record<string, string>) {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    p.set("page", page.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) p.set(key, value);
      else p.delete(key);
    });

    startTransition(() => {
      router.push(`?${p.toString()}`);
    });
  }

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const query = (fd.get("query") as string).trim();
    
    const p = new URLSearchParams();
    p.set("page", "1");
    if (query) p.set("q", query);
    
    startTransition(() => router.push(`?${p.toString()}`));
  }

  const handleClear = () => {
    setInputValue("");
    startTransition(() => router.push("?page=1"));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateParams({ page: newPage.toString() });
  };

  const filtered = useMemo(() => {
    return leads.filter((l: any) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (claimFilter === "unclaimed" && l.ownerId) return false;
      if (claimFilter !== "__all" && claimFilter !== "unclaimed" && l.ownerId !== claimFilter) return false;
      return true;
    });
  }, [leads, statusFilter, claimFilter]);

  const STATUSES = ["NEW", "HOT", "WARM", "CONVERTED", "LOST", "USELESS"];

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      {/* ── Header ── */}
      <PageHeader 
        title="Leads" 
        subtitle="Manage and track inquiries" 
      />

      {/* ── Search + Filters bar ── */}
      <AdminCard className="p-3">
        <form onSubmit={handleFilter} className="flex flex-col gap-2">

          {/* Row 1: search input */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              name="query"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search by name or email..."
              className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm focus:ring-2 focus:ring-black outline-none"
            />
            {(inputValue || q) && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Row 2: status filters + claim select + search button */}
          <div className="flex gap-2 flex-wrap items-center">
            <div className="flex gap-1.5 flex-1 flex-wrap">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(statusFilter === s ? null : s)}
                  className={`px-3 h-10 rounded-lg text-sm font-medium border transition-colors ${
                    statusFilter === s
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                      : "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {s}
                </button>
              ))}
              {(statusFilter || claimFilter !== "__all") && (
                <button
                  type="button"
                  onClick={() => { setStatusFilter(null); setClaimFilter("__all"); }}
                  className="px-3 h-10 rounded-lg text-sm border border-neutral-300 dark:border-neutral-700 text-neutral-400 hover:text-neutral-700 transition flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 h-10 shrink-0">
              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <select
                value={claimFilter}
                onChange={(e) => setClaimFilter(e.target.value)}
                className="bg-transparent text-sm outline-none cursor-pointer"
              >
                <option value="__all">All owners</option>
                <option value="unclaimed">Unclaimed</option>
                {salesUsers.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.email}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="h-10 px-5 shrink-0 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity flex items-center gap-2"
            >
              <Search className="h-3.5 w-3.5" />
              Search
            </button>
          </div>

        </form>

        <div className="mt-2 text-xs text-neutral-400 flex justify-between px-0.5">
          <span>
            Showing {filtered.length} of {total} result{total !== 1 ? "s" : ""}
            {q && <> for "<span className="text-neutral-600 dark:text-neutral-300 font-medium">{q}</span>"</>}
            {statusFilter && <> · <span className="text-neutral-600 dark:text-neutral-300 font-medium">{statusFilter}</span></>}
          </span>
          <span>Page {page} of {totalPages || 1}</span>
        </div>
      </AdminCard>

      {/* ── Leads List ── */}
      <div className={`space-y-3 transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
        {filtered.length === 0 ? (
          <AdminCard className="py-16 flex flex-col items-center gap-2">
            <User className="h-8 w-8 text-neutral-300" />
            <p className="font-semibold text-neutral-500">No leads found</p>
            <button onClick={handleClear} className="text-sm text-neutral-400 underline underline-offset-2 hover:text-black dark:hover:text-white">
              Clear search
            </button>
          </AdminCard>
        ) : (
          filtered.map((lead: any, index: number) => (
            <AdminCard
              key={lead.id}
              className="flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
            >
              {/* ── Left: index + icon ── */}
              <div className="flex sm:flex-col items-center gap-3 sm:gap-2 shrink-0">
                <span className="text-xs text-neutral-400 tabular-nums w-5 text-center">
                  {(page - 1) * LIMIT + index + 1}
                </span>
                <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 shrink-0">
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
              </div>

              {/* ── Middle: info + meta + message + actions ── */}
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-xl font-semibold leading-snug">{lead.name}</h3>
                    <AdminBadge status={lead.status} />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">{lead.email}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
                  <Meta label="Email">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{lead.email}</span>
                  </Meta>
                  <Meta label="Phone">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{lead.phone || "—"}</span>
                  </Meta>
                  <Meta label="Location">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{lead.location || "—"}</span>
                  </Meta>
                  <Meta label="Received">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{formatDate(lead.createdAt)}</span>
                  </Meta>
                </div>

                {lead.message && (
                  <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {lead.message}
                  </div>
                )}

                {/* Assign + Status forms */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <form action={assignLead} className="flex items-center gap-2">
                    <input type="hidden" name="leadId" value={lead.id} />
                    <User className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <select
                      name="toUserId"
                      defaultValue={lead.ownerId || ""}
                      className="h-8 rounded-lg px-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 outline-none"
                    >
                      <option value="">Unclaimed</option>
                      {salesUsers.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.email}</option>
                      ))}
                    </select>
                    <AdminActionButton className="h-8 text-xs px-2 justify-center">
                      <Save className="h-3 w-3" /> Assign
                    </AdminActionButton>
                  </form>

                  <form action={updateLeadStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={lead.id} />
                    <Flame className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <select
                      name="status"
                      defaultValue={lead.status}
                      className="h-8 rounded-lg px-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 outline-none"
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <AdminActionButton className="h-8 text-xs px-2 justify-center">
                      <Save className="h-3 w-3" /> Update
                    </AdminActionButton>
                  </form>
                </div>
              </div>

              {/* ── Right: delete ── */}
              <div className="flex sm:flex-col gap-2 shrink-0 sm:w-36">
                <form
                  action={deleteLead}
                  className="w-full"
                  onSubmit={(e) => { if (!confirm("Delete this lead permanently?")) e.preventDefault(); }}
                >
                  <input type="hidden" name="id" value={lead.id} />
                  <AdminActionButton variant="danger" className="w-full justify-center">
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </AdminActionButton>
                </form>
              </div>

            </AdminCard>
          ))
        )}
      </div>

      {/* ── Pagination Controls ── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4 pb-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || isPending}
            className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || isPending}
            className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
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