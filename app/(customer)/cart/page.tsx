import { getSession } from "@/lib/auth/getSession";
import { getOrCreateCart } from "@/lib/services/cartService";
import CartClient from "./CartClient";

export default async function CartPage() {
  const session = await getSession();

  if (!session?.user) {
    return null; // or redirect("/login")
  }

  const cart = await getOrCreateCart(session.user.id);

  return <CartClient cart={cart} />;
}
