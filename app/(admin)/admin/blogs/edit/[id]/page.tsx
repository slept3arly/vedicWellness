import { prisma } from "@/lib/db/prisma";
import BlogEditForm from "./BlogEditForm";

export default async function EditBlogPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const blog = await prisma.blog.findFirst({
    where: { id },
  });

  if (!blog) return <div>Blog not found.</div>;

  return <BlogEditForm blog={blog} />;
}
