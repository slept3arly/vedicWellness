import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { deleteUser, updateUserRole } from "./serverActions";
import { Prisma } from "@prisma/client";
import AdminCard from "../components/ui/AdminCard";
import AdminButton from "../components/ui/AdminButton";
import AdminBadge from "../components/ui/AdminBadge";
import AdminTabs from "../components/ui/AdminTabs";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const tab = searchParams.tab ?? "users";

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const admins = users.filter((u) => u.role === "ADMIN");
  const viewers = users.filter((u) => u.role === "VIEWER");
  const sales = users.filter((u) => u.role === "SALES");

  const salesStats = await prisma.lead.groupBy({
  by: ["ownerId"],
  _count: { _all: true },
  _max: { claimedAt: true },
}) as Prisma.LeadGroupByOutputType[];


const statsMap = Object.fromEntries(
  salesStats.map((s) => [
    s.ownerId,
    {
      count: s._count?._all ?? 0,
      last: s._max?.claimedAt ?? null,
    },
  ])
);




  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage system accounts & sales team
          </p>
        </div>

        <Link href="/admin/users/new">
          <AdminButton>+ Add User</AdminButton>
        </Link>
      </div>

      <AdminTabs
        tabs={[
          { label: "Manage Users", value: "users" },
          { label: "Sales Team", value: "sales" },
        ]}
        active={tab}
      />

      {/* ===================== */}
      {/* MANAGE USERS TAB */}
      {/* ===================== */}

      {tab === "users" && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">

          {[...admins, ...viewers].map((u) => (
            <AdminCard
              key={u.id}
              className="flex flex-col justify-between gap-4 hover:shadow-lg transition"
            >
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

              <div className="flex items-center justify-between">
                <AdminBadge status={u.role} />
                <span className="text-xs text-muted-foreground">
                  Created {formatDate(u.createdAt)}
                </span>
              </div>

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
      )}

      {/* ===================== */}
      {/* SALES TEAM TAB */}
      {/* ===================== */}

      {tab === "sales" && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">

          {sales.map((s) => {
            const stat = statsMap.get(s.id);

            return (
              <AdminCard key={s.id} className="space-y-4">

                <div>
                  <p className="font-semibold text-lg">
                    {s.name || s.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {s.email}
                  </p>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Leads:</span>
                  <b>{stat?.count ?? 0}</b>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Last activity:</span>
                  <span>
                    {stat?.last
                      ? new Date(stat.last).toLocaleDateString()
                      : "—"}
                  </span>
                </div>

                <Link href={`/admin/leads?sales=${s.id}`}>
                  <AdminButton className="w-full">
                    View Leads
                  </AdminButton>
                </Link>

              </AdminCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
