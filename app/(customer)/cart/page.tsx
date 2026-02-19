import { requireUser } from "@/lib/auth/requireUser";
import { getOrCreateCart } from "@/lib/services/cartService";
import CartClient from "./CartClient";

export default async function CartPage() {
  // ⭐ strong auth guard
  const user = await requireUser();

  const cart = await getOrCreateCart(user.id);

  return <CartClient cart={cart} />;
}
