import AdminBannersClient from "./AdminBannersClient";
import { getAdminBanners } from "@/lib/db/banner";

export default async function AdminBannersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;

  const banners = await getAdminBanners(page, 12, q);

  return (
    <AdminBannersClient
      banners={banners}
      page={page}
      q={q}
    />
  );
}