import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/db/prisma";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  const user = await requireUser();

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  // 🔥 If cart empty → go to orders
  if (!cart || cart.items.length === 0) {
    redirect("/orders");
  }

  const defaultAddress = await prisma.address.findFirst({
    where: {
      userId: user.id,
      isDefault: true,
    },
  });

  return (
    <CheckoutClient
      cart={cart}
      defaultAddress={defaultAddress}
    />
  );
}
