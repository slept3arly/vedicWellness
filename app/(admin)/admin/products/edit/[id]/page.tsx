import { getAdminProductById } from "@/lib/db/product";
import ProductEditForm from "./ProductEditForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getAdminProductById(id);

  if (!product) return notFound();

  return <ProductEditForm product={product} />;
}