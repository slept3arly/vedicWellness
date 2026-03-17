import AdminMarqueeClient from "./AdminMarqueeClient";
import { getAdminMarqueeItems } from "@/lib/db/marquee";

export default async function AdminMarqueePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const page = Number(params.page) || 1;

  // result contains { data, total, page, limit }
  const result = await getAdminMarqueeItems(page, 20, q);

  return (
    <AdminMarqueeClient
      items={result.data}
      total={result.total}
      q={q}
      page={page}
    />
  );
}