import AdminOrdersClient from "./AdminOrdersClient";
import { getAdminOrders } from "@/lib/db/order";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { OrderStatus } from "@prisma/client";

const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    from?: string;
    to?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;
  const from =
    params.from && DATE_INPUT_PATTERN.test(params.from) ? params.from : "";
  const to = params.to && DATE_INPUT_PATTERN.test(params.to) ? params.to : "";
  const status = Object.values(OrderStatus).includes(params.status as OrderStatus)
    ? (params.status as OrderStatus)
    : undefined;

  const { data, total } = await getAdminOrders(page, ADMIN_PAGE_SIZE, q, {
    from,
    to,
    status,
  });

  return (
    <AdminOrdersClient
      orders={data}
      total={total}
      q={q}
      page={page}
      from={from}
      to={to}
      status={status ?? ""}
      statusOptions={Object.values(OrderStatus)}
    />
  );
}
