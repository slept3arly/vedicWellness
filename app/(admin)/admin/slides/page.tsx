import { getAdminSlides } from "@/lib/db/slide";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

import AdminSlidesClient from "./AdminSlidesClient";

type UnsafeSlide = any; // 👈 isolate the compromise here

export default async function AdminSlidesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { data, total } = await getAdminSlides(
    page,
    ADMIN_PAGE_SIZE
  );

  return (
    <AdminSlidesClient
      slides={data as UnsafeSlide[]}
      total={total}
      page={page}
      limit={ADMIN_PAGE_SIZE}
    />
  );
}