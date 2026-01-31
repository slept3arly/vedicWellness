import { prisma } from "@/lib/db/prisma";
import AdminBlogsClient from "./AdminBlogsClient";

export default async function AdminBlogsPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminBlogsClient blogs={blogs} />;
}
