import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProduct, toggleProductPublished } from "./serverActions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin · Products</h1>

      <div style={{ marginTop: 12 }}>
        <Link href="/admin/products/new">+ Add Product</Link>
      </div>

      {products.length === 0 ? (
        <p style={{ marginTop: 24, opacity: 0.7 }}>
          No products yet. Click “Add Product”.
        </p>
      ) : (
        <ul style={{ marginTop: 24, display: "grid", gap: 12 }}>
          {products.map((p) => (
            <li
              key={p.id}
              style={{
                border: "1px solid #2a2a2a",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b style={{ fontSize: 18 }}>{p.name}</b>
                <span style={{ opacity: 0.8 }}>
                  {p.published ? "✅ Published" : "📝 Draft"}
                </span>
              </div>

              {p.description ? (
                <p style={{ marginTop: 6, opacity: 0.7 }}>{p.description}</p>
              ) : null}

              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
  <Link href={`/admin/products/edit/${p.id}`}>Edit</Link>


  <form action={toggleProductPublished}>
    <input type="hidden" name="id" value={p.id} />
    <input type="hidden" name="published" value={String(p.published)} />
    <button type="submit">
      {p.published ? "Hide" : "Show"}
    </button>
  </form>

  <form action={deleteProduct}>
    <input type="hidden" name="id" value={p.id} />
    <button type="submit">Delete</button>
  </form>
</div>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
