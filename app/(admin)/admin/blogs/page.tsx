import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { deleteBlog, toggleBlogPublished } from "./serverActions";

export default async function AdminBlogsPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin · Blogs</h1>

      <div style={{ marginTop: 12 }}>
        <Link href="/admin/blogs/new">+ Add Blog</Link>
      </div>

      {blogs.length === 0 ? (
        <p style={{ marginTop: 24, opacity: 0.7 }}>
          No blogs yet. Click “Add Blog”.
        </p>
      ) : (
        <ul style={{ marginTop: 24, display: "grid", gap: 12 }}>
          {blogs.map((b) => (
            <li
              key={b.id}
              style={{
                border: "1px solid #2a2a2a",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b style={{ fontSize: 18 }}>{b.title}</b>
                <span style={{ opacity: 0.8 }}>
                  {b.published ? "✅ Published" : "📝 Draft"}
                </span>
              </div>

              <div style={{ marginTop: 6, opacity: 0.8 }}>
                <code style={{ opacity: 0.7 }}>/blog/{b.slug}</code>
              </div>

              {b.description ? (
                <p style={{ marginTop: 8, opacity: 0.7 }}>{b.description}</p>
              ) : null}

              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <Link href={`/admin/blogs/edit/${b.id}`}>Edit</Link>

                <form action={toggleBlogPublished}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="published" value={String(b.published)} />
                  <button type="submit">{b.published ? "Hide" : "Show"}</button>
                </form>

                <form action={deleteBlog}>
                  <input type="hidden" name="id" value={b.id} />
                  <button type="submit">Delete</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
