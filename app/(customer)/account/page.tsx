import { getUserAddresses } from "@/lib/services/addressService";
import { getUserOrderCount } from "@/lib/services/orderService";
import { requireUser } from "@/lib/auth/requireUser";
import AccountClient from "./AccountClient";

export default async function AccountPage() {
  const user = await requireUser();

  const addresses = await getUserAddresses(user.id);
  const orderCount = await getUserOrderCount(user.id);

  return (
    <AccountClient
      user={user}
      orderCount={orderCount}
      addresses={addresses}
    />
  );
}