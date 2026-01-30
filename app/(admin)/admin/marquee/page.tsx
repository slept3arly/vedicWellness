import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { deleteMarqueeItem, toggleMarqueeItem } from "./serverActions";
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

export default async function AdminMarqueePage() {
  const items = await prisma.marqueeItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marquee Text</h1>
          <p className="text-sm text-muted-foreground">
            Scrolling announcements on homepage
          </p>
        </div>

        <Link href="/admin/marquee/new">
          <AdminButton>+ Add Text</AdminButton>
        </Link>
      </div>

      {items.length === 0 && (
        <AdminCard className="text-center py-12 text-muted-foreground">
          No marquee items yet.
        </AdminCard>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((m) => (
          <AdminCard
            key={m.id}
            className="flex flex-col justify-between gap-4 hover:shadow-lg transition"
          >
            {/* Text + status */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-lg leading-snug line-clamp-3">
                  {m.text}
                </p>

                <AdminBadge
                  status={m.isActive ? "ACTIVE" : "INACTIVE"}
                />
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <div>📌 Order: {m.order}</div>
                <div>📅 Created: {formatDate(m.createdAt)}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">

              <Link href={`/admin/marquee/edit/${m.id}`}>
                <AdminButton variant="secondary">
                  Edit
                </AdminButton>
              </Link>

              <form action={toggleMarqueeItem}>
                <input type="hidden" name="id" value={m.id} />
                <AdminButton variant="success">
                  {m.isActive ? "Hide" : "Show"}
                </AdminButton>
              </form>

              <form action={deleteMarqueeItem}>
                <input type="hidden" name="id" value={m.id} />
                <AdminButton variant="danger">
                  Delete
                </AdminButton>
              </form>

            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
