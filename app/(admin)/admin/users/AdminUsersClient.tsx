"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ICONS */
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
  RefreshCw,
  Hash,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
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
import { updateUserRole, deleteUser } from "./serverActions";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default function AdminUsersClient({
  users = [],
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

  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE);

  const handleSync = () => startTransition(() => router.refresh());
  
  const handlePageChange = (p: number) => {
    startTransition(() => {
      const query = q ? `&q=${encodeURIComponent(q)}` : "";
      router.push(`?page=${p}${query}`);
    });
  };

  const filtered = roleFilter
    ? users.filter((u: any) => u.role === roleFilter)
    : users;

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pb-12">
      
      {/* 1. GLOBAL HEADER SYSTEM */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-4">
        <PageHeader
          title="User Management"
          subtitle={`Manage access and permissions (${total})`}
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
          <Link href="/admin/users/new" className="w-full lg:w-auto">
            <AdminButton variant="primary" icon={Plus} className="w-full sm:min-w-[215px]">
              New User
            </AdminButton>
          </Link>
        </div>
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800" />

      {/* 2. SEARCH & FILTER SYSTEM */}
      <AdminCard compact className="!p-3 border-dashed bg-neutral-50/50 dark:bg-neutral-900/50">
        <div className="space-y-3">
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
                placeholder="Search by name or email..."
                className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {inputValue && (
                <X
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 cursor-pointer hover:text-red-500"
                  onClick={() => {
                    setInputValue("");
                    router.push("?page=1");
                  }}
                />
              )}
            </div>
            <AdminButton type="submit" icon={Search}>
              Search
            </AdminButton>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-neutral-400 mr-1">Filter Role:</span>
            {["ADMIN", "SALES", "VIEWER"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(roleFilter === r ? null : r)}
                className={cn(
                  "px-3 py-1 rounded-full text-[11px] font-bold transition-all border",
                  roleFilter === r
                    ? "bg-black text-white border-black dark:bg-white dark:text-black"
                    : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-400"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </AdminCard>

      {/* 3. GLOBAL GRID SYSTEM */}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", isPending && "opacity-50 pointer-events-none")}>
        {filtered.length === 0 ? (
          <div className="col-span-full">
            <AdminCard className="py-24 flex flex-col items-center justify-center text-center">
              <User className="h-10 w-10 text-neutral-300 mb-4" />
              <h3 className="text-lg font-bold">No users found</h3>
              <p className="text-neutral-400 text-sm">Try adjusting your search or filters.</p>
            </AdminCard>
          </div>
        ) : (
          filtered.map((u, idx) => {
            const displayIndex = (page - 1) * ADMIN_PAGE_SIZE + (idx + 1);

            return (
              <AdminCard
                key={u.id}
                compact
                index={displayIndex}
                className="group flex flex-col h-full border-t-4 border-t-neutral-200 dark:border-t-neutral-700 hover:border-t-primary/50 transition-colors"
              >
                {/* Status Badges */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-1.5">
                    <AdminBadge status={u.role} />
                    <AdminBadge status={u.verified ? "VERIFIED" : "UNVERIFIED"} />
                  </div>
                </div>

                {/* User Content */}
                <div className="flex-1 py-4">
                  <h3 className="text-base font-bold leading-tight text-neutral-800 dark:text-neutral-100 line-clamp-1">
                    {u.name || "Anonymous User"}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-neutral-500">
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>
                </div>

                {/* Meta Information Grid (2 cols) */}
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-neutral-100 dark:border-neutral-800/50">
                  <div className="space-y-1">
                    <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Joined</span>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                      <Calendar className="h-3 w-3 text-neutral-400" />
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Security</span>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                      {u.verified ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-amber-500" />
                      )}
                      {u.verified ? "Verified" : "Pending"}
                    </div>
                  </div>
                </div>

                {/* Inline role editor toggle (if active) */}
                {editingId === u.id && (
                  <div className="py-3 bg-neutral-50 dark:bg-neutral-800/30 -mx-4 px-4 border-b border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-top-1">
                    <form
                      action={async (fd) => {
                        setLoadingId(u.id);
                        await updateUserRole(fd);
                        setLoadingId(null);
                        setEditingId(null);
                      }}
                      className="flex flex-col gap-2"
                    >
                      <input type="hidden" name="id" value={u.id} />
                      <select
                        name="role"
                        defaultValue={u.role}
                        className="h-9 w-full rounded-lg px-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 outline-none"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="SALES">SALES</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                      <div className="flex gap-2">
                        <AdminButton variant="primary" type="submit" icon={Save} className="flex-1 h-8 text-[11px]">
                          {loadingId === u.id ? "Updating..." : "Save Role"}
                        </AdminButton>
                        <AdminButton variant="ghost" onClick={() => setEditingId(null)} className="h-8 text-[11px]">
                          Cancel
                        </AdminButton>
                      </div>
                    </form>
                  </div>
                )}

                {/* Actions Section */}
                <div className="space-y-2 pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/admin/users/edit/${u.id}`}>
                      <AdminButton icon={Pencil} className="w-full h-9 text-[11px]">Edit</AdminButton>
                    </Link>
                    <AdminButton
                      icon={ArrowUpDown}
                      className="w-full h-9 text-[11px]"
                      onClick={() => setEditingId(editingId === u.id ? null : u.id)}
                    >
                      Role
                    </AdminButton>
                  </div>
                  <form
                    action={deleteUser}
                    onSubmit={(e) => !confirm("Permanently delete this user?") && e.preventDefault()}
                    className="w-full"
                  >
                    <input type="hidden" name="id" value={u.id} />
                    <AdminActionButton variant="danger" icon={Trash2} className="w-full h-9 text-[11px]">
                      Delete User
                    </AdminActionButton>
                  </form>
                </div>

                {/* ID Footer */}
                <div className="flex items-center text-[9px] text-neutral-400 font-mono pt-3 mt-auto border-t border-neutral-50 dark:border-neutral-800/50">
                  <Hash className="h-2.5 w-2.5 mr-1" />
                  <span className="select-all opacity-70 uppercase">{u.id.slice(-12)}</span>
                </div>
              </AdminCard>
            );
          })
        )}
      </div>
    </div>
  );
}