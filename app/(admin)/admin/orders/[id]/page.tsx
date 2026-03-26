import { getAdminOrderById } from "@/lib/db/order";
import AdminOrderDetailClient from "./AdminOrderDetailClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    throw new Error("Invalid order id");
  }

  const order = await getAdminOrderById(id);

  if (!order) {
    throw new Error("Order not found");
  }

  return <AdminOrderDetailClient order={order} />;
}