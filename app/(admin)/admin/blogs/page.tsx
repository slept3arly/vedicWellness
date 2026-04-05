import AdminBlogsClient from "./AdminBlogsClient";
import { getAdminBlogs, getAdminBlogFilterOptions } from "@/lib/db/blog";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    status?: string;
    author?: string;
  }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;
  const status =
    params.status === "PUBLISHED" || params.status === "UNPUBLISHED"
      ? params.status
      : "";
  const author = params.author || "";

  const [{ data, total }, filterOptions] = await Promise.all([
    getAdminBlogs(page, ADMIN_PAGE_SIZE, q, {
      status,
      author,
    }),
    getAdminBlogFilterOptions(),
  ]);

  return (
    <AdminBlogsClient
      blogs={data}
      total={total}
      page={page}
      q={q}
      status={status}
      author={author}
      authorOptions={filterOptions.authors}
    />
  );
}
