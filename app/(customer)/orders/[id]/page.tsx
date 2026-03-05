import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/requireUser";
import { getOrderForUser } from "@/lib/services/orderService";
import OrderDetailsClient from "./OrderDetailsClient";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await requireUser();

  const order = await getOrderForUser(id, user.id);

  if (!order) {
    redirect("/orders");
  }

  return <OrderDetailsClient order={order} />;
}