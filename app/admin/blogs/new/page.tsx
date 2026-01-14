import Link from "next/link";
import { createBlog } from "../serverActions";

export default function NewBlogPage() {
  return (
    <div style={{ padding: 24, maxWidth: 760 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Add Blog</h1>
      <p style={{ opacity: 0.7 }}>Create a new blog post.</p>

      <form
        action={createBlog}
        style={{ marginTop: 18, display: "grid", gap: 12 }}
      >
        <input name="title" placeholder="Blog title" required />
        <input name="slug" placeholder="Slug (example: why-hair-oil)" required />

        <textarea
          name="description"
          placeholder="Short description (shown in list + SEO)"
          rows={3}
        />

        <textarea
          name="content"
          placeholder="Blog content (you can store HTML/Markdown/plain text)"
          rows={12}
        />

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input name="published" type="checkbox" defaultChecked />
          Published
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">Create</button>
          <Link href="/admin/blogs">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
