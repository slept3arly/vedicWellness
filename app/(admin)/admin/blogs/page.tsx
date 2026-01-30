import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { deleteBlog, toggleBlogPublished } from "./serverActions";
import AdminCard from "../components/ui/AdminCard";
import AdminButton from "../components/ui/AdminButton";
import AdminBadge from "../components/ui/AdminBadge";

function formatDate(date?: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminBlogsPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blogs</h1>
          <p className="text-sm text-muted-foreground">
            Content & SEO posts
          </p>
        </div>

        <Link href="/admin/blogs/new">
          <AdminButton>+ New Post</AdminButton>
        </Link>
      </div>

      {blogs.length === 0 && (
        <AdminCard className="text-center py-12 text-muted-foreground">
          No blogs yet. Create your first post.
        </AdminCard>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {blogs.map((b) => (
          <AdminCard
            key={b.id}
            className="flex flex-col gap-4 hover:shadow-lg transition"
          >
            {/* Thumbnail */}
            {b.thumbnailUrl && (
              <img
                src={b.thumbnailUrl}
                alt={b.title}
                className="rounded-xl h-40 w-full object-cover"
              />
            )}

            {/* Main info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-lg leading-snug line-clamp-2">
                  {b.title}
                </h2>

                <AdminBadge
                  status={b.published ? "ACTIVE" : "INACTIVE"}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                /blog/{b.slug}
              </p>

              {b.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {b.description}
                </p>
              )}
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>📅 Created:</span>
              <span>{formatDate(b.createdAt)}</span>

              <span>🚀 Published:</span>
              <span>{formatDate(b.publishedAt)}</span>

              <span>✍️ Author:</span>
              <span>{b.author}</span>

              <span>📂 Category:</span>
              <span>{b.category ?? "—"}</span>
            </div>

            {/* Tags */}
            {b.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {b.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-border/40">

              <Link href={`/admin/blogs/edit/${b.id}`}>
                <AdminButton variant="secondary">
                  Edit
                </AdminButton>
              </Link>

              <form action={toggleBlogPublished}>
                <input type="hidden" name="id" value={b.id} />
                <input
                  type="hidden"
                  name="published"
                  value={String(b.published)}
                />
                <AdminButton variant="success">
                  {b.published ? "Unpublish" : "Publish"}
                </AdminButton>
              </form>

              <form action={deleteBlog}>
                <input type="hidden" name="id" value={b.id} />
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
