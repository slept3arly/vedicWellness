"use client";

import { useMemo, useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Search,
  X,
  Pencil,
  Trash2,
  Save,
  Calendar,
  Mail,
} from "lucide-react";

import AdminCard from "../../../../components/admin/AdminCard";
import AdminButton from "../../../../components/admin/AdminButton";
import AdminBadge from "../../../../components/admin/AdminBadge";
import AdminActionButton from "../../../../components/admin/AdminActionButton";

import { updateUserRole, deleteUser } from "./serverActions";

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
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  /* 🔍 modern search */
  const [search, setSearch] = useState(q);

  useEffect(() => {
    setSearch(q);
  }, [q]);

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
    }, 400);

    return () => clearTimeout(t);
  }, [search, q, params, router]);

  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u: any) => {
      if (roleFilter && u.role !== roleFilter) return false;

      return (
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.name || "").toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [users, search, roleFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">User Panel</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage all registered users
          </p>
        </div>

        <a
          href="/admin/users/new"
          className="px-4 py-2 rounded-lg bg-white dark:bg-neutral-900/80 hover:bg-emerald-500/40 transition border border-neutral-300 dark:border-neutral-700"
        >
          + Add User
        </a>
      </div>

      {/* 🔍 fixed search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="h-12 w-full rounded-xl bg-white dark:bg-neutral-900/80 pl-11 pr-4 border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-black outline-none"
        />

        {isPending && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 animate-pulse">
            Searching...
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setRoleFilter(null)}
          className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition"
        >
          <X size={20} />
        </button>

        {["ADMIN", "SALES", "VIEWER"].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(roleFilter === r ? null : r)}
            className={`px-4 py-2 rounded-lg transition border ${
              roleFilter === r
                ? "bg-emerald-500/30 border-emerald-500/40"
                : "bg-white dark:bg-neutral-900/80 hover:brightness-110 border-neutral-300 dark:border-neutral-700"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* 📉 fade while searching */}
      <div
        className={`space-y-4 transition-opacity duration-200 ${
          isPending ? "opacity-60" : "opacity-100"
        }`}
      >
        {filtered.map((u: any, i: number) => (
          <AdminCard
            key={u.id}
            className="flex flex-col md:flex-row gap-6 bg-neutral-200/70 dark:bg-neutral-900/80 hover:shadow-lg transition"
          >
            <div className="flex-1 space-y-4">

              <div className="flex items-center gap-3 font-semibold text-lg">
                <span className="text-neutral-500">
                  {(page - 1) * 20 + i + 1}.
                </span>
                <Mail size={16} className="opacity-70" />
                {u.email}
              </div>

              {u.name && (
                <p className="text-sm text-neutral-500">{u.name}</p>
              )}

              <AdminBadge status={u.role} />

              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <Calendar size={14} />
                {new Date(u.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-64">

              <div className="flex gap-2">

                <a href={`/admin/users/edit/${u.id}`} className="w-full">
                  <AdminButton className="w-full">
                    <Pencil size={14} /> Edit
                  </AdminButton>
                </a>

                <form action={deleteUser} className="w-full">
                  <input type="hidden" name="id" value={u.id} />
                  <AdminActionButton variant="danger" className="w-full">
                    <Trash2 size={14} /> Delete
                  </AdminActionButton>
                </form>
              </div>

              {editingId === u.id && (
                <form action={updateUserRole} className="flex flex-col gap-2">
                  <input type="hidden" name="id" value={u.id} />

                  <select
                    name="role"
                    defaultValue={u.role}
                    className="rounded-lg px-2 py-1 bg-white dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-700"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SALES">SALES</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>

                  <AdminActionButton>
                    <Save size={14} /> Save
                  </AdminActionButton>
                </form>
              )}
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
