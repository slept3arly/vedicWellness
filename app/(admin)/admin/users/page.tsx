import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { deleteUser, updateUserRole } from "./serverActions";
import AdminCard from "../components/ui/AdminCard";
import AdminButton from "../components/ui/AdminButton";
import AdminBadge from "../components/ui/AdminBadge";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage system accounts & roles
          </p>
        </div>

        <Link href="/admin/users/new">
          <AdminButton>+ Add User</AdminButton>
        </Link>
      </div>

      {users.length === 0 && (
        <AdminCard className="text-center py-12 text-muted-foreground">
          No users yet.
        </AdminCard>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {users.map((u) => (
          <AdminCard
            key={u.id}
            className="flex flex-col justify-between gap-4 hover:shadow-lg transition"
          >
            {/* User info */}
            <div className="space-y-1">
              <p className="font-medium text-lg break-all">
                {u.email}
              </p>

              {u.name && (
                <p className="text-sm text-muted-foreground">
                  {u.name}
                </p>
              )}
            </div>

            {/* Role + meta */}
            <div className="flex items-center justify-between">
              <AdminBadge status={u.role} />
              <span className="text-xs text-muted-foreground">
                Created {formatDate(u.createdAt)}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-border/40">

              <div className="flex flex-wrap gap-2">

                <Link href={`/admin/users/edit/${u.id}`}>
                  <AdminButton variant="secondary">
                    Edit
                  </AdminButton>
                </Link>

                <form
                  action={updateUserRole}
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="id" value={u.id} />

                  <select
                    name="role"
                    defaultValue={u.role}
                    className="bg-muted border border-border rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SALES">SALES</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>

                  <AdminButton variant="success">
                    Save
                  </AdminButton>
                </form>

                <form action={deleteUser}>
                  <input type="hidden" name="id" value={u.id} />
                  <AdminButton variant="danger">
                    Delete
                  </AdminButton>
                </form>

              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
