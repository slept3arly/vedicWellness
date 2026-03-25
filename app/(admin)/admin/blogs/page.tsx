import AdminBlogsClient from "./AdminBlogsClient";
import { getAdminBlogs } from "@/lib/db/blog";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;

  const { data, total } = await getAdminBlogs(
    page,
    ADMIN_PAGE_SIZE,
    q
  );

  return (
    <AdminBlogsClient
      blogs={data}
      total={total}
      page={page}
      q={q}
    />
  );
}