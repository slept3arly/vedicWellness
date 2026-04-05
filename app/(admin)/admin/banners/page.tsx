import AdminBannersClient from "./AdminBannersClient";

import { getAdminBanners } from "@/lib/db/banner";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default async function AdminBannersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}) {
  const params = await searchParams;

  const q = params.q ?? "";
  const page = Number(params.page) || 1;
  const status =
    params.status === "ACTIVE" || params.status === "INACTIVE"
      ? params.status
      : "";

  const { data: banners, total } = await getAdminBanners(
    page,
    ADMIN_PAGE_SIZE,
    q,
    { status }
  );

  return (
    <AdminBannersClient
      banners={banners}
      total={total}
      page={page}
      q={q}
      status={status}
    />
  );
}
