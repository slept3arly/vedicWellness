import { getAdminOrderByIdService } from "@/lib/services/orderService";
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

  const order = await getAdminOrderByIdService(id);

  return <AdminOrderDetailClient order={order} />;
}