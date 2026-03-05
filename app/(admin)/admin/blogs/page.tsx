// app/admin/blogs/page.tsx
import AdminBlogsClient from "./AdminBlogsClient";
import { getAdminBlogs } from "@/lib/db/blog";

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  // In Next.js 15+, searchParams is a Promise
  const params = await searchParams;
  const q = params.q || "";
  const page = Number(params.page) || 1;

  const blogs = await getAdminBlogs(page, 12, q);

  return (
    // The 'key' ensures React resets the component state when the search changes
    <AdminBlogsClient blogs={blogs} page={page} q={q} />
  );
}