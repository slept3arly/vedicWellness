import AdminBlogsClient from "./AdminBlogsClient";
import { getAdminBlogs } from "@/lib/db/blog";

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;

  const { blogs, total } = await getAdminBlogs(page, 12, q);

  return (
    <AdminBlogsClient
      blogs={blogs}
      total={total}
      page={page}
      q={q}
    />
  );
}