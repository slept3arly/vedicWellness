import AdminProductsClient from "./AdminProductsClient";
import { getAdminProducts } from "@/lib/db/product";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { MedicineForm } from "@prisma/client";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    status?: string;
    form?: string;
  }>;
}) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Number(params.page) || 1;
  const status =
    params.status === "ACTIVE" || params.status === "INACTIVE"
      ? params.status
      : "";
  const form = Object.values(MedicineForm).includes(params.form as MedicineForm)
    ? (params.form as MedicineForm)
    : "";

  const { data: products, total } = await getAdminProducts(
    page,
    ADMIN_PAGE_SIZE,
    q,
    {
      status,
      form,
    }
  );

  return (
    <AdminProductsClient
      products={products}
      total={total}
      q={q}
      page={page}
      status={status}
      form={form}
      formOptions={Object.values(MedicineForm)}
    />
  );
}
