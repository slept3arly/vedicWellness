"use client";

import { useMemo, useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
} from "lucide-react";

import AdminCard from "../../../../components/admin/AdminCard";
import AdminActionButton from "../../../../components/admin/AdminActionButton";
import AdminBadge from "../../../../components/admin/AdminBadge";

import { updateLeadStatus, deleteLead, assignLead } from "./serverActions";

export default function AdminLeadsClient({
  leads = [],
  salesUsers = [],
  page,
  q,
}: {
  leads: any[];
  salesUsers: any[];
  page: number;
  q: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  /* 🔍 NEW SEARCH STATE */
  const [search, setSearch] = useState(q);

  /* keep input synced with URL */
  useEffect(() => {
    setSearch(q);
  }, [q]);

  /* debounce + update URL */
  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== q) {
        const p = new URLSearchParams(params.toString());

        if (!search) p.delete("q");
        else p.set("q", search);

        p.set("page", "1");

        startTransition(() => {
          router.replace(`?${p.toString()}`);
        });
      }
    }, 500);

    return () => clearTimeout(t);
  }, [search, q, params, router]);

  /* EVERYTHING BELOW IS YOUR ORIGINAL CODE */

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [claimFilter, setClaimFilter] = useState("__all");

  const filtered = useMemo(() => {
    return leads.filter((l: any) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (claimFilter === "unclaimed" && l.ownerId) return false;
      if (
        claimFilter !== "__all" &&
        claimFilter !== "unclaimed" &&
        l.ownerId !== claimFilter
      )
        return false;

      return (
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [leads, search, statusFilter, claimFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Manage and track inquiries
        </p>
      </div>

      {/* 🔍 FIXED SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search leads..."
          className="
            h-12 w-full rounded-xl
            bg-white dark:bg-neutral-900/80
            pl-11 pr-4
            border border-neutral-300 dark:border-neutral-700
            focus:ring-2 focus:ring-black outline-none
          "
        />

        {isPending && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 animate-pulse">
            Searching...
          </span>
        )}
      </div>

      {/* Filters — unchanged */}
      <div className="flex flex-wrap items-center gap-2">

        <button
          onClick={() => {
            setStatusFilter(null);
            setClaimFilter("__all");
          }}
          className="px-3 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition"
        >
          <X size={20} />
        </button>

        {["NEW", "HOT", "WARM", "CONVERTED", "LOST", "USELESS"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? null : s)}
            className={`
              px-4 py-2 rounded-lg border transition
              ${
                statusFilter === s
                  ? "bg-emerald-500/30 border-emerald-500/40"
                  : "bg-white dark:bg-neutral-900/80 border-neutral-300 dark:border-neutral-700 hover:brightness-110"
              }
            `}
          >
            {s}
          </button>
        ))}

        <select
          value={claimFilter}
          onChange={(e) => setClaimFilter(e.target.value)}
          className="ml-auto rounded-lg px-2 py-2 bg-white dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-700"
        >
          <option value="__all">Claim status</option>
          <option value="unclaimed">Unclaimed</option>

          {salesUsers.map((u: any) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>
      </div>
<div
  className={`space-y-4 transition-opacity duration-200 ${
    isPending ? "opacity-60" : "opacity-100"
  }`}
>
      {/* Leads — unchanged */}
      {filtered.map((lead: any, i: number) => (
        <AdminCard
          key={lead.id}
          className="space-y-4 bg-white dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-700 hover:shadow-lg transition"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3 font-semibold text-lg">
              <span className="text-neutral-500">
                {(page - 1) * 25 + i + 1}.
              </span>
              {lead.name}
              <AdminBadge status={lead.status} />
            </div>

            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <Mail size={14} /> {lead.email}
            </div>

            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <Phone size={14} /> {lead.phone}
            </div>

            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <MapPin size={14} /> {lead.location || "—"}
            </div>
          </div>

          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg px-4 py-2 text-sm">
            {lead.message}
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Calendar size={14} />
            {new Date(lead.createdAt).toLocaleDateString()}
          </div>

          {/* Actions — unchanged */}
          <div className="flex flex-wrap gap-2 items-center pt-2">

            <form action={assignLead} className="flex items-center gap-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <User size={16} />

              <select
                name="toUserId"
                defaultValue={lead.ownerId || ""}
                className="rounded-lg px-3 py-2 bg-white dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-700"
              >
                <option value="">Unclaimed</option>
                {salesUsers.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.email}
                  </option>
                ))}
              </select>

              <AdminActionButton>
                <Save size={14} /> Save
              </AdminActionButton>
            </form>

            <form action={updateLeadStatus} className="flex items-center gap-2">
              <input type="hidden" name="id" value={lead.id} />
              <Flame size={16} />

              <select
                name="status"
                defaultValue={lead.status}
                className="rounded-lg px-3 py-2 bg-white dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-700"
              >
                <option>NEW</option>
                <option>HOT</option>
                <option>WARM</option>
                <option>CONVERTED</option>
                <option>LOST</option>
                <option>USELESS</option>
              </select>

              <AdminActionButton>
                <Save size={14} /> Update
              </AdminActionButton>
            </form>

            <form
  action={deleteLead}
  onSubmit={(e) => {
    if (!confirm("Delete this lead permanently?")) {
      e.preventDefault();
    }
  }}
>
  <input type="hidden" name="id" value={lead.id} />

  <AdminActionButton variant="danger">
    <Trash2 size={14} /> Delete
  </AdminActionButton>
</form>

          </div>
        </AdminCard>
      ))}
      </div>
    </div>
  );
}
