"use client";

import Link from "next/link";
import AdminCard from "@/app/(admin)/admin/components/ui/AdminCard";
import AdminActionButton from "@/app/(admin)/admin/components/ui/AdminActionButton";
import { updateUser } from "../../serverActions";

export default function UserEditForm({ user }: { user: any }) {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <AdminCard className="bg-neutral-200/70 dark:bg-neutral-900/80 space-y-6">

        <h1 className="text-2xl font-bold">Edit User</h1>

        <form action={updateUser} className="space-y-4">
          <input type="hidden" name="id" value={user.id} />

          <input
            name="email"
            type="email"
            defaultValue={user.email}
            className="w-full rounded-lg px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300/40 dark:border-neutral-700/50"
            required
          />

          {/* Role dropdown INSIDE form now */}
          <select
            name="role"
            defaultValue={user.role}
            className="w-full rounded-lg px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300/40 dark:border-neutral-700/50 hover:brightness-110 transition"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="SALES">SALES</option>
            <option value="VIEWER">VIEWER</option>
          </select>

          <div className="space-y-1">
            <p className="text-sm font-semibold opacity-70">
              Reset Password (optional)
            </p>
            <input
              name="password"
              type="password"
              placeholder="Leave blank to keep current password"
              className="w-full rounded-lg px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300/40 dark:border-neutral-700/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <AdminActionButton>
              Save Changes
            </AdminActionButton>

            <Link
              href="/admin/users"
              className="px-4 py-2 rounded-lg border border-neutral-400/40 hover:bg-neutral-300/40 dark:hover:bg-neutral-800 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
