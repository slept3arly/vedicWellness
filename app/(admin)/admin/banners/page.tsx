import AdminBannersClient from "./AdminBannersClient";
import { getAdminBannersAction } from "./serverActions";

export default async function AdminBannersPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = searchParams.q ?? "";
  const page = Number(searchParams.page ?? 1);

  const { banners, total } = await getAdminBannersAction(
    page,
    12,
    q
  );

  return (
    <AdminBannersClient
      banners={banners}
      total={total}
      page={page}
      q={q}
    />
  );
}