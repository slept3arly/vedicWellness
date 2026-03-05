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
} from "lucide-react";

import AdminCard from "../../../../components/admin/AdminCard";
import AdminButton from "../../../../components/admin/AdminButton";
import AdminBadge from "../../../../components/admin/AdminBadge";
import AdminActionButton from "../../../../components/admin/AdminActionButton";
import { updateUserRole, deleteUser } from "./serverActions";

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
  q,
  page,
}: {
  users: any[];
  q: string;
  page: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(q);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const filtered = roleFilter
    ? users.filter((u: any) => u.role === roleFilter)
    : users;

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-neutral-500">Manage all registered users</p>
        </div>
        <Link href="/admin/users/new">
          <AdminButton>
            <Plus className="h-4 w-4" />
            Add User
          </AdminButton>
        </Link>
      </div>

      {/* ── Search bar ── */}
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

          {/* Row 2: role filters + search button */}
          <div className="flex gap-2 flex-wrap items-center">
            <div className="flex gap-1.5 flex-1 flex-wrap">
              {["ADMIN", "SALES", "VIEWER"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(roleFilter === r ? null : r)}
                  className={`px-3 h-10 rounded-lg text-sm font-medium border transition-colors ${
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
                  className="px-3 h-10 rounded-lg text-sm border border-neutral-300 dark:border-neutral-700 text-neutral-400 hover:text-neutral-700 transition flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              )}
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
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {q && <> for "<span className="text-neutral-600 dark:text-neutral-300 font-medium">{q}</span>"</>}
            {roleFilter && <> · <span className="text-neutral-600 dark:text-neutral-300 font-medium">{roleFilter}</span></>}
          </span>
          <span>Page {page}</span>
        </div>
      </AdminCard>

      {/* ── Users List ── */}
      <div className={`space-y-3 transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
        {filtered.length === 0 ? (
          <AdminCard className="py-16 flex flex-col items-center gap-2">
            <User className="h-8 w-8 text-neutral-300" />
            <p className="font-medium text-neutral-500">No users found</p>
            <button onClick={handleClear} className="text-sm text-neutral-400 underline underline-offset-2 hover:text-black dark:hover:text-white">
              Clear search
            </button>
          </AdminCard>
        ) : (
          filtered.map((u: any, index: number) => (
            <AdminCard
              key={u.id}
              className="flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
            >
              {/* ── Left: index + avatar ── */}
              <div className="flex sm:flex-col items-center gap-3 sm:gap-2 shrink-0">
                <span className="text-xs text-neutral-400 tabular-nums w-5 text-center">
                  {(page - 1) * 12 + index + 1}
                </span>
                <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 shrink-0">
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
              </div>

              {/* ── Middle: info + meta ── */}
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-base leading-snug">
                      {u.name || u.email}
                    </h2>
                    <AdminBadge status={u.role} />
                  </div>
                  {u.name && (
                    <p className="text-xs text-neutral-500 mt-0.5">{u.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
                  <Meta label="Email">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </Meta>
                  <Meta label="Role">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    <span>{u.role}</span>
                  </Meta>
                  <Meta label="Joined">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{formatDate(u.createdAt)}</span>
                  </Meta>
                </div>

                {/* Inline role editor */}
                {editingId === u.id && (
                  <form action={updateUserRole} className="flex gap-2 items-center">
                    <input type="hidden" name="id" value={u.id} />
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="h-9 rounded-lg px-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 outline-none"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="SALES">SALES</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                    <AdminActionButton className="justify-center">
                      <Save className="h-3.5 w-3.5" /> Save
                    </AdminActionButton>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-xs text-neutral-400 underline underline-offset-2 hover:text-black dark:hover:text-white"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>

              {/* ── Right: actions — 2×2 mobile, column desktop ── */}
              <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 shrink-0 sm:w-32">
                <AdminButton
                  className="w-full justify-center"
                  onClick={() => startTransition(() => router.push(`/admin/users/edit/${u.id}`))}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </AdminButton>

                <AdminButton
                  className="w-full justify-center"
                  onClick={() => setEditingId(editingId === u.id ? null : u.id)}
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Role
                </AdminButton>

                <form
                  action={deleteUser}
                  className="w-full col-span-2 sm:col-span-1"
                  onSubmit={(e) => { if (!confirm("Delete this user permanently?")) e.preventDefault(); }}
                >
                  <input type="hidden" name="id" value={u.id} />
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