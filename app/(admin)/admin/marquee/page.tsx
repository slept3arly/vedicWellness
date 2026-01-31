import { prisma } from "@/lib/db/prisma";
import AdminMarqueeClient from "./AdminMarqueeClient";

export default async function AdminMarqueePage() {
  const items = await prisma.marqueeItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return <AdminMarqueeClient items={items} />;
}
