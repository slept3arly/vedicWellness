// app/(admin)/admin/products/page.tsx
import AdminProductsClient from "./AdminProductsClient";
import { getAdminProducts } from "@/lib/db/product";
import { Product } from "@prisma/client";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const page = Number(params.page) || 1;

  const products: Product[] = await getAdminProducts(page, 20, q);

  return (
    <AdminProductsClient
      products={products}
      q={q}
      page={page}
    />
  );
}