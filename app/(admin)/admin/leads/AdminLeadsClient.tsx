"use client";

import { useMemo, useState } from "react";
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
}: {
  leads?: any[];
  salesUsers?: any[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [claimFilter, setClaimFilter] = useState("__all");

  const filtered = useMemo(() => {
    return leads.filter((l: any) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (claimFilter === "unclaimed" && l.ownerId) return false;
      if (claimFilter !== "__all" && claimFilter !== "unclaimed" && l.ownerId !== claimFilter) return false;
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search leads..."
          className="
            h-12 w-full rounded-xl
            bg-white dark:bg-neutral-900/80
            pl-11
            border border-neutral-300 dark:border-neutral-700
          "
        />
      </div>

      {/* Filters */}
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

        {/* Claim filter */}
        <select
  value={claimFilter}
  onChange={(e) => setClaimFilter(e.target.value)}
  className="
    ml-auto rounded-lg px-2 py-2
    bg-white dark:bg-neutral-900/80
    border border-neutral-300 dark:border-neutral-700
  "
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

      {/* Leads */}
      {filtered.map((lead: any, i: number) => (
        <AdminCard
          key={lead.id}
          className="
            space-y-4
            bg-white dark:bg-neutral-900/80
            border border-neutral-300 dark:border-neutral-700
            hover:shadow-lg transition
          "
        >
          <div className="flex justify-between flex-wrap gap-4">

            <div className="space-y-2">
              <div className="flex items-center gap-3 font-semibold text-lg">
                <span className="text-neutral-500">{i + 1}.</span>
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
                <MapPin size={14} /> {lead.location}
                {lead.location || "—"}
              </div>
            </div>
          </div>

          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg px-4 py-2 text-sm">
            {lead.message}
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Calendar size={14} />
            {new Date(lead.createdAt).toLocaleDateString()}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-2 items-center pt-2">

            {/* Assign / Unassign */}
            <form action={assignLead} className="flex items-center gap-2">
              <input type="hidden" name="leadId" value={lead.id} />

              <User size={16} />

              <select
                key={lead.ownerId || "unclaimed"}
                name="toUserId"
                defaultValue={lead.ownerId || ""}

                className="
                  rounded-lg px-3 py-2
                  bg-white dark:bg-neutral-900/80
                  border border-neutral-300 dark:border-neutral-700
                "
              >
                <option value="">Unclaimed</option>
                {salesUsers.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.email}
                  </option>
                ))}
              </select>

              <AdminActionButton className="hover:bg-emerald-600/80 transition">
                <Save size={14} /> Save
              </AdminActionButton>
            </form>

            {/* Status only */}
            <form action={updateLeadStatus} className="flex items-center gap-2">
              <input type="hidden" name="id" value={lead.id} />

              <Flame size={16} />

              <select
                name="status"
                defaultValue={lead.status}
                className="
                  rounded-lg px-3 py-2
                  bg-white dark:bg-neutral-900/80
                  border border-neutral-300 dark:border-neutral-700
                "
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

            {/* Delete */}
            <form action={deleteLead}>
              <input type="hidden" name="id" value={lead.id} />
              <AdminActionButton
                variant="danger"
                className="hover:bg-red-600/80 transition"
              >
                <Trash2 size={14} /> Delete
              </AdminActionButton>
            </form>
          </div>
        </AdminCard>
      ))}
    </div>
  );
}
