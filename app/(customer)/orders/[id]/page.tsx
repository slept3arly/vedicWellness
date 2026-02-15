import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/requireUser";
import OrderDetailsClient from "./OrderDetailsClient";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await requireUser();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!order || order.userId !== user.id) {
    redirect("/orders");
  }

  return <OrderDetailsClient order={order} />;
}
