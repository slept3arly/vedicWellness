import { getAdminMarqueeItems } from "@/lib/db/marquee";
import AdminMarqueeClient from "./AdminMarqueeClient";

export default async function AdminMarqueePage() {
  const items = await getAdminMarqueeItems();
  return <AdminMarqueeClient items={items} />;
}
