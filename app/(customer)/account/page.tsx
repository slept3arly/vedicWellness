import { getUserAddresses } from "@/lib/services/addressService";
import { requireUser } from "@/lib/auth/requireUser";
import AccountClient from "./AccountClient";

export default async function AccountPage() {
  const user = await requireUser();
  const addresses = await getUserAddresses(user.id);

  return <AccountClient addresses={addresses} />;
}
