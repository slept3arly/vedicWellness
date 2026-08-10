import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/requireUser";
import CheckoutClient from "./CheckoutClient";
import {
  getBuyNowProduct,
  getCartForCheckout,
  getDefaultAddress,
} from "@/lib/services/checkoutService";

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

  if (isBuyNow && params.productId) {
    const product = await getBuyNowProduct(params.productId);

    if (!product) redirect("/");

    const defaultAddress = await getDefaultAddress(user.id);

    const cart = {
      items: [
        {
          id: "buy-now",
          productId: product.id,
          product,
          quantity: Number(params.qty || 1),
        },
      ],
    };

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

  const [cart, defaultAddress] = await Promise.all([
    getCartForCheckout(user.id),
    getDefaultAddress(user.id),
  ]);

  if (!cart || cart.items.length === 0) {
    redirect("/orders");
  }

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
