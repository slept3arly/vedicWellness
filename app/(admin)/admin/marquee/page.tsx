import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { deleteMarqueeItem, toggleMarqueeItem } from "./serverActions";

export default async function AdminMarqueePage() {
  const items = await prisma.marqueeItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin · Marquee</h1>
        <Link href="/admin/marquee/new">+ Add Text</Link>
      </div>

      {items.length === 0 ? (
        <p style={{ marginTop: 24, opacity: 0.7 }}>No marquee items yet.</p>
      ) : (
        <div style={{ marginTop: 22, display: "grid", gap: 12 }}>
          {items.map((m) => (
            <div
              key={m.id}
              style={{
                border: "1px solid #2a2a2a",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b style={{ fontSize: 18 }}>{m.text}</b>
                <span style={{ opacity: 0.8 }}>
                  {m.isActive ? "✅ Active" : "🚫 Hidden"}
                </span>
              </div>

              <div style={{ opacity: 0.6, marginTop: 4 }}>
                order: {m.order}
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <Link href={`/admin/marquee/edit/${m.id}`}>Edit</Link>

                <form action={toggleMarqueeItem}>
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit">{m.isActive ? "Hide" : "Show"}</button>
                </form>

                <form action={deleteMarqueeItem}>
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
