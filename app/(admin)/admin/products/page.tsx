import AdminProductsClient from "./AdminProductsClient";
import { getAdminProducts } from "@/lib/db/product";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;

  const { data: products, total } = await getAdminProducts(
    page,
    ADMIN_PAGE_SIZE,
    q
  );

  return (
    <AdminProductsClient
      products={products}
      total={total}
      q={q}
      page={page}
    />
  );
}