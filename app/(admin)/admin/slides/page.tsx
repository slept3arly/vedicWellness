import { getAdminSlides } from "@/lib/db/slide";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

import AdminSlidesClient from "./AdminSlidesClient";

export default async function AdminSlidesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;

  const { data: slides, total } = await getAdminSlides(
    page,
    ADMIN_PAGE_SIZE,
    q
  );

  return (
    <AdminSlidesClient
      slides={slides}
      total={total}
      page={page}
      q={q}
    />
  );
}