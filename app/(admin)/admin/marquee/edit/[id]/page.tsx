import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { updateMarqueeItem } from "../../serverActions";

export default async function EditMarqueeItemPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await prisma.marqueeItem.findFirst({
    where: { id: params.id },
  });

  if (!item) return <div style={{ padding: 24 }}>Not found</div>;

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Edit Marquee Text</h1>

      <form action={updateMarqueeItem} style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <input type="hidden" name="id" value={item.id} />
        <input name="text" defaultValue={item.text} required />
        <input name="order" defaultValue={String(item.order)} />
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input name="isActive" type="checkbox" defaultChecked={item.isActive} />
          Active
        </label>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit">Save</button>
          <Link href="/admin/marquee">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
