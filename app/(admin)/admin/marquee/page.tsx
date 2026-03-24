import AdminMarqueeClient from "./AdminMarqueeClient";
import { getAdminMarqueeItems } from "@/lib/db/marquee";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default async function AdminMarqueePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;

  const { data, total } = await getAdminMarqueeItems(
    page,
    ADMIN_PAGE_SIZE,
    q
  );

  return (
    <AdminMarqueeClient
      items={data}
      total={total}
      q={q}
      page={page}
    />
  );
}