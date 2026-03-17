// app/(admin)/admin/products/page.tsx
import AdminProductsClient from "./AdminProductsClient";
import { getAdminProducts } from "@/lib/db/product";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const page = Number(params.page) || 1;
  const LIMIT = 12;

  // result = { data, total, page, limit }
  const result = await getAdminProducts(page, LIMIT, q);

  return (
    <AdminProductsClient
      products={result.data}
      total={result.total}
      q={q}
      page={page}
    />
  );
}