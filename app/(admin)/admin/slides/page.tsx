import { getAdminSlides } from "@/lib/db/slide";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { PlacementKey } from "@prisma/client";

import AdminSlidesClient from "./AdminSlidesClient";

export default async function AdminSlidesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    status?: string;
    type?: string;
  }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;
  const status =
    params.status === "ACTIVE" || params.status === "INACTIVE"
      ? params.status
      : "";
  const type = Object.values(PlacementKey).includes(params.type as PlacementKey)
    ? (params.type as PlacementKey)
    : "";

  const { data: slides, total } = await getAdminSlides(
    page,
    ADMIN_PAGE_SIZE,
    q,
    {
      status,
      type,
    }
  );

  return (
    <AdminSlidesClient
      slides={slides}
      total={total}
      page={page}
      q={q}
      status={status}
      type={type}
      typeOptions={Object.values(PlacementKey)}
    />
  );
}
