import AdminMarqueeClient from "./AdminMarqueeClient";
import { getAdminMarqueeItems } from "@/lib/db/marquee";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default async function AdminMarqueePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;
  const status =
    params.status === "ACTIVE" || params.status === "INACTIVE"
      ? params.status
      : "";

  const { data: marqueeItems, total } = await getAdminMarqueeItems(
    page,
    ADMIN_PAGE_SIZE,
    q,
    { status }
  );

  return (
    <AdminMarqueeClient
      marqueeItems={marqueeItems}
      total={total}
      q={q}
      page={page}
      status={status}
    />
  );
}
