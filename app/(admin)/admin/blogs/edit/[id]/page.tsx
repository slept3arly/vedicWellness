import { getAdminBlogById } from "@/lib/db/blog";
import BlogEditForm from "./BlogEditForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const blog = await getAdminBlogById(id);

  if (!blog) return <div>Blog not found.</div>;

  return <BlogEditForm blog={blog} />;
}