import AdminOrdersClient from "./AdminOrdersClient";
import { getAdminOrders } from "@/lib/db/order";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;

  const { data, total } = await getAdminOrders(
    page,
    ADMIN_PAGE_SIZE,
    q
  );

  return (
    <AdminOrdersClient
      orders={data}
      total={total}
      q={q}
      page={page}
    />
  );
}