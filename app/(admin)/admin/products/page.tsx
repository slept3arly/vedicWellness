import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { deleteProduct, toggleProductPublished } from "./serverActions";
import AdminCard from "../components/ui/AdminCard";
import AdminButton from "../components/ui/AdminButton";
import AdminBadge from "../components/ui/AdminBadge";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog
          </p>
        </div>

        <Link href="/admin/products/new">
          <AdminButton>+ Add Product</AdminButton>
        </Link>
      </div>

      {products.length === 0 && (
        <AdminCard className="text-center py-12 text-muted-foreground">
          No products yet.
        </AdminCard>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((p) => {
          const galleryCount = Array.isArray(p.gallery)
            ? p.gallery.length
            : 0;

          return (
            <AdminCard
              key={p.id}
              className="flex flex-col gap-4 hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-muted">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-lg leading-snug line-clamp-2">
                    {p.name}
                  </h2>

                  <AdminBadge
                    status={p.published ? "ACTIVE" : "INACTIVE"}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  /products/{p.slug}
                </p>

                <div className="flex flex-wrap gap-1 text-xs">

                  <Pill>₹ {p.price}</Pill>

                  {p.tag && <Pill>{p.tag}</Pill>}

                  {p.medicineForm && (
                    <Pill>{String(p.medicineForm).toLowerCase()}</Pill>
                  )}

                  <Pill>Gallery {galleryCount}</Pill>
                </div>

                <div className="text-xs text-muted-foreground">
                  Created {formatDate(p.createdAt)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">

                <Link href={`/admin/products/edit/${p.id}`}>
                  <AdminButton variant="secondary">
                    Edit
                  </AdminButton>
                </Link>

                <form action={toggleProductPublished}>
                  <input type="hidden" name="id" value={p.id} />
                  <input
                    type="hidden"
                    name="published"
                    value={String(p.published)}
                  />
                  <AdminButton variant="success">
                    {p.published ? "Hide" : "Show"}
                  </AdminButton>
                </form>

                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <AdminButton variant="danger">
                    Delete
                  </AdminButton>
                </form>

              </div>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}

/* ===== pill helper ===== */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
      {children}
    </span>
  );
}
