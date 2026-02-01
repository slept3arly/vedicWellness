"use client";

import Link from "next/link";
import AdminCard from "@/app/(admin)/admin/components/ui/AdminCard";
import AdminActionButton from "@/app/(admin)/admin/components/ui/AdminActionButton";
import { createUser } from "../serverActions";

export default function UserNewForm() {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <AdminCard className="bg-neutral-200/70 dark:bg-neutral-900/80 space-y-6">

        <div>
          <h1 className="text-2xl font-bold">Add User</h1>
          <p className="opacity-70 text-sm">Create a new user account</p>
        </div>

        <form action={createUser} className="space-y-4">

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300/40 dark:border-neutral-700/50"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300/40 dark:border-neutral-700/50"
          />

          <select
            name="role"
            defaultValue="VIEWER"
            className="w-full rounded-lg px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300/40 dark:border-neutral-700/50 hover:brightness-110 transition"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="SALES">SALES</option>
            <option value="VIEWER">VIEWER</option>
          </select>

          <div className="flex gap-3 pt-2">
            <AdminActionButton>
              Create User
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
