import { getAdminBlogs } from "@/lib/db/blog";
import AdminBlogsClient from "./AdminBlogsClient";

export default async function AdminBlogsPage() {
  const blogs = await getAdminBlogs();
  return <AdminBlogsClient blogs={blogs} />;
}
