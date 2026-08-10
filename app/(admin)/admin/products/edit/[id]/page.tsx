import { getAdminProductById } from "@/lib/db/product";
import ProductEditForm from "./ProductEditForm";
import { notFound } from "next/navigation";
import { getActiveCompanies } from "@/lib/db/company";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getAdminProductById(id);

  if (!product) return notFound();

  const activeCompanies = await getActiveCompanies();
  const companies = product.company && !product.company.active
    ? [product.company, ...activeCompanies]
    : activeCompanies;

  return <ProductEditForm product={product} companies={companies} />;
}
