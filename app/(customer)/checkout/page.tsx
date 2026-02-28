import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/db/prisma";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage(props: {
  searchParams: Promise<{
    buyNow?: string;
    productId?: string;
    qty?: string;
  }>;
}) {
  const { searchParams } = props;
  const params = await searchParams;

  const isBuyNow = params.buyNow === "true";
  const user = await requireUser();
  let cart: any;

  if (isBuyNow && params.productId) {
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
    });

    if (!product) redirect("/");

    cart = {
      items: [
        {
          id: "buy-now",
          product,
          quantity: Number(params.qty || 1),
        },
      ],
    };
  } else {
    cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      redirect("/orders");
    }
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
      isBuyNow={isBuyNow}
      buyNowProductId={params.productId}
      buyNowQty={Number(params.qty || 1)}
    />
  );
}