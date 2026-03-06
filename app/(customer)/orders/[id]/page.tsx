import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/requireUser";
import { getOrderForUser } from "@/lib/services/orderService";
import OrderDetailsClient from "./OrderDetailsClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to orders
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight font-mono">
          #{order.id.slice(-8).toUpperCase()}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">
          Order details and payment status
        </p>
      </div>

      <OrderDetailsClient order={order} />
    </div>
  );
}