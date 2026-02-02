// app/admin/products/page.tsx
import AdminProductsClient from "./AdminProductsClient";
import { getAdminProducts } from "@/lib/db/product";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  // 1. Await searchParams for Next.js 15 compatibility
  const params = await searchParams;
  const q = params.q || "";
  const page = Number(params.page) || 1;

  // 2. Fetch data based on the URL params
  const products = await getAdminProducts(page, 20, q);

  return (
    <AdminProductsClient
      // 3. key forces a clean UI refresh when params change
      products={products}
      q={q}
      page={page}
    />
  );
}