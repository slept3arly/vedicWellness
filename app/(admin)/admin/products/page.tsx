import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { deleteProduct, toggleProductPublished } from "./serverActions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      tag: true,
      price: true,
      imageUrl: true,
      gallery: true,
      medicineForm: true,
      published: true,
      createdAt: true,
    },
  });

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900 }}>Admin · Products</h1>
          <p style={{ marginTop: 6, opacity: 0.7 }}>
            Manage product catalog shown on /products
          </p>
        </div>

        <Link
          href="/admin/products/new"
          style={{
            alignSelf: "center",
            padding: "10px 14px",
            border: "1px solid #2a2a2a",
            borderRadius: 12,
            fontWeight: 700,
          }}
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p style={{ marginTop: 24, opacity: 0.7 }}>
          No products yet. Click “Add Product”.
        </p>
      ) : (
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {products.map((p) => {
            const galleryCount = Array.isArray(p.gallery) ? p.gallery.length : 0;

            return (
              <div
                key={p.id}
                style={{
                  border: "1px solid #2a2a2a",
                  borderRadius: 16,
                  padding: 14,
                  display: "grid",
                  gridTemplateColumns: "90px 1fr",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                {/* cover thumbnail */}
                <div
                  style={{
                    position: "relative",
                    width: 90,
                    height: 90,
                    borderRadius: 14,
                    overflow: "hidden",
                    background: "#111",
                  }}
                >
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="90px"
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        opacity: 0.7,
                      }}
                    >
                      No image
                    </div>
                  )}
                </div>

                {/* content */}
                <div style={{ display: "grid", gap: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "grid", gap: 4 }}>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <b style={{ fontSize: 18 }}>{p.name}</b>

                        {p.tag ? (
                          <span
                            style={{
                              fontSize: 12,
                              padding: "3px 10px",
                              borderRadius: 999,
                              border: "1px solid #2a2a2a",
                              opacity: 0.9,
                            }}
                          >
                            {p.tag}
                          </span>
                        ) : null}

                        <span
                          style={{
                            fontSize: 12,
                            padding: "3px 10px",
                            borderRadius: 999,
                            border: "1px solid #2a2a2a",
                            opacity: 0.9,
                          }}
                        >
                          ₹ {p.price}
                        </span>

                        {p.medicineForm ? (
                          <span
                            style={{
                              fontSize: 12,
                              padding: "3px 10px",
                              borderRadius: 999,
                              border: "1px solid #2a2a2a",
                              opacity: 0.85,
                            }}
                          >
                            {String(p.medicineForm).toLowerCase()}
                          </span>
                        ) : null}

                        <span
                          style={{
                            fontSize: 12,
                            padding: "3px 10px",
                            borderRadius: 999,
                            border: "1px solid #2a2a2a",
                            opacity: 0.7,
                          }}
                        >
                          Gallery: {galleryCount}
                        </span>
                      </div>

                      <div style={{ fontSize: 12, opacity: 0.7 }}>
                        Slug: <code>{p.slug}</code>
                      </div>
                    </div>

                    {/* publish state */}
                    <span style={{ opacity: 0.85 }}>
                      {p.published ? "✅ Published" : "📝 Draft"}
                    </span>
                  </div>

                  {/* actions */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <Link href={`/admin/products/edit/${p.id}`}>Edit</Link>

                    <form action={toggleProductPublished}>
                      <input type="hidden" name="id" value={p.id} />
                      <input
                        type="hidden"
                        name="published"
                        value={String(p.published)}
                      />
                      <button type="submit">
                        {p.published ? "Hide" : "Show"}
                      </button>
                    </form>

                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        style={{ color: "#ff6b6b", fontWeight: 700 }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
