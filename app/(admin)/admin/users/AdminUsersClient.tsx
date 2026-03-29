"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Search,
  X,
  Pencil,
  Trash2,
  Save,
  Calendar,
  Mail,
  User,
  Plus,
  ShieldCheck,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import AdminCard from "../../../../components/admin/AdminCard";
import AdminButton from "../../../../components/admin/AdminButton";
import AdminBadge from "../../../../components/admin/AdminBadge";
import AdminActionButton from "../../../../components/admin/AdminActionButton";
import PageHeader from "@/components/public/ui/PageHeader";
import { updateUserRole, deleteUser } from "./serverActions";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

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

export default function AdminUsersClient({
  users,
  total,
  q,
  page,
}: {
  users: any[];
  total: number;
  q: string;
  page: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(q);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const LIMIT = ADMIN_PAGE_SIZE;
  const totalPages = Math.ceil(total / LIMIT);

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const query = (fd.get("query") as string).trim();
    const p = new URLSearchParams();
    p.set("page", "1");
    if (query) p.set("q", query);
    startTransition(() => router.push(`?${p.toString()}`));
  }

  const handlePageChange = (newPage: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    p.set("page", newPage.toString());
    startTransition(() => router.push(`?${p.toString()}`));
  };

  const handleClear = () => {
    setInputValue("");
    startTransition(() => router.push("?page=1"));
  };

  const filtered = roleFilter
    ? users.filter((u: any) => u.role === roleFilter)
    : users;

  return (
    <div className="max-w-6xl mx-auto space-y-4 px-4">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <PageHeader title="Users" subtitle="Manage all registered users" />
        <Link href="/admin/users/new">
          <AdminButton>
            <Plus className="h-4 w-4" />
            Add User
          </AdminButton>
        </Link>
      </div>

      {/* ── Search + Filters bar ── */}
      <AdminCard className="p-3">
        <form onSubmit={handleFilter} className="flex flex-col gap-2">

          {/* Row 1: search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              name="query"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search by name or email..."
              className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
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

          {/* Row 2: role filters + search button */}
          <div className="flex gap-2 flex-wrap items-center">
            <div className="flex gap-1.5 flex-1 flex-wrap">
              {["ADMIN", "SALES", "VIEWER"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(roleFilter === r ? null : r)}
                  className={`px-3 h-8 rounded-lg text-xs font-medium border transition-colors ${
                    roleFilter === r
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                      : "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {r}
                </button>
              ))}
              {roleFilter && (
                <button
                  type="button"
                  onClick={() => setRoleFilter(null)}
                  className="px-2 h-8 rounded-lg text-xs border border-neutral-300 dark:border-neutral-700 text-neutral-400 hover:text-neutral-700 transition flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="h-8 px-4 shrink-0 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-medium hover:opacity-80 disabled:opacity-50 transition-opacity flex items-center gap-1.5"
            >
              <Search className="h-3.5 w-3.5" />
              Search
            </button>
          </div>

        </form>

        <div className="mt-2 text-xs text-neutral-400 flex justify-between px-0.5">
          <span>
            {total} total result{total !== 1 ? "s" : ""}
            {q && <> for "<span className="text-slate-600 dark:text-slate-300 font-medium">{q}</span>"</>}
            {roleFilter && <> · filtered by <span className="text-slate-600 dark:text-slate-300 font-medium">{roleFilter}</span></>}
          </span>
          <span>Page {page} of {totalPages || 1}</span>
        </div>
      </AdminCard>

      {/* ── Users List ── */}
      <div className={`space-y-2 transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
        {filtered.length === 0 ? (
          <AdminCard className="py-12 flex flex-col items-center gap-2">
            <User className="h-8 w-8 text-neutral-300" />
            <p className="font-medium text-slate-600 dark:text-slate-300">No users found</p>
            <button onClick={handleClear} className="text-sm text-neutral-400 underline underline-offset-2 hover:text-black dark:hover:text-white">
              Clear search
            </button>
          </AdminCard>
        ) : (
          filtered.map((u: any, index: number) => (
            <AdminCard key={u.id} className="hover:shadow-md transition-shadow">
              <div className="flex gap-3">

                {/* Index */}
                <span className="text-xs text-neutral-400 tabular-nums w-5 pt-1 text-center shrink-0">
                  {(page - 1) * LIMIT + index + 1}
                </span>

                {/* Main content */}
                <div className="flex-1 min-w-0 space-y-2">

                  {/* Name + badge + date */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-base leading-snug">{u.name || u.email}</h3>
                    <AdminBadge status={u.role} />

                    {u.verified ? (
    <AdminBadge status="VERIFIED" />
  ) : (
    <AdminBadge status="UNVERIFIED" />
  )}
                    {/* Date: full-width on mobile, pushed right on desktop */}
                    <span className="w-full sm:w-auto sm:ml-auto flex items-center gap-1 text-xs text-neutral-400">
                      <Calendar className="h-3 w-3 shrink-0" />
                      {formatDate(u.createdAt)}
                    </span>
                  </div>

                  {/* Contact + role grid — 1 col mobile, 3 col desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1.5 gap-x-6">
                    <Meta label="Email">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </Meta>
                    <Meta label="Role">
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                      <span>{u.role}</span>
                    </Meta>
                  </div>

                  {/* Inline role editor */}
                  {editingId === u.id && (
                    <form
                      action={async (fd) => {
                        if (loadingId === u.id || locked) return;
                        setLoadingId(u.id);
                        await updateUserRole(fd);
                        setLocked(true);
                        setLoadingId(null);
                        setEditingId(null);
                      }}
                      className="flex flex-wrap gap-2 items-center bg-neutral-50 dark:bg-neutral-800/50 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                    >
                      <input type="hidden" name="id" value={u.id} />
                      <select
                        name="role"
                        defaultValue={u.role}
                        className="h-8 flex-1 sm:flex-none rounded-lg px-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 outline-none min-w-0"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="SALES">SALES</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                      <AdminActionButton className="h-8 text-xs px-2 gap-1 shrink-0">
                        <Save className="h-3 w-3" /> Save
                      </AdminActionButton>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-xs text-neutral-400 underline underline-offset-2 hover:text-black dark:hover:text-white px-1"
                      >
                        Cancel
                      </button>
                    </form>
                  )}

                  {/* ── Actions ──
                      Mobile: stacked vertically, full-width buttons
                      Desktop: single inline row with dividers
                  */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 pt-0.5">

                    <AdminButton
                      className="h-8 text-xs px-2 gap-1 w-full sm:w-auto justify-center"
                      onClick={() => startTransition(() => router.push(`/admin/users/edit/${u.id}`))}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </AdminButton>

                    {/* Divider — hidden on mobile */}
                    <div className="hidden sm:block w-px h-5 bg-neutral-200 dark:bg-neutral-700 shrink-0" />

                    <AdminButton
                      className="h-8 text-xs px-2 gap-1 w-full sm:w-auto justify-center"
                      onClick={() => setEditingId(editingId === u.id ? null : u.id)}
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" /> Role
                    </AdminButton>

                    {/* Divider — hidden on mobile */}
                    <div className="hidden sm:block w-px h-5 bg-neutral-200 dark:bg-neutral-700 shrink-0" />

                    <form
                      action={async (fd) => {
                        if (loadingId === u.id || locked) return;
                        if (!confirm("Delete this user permanently?")) return;
                        setLoadingId(u.id);
                        await deleteUser(fd);
                        setLocked(true);
                        setLoadingId(null);
                      }}
                      className="w-full sm:w-auto"
                    >
                      <input type="hidden" name="id" value={u.id} />
                      <AdminActionButton
                        variant="danger"
                        className="h-8 text-xs px-2 gap-1 w-full sm:w-auto justify-center"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </AdminActionButton>
                    </form>

                  </div>
                </div>
              </div>
            </AdminCard>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-2 pb-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || isPending}
            className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-sm font-medium">
            Page <span className="text-black dark:text-white">{page}</span> of {totalPages}
          </div>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || isPending}
            className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium mb-0.5">{label}</div>
      <div className="flex items-center gap-1 text-xs text-neutral-800 dark:text-neutral-100 min-w-0">{children}</div>
    </div>
  );
}