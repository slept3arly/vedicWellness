import { prisma } from "@/lib/prisma";
import { updateBlog } from "../../serverActions";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const blog = await prisma.blog.findFirst({
    where: { id: params.id },
  });

  if (!blog) return <div>Blog not found.</div>;

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>Edit Blog</h1>

      <form
        action={updateBlog}
        style={{ marginTop: 18, display: "grid", gap: 12 }}
      >
        <input type="hidden" name="id" value={blog.id} />

        <input name="title" defaultValue={blog.title} required />
        <input name="slug" defaultValue={blog.slug} required />

        <textarea
          name="description"
          defaultValue={blog.description ?? ""}
          rows={3}
        />

        <textarea
          name="content"
          defaultValue={blog.content ?? ""}
          rows={12}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            name="published"
            defaultChecked={blog.published}
          />
          Published (visible on website)
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
