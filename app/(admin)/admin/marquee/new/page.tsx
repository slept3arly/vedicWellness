import Link from "next/link";
import { createMarqueeItem } from "../serverActions";

export default function NewMarqueeItemPage() {
  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Add Marquee Text</h1>

      <form action={createMarqueeItem} style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <input name="text" placeholder="Text (example: BLOGS LIVE)" required />
        <input name="order" placeholder="Order (0 = first)" defaultValue="0" />
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input name="isActive" type="checkbox" defaultChecked />
          Active
        </label>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit">Create</button>
          <Link href="/admin/marquee">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
