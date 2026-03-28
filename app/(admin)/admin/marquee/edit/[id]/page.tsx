import { getAdminMarqueeItemById } from "@/lib/db/marquee";
import MarqueeEditForm from "./MarqueeEditForm";

export default async function EditMarqueeItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await getAdminMarqueeItemById(id);

  if (!item) return <div style={{ padding: 24 }}>Not found</div>;

  return <MarqueeEditForm item={item} />;
}