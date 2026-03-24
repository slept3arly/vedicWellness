import AdminBannersClient from "./AdminBannersClient";

import { getAdminBanners } from "@/lib/db/banner";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default async function AdminBannersPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = searchParams.q ?? "";
  const page = Number(searchParams.page ?? 1);

  const { data, total } = await getAdminBanners(
    page,
    ADMIN_PAGE_SIZE,
    q
  );

  return (
    <AdminBannersClient
      banners={data}
      total={total}
      page={page}
      q={q}
    />
  );
}