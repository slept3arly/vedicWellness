import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/requireUser";
import { getOrderForUser } from "@/lib/services/orderService";
import OrderDetailsClient from "./OrderDetailsClient";
import PageHeader from "@/components/public/ui/PageHeader";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const order = await getOrderForUser(id, user.id);

  if (!order) redirect("/orders");

  return (
    <div className="space-y-4 pb-10">
      <PageHeader 
        title={`#${order.id.slice(-8).toUpperCase()}`} 
        subtitle="Order details and payment status" 
      />

      <OrderDetailsClient order={order} />
    </div>
  );
}