import { prisma } from "@/lib/db/prisma";
import BlogEditForm from "./BlogEditForm";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const blog = await prisma.blog.findFirst({
    where: { id },
  });

  if (!blog) return <div>Blog not found.</div>;

  return <BlogEditForm blog={blog} />;
}
