import { prisma } from "@/lib/db/prisma";
import BlogEditForm from "./BlogEditForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const blog = await prisma.blog.findFirst({
    where: { id },
  });

  if (!blog) return <div>Blog not found.</div>;

  return <BlogEditForm blog={blog} />;
}
