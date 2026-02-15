import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function OrdersPage() {
  const user = await requireUser();

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-medium">
        My Orders
      </h1>

      {orders.length === 0 && (
        <p className="text-sm text-gray-500">
          You have no orders yet.
        </p>
      )}

      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="surface p-4 flex justify-between items-center"
        >
          <div>
            <p className="text-sm font-medium">
              Order #{order.id.slice(-6)}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <span className="text-sm">
            {order.status}
          </span>
        </Link>
      ))}
    </div>
  );
}
