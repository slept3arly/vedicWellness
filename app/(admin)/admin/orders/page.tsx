// app/admin/orders/page.tsx

import AdminOrdersClient from "./AdminOrdersClient";
import { getAdminOrdersService } from "@/lib/services/orderService";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;

  const LIMIT = 20;

  const result = await getAdminOrdersService(page, LIMIT, q);

  return (
    <AdminOrdersClient
      orders={result.orders}
      total={result.total}
      q={q}
      page={page}
    />
  );
}